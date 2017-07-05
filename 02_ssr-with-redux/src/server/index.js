import express from 'express';
import React from 'react';
import axios from 'axios';
import serialize from 'serialize-javascript';
import ReactHelmet from 'react-helmet';
import { renderToString } from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router-dom';
import { Provider } from 'react-redux';

import App from '../common/App';
import ErrorComponent from '../common/_error';
import routes from '../common/routes';
import configureStore from '../common/store/configureStore';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();
server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', async (req, res) => {
    const context = {};
    // This data fetching technique came from a gist by @ryanflorence
    // @see https://gist.github.com/ryanflorence/efbe562332d4f1cc9331202669763741
    try {
      // We block rendering until all promises have resolved
      const data = await Promise.all(
        routes.map((route) => {
          const match = matchPath(req.url, route);
          return match && route.component.getInitialProps
            ? route.component.getInitialProps({ match, req, res, axios })
            : null;
        })
      );

      // Compile an initial state
      // I guess this could come from an API call
      const preloadedState = {};

      // Create a new Redux store instance
      const store = configureStore(preloadedState);

      // Pass our routes and data array to our App component
      const markup = renderToString(
        <Provider store={ store }>
          <StaticRouter context={ context } location={ req.url }>
            <App routes={ routes } initialData={ data } />
          </StaticRouter>
        </Provider>
      );

      // We rewind ReactHelmet for meta tags
      const head = ReactHelmet.renderStatic();
     
     
      if (context.url) {
        res.redirect(context.url);
      } else {
        res.status(200).send(
          `<!doctype html>
        <html lang="">
        <head>
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta charSet='utf-8' />
            ${ head.title.toString() }
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <script src="${ assets.client.js }" defer></script>
            ${ head.meta.toString() }
            ${ head.link.toString() }
        </head>
        <body>
            <div id="root">${ markup }</div>
            <script>window.DATA = ${ serialize(data) };</script>
        </body>
    </html>`
        );
      }
    } catch (e) {
      console.log('in server catch');
      console.log(e);
      const markup = renderToString(<ErrorComponent error={ e } />);
      // We rewind ReactHelmet for meta tags
      const head = ReactHelmet.renderStatic();
      res.status(e.response ? e.response.status : 500).send(
        `<!doctype html>
          <html lang="">
          <head>
              <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
              <meta charSet='utf-8' />
              ${ head.title.toString() }
              <meta name="viewport" content="width=device-width, initial-scale=1">
              ${ head.meta.toString() }
              ${ head.link.toString() }
          </head>
          <body>
              <div id="root">${ markup }</div>
          </body>
      </html>`
      );
    }
  });

export default server;