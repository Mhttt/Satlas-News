import { Box, InputAdornment, Paper, TextField, useTheme} from "@mui/material";
import { ChangeEvent, FC, KeyboardEvent } from "react";
import { SearchContainer } from "../style";
import { SearchProps } from "../types";
import DropDown from "./DropDown";
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';


const SearchBarComponent: FC<SearchProps> = ({
  searchedArticles,
  searchForArticles,
  displayAllSearchResults,
  searchInput,
  emptySearchInput,

  displayLoader,
  leftAlign
}) => {
    const theme = useTheme();

    const styles = {
      textField: {
        width: '100%',
      },
      deleteInputButton: {
        position: 'absolute',
        right: '2%',
        '&:hover': {
          cursor: 'pointer',
        },
      },
    };

    const deleteButtonOnTextfield =
    searchInput.length > 0
      ? {
          startAdornment: (
            <InputAdornment position="end" sx={styles.deleteInputButton}>
              {displayLoader && <CircularProgress color="inherit" size={20} thickness={5}/>}
              <CloseIcon onClick={() => emptySearchInput()} />
            </InputAdornment>
          ),
        }
      : {};

    return (
        <SearchContainer theme={theme} leftAlign={leftAlign}>
            <Paper elevation={1}>
              <TextField
                sx={styles.textField}
                label="Search"
                variant="filled"
                value={searchInput}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  searchForArticles(e);
                }}
                onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
                  if (event.key === 'Enter' && searchedArticles.showMoreVisible) {
                    displayAllSearchResults(true);
                  }
                }}
                InputProps={deleteButtonOnTextfield}
              />
            </Paper>
            {searchedArticles.error === false &&
              searchedArticles.dropdownVisible && (
                <DropDown
                  articles={searchedArticles.dropdownArticles}
                  showMoreVisible={searchedArticles.showMoreVisible}
                  displayAllSearchResults={displayAllSearchResults}
                />
              )}
        </SearchContainer>
    )
}

export default SearchBarComponent