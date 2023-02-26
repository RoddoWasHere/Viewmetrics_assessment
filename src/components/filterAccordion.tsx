import React, { useState } from 'react';
import { 
    Pagination,
    Stack,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Button,
    Radio,
    RadioGroup,
    FormControlLabel
  } from '@mui/material';
  import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
  import styled from '@emotion/styled';

  
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


export default function FilterAccordian({title, children, onClear, showClear}){
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
      {showClear && <Button onClick={onClear} style={{padding:0}}>Clear</Button>}
    </AccordionSummaryCustom>
    <AccordionDetails>
      { children}
    </AccordionDetails>
  </AccordionCustom>;
}

export function RadioFilterAccordian({title, options, onSetValue}){
  const [value, setValueAux] = useState('');

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
          options.map(s => <FormControlLabelCustom value={s} control={<Radio/>} label={s} />)
        }

      </RadioGroup>
    </FilterAccordian>
  ;
}