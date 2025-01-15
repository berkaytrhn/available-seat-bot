import { Grid2 as Grid} from "@mui/material";
import { ReactNode } from "react";
import React from "react";

interface MainViewProps{
    children ?: ReactNode;
}

const MainView=(props: MainViewProps)=>{
    return(
        <Grid container>
            <Grid size={12}>
                <h4 style={{color: "red"}}>Scheduling Ticket Search View!!</h4>
            </Grid>
        </Grid>
    );
}

export default MainView;
