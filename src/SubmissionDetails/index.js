import React, { Component, Fragment } from 'react';
import Container from '@material-ui/core/Container';

import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { AuthConsumer } from '../auth-context';

import API_CLIENT from '../apiClient';
import history from "../history";



const styles = theme => ({
    root: {
        padding: theme.spacing(3, 2),
    },
    // root: {
    //     flexGrow: 1,
    // },
    paper: {
        padding: theme.spacing(2),
        margin: 'auto',
        maxWidth: 800,
    },
    button: {
        margin: theme.spacing(1),
        color: 'white',
        // textTransform: 'none',
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    },
    iconSmall: {
        fontSize: 20,
    },
});


class SubmissionDetails extends Component {
    constructor(props) {
        super(props)
        this.API_CLIENT = new API_CLIENT();
        // NOTE: SUBMISSION_ID is passed from location prop in Route pathname
        this.SUBMISSION_ID = this.props.location.pathname.split('/')[2];

        this.state = ({
            submission_data: [],
            publication_obj: [],
            file_upload_error: null,
            isNotValid: true,
            submission_error: null,
            overallStatusStarted: 'STARTED',
        })
        // this.uploadDataFile = this.uploadDataFile.bind(this);
        this.submitData = this.submitData.bind(this);
    }

    /**
     * Get Submission details
     */
    async componentDidMount() {
        console.log("** Called getSubmission...")

        this.API_CLIENT.getSubmission(this.SUBMISSION_ID).then((data) => {
            this.setState({ ...this.state, submission_data: data });
            this.setState({ ...this.state, publication_obj: data.publication });
            if (data.status === 'VALID_METADATA') {
                this.setState({ ...this.state, isNotValid: false });
            }
            console.log("** Get Submission Data: ", data);
        }).catch(error => {
            console.log("** Error: ", error);
        });
    }


    // enableSubmitButton() {
    //     let isValid = this.state.submission_data.status;
    //     if (isValid) {
    //         return <EnabledSubmitButton/>
    //     }
    // }


    /**
     * Upload metadata file --> This needs to use the Dropzone component
     */
    // uploadDataFile() {
    //     console.log("** Clicked on uploadDataFile method...");
    //     let submissionId = this.SUBMISSION_ID;

    //     if (localStorage.getItem('id_token')) {
    //         let JWTToken = localStorage.getItem('id_token')

    //         this.API_CLIENT.createFileUpload(submissionId, JWTToken).then(response => {
    //             this.setState(() => ({ file_upload_error: false }));
    //         })
    //             .catch(error => {
    //                 this.setState(() => ({ file_upload_error: true }));
    //                 alert("There was an error creating the submission")
    //             })
    //     }
    //     else {
    //         alert("Please login to create a submission")
    //         history.push('/login');
    //     }
    // }



    /**
     * Submit data 
     */
    submitData() {
        console.log("** Button click called submitData method...");
        let submissionId = this.SUBMISSION_ID;

        // Check if user is logged in, Get token from local storage
        if (localStorage.getItem('id_token')) {
            let JWTToken = localStorage.getItem('id_token')
            this.API_CLIENT.submitSubmission(submissionId, JWTToken).then(response => {
                this.setState(() => ({ submission_error: false }));
            })
                .catch(error => {
                    this.setState(() => ({ submission_error: true }));
                    alert("There was an error creating the submission")
                })
        }
        else {
            alert("Please login to create a submission")
            history.push('/login');
        }
    }


    render() {
        const { classes } = this.props;
        const { error } = this.state;
        const { submission_error } = this.state;
        const bull = <span className={classes.bullet}>•</span>;

        const { overallStatusStarted } = this.state;
        const isFileUploaded = this.state.submission_data.submission_status;
        let submission_stats;

        if (isFileUploaded !== overallStatusStarted) {
            submission_stats =
                <Fragment>
                    <Typography gutterBottom variant="body1">
                        Submission Stats
                </Typography>
                    <Typography gutterBottom>
                        {bull} {this.state.submission_data.study_count} studies
                </Typography>
                    <Typography gutterBottom>
                        {bull} {this.state.submission_data.association_count} total associations
                </Typography>
                    <Typography gutterBottom>
                        {bull} {this.state.submission_data.sample_count} sample groups
                </Typography>
                </Fragment>
        }

        return (
            <div className={classes.root}>
                <Paper className={classes.paper}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm container>

                            <Grid item xs container direction="column" spacing={4}>
                                <Grid item xs>
                                    <Typography gutterBottom variant="h5">
                                        Submission details for PMID: <i>{this.state.publication_obj.pmid}</i>
                                    </Typography>

                                    <Typography variant="body1" gutterBottom>
                                        {this.state.publication_obj.firstAuthor} et al., {this.state.publication_obj.publicationDate}, {this.state.publication_obj.journal}
                                    </Typography>

                                    <Grid item xs container direction="row" spacing={2}>
                                        <Grid item xs={6}>
                                            <Typography variant="body1" gutterBottom>
                                                Submission status: {this.state.submission_data.submission_status}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={4}>
                                            <Button variant="contained" color="secondary" size="small" className={classes.button}>
                                                Select Upload Files
                                            </Button>
                                        </Grid>

                                        <Grid item xs={2}>
                                            <Button onClick={this.submitData} variant="contained" color="secondary" size="small" className={classes.button}>
                                                Submit
                                            </Button>
                                        </Grid>
                                    </Grid>

                                    {submission_stats}

                                </Grid>
                            </Grid>

                            <Grid item container direction="column" spacing={4}>
                                <Grid item xs>
                                    <Typography>
                                        {submission_error ? "There was an error creating the submission. Please try again." : null}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </div >


        )
    }
}

SubmissionDetails.propTypes = {
    classes: PropTypes.object.isRequired,
};

// export default withStyles(styles)(SubmissionDetails);

SubmissionDetails = withStyles(styles)(SubmissionDetails)

export default ({ location }) => (
    <AuthConsumer>
        {({ onAuthenticate, JWTToken }) => <SubmissionDetails onAuthenticate={onAuthenticate} token={JWTToken} location={location} />}
    </AuthConsumer>
)
