import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';

import { AuthConsumer } from '../auth-context';

import history from "../history";
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
    checkboxStyle: {
        color: 'primary',
        float: "left",
        width: "5%"
    },
    gdprTextStyle: {
        marginLeft: "5%"
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
            history.push(`${process.env.PUBLIC_URL}/login`, ({ from: `${process.env.PUBLIC_URL}` + history.location.state.from }));
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = event => {
        this.setState({ checked: event.target.checked });

        // Set gdpr acceptance status if checked
        if (event.target.checked) {
            localStorage.setItem('gdpr-accepted', true);

            // Redirect to Login page
            history.push(`${process.env.PUBLIC_URL}/login`, ({ from: `${process.env.PUBLIC_URL}` + history.location.state.from }));
        }
        // TODO: Check for use case to revoke GDPR acceptance status
        else {
            localStorage.removeItem('gdpr-accepted');
        }
    }


    render() {
        const { classes } = this.props;
        const tos = "https://www.ebi.ac.uk/about/terms-of-use/";

        return (
            <div>
                <Grid container
                    direction="row"
                    justify="center"
                    alignItems="center"
                    spacing={3}>
                    <Grid item xs={5}>
                        <Checkbox className={classes.checkboxStyle}
                            onChange={this.handleChange}
                            checked={this.state.checkedBox}
                            value="gdprCheckbox"
                        />
                        <Typography className={classes.gdprTextStyle}>
                            This website requires cookies, and the limited processing of your personal data in order to function.
                            By checking this box you are agreeing to this as outlined in our
                            <a href={tos} target="_blank" rel="noopener noreferrer"> Privacy Notice and Terms of Use</a>.
                            </Typography>
                    </Grid>
                </Grid>
            </div>
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

