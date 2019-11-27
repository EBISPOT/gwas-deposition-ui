import React, { Component } from 'react';
import elixir_login_button from '../elixir_logo.png';

import Grid from '@material-ui/core/Grid';
import ElixirAuthService from '../ElixirAuthService';
// import jwt_decode from 'jwt-decode';

import { AuthConsumer } from '../auth-context';

import history from "../history";
import { Typography } from '@material-ui/core';
import Link from '@material-ui/core/Link';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';


const AAP_URL = process.env.REACT_APP_AAPURL;

const elixirRegisterationLink = "https://elixir-europe.org/register";

const elixirLoginContact = <a href="mailto:aai-contact@elixir-europe.org">aai-contact@elixir-europe.org</a>;

const styles = theme => ({
    linkColor: {
        color: '#0000EE',
        '&:visted': {
            color: '#551A8B'
        }
    },
    span: {
        fontWeight: 'bold',
    },
    button: {
        margin: theme.spacing(1),
        color: '#333',
        background: 'linear-gradient(to bottom, #E7F7F9 50%, #D3EFF3 100%)',
        borderRadius: 4,
        border: '1px solid #ccc',
        fontWeight: 'bold',
        textShadow: '0 1px 0 #fff',
        width: 120,
        height: 40,
    },
});

class Login extends Component {
    constructor(props) {
        super(props);

        this.ElixirAuthService = new ElixirAuthService();

        // Check if token is still valid --> Check if working properly!
        if (this.ElixirAuthService.isTokenExpired(this.token)) {
            // TODO: Add method to refresh token
            // console.log("** Need to refresh token")
        } else {
            // console.log("** Token is still valid")
            // Set Auth Context 
            // this.props.onAuthenticate(this.ElixirAuthService.getToken());

            // Redirect to Home page if token is still valid
            // history.push("/");
        }
        this.handleLogin = this.handleLogin.bind(this);
    }


    handleLogin = (event) => {
        // Example: https://gitlab.ebi.ac.uk/tools-glue/ng-ebi-authorization/blob/master/src/auth/auth.service.ts
        // console.log("** Elixir Button clicked!")
        this.ElixirAuthService.login();

        // console.log("** Event: ", event)
        // console.log("** Token: ", event.data);

        if (!this.messageIsAcceptable(event)) {
            return;
        }

        // Store JWT in local storage
        const token = event.data;
        this.ElixirAuthService.setToken(token);

        // Set Auth Context 
        this.props.onAuthenticate(token);

        // Close pop-up login window after token is received
        if (event.source) {
            (window.event.source).close();
        }

        // var decoded = jwt_decode(token);
        // console.log("** Decoded Token: ", decoded);

        // Redirect to Home page on successful authentication
        history.push(`${process.env.PUBLIC_URL}`);
    }

    componentDidMount() {
        window.addEventListener("message", this.handleLogin);
        // console.log("** Add \"handleLogin\" Event listener")
    }

    componentWillUnmount() {
        window.removeEventListener('message', this.handleLogin);
        // console.log("** Removed \"handleLogin\" Event listener")
    }

    /**
    * Check if the message is coming from the same domain we use to generate
    * the SSO URL, otherwise it's iffy and shouldn't trust it.
    */
    messageIsAcceptable(event) {
        return event.origin === AAP_URL;
    }

    render() {
        const { classes } = this.props;

        return (
            <Grid container
                direction="column"
                justify="space-evenly"
                alignItems="center"
                spacing={3}>
                <Grid item xs={12} sm={6}>
                    <Typography>
                        Single Sign On using your ELIXIR identity!
                    </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <button onClick={this.handleLogin} className={classes.button}>
                        < span >
                            <img src={elixir_login_button} alt="login" style={{ height: '2em', verticalAlign: 'middle', paddingRight: '4px' }} />
                            LOGIN
                        </span>
                    </button>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Typography>
                        You can use the ELIXIR identity service and other ELIXIR services with the freely available
                        ELIXIR identity, which integrates with Google, ORCID and most academic institutions.

                        Obtain your ELIXIR identity <Link href={elixirRegisterationLink} className={classes.linkColor}>here</Link>.
                    </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Typography>
                        If you have problems logging in please contact {elixirLoginContact}.
                    </Typography>
                </Grid>
            </Grid >
        )
    }
}
// export default Login

Login.propTypes = {
    classes: PropTypes.object.isRequired,
};

Login = withStyles(styles)(Login);

export default () => (
    <AuthConsumer>
        {(context) => (
            <Login
                isAuthenticated={context.isAuthenticated}
                onAuthenticate={context.onAuthenticate}
                onLogout={context.onLogout}
            />
        )}
    </AuthConsumer>
)

