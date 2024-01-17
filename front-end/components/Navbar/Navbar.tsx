import React, { useState, FC, MouseEvent, SyntheticEvent } from 'react';
import {
  AppBar,
  Tabs,
  Tab,
  Toolbar,
  Typography,
  Box,
  useTheme,
  styled,
} from '@mui/material';
import { useRouter } from 'next/router';
import {
  MapOutlined,
  AutoAwesomeMosaicOutlined,

} from '@mui/icons-material';
import { useAuth0 } from '../Authentication/AzureAuth0Provider';
import LogoutIcon from '@mui/icons-material/Logout';

interface LinkTabProps {
  label?: string;
  href: string;
  icon?: any;
  iconPosition?: any;
}

const styling = {
  container: {
    bgcolor: 'paper.background',
    color: 'primary.main',
    height: '8vh',
    minHeight: '70px',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  leftSide: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  rightSide: {
    height: '100%',
    margin: 0,
    padding: 0,
    verticalAlign: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loginLogoutContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    '&:hover': {
      cursor: 'pointer',
    },
  },
};

function LinkTab(props: LinkTabProps) {
  const router = useRouter();
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    router.push(props.href);
  };
  return <Tab onClick={handleClick} {...props} />;
}

interface NavbarProps {
  page: number;
}

const Navbar: FC<NavbarProps> = ({ page }) => {
  const [value, setValue] = useState(page);

  const theme = useTheme();

  const { user, logout } = useAuth0();

  const SmallScreen = styled('div')(() => ({
    [theme.breakpoints.down('sm')]: {},
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  }));
  const MediumScreen = styled('div')(() => ({
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
    [theme.breakpoints.up('sm')]: {},
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  }));
  const LargeScreen = styled('div')(() => ({
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
    [theme.breakpoints.up('md')]: {},
  }));

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <AppBar
      position="static"
      sx={styling.container}
    >
      <Toolbar variant="dense" sx={styling.toolbar}>
        <Box
          sx={styling.leftSide}
        >
          <SmallScreen>
            <Typography variant="h6" sx={{ mr: 3 }}>
              SATLAS NEWS
            </Typography>
          </SmallScreen>
          <MediumScreen>
            <Typography variant="h6" sx={{ mr: 5 }}>
              SATLAS NEWS
            </Typography>
          </MediumScreen>
          <LargeScreen>
            <Typography variant="h6" sx={{ mr: 10 }}>
              SATLAS NEWS
            </Typography>
          </LargeScreen>

          <SmallScreen>
            <Tabs value={value} onChange={handleChange} color="inherit">
              <LinkTab href="/" icon={ <MapOutlined />} />
              <LinkTab href="/newsfeed" icon={<AutoAwesomeMosaicOutlined />} />
            </Tabs>
          </SmallScreen>
          <MediumScreen theme={theme}>
            <Tabs value={value} onChange={handleChange} color="inherit">
              <LinkTab
                href="/"
                label="Map"
                icon={<MapOutlined />}
                iconPosition="top"
              />
              <LinkTab
                href="/newsfeed"
                label="News Feed"
                icon={<AutoAwesomeMosaicOutlined />}
                iconPosition="top"
              />
            </Tabs>
          </MediumScreen>
          <LargeScreen>
            <Tabs value={value} onChange={handleChange} color="inherit">
              <LinkTab
                href="/"
                label="Map"
                icon={<MapOutlined />}
                iconPosition="start"
              />
              <LinkTab
                href="/newsfeed"
                label="News Feed"
                icon={<AutoAwesomeMosaicOutlined />}
                iconPosition="start"
              />
            </Tabs>
          </LargeScreen>
        </Box>
        <Box sx={styling.rightSide}>
          {user && (
            <Box
              sx={styling.loginLogoutContainer}
              onClick={logout}
            >
              <LogoutIcon sx={{ fontSize: '2.5ex', mr: 1 }} />
              <LargeScreen>
                <Typography variant='h5' sx={{ mr: 2 }}>Logout</Typography>
              </LargeScreen>
            </Box>
          )}
          <img
            src="https://grasdatastorage.blob.core.windows.net/images/DHI_Logo_Blue.png"
            alt="DHI"
            style={{ height: '100%' }}
          />
        </Box>

      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
