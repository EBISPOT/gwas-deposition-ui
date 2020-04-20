import React, { Fragment } from 'react';

// import { UserConsumer } from '../user-context';
import { AuthConsumer } from '../auth-context';

// import PublicationsMatTable from '../PublicationsMatTable';
import TextMobileStepper from '../ProjectForm/TextMobileStepper';
import { Grid, Typography } from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';


const styles = theme => ({
    fontStyle: {
        fontWeight: 600,
    }
});

class Home extends React.Component {
    clearAnswer = () => {
        localStorage.removeItem('answer')
    }

    componentDidMount() {
        this.clearAnswer();
    }

    render() {
        const { classes } = this.props;
        return (
            <Fragment>
                <Grid container
                    direction="column"
                    justify="space-evenly"
                    alignItems="center"
                    spacing={4}>
                    <Grid item>
                        <Typography gutterBottom variant="h5" className={classes.fontStyle}>
                            Welcome to the GWAS Catalog submission page
                        </Typography>
                    </Grid>
                    <Grid container
                        direction="column"
                        justify="center"
                        alignItems="center"
                    >
                        <Grid item xs={9}>
                            <Typography gutterBottom variant="body1">
                                We accept summary statistics for both published and unpublished human genome-wide association studies.
                                If you are the author or owner of a summary statistics dataset, please first <a href={process.env.REACT_APP_GWAS_DOC_BASE + '/summary-statistics-format'} target="_blank" rel="noopener noreferrer">
                                    ensure that your files conform to our standard format</a>. Then complete the following questionnaire to begin your submission.
                               </Typography>
                        </Grid>
                        {/* <Grid item xs={9}>
                            <h4> JWTToken: {this.props.token}</h4>
                        </Grid> */}
                    </Grid>


                    {/* <UserConsumer>
                    {({ username }) => <h1>Welcome {username}!</h1>}
                </UserConsumer> */}

                    {/* <h4> JWTToken: {this.props.token}</h4> */}

                    {/* Alternative option to get info from Context with just "export default Home" */}
                    {/* <AuthConsumer>
                    {({ isAuthenticated }) => <h4> Login State: {isAuthenticated.toString()}</h4>}
                </AuthConsumer> */}

                    {/* <PublicationsMatTable /> */}
                    <TextMobileStepper />

                    <Grid item xs={9}>
                        <Typography gutterBottom variant="body1">
                            For additional information <a href={process.env.REACT_APP_GWAS_DOC_BASE + '/submission'} target="_blank" rel="noopener noreferrer">
                                please read the documentation</a>.
                                If you need further help, please e-mail <a href="mailto:gwas-info@ebi.ac.uk?subject=Deposition submission help request">gwas-info@ebi.ac.uk</a>.
                            </Typography>
                    </Grid>

                </Grid>
            </Fragment>
        )
    }
}

Home.propTypes = {
    classes: PropTypes.object.isRequired,
};
Home = withStyles(styles)(Home)

export default () => (
    <AuthConsumer>
        {({ onAuthenticate, JWTToken }) => <Home onAuthenticate={onAuthenticate} token={JWTToken} />}
    </AuthConsumer>
)
