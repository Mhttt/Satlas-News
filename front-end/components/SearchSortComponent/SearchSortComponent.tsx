import CloseIcon from '@mui/icons-material/Close';
import { InputAdornment, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import { SelectChangeEvent } from '@mui/material/Select';
import axios from 'axios';
import React, { FC, useEffect, useState } from 'react';
import Tag from '../../types/Tag';
import { InnerContainer } from './style';
import CategoryBarComponent from './Sub-components/CategoryBar';
import CreateButtonComponent from './Sub-components/CreateButton';
import NewsPerPageComp from './Sub-components/NewsPerPage';
import SearchBarComponent from './Sub-components/SearchBar';
import SortBarComponent from './Sub-components/SortBar';
import { SearchSortProps } from './types';

const styles = {
  outerContainer: {
    width: '100%',
    display: 'block',
    mt: 3,
    mb: 2,
  },
  textField: {
    width: '100%',
  },
  dropDownMenu: {
    boxSizing: 'border-box',
    width: '100%',
    position: 'relative',
  },
  createButton: {
    boxSizing: 'border-box',
    width: '100%',
    minWidth: '100% !important',
  },
  deleteInputButton: {
    position: 'absolute',
    right: '2%',
    '&:hover': {
      cursor: 'pointer',
    },
  },
};

const SearchSortComponent: FC<SearchSortProps> = ({
  updateAmount,
  tags,
  setTags,
  searchedArticles,
  searchForArticles,
  displayAllSearchResults,
  searchInput,
  emptySearchInput,
  setSortBy,
  sortBy,
  leftAlign,

  showSearchBar,
  showSortBar,
  showCategoryBar,
  showNewsPerPageBar,
  showCreateButton,

  displayLoader,
}) => {
  const theme = useTheme();

   const handleChangeSort = (event: SelectChangeEvent<string>) => {
     if(setSortBy){
      setSortBy(event.target.value);
     }
   };

  const handleChangeCat = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setTags(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const [tagsList, setTagsList] = useState<Tag[]>([]);

  const fetchTags = async () => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}api/tags`);    
    setTagsList(response.data.tags);
  };

  useEffect(() => {
    fetchTags();
  }, [])

  return (
    <Box sx={styles.outerContainer}>
      <InnerContainer theme={theme} leftAlign={leftAlign}>
        { showSearchBar && 
          <SearchBarComponent 
            searchedArticles={searchedArticles} 
            searchForArticles={searchForArticles} 
            displayAllSearchResults={displayAllSearchResults} 
            searchInput={searchInput} 
            emptySearchInput={emptySearchInput}
            displayLoader={displayLoader}         
            leftAlign={leftAlign}
          /> }

        { showSortBar && 
          <SortBarComponent sortBy={sortBy} setSortBy={handleChangeSort}/>
          }

        { showCategoryBar && 
          <CategoryBarComponent tags={tags} tagsList={tagsList} setCategoryBy={handleChangeCat}/>
          }

        { showNewsPerPageBar &&
          <NewsPerPageComp updateAmount={updateAmount}/>
          }

        { showCreateButton && 
          <CreateButtonComponent />
          }
      </InnerContainer>
    </Box>
  );
};

export default SearchSortComponent;
