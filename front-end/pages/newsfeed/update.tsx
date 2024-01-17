import {
  Button,
  Checkbox,
  Chip,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  Link,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import type { NextPage } from 'next';
import Head from 'next/head';
import React, {
  useContext,
  useEffect,
  useState,
  MouseEvent,
  FormEvent,
  ChangeEvent,
} from 'react';
import Navbar from '../../components/Navbar/Navbar';
import dynamic from 'next/dynamic';
import EditorJS from '@editorjs/editorjs';
import axios, { AxiosResponse } from 'axios';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import NewsArticle from '../../types/NewsArticle';
import { SnackbarContext } from '../../components/Snackbar/SnackbarContextProvider';
import Tag from '../../types/Tag';
import DynamicIcon from '../../components/DynamicIcon/DynamicIcon';
import { getBase64 } from './create';
import { useAuth0 } from '../../components/Authentication/AzureAuth0Provider';
import redirectUnauthorized from '../../helpers/redirectUnauthorized';
import MapContextProvider from '../../components/Map/MapContextProvider';
import CoordSelector from '../../components/CoordSelector/CoordSelector';
import { UploadFile } from '@mui/icons-material';
import TagsForm from '../../components/TagsForm/TagsForm';
import { LoaderContext } from '../../components/Loader/LoaderContextProvider';
import MUISpinner from '../../components/MUISpinner/MUISpinner';

const EditorJsComponent = dynamic(
  () => import('../../components/EditorJS/Editorjs.component'),
  { ssr: false }
);

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const Home: NextPage = () => {
  const { user, isLoading } = useAuth0();
  const router = useRouter();
  const { article } = router.query;
  const [editor, setEditor] = useState<EditorJS>();
  const [found, setFound] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<NewsArticle>>({
    icon: '',
    jsonRepresentation: '',
    lat: 0,
    lon: 0,
    shortdescription: '',
    tags: [],
    title: '',
  });

  const {
    actions: { openSnackbar },
  } = useContext(SnackbarContext);

  const {
    actions: {displayLoader, dataIsLoaded},
  } = useContext(LoaderContext);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        redirectUnauthorized(router.asPath);
      }
    }
  }, [isLoading]);

  useEffect(() => {
    async function getPostData() {
      if (article) {
        try {
          const r2: AxiosResponse<{
            totalAmount: number;
            articles: NewsArticle[];
          }> = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}api/newsarticles?article=${article}`
          );

          if (r2.data && r2.data.articles.length > 0) {
            setFormData({
              title: r2.data.articles[0].title,
              shortdescription: r2.data.articles[0].shortdescription,
              icon: r2.data.articles[0].icon,
              jsonRepresentation: r2.data.articles[0].jsonRepresentation,
              lat: r2.data.articles[0].lat,
              lon: r2.data.articles[0].lon,
              tags: r2.data.articles[0].tags,
            });
            setTags(r2.data.articles[0].tags.map((tag) => tag.name));
            setFound(true);
          } else {
            setFound(false);
            openSnackbar('error', 'No posts found with that ID');
          }
        } catch (err: any) {
          setFound(false);
          if (err.response && err.response.data) {
            console.error(err.response.data);
            openSnackbar('error', err.response.data.message);
          } else {
            console.error(err);
            openSnackbar('error', `There was an error!`);
          }
        }
      }
    }

    (async () => {
      displayLoader('topbar');
      await getPostData();
      dataIsLoaded();
    })()
  }, [article]);

  const [tagsList, setTagsList] = useState<Tag[]>([]);

  const fetchTagsList = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}api/tags`
    );
    setTagsList(response.data.tags);
  };

  useEffect(() => {
    fetchTagsList();
  }, []);

  const [tags, setTags] = useState<string[]>([]);
  const [formOpen, setFormOpen] = useState<boolean>(false);

  const handleTagsChange = (e: SelectChangeEvent<typeof tags>) => {
    const newTagsValue =
      typeof e.target.value === 'string'
        ? e.target.value.toLowerCase().split(',')
        : e.target.value;

    const foundIcon = tagsList
      .find((v) => v.icon.toLowerCase() === formData.icon?.toLowerCase())
      ?.name.toLowerCase();

    if (foundIcon && !newTagsValue.includes(foundIcon)) {
      setFormData({ ...formData, icon: '' });
    }

    setTags(newTagsValue);
  };

  async function handleIconClick(
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) {
    e.preventDefault();
    e.stopPropagation();

    const target: Partial<HTMLSpanElement> = e.target;
    const iconPicked = target.innerHTML?.toLowerCase();
    const foundIcon = tagsList.find((v) => v.name.toLowerCase() === iconPicked);
    if (
      foundIcon &&
      formData.icon?.toLowerCase() !== foundIcon.icon.toLowerCase() &&
      tags.includes(foundIcon.name.toLowerCase())
    ) {
      setFormData({ ...formData, icon: foundIcon.icon });
    } else {
      setFormData({ ...formData, icon: '' });
    }
  }

  const setSelectedCoords = (coordinates: Array<any>) => {
    setFormData({ ...formData, lat: coordinates[1], lon: coordinates[0] });
  };

  if (user && !isLoading) {
    return (
      <>
        <Head>
          <title>Update post - SATLAS NEWS</title>
        </Head>
        <Navbar page={1} />
        <Container maxWidth="lg">
          <Typography marginTop={2} variant="h1">
            Update your post
          </Typography>
          <Typography marginTop={1} marginBottom={4} variant="h3">
            Update the details of the post below <small>(#{article})</small>
          </Typography>

          {article && found ? (
            <form onSubmit={updateNews}>
              <Grid container spacing={10}>
                <Grid
                  item
                  md={6}
                  xs={12}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '25vh',
                    height: '400px',
                  }}
                >
                  <TextField
                    id="filled-helperText"
                    label="Title"
                    helperText="Title for your post"
                    variant="filled"
                    name="title"
                    value={formData.title}
                    fullWidth={true}
                    required={true}
                    onChange={handleInputChange}
                  />
                  <TextField
                    id="filled-helperText"
                    label="Short description"
                    helperText="Short description for your post"
                    variant="filled"
                    name="shortdescription"
                    required={true}
                    fullWidth={true}
                    value={formData.shortdescription}
                    onChange={handleInputChange}
                  />
                  <Box>
                    <FormControl fullWidth variant="filled">
                      <InputLabel id="tag-selector">Tags</InputLabel>
                      <Select
                        labelId="tag-selector"
                        multiple
                        fullWidth
                        value={tags}
                        onChange={handleTagsChange}
                        renderValue={(selected) => (
                          <Box
                            sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}
                          >
                            {selected.map((value, i) => (
                              <Chip
                                sx={{
                                  cursor: 'copy',
                                  backgroundColor:
                                    value.toLowerCase() ===
                                    tagsList
                                      .find(
                                        (v) =>
                                          v.icon.toLowerCase() ===
                                          formData.icon?.toLowerCase()
                                      )
                                      ?.name.toLowerCase()
                                      ? 'primary.main'
                                      : '',
                                  color:
                                    value.toLowerCase() ===
                                    tagsList
                                      .find(
                                        (v) =>
                                          v.icon.toLowerCase() ===
                                          formData.icon?.toLowerCase()
                                      )
                                      ?.name.toLowerCase()
                                      ? 'white'
                                      : '',
                                  '&:hover': {
                                    backgroundColor:
                                      value.toLowerCase() ===
                                      tagsList
                                        .find(
                                          (v) =>
                                            v.icon.toLowerCase() ===
                                            formData.icon?.toLowerCase()
                                        )
                                        ?.name.toLowerCase()
                                        ? 'secondary.main'
                                        : '',
                                  },
                                }}
                                onMouseDown={(e) => handleIconClick(e)}
                                clickable={true}
                                key={i}
                                label={value}
                              />
                            ))}
                          </Box>
                        )}
                        MenuProps={MenuProps}
                      >
                        {tagsList.map((tag, i) => (
                          <MenuItem key={i} value={tag.name}>
                            <Checkbox checked={tags.indexOf(tag.name) > -1} />
                            <ListItemIcon
                              children={<DynamicIcon name={tag.icon} />}
                            />
                            <ListItemText primary={tag.name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormHelperText sx={{ ml: 2 }}>
                      Tags for your article.{' '}
                      <b>Click on the tag to select the icon for the post.</b>{' '}
                      <br />
                      Don't find your tag?{' '}
                      <Link
                        sx={{ cursor: 'pointer' }}
                        onClick={() => {
                          setFormOpen(true);
                        }}
                      >
                        Click here to manage your tags!
                      </Link>
                    </FormHelperText>
                  </Box>
                </Grid>
                <Grid item md={6} xs={12} sx={{ height: '400px' }}>
                  <MapContextProvider>
                    <CoordSelector
                      selectedCoords={[formData.lon, formData.lat]}
                      setSelectedCoords={setSelectedCoords}
                    />
                  </MapContextProvider>
                </Grid>
              </Grid>

              <Container maxWidth="lg">
                <EditorJsComponent
                  data={formData.jsonRepresentation}
                  editor={editor}
                  setEditor={setEditor}
                />
                <Box marginTop={2} marginBottom={2} alignContent="center">
                  <Button
                    type="submit"
                    sx={{
                      display: 'block',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                    }}
                    variant="contained"
                  >
                    Save post
                  </Button>
                </Box>
              </Container>
            </form>
          ) : (
            <p>No post found with that ID</p>
          )}
        </Container>
        <TagsForm
          open={formOpen}
          tags={tagsList}
          onClose={() => {
            setFormOpen(false);
          }}
          setTags={setTagsList}
        ></TagsForm>
      </>
    );
  } else {
    return <MUISpinner />;
  }

  async function updateNews(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const contentData = await editor?.save();
    formData.tags = tagsList.filter((tag) => tags.some((e) => e === tag.name));

    if (
      formData.title &&
      formData.icon &&
      formData.shortdescription &&
      formData.tags &&
      contentData &&
      article
    ) {
      // Post to Azure function

      try {
        const imageErrors: string[] = [];
        const formDataBody: Partial<NewsArticle> & {
          images: {
            blockid: string;
            type: string;
            name: string;
            base64: any;
          }[];
        } = {
          ...formData,
          jsonRepresentation: JSON.stringify(contentData),
          images: [],
        };

        for (const block of contentData.blocks) {
          if (block.type === 'layout') {
            const uploadedFile: File = block.data.uploadedFile;

            // Hvis der ikke er et satlasnewsimage. og der er uploadet en fil. Så upload.

            if (uploadedFile && uploadedFile.name) {
              if (uploadedFile.size < 1000000) {
                formDataBody.images.push({
                  blockid: `${block.id}`,
                  base64: await getBase64(uploadedFile),
                  type: uploadedFile.type,
                  name: uploadedFile.name,
                });
              } else {
                imageErrors.push(`Image ${uploadedFile.name} is too big!`);
              }
            } else {
              if (
                block.data.imageURL.indexOf(
                  'https://satlasnewsimages.blob.core.windows.net/postimages'
                ) === -1
              ) {
                imageErrors.push(`No image uploaded for block ${block.id}!`);
              }
            }
          }
        }

        if (imageErrors.length <= 0) {
          const r = await axios.put(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}api/newsarticles`,
            {
              formData: formDataBody,
              articleURL: article,
            }
          );
          openSnackbar('success', r.data.message);
          router.push(`/newsfeed/post/article?article=${article}`);
        } else {
          openSnackbar('error', imageErrors.join(', '));
        }
      } catch (err: any) {
        if (err.response && err.response.data) {
          console.error(err.response.data);
          openSnackbar('error', err.response.data.message);
        } else {
          console.error(err);
          openSnackbar('error', `There was an error!`);
        }
      }
    } else {
      openSnackbar('warning', 'You must fill out all fields!');
    }
  }

  async function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  }
};

export default Home;
