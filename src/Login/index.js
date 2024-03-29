import React, { Component } from 'react';
import lsri_login_button from '../LS.png';

import Grid from '@material-ui/core/Grid';
import ElixirAuthService from '../ElixirAuthService';

import { AuthConsumer } from '../auth-context';

import history from "../history";
import { Typography } from '@material-ui/core';
import Link from '@material-ui/core/Link';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';


const AAP_URL = process.env.REACT_APP_AAPURL;

const LSRegistrationLink = "https://signup.aai.lifescience-ri.eu/fed/registrar/?vo=lifescience";

const LSLoginContact = <a href="mailto:support@aai.lifescience-ri.eu">support@aai.lifescience-ri.eu</a>;

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
        // this.ElixirAuthService.login();

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

        // Redirect back to page that required a login
        let referrer;
        if (history.location.state && history.location.state.from) {
            referrer = `${process.env.PUBLIC_URL}` + history.location.state.from;
        }

        if (referrer) {
            // history.push(referrer)
            history.replace({
                pathname: `${process.env.PUBLIC_URL}` + history.location.state.from,
                state: {
                    from: history.location.state.from,
                    id: history.location.state.id,
                    answer: history.location.state.answer
                }
            });
        } else {
            history.goBack();
        }
    }

    componentDidMount() {
        window.addEventListener("message", this.handleLogin);
    }

    componentWillUnmount() {
        window.removeEventListener('message', this.handleLogin);
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
                        Single Sign On using your LS Login identity!
                    </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <button onClick={this.ElixirAuthService.login} className={classes.button}>
                        < span >
                            <img src={lsri_login_button} alt="login" style={{ height: '1.7em', width: '3em', verticalAlign: 'middle', paddingRight: '2px' }} />
                            LOGIN
                        </span>
                    </button>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Typography>
                        You can use the Life Science Login identity service and other Life Science services with the freely available
                        LS Login identity, which integrates with Google, ORCID and most academic institutions.

                        Obtain your LS Login identity <Link href={LSRegistrationLink} className={classes.linkColor}>here</Link>.
                    </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Typography>
                        If you have problems logging in please contact {LSLoginContact}.
                    </Typography>
                </Grid>
            </Grid >
        )
    }
}

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

