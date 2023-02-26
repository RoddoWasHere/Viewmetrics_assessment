import { LeftPanelLayout } from "../components/mainLayout";
import { gql, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import UserCard from "../components/userCard";
import styled from '@emotion/styled';
import { 
  Pagination,
  Stack,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  AccordionSummary,
  IconButton,
  Button,
  Card,
  Paper,
  Link,
  Breadcrumbs,
  Modal
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterAccordian, { AccordionSummaryCustom, RadioFilterAccordian } from "../components/filterAccordion";
import ListIcon from '@mui/icons-material/List';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import { Users } from "../Users";
import UsersDataGrid from "../components/usersDataGrid";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useLocalStore } from "../utils/localStore";
import EditUser from "../components/editUser";
import ModalBasic from "../components/modalBasic";
import AddIcon from '@mui/icons-material/Add';

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

const FormControlLabelCustom =  styled(FormControlLabel)`
  height: 28px;
`;

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

function getFilters(){

}

interface IFilterParams {
  species: string
  gender: string
  status: string
}

const defaultFilters: IFilterParams = {
  species: '',
  gender: '',
  status: '',
}

const IconButtonCustom = styled(IconButton)`
  border-radius: 5px;
  padding: 5px;
`

function ListingTypeToggle({useList, setUseList}){
  
  return <>
    <IconButtonCustom title="List view" onClick={()=>setUseList(true)} aria-label="list" variant="contained" style={!useList ? {} : {background: '#ccc'}}>
      <ListIcon />
    </IconButtonCustom>
    <IconButtonCustom  title="Cards view" onClick={()=>setUseList(false)} aria-label="cards" variant="contained" style={useList ? {} : {background: '#ccc'}}>
      <ViewModuleIcon />
    </IconButtonCustom>
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

  console.log("params", params);
  console.log("data", data);

  const onPageChange = (event: any, pageNumber: number) => {
    navigate(`page/${pageNumber}`)
    setCurrentPage(pageNumber);
  };

  const charactersTp = data && data.characters && data.characters.results;
  const resultInfo = data && data.characters && data.characters.info;
  const pageCount = resultInfo && resultInfo.pages;
  const characters = charactersTp && charactersTp.map(c => ({...c}));
  // window.debug = characters;

  if(characters){//retrieve/store charachers
    const cp = localStore.cachedCharacters.get();
    window.debug = cp;
    console.log("cached chars", cp)
    characters.forEach((c: IRMCharacter, i: number) => {
      if(cp[c.id]){//replace
        characters[i] = cp[c.id];
      }else{//cache
        cp[c.id] = characters[i];
      }
    });
    Object.keys(cp).forEach((key: string, i: number) => {
      const char = cp[key];
      if(!characters[char.id]){//add
        //testing
        if(char.id.indexOf("local") == 0 && characters.length < resultsPerPage && filterLocal(char, filters)){
          //add new local stored chars if last page
          console.log("got local char", char);
          characters.push(char);
        }
      }
      // }else{//cache
      //   cp[c.id] = characters[i];
      // }
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
  
  const handleClick = () => {};

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/" onClick={handleClick}>
      MUI
    </Link>,
    <Link
      underline="hover"
      key="2"
      color="inherit"
      href="/material-ui/getting-started/installation/"
      onClick={handleClick}
    >
      Core
    </Link>,
    <Typography key="3" color="text.primary">
      Breadcrumb
    </Typography>,
  ];

  return <>
    <ModalBasic
      isOpen={isEditModalOpen}
      setIsOpen={setIsEditModalOpen}
    >
      <Paper>
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
      </Paper>
    </ModalBasic>
    <LeftPanelLayout
      leftPageContents={
        <FiltersContainer>
          <AccordionSummaryCustom style={{ background: "white" }}>
            <Typography><b>Filters</b></Typography>
          </AccordionSummaryCustom>
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
        characters && characters.length > 0 &&
        <div style={{ width: "100%" }}>
          <div style={{  marginBottom: "12px" }}>
            <Typography>
             {resultInfo.count} results
            </Typography>
            <div style={{ display: "flex" }}>
              <ListingTypeToggle useList={useList} setUseList={setUseList}/>
              {/* <Stack>
                <Breadcrumbs
                  separator={<NavigateNextIcon fontSize="small" />}
                  aria-label="breadcrumb"
                >
                  {breadcrumbs}
                </Breadcrumbs>
              </Stack> */}
              <ExpanderSpan/>
              <Button variant="contained" onClick={() => {setSelectedUser({});setIsEditModalOpen(true);}}>
                <AddIcon/>
                Add
              </Button>
            </div>
          </div>
          <UserListingContainer>
            {
              useList
              ? <CardCustom><UsersDataGrid usersData={characters}/></CardCustom>
              : characters.map(c => 
                <UserCardContainer>
                  <UserCard
                    key={c.id}
                    userData={c}
                    onEditClick={() => {setSelectedUser(c);setIsEditModalOpen(true);}}
                  />
                </UserCardContainer>
              )
             
            }
            <Paper style={{ width:"100%" }}>
              <Stack spacing={2}>
                <Pagination defaultPage={currentPage} count={pageCount} onChange={onPageChange}/>
              </Stack>
            </Paper>
          </UserListingContainer>

        </div>
          
      }
    />
  </>;
}