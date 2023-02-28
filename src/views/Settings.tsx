import styled from "@emotion/styled";
import { Button, Paper } from "@mui/material"
import React from "react"
import { useNavigate } from "react-router";
import { LeftPanelLayout } from "../components/mainLayout"
import SelectInputCustom from "../components/selectInputCustom";
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
            <SelectInputCustom<ThemeName> 
              title="Theme"
              defaultValue={currentThemeName}
              options={[
                {text: "default", value: ThemeName.default},
                {text: "Rick & Morty", value: ThemeName.rickNMorty},
              ]}
              onChange={(v) => {setTheme(v)}}
            />
            <p/>
            <SelectInputCustom<ListingType> 
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
