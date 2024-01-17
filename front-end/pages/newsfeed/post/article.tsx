import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import axios, { AxiosResponse } from 'axios';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar/Navbar';
import { findHtmlInString } from '../../../helpers/findHtmlInString';
import NewsArticle from '../../../types/NewsArticle';
import Terracotta from '../../../components/Terracotta/Terracotta';
import MapContextProvider from '../../../components/Map/MapContextProvider';
import { SnackbarContext } from '../../../components/Snackbar/SnackbarContextProvider';
import DynamicIcon from '../../../components/DynamicIcon/DynamicIcon';
import deleteArticle from '../../../helpers/deleteArticle';
import Head from 'next/head';
import { LoaderContext } from '../../../components/Loader/LoaderContextProvider';
import { useAuth0 } from '../../../components/Authentication/AzureAuth0Provider';
import Confirm from '../../../components/Confirm/Confirm';

const NewsPage: NextPage = () => {
  const theme = useTheme();
  const router = useRouter();
  const { article } = router.query;
  const [data, setData] = useState({
    loaded: false,
    article: {} as NewsArticle,
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const [createdArticle, setCreatedArticle] = useState<any>();
  const [isLoading, setLoading] = useState(true);

  const {
    actions: { openSnackbar },
  } = useContext(SnackbarContext);

  const {
    actions: { displayLoader, dataIsLoaded },
  } = useContext(LoaderContext);

  const { user } = useAuth0();

  useEffect(() => {
    async function getData() {
      if (article) {
        try {
          const res: AxiosResponse<{
            totalAmount: number;
            articles: NewsArticle[];
          }> = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}api/newsarticles?article=${article}`
          );

          setLoading(false);
          const regex = /[&][n][b][s][p][;]/gm;
          setData({ loaded: true, article: res.data.articles[0] });
          setCreatedArticle(
            JSON.parse(
              res.data.articles[0].jsonRepresentation.replace(regex, '\xa0')
            )
          );
        } catch (error) {
          console.error(error);
          openSnackbar('error', 'Could not find article');
          setLoading(false);
        }
      }
    }

    (async () => {
      displayLoader('topbar');
      await getData();
      dataIsLoaded();
    })()
  }, [article]);

  //Styling
  const containerInner = {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '80%',
    mt: 3,
    mb: 4,
  };

  const image = {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '100%',
  };

  const tableCell = {
    border: 'solid',
    p: 1,
  };

  const center = {
    ml: 'auto',
    mr: 'auto',
    maxWidth: '50%',
    mt: 5,
  };

  const center2 = {
    display: 'block',
    ml: 'auto',
    mr: 'auto',
    maxWidth: '25%',
    mb: 5,
  };

  const loadingBar = {
    height: '92vh',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const margin = {
    mt: 4,
    mb: 4,
  };

  const tagContainer = {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    spaceBetween: '20px',
    mb: 3,
  };

  const LayoutContainerDiv = styled('div')(() => ({
    [theme.breakpoints.down('md')]: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      gap: '20px',
      boxSizing: 'border-box',
      alignItems: 'center',
      flexDirection: 'column',
    },
    [theme.breakpoints.up('md')]: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      gap: '8vw',
      boxSizing: 'border-box',
      alignItems: 'center',
      flexDirection: 'row',
    },
  }));

  const LayoutImageContainerDiv = styled('div')(() => ({
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
    [theme.breakpoints.up('md')]: {
      width: '40%',
    },
  }));

  const LayoutTextContainerDiv = styled('div')(() => ({
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
    [theme.breakpoints.up('md')]: {
      width: '60%',
    },
  }));

  const layoutStyling = {
    text: {
      width: '100%',
      margin: '0px',
      padding: '0px',
      boxSizing: 'border-box',
      border: 'none',
      backgroundColor: 'transparent',
      lineHeight: '1.6em',
      color: '#0B4566',
      fontSize: '1rem',
      fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
      letterSpacing: '0.00938em',
      height: '100%',
    },

    image: {
      width: '100%',
      height: '100%',
      margin: '0px',
      padding: '0px',
      boxSizing: 'border-box',
      objectFit: 'cover',
    },
  };

  const buttonsContainer = {
    display: 'flex',
    justifyContent: 'flex-start',
    gap: '10px',
    alignItems: 'center',
  };

  const updateDeleteButtons = {
    minWidth: '100px',
    fontSize: '12px',
  };

  const TopContainerDiv = styled('div')(() => ({
    [theme.breakpoints.down('md')]: {
      display: 'block',
      marginBottom: '10px',
    },
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      alignItems: 'center',
      marginBottom: '10px',
    },
  }));

  async function deletePost() {
    displayLoader('topbar');
    await deleteArticle(data.article.id, openSnackbar);
    dataIsLoaded();
    router.push('/newsfeed');
  }

  if (createdArticle) {
    return (
      <>
      <Box className="container">
        <Head>
          <title>{data.article.title} - SATLAS NEWS</title>
        </Head>
        <Navbar page={1} />
        {!data.loaded ? (
          <h3>loading...</h3>
        ) : (
          <MapContextProvider>
            <Box sx={containerInner}>
              <TopContainerDiv>
                <Typography variant="h1">{data.article.title}</Typography>
                {user !== undefined && (
                <Box sx={buttonsContainer}>
                  <Button
                    sx={updateDeleteButtons}
                    fullWidth={false}
                    variant="contained"
                    onClick={() =>
                      router.push(
                        `/newsfeed/update/?article=${data.article.url}`
                      )
                    }
                  >
                    Update
                  </Button>
                  <Button
                    sx={updateDeleteButtons}
                    fullWidth={false}
                    variant="contained"
                    onClick={() => {setDeleteConfirmOpen(true)}}
                  >
                    Delete
                  </Button>
                </Box>
                )}
              </TopContainerDiv>
              <Box sx={tagContainer}>
                {data.article.tags.map((v) => {
                  return (
                    <>
                      <DynamicIcon name={v.icon}></DynamicIcon>
                      <Typography variant="h6" mr={2}>
                        {v.name}
                      </Typography>
                    </>
                  );
                })}
              </Box>
              {createdArticle.blocks &&
                createdArticle.blocks.map((v: any) => {
                  if (v.type === 'paragraph') {
                    if (v.data.text) {
                      return findHtmlInString(
                        v.data.text,
                        v.type,
                        v.id,
                        v.data.level
                      );
                    }
                  }

                  if (v.type === 'header') {
                    if (v.data.text) {
                      return findHtmlInString(
                        v.data.text,
                        v.type,
                        v.id,
                        v.data.level
                      );
                    }
                  }
                  if (v.type === 'delimiter') {
                    return <Divider key={v.id} sx={margin}></Divider>;
                  }
                  if (v.type === 'list') {
                    if (v.data.style === 'unordered')
                      return (
                        <ul key={v.id}>
                          {v.data.items.map((item: any, j: number) => (
                            <li key={v.id + j}>
                              {findHtmlInString(
                                item.content,
                                v.type,
                                v.id,
                                v.data.level
                              )}
                              <ul key={v.id}>
                                {v.data.items.map((item: any, j: number) => (
                                  <li key={v.id + j}>
                                    {findHtmlInString(
                                      item.content,
                                      v.type,
                                      v.id,
                                      v.data.level
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </li>
                          ))}
                        </ul>
                      );
                    if (v.data.style === 'ordered') {
                      return (
                        <ol key={v.id}>
                          {v.data.items.map((item: any, j: number) => (
                            <li key={v.id + j}>
                              {findHtmlInString(
                                item.content,
                                v.type,
                                v.id,
                                v.data.level
                              )}
                              <ol key={v.id}>
                                {item.items.map((item: any, j: number) => (
                                  <li key={v.id + j}>
                                    {findHtmlInString(
                                      item.content,
                                      v.type,
                                      v.id,
                                      v.data.level
                                    )}
                                  </li>
                                ))}
                              </ol>
                            </li>
                          ))}
                        </ol>
                      );
                    }
                  }

                  if (v.type === 'table') {
                    if (v.data.withHeadings == true) {
                      return (
                        <TableContainer key={v.id} component={Paper}>
                          <Table
                            sx={{ minWidth: 650 }}
                            aria-label="simple table"
                          >
                            <TableHead>
                              {v.data.content
                                .slice(0, 1)
                                .map((row: any, i: number) => (
                                  <TableRow key={v.id + i}>
                                    {row.map((item: any, j: number) => (
                                      <TableCell
                                        sx={tableCell}
                                        key={v.id + j + i}
                                      >
                                        {findHtmlInString(
                                          item,
                                          v.type,
                                          v.id,
                                          v.data.level
                                        )}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                ))}
                            </TableHead>
                            <TableBody>
                              {v.data.content
                                .slice(1)
                                .map((row: any, i: number) => (
                                  <TableRow key={v.id + i}>
                                    {row.map((item: any, j: number) => (
                                      <TableCell
                                        sx={tableCell}
                                        key={v.id + j + i}
                                      >
                                        {findHtmlInString(
                                          item,
                                          v.type,
                                          v.id,
                                          v.data.level
                                        )}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      );
                    }
                    return (
                      <TableContainer key={v.id} component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                          {v.data.content.map((row: any, i: number) => (
                            <TableRow key={v.id + i}>
                              {row.map((item: any, j: number) => (
                                <TableCell sx={tableCell} key={v.id + j + i}>
                                  {findHtmlInString(
                                    item,
                                    v.type,
                                    v.id,
                                    v.data.level
                                  )}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </Table>
                      </TableContainer>
                    );
                  }
                  if (v.type === 'image') {
                    if (v.data.caption) {
                      return (
                        <Table key={v.id}>
                          <TableRow>
                            <TableCell>
                              <img src={v.data.url} style={image}></img>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ p: 1, textAlign: 'center' }}>
                              <Typography sx={center2} variant="caption">
                                {findHtmlInString(
                                  v.data.caption,
                                  v.type,
                                  v.id,
                                  v.data.level
                                )}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        </Table>
                      );
                    }
                  }
                  if (v.type === 'terracotta') {
                    return (
                      <Terracotta
                        key={v.id}
                        terracottaUrl={
                          v.data.url !== undefined ? v.data.url : ''
                        }
                        coords={{
                          latitude: data.article.lat,
                          longitude: data.article.lon,
                        }}
                      />
                    );
                  }

                  if (v.type === 'layout') {
                    return (
                      <LayoutContainerDiv>
                        <LayoutTextContainerDiv>
                          <Typography
                            sx={layoutStyling.text}
                            align={v.data.textAlign}
                            variant="body1"
                          >
                            {findHtmlInString(v.data.textInput, v.type, v.id)}
                          </Typography>
                        </LayoutTextContainerDiv>
                        <LayoutImageContainerDiv>
                          <Box
                            sx={layoutStyling.image}
                            component="img"
                            src={v.data.imageURL}
                          />
                        </LayoutImageContainerDiv>
                      </LayoutContainerDiv>
                    );
                  }
                })}
            </Box>
          </MapContextProvider>
        )}
      </Box>
      <Confirm 
        title={"Confirm Article Deletion"}
        description={"Please confirm that you wish to delete this article. This action is not reversible."}
        confirm={"Delete"}
        cancel={"Cancel"}
        open={deleteConfirmOpen}
        onConfirm={(obj) => {
          deletePost()
        }}
        onCancel={() => {setDeleteConfirmOpen(false)}}
        object={data.article}
        confirmStyle={{
          backgroundColor: 'error.main', 
          color: 'primary.contrastText',
          '&:hover': {
            backgroundColor: 'error.dark',
          },
        }}
        cancelStyle={{
          border: '1px solid', 
          color: 'secondary.main',
          borderColor: 'secondary.main',
        }}
      />
      </>
    );
  } 
  else {
    return (
      <Box>
        <Navbar page={1} />
        <Container sx={loadingBar}>
          {!isLoading && <Typography variant="h2"> Article could not be found </Typography>}
        </Container>
      </Box>
    );
  }
};

export default NewsPage;
