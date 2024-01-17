import { IconLayer } from '@deck.gl/layers';
import { Container, Grid, useTheme } from '@mui/material';
import axios, { AxiosResponse } from 'axios';
import React, { ChangeEvent, FC, useContext, useEffect, useState } from 'react';
import { Popup } from 'react-map-gl';
import NewsArticle from '../../types/NewsArticle';
import Tag from '../../types/Tag';
import { useAuth0 } from '../Authentication/AzureAuth0Provider';
import { createSVGIcon, svgToDataURL } from '../DynamicIcon/DynamicIcon';
import PopUp from '../PopUp/PopUp';
import SearchSortComponent from '../SearchSortComponent/SearchSortComponent';
import { SnackbarContext } from '../Snackbar/SnackbarContextProvider';
import { getDKContourLayer } from './DkContourLayer';
import Map from './Map';
import { MapContext } from './MapContextProvider';
import { LoaderContext } from '../Loader/LoaderContextProvider';

const MapFeature: FC = () => {

  const { user } = useAuth0();
  const [tags, setTags] = useState<string[]>([]);
  const [searchedArticles, setSearchedArticles] = useState({
    error: false,
    articles: [] as NewsArticle[],
    dropdownArticles: [] as NewsArticle[],
    dropdownVisible: false,
  });
  const [displaySearched, setDisplaySearch] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const [loadingSearches, setLoadingSearches] = useState(false);

  const th = useTheme();

  const { actions: {
    displayLoader,
    dataIsLoaded,
  } } = useContext(LoaderContext);

  const maxResultsInSearchDropdown = 10;

  useEffect(() => {
    (async () => {
        displayLoader('topbar');
        await fetchArticles();
        await fetchTags();
        dataIsLoaded();
    })();
  }, [tags]);

  const searchForArticles = async (event: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    setSearchInput(searchTerm);
    if (searchTerm.length >= 2) {
      setLoadingSearches(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}api/newsarticles?search=${searchTerm}`
        );

        const dropdownArticles = res.data.articles.slice(
          0,
          maxResultsInSearchDropdown
        );

        setSearchedArticles({
          error: false,
          articles: res.data.articles,
          dropdownArticles: dropdownArticles,
          dropdownVisible: true,
        });
      } catch (error) {
        setSearchedArticles({
          error: true,
          articles: [],
          dropdownArticles: [],
          dropdownVisible: false,
        });
        openSnackbar('error', 'Could not fetch results');
      }
      setLoadingSearches(false);
    } else {
      setSearchedArticles({
        error: false,
        articles: [],
        dropdownArticles: [],
        dropdownVisible: false,
      });
    }
    setDisplaySearch(false);
  }

  const displayAllSearchResults = (enable: boolean) => {
    setDisplaySearch(enable);
    if (enable) {
      setSearchedArticles({ ...searchedArticles, dropdownVisible: false });
    } else {
      setSearchedArticles({
        error: false,
        articles: [],
        dropdownArticles: [],
        dropdownVisible: false,
      });
    }
  };

  const emptySearchInput = () => {
    setSearchInput('');
    setSearchedArticles({
      error: false,
      articles: [],
      dropdownArticles: [],
      dropdownVisible: false,
    });
    setDisplaySearch(false);
  };

  const {
    state: { viewport, isOpticalBasemap, darkMode },
    actions: { setViewport },
  } = useContext(MapContext);
  const {
    actions: { openSnackbar },
  } = useContext(SnackbarContext);
  const basemap =
    darkMode === true
      ? 'mapbox://styles/mapbox/dark-v10'
      : isOpticalBasemap
        ? 'mapbox://styles/mapbox/satellite-v9'
        : 'mapbox://styles/mapbox/light-v10';
  /*
    mapbox://styles/mapbox/streets-v11 - vejnavne
    mapbox://styles/mapbox/dark-v10 - darkmode'
    */

  interface Article extends NewsArticle {
    coordinates: number[];
  }

  const [data, setData] = useState<Article[]>([]);
  const [icons, setIcons] = useState<{ primary: any; secondary: any }>({
    primary: {},
    secondary: {},
  });
  const [selectedCoords, setSelectedCoords] = useState<Article | undefined>(
    undefined
  );

  const iconLayer = new IconLayer({
    id: 'icon-layer',
    data: [...data],
    pickable: true,
    getIcon: (d: any) => {
      return {
        url: svgToDataURL(createSVGIcon(d.icon, darkMode, th)),
        width: 128,
        height: 128,
        anchorY: 128,
      };
    },

    sizeScale: 15,
    getPosition: (d: any) => d.coordinates,
    getSize: () => 3,
    onClick: (e) => handleClick(e as any),
  });

  const fetchArticles = async () => {
    try {
      if (!displaySearched) {

        const result: AxiosResponse<{
          totalAmount: number;
          articles: NewsArticle[];
        }> = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}api/newsarticles?tags=${tags}`
        );

        if (result.data.articles) {
          setData(
            result.data.articles.map((e) =>
              Object.assign(e, { coordinates: [e.lon, e.lat] })
            )
          );
        } else {
          openSnackbar('error', 'There was an error getting the news!');
        }

      }
    } catch (err) {
      console.error(err);
      openSnackbar('error', 'There was an error getting the news!');
    }
  };

  const fetchTags = async () => {
    try {
      const result: AxiosResponse<{ tags: Tag[] }> = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}api/tags`
      );

      const iconTags: { primary: any; secondary: any } = {
        primary: {},
        secondary: {},
      };

      result.data.tags.forEach((tag) => {
        iconTags.primary[tag.name] = svgToDataURL(
          createSVGIcon(tag.icon, false, th)
        );
        iconTags.secondary[tag.name] = svgToDataURL(
          createSVGIcon(tag.icon, true, th)
        );
      });

      setIcons(iconTags);
    } catch (err) {
      console.error(err);
      openSnackbar('error', 'There was an error getting the tags!');
    }
  };


  const handleClick = (e: any) => {
    setSelectedCoords(e.object);
  };


  return (
    <Grid sx={{ position: 'relative', height: '92vh' }}>

      <Map
        view={viewport}
        setViewport={setViewport}
        mapStyle={basemap}
        icons={darkMode || isOpticalBasemap ? icons.secondary : icons.primary}
        layers={
          iconLayer !== undefined
            ? [iconLayer, getDKContourLayer(darkMode, isOpticalBasemap, th)]
            : [getDKContourLayer(darkMode, isOpticalBasemap, th)]
        }
        isSmallMap={false}
      >
        <Container maxWidth="xl" sx={{ ml: 0 }}>
          <SearchSortComponent
            tags={tags}
            setTags={setTags}
            searchedArticles={{
              error: searchedArticles.error,
              dropdownArticles: searchedArticles.dropdownArticles,
              dropdownVisible: searchedArticles.dropdownVisible,
              showMoreVisible:
                searchedArticles.articles.length > maxResultsInSearchDropdown,
            }}
            searchForArticles={searchForArticles}
            displayAllSearchResults={displayAllSearchResults}
            searchInput={searchInput}
            emptySearchInput={emptySearchInput}
            leftAlign={true}

            showSearchBar={true}
            showSortBar={false}
            showCategoryBar={true}
            showNewsPerPageBar={false}
            
            displayLoader={loadingSearches}
            showCreateButton={user !== undefined}
          />
        </Container>
        {selectedCoords && (
          <Popup
            longitude={
              selectedCoords !== undefined && selectedCoords.lon
                ? selectedCoords.lon
                : 0
            }
            latitude={
              selectedCoords != undefined && selectedCoords.lat
                ? selectedCoords.lat
                : 0
            }
            closeButton={false}
            closeOnClick={true}
            onClose={() => setSelectedCoords(undefined)}
          >
            <PopUp
              title={selectedCoords.title}
              image={selectedCoords.previewImage}
              article={selectedCoords.shortdescription}
              coords={{ lat: selectedCoords.lat, lng: selectedCoords.lon }}
              onClose={() => setSelectedCoords(undefined)}
              url={selectedCoords.url}
            />
          </Popup>
        )}
      </Map>
    </Grid>
  );
};

export default MapFeature;
