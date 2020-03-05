import React, { Fragment } from 'react';

// import { UserConsumer } from '../user-context';
import { AuthConsumer } from '../auth-context';

import PublicationsMatTable from '../PublicationsMatTable';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';


const styles = theme => ({
    fontStyle: {
        fontWeight: 600,
    },
    banner: {
        backgroundColor: '#FFF6EC',
        fontWeight: 800,
        border: '1px solid #C0C0C0',
        borderRadius: '5px',
        padding: '8px',
    }
});

class Home extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <Fragment>
                <Grid container
                    direction="column"
                    justify="space-evenly"
                    alignItems="center"
                    spacing={4}>
                    <Grid item xs={8}>
                        <Typography gutterBottom variant="h5" className={classes.banner}>
                            Login access to the Submission page is unavailable on 05-Mar-2020 from 10:00am-12:00pm GMT.
                            Apologies for any inconvenience.
                        </Typography>
                    </Grid>
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
                                You can search all GWAS Catalog publications,
                                including those in the curation queue. If you are an author of the publication
                                and have available summary statistics, please click on the PMID to a
                                create submission. Before submission, please <a href={process.env.REACT_APP_GWAS_DOC_BASE + '/summary-statistics-format'} target="_blank" rel="noopener noreferrer">ensure
                                your files conform to our standard format</a>.
                                <br /><br />
                                For additional information <a href={process.env.REACT_APP_GWAS_DOC_BASE + '/submission'} target="_blank" rel="noopener noreferrer">please read the documentation</a>.
                                If you cannot find your publication, or need further help,
                                please e-mail <a href="mailto:gwas-info@ebi.ac.uk?subject=Deposition submission help request">gwas-info@ebi.ac.uk</a>.
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

                    <PublicationsMatTable />

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
