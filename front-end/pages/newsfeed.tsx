import axios, { AxiosResponse } from 'axios';
import { NextPage } from 'next';
import React, { useEffect, useState, ChangeEvent, useContext } from 'react';
import Navbar from '../components/Navbar/Navbar';
import NewsCard from '../components/NewsCard/NewsCard';
import PaginationComponent from '../components/Pagination/PaginationComp';
import SearchSortComponent from '../components/SearchSortComponent/SearchSortComponent';
import { Container, Grid } from '@mui/material';
import NewsArticle from '../types/NewsArticle';
import Head from 'next/head';
import { SnackbarContext } from '../components/Snackbar/SnackbarContextProvider';
import { LoaderContext } from '../components/Loader/LoaderContextProvider';
import { useAuth0 } from '../components/Authentication/AzureAuth0Provider';

const NewsFeed: NextPage = () => {
  const {user} = useAuth0();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [newsAmount, setNewsAmount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [newsPerPage, setNewsPerPage] = useState(10);
  const [tags, setTags] = useState<string[]>([]);
  const [searchedArticles, setSearchedArticles] = useState({
    error: false,
    articles: [] as NewsArticle[],
    dropdownArticles: [] as NewsArticle[],
    dropdownVisible: false,
  });
  const [displaySearched, setDisplaySearch] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [sortBy, setSortBy] = useState<string>('datedesc');
  const [loadingSearches, setLoadingSearches] = useState(false);

  const {
    actions: { openSnackbar },
  } = useContext(SnackbarContext);

  const {
    actions: { displayLoader, dataIsLoaded },
  } = useContext(LoaderContext);

  let indexOfLastNews = 0;
  let indexOfFirstNews = 0;
  let currentNews: NewsArticle[] = [];

  useEffect(() => {
    (async () => {
        displayLoader('topbar');
        await fetchNews();
        dataIsLoaded();
        changeAmount(newsPerPage);
    })();
  }, [currentPage, newsPerPage, tags, sortBy]);

  async function fetchNews() {
    try {
      if (!displaySearched) {
        const skipAmount = (currentPage - 1) * newsPerPage;

        const result: AxiosResponse<{
          totalAmount: number;
          articles: NewsArticle[];
        }> = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}api/newsarticles?amount=${newsPerPage}&skip=${skipAmount}&tags=${tags}&sortby=${sortBy}`
        );

        if (result.data.totalAmount == 0) {
          setNewsAmount(result.data.totalAmount);
          setNews(result.data.articles);
        }

        if (result.data.totalAmount && result.data.articles) {
          setNewsAmount(result.data.totalAmount);
          setNews(result.data.articles);
        }
      }
    } catch (error) {
      console.error(error);
      openSnackbar('error', 'There was an error fetching news!');
    }
  }

  const maxResultsInSearchDropdown = 10;

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

  const displayedNews = displaySearched ? searchedArticles.articles : news;

  if (newsPerPage < displayedNews.length) {
    indexOfLastNews = currentPage * newsPerPage;
    indexOfFirstNews = indexOfLastNews - newsPerPage;
  } else {
    indexOfLastNews = displayedNews.length;
    indexOfFirstNews = indexOfLastNews - displayedNews.length;
  }

  currentNews = displayedNews.slice(indexOfFirstNews, indexOfLastNews);

  const paginate = (pageNumber: number) => {
    if (!(pageNumber < 1 || pageNumber > Math.ceil(newsAmount / newsPerPage))) {
      setCurrentPage(pageNumber);
    } else {
      setCurrentPage(1);
    }
  };

  const changeAmount = (postPerPage: number) => {
    setNewsPerPage(postPerPage);
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

  return (
    <>
      <Head>
        <title>News feed - SATLAS NEWS</title>
      </Head>
      <Navbar page={1} />
      <Container maxWidth="xl">
        <SearchSortComponent
          updateAmount={changeAmount}
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
          sortBy={sortBy}
          setSortBy={setSortBy}
          leftAlign={false}

          showSearchBar={true}
          showSortBar={true}
          showCategoryBar={true}
          showNewsPerPageBar={true}

          displayLoader={loadingSearches}
          showCreateButton={user !== undefined} // only show the create button if the user is logged in
        />
        <Grid container rowSpacing={3} columnSpacing={6}>
          {currentNews &&
            currentNews.map((card) => (
              <Grid key={card.id} item xs={12} sm={6} md={6} lg={6}>
                <NewsCard
                  title={card.title}
                  description={card.shortdescription}
                  timeLocation={card.timestamp.toString()}
                  image={card.previewImage}
                  tags={card.tags}
                  icon={card.icon}
                  large={true}
                  articleURL={card.url}
                  coords={{ lat: card.lat, lng: card.lon }}
                  id={card.id}
                  onDelete={(id) => {
                    setNews(currentNews.filter((e) => e.id !== id));
                  }}
                />
              </Grid>
            ))}
        </Grid>
        <PaginationComponent
          newsPerPage={newsPerPage}
          totalNews={
            displaySearched ? searchedArticles.articles.length : newsAmount
          }
          paginate={paginate}
        />
      </Container>
    </>
  );
};

export default NewsFeed;
