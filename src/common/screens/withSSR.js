import React from 'react';
import axios from 'axios';

// This is a Higher Order Component that implement's a Next.js-like data
// fetching API, but with few UX improvements...
//
// 1) It does NOT fully block render on client-side transitions after the
// first server-render, but rather exposes an `isLoading` prop to the wrapped
// component.
//
// 2) While errors that occur server-side are handled with a custom
// `_error.js`, client-side errors are passed down to the wrapped component
// through an `error` prop. Other options would be to make the HOC accept
// an ErrorComponent on a per-page basis, or just show the `_error`.js component
// on the client too.
//
// 3) getInitialProps() is passed down through `refetch` prop, so it can be
// manually called from a wrapped component. This is useful in situations where
// you need to use componentDidUpdate()
//
export default function Page(WrappedComponent) {
  class Page extends React.Component {
    static getInitialProps(ctx) {
      // Need to call the wrapped components getInitialProps if it exists, else
      // we just return null
      return WrappedComponent.getInitialProps
        ? WrappedComponent.getInitialProps(ctx)
        : Promise.resolve(null);
    }

    constructor(props) {
      super(props);
      this.state = {
        data: props.initialData,
        isLoading: !!props.initialData,
      };
    }

    componentDidMount() {
      if (!this.state.data) {
        // This will NOT run on initial server render, because this.state.data
        // will exist. However, we want to call this on all subsequent client
        // route changes
        this.fetchData();
      }
    }

    fetchData = () => {
      // if this.state.data is undefined, that means that the we are on the client.
      // To get the data we need, we just call getInitialProps again. We pass
      // it react-router's match, as well as an axios instance. As req and res
      // don't exist in browser-land, they are omitted.
      this.setState({ isLoading: true });
      this.constructor.getInitialProps({ match: this.props.match, axios }).then(
        data => this.setState({ data, isLoading: false }),
        error =>
          this.setState({
            // We can gracefully expose errors on the client, by also keeping
            // them in state.
            data: { error },
            isLoading: false,
          })
      );
    };

    render() {
      // Just like Next.js's `getInitialProps`, we flatten out this.state.data.
      // However, one big difference from next, is that we do NOT block client
      // transitions. So we passing `isLoading` down. Finally, we pass down
      // this.fetchData so it is available to routes that need to do force
      // refreshes. For example, sibling routes that need to call
      // componentDidUpdate(), can then just refetch().
      const { initialData, ...rest } = this.props;
      return (
        <WrappedComponent
          {...rest}
          refetch={this.fetchData}
          isLoading={this.state.isLoading}
          {...this.state.data}
        />
      );
    }
  }

  // Set out component's displayName. This just makes debugging easier.
  // Components will show as Page(MyComponent) in react-dev-tools.
  Page.displayName = `Page(${getDisplayName(WrappedComponent)})`;
  return Page;
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}