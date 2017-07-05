import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import CounterContainer from '../containers/App';

class Home extends Component {
  render() {
    return (
      <div>
        <h1>Home</h1>
        <Link to={ '/slug' }>Slug</Link>
        <CounterContainer />
      </div>
    );
  }
}

export default Home;