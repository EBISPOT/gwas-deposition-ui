import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import ElixirAuthService from '../ElixirAuthService';

import { AuthConsumer } from '../auth-context';

import history from "../history";
import { Typography } from '@material-ui/core';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const gwasContact = <a href="mailto:gwas-subs@ebi.ac.uk">gwas-info@ebi.ac.uk</a>;

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
        const token = event.newValue;
        localStorage.removeItem("tokenEvent");

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
        window.addEventListener('storage', this.handleLogin);
    }

    componentWillUnmount() {
        window.removeEventListener('storage', this.handleLogin);
    }

    /**
    * Check if the message is coming from the same domain we use to generate
    * the SSO URL, otherwise it's iffy and shouldn't trust it.
    */
    messageIsAcceptable(event) {
        return event.key === 'tokenEvent' && event.newValue;
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
                        Log in using your institution!
                    </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <div
                        style={{
                            display: 'inline-block',
                            boxShadow: '3px 5px 3px rgba(0, 0, 0, 0.2)',
                            overflow: 'hidden', transition: 'transform 0.3s, box-shadow 0.3s'
                        }}
                    >
                        <img onClick={this.ElixirAuthService.login} alt="CILogon"
                             src="https://cilogon.org/images/cilogon-ci-32-g.png" style={{
                            cursor: 'pointer', width: '100%',
                            height: '100%',
                            display: 'block',
                        }}/>
                    </div>
                </Grid>

                <Grid item xs={12} sm={8}>
                    <Typography>
                        The GWAS Submission system uses CILogon to allow you to log in, which integrates with Google,
                        ORCID and most academic institutions.
                    </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Typography>
                        If you have problems logging in please contact {gwasContact}.
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

