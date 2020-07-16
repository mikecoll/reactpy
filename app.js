import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';
import AppProvider from './contexts/appProvider';

/**
 * First we will load all of this project's JavaScript dependencies which
 * includes React and other helpers. It's a great starting point while
 * building robust, powerful web applications using React + Laravel.
 */

require('./bootstrap');


ReactDOM.render((
  <AppProvider>
    <App />
  </AppProvider>
), document.getElementById('app'));
