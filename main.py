from selenium import webdriver
from selenium.webdriver.edge.service import Service
from selenium.webdriver.edge.options import Options
from selenium.common.exceptions import TimeoutException

from config import Config
from ticket_controller import TicketController
import logging


def main():
    cfg = Config("config.yaml").config
    
    service = Service(cfg["general"]["driver_path"])
    
    options = Options()
    options.add_argument("--start-maximized")
    # options.add_argument('--headless')  # Ensure Chrome runs in headless mode
    # options.add_argument('--disable-gpu')  # Disable GPU hardware acceleration (sometimes helps with issues)
    # options.add_argument('--no-sandbox')  # Disables the sandboxing feature, which can help in some environments
    
    driver = webdriver.Edge(service=service, options=options)
    
    controller = TicketController(driver, cfg)
    
    controller.perform_available_seat_control()
    
    
if __name__ == "__main__":
    
    # Set up basic configuration
    logging.basicConfig(level=logging.INFO)
    try:
        main()
    except TimeoutException:
        # try again
        main()

