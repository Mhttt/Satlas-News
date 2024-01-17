import { Box, Container, Grid } from '@mui/material';
import type { NextPage } from 'next';
import React, { useContext, useEffect, useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import NewsCard from '../components/NewsCard/NewsCard';
import SearchSortComponent from '../components/SearchSortComponent/SearchSortComponent';
import Statistic from '../components/Statistic/Statistic';
import axios from 'axios';
import MediaArticle from '../types/MediaArticle';
import Head from 'next/head';
import NewsArticle from '../types/NewsArticle';
import { SnackbarContext } from '../components/Snackbar/SnackbarContextProvider';
import { LoaderContext } from '../components/Loader/LoaderContextProvider';

interface MediaArticlesProps {
  articles: Array<MediaArticle>;
}

const Home: NextPage<MediaArticlesProps> = () => {
  const statContainer = {
    display: 'flex',
    mb: 1,
  };

  const leftStat = {
    minHeight: '100%',
    minWidth: '50%',
    mr: 1,
  };

  const rightStats = {
    display: 'flex',
    flexDirection: 'column',
    height: '50%',
    minWidth: '50%',
    gap: 1,
  };

  const [articles, setArticles] = useState<MediaArticle[]>([]);
  const [amount, setAmount] = useState<number>(10);
  const [tags, setTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('datedesc');

  const {
    actions: { openSnackbar },
  } = useContext(SnackbarContext);

  const {
    actions: { displayLoader, dataIsLoaded },
  } = useContext(LoaderContext);

  useEffect(() => {
    async function getArticles() {
      try {
        const url = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axios.get(
          `${url}api/mediaarticles?tags=${tags}&sortby=${sortBy}`
        );
        setArticles(response.data);
      } catch (err) {
        console.error(err);
        openSnackbar('error', 'Error while fetching posts');
      }
    }
    (async () => {
      displayLoader('topbar');
      await getArticles();
      dataIsLoaded();
    })();
  }, [tags, sortBy]);

  return (
    <>
      <Head>
        <title>MEDIA ARTICLES - SATLAS NEWS</title>
      </Head>
      <div>
        <Navbar page={1} />
      </div>
      <Container maxWidth="xl">
        <SearchSortComponent
          updateAmount={setAmount}
          tags={tags}
          setTags={setTags}
          searchedArticles={{
            error: false,
            dropdownArticles: [] as NewsArticle[],
            dropdownVisible: false,
            showMoreVisible: false,
          }}
          searchForArticles={() => { console.log("Searching"); } }
          displayAllSearchResults={() => { console.log("Display searched results"); } }
          searchInput={''}
          emptySearchInput={() => { console.log("Clear the input field"); } }
          sortBy={sortBy}
          leftAlign={false}
          setSortBy={setSortBy} showSearchBar={true} showSortBar={true} showCategoryBar={true} showNewsPerPageBar={true} showCreateButton={true}        />  
        <Box sx={statContainer}>
          <Box sx={leftStat}>
            <Statistic
              title="News today: 82"
              number={5}
              numberDescription="News today compared to yesterday"
            ></Statistic>
          </Box>
          <Box sx={rightStats}>
            <Statistic
              title="News today: 82"
              number={-5}
              numberDescription="News today compared to yesterday"
            ></Statistic>
            <Statistic
              title="News today: 82"
              number={-10}
              numberDescription="News today compared to yesterday"
            ></Statistic>
          </Box>
        </Box>
      </Container>
      <Grid container spacing={2}>
        {articles.map((article) => {
          return (
            <Grid item xs={6} key={article.id}>
              <NewsCard
                title={article.title}
                image={'empty'}
                description={article.preview}
                timeLocation={article.timestamp.toString()}
                tags={[]}
                icon={article.category}
                large={false}
                articleURL={article.url}
                coords={{ lat: article.lat, lng: article.lon }}
                id={article.id}
                onDelete={(id) => {}}
              ></NewsCard>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
export default Home;
