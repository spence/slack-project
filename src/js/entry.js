import React from 'react';
import Router from 'react-router';
import routes from './routes';

Router.run(routes, (Handler, state) =>
  React.render(<Handler {...state} />, document.body)
);