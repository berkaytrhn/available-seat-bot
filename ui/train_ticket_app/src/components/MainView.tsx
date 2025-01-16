import { FormControl, Grid2 as Grid, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import { ReactNode, useState } from "react";
import React from "react";

interface MainViewProps{
    children ?: ReactNode;
}

const MainView=(props: MainViewProps)=>{


    const [locationValue, setLocationValue] = useState("");

    const locationList = [
        "Ankara GAR",
        "İstanbul (Söğütlüçeşme)",
        "İstanbul (Pendik)"
    ]

    const handleChange = (event: SelectChangeEvent) => {
        setLocationValue(event.target.value as string);
      };
    return(
        <Grid container>
            <Grid size={12}>
                <h4 style={{color: "red"}}>Scheduling Ticket Search View!!</h4>
            </Grid>
            <Grid>
                <input type="date"></input>
                <FormControl fullWidth>
                    <Select
                        fullWidth 
                        value={locationValue}
                        onChange={handleChange}>
                        {locationList.map((element: string)=>{
                            return <MenuItem key={`${element}_aa`} value={element}>{element}</MenuItem>
                        })}
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
    );
}

export default MainView;
