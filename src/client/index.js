import React from 'react';
import { render } from 'react-dom';
import {
  BrowserRouter as Router
} from 'react-router-dom';
import { Provider } from 'react-redux';

import App from '../common/App';
import routes from '../common/routes';
import configureStore from '../common/store/configureStore';

// Compile an initial state
// I guess this could come from an API call
const preloadedState = {};

// Create a new Redux store instance
const store = configureStore(preloadedState);
const router = (
  <Provider store={ store }>
    <Router>
      <App routes={ routes } initialData={ window.DATA } />
    </Router>
  </Provider>
);

// Render it to DOM
render(router, document.getElementById('root'));

if (module.hot) {
  module.hot.accept();
}