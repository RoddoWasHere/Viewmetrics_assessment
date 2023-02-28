import * as React from 'react';
import { Box, CardMedia } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import styled from '@emotion/styled';
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

type IRMCEvent = (char: IRMCharacter) => void;

function getColumns(onEdit: IRMCEvent, onDelete: IRMCEvent){
  const columns: GridColDef[] = [
    {
      field: 'image',
      headerName: '',
      width: 80,
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
              {params.value}
          </LinkCustom>
      },
    },
    {
      field: 'species',
      headerName: 'Species',
      width: 150,
    },
    {
      field: 'gender',
      headerName: 'Gender',
      width: 110,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 110,
    },
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
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
      />
    </Box>
  );
}
