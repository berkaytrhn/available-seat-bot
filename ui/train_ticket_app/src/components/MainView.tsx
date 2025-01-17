import { FormControl, Grid2 as Grid, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { ReactNode, useState } from "react";
import React from "react";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from "dayjs";


import advancedFormat from "dayjs/plugin/advancedFormat";
dayjs.extend(advancedFormat);

interface MainViewProps {
    children?: ReactNode;
}

const MainView = (props: MainViewProps) => {


    const [locationValue, setLocationValue] = useState("");

    const [value, setValue] = useState<Dayjs | null>(dayjs()); // Use Dayjs type

    const locationList = [
        "Ankara GAR",
        "İstanbul (Söğütlüçeşme)",
        "İstanbul (Pendik)"
    ]

    const handleChange = (event: SelectChangeEvent) => {
        setLocationValue(event.target.value as string);
    };
    return (
        <Grid container>
            <Grid size={12}>
                <h4 style={{ color: "red" }}>Scheduling Ticket Search View!!</h4>
            </Grid>
            <Grid>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Trip Day"
                        value={value}
                        onChange={(newValue: Dayjs | null) => setValue(newValue)}
                        format="DD/MM/YYYY" // Set the format to dd/MM/yyyy
                        />
                </LocalizationProvider>
                <FormControl fullWidth>
                    <Select
                        fullWidth
                        value={locationValue}
                        onChange={handleChange}>
                        {locationList.map((element: string) => {
                            return <MenuItem key={`${element}_aa`} value={element}>{element}</MenuItem>
                        })}
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
    );
}

export default MainView;
