import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { gql, useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import { 
  Card,
  Box,
  CardContent,
  Typography,
  CardMedia,
  Skeleton
} from '@mui/material';
import { LeftPanelLayout } from '../components/mainLayout';
import { useLocalStore } from '../utils/localStore';

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const GET_CHARACTER_BY_ID = gql`
  query character($id: ID!) {
    character(id: $id) {
      id
      name
      image
      species
      gender
      type
      status
      origin{
        dimension
        name
        type
      }
    }
  }
`

const detailsKeys = [
  {text:"species", key:"species"},
  {text:"gender", key:"gender"},
  // {text:"type", key:"type"},
  {text:"status", key:"status"},
];


function useGetUserQueryWithLocalStore(gqlQuery, args){
  // const [localData, setLocalData] = useState(null);
  const localStore = useLocalStore();
  const id = args && args.variables && args.variables.id;
  
  const localChars = localStore.cachedCharacters.get();
  if(id && localChars && localChars[id]){
    console.log("got local char?", localChars[id]);
    return {loading: null, error: null, data: { character: localChars[id] }};
  }
  return useQuery(gqlQuery, args);
}



export const Profile: React.FC = () => {
  let params = useParams();
  const id = params && params.id;
  // const { loading, error, data } = useQuery(GET_CHARACTER_BY_ID, {variables:{id}}); 
  const { loading, error, data } = useGetUserQueryWithLocalStore(GET_CHARACTER_BY_ID, {variables:{id}}); 

  
  console.log("params..", params, id);
  const character = data && data.character;
  console.log("character..", character, data);
  
  const navigate = useNavigate();
  const fn = async() => {navigate("/users")}

  // return <div>Profile { id }</div>
  let isLoading = true;

  if(error) return <>Error....</>;

  return <LeftPanelLayout
    mainPageContents={
      <Card sx={{ display: 'flex' }} style={{width:"100%"}}>
      { 
          loading ?
          <Skeleton animation="wave"  variant="rectangular" width={150} height={150} />
          : <CardMedia
            component="img"
            sx={{ width: 250 }}
            image={character.image}
            alt="Live from space album cover"
          />
        }
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flex: '1 0 auto' }}>
            {
              loading ? 
              <div style={{ width:"300px" }}>
                <Skeleton animation="wave" height={14} style={{ marginBottom: 6 }} />
                <Skeleton animation="wave" height={14} width="80%" />
              </div>
              :<>
                <Typography component="div" variant="h5">
                  { character.name }
                </Typography>
                {/* <Typography variant="subtitle1" color="text.secondary" component="div">
                  Mac Miller
                </Typography> */}
                {
                  detailsKeys.map(({text, key}) => 
                    <>
                      <Typography variant="caption" color="text.secondary">
                        {text} 
                      </Typography>
                      <br/>
                      <Typography variant="subtitle1" color="text.secondary" style={{ lineHeight:0.8, marginBottom: "8px" }}>
                        { character[key] }
                      </Typography>
                    </>
                  )
                }
              </>
            }
          </CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
            {/* <IconButton aria-label="previous">
              {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
            </IconButton>
            <IconButton aria-label="play/pause">
              <PlayArrowIcon sx={{ height: 38, width: 38 }} />
            </IconButton>
            <IconButton aria-label="next">
              {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
            </IconButton> */}
          </Box>
        </Box>

      </Card>
    }
  />


  return <div>
    <h1>Profile? { params.id }</h1>
    
  </div>;
};