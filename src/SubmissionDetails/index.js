import React, { Component, Fragment } from 'react';
import Upload from "../Upload";

import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { AuthConsumer } from '../auth-context';

import API_CLIENT from '../apiClient';
import history from "../history";


const styles = theme => ({
    root: {
        padding: theme.spacing(3, 2),
    },
    paper: {
        padding: theme.spacing(4),
        margin: 'auto',
        maxWidth: 1200,
    },
    button: {
        margin: theme.spacing(1),
        color: 'white',
        backgroundColor: '#2a3eb1',
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    },
    iconSmall: {
        fontSize: 20,
    },
    action: {
        marginTop: '20px',
    },
    statistics: {
        paddingTop: 24,
    },
});


class GridTest extends Component {
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
            submissionError: null,
            deleteFileError: null,
            submissionStatus: null,
            publicationStatus: null,
            showComponent: false,
            showButtonVisibility: 'visible',
            fileUploadId: null,
            fileValidationErrorMessage: null,
            displaySummaryStatsSection: true,
        })
        this.downloadSummaryStatsTemplate = this.downloadSummaryStatsTemplate.bind(this);
        this.submitData = this.submitData.bind(this);
        this.deleteData = this.deleteData.bind(this);
        this.displayUploadComponent = this.displayUploadComponent.bind(this);
        this.hideUploadComponent = this.hideUploadComponent.bind(this);

        this.parseErrorMessage = this.parseErrorMessage.bind(this);
    }

    /**
     * Get Submission details and update state
     */
    async componentDidMount() {
        console.log("** Called getSubmission...")

        this.API_CLIENT.getSubmission(this.SUBMISSION_ID).then((data) => {
            console.log("** Get Submission Data: ", data);

            this.setState({ ...this.state, submission_data: data });
            this.setState({ ...this.state, submissionStatus: data.submission_status });
            this.setState({ ...this.state, publication_obj: data.publication });
            this.setState({ ...this.state, publicationStatus: data.publication.status });

            if (data.status === 'VALID_METADATA') {
                this.setState({ ...this.state, isNotValid: false });
            }

            if (data.files.length > 0) {
                console.log("** Setting fileUploadId...", data.files[0].fileUploadId);
                this.setState({ ...this.state, fileUploadId: data.files[0].fileUploadId })

                // Parse error message for better display formatting
                this.setState({ ...this.state, fileValidationErrorMessage: this.parseErrorMessage(data.files[0].errors) });
            }
        }).catch(error => {
            console.log("** Error: ", error);
        });
    }


    /**
     * Parse file validation error message
     */
    parseErrorMessage(errorMessage) {
        if (errorMessage) {
            let fieldHeaderText = "Error: ";
            let index = 0;
            let fieldHeader = <span key={index}>{fieldHeaderText}<br /></span>;
            let errors = [];

            errors.push(fieldHeader);
            for (const error of errorMessage) {
                index = index + 1;
                errors.push(<span key={index}>{error}<br /></span>);
            }
            return errors;
        }
        else {
            return null;
        }
    }


    /**
     * Download Summary stats template with data
     * pre-filled with GCSTs, traits, and ancestry
     */
    downloadSummaryStatsTemplate() {
        let submissionId = this.SUBMISSION_ID;
        let fileId = this.state.fileUploadId;

        this.API_CLIENT.downloadSummaryStatsTemplate(submissionId, fileId);

    }


    /**
     * Manage state to show Upload component 
     * and "Select Upload Files" button
     */
    displayUploadComponent() {
        this.setState({ showComponent: true });
        this.setState({ showButtonVisibility: 'hidden' });
        this.setState({ displaySummaryStatsSection: false });
    }


    /**
     * Manage state to hide Upload component
     */
    hideUploadComponent() {
        // TODO: Handle in a more React-like style
        window.location.reload();

        // this.setState({
        //     showComponent: false,
        //     showButtonVisibility: 'visible',
        //     displaySummaryStatsSection: true
        // }, () => {
        //     console.log("** displaySummaryStatsSection: ", this.state.displaySummaryStatsSection);
        // });
    }


    /**
     * Delete File object for Submission
     * @param {String} SUBMISSION_ID
     * @param {String} fileUploadId
     */
    deleteData() {
        console.log("** Button click called deleteData method...");
        let submissionId = this.SUBMISSION_ID;
        let fileId = this.state.fileUploadId;
        console.log("** FUID: ", fileId);

        // Check if user is logged in, Get token from local storage
        if (localStorage.getItem('id_token')) {
            // let JWTToken = localStorage.getItem('id_token');

            // Delete file
            this.API_CLIENT.deleteFileUpload(submissionId, fileId).then(response => {
                this.setState(() => ({
                    submissionStatus: 'STARTED',
                    deleteFileError: false,
                    fileUploadId: null,
                    fileValidationErrorMessage: null,
                    displaySummaryStatsSection: false,
                }));
            }).catch(error => {
                this.setState(() => ({ deleteFileError: true }));
                alert("There was an error deleting the file")
            })
        }
        else {
            alert("Please login to delete a file")
            history.push('/login');
        }
    }


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
                // this.setState(() => ({ submissionError: false }));
            })
                .catch(error => {
                    // this.setState(() => ({ submissionError: true }));
                    alert("There was an error creating the submission")
                })
            // Issue: This reloads the page before the submission is submitted
            // window.location.reload();

            // Redirect to My Submissions page, NOTE: If using redirect, can't set state here
            history.push('/submissions');
        }
        else {
            alert("Please login to create a submission")
            history.push('/login');
        }
    }


    render() {
        const { classes } = this.props;
        const { error } = this.state;
        const { submissionError } = this.state;
        const bull = <span className={classes.bullet}>•</span>;

        const OVERALL_STATUS_STARTED = 'STARTED';

        const { publicationStatus } = this.state;

        // const submissionStatus = this.state.submission_data.submission_status;
        const { submissionStatus } = this.state;

        // const displaySummaryStatsSection = this.state.displaySummaryStatsSection;
        const { displaySummaryStatsSection } = this.state;

        const { fileValidationErrorMessage } = this.state;

        let submission_stats_section;
        let download_summary_stats_button;
        let select_upload_file_button;
        let upload_component;
        let submit_data_button;
        let delete_file_button;

        /**
         * Display Submission statistics section if a file has been uploaded
         * and the file Dropzone component is not being displayed
         */
        if (submissionStatus !== OVERALL_STATUS_STARTED) {
            if (displaySummaryStatsSection) {
                submission_stats_section =
                    <Fragment>
                        <Grid item>
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
                        </Grid>
                    </Fragment>
            }
        }

        /**
         * Manage display of "Download SS Template" button
         * This downloads the pre-filled template file
         */
        if (publicationStatus === 'UNDER_SUMMARY_STATS_SUBMISSION') {
            if (submissionStatus === 'STARTED') {
                download_summary_stats_button =
                    <Fragment>
                        <Grid item xs={2}>
                            <button onClick={this.downloadSummaryStatsTemplate} style={{ visibility: this.state.showButtonVisibility }} variant="contained" color="secondary" size="small" className={classes.button}>
                                Download SS Template
                            </button>
                        </Grid>
                    </Fragment>
            } else {
                download_summary_stats_button =
                    <Fragment>
                        <Grid item xs={2}>
                            <button disabled style={{ visibility: this.state.showButtonVisibility }} variant="contained" color="secondary" size="small" className={classes.button}>
                                Download SS Template
                            </button>
                        </Grid>
                    </Fragment>
            }
        }

        /**
         * Manage display of "Select Upload File" button
         */
        if (submissionStatus === 'STARTED') {
            select_upload_file_button =
                <Fragment>
                    <Grid item xs={6}>
                        <button onClick={this.displayUploadComponent} style={{ visibility: this.state.showButtonVisibility }}
                            variant="contained" color="secondary" size="small" className={classes.button}>
                            Select Upload File
                        </button>
                    </Grid>
                </Fragment>
        } else {
            select_upload_file_button =
                <Fragment>
                    <Grid item xs={6}>
                        <button disabled variant="contained" color="secondary" size="small" className={classes.button}>
                            Select Upload File
                        </button>
                    </Grid>
                </Fragment>
        }


        /**
         * Delete file button, this is needed when the submitter needs 
         * to re-submit a new file even though the first it was valid
         */
        if ((submissionStatus === 'VALID' || submissionStatus === 'INVALID') && this.state.fileUploadId !== null) {
            delete_file_button =
                <Grid item xs={2} >
                    <button onClick={this.deleteData} variant="contained" color="secondary" size="small" className={classes.button}>
                        Delete File
                    </button>
                </Grid>
        }


        /** 
         * Upload component display
         */
        upload_component =

            <Grid item xs={12}>
                {this.state.showComponent ?
                    <Upload submission_id={this.SUBMISSION_ID} displayUploadComponent={this.displayUploadComponent} /> : null}

                {this.state.showComponent ?
                    <button variant="contained" color="secondary" size="small" className={classes.button}
                        onClick={this.hideUploadComponent}
                    >
                        Cancel
                        </button> : null}
            </Grid>


        /**
         * Manage display of "Submit Data" button
         */
        if (submissionStatus !== 'VALID') {
            submit_data_button =
                <Fragment>
                    <Grid item xs={2}>
                        <button disabled style={{ visibility: this.state.showButtonVisibility }} variant="contained" color="secondary" size="small" className={classes.button}>
                            Submit
                        </button>
                    </Grid>
                </Fragment>
        } else {
            submit_data_button =
                <Fragment>
                    <Grid item xs={2}>
                        <button onClick={this.submitData} style={{ visibility: this.state.showButtonVisibility }} variant="contained" color="secondary" size="small" className={classes.button}>
                            Submit
                        </button>
                    </Grid>
                </Fragment>
        }

        return (
            <Fragment>
                <div className={classes.root}>
                    <Paper className={classes.paper}>
                        <Grid
                            container
                            direction="column"
                            justify="flex-start"
                            alignItems="stretch"
                            spacing={3}
                        >
                            <Grid item xs={12} container>
                                <Grid item xs={12}>
                                    <Typography gutterBottom variant="h5">
                                        Submission details for PMID: <i>{this.state.publication_obj.pmid}</i>
                                    </Typography></Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body1" gutterBottom>
                                        {this.state.publication_obj.firstAuthor} et al.,
                                        {this.state.publication_obj.publicationDate},
                                        {this.state.publication_obj.journal}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}
                                    container
                                    direction="row"
                                    justify="space-evenly"
                                    alignItems="flex-start"
                                    spacing={3}>
                                    <Grid item xs={4}
                                        container
                                        direction="column"
                                        justify="flex-start"
                                        alignItems="flex-start">
                                        <Grid item >
                                            <Typography variant="body1" gutterBottom>
                                                Submission status: {submissionStatus}
                                            </Typography>
                                        </Grid>
                                        <Grid item >
                                            <Typography>
                                                {fileValidationErrorMessage}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={2}></Grid>
                                    <Grid item xs={2}>
                                        {download_summary_stats_button}
                                        {delete_file_button}
                                    </Grid>
                                    <Grid item xs={2}>
                                        {select_upload_file_button}
                                    </Grid>
                                    <Grid item xs={2}>
                                        {submit_data_button}
                                    </Grid>
                                </Grid>
                                <Grid container
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="center">
                                    {upload_component}
                                </Grid>
                                <Grid container
                                    direction="column"
                                    justify="center"
                                    alignItems="flex-start"
                                    spacing={3}
                                    className={classes.statistics}
                                >
                                    {submission_stats_section}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>
                </div>
            </Fragment>
        )
    }
}

GridTest.propTypes = {
    classes: PropTypes.object.isRequired,
};

GridTest = withStyles(styles)(GridTest)

export default ({ location }) => (
    <AuthConsumer>
        {({ onAuthenticate, JWTToken }) => <GridTest onAuthenticate={onAuthenticate} token={JWTToken} location={location} />}
    </AuthConsumer>
)
