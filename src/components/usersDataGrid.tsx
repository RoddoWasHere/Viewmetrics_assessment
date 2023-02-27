import * as React from 'react';
import { Box, CardMedia, Typography, Button } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams, GridRenderCellParams, GridRowParams, GridActionsCellItem } from '@mui/x-data-grid';
import styled from '@emotion/styled';
import { Link } from "react-router-dom";
import { IconButtonCustom, LinkCustom } from './customComponents';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IRMCharacter } from '../views/UserListing';

const CustomDataGrid = styled(DataGrid)`
    & .MuiDataGrid-footerContainer{
        background: yellow;
        display: none;
    }
`;
// MuiDataGrid-footerContainer

type IRMCEvent = (char: IRMCharacter) => void;

function getColumns(onEdit: IRMCEvent, onDelete: IRMCEvent){
  const columns: GridColDef[] = [
  //   { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'image',
      headerName: '',
      width: 80,
      // editable: true,
      renderCell: (params: GridRenderCellParams<String>) => {
        return <CardMedia
          component="img"
          height="80"
          src={params.value}
          alt={''}
        />
      },
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 150,
      editable:false,
      renderCell: (params: GridRenderCellParams<String>) => {
        return <LinkCustom to={`/user/${params.row.id}`}>
          {/* <Typography> */}
            {/* <Button> */}
              {params.value}
            {/* </Button> */}
            {/* </Typography> */}
          </LinkCustom>

        // return <CardMedia
        //   component="img"
        //   height="80"
        //   src={params.value}
        //   alt={''}
        // />
      },
    },
    {
      field: 'species',
      headerName: 'Species',
      width: 150,
      // editable: true,
    },
    {
      field: 'gender',
      headerName: 'Gender',
      width: 110,
      // editable: true,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 110,
      // editable: true,
    },
    // {
    //   field: 'image',
    //   headerName: 'Image',
    //   width: 110,
    //   editable: true,
    //   type: 'image'
    // },
  //   {
  //     field: 'fullName',
  //     headerName: 'Full name',
  //     description: 'This column has a value getter and is not sortable.',
  //     sortable: false,
  //     width: 160,
  //     valueGetter: (params: GridValueGetterParams) =>
  //       `${params.row.firstName || ''} ${params.row.lastName || ''}`,
  //   },
    {
      headerName: 'Actions',
      field: 'actions',
      type: 'actions',
      renderCell: (params: GridRenderCellParams<String>) => {
        return <>
          <IconButtonCustom aria-label="settings" title="edit" onClick={()=>{onEdit(params.row);}}>
            <EditIcon />
          </IconButtonCustom>
          <IconButtonCustom aria-label="settings" title="delete" onClick={()=>{onDelete(params.row);}}>
            <DeleteIcon />
          </IconButtonCustom>
        </>
      },
    },
  ];
  return columns;
}
{/* <IconButtonCustom aria-label="settings" title="edit" onClick={onEditClick}>
<EditIcon />
</IconButtonCustom>
<IconButtonCustom aria-label="settings" title="delete" onClick={onDeleteClick}>
<DeleteIcon />
</IconButtonCustom> */}


const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

interface IUsersDataGridProps {
  usersData: IRMCharacter[]
  onEdit: IRMCEvent
  onDelete: IRMCEvent
}

export default function UsersDataGrid({ usersData, onEdit, onDelete }: IUsersDataGridProps) {
  const columns = getColumns(onEdit, onDelete);

  return (
    <Box sx={{ height: '70vh', width: '100%' }}>
      <CustomDataGrid
        rows={usersData}
        columns={columns}
        // pageSize={5}
        // rowsPerPageOptions={[5]}
        // checkboxSelection
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
      />
    </Box>
  );
}