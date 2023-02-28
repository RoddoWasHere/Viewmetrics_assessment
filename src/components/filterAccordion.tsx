import React, { ReactNode, useState } from 'react';
import { 
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Radio,
    RadioGroup,
    FormControlLabel,
    useTheme
  } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styled from '@emotion/styled';
import { ButtonCustom } from './customComponents';

  
export const AccordionSummaryCustom = styled(AccordionSummary)`
  margin: 0px 0px;
  padding: 0px 16px;
  min-height: 0px !important;
  border-top: 1px solid rgba(0, 0, 0, .125);
  border-bottom: 1px solid rgba(0, 0, 0, .125);
  & .Mui-expanded{
  margin: 12px 0px !important;
  min-height: 0px;  
  }
`;

const AccordionCustom = styled(Accordion)`
  min-height: 0px;
  & .Mui-expanded{

  }
`;

const FormControlLabelCustom = styled(FormControlLabel)`
  height: 28px;
`;

const ExpanderDiv = styled.div`
  width: 100%;
  height: 100%
`;

interface IFilterAccordianProps {
  title: string
  children: ReactNode
  onClear: () => void
  showClear: boolean
}

export default function FilterAccordian({title, children, onClear, showClear}: IFilterAccordianProps){
  const [isExpanded, setIsExpanded] = useState(true);

  return<AccordionCustom defaultExpanded={true} expanded={isExpanded} disableGutters={true}>
    <AccordionSummaryCustom
      style={{ borderBottom: '1px solid rgba(0, 0, 0, .125)'}}
      expandIcon={<ExpandMoreIcon onClick={() => setIsExpanded(!isExpanded)}/>}
      aria-controls="panel1a-content"
      id="panel1a-header"
    >
      <Typography>{title}</Typography>
      <ExpanderDiv/>
      {showClear && <ButtonCustom onClick={onClear} style={{padding:0}}>Clear</ButtonCustom>}
    </AccordionSummaryCustom>
    <AccordionDetails>
      { children}
    </AccordionDetails>
  </AccordionCustom>;
}

interface IRadioFilterAccordianProps {
  title: string
  options: string[]
  onSetValue: (value: string) => void
}

export function RadioFilterAccordian({title, options, onSetValue}: IRadioFilterAccordianProps){
  const [value, setValueAux] = useState('');
  const theme = useTheme();

  const setValue = (value: string) => {
    onSetValue && onSetValue(value);
    setValueAux(value);
  };

  return <FilterAccordian title={title} showClear={value!=''} onClear={()=>{setValue('')}}>
      <RadioGroup
        onChange={(e,v) => setValue(v)}
        aria-labelledby="demo-radio-buttons-group-label"
        name="radio-buttons-group"
        value={value}
      >
        {
          options.map(s => <FormControlLabelCustom value={s} control={<Radio style={{color: theme?.palette?.text?.primary}}/>} label={s} />)
        }

      </RadioGroup>
    </FilterAccordian>
  ;
}