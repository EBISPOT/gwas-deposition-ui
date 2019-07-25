import React, { Fragment } from 'react';
import './App.css';
import Login from './Login';
import MenuAppBar from './MenuAppBar';
import Home from './Home';
import { Route } from "react-router-dom";

import { withRouter } from "react-router";

import DemoMUITable from "./DemoMUITable";
import DemoMUITable_RemoteData from "./DemoMUITable_RemoteData";
// import DemoMUITable_Native_RemoteData from "./DemoMUITable_Native_RemoteData";
// import MUIConfigTable from "./DemoMUIDatatables";
// import Example from "./DemoMUIDatatables_RemoteData";
// import DemoMUIDT_Remote from "./DemoMUIDT_Remote";

import {
  CssBaseline,
  withStyles,
} from '@material-ui/core';


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
      <Route path="/demo" component={DemoMUITable}></Route>
      {/* <Route path="/demo_native_remote_data" component={DemoMUITable_Native_RemoteData}></Route> */}
      <Route path="/demo_remote_data" component={DemoMUITable_RemoteData}></Route>
      {/* <Route path="/demo_config_table" component={MUIConfigTable}></Route>
      <Route path="/demo_config_table_remote" component={Example}></Route>
      <Route path="/demo_remote" component={DemoMUIDT_Remote}></Route> */}
    </main>
  </Fragment>
);

export default withRouter(withStyles(styles)(App));

