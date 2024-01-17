import styled from '@emotion/styled';
import { Theme } from '@mui/material';

const InnerLeftStyling = {
  display: 'flex',
  justifyContent: 'flex-start',
  width: '100%',
  alignItems: 'center',
  ml: 0,
  mr: 0,
  pl: '0px',
  pr: '0px',
  maxWidth: '100%',
  gap: '10px',
}

const InnerCenteredStyling = {
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  alignItems: 'center',
  ml: 0,
  mr: 0,
  pl: '0px',
  pr: '0px',
  maxWidth: '100%',
  gap: '10px',
}

const SearchContainerLeftStyling = {
  boxSizing: 'border-box',
  width: '30%',
  position: 'relative',
}

const SearchContainerCenterStyling = {
  boxSizing: 'border-box',
  width: '30%',
  position: 'relative',
  flexGrow: 1,
}



const InnerContainer = styled('div')(({ theme, leftAlign }: { theme: Theme , leftAlign: boolean}) => ({
  [theme.breakpoints.down('sm')]: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    gap: '10px',
  },
  [theme.breakpoints.up('sm')]: leftAlign ? InnerLeftStyling : InnerCenteredStyling,
}));

const SearchContainer = styled('div')(({ theme, leftAlign }: { theme: Theme, leftAlign: boolean }) => ({
  [theme.breakpoints.down('sm')]: {},
  [theme.breakpoints.up('sm')]: leftAlign ? SearchContainerLeftStyling : SearchContainerCenterStyling,
}));


const SortContainer = styled('div')(({ theme }: { theme: Theme }) => ({
  [theme.breakpoints.down('sm')]: {},
  [theme.breakpoints.up('sm')]: {
    boxSizing: 'border-box',
    width: '20%',
  },
}));

const NewsPerPageContainer = styled('div')(({ theme }: { theme: Theme }) => ({
  [theme.breakpoints.down('sm')]: {
    marginRight: '0px',
  },
  [theme.breakpoints.up('sm')]: {
    boxSizing: 'border-box',
    width: '10%',
  },
}));

const CreateButtonContainer = styled('div')(({ theme }: { theme: Theme }) => ({
  [theme.breakpoints.down('sm')]: {},
  [theme.breakpoints.up('sm')]: {
    boxSizing: 'border-box',
    width: '15%',
  },
}));

const CategoryContainer = styled('div')(({ theme }: { theme: Theme }) => ({
  [theme.breakpoints.down('sm')]: {},
  [theme.breakpoints.up('sm')]: {
    boxSizing: 'border-box',
    width: '20%',
  },
}));

export {
  InnerContainer,
  SearchContainer,
  SortContainer,
  NewsPerPageContainer,
  CreateButtonContainer,
  CategoryContainer,
};
