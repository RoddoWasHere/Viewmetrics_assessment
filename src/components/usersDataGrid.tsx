import * as React from 'react';
import { Box, CardMedia, Typography, Button } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams, GridRenderCellParams } from '@mui/x-data-grid';
import styled from '@emotion/styled';
import { Link } from "react-router-dom";

const CustomDataGrid = styled(DataGrid)`
    & .MuiDataGrid-footerContainer{
        background: yellow;
        display: none;
    }
`;
// MuiDataGrid-footerContainer

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
    width: 250,
    editable: false,
    renderCell: (params: GridRenderCellParams<String>) => {
      return <Link to={`/user/${params.row.id}`}>
        {/* <Typography> */}
          {/* <Button> */}
            {params.value}
          {/* </Button> */}
          {/* </Typography> */}
        </Link>

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
];

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

export default function UsersDataGrid({ usersData }) {
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