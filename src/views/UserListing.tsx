import { LeftPanelLayout } from "../components/mainLayout";
import { gql, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import UserCard, { UserCardSkelton } from "../components/userCard";
import styled from '@emotion/styled';
import { 
  Pagination,
  Stack,
  Typography,
  FormControlLabel,
  Button,
  Card,
  Paper,
  Link,
  useTheme,
  Input,
  TextField
} from '@mui/material';
import { AccordionSummaryCustom, RadioFilterAccordian } from "../components/filterAccordion";
import ListIcon from '@mui/icons-material/List';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import UsersDataGrid from "../components/usersDataGrid";
import { ILookup, useLocalStore } from "../utils/localStore";
import EditUser from "../components/editUser";
import ModalBasic from "../components/modalBasic";
import AddIcon from '@mui/icons-material/Add';
import { IconButtonCustom } from "../components/customComponents";

const CardCustom = styled(Card)`
  height: 100%;
  width: 100%;
  margin-bottom: 12px;
`;

export const ExpanderDiv = styled.div`
  height: 100%;
  width: 100%;
`;

export const ExpanderSpan = styled.span`
  height: 100%;
  width: 100%;
`;

const UserListingContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0px -12px;
  width: 100%;
`;

const UserCardContainer = styled.div`
  padding: 0px 12px 24px 12px;
`;

// const FormControlLabelCustom =  styled(FormControlLabel)`
//   height: 28px;
// `;

const FiltersContainer =  styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const GET_CHARACTERS = gql`
  query characters($page: Int, $filter: FilterCharacter) {
    characters(page: $page, filter: $filter) {
      results {
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
      info {
        pages
        count
      }
    }
  }
`;

export const speciesOptions = [
  "Alien",
  "Animal",
  "Cronenberg",
  "Disease",
  "Human",
  "Humanoid",
  "Mythological Creature",
  "Poopybutthole",
  "Robot",
  "unknown",
];

export const genderOptions = [
  "Male",
  "Female",
  "Genderless",
  "unknown",
];

export const statusOptions = [
  "Dead",
  "Alive",
  "unknown",
];

interface IFilterParams {
  name: string
  species: string
  gender: string
  status: string
}

const defaultFilters: IFilterParams = {
  name: '',
  species: '',
  gender: '',
  status: '',
}

const IconButtonSquare = styled(IconButtonCustom)`
  border-radius: 5px;
  padding: 5px;
`

interface IListingTypeToggleProps {
  useList: boolean
  setUseList: (useList: boolean) => void
}

function ListingTypeToggle({useList, setUseList}: IListingTypeToggleProps){
  const theme = useTheme();
  const selectedColor = theme.palette.primary.main;

  return <>
    <IconButtonSquare contrast title="List view" onClick={()=>setUseList(true)} aria-label="list" style={!useList ? {} : {background: selectedColor}}>
      <ListIcon />
    </IconButtonSquare>
    <IconButtonSquare contrast title="Cards view" onClick={()=>setUseList(false)} aria-label="cards" style={useList ? {} : {background: selectedColor}}>
      <ViewModuleIcon />
    </IconButtonSquare>
  </>
}

export interface IRMCharacter {
  id: string
  name: string
  image: string
  species: string
  gender: string
  type: string
  status: string

  isDeleted?: boolean
}
 
const resultsPerPage = 20;

const uuid = () => {
  var ms = (new Date()).getTime();
  return ms;
}

const filterLocal = (char: IRMCharacter, filterParams: IFilterParams) => {
  for(const key of Object.keys(filterParams)){
    const query = filterParams[key];
    if(!query || query === '') continue;
    if(char[key] && char[key] != query){
      return false;
    }
  }
  return true;
};

export default function UserListing(){
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IRMCharacter | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const localStore = useLocalStore();
  const [useList, setUseListAux] = useState(localStore.appSettings.get().useList);
  const [filters, setFilters ] = useState<IFilterParams>(defaultFilters);
  const params = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(params && params.pageNumber && parseInt(params.pageNumber) || 1);
  const { loading, error, data, refetch } = useQuery(GET_CHARACTERS, {variables:{page:currentPage, filter: filters}}); 

  const setUseList = (value: boolean) => {
    const cp = localStore.appSettings.get();
    cp.useList = value;
    localStore.appSettings.set(cp);
    setUseListAux(value);
  };

  const onPageChange = (event: any, pageNumber: number) => {
    navigate(`page/${pageNumber}`)
    setCurrentPage(pageNumber);
  };

  const charactersTp = data && data.characters && data.characters.results;
  const resultInfo = data && data.characters && data.characters.info;
  const pageCount = resultInfo && resultInfo.pages;
  const charactersCp = charactersTp && charactersTp.map(c => ({...c}));

  const characters: IRMCharacter[] = [];

  if(charactersCp){//retrieve/store charachers
    const cp = localStore.cachedCharacters.get();
    const newCharactersList = []; 
    const addedLookup: ILookup<any> = {};

    charactersCp.forEach((c: IRMCharacter, i: number) => {
      if(cp[c.id]){//replace
        charactersCp[i] = cp[c.id];
      }else{//cache
        cp[c.id] = charactersCp[i];
      }

      addedLookup[c.id] = cp;

      if(!cp[c.id]?.isDeleted){ //ignore deleted
        characters.push(charactersCp[i]);
      }
    });
    Object.keys(cp).forEach((key: string, i: number) => {
      const char = cp[key];
      if(!addedLookup[char.id] && characters.length < resultsPerPage){//add
        if(char.id.indexOf("local") == 0 && !char.isDeleted && filterLocal(char, filters)){
          //add new local stored chars if last page
          characters.push(char);
          addedLookup[char.id] = char;
        }
      }
    });
    localStore.cachedCharacters.set(cp);
  }

  const updateCachedCharacter = (d: IRMCharacter) => {
    const cp = localStore.cachedCharacters.get();
    const curCharacter = d && d.id && cp[d.id];///????
    //TODO: handle add
    if(curCharacter){
      const updatedCharacter = {...curCharacter,...d};
      cp[d.id] = updatedCharacter;
      localStore.cachedCharacters.set(cp);
    }else {
      const newCharacter = d;
      cp[d.id] = newCharacter;
      localStore.cachedCharacters.set(cp);
    }
  };


  const setFiltersKey = (key: string, value: string) => {
    if(filters[key] != null){
      const cp = {...filters};
      cp[key] = value;
      setFilters(cp);
      onPageChange(null, 1); //go to page 1 when a filter changes
      return cp;
    }
    return null;
  };

  const showConfirmModal = () => {
    setIsConfirmModalOpen(true);
  };

  
  const deleteUser = () => {
    if(selectedUser){
      selectedUser.isDeleted = true;

      updateCachedCharacter(selectedUser);
    }
  };

  const hasLoaded = !loading;

  return <>
    {/* Confirm delete modal */}
    <ModalBasic
      isOpen={isConfirmModalOpen}
      setIsOpen={setIsConfirmModalOpen}
    >
      <div style={{}}>
        <Typography>
          Are you sure you want to delete this user?
        </Typography>
        <p/>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button variant="contained" onClick={()=>setIsConfirmModalOpen(false)}>Cancel</Button>
          <div style={{ width: "10px" }}></div>
          <Button variant="contained" onClick={()=>{ deleteUser(); setIsConfirmModalOpen(false);}}>OK</Button>
        </div>
      </div>
    </ModalBasic>
    <ModalBasic
      isOpen={isEditModalOpen}
      setIsOpen={setIsEditModalOpen}
    >
      <>
        <EditUser
          userData={selectedUser}
          onUpdateClicked={(d)=>{
            console.log("updated data?", d);
            if(!d.id){//add new
              d.id = `local_${uuid()}`;
            }
            console.log("got new char?", d);
            updateCachedCharacter(d);
            //TODO: check for success...
            setIsEditModalOpen(false);
          }}
        />
      </>
    </ModalBasic>
    <LeftPanelLayout
      pageTitle="Users"
      leftPageContents={
        <FiltersContainer>
          <Paper>
            <AccordionSummaryCustom>
              <Typography><b>Filters</b></Typography>
            </AccordionSummaryCustom>
          </Paper>
          <RadioFilterAccordian
            title="Species"
            options={speciesOptions}
            onSetValue={(v)=> setFiltersKey('species', v)}
          />
          <RadioFilterAccordian
            title="Gender"
            options={genderOptions}
            onSetValue={(v)=> setFiltersKey('gender', v)}
          />
          <RadioFilterAccordian
            title="Status"
            options={statusOptions}
            onSetValue={(v)=> setFiltersKey('status', v)}
          />
        </FiltersContainer>
      }
      mainPageContents={
        <div style={{ width: "100%" }}>
          {/* info top: */}
          <Paper elevation={0} style={{  marginBottom: "12px", width: "unset", background: "none" }}>
            <TextField variant="outlined" fullWidth label="seach by name" onChange={(e) => {e.target && setFiltersKey("name", e.target.value)}}/>
            <Typography>
            { hasLoaded && `${resultInfo?.count} results`}
            </Typography>
            <div style={{ display: "flex" }}>
              <ListingTypeToggle useList={useList} setUseList={setUseList}/>
              <ExpanderSpan/>
              <Button variant="contained" onClick={() => {setSelectedUser({}); setIsEditModalOpen(true);}}>
                <AddIcon/>
                Add
              </Button>
            </div>
          </Paper>
          {/* listings: */}
          <UserListingContainer style={{ margin: useList ? "0" : "0px -12px" }}>
            {
              useList
              ? (<CardCustom>
                  <UsersDataGrid 
                    usersData={hasLoaded ? characters : [{id: 0, name:"Loading..."}]} 
                    onEdit={(char)=>{setSelectedUser(char); setIsEditModalOpen(true)}}
                    onDelete={(char)=>{setSelectedUser(char); setIsConfirmModalOpen(true)}}
                  />
                </CardCustom>)
              : ( 
                hasLoaded
                ? characters.map(c => 
                  <UserCardContainer key={c.id}>
                    <UserCard
                      key={c.id}
                      userData={c}
                      onEditClick={() => {setSelectedUser(c); setIsEditModalOpen(true);}}
                      onDeleteClick={() => {setSelectedUser(c); showConfirmModal();}}
                    />
                  </UserCardContainer>)
                
                :["","","","","","",].map((s, i) => 
                  <UserCardContainer key={i}>
                    <UserCardSkelton/>
                  </UserCardContainer>
                )
              )
            }
            <Paper style={{ width:"100%" }}>
              <Stack spacing={2}>
                <Pagination page={currentPage} count={pageCount || 1} onChange={onPageChange}/>
              </Stack>
            </Paper>
          </UserListingContainer>

        </div>
      }
    />
  </>;
}