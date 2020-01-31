import React, { Fragment } from 'react';
import { AuthConsumer } from '../auth-context';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';


const styles = theme => ({
    fontStyle: {
        fontWeight: 600,
    }
});


class ErrorPage extends React.Component {
    constructor(props) {
        super(props)

        this.state = ({
            auth: localStorage.getItem('id_token'),
        })

        // Set token to use AuthConsumer props or localstorage if page refresh
        this.props.token === null ? this.authToken = this.state.auth : this.authToken = this.props.token;
    }

    render() {
        const { classes } = this.props;

        let displayText;

        if (this.authToken) {
            displayText =
                <Grid container
                    direction="column"
                    justify="space-evenly"
                    alignItems="center"
                    spacing={4}>
                    <Grid item>
                        <Typography gutterBottom variant="h5" className={classes.fontStyle}>
                            The page you are trying to access does not exist
                        </Typography>
                    </Grid>
                    <Grid container
                        direction="column"
                        justify="center"
                        alignItems="center"
                    >
                        <Grid item xs={9}>
                            <Typography gutterBottom variant="body1">
                                The page you are trying to access does not exist. If you believe this is an error, please
                                contact <a href="mailto:gwas-info@ebi.ac.uk?subject=Deposition error">gwas-info@ebi.ac.uk</a>
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
        }
        else {
            displayText =
                <Grid container
                    direction="column"
                    justify="space-evenly"
                    alignItems="center"
                    spacing={4}>
                    <Grid item>
                        <Typography gutterBottom variant="h5" className={classes.fontStyle}>
                            Authorized GWAS users only
                        </Typography>
                    </Grid>
                    <Grid container
                        direction="column"
                        justify="center"
                        alignItems="center"
                    >
                        <Grid item xs={9}>
                            <Typography gutterBottom variant="body1">
                                This page can only be accessed by authorized users. Please login and try again.
                                If you believe this is an error, please
                                contact <a href="mailto:gwas-info@ebi.ac.uk?subject=Deposition error">gwas-info@ebi.ac.uk</a>
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
        }


        return (
            <Fragment>
                {displayText}
            </Fragment>

        )
    }
}

ErrorPage.propTypes = {
    classes: PropTypes.object.isRequired,
};
ErrorPage = withStyles(styles)(ErrorPage)

export default () => (
    <AuthConsumer>
        {({ onAuthenticate, JWTToken }) => <ErrorPage onAuthenticate={onAuthenticate} token={JWTToken} />}
    </AuthConsumer>
)
