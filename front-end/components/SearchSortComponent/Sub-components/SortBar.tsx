import { FormControl, InputLabel, MenuItem, Paper, Select, useTheme } from "@mui/material";
import { FC } from "react";
import { SortContainer } from "../style";
import { SortProps } from "../types";

const SortBarComponent: FC<SortProps> = ({
    sortBy,
    setSortBy
}) => {
    const theme = useTheme();

    const styles = {
        dropDownMenu: {
            boxSizing: 'border-box',
            width: '100%',
            position: 'relative',
          }
    }

    return (
        <SortContainer theme={theme}>
          <Paper elevation={1}>
            <FormControl variant="filled" sx={styles.dropDownMenu}>
              <InputLabel id="sortBar">Sort by</InputLabel>
              <Select value={sortBy} onChange={setSortBy}>
                <MenuItem value={'datedesc'}>Date added (newest)</MenuItem>
                <MenuItem value={'dateasc'}>Date added (oldest)</MenuItem>
                <MenuItem value={'alphasc'}>Alphabetical A-Z</MenuItem>
                <MenuItem value={'alphdesc'}>Alphabetical Z-A</MenuItem>
              </Select>
            </FormControl>
          </Paper>
        </SortContainer>
    )
}

export default SortBarComponent