import { Typography } from "@mui/material"
import React from "react"
import { PaperCustom } from "../components/customComponents"
import { LeftPanelLayout } from "../components/mainLayout"

export default function Home(){
    return <LeftPanelLayout
        pageTitle="Home"
        mainPageContents={
            <PaperCustom>
                <Typography variant="h6">
                    Welcome
                </Typography>
                <p/>
                <Typography variant="body2">
                    Use the top navigation to explore. You can also access the site settings from the icon in the top right corner.<br/>Enjoy! 
                    <p/>
                    <p/>
                </Typography>
            </PaperCustom>
        }
    />
}