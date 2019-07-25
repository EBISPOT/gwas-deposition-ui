import React, { Component } from 'react';
import Container from '@material-ui/core/Container';

import { UserConsumer } from '../user-context';
import { AuthConsumer } from '../auth-context';

// import Publications from '../Publications';
import PublicationsMatTable from '../PublicationsMatTable';


class Home extends Component {
    render() {
        return (
            <Container>
                <div>Welcome to the GWAS Deposition App</div>
                <UserConsumer>
                    {({ username }) => <h1>Welcome {username}!</h1>}
                </UserConsumer>

                <h4> JWTToken: {this.props.token}</h4>

                {/* Alternative option to get info from Context with just "export default Home" */}
                <AuthConsumer>
                    {({ isAuthenticated }) => <h4> Login State: {isAuthenticated.toString()}</h4>}
                </AuthConsumer>

                {/* <Publications /> */}
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
