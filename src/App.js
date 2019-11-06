import React, { Fragment } from 'react';
import Login from './Login';
import GDPR from './GDPR';
import MenuAppBar from './MenuAppBar';
import Home from './Home';
import Submissions from './Submissions';
import SubmissionDetails from './SubmissionDetails';
import Footer from './Footer';
import './App.css';
import ErrorPage from './ErrorPage';
import Feedback from './Feedback';

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
    <div className="Site">
      <div className="Site-content">
        <div>
          <MenuAppBar />
        </div>
        <div>
          <Feedback />
        </div>
        <div>
          <main className={classes.main}>
            <Route path={`${process.env.PUBLIC_URL}/`} exact component={Home} />
            <Route path={`${process.env.PUBLIC_URL}/login`} component={Login}></Route>
            <Route path={`${process.env.PUBLIC_URL}/gdpr`} component={GDPR}></Route>
            <Route path={`${process.env.PUBLIC_URL}/publication/:pmid`} exact render={props => <PublicationDetails {...props} />} />
            <Route path={`${process.env.PUBLIC_URL}/submissions`} component={Submissions} />
            <Route path={`${process.env.PUBLIC_URL}/submission/:submission_id`} exact render={props => <SubmissionDetails {...props} />} />
            <Route path={`${process.env.PUBLIC_URL}/error`} component={ErrorPage} />
          </main>
        </div>
      </div>
      <Footer />
    </div>
  </Fragment>
);

export default withRouter(withStyles(styles)(App));

