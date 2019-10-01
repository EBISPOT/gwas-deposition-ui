import React, { Component } from 'react';
import Container from '@material-ui/core/Container';

import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
// import Button from '@material-ui/core/Button';

import { AuthConsumer } from '../auth-context';

import API_CLIENT from '../apiClient';
import history from "../history";

import Grid from '@material-ui/core/Grid';


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
        textTransform: 'none',
        color: '#333',
        background: 'linear-gradient(to bottom, #E7F7F9 50%, #D3EFF3 100%)',
        borderRadius: 4,
        border: '1px solid #ccc',
        fontWeight: 'bold',
        textShadow: '0 1px 0 #fff',

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
        if (process.env.PUBLIC_URL) {
            let URL = this.props.location.pathname.split(process.env.PUBLIC_URL)[1];
            this.PUBMED_ID = URL.split('/')[2];
        }
        else {
            this.PUBMED_ID = this.props.location.pathname.split('/')[2];
        }

        this.state = ({
            publication: [],
            publicationStatus: null,
            createSubmissionError: false,
            redirectError: false,
        })
        this.createSubmission = this.createSubmission.bind(this);
        this.redirectToSubmissionDetails = this.redirectToSubmissionDetails.bind(this);
        this.redirectToSubmissionDetailsNEW = this.redirectToSubmissionDetailsNEW.bind(this);
    }

    /**
     * Get Publication details
     */
    async componentDidMount() {
        console.log("** Called getPublication...")

        this.API_CLIENT.getPublication(this.PUBMED_ID).then((data) => {
            this.setState({ ...this.state, publication: data })
            this.setState({ ...this.state, publicationStatus: data.status })
        });
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
                this.setState(() => ({ createSubmissionError: false }));

                // Display list of all submissions
                // history.push(`${process.env.PUBLIC_URL}/submissions`);

                // this.redirectToSubmissionDetails();

                this.redirectToSubmissionDetailsNEW();

            })
                .catch(error => {
                    this.setState(() => ({ createSubmissionError: true }));
                    // alert("There was an error creating the submission")
                })
        }
        else {
            alert("Please login to create a submission")
            history.push(`${process.env.PUBLIC_URL}/login`);
        }
    }


    async redirectToSubmissionDetails() {
        let pmid = this.PUBMED_ID;

        // Get SubmissionId
        await this.API_CLIENT.getSubmissionId(pmid).then(response => {
            let newSubmissionId = response.data._embedded.submissions[0].submissionId
            return history.push(`${process.env.PUBLIC_URL}/submission/${newSubmissionId}`);
        }).catch(error => {
            console.log("There was an error getting the SubmissionID");
            // Display redirect error message
            this.setState(() => ({ redirectError: true }));
        });
    }


    async redirectToSubmissionDetailsNEW() {
        let pmid = this.PUBMED_ID;

        // Get SubmissionId
        await this.API_CLIENT.getSubmissionId(pmid).then(response => {
            let newSubmissionId = response.data._embedded.submissions[0].submissionId
            return history.push(`${process.env.PUBLIC_URL}/submissionNEW/${newSubmissionId}`);
        }).catch(error => {
            console.log("There was an error getting the SubmissionID");
            // Display redirect error message
            this.setState(() => ({ redirectError: true }));
        });
    }


    render() {
        const { classes } = this.props;
        const { createSubmissionError } = this.state;
        const { redirectError } = this.state;
        const { publicationStatus } = this.state;

        let create_submission_button;
        let showSubmissionDetailsButton;
        let showSubmissionDetailsNEWButton;


        // Show Create Submission button
        if (publicationStatus === 'ELIGIBLE' || publicationStatus === 'PUBLISHED') {
            create_submission_button =
                <button onClick={this.createSubmission} variant="contained" color="secondary" size="small" className={classes.button}>
                    Create Submission
                </button>
        } else {
            create_submission_button =
                <button disabled variant="contained" color="secondary" size="small" className={classes.button}>
                    Create Submission
                </button>
        }

        // Show View Submission details button
        if (publicationStatus === 'UNDER_SUMMARY_STATS_SUBMISSION' || publicationStatus === 'UNDER_SUBMISSION') {
            showSubmissionDetailsButton =
                <button onClick={this.redirectToSubmissionDetails} variant="contained" color="secondary" size="small"
                    className={classes.button}>
                    View Submission Details
                </button>
        }

        // Show View Submission details button
        // if (publicationStatus === 'UNDER_SUMMARY_STATS_SUBMISSION' || publicationStatus === 'UNDER_SUBMISSION') {
        //     showSubmissionDetailsNEWButton =
        //         <button onClick={this.redirectToSubmissionDetailsNEW} variant="contained" color="secondary" size="small"
        //             className={classes.button}>
        //             View Submission Details - NEW Layout
        //         </button>
        // }


        return (
            <Container>

                <div>
                    <Paper className={classes.root}>
                        <Grid
                            container
                            direction="row"
                            justify="space-between"
                            alignItems="flex-start"
                        >
                            <Grid item xs={6}>
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

                                {create_submission_button}

                                <Typography>
                                    {createSubmissionError ? "There was an error creating the submission. Please try again." : null}
                                </Typography>
                            </Grid>


                            <Grid item xs={6}>
                                <Grid
                                    container
                                    direction="column"
                                    justify="flex-start"
                                    alignItems="flex-end"
                                >
                                    <Grid item xs={6}>
                                        {showSubmissionDetailsButton}
                                    </Grid>
                                    <Grid item xs={6}>
                                        {showSubmissionDetailsNEWButton}
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="body2" gutterBottom>
                                            {redirectError ? "There was an error displaying the submission details." : null}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>

                        </Grid>

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
