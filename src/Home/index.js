import React, { Component } from 'react';
import Container from '@material-ui/core/Container';

import { UserConsumer } from '../user-context';
import { AuthConsumer } from '../auth-context';

import PublicationsMatTable from '../PublicationsMatTable';
import { Paper, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';


class Home extends Component {
    render() {
        return (
            <Container>
                <Paper>
                    <Grid container
                        direction="column"
                        justify="space-evenly"
                        alignItems="center">
                        <Grid item>
                            <Typography gutterBottom variant="h5">
                                Welcome to the GWAS Catalog submission page
                            </Typography>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs>
                                <Paper></Paper>
                            </Grid>
                            <Grid item xs={8}>
                                <Typography gutterBottom variant="body1">
                                    In the table below, you can view all eligible GWAS Catalog publications, including those in the curation queue.
                                    If you are an author of one of these publications and have available summary statistics, please click on
                                    the publication PMID to start your submission.
                                    For additional information please read the documentation [link to “How to submit” page].
                            </Typography>

                            </Grid>
                            <Grid item xs>
                            </Grid>
                        </Grid>
                    </Grid>

                </Paper>


                {/* <UserConsumer>
                    {({ username }) => <h1>Welcome {username}!</h1>}
                </UserConsumer> */}

                {/* <h4> JWTToken: {this.props.token}</h4> */}

                {/* Alternative option to get info from Context with just "export default Home" */}
                {/* <AuthConsumer>
                    {({ isAuthenticated }) => <h4> Login State: {isAuthenticated.toString()}</h4>}
                </AuthConsumer> */}

                <PublicationsMatTable />
            </Container>
        )
    }
}
// export default Home


export default () => (
    <AuthConsumer>
        {({ onAuthenticate, JWTToken }) => <Home onAuthenticate={onAuthenticate} token={JWTToken} />}
    </AuthConsumer>
)
