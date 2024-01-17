import { createTheme } from "@mui/material/styles";
import { deepmerge } from "@mui/utils";
// #region Local imports
import { IMikeTheme } from "./types";
import dhiTypography from "./dhiTypography";
import dhiPalette from "./dhiPallete";
import dhiOverrides from "./dhiOverrides";
// #endregion

const defaultTheme = createTheme();
const dhiSharedTheme: IMikeTheme = createTheme(
  deepmerge(defaultTheme, {
    typography: dhiTypography,
    palette: dhiPalette,
    components: dhiOverrides
    // props: mikeComponentsProps,
  })
);

export default dhiSharedTheme;
