import type { AppProps } from 'next/app';
import 'reflect-metadata';
import React from 'react';
import ThemeProvider from '../components/ThemeProvider/ThemeProvider';
import SnackbarContextProvider from '../components/Snackbar/SnackbarContextProvider';
import Snackbar from '../components/Snackbar/Snackbar';
import Head from 'next/head';
import { AzureAuth0Provider } from '../components/Authentication/AzureAuth0Provider';
import '../styles/globals.scss';
import LoaderContextProvider from '../components/Loader/LoaderContextProvider';

function MyApp({ Component, pageProps }: AppProps) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="shortcut icon" href="https://grasdatastorage.blob.core.windows.net/images/favicon_pos.ico" />
      </Head>
      <AzureAuth0Provider>
        <ThemeProvider>
          <LoaderContextProvider>
            <SnackbarContextProvider>
              <Snackbar/>
              <Component {...pageProps} />
            </SnackbarContextProvider>
          </LoaderContextProvider>
        </ThemeProvider>
      </AzureAuth0Provider>
    </>
  );
}

export default MyApp;
