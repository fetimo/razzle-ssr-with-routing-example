import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Nav extends Component {
  render() {
    return (
      <nav>
        <h1>Nav</h1>
        <Link to={'/slug'}>link</Link>
      </nav>
    );
  }
}

export default Nav;