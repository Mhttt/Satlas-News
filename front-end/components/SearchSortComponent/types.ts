import { SelectChangeEvent } from '@mui/material';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import NewsArticle from '../../types/NewsArticle';
import Tag from '../../types/Tag';

interface UpdateAmount {
  (amount: number): void;
}

export interface SearchSortProps {
  updateAmount?: UpdateAmount;
  tags: string[];
  setTags: Dispatch<SetStateAction<string[]>>;
  searchedArticles: {
    error: boolean;
    dropdownArticles: NewsArticle[];
    dropdownVisible: boolean;
    showMoreVisible: boolean;
  };
  searchForArticles: (event: ChangeEvent<HTMLInputElement>) => void;
  displayAllSearchResults: (displaySearched: boolean) => void;
  searchInput: string;
  emptySearchInput: () => void;
  sortBy?: string;
  setSortBy?: Dispatch<SetStateAction<string>>;
  leftAlign: boolean;

  showSearchBar: boolean;
  showSortBar: boolean;
  showCategoryBar: boolean;
  showNewsPerPageBar: boolean;
  showCreateButton: boolean;

  displayLoader?: boolean;
}

export interface SortProps {
  sortBy?: string;
  setSortBy?: (event: SelectChangeEvent<string>) => void;
}

export interface CategorizeProps {
  tags: string[];
  tagsList: Tag[];
  setCategoryBy: (event: SelectChangeEvent<string[]>) => void;
}

export interface SearchProps {
  searchedArticles: {
    error: boolean;
    dropdownArticles: NewsArticle[];
    dropdownVisible: boolean;
    showMoreVisible: boolean;
  };
  searchForArticles: (event: ChangeEvent<HTMLInputElement>) => void;
  displayAllSearchResults: (displaySearched: boolean) => void;
  searchInput: string;
  emptySearchInput: () => void;

  displayLoader?: boolean;

  leftAlign: boolean;
}

export default interface DropDownProps {
  articles: NewsArticle[];
  showMoreVisible: boolean;
  displayAllSearchResults: (displaySearched: boolean) => void;
}


interface UpdateAmount {
  (amount: number): void;
}
export interface NewsPerPageProps {
  updateAmount?: UpdateAmount;
}

