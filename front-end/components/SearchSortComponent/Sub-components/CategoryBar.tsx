import { Box, Chip, FormControl, InputLabel, MenuItem, Paper, Select, useTheme } from "@mui/material";
import { FC } from "react";
import { CategoryContainer } from "../style";
import { CategorizeProps } from "../types";

const CategoryBarComponent: FC<CategorizeProps> = ({
    tags,
    tagsList,
    setCategoryBy
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
        <CategoryContainer theme={theme}>
          <Paper elevation={1}>
            <FormControl variant="filled" sx={styles.dropDownMenu}>
              <InputLabel id="categorizeBar">Tags</InputLabel>
              <Select
                multiple
                value={tags}
                onChange={setCategoryBy}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {tagsList.map((tag, key) => (
                  <MenuItem key={key} value={tag.name}>
                    {tag.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
        </CategoryContainer>
    )
}

export default CategoryBarComponent