import styled from "@emotion/styled";
import { Button, FormControl, InputLabel, MenuItem, Paper, Select, Stack, Theme, Typography } from "@mui/material"
import React, { useState } from "react"
import { useNavigate } from "react-router";
import { LeftPanelLayout } from "../components/mainLayout"
import { defaultTheme, rickNMortyTheme } from "../providers/themeProvider";
import { clearLocalStore, ThemeName, useLocalStore } from "../utils/localStore";
import { ExpanderDiv } from "./UserListing";

const SettingsContainer =  styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  minHeight: 60%;
`;


const PaperSettingsContainer =  styled(Paper)`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px
`;

// const themes = {
//   "default": defaultTheme,
//   "rickNMorty": rickNMortyTheme,
// };

interface SelectOption<T> {
  text: string
  value: T
}

interface ISelectCustomProps<T> {
  title: string
  defaultValue: T
  options: SelectOption<T>[]
  onChange?: (value: T) => void
}

function SelectCustom<T>({ title, defaultValue, options, onChange }: ISelectCustomProps<T>){
  return <FormControl style={{ width: "250px" }}>
    <InputLabel id="demo-simple-select-label">{title}</InputLabel>
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      defaultValue={defaultValue}
      label={title}
      onChange={(e) => onChange && onChange(e.target.value as T)}
    >
      {
        options.map(o => 
          <MenuItem key={o.text} value={o.value}>{ o.text }</MenuItem>
        )
      }
    </Select>
  </FormControl>

}


enum ListingType {
  ListView = "ListView",
  CardsView = "CardsView",
}

export default function Settings(){
  const localStore = useLocalStore();
  const navigate = useNavigate();
  const currentThemeName = localStore.appSettings.get().themeName;
  const setTheme = (newTheme: ThemeName) => {
    const cp = localStore.appSettings.get();
    cp.themeName = newTheme;
    localStore.appSettings.set(cp);
  };
  const setListingType = (listingType: ListingType) => {
    const cp = localStore.appSettings.get();
    cp.useList = listingType == ListingType.ListView;
    localStore.appSettings.set(cp);
  };

  return <LeftPanelLayout
      pageTitle="Settings"
      mainPageContents={
        <SettingsContainer>
          <PaperSettingsContainer>
            <p/>
            <SelectCustom<ThemeName> 
              title="Theme"
              defaultValue={currentThemeName}
              options={[
                {text: "default", value: ThemeName.default},
                {text: "Rick & Morty", value: ThemeName.rickNMorty},
              ]}
              onChange={(v) => {setTheme(v)}}
            />
            <p/>
            <SelectCustom<ListingType> 
              title="Listing view"
              defaultValue={ListingType.ListView}
              options={[
                {text: "List view", value: ListingType.ListView},
                {text: "Cards view", value: ListingType.CardsView},
              ]}
              onChange={(v) => {setListingType(v)}}
            />
            <p/>
            <Button variant="contained"
              onClick={()=> {clearLocalStore(); navigate(0)}}
            >
              Clear local store
            </Button>
            <ExpanderDiv/>
          </PaperSettingsContainer>
        </SettingsContainer>
      }
  />
}