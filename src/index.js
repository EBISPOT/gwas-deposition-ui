import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { ThemeProvider } from '@material-ui/styles';
import theme from './theme';

import { Router, BrowserRouter} from 'react-router-dom';

import { UserProvider } from './user-context';
import { AuthProvider } from './auth-context';

import history from "./history";

ReactDOM.render(
    <BrowserRouter forceRefresh={true} basename={'/gwas/deposition'} history={history}>
    <AuthProvider>
        <UserProvider>
            <ThemeProvider theme={theme}>
                    {/* <Security {...oktaConfig}> */}
                    < App />
                    {/* </Security> */}
            </ThemeProvider>
        </UserProvider>
    </AuthProvider>
    </BrowserRouter>
    ,
    document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
