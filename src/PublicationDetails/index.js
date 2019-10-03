import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
// import Button from '@material-ui/core/Button';

import { AuthConsumer } from '../auth-context';

import API_CLIENT from '../apiClient';
import history from "../history";

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';


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
    paper: {
        padding: theme.spacing(2),
        height: '100%',
    },
    headerTextStyle: {
        fontWeight: 500,
    },
    publicationTitleTextStyle: {
        fontSize: 20,
        fontStyle: 'italic',
    },
    publicationTextStyle: {
        fontSize: 18,
        marginRight: 12,
    },
    publicationCatalogStatusTextStyle: {
        fontSize: 18,
        marginTop: 32,
    },
    closedMessageTextStyle: {
        fontSize: 14,
        fontStyle: 'italic'
    },
    button: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(1),
        padding: theme.spacing(1),
        color: '#333',
        background: 'linear-gradient(to bottom, #E7F7F9 50%, #D3EFF3 100%)',
        borderRadius: 4,
        border: '1px solid #ccc',
        fontWeight: 'bold',
        textShadow: '0 1px 0 #fff',
        textTransform: 'none',
        '&:disabled': {
            textShadow: 'none',
        }
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    },
    iconSmall: {
        fontSize: 20,
    },
    errorText: {
        color: 'red',
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
            transformedPublicationStatus: null,
            createSubmissionError: false,
            redirectError: false,
        })
        this.createSubmission = this.createSubmission.bind(this);
        this.redirectToSubmissionDetails = this.redirectToSubmissionDetails.bind(this);
        // this.redirectToSubmissionDetailsNEW = this.redirectToSubmissionDetailsNEW.bind(this);
        this.getUserFriendlyStatusLabels = this.getUserFriendlyStatusLabels.bind(this);
    }

    /**
     * Get Publication details
     */
    async componentDidMount() {

        this.API_CLIENT.getPublication(this.PUBMED_ID).then((data) => {
            this.setState({ ...this.state, publication: data })
            this.setState({ ...this.state, publicationStatus: data.status })
            this.setState({ ...this.state, transformedPublicationStatus: this.getUserFriendlyStatusLabels(data.status) })
        });
    }


    /**
     * Set user friendly status label
     */
    getUserFriendlyStatusLabels(status) {
        if (status === 'UNDER_SUBMISSION' || status === 'UNDER_SUMMARY_STATS_SUBMISSION'
            || status === 'PUBLISHED_WITH_SS') {
            return 'CLOSED'
        }
        if (status === 'ELIGIBLE') {
            return 'OPEN FOR SUBMISSION'
        }
        if (status === 'PUBLISHED') {
            return 'OPEN FOR SUMMARY STATISTICS SUBMISSION'
        }
    }


    /**
     * Create submission for this publication
     */
    createSubmission() {
        let pmid = this.PUBMED_ID;

        // Check if user is logged in, Get token from local storage
        if (localStorage.getItem('id_token')) {
            let JWTToken = localStorage.getItem('id_token')
            this.API_CLIENT.createSubmission(pmid, JWTToken).then(response => {
                this.setState(() => ({ createSubmissionError: false }));

                // Display list of all submissions
                // history.push(`${process.env.PUBLIC_URL}/submissions`);

                this.redirectToSubmissionDetails();

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


    // async redirectToSubmissionDetailsNEW() {
    //     let pmid = this.PUBMED_ID;

    //     // Get SubmissionId
    //     await this.API_CLIENT.getSubmissionId(pmid).then(response => {
    //         let newSubmissionId = response.data._embedded.submissions[0].submissionId
    //         return history.push(`${process.env.PUBLIC_URL}/submissionNEW/${newSubmissionId}`);
    //     }).catch(error => {
    //         console.log("There was an error getting the SubmissionID");
    //         // Display redirect error message
    //         this.setState(() => ({ redirectError: true }));
    //     });
    // }


    render() {
        const { classes } = this.props;
        // const { createSubmissionError } = this.state;
        const { redirectError } = this.state;
        const { publicationStatus } = this.state;
        const { transformedPublicationStatus } = this.state;

        let create_submission_button;
        let showSubmissionDetailsButton;
        const gwasInfoEmail = <a href="mailto:gwas-info@ebi.ac.uk?subject=Eligibility Review">gwas-info@ebi.ac.uk</a>;
        const gwasSubsEmail = <a href="mailto:gwas-subs@ebi.ac.uk">gwas-subs@ebi.ac.uk</a>;
        let closedMessage;


        // Show Create Submission button
        if (publicationStatus === 'ELIGIBLE' || publicationStatus === 'PUBLISHED') {
            create_submission_button =
                <Button onClick={this.createSubmission} className={classes.button}>
                    Create Submission
                </Button>
        } else {
            create_submission_button =
                <Button disabled variant="outlined" className={classes.button}>
                    Create Submission
                </Button>
        }

        // Show View Submission details button
        if (publicationStatus === 'UNDER_SUMMARY_STATS_SUBMISSION' || publicationStatus === 'UNDER_SUBMISSION') {
            showSubmissionDetailsButton =
                <Button onClick={this.redirectToSubmissionDetails} className={classes.button}>
                    View Submission Details
                </Button>
        }

        // Show reason why Publication status is CLOSED
        if (publicationStatus === 'UNDER_SUBMISSION' || publicationStatus === 'UNDER_SUMMARY_STATS_SUBMISSION') {
            closedMessage =
                <span>
                    This publication is currently under submission. Please check back
                    for updates or email {gwasInfoEmail} for additional information.
                </span>
        }
        if (publicationStatus === 'PUBLISHED_WITH_SS') {
            closedMessage =
                <span>
                    This publication and associated summary statistics are already available in the GWAS Catalog.
                    If you would like to submit additional data or request a change to the GWAS Catalog entry
                    please email {gwasSubsEmail}.
                </span>
        }




        return (
            <div className={classes.root}>
                <Paper className={classes.paper}>
                    <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="flex-start"
                    >
                        <Grid item xs={12}>
                            <Grid
                                container
                                direction="row"
                                justify="flex-start"
                                alignItems="flex-start"
                            >
                                <Grid item xs={8}>
                                    <Typography variant="h5" className={classes.headerTextStyle}>
                                        Publication details for PMID: {this.PUBMED_ID}
                                    </Typography>
                                </Grid>

                                <Grid item xs={4} container alignItems="flex-start" justify="flex-end" direction="row">
                                    {showSubmissionDetailsButton}
                                    <Typography variant="body2" gutterBottom className={classes.errorText}>
                                        {redirectError ? "There was an error displaying the submission details." : null}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h6" className={classes.publicationTitleTextStyle}>
                                    {this.state.publication.title}
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography className={classes.publicationTextStyle} >
                                    {this.state.publication.firstAuthor} et al. {this.state.publication.publicationDate} {this.state.publication.journal}
                                </Typography>
                            </Grid>

                            {/* <Grid container item xs={12}> */}
                            <Grid item xs={12}>
                                <Typography className={classes.publicationCatalogStatusTextStyle}>
                                    Catalog status: {transformedPublicationStatus}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography className={classes.closedMessageTextStyle}>
                                    {closedMessage}
                                </Typography>
                            </Grid>
                            {/* </Grid> */}

                            {create_submission_button}

                        </Grid>
                    </Grid>

                </Paper>
            </div >


            // <h4> JWTToken: {this.props.token}</h4>

            //Alternative option to get info from Context with just "export default Home"
            // <AuthConsumer>
            //     {({ isAuthenticated }) => <h4> Login State: {isAuthenticated.toString()}</h4>}
            // </AuthConsumer>

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
