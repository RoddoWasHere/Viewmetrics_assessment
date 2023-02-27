import styled from '@emotion/styled';
import NavBar from "./navBar";
import React, { ReactNode } from 'react';
import { Typography, useTheme } from '@mui/material';
import { PaperCustom } from './customComponents';

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 70px);
  display: flex;
  flex-direction: row;
  ${props => props.background ? `background: ${props.background};`:'background: #eee;'}
  padding: 20px 0px;
`;

const LeftPageContainer = styled.div`
  width: 30%;
  min-width: 250px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 0px 12px;
  @media only screen and (max-width: 800px) {
    &{
      display: none;
    }
  }
`;

const MainPageContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  /*background: red;*/
  padding: 0px 12px;
`;

interface IMainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: IMainLayoutProps){
    return <>
        <NavBar/>
        { children }
      </>;
}

interface ILeftPanelLayoutProps {
  leftPageContents?: ReactNode
  mainPageContents: ReactNode
  pageTitle?: string
}

export function LeftPanelLayout({ leftPageContents, mainPageContents, pageTitle }: ILeftPanelLayoutProps){
  const theme = useTheme();

  return <>
    { pageTitle &&
      <PaperCustom style={{ width: "unset" }}>
        <Typography variant="h4">{ pageTitle }</Typography>
      </PaperCustom>
    }
    <MainContainer background={theme.palette.background.default}>
      { leftPageContents && 
        <LeftPageContainer>
          { leftPageContents }
        </LeftPageContainer>
      }
      <MainPageContainer>
        { mainPageContents }
      </MainPageContainer>
    </MainContainer>
  </>;
}