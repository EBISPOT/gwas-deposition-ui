import React from 'react';
import Container from '@material-ui/core/Container';

import { UserConsumer } from '../user-context';
import { AuthConsumer } from '../auth-context';

import PublicationsMatTable from '../PublicationsMatTable';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';


const styles = theme => ({
    fontStyle: {
        fontWeight: 600,
    }
});


class Home extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <Container>
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
                        <Grid item xs={11}>
                            <Typography gutterBottom variant="body1">
                                In the search bar below, you can search all GWAS Catalog publications,
                                including those in the curation queue. If you are an author of the publication
                                and have available summary statistics, please click to “Create submission”.
                                For additional information please read the documentation. If you cannot find your
                                publication, or need further help, please e-mail <a href="mailto:gwas-info@ebi.ac.uk?subject=Deposition submission help request">gwas-info@ebi.ac.uk</a>.
                            </Typography>
                        </Grid>
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
            </Container>
        )
    }
}
// export default Home
Home.propTypes = {
    classes: PropTypes.object.isRequired,
};
Home = withStyles(styles)(Home)

export default () => (
    <AuthConsumer>
        {({ onAuthenticate, JWTToken }) => <Home onAuthenticate={onAuthenticate} token={JWTToken} />}
    </AuthConsumer>
)
