import type { NextPage } from 'next';
import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import MapContextProvider from '../components/Map/MapContextProvider';
import MapFeature from '../components/Map/MapFeature';
import Head from 'next/head';

const Home: NextPage = () => (
  <div>
    <Head>
      <title>SATLAS NEWS</title>
    </Head>
    <Navbar page={0} />
    <MapContextProvider>
      <MapFeature />
    </MapContextProvider>
  </div>
);

export default Home;
