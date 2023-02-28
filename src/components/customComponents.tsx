import React from 'react';
import { Button, IconButton, Paper, useTheme } from "@mui/material";
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';

const LinkCustomStyled = styled(Link)`
  color: inherit;
  text-decoration: none;
  &:hover{
    font-weight: bold !important;
  }
`;

export const PaperCustom = styled(Paper)`
  padding: 10px 20px;
  width: 100%
`;

export function ButtonCustom(props: any){
  const theme = useTheme();
  const textColor = props?.contrast && props.variant!="contained" ? theme?.palette?.primary?.contrastText : theme?.palette?.text?.primary;
  return <Button
    {...props}
    style={{ color: textColor, ...props.style }}
  >
  </Button>;
}

export function IconButtonCustom(props: any){
  const theme = useTheme();
  const textColor = props?.contrast ? theme?.palette?.primary?.contrastText : theme?.palette?.text?.primary;
  return <IconButton
    style={{ color: textColor }} 
    {...props}
  >
  </IconButton>;
}

export function LinkCustom(props: any){
  const theme = useTheme();
  return <LinkCustomStyled 
    {...props}
  />;
}