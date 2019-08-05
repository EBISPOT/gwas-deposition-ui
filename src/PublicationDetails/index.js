import React, { Component } from 'react';
import Container from '@material-ui/core/Container';

import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { AuthConsumer } from '../auth-context';

import API_CLIENT from '../apiClient';
import history from "../history";


// THIS WORKS
// const PublicationDetails = ({ location }) => {
//     (console.log(location));
//     return (
//         // <div>{location.state.pmid}</div> // undefined if page opened in new tab
//         <div>{location.pathname}</div>
//     )
// }
// export default PublicationDetails;


const styles = theme => ({
    root: {
        padding: theme.spacing(3, 2),
    },
    button: {
        margin: theme.spacing(1),
        color: 'white',
        textTransform: 'none',
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    },
    iconSmall: {
        fontSize: 20,
    },
});


class PublicationDetails extends Component {
    constructor(props) {
        super(props)
        this.API_CLIENT = new API_CLIENT();
        // NOTE: PUBMED_ID is passed from location prop in Route pathname
        this.PUBMED_ID = this.props.location.pathname.split('/')[2];

        this.state = ({
            publication: [],
            error: null,
        })
        this.testButton = this.testButton.bind(this);
        this.createSubmission = this.createSubmission.bind(this);
    }

    /**
     * Get Publication details
     */
    async componentDidMount() {
        console.log("** Called getPublication...")

        this.API_CLIENT.getPublication(this.PUBMED_ID).then((data) =>
            this.setState({ ...this.state, publication: data })
        );
    }

    /**
     * Create submission for this publication
     */
    createSubmission() {
        console.log("** Called createSubmission for PMID: ", this.PUBMED_ID)
        let pmid = this.PUBMED_ID;

        // Check if user is logged in, Get token from local storage
        if (localStorage.getItem('id_token')) {
            let JWTToken = localStorage.getItem('id_token')
            this.API_CLIENT.createSubmission(pmid, JWTToken).then(response => {
                this.setState(() => ({ error: false }));

                history.push('/submissions');
            })
                .catch(error => {
                    this.setState(() => ({ error: true }));
                    alert("There was an error creating the submission")
                })
        }
        else {
            alert("Please login to create a submission")
            history.push('/login');
        }
    }

    testButton() {
        alert('Button clicked!')
    }


    render() {
        const { classes } = this.props;
        const { error } = this.state;

        return (
            <Container>

                <div>
                    <Paper className={classes.root}>
                        <Typography variant="h5" component="h3">
                            Publication details for <i>{this.PUBMED_ID}</i>
                        </Typography>
                        <Typography component="h4">
                            <div>
                                {this.state.publication.title}
                            </div>

                            <div>
                                {this.state.publication.firstAuthor} et al., {this.state.publication.publicationDate}, {this.state.publication.journal}
                            </div>
                        </Typography>

                        <Typography>
                            Submission status: {this.state.publication.status}
                        </Typography>

                        <Button onClick={this.createSubmission} variant="contained" color="secondary" size="small" className={classes.button}>
                            Create Submission
                        </Button>

                        <Typography>
                            {error ? "There was an error creating the submission. Please try again." : null}
                        </Typography>

                    </Paper>
                </div>


                {/* <h4> JWTToken: {this.props.token}</h4> */}

                {/* Alternative option to get info from Context with just "export default Home"
                {/* <AuthConsumer>
                {({ isAuthenticated }) => <h4> Login State: {isAuthenticated.toString()}</h4>}
            </AuthConsumer> */}

            </Container>
        )
    }
}

PublicationDetails.propTypes = {
    classes: PropTypes.object.isRequired,
};

// export default withStyles(styles)(PublicationDetails);

PublicationDetails = withStyles(styles)(PublicationDetails)

export default ({ location }) => (
    <AuthConsumer>
        {({ onAuthenticate, JWTToken }) => <PublicationDetails onAuthenticate={onAuthenticate} token={JWTToken} location={location} />}
    </AuthConsumer>
)