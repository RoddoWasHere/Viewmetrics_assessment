import * as React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

interface SelectOption<T> {
  text: string
  value: T
}

interface ISelectCustomProps<T> {
  title: string
  value?: T
  defaultValue?: T
  options: SelectOption<T>[]
  onChange?: (value: T) => void
}

export function asSelectOptions(arr: string[]){
  return arr.map(s => ({ text:s, value:s}));
}

export default function SelectInputCustom<T>({ title, value, defaultValue, options, onChange }: ISelectCustomProps<T>){
  return <FormControl style={{ width: "250px" }}>
    <InputLabel id="demo-simple-select-label">{title}</InputLabel>
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      defaultValue={defaultValue}
      value={value}
      label={title}
      onChange={(e) => onChange && e && e.target && onChange(e.target.value as T)}
    >
      {
        options.map(o => 
          <MenuItem key={o.text} value={o.value}>{ o.text }</MenuItem>
        )
      }
    </Select>
  </FormControl>  
}