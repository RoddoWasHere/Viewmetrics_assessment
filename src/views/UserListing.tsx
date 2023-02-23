import { LeftPanelLayout } from "../components/mainLayout";
import { gql, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import UserCard from "../components/userCard";
import styled from '@emotion/styled';
import { Pagination, Stack } from '@mui/material';

const UserListingContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const UserCardContainer = styled.div`
  padding: 0px 12px 24px 12px;
`;

const GET_CHARACTERS = gql`
  query characters($page: Int) {
    characters(page: $page) {
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
      }
    }
  }
`

styled

export default function UserListing(){
  
  
  const params = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(params && params.pageNumber && parseInt(params.pageNumber) || 1);
  const { loading, error, data, refetch } = useQuery(GET_CHARACTERS, {variables:{page:currentPage}}); 

  console.log("params", params);
  console.log("data", data);

  const onPageChange = (event: any, pageNumber: number) => {
    navigate(`page/${pageNumber}`)
    setCurrentPage(pageNumber);
  };

  const characters = data && data.characters && data.characters.results;
  const resultInfo = data && data.characters && data.characters.info;
  const pageCount = resultInfo && resultInfo.pages;

  return <LeftPanelLayout
      // leftPageContents={<div>none</div>}
      mainPageContents={
        characters && characters.length > 0 &&
        <div>
          <UserListingContainer>
            {
              characters.map(c => 
                <UserCardContainer>
                  <UserCard key={c.id} userId={c.id} name={c.name} imageUrl={c.image} />
                </UserCardContainer>
              )
            }
          </UserListingContainer>
          <Stack spacing={2}>
            <Pagination defaultPage={currentPage} count={pageCount} onChange={onPageChange}/>
          </Stack>
        </div>
      }
    />;
}