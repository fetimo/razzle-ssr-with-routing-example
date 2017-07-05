An example app which expands on [this gist](https://gist.github.com/jaredpalmer/a73bc00cac8926ff0ad5281879b1eb90) and [this example repo](https://github.com/jaredpalmer/razzle/tree/v0.7.1/examples/with-redux). 

Install dependencies with `yarn`.

Start compilation and serving app with `yarn start`.

It features server-side routing and fetching data before render, as well as allowing the client to fetch data. It also has a Redux component with its own actions. 

At this time I'm not 100% sure if the SSR requests should be handled by Redux as well. Feedback would be appreciated.