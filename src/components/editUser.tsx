import React, { useState } from 'react';
import { TextField, Typography, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { genderOptions, IRMCharacter, speciesOptions, statusOptions } from '../views/UserListing';

interface IEditUserProps {
  userData: Partial<IRMCharacter>
  onUpdateClicked: (userData: Partial<IRMCharacter>) => string | void
}


const SelectInput = ({title, value, options, onChange}) => {
  return <>
    <InputLabel id="demo-simple-select-standard-label">{ title }</InputLabel>
    <Select
      // labelId="demo-simple-select-label"
      // id="demo-simple-select"
      value={value}
      // label={title}
      onChange={onChange}
    >
      <MenuItem value={null}>(none)</MenuItem>
      {
        options.map(o => 
          <MenuItem value={o}>{o}</MenuItem>
        )
      }
      {/* <MenuItem value={10}>Ten</MenuItem>
      <MenuItem value={20}>Twenty</MenuItem>
      <MenuItem value={30}>Thirty</MenuItem> */}
    </Select>
  </>;
}


export default function EditUser({userData, onUpdateClicked}: IEditUserProps){
  const [name, setName] = useState(userData && userData.name);
  const [species, setSpecies] = useState(userData && userData.species);
  const [gender, setGender] = useState(userData && userData.gender);
  const [status, setStatus] = useState(userData && userData.status);
  const [image, setImage] = useState(userData && userData.image);

  const getUpdatedData = () => {
    return {
      ...userData,
      name,
      species,
      gender,
      status,
      image
    }
  };

  const isValid = name && species && gender && status && image;


  return <div>
      <Typography variant="h6">
        {userData.id ? "Edit User" : "Add User"}
      </Typography>
      <p/>
      <TextField
        required
        id="outlined-required"
        label="Name"
        defaultValue={name}
        onChange={(e) => e && e.target && setName(e.target.value)}
      />
      <p/>
      {/* <TextField
        required
        id="outlined-required"
        label="Species"
        defaultValue={species}
        onChange={(e) => e && e.target && setSpecies(e.target.value)}
      /> */}
      <SelectInput
        title="Species"
        value={species}
        options = {speciesOptions}
        onChange={(e) => e && e.target && setSpecies(e.target.value)}
      />
      <p/>
      {/* <TextField
        required
        id="outlined-required"
        label="Gender"
        defaultValue={gender}
        onChange={(e) => e && e.target && setGender(e.target.value)}
      /> */}
      <SelectInput
        title="Gender"
        value={gender}
        options = {genderOptions}
        onChange={(e) => e && e.target && setGender(e.target.value)}
      />
      <p/>
      {/* <TextField
        required
        id="outlined-required"
        label="Status"
        defaultValue={status}
        onChange={(e) => e && e.target && setStatus(e.target.value)}
      /> */}
      <SelectInput
        title="Status"
        value={status}
        options = {statusOptions}
        onChange={(e) => e && e.target && setStatus(e.target.value)}
      />
      <p/>
      <TextField
        required
        id="outlined-required"
        label="Image Url"
        defaultValue={image}
        onChange={(e) => e && e.target && setImage(e.target.value)}
      />
      <p/>
      <Button
        disabled= {!isValid}
        variant="contained"
        onClick={() => onUpdateClicked && onUpdateClicked(getUpdatedData())}
      >Update</Button>
    </div>;
}


