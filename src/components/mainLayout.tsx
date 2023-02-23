import styled from '@emotion/styled';
import NavBar from "./navBar";
import React, { ReactNode } from 'react';

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 70px);
  display: flex;
  flex-direction: row;
  background: #eee;
  padding: 20px 0px;
`;

const LeftPageContainer = styled.div`
  width: 40%;
  min-width: 300px;
  height: 100%;
  display: flex;
  background: yellow;
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
}

export function LeftPanelLayout({ leftPageContents, mainPageContents }: ILeftPanelLayoutProps){
  return <>
    <MainContainer>
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