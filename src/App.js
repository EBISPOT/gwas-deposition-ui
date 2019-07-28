import React, { Fragment } from 'react';
import './App.css';
import Login from './Login';
import MenuAppBar from './MenuAppBar';
import Home from './Home';
import { Route } from "react-router-dom";

import { withRouter } from "react-router";

import {
  CssBaseline,
  withStyles,
} from '@material-ui/core';
import PublicationDetails from './PublicationDetails';


const styles = theme => ({
  main: {
    padding: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2),
    },
  },
});

const App = ({ classes }) => (
  <Fragment>
    <CssBaseline />
    <MenuAppBar />
    <main className={classes.main}>
      <Route path="/" exact component={Home} />
      <Route path="/login" component={Login}></Route>
      {/* <Route path="/publication/:pmid" render={({ match }) => <PublicationDetails />} /> */}
      <Route path="/publication/:pmid" exact render={props => <PublicationDetails {...props} />} />
    </main>
  </Fragment>
);

export default withRouter(withStyles(styles)(App));

