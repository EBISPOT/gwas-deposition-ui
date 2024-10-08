import React, { Fragment } from 'react';
import Login from './Login';
import GDPR from './GDPR';
import MenuAppBar from './MenuAppBar';
import Home from './Home';
import SubmissionDetails from './SubmissionDetails';
import Footer from './Footer';
import './App.css';
import ErrorPage from './ErrorPage';
import Feedback from './Feedback';

import Form from './ProjectForm/Form';
// import Test from './ProjectForm/Test';
// import TextMobileStepper from './ProjectForm/TextMobileStepper';

import Tabs from './Tabs';

import { Route } from "react-router-dom";

import { withRouter } from "react-router";

import {
  CssBaseline,
  withStyles,
} from '@material-ui/core';
import PublicationDetails from './PublicationDetails';

import ReactGA from 'react-ga';
import history from "./history";
import BodyOfWorkDetails from './BodyOfWorkDetails';
import UpdateBodyOfWork from './UpdateBodyOfWork';
import PublicationsMatTable from './PublicationsMatTable';

ReactGA.initialize('UA-60195133-1');
//Initialize google analytics page view tracking
history.listen(location => {
  ReactGA.set({ page: location.pathname }); // Update the user's current page
  ReactGA.pageview(location.pathname); // Record a pageview for the given page
});

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
              <Route path={`${process.env.PUBLIC_URL}/curation_queue`} component={PublicationsMatTable}></Route>
              <Route path={`${process.env.PUBLIC_URL}/publication/:pmid`} exact render={props => <PublicationDetails {...props} />} />
              <Route path={`${process.env.PUBLIC_URL}/submissions`} component={Tabs} />
              <Route path={`${process.env.PUBLIC_URL}/submission/:submission_id`} exact render={props => <SubmissionDetails {...props} />} />
              {/* <Route path={`${process.env.PUBLIC_URL}/submission_questions`} component={TextMobileStepper}></Route> */}
              <Route path={`${process.env.PUBLIC_URL}/form`} component={Form}></Route>
              <Route path={`${process.env.PUBLIC_URL}/bodyofwork/:gcp_id`} exact render={props => <BodyOfWorkDetails {...props} />} />
              {/*<Route path={`${process.env.PUBLIC_URL}/update-bodyofwork`} exact render={props => <UpdateBodyOfWork {...props} />} />*/}
              <Route path={`${process.env.PUBLIC_URL}/error`} component={ErrorPage} />
            </main>
          </div>
        </div>
        <Footer />
      </div>
    </Fragment>
);

export default withRouter(withStyles(styles)(App));

