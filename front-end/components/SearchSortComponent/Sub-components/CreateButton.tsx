import { Button, Link, useTheme } from "@mui/material";
import { FC } from "react";
import { CreateButtonContainer } from "../style";



const CreateButtonComponent: FC = () => {

  const theme = useTheme()

  const styles = {
    createButton: {
      boxSizing: 'border-box',
      width: '100%',
      minWidth: '100% !important',
    }
  }

  return (
    <CreateButtonContainer theme={theme}>
      <Link href="/newsfeed/create">
        <Button
          fullWidth={true}
          sx={styles.createButton}
          variant="contained">
          Create post
        </Button>
      </Link>
    </CreateButtonContainer>
  )
}

export default CreateButtonComponent
