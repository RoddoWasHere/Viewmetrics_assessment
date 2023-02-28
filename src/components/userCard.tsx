import * as React from 'react';
// import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Link } from "react-router-dom";
import { ExpanderDiv, ExpanderSpan, IRMCharacter } from '../views/UserListing';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import styled from '@emotion/styled';
import { IconButtonCustom } from './customComponents';
import { Skeleton } from '@mui/material';

const LinkCustom = styled(Link)`
  text-decoration: none;
  color: unset;
`;

interface IUserCardProps {
  userData: IRMCharacter
  onEditClick?: () => void
  onDeleteClick?: () => void
}

const detailsKeys = [
  {text:"species", key:"species"},
  // {text:"gender", key:"gender"},
  // {text:"type", key:"type"},
  // {text:"status", key:"status"},
];

export default function UserCard({ userData, onEditClick, onDeleteClick }: IUserCardProps) {
  const [expanded, setExpanded] = React.useState(false);
  const { id, name, image, species, gender, type, status } = userData;

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ maxWidth: 200 }}>

      <CardHeader
          title={
            <LinkCustom to={`/user/${id}`}>
              <Typography variant="button">{name}</Typography>
            </LinkCustom>
          }
          titleTypographyProps={{ style: { fontSize:"14px" } }}
      />
      <CardMedia
        component="img"
        height="220"
        image={ image }
        alt="Paella dish"
      />
      <CardContent>
        {
          detailsKeys.map(({text, key}) => 
            <>
              <Typography variant="caption" color="text.secondary">
                {text} 
              </Typography>
              <br/>
              <Typography variant="subtitle1" color="text.primary" style={{ lineHeight:0.8, marginBottom: "8px" }}>
                { userData[key] }
              </Typography>
            </>
          )
        }
        <div style={{ display: "flex" }}>
          <ExpanderSpan>&nbsp;</ExpanderSpan>
          <IconButtonCustom aria-label="settings" title="edit" onClick={onEditClick}>
            <EditIcon />
          </IconButtonCustom>
          <IconButtonCustom aria-label="settings" title="delete" onClick={onDeleteClick}>
            <DeleteIcon />
          </IconButtonCustom>
        </div>
      </CardContent>
    </Card>
  );
}

export function UserCardSkelton(){
  return (
    <Card sx={{ maxWidth: 200 }}>

      <Skeleton animation="wave" variant="rectangular" width={200} height={220} />
      <CardContent>
        {
          detailsKeys.map(({text, key}) => 
            <>
              <Skeleton
                animation="wave"
                height={10}
                width="80%"
                style={{ marginBottom: 6 }}
              />
              <br/>
              <Skeleton
                animation="wave"
                height={10}
                width="40%"
                style={{ marginBottom: 6 }}
              />
            </>
          )
        }
        <div style={{ display: "flex" }}>
          <ExpanderSpan>&nbsp;</ExpanderSpan>
          <IconButtonCustom aria-label="settings" title="edit" disabled>
            <EditIcon />
          </IconButtonCustom>
          <IconButtonCustom aria-label="settings" title="delete" disabled>
            <DeleteIcon />
          </IconButtonCustom>
        </div>
      </CardContent>
    </Card>
  );
}