import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';

import { AuthConsumer } from '../auth-context';

import history from "../history";
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
    Checkbox: {
        color: 'primary',
    },
});


class GDPR extends Component {
    constructor(props) {
        super(props);

        this.state = {
            gdprCheckbox: false,
        }

        // Check for previous GDPR acceptance
        if (localStorage.getItem('gdpr-accepted')) {
            // Redirect to Login page if GDPR was accepted before
            history.push(`${process.env.PUBLIC_URL}/login`);
        }

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = event => {
        this.setState({ checked: event.target.checked });

        // Set gdpr acceptance status if checked
        if (event.target.checked) {
            localStorage.setItem('gdpr-accepted', true);

            // Redirect to Login page
            history.push(`${process.env.PUBLIC_URL}/login`);
        }
        // TODO: Check for use case to revoke GDPR acceptance status
        else {
            localStorage.removeItem('gdpr-accepted');
        }
    }


    render() {
        return (
            <Grid container
                direction="column"
                justify="space-evenly"
                alignItems="center"
                spacing={3}>
                <Grid item xs={12} sm={6}>
                    <Typography>
                        Some description as needed about GDPR...
                    </Typography>
                </Grid>
                <Grid item container
                    direction="row"
                    justify="center"
                    alignItems="center"
                    xs={12} sm={6}>
                    <Checkbox color='primary'
                        onChange={this.handleChange}
                        checked={this.state.checkedBox}
                        value="gdprCheckbox"
                    />
                    <Typography>
                        Add GDPR Acceptance text here!
                    </Typography>
                </Grid>
            </Grid>
        )
    }
}

GDPR.propTypes = {
    classes: PropTypes.object.isRequired,
};

GDPR = withStyles(styles)(GDPR);

export default () => (
    <AuthConsumer>
        {(context) => (
            <GDPR
                isAuthenticated={context.isAuthenticated}
                onAuthenticate={context.onAuthenticate}
                onLogout={context.onLogout}
            />
        )}
    </AuthConsumer>
)

