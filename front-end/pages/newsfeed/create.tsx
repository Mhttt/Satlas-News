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
import editorjsDefault from '../../components/EditorJS/Editorjs.default';
import axios from 'axios';
import { Box } from '@mui/system';
import NewsArticle from '../../types/NewsArticle';
import Router from 'next/router';
import { SnackbarContext } from '../../components/Snackbar/SnackbarContextProvider';
import Tag from '../../types/Tag';
import DynamicIcon from '../../components/DynamicIcon/DynamicIcon';
import { useAuth0 } from '../../components/Authentication/AzureAuth0Provider';
import { useRouter } from 'next/router';
import redirectUnauthorized from '../../helpers/redirectUnauthorized';
import MapContextProvider from '../../components/Map/MapContextProvider';
import CoordSelector from '../../components/CoordSelector/CoordSelector';
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
  const [editor, setEditor] = useState<EditorJS>();
  const [formData, setFormData] = useState<Partial<NewsArticle>>({
    icon: '',
    lat: undefined,
    lon: undefined,
    shortdescription: '',
    tags: [],
    title: '',
    jsonRepresentation: JSON.stringify(editorjsDefault),
  });

  const {
    actions: { openSnackbar },
  } = useContext(SnackbarContext);

  const {
    actions: { displayLoader, dataIsLoaded },
  } = useContext(LoaderContext);
  const { user, isLoading } = useAuth0();

  const router = useRouter();

  async function postNews(e: FormEvent<HTMLFormElement>) {
    displayLoader('topbar');
    e.preventDefault();

    const contentData = await editor?.save();
    formData.tags = tagsList.filter((tag) => tags.some((e) => e === tag.name));

    if (
      formData.icon &&
      formData.shortdescription &&
      formData.tags &&
      formData.title &&
      contentData
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

            if (uploadedFile) {
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
              imageErrors.push(`No image uploaded for block ${block.id}!`);
            }
          }
        }

        if (imageErrors.length <= 0) {
          const r = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}api/newsarticles`,
            formDataBody
          );
          openSnackbar('success', r.data.message);
          if (r.data.article.url) {
            Router.push(
              `/newsfeed/post/article/?article=${r.data.article.url}`
            );
          }
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
    dataIsLoaded();
  }

  async function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  }

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

  const [tagsList, setTagsList] = useState<Tag[]>([]);

  const fetchTags = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}api/tags`
    );
    setTagsList(response.data.tags);
  };

  useEffect(() => {
    (async () => {
      displayLoader('topbar');
      await fetchTags();
      dataIsLoaded();
    })();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        redirectUnauthorized(router.asPath);
      }
    }
  }, [isLoading]);

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

  const setSelectedCoords = (coordinates: Array<any>) => {
    setFormData({ ...formData, lat: coordinates[1], lon: coordinates[0] });
  };

  if (!user && isLoading) {
    return <MUISpinner />;
  }

  return (
    <>
      <Head>
        <title>Create post - SATLAS NEWS</title>
      </Head>

      <Navbar page={1} />
      <Container maxWidth="lg">
        <Typography marginTop={2} variant="h1">
          Create a post
        </Typography>
        <Typography marginTop={1} marginBottom={4} variant="h3">
          Create a post to be shown publically on the news feed page.
        </Typography>

        <form onSubmit={postNews}>
          <Grid container columnSpacing={10} rowSpacing={8}>
            <Grid
              item
              md={6}
              xs={12}
              sx={{
                height: '400px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
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
                value={formData.shortdescription}
                fullWidth={true}
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
  
};

export async function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.readAsDataURL(file);
    fileReader.onloadend = () => resolve(fileReader.result);
    fileReader.onerror = (err) => reject(err);
  });
}

export default Home;
