import React, { useState } from 'react';
import { TextField, Typography, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { genderOptions, IRMCharacter, speciesOptions, statusOptions } from '../views/UserListing';
import SelectInputCustom, { asSelectOptions } from './selectInputCustom';

interface IEditUserProps {
  userData: Partial<IRMCharacter>
  onUpdateClicked: (userData: Partial<IRMCharacter>) => string | void
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
    <SelectInputCustom<string>
      title="Species"
      value={species}
      options = {asSelectOptions(speciesOptions)}
      onChange={(v) => setSpecies(v)}
    />
    <p/>
    <SelectInputCustom<string>
      title="Gender"
      value={gender}
      options = {asSelectOptions(genderOptions)}
      onChange={(v) =>setGender(v)}
    />
    <p/>
    <SelectInputCustom<string>
      title="Status"
      value={status}
      options = {asSelectOptions(statusOptions)}
      onChange={(v) => setStatus(v)}
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


