from selenium.webdriver.chromium.webdriver import ChromiumDriver
import random
from selenium.webdriver.common.action_chains import ActionChains
from dataclasses import dataclass, field
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from config import Config
from selenium.webdriver.remote.webelement import WebElement
import logging


@dataclass
class TicketController:
    driver: ChromiumDriver = field(default=None, init=True)
    config: ChromiumDriver = field(default=None, init=True)

    def __init__(self, driver: ChromiumDriver, config: Config) -> None:
        self.driver = driver
        self.config = config

    def random_click(
        self,
    ) -> None:
        window_width = self.driver.execute_script("return window.innerWidth;")

        window_height = self.driver.execute_script("return window.innerHeight;")

        # Generate random coordinates within the window's dimensions
        random_x = random.randint(0, window_width - 1)
        random_y = random.randint(0, window_height - 1)

        # Perform a click at the random coordinates
        actions = ActionChains(self.driver)
        actions.move_by_offset(random_x, random_y).click().perform()

        # Reset the mouse position to prevent further interactions from being offset
        actions.move_by_offset(-random_x, -random_y).perform()

    def get_element_by_id_with_timeout(self, element_id: str) -> WebElement:
        return WebDriverWait(
            self.driver, self.config["general"]["element_selection_timeout"]
        ).until(EC.presence_of_element_located((By.ID, element_id)))

    def fill_input_element_by_id(self, element_id: str, value: str) -> None:
        # throws TimeoutException if not present
        element: WebElement = self.get_element_by_id_with_timeout(element_id)
        element.clear()
        element.send_keys(value)

    def click_element_by_id(self, element_id: str) -> None:
        element: WebElement = self.get_element_by_id_with_timeout(element_id)
        element.click()

    def find_trip_list(self, element_id: str) -> list:
        element: WebElement = self.get_element_by_id_with_timeout(element_id)
        td_elements = element.find_elements(By.TAG_NAME, "td")
        for td_element in td_elements:
            print(td_element)
        
        td_texts = [td.text for td in td_elements]
        return td_texts
        
    def filter_trip_list(self, trip_list:list):
        # Get text with info of available seat
        text = self.config["utility"]["availability_text_helper_string"]
        filtered_trips = list(filter(lambda x: text in x.lower(), trip_list))
        filtered_trips = list(filter(self.process_seat_information, filtered_trips))
        return filtered_trips
    
    def process_seat_information(self, text:str):
        """
        if self.config["utility"]["disabled_passenger_indicator_string"] in text:
            pass
        """
        response = False
        text = text.split(self.config["utility"]["economy_class_indicator_string"])[-1]
        try:
            # ' (234 )'
            ticket_number = int(text[2:-1])
            if ticket_number != 0:
                response=True
        except:
            pass
        return response
    
    def perform_available_seat_control(self):
        self.driver.get(self.config["general"]["website_url"])
        
        website_information = self.config["website_information"]
        trip_information = self.config["trip_information"]
        
        # fill from info
        logging.info("Filling From Input...")
        self.fill_input_element_by_id(website_information["from_input_id"], trip_information["from"])
        
        # fill to info
        logging.info("Filling To Input...")
        self.fill_input_element_by_id(website_information["to_input_id"], trip_information["to"])
        
        # fill date info
        logging.info("Filling Date Input...")
        self.fill_input_element_by_id(website_information["date_input_id"], trip_information["date"])
        
        logging.info("Performing Random Click...")
        self.random_click()
        
        # click search button
        logging.info("Performing Search Click...")
        self.click_element_by_id(website_information["search_button_id"])
        
        logging.info("Finding List of Trips...")
        trip_list = self.find_trip_list(website_information["trip_table_id"])
        
        logging.info("Filtering trips...")
        trip_list_filtered = self.filter_trip_list(trip_list)
        
        # Send Mail For All Empty Seats
        logging.info(trip_list_filtered)