import React, { Fragment } from 'react';
import './App.css';
import Login from './Login';
import MenuAppBar from './MenuAppBar';
import Home from './Home';
import Submissions from './Submissions';
import SubmissionDetails from './SubmissionDetails';

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
      <Route path={`${process.env.PUBLIC_URL}/`} exact component={Home} />
      <Route path={`${process.env.PUBLIC_URL}/login`} component={Login}></Route>
      <Route path={`${process.env.PUBLIC_URL}/publication/:pmid`} exact render={props => <PublicationDetails {...props} />} />
      <Route path={`${process.env.PUBLIC_URL}/submissions`} component={Submissions} />
      <Route path={`${process.env.PUBLIC_URL}/submission/:submission_id`} exact render={props => <SubmissionDetails {...props} />} />
    </main>
  </Fragment>
);

export default withRouter(withStyles(styles)(App));

