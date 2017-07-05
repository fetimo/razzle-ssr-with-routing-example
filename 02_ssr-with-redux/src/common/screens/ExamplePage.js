import React, { Component } from 'react';
import Helmet from 'react-helmet';
import withSSR from './withSSR';
import Nav from '../components/Nav';

class Page extends Component {
  static async getInitialProps({ match, req, res, axios }) {
    try {
      const {
        data,
      } = await axios.get(
        `https://gist.githubusercontent.com/fetimo/1b88c35769dcf6e17cb2/raw/4516a0845ae9c779b3d7041b29d527d5059fc41e/temperature.json`,
        {
          headers: {
            'content-type': 'application/json',
            accept: 'application/json',
          },
        }
      );
      return {
        content: {
          rendered: data.map((temperature, i) => {
            return (
              <tr >
                <td>{temperature.year}</td>
                <td>{temperature.Winter}</td>
                <td>{temperature.Summer}</td>
              </tr>
            );
          }),
          raw: data
        }
      };
    } catch (e) {
      return { something: 'else' };
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params.slug !== this.props.match.params.slug) {
      this.props.refetch();
    }
  }

  render() {
    var data;
    if (this.props.content) {
      data = this.props.content.rendered;
    }
    return (
      <div>
        <Nav />
        <table>
          <thead>
            <tr>
              <td>Year</td>
              <td>Summer</td>
              <td>Winter</td>
            </tr>
          </thead>
          <tbody>
            { this.props.content && this.props.content.raw.map((temperature, i) => {
            return (
              <tr key={i}>
                <td>{temperature.year}</td>
                <td>{temperature.Winter}</td>
                <td>{temperature.Summer}</td>
              </tr>
            );
          }) }
          </tbody>
        </table>
      </div>
    );
  }
}

export default withSSR(Page);