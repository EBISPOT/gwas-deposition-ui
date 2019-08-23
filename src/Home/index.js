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
                            <Typography variant="h5" gutterBottom>
                                Welcome to the GWAS Deposition App
                            </Typography>
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
