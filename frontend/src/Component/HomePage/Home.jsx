import React from 'react';
import { Welcome } from './welcome.jsx';
import { Why } from './Why.jsx';
import { How } from './How.jsx';
import { Categories } from './Categories.jsx';



export const Home = () => {
  return (
    <>
      <Welcome />
      <Why />
      <Categories />
      <How />
    </>
  );
};