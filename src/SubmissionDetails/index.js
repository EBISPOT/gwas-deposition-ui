import React, { Component, Fragment } from 'react';
import Upload from "../Upload";

import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import classNames from 'classnames'
import CircularProgress from '@material-ui/core/CircularProgress';
import ReactSVG from 'react-svg'

import { AuthConsumer } from '../auth-context';

import API_CLIENT from '../apiClient';
import history from "../history";

import axios from 'axios';
import ElixirAuthService from '../ElixirAuthService';

const BASE_URI = process.env.REACT_APP_LOCAL_BASE_URI;

const styles = theme => ({
    root: {
        padding: theme.spacing(3, 2),
    },
    paper: {
        padding: theme.spacing(2),
        height: '100%',
    },
    stepTextStyle: {
        fontSize: 18,
        marginLeft: theme.spacing(1),
        marginBottom: theme.spacing(0.4),
        marginTop: theme.spacing(0.3),
    },
    headerTextStyle: {
        fontWeight: 500,
    },
    pageHeader: {
        height: 52,
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
    submissionTextStyle: {
        fontSize: 18,
        marginLeft: 12,
        marginRight: 8,
    },
    thankYouSubmissionTextStyle: {
        marginLeft: 12,
        marginRight: 8,
        fontStyle: 'italic'
    },
    filler: {
        height: "100%",
    },
    section: {
        marginTop: theme.spacing(1),
    },
    submissionStats: {
        marginTop: 24,
    },
    progress: {
        height: 25,
        width: 25,
        color: 'gray',
    },
    check_icon: {
        fill: 'green',
    },
    error_icon: {
        fill: 'red',
    },
    errorText: {
        color: 'red',
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
    closeUploadComponentButton: {
        marginLeft: 18,
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
    inputCenter: {
        textAlign: "center",
        color: "red"
    }
});


class SubmissionDetails extends Component {
    _isMounted = false;

    constructor(props) {
        super(props)
        this.API_CLIENT = new API_CLIENT();
        this.ElixirAuthService = new ElixirAuthService();

        // NOTE: SUBMISSION_ID is passed from location prop in Route pathname
        if (process.env.PUBLIC_URL) {
            let URL = this.props.location.pathname.split(process.env.PUBLIC_URL)[1];
            this.SUBMISSION_ID = URL.split('/')[2];
        }
        else {
            this.SUBMISSION_ID = this.props.location.pathname.split('/')[2];
        }


        this.state = ({
            submission_data: [],
            globusOriginId: null,
            userName: null,
            submissionCreatedDate: null,
            provenanceType: null,
            publication_obj: null,
            publicationStatus: null,
            bow_obj: null,
            bowStatus: null,
            file_upload_error: null,
            isNotValid: true,
            submitDataError: null,
            deleteFileError: null,
            reviewLatestFileError: null,
            downloadSummaryStatsFileError: null,
            submissionStatus: 'NA',
            metadataStatus: null,
            summaryStatisticsStatus: null,
            showComponent: false,
            showButtonVisibility: 'visible',
            fileUploadId: null,
            fileName: null,
            fileValidationErrorMessage: null,
            displaySummaryStatsSection: true,
        })
        this.downloadMetadataTemplate = this.downloadMetadataTemplate.bind(this);
        this.downloadDataFile = this.downloadDataFile.bind(this);
        this.downloadSummaryStatsTemplate = this.downloadSummaryStatsTemplate.bind(this);
        this.submitData = this.submitData.bind(this);
        this.deleteData = this.deleteData.bind(this);
        this.displayUploadComponent = this.displayUploadComponent.bind(this);
        this.hideUploadComponent = this.hideUploadComponent.bind(this);
        this.parseFileMetadata = this.parseFileMetadata.bind(this);
        this.ElixirAuthService.isTokenExpired = this.ElixirAuthService.isTokenExpired.bind(this);


        // Set token to use AuthConsumer props or localstorage if page refresh
        // this.props.token === null ? this.authToken = this.state.auth : this.authToken = this.props.token;
    }


    // Clear timer after polling end condition reached
    clearInterval() {
        this.timer = null;
    }

    componentDidMount() {
        this.getSubmissionDetails();

        this._isMounted = true;

        this.timer = setInterval(() => {
            if (this.state.submissionStatus === null
                || this.state.submissionStatus === 'VALID'
                || this.state.submissionStatus === 'INVALID'
                || this.state.submissionStatus === 'CURATION_COMPLETE'
                || this.state.submissionStatus === 'COMPLETE'
                || this.state.submissionStatus === 'STARTED'
                || this.state.submissionStatus === 'SUBMITTED') {
                clearInterval(this.timer);
            } else {
                // console.log("** Timer values for - isMounted: ", this._isMounted, " Timer: ", this.timer);
                // Only call for polling if still viewing submission details page,
                // sometimes submissions are stuck in VALIDATING and then getSubmissionDetails() would
                // always be called after viewing the page
                if (this._isMounted) {
                    this.getSubmissionDetails();
                }
            }
        }, 30000)
    }

    componentWillUnmount() {
        this.timer = null;
        this._isMounted = false;
    }

    /**
     * Get Submission details and update state
     */
    getSubmissionDetails() {
        let token = localStorage.getItem('id_token');

        // Check if token is expired
        if (this.ElixirAuthService.isTokenExpired(token)) {
            alert("Your session has expired, redirecting to login.")
            // console.log("** Timer values for getSubmissionDetails: ", this.timer, "\n** isMounted: ", this._isMounted);

            setTimeout(() => {
                history.push(`${process.env.PUBLIC_URL}/login`);
            }, 1000);

            this.timer = null;
            this._isMounted = false;
        }
        else {
            axios.get(BASE_URI + 'submissions/' + this.SUBMISSION_ID,
                {
                    headers: {
                        'Authorization': 'Bearer ' + token,
                    }
                })
                .then((response) => {

                    let data = response.data

                    // Only update state if component still mounted
                    if (this._isMounted) {

                        this.setState({ ...this.state, submission_data: data });
                        this.setState({ ...this.state, submissionStatus: data.submission_status });
                        this.setState({ ...this.state, metadataStatus: data.metadata_status });
                        this.setState({ ...this.state, summaryStatisticsStatus: data.summary_statistics_status });
                        this.setState({ ...this.state, provenanceType: data.provenanceType });

                        this.setState({ ...this.state, publication_obj: data.publication });
                        if (data.publication && data.publication.status) {
                            this.setState({ ...this.state, publicationStatus: data.publication.status });
                        }

                        this.setState({ ...this.state, bow_obj: data.bodyOfWork });
                        if (data.bodyOfWork && data.bodyOfWork.status) {
                            this.setState({ ...this.state, bowStatus: data.bodyOfWork.status });
                        }

                        if (data.created.user.name) {
                            this.setState({ ...this.state, userName: data.created.user.name });
                        }

                        if (data.created.timestamp) {
                            // Format timeStamp for display
                            let createdTimestamp = new Date(data.created.timestamp);
                            createdTimestamp = createdTimestamp.getFullYear() + "-" + (createdTimestamp.getMonth() + 1) + "-" + createdTimestamp.getDate()
                            this.setState({ ...this.state, submissionCreatedDate: createdTimestamp });
                        }

                        if (data.status === 'VALID_METADATA') {
                            this.setState({ ...this.state, isNotValid: false });
                        }

                        if (data.globusOriginId) {
                            this.setState({ ...this.state, globusOriginId: data.globusOriginId });
                        }

                        if (data.files.length > 0) {
                            /**
                             * Parse file metadata
                            */
                            const { summaryStatsFileMetadata,
                                metadataFileMetadata } = this.parseFileMetadata(data.files);

                            /**
                             * Set state based on type of file uploaded
                             */
                            if (summaryStatsFileMetadata.fileUploadId !== undefined) {
                                this.setState({ ...this.state, fileUploadId: summaryStatsFileMetadata.fileUploadId })
                                this.setState({ ...this.state, fileName: summaryStatsFileMetadata.fileName })
                                this.setState({ ...this.state, fileValidationErrorMessage: summaryStatsFileMetadata.summary_stats_errors });
                            }
                            else {
                                this.setState({ ...this.state, fileUploadId: metadataFileMetadata.fileUploadId })
                                this.setState({ ...this.state, fileName: metadataFileMetadata.fileName })
                                this.setState({ ...this.state, fileValidationErrorMessage: metadataFileMetadata.metadata_errors });
                            }
                        }
                    }
                }).catch(error => {
                    console.log("Error: ", error);
                    // Stop polling if error returned
                    this.setState({ submissionStatus: null })

                    // Redirect if 4xx response returned, 404 returned from backend if not authorized
                    if (error.response && (error.response.status >= 404 && error.response.status < 500)) {
                        return history.push(`${process.env.PUBLIC_URL}/error`);
                    }
                    if (error.response && (error.response.status >= 400 && error.response.status < 404)) {
                        return history.push(`${process.env.PUBLIC_URL}/error`);
                    }
                });
        }
    }


    /**
     * Parse file metadata for submission
     */
    parseFileMetadata(allFiles) {
        let SUMMARY_STATS_FILE_TYPE = "SUMMARY_STATS";
        let METADATA_FILE_TYPE = "METADATA";
        let SUMMARY_STATS_TEMPLATE_FILE_TYPE = "SUMMARY_STATS_TEMPLATE";

        let summaryStatsFileMetadata = {};
        let metadataFileMetadata = {};
        let summaryStatsTemplateFileMetadata = {};

        allFiles.forEach((file) => {
            /**
             * Set data for Summary Stats File Object
             */
            if (file.type === SUMMARY_STATS_FILE_TYPE) {

                // Set Summary Stats fileUploadId
                if (file.fileUploadId) {
                    summaryStatsFileMetadata.fileUploadId = file.fileUploadId;
                }

                // Set Summary Stats fileName
                if (file.fileName) {
                    summaryStatsFileMetadata.fileName = file.fileName;
                }

                // Set Summary Stats errors
                let summaryStatsErrorMessage = [];
                if (file.errors && file.errors.length > 0) {
                    // let fieldHeaderText = "Error: ";
                    let index = 0;
                    // let fieldHeader = <span key={index}>{fieldHeaderText}<br /></span>;
                    // summaryStatsErrorMessage.push(fieldHeader);

                    for (const error of file.errors) {
                        index = index + 1;
                        summaryStatsErrorMessage.push(<span key={index}>{error}<br /></span>);
                    }
                    summaryStatsFileMetadata.summary_stats_errors = summaryStatsErrorMessage;
                }
            }

            /**
             * Set data for Metadata File Object
             */
            if (file.type === METADATA_FILE_TYPE) {

                // Set Metadata fileUploadId
                if (file.fileUploadId) {
                    metadataFileMetadata.fileUploadId = file.fileUploadId;
                }

                // Set Metadata fileName
                if (file.fileName) {
                    metadataFileMetadata.fileName = file.fileName;
                }

                // Set Metadata errors
                let metadataErrorMessage = [];
                if (file.errors && file.errors.length > 0) {
                    // let fieldHeaderText = "Error: ";
                    let index = 0;
                    // let fieldHeader = <span key={index}>{fieldHeaderText}<br /></span>;
                    // metadataErrorMessage.push(fieldHeader);

                    for (const error of file.errors) {
                        index = index + 1;
                        metadataErrorMessage.push(<span key={index}>{error}<br /></span>);
                    }
                    metadataFileMetadata.metadata_errors = metadataErrorMessage;
                }
            }

            /**
            * Set data for Summary Stats Template File Object
            */
            if (file.type === SUMMARY_STATS_TEMPLATE_FILE_TYPE) {

                // Set Summary Stats Template fileUploadId
                if (file.fileUploadId) {
                    summaryStatsTemplateFileMetadata.fileUploadId = file.fileUploadId;
                }

                // Set Summary Stats Template fileName
                if (file.fileName) {
                    summaryStatsTemplateFileMetadata.fileName = file.fileName;
                }

                // Set Summary Stats Template errors
                let summaryStatsTemplateErrorMessage = [];
                if (file.errors && file.errors.length > 0) {
                    let fieldHeaderText = "Error: ";
                    let index = 0;
                    let fieldHeader = <span key={index}>{fieldHeaderText}<br /></span>;
                    summaryStatsTemplateErrorMessage.push(fieldHeader);

                    for (const error of file.errors) {
                        index = index + 1;
                        summaryStatsTemplateErrorMessage.push(<span key={index}>{error}<br /></span>);
                    }
                    summaryStatsTemplateFileMetadata.metadata_errors = summaryStatsTemplateErrorMessage;
                }
            }
        });
        return { summaryStatsFileMetadata, metadataFileMetadata, summaryStatsTemplateFileMetadata };
    }


    /**
     * Download and review latest file for submission
     */
    downloadDataFile() {
        let submissionId = this.SUBMISSION_ID;
        let fileId = this.state.fileUploadId;
        let fileName = this.state.fileName;
        let token = localStorage.getItem('id_token');

        if (!fileName) {
            fileName = "template.xlsx";
        }

        // Check if token is valid
        if (this.ElixirAuthService.isTokenExpired(token)) {
            alert("Your session has expired, redirecting to login.")
            setTimeout(() => {
                history.push(`${process.env.PUBLIC_URL}/login`);
            }, 1000);
        }
        else {
            axios.get(BASE_URI + 'submissions/' + submissionId + '/uploads/' + fileId + '/download',
                {
                    headers: {
                        'Authorization': 'Bearer ' + token,
                    },
                    responseType: 'blob',
                }
            ).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
            }).catch((error) => {
                this.setState({ reviewLatestFileError: 'Error: ' + error.message })
            })
        }
    }

    /**
     * Download Metadata template
     */
    downloadMetadataTemplate() {
        let token = localStorage.getItem('id_token');

        // Check if token is valid
        if (this.ElixirAuthService.isTokenExpired(token)) {
            alert("Your session has expired, redirecting to login.")
            setTimeout(() => {
                history.push(`${process.env.PUBLIC_URL}/login`);
            }, 1000);
        }
        else {
            this.API_CLIENT.downloadTemplate();
        }
    }

    /**
     * Get fileUploadId for prefilled SumStats template and then download submission form template file
     */
    downloadSummaryStatsTemplate() {
        let submissionId = this.SUBMISSION_ID;
        let pmid = this.state.publication_obj.pmid;
        let summaryStatsTemplateFileName = `prefilled_template_${pmid}.xlsx`;
        let token = localStorage.getItem('id_token');

        // Check if token is valid
        if (this.ElixirAuthService.isTokenExpired(token)) {
            alert("Your session has expired, redirecting to login.")
            setTimeout(() => {
                history.push(`${process.env.PUBLIC_URL}/login`);
            }, 1000);
        }
        else {
            axios.get(BASE_URI + 'submissions/' + submissionId + '/uploads/',
                { headers: { 'Authorization': 'Bearer ' + token, }, }
            ).then((response) => {
                // Parse response to get fileUploadId from file Object with type "SUMMARY_STATS_TEMPLATE"
                let SUMMARY_STATS_TEMPLATE_FILE_TYPE = "SUMMARY_STATS_TEMPLATE";
                let allFiles = response.data._embedded.fileUploads;
                let sumStatsFileUploadId;

                allFiles.forEach((file) => {
                    if (file.type === SUMMARY_STATS_TEMPLATE_FILE_TYPE) {
                        sumStatsFileUploadId = file.fileUploadId;
                    }
                });

                // Reset error status if failed previous attempt
                this.setState(() => ({
                    downloadSummaryStatsFileError: null,
                }));

                return axios.get(BASE_URI + 'submissions/' + submissionId + '/uploads/' + sumStatsFileUploadId + '/download',
                    { headers: { 'Authorization': 'Bearer ' + token, }, responseType: 'blob', }
                )
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');

                link.href = url;
                link.setAttribute('download', summaryStatsTemplateFileName);
                document.body.appendChild(link);
                link.click();
            })
                .catch((error) => {
                    console.log("Error: ", error)
                    let downloadSSTemplateErrorLabel = "Error: There is a fault on our end. Please contact gwas-info@ebi.ac.uk for help."
                    this.setState({ downloadSummaryStatsFileError: downloadSSTemplateErrorLabel });
                })
        }
    }


    /**
     * Manage state to show Upload component 
     * and "Select Upload Files" button
     */
    displayUploadComponent() {
        this.setState({ showComponent: true });
        this.setState({ showButtonVisibility: 'hidden' });
        this.setState({ displaySummaryStatsSection: false });
        this.setState({ downloadSummaryStatsFileError: null });
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
        let submissionId = this.SUBMISSION_ID;
        let fileId = this.state.fileUploadId;
        let token = localStorage.getItem('id_token');

        // Check if user is logged in, Get token from local storage
        if (token && !this.ElixirAuthService.isTokenExpired(token)) {
            // Set state to block any further button clicks
            this.setState(() => ({
                submissionStatus: 'DELETING SUBMISSION...',
                deleteFileError: null,
                fileUploadId: null,
                fileValidationErrorMessage: null,
                displaySummaryStatsSection: false,
                metadataStatus: 'NA',
                summaryStatisticsStatus: 'NA',
            }));

            // Delete file
            this.API_CLIENT.deleteFileUpload(submissionId, fileId).then(response => {
                if (response.status === 200) {
                    this.setState(() => ({
                        submissionStatus: 'STARTED',
                        deleteFileError: null,
                        fileUploadId: null,
                        fileValidationErrorMessage: null,
                        displaySummaryStatsSection: false,
                        metadataStatus: 'NA',
                        summaryStatisticsStatus: 'NA',
                    }));
                }
            }).catch(error => {
                let deleteFileErrorLabel = "Error: There was an error deleting the file."
                this.setState({ deleteFileError: deleteFileErrorLabel });
            })
        }
        // Check if token is valid
        else if (token && this.ElixirAuthService.isTokenExpired(token)) {
            alert("Your session has expired, redirecting to login.")
            setTimeout(() => {
                history.push(`${process.env.PUBLIC_URL}/login`);
            }, 1000);
        }
        else {
            alert("Please login to delete a file")
            history.push(`${process.env.PUBLIC_URL}/login`);
        }
    }


    /**
     * Submit data 
     */
    submitData() {
        let submissionId = this.SUBMISSION_ID;
        let token = localStorage.getItem('id_token');

        // Check if token is valid
        if (this.ElixirAuthService.isTokenExpired(token)) {
            alert("Your session has expired, redirecting to login.")
            setTimeout(() => {
                history.push(`${process.env.PUBLIC_URL}/login`);
            }, 1000);
        }
        else {
            this.API_CLIENT.submitSubmission(submissionId).then(response => {
                // Redirect to My Submissions page, NOTE: If using redirect, can't set state here
                history.push(`${process.env.PUBLIC_URL}/submissions`);
            })
                .catch(error => {
                    this.setState(() => ({ submitDataError: "Error: " + error.message }));
                })
        }
    }


    render() {
        const { classes } = this.props;
        const { provenanceType } = this.state;

        // const OVERALL_STATUS_STARTED = 'STARTED';
        const VALID_SUBMISSION = 'VALID';
        const VALIDATING = 'VALIDATING';
        const SUBMITTED = 'SUBMITTED';
        const publicationProvenanceType = "PUBLICATION";
        const bowProvenanceType = "BODY_OF_WORK";
        const { publication_obj } = this.state;
        const { publicationStatus } = this.state;
        const { bow_obj } = this.state;
        const { bowStatus } = this.state;
        let submissionDetailsPanel;


        let userActionPublicationStatus;
        if (provenanceType === publicationProvenanceType) {
            if (publicationStatus === 'UNDER_SUMMARY_STATS_SUBMISSION') {
                userActionPublicationStatus = <i>You are able to submit summary statistics for this publication.</i>
            }
            if (publicationStatus === 'UNDER_SUBMISSION') {
                userActionPublicationStatus = <i>You are able to submit summary statistics and study metadata for this publication.</i>
            }
        }

        const { globusOriginId } = this.state;
        const globusSumStatsFolder = `https://app.globus.org/file-manager?origin_id=${globusOriginId}`;

        const sumStatsDocs = `https://www.ebi.ac.uk/gwas/docs/submission-summary-statistics`;
        const metadataAndSumStatsDocs = `https://www.ebi.ac.uk/gwas/docs/submission-summary-statistics-plus-metadata`;

        const gwasSubsEmailLink = `mailto:gwas-subs@ebi.ac.uk?subject=Post-submission edit request`;
        let final_thank_you_message;

        const { submissionStatus } = this.state;

        const { metadataStatus } = this.state;
        let metadata_status_section;
        const { summaryStatisticsStatus } = this.state;
        let summary_statistics_status_icon;

        const { displaySummaryStatsSection } = this.state;
        const { fileValidationErrorMessage } = this.state;
        const { userName } = this.state;
        const { submissionCreatedDate } = this.state;

        let submission_stats_section;
        let file_validation_error_section;
        let upload_sumstats_button;
        // let download_summary_stats_button;
        let download_template;
        let select_upload_file_button;
        let upload_component;
        let submit_data_button;
        let delete_file_button;
        let download_data_file_button;
        let upload_files_to_globus_step;


        /**
         * Manage display of details panel with either
         * "Publication" or "Body of Work" content based on provenanceType
         */
        if (this.SUBMISSION_ID) {
            submissionDetailsPanel =
                <Grid item xs={12}>
                    <Typography>
                        Loading...!
                    </Typography>
                </Grid>
        }
        if (provenanceType === bowProvenanceType) {
            if (bow_obj) {
                submissionDetailsPanel =
                    <Fragment>
                        <Grid item xs={12} className={classes.pageHeader}>
                            <Typography variant="h5" className={classes.headerTextStyle}>
                                Details for GCP ID: {this.state.bow_obj.bodyOfWorkId}
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h6" className={classes.publicationTitleTextStyle}>
                                {bow_obj.title}
                            </Typography>
                        </Grid>

                        <Grid
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="flex-start"
                        >
                            <Grid item xs={3}>
                                <Typography variant="h6" className={classes.publicationTextStyle}>
                                    Description:
                                </Typography>
                            </Grid>
                            <Grid item xs={9}>
                                <Typography variant="h6" className={classes.publicationTextStyle}>
                                    {bow_obj.description}
                                </Typography>
                            </Grid>

                            {(bow_obj.firstAuthor && bow_obj.firstAuthor.firstName
                                && bow_obj.firstAuthor.lastName) && (
                                    <Fragment>
                                        <Grid item xs={3}>
                                            <Typography variant="h6" className={classes.publicationTextStyle}>
                                                First Author:
                                            </Typography>
                                        </Grid>

                                        < Grid item xs={9} >
                                            <Typography className={classes.publicationTextStyle}>
                                                {bow_obj.firstAuthor.firstName} &nbsp;
                                                {bow_obj.firstAuthor.lastName}
                                            </Typography>
                                        </Grid>
                                    </Fragment>
                                )}

                            {(bow_obj.firstAuthor && bow_obj.firstAuthor.group) && (
                                <Fragment>
                                    <Grid item xs={3}>
                                        <Typography variant="h6" className={classes.publicationTextStyle}>
                                            First Author:
                                        </Typography>
                                    </Grid>
                                    < Grid item xs={9} >
                                        <Typography className={classes.publicationTextStyle}>
                                            {bow_obj.firstAuthor.group}
                                        </Typography>
                                    </Grid>
                                </Fragment>
                            )}

                            {(bow_obj.lastAuthor && bow_obj.lastAuthor.firstName
                                && bow_obj.lastAuthor.lastName) && (
                                    <Fragment>
                                        <Grid item xs={3}>
                                            <Typography variant="h6" className={classes.publicationTextStyle}>
                                                Last Author:
                                            </Typography>
                                        </Grid>
                                        < Grid item xs={9} >
                                            <Typography className={classes.publicationTextStyle}>
                                                {bow_obj.lastAuthor.firstName} &nbsp;
                                                {bow_obj.lastAuthor.lastName}
                                            </Typography>
                                        </Grid>
                                    </Fragment>
                                )}

                            {(bow_obj.lastAuthor && bow_obj.lastAuthor.group) && (
                                <Fragment>
                                    <Grid item xs={3}>
                                        <Typography variant="h6" className={classes.publicationTextStyle}>
                                            Last Author:
                                        </Typography>
                                    </Grid>
                                    < Grid item xs={9} >
                                        <Typography className={classes.publicationTextStyle}>
                                            {bow_obj.lastAuthor.group}
                                        </Typography>
                                    </Grid>
                                </Fragment>
                            )}

                            <Grid item xs={3}>
                                <Typography variant="h6" className={classes.publicationTextStyle}>
                                    Corresponding Author(s):
                                </Typography>
                            </Grid>
                            <Grid item xs={9} >
                                {(bow_obj.correspondingAuthors) && (
                                    bow_obj.correspondingAuthors.map((corrAuthor, index) => (
                                        <Typography key={index} className={classes.publicationTextStyle}>
                                            {corrAuthor.firstName}  &nbsp;
                                            {corrAuthor.lastName} &nbsp;
                                            <a href={"mailto:" + corrAuthor.email}>{corrAuthor.email}</a>
                                        </Typography>
                                    )))}
                            </Grid>

                            {(bow_obj.journal) && (
                                <Fragment>
                                    <Grid item xs={3}>
                                        <Typography variant="h6" className={classes.publicationTextStyle}>
                                            Published in:
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={9}>
                                        <Typography className={classes.publicationTextStyle} >
                                            {bow_obj.journal}
                                        </Typography>

                                        {(bow_obj.url) && (
                                            <Typography>
                                                <a href={bow_obj.url} target="_blank" rel="noopener noreferrer">{bow_obj.url}</a>
                                            </Typography>
                                        )}
                                    </Grid>
                                </Fragment>
                            )}

                            {(bow_obj.prePrintServer) && (
                                <Fragment>
                                    <Grid item xs={3}>
                                        <Typography variant="h6" className={classes.publicationTextStyle}>
                                            PrePrint available in:
                                            </Typography>
                                    </Grid>
                                    <Grid item xs={9}>
                                        <Typography className={classes.publicationTextStyle}>
                                            {bow_obj.prePrintServer} &nbsp;

                                            <a href={bow_obj.preprintServerDOI} target="_blank" rel="noopener noreferrer">{bow_obj.preprintServerDOI}</a>
                                        </Typography>
                                    </Grid>
                                </Fragment>
                            )}

                            {(bow_obj.embargoDate || bow_obj.embargoUntilPublished) && (
                                <Fragment>
                                    <Grid item xs={3}>
                                        <Typography className={classes.publicationTextStyle}>
                                            Embargo until:
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={9}>
                                        <Typography className={classes.publicationTextStyle}>
                                            {bow_obj.embargoUntilPublished
                                                ? 'date of publication' : `${bow_obj.embargoDate}`}
                                        </Typography>
                                    </Grid>
                                </Fragment>
                            )}

                        </Grid>
                    </Fragment>
            }
        }
        if (provenanceType === publicationProvenanceType) {
            if (publication_obj) {
                submissionDetailsPanel =
                    <Fragment>
                        <Grid item xs={12} className={classes.pageHeader}>
                            <Typography variant="h5" className={classes.headerTextStyle}>
                                Publication details for PMID: {publication_obj.pmid}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6" className={classes.publicationTitleTextStyle}>
                                {publication_obj.title}
                            </Typography>
                        </Grid>

                        <Grid container item>
                            <Typography className={classes.publicationTextStyle} >
                                {publication_obj.firstAuthor} et al.
                        </Typography>
                            <Typography className={classes.publicationTextStyle} >
                                {publication_obj.publicationDate}
                            </Typography>
                            <Typography className={classes.publicationTextStyle} >
                                {publication_obj.journal}
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography className={classes.publicationCatalogStatusTextStyle}>
                                {userActionPublicationStatus}
                            </Typography>
                        </Grid>
                    </Fragment>
            }
        }


        /**
         * For provenanceType PUBLICATION,
         * Display Submission statistics section if a file has been uploaded
         * and the file Dropzone component is not being displayed
         */
        if (provenanceType === publicationProvenanceType) {
            if (submissionStatus === VALID_SUBMISSION || submissionStatus === SUBMITTED) {
                if (displaySummaryStatsSection && publicationStatus !== 'UNDER_SUMMARY_STATS_SUBMISSION') {
                    submission_stats_section =
                        <Fragment>
                            <Grid item container xs={12}>
                                <Grid item xs={2}>
                                    <Typography variant="h6" className={classes.submissionTextStyle}>
                                        Submission Stats:
                                    </Typography>
                                </Grid>
                                <Grid item xs={10}>
                                    <Typography variant="h6" className={classes.submissionTextStyle}>
                                        {this.state.submission_data.study_count}
                                        {this.state.submission_data.study_count === 1 ? " study" : " studies"}
                                    </Typography>
                                    <Typography variant="h6" className={classes.submissionTextStyle}>
                                        {this.state.submission_data.association_count} total associations
                                    </Typography>
                                    <Typography variant="h6" className={classes.submissionTextStyle}>
                                        {this.state.submission_data.sample_count} sample groups
                                </Typography>
                                </Grid>
                            </Grid>
                        </Fragment>
                } else {
                    submission_stats_section =
                        <Fragment>
                            <Grid item container xs={12}>
                                <Grid item xs={2}>
                                    <Typography variant="h6" className={classes.submissionTextStyle}>
                                        Submission Stats:
                                </Typography>
                                </Grid>
                                <Grid item xs={10}>
                                    <Typography variant="h6" className={classes.submissionTextStyle}>
                                        {this.state.submission_data.study_count}
                                        {this.state.submission_data.study_count === 1 ? " study" : " studies"}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Fragment>
                }
            }
        }

        /**
         * For provenanceType BODY_OF_WORK,
         * Display Submission statistics section if a file has been uploaded
         * and the file Dropzone component is not being displayed
         */
        if (provenanceType === bowProvenanceType) {
            if (submissionStatus === VALID_SUBMISSION || submissionStatus === SUBMITTED) {
                if (displaySummaryStatsSection) {
                    submission_stats_section =
                        <Fragment>
                            <Grid item container xs={12}>
                                <Grid item xs={2}>
                                    <Typography variant="h6" className={classes.submissionTextStyle}>
                                        Submission Stats:
                                    </Typography>
                                </Grid>
                                <Grid item xs={10}>
                                    <Typography variant="h6" className={classes.submissionTextStyle}>
                                        {this.state.submission_data.study_count}
                                        {this.state.submission_data.study_count === 1 ? " study" : " studies"}
                                    </Typography>
                                    <Typography variant="h6" className={classes.submissionTextStyle}>
                                        {this.state.submission_data.association_count} total associations
                                    </Typography>
                                    <Typography variant="h6" className={classes.submissionTextStyle}>
                                        {this.state.submission_data.sample_count} sample groups
                                </Typography>
                                </Grid>
                            </Grid>
                        </Fragment>
                } else {
                    submission_stats_section =
                        <Fragment>
                            <Grid item container xs={12}>
                                <Grid item xs={2}>
                                    <Typography variant="h6" className={classes.submissionTextStyle}>
                                        Submission Stats:
                                </Typography>
                                </Grid>
                                <Grid item xs={10}>
                                    <Typography variant="h6" className={classes.submissionTextStyle}>
                                        {this.state.submission_data.study_count}
                                        {this.state.submission_data.study_count === 1 ? " study" : " studies"}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Fragment>
                }
            }
        }



        /**
         * Manage display of "Current status" label
         */
        let currentStatus;
        if (submissionStatus === 'VALID') {
            currentStatus = 'TEMPLATE VALID'
        } else if (submissionStatus === 'VALIDATING') {
            currentStatus = 'VALIDATING TEMPLATE...'
        } else if (submissionStatus === 'INVALID') {
            currentStatus = 'TEMPLATE INVALID'
        }
        else if (submissionStatus === 'COMPLETE' || submissionStatus === 'CURATION_COMPLETE') {
            currentStatus = 'SUBMITTED'
        } else {
            currentStatus = submissionStatus;
        }



        /**
         * Manage display of File validation errors.
         */
        if (fileValidationErrorMessage) {
            file_validation_error_section =
                <Fragment>
                    <Grid item container xs={12}>
                        <Grid item xs={2}>
                            <Typography variant="h6" className={classes.submissionTextStyle}>
                                Errors:
                            </Typography>
                        </Grid>
                        <Grid item xs={10}>
                            {fileValidationErrorMessage.map(function (error, index) {
                                return <Typography key={index} variant="h6" className={classes.submissionTextStyle}>
                                    {error}
                                </Typography>
                            })}
                        </Grid>
                    </Grid>
                </Fragment>
        }


        /**
         * Manage display of "Upload summary statistics" button. Clicking this button
         * will open a new tab to take the user to the Globus folder created for their
         * submission.
         */
        if (submissionStatus === 'STARTED') {
            upload_sumstats_button =
                <Fragment>
                    <Button href={globusSumStatsFolder} target="_blank" rel="noopener noreferrer" fullWidth className={classes.button}>
                        Upload summary statistics
                    </Button>
                    {/* Handle case when globusSumStatsFolder is not returned */}
                </Fragment>
        }
        else {
            upload_sumstats_button =
                <Fragment>
                    <Button disabled fullWidth className={classes.button} variant="outlined">
                        Upload summary statistics
                    </Button>
                </Fragment>
        }


        /**
         * Manage display of "Download submission form" template file button
         * For a publication with status UNDER_SUMMARY_STATS_SUBMISSION, 
         * this downloads the pre-filled template file.
         * 
         * For a publication with status UNDER_SUBMISSION, this downloads 
         * the metadata template. 
         */
        if (submissionStatus === 'STARTED') {
            if (provenanceType === publicationProvenanceType) {
                if (publicationStatus === 'UNDER_SUMMARY_STATS_SUBMISSION') {
                    download_template =
                        <Fragment>
                            <Button onClick={this.downloadSummaryStatsTemplate} fullWidth className={classes.button}>
                                Download submission form
                        </Button>
                            <Typography variant="body2" gutterBottom className={classes.errorText}>
                                {this.state.downloadSummaryStatsFileError}
                            </Typography>
                        </Fragment>
                }
                if (publicationStatus === 'UNDER_SUBMISSION') {
                    download_template =
                        <Fragment>
                            <Button onClick={this.downloadMetadataTemplate} fullWidth className={classes.button}>
                                Download submission form
                        </Button>
                            <Typography variant="body2" gutterBottom className={classes.inputCenter}>
                                {this.state.downloadSummaryStatsFileError}
                            </Typography>
                        </Fragment>
                }
            }
            if (provenanceType === bowProvenanceType) {
                download_template =
                    <Fragment>
                        <Button onClick={this.downloadMetadataTemplate} fullWidth className={classes.button}>
                            Download submission form
                        </Button>
                        <Typography variant="body2" gutterBottom className={classes.inputCenter}>
                            {this.state.downloadSummaryStatsFileError}
                        </Typography>
                    </Fragment>
            }
        }
        else {
            download_template =
                <Fragment>
                    <Button disabled fullWidth className={classes.button} variant="outlined">
                        Download submission form
                    </Button>
                </Fragment>
        }


        /**
         * Manage display of "Upload submission form" template file button
         */
        if (submissionStatus === 'STARTED') {
            select_upload_file_button =
                <Fragment>
                    <Button fullWidth onClick={this.displayUploadComponent} className={classes.button} variant="outlined">
                        Upload submission form
                    </Button>
                </Fragment>
        } else {
            select_upload_file_button =
                <Fragment>
                    <Button fullWidth disabled size="small" className={classes.button} variant="outlined">
                        Upload submisson form
                    </Button>
                </Fragment>
        }


        /**
        * Manage display of "Submit" button
        */
        if (submissionStatus !== 'VALID') {
            submit_data_button =
                <Fragment>
                    <Button disabled fullWidth className={classes.button} variant="outlined">
                        Submit
                    </Button>
                </Fragment>
        } else {
            submit_data_button =
                <Fragment>
                    <Button onClick={this.submitData} fullWidth className={classes.button}>
                        Submit
                    </Button>
                    <Typography variant="body2" gutterBottom className={classes.inputCenter}>
                        {this.state.submitDataError}
                    </Typography>
                </Fragment>
        }


        /**
        * Manage display of "Review submission" (previously "Review latest file") button
        * This downloads the user provided data file.
        */
        if (submissionStatus === 'VALID' || submissionStatus === 'INVALID' || submissionStatus === 'SUBMITTED') {
            download_data_file_button =
                <Fragment>
                    <Button onClick={this.downloadDataFile} fullWidth className={classes.button}>
                        Review submission
                    </Button>
                    <Typography variant="body2" gutterBottom className={classes.inputCenter}>
                        {this.state.reviewLatestFileError}
                    </Typography>
                </Fragment>
        } else {
            download_data_file_button =
                <Fragment>
                    <Button disabled fullWidth className={classes.button} variant="outlined">
                        Review submission
                    </Button>
                </Fragment>
        }


        /**
         * Manage display of "Reset" (previously "Delete latest file") button
         * This allows the submitter needs delete an existing file and re-submit a new one.
         */
        if ((submissionStatus === 'VALID' || submissionStatus === 'INVALID') && this.state.fileUploadId !== null) {
            delete_file_button =
                <Fragment>
                    <Button onClick={this.deleteData} fullWidth className={classes.button}>
                        Reset
                    </Button>
                    <Typography variant="body2" gutterBottom className={classes.inputCenter}>
                        {this.state.deleteFileError}
                    </Typography>
                </Fragment>
        } else {
            delete_file_button =
                <Fragment>
                    <Button disabled fullWidth className={classes.button} variant="outlined">
                        Reset
                    </Button>
                </Fragment>
        }


        /** 
         * Manage display of Metadata status field and value. Only display this field
         * for publications with status UNDER_SUBMISSION, i.e. those where
         * the metadata template is submitted.
         */
        let metadata_field_label =
            <Grid item xs={4}>
                <Typography variant="h6" className={classes.submissionTextStyle}>
                    Metadata valid:
                </Typography>
            </Grid>

        if (publicationStatus === "UNDER_SUBMISSION" || bowStatus === "UNDER_SUBMISSION") {
            if (metadataStatus === 'VALID') {
                metadata_status_section =
                    <Fragment>
                        {metadata_field_label}
                        <Grid item xs={8}>
                            <Typography variant="h6" className={classes.submissionTextStyle}>
                                <ReactSVG src={process.env.PUBLIC_URL + '/images/check_24px.svg'} className={classes.check_icon} />
                            </Typography>
                        </Grid>
                    </Fragment>
            } else if (metadataStatus === 'INVALID') {
                metadata_status_section =
                    <Fragment>
                        {metadata_field_label}
                        <Grid item xs={8}>
                            <Typography variant="h6" className={classes.submissionTextStyle}>
                                <ReactSVG src={process.env.PUBLIC_URL + '/images/error_24px.svg'} className={classes.error_icon} />
                            </Typography>
                        </Grid>
                    </Fragment>
            } else if (metadataStatus === 'VALIDATING') {
                metadata_status_section =
                    <Fragment>
                        {metadata_field_label}
                        < Grid item xs={8} >
                            <CircularProgress className={classes.progress} size={24} />
                        </Grid >
                    </Fragment >
            } else if (metadataStatus === 'NA') {
                metadata_status_section =
                    <Fragment>
                        {metadata_field_label}
                        <Grid item xs={8}>
                            <Typography variant="h6" className={classes.submissionTextStyle}>
                                {metadataStatus}
                            </Typography>
                        </Grid>
                    </Fragment>
            } else if (submissionStatus === null) {
                metadata_status_section =
                    <Fragment>
                        {metadata_field_label}
                        <Grid item xs={8}>
                            <Typography variant="h6" className={classes.errorText}>
                                Error retrieving data.
                             </Typography>
                        </Grid>
                    </Fragment>
            } else {
                metadata_status_section =
                    <Fragment>
                        {metadata_field_label}
                        <Grid item xs={8}>
                            <CircularProgress className={classes.progress} size={24} />
                        </Grid>
                    </Fragment>
            }
        }


        /** 
         * Manage display of Summary statistics status value display
         */
        if (summaryStatisticsStatus === 'VALID') {
            summary_statistics_status_icon =
                <Fragment>
                    <Grid item xs={4}>
                        <Typography variant="h6" className={classes.submissionTextStyle}>
                            SumStats valid:
                    </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant="h6" className={classes.submissionTextStyle}>
                            <ReactSVG src={process.env.PUBLIC_URL + '/images/check_24px.svg'} className={classes.check_icon} />
                        </Typography>
                    </Grid>
                </Fragment>
        } else if (summaryStatisticsStatus === 'INVALID') {
            summary_statistics_status_icon =
                <Fragment>
                    <Grid item xs={4}>
                        <Typography variant="h6" className={classes.submissionTextStyle}>
                            SumStats valid:
                    </Typography>
                    </Grid>

                    <Grid item xs={8}>
                        <Typography variant="h6" className={classes.submissionTextStyle}>
                            <ReactSVG src={process.env.PUBLIC_URL + '/images/error_24px.svg'} className={classes.error_icon} />
                        </Typography>
                    </Grid>
                </Fragment>
        }
        else if (submissionStatus === VALIDATING && (publicationStatus === 'UNDER_SUBMISSION' || bowStatus === "UNDER_SUBMISSION")) {
            summary_statistics_status_icon =
                <Fragment>
                    <Grid item xs={4}>
                        <Typography variant="h6" className={classes.submissionTextStyle}>
                            SumStats valid:
                    </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <CircularProgress className={classes.progress} size={24} />
                    </Grid>
                </Fragment>
        }
        else if (submissionStatus === null) {
            summary_statistics_status_icon =
                <Fragment>
                    <Grid item xs={4}>
                        <Typography variant="h6" className={classes.submissionTextStyle}>
                            SumStats valid:
                    </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant="h6" className={classes.errorText}>
                            Error retrieving data.
                    </Typography>
                    </Grid>
                </Fragment>
        } else {
            summary_statistics_status_icon =
                <Grid item xs={8}>
                </Grid>
        }

        /**
         * Manage display of validating thank you message.
         */
        let validating_thank_you;
        if (submissionStatus === VALIDATING) {
            validating_thank_you =
                <Grid item container xs={12}>
                    <Typography variant="body1" className={classes.thankYouSubmissionTextStyle}>
                        Thank you for submitting your data, you will receive an email when the validation is complete.
                    </Typography>
                </Grid>
        }


        /**
         * Manage display of final thank you message after valid file
         * processing status.
         */
        if (submissionStatus === VALID_SUBMISSION || submissionStatus === SUBMITTED) {
            final_thank_you_message =
                <Grid item container xs={12}>
                    <Typography variant="body1" className={classes.thankYouSubmissionTextStyle}>
                        Thank you for submitting your data. Contact <a href={gwasSubsEmailLink}>gwas-subs@ebi.ac.uk</a> if changes are needed.
                    </Typography>
                </Grid>
        }


        /**
         * Manage display of Submission Steps Overview instructions
         * to upload files to Globus. The Globus link should not
         * be displayed when the status is SUBMITTED.
         */
        if (submissionStatus === 'SUBMITTED' || submissionStatus === 'COMPLETE'
            || submissionStatus === 'CURATION_COMPLETE' || submissionStatus === 'NA'
            || submissionStatus === '') {
            upload_files_to_globus_step =
                <Grid item container xs={12}>
                    <Typography className={classes.stepTextStyle} >
                        1 - Upload summary statistics file(s)
                    </Typography>
                </Grid>
        } else {
            upload_files_to_globus_step =
                <Grid item container xs={12}>
                    <Typography className={classes.stepTextStyle} >
                        1 - Upload summary statistics file(s) <a href={globusSumStatsFolder} target="_blank" rel="noopener noreferrer"> to your Globus submission folder</a>
                    </Typography>
                </Grid>
        }


        /** 
         * Upload component display
         */
        upload_component =
            <Fragment>
                <Grid item xs={12}>
                    {this.state.showComponent ?
                        <Upload submission_id={this.SUBMISSION_ID} displayUploadComponent={this.displayUploadComponent} /> : null}
                </Grid>
                <Grid item xs={12}>
                    {this.state.showComponent ?
                        <Button onClick={this.hideUploadComponent} className={classNames(classes.button, classes.closeUploadComponentButton)}>
                            Close File Upload
                        </Button> : null}
                </Grid>
            </Fragment>


        return (
            <Fragment>
                <div className={classes.root}>
                    <Grid
                        container
                        direction="column"
                        justify="flex-start"
                        alignItems="stretch"
                        spacing={4}
                    >
                        <Paper className={classes.paper}>
                            <Grid item xs={12}>
                                {submissionDetailsPanel}
                            </Grid>
                        </Paper>
                    </Grid>
                </div>


                <div className={classes.root}>
                    <Grid
                        container
                        direction="column"
                        justify="flex-start"
                        alignItems="stretch"
                        spacing={4}
                    >
                        <Paper className={classes.paper}>
                            <Grid item xs={12} className={classes.pageHeader}>
                                <Typography variant="h5" className={classes.headerTextStyle}>
                                    Submission Steps Overview
                                </Typography>
                            </Grid>

                            {upload_files_to_globus_step}

                            <Grid item container xs={12}>
                                <Typography className={classes.stepTextStyle} >
                                    2 - Download submission form
                                </Typography>
                            </Grid>

                            <Grid item container xs={12}>
                                <Typography className={classes.stepTextStyle} >
                                    3 - Fill in submission form
                                    (see <a href={publicationStatus === 'UNDER_SUMMARY_STATS_SUBMISSION' ? sumStatsDocs : metadataAndSumStatsDocs} target="_blank" rel="noopener noreferrer">
                                        here</a> for help)
                                </Typography>
                            </Grid>

                            <Grid item container xs={12}>
                                <Typography className={classes.stepTextStyle} >
                                    4 - Upload submission form
                                </Typography>
                            </Grid>

                            <Grid item container xs={12}>
                                <Typography className={classes.stepTextStyle} >
                                    5 - After successful validation of your submission form, click "Submit".
                                </Typography>
                            </Grid>

                            <Grid item container xs={12}>
                                <Typography className={classes.stepTextStyle} >
                                    6 - To remove the current submission form, click "Reset". Use "Review submission" to download the current submission form.
                                </Typography>
                            </Grid>
                        </Paper>
                    </Grid>
                </div>

                <div className={classes.section}>
                    <Grid container
                        direction="row"
                        justify="flex-start"
                        alignItems="stretch"
                        spacing={2}>

                        <Grid item xs={3}>
                            <Grid
                                container
                                direction="column"
                                justify="flex-start"
                                alignItems="stretch"
                            />

                            <Grid item container xs={12}>
                                {upload_sumstats_button}
                            </Grid>

                            <Grid item container xs={12}>
                                {download_template}
                            </Grid>

                            <Grid item container xs={12}>
                                {select_upload_file_button}
                            </Grid>

                            <Grid item container xs={12}>
                                {submit_data_button}
                            </Grid>

                            <Grid item container xs={12}>
                                {download_data_file_button}
                            </Grid>

                            <Grid item container xs={12}>
                                {delete_file_button}
                            </Grid>
                        </Grid>

                        <Grid item xs={9}>
                            <Paper className={classes.paper}>
                                <Grid
                                    container
                                    direction="column"
                                    justify="flex-start"
                                    alignItems="stretch"
                                >
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <Typography gutterBottom variant="h5" className={classes.headerTextStyle}>
                                                Submission Report
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            container
                                            direction="row"
                                            justify="flex-start"
                                            alignItems="stretch"
                                        >
                                            <Grid item container xs={6}>
                                                <Grid item xs={4}>
                                                    <Typography variant="h6" className={classes.submissionTextStyle}>
                                                        Submission ID:
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={8}>
                                                    <Typography variant="h6" className={classes.submissionTextStyle}>
                                                        {this.SUBMISSION_ID}
                                                    </Typography>
                                                </Grid>

                                                <Grid item xs={4}>
                                                    <Typography variant="h6" className={classes.submissionTextStyle}>
                                                        Date created:
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={8}>
                                                    <Typography variant="h6" className={classes.submissionTextStyle}>
                                                        {submissionCreatedDate}
                                                    </Typography>
                                                </Grid>

                                                <Grid item xs={4}>
                                                    <Typography variant="h6" className={classes.submissionTextStyle}>
                                                        User:
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={8}>
                                                    <Typography variant="h6" className={classes.submissionTextStyle}>
                                                        {userName}
                                                    </Typography>
                                                </Grid>

                                                <Grid item xs={4}>
                                                    <Typography variant="h6" className={classes.submissionTextStyle}>
                                                        Current status:
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={8}>
                                                    <Typography variant="h6" className={classes.submissionTextStyle}>
                                                        {currentStatus}
                                                    </Typography>

                                                    {validating_thank_you}

                                                    {final_thank_you_message}
                                                </Grid>
                                            </Grid>

                                            <Grid item container xs={6}>

                                                {metadata_status_section}

                                                {summary_statistics_status_icon}

                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid container className={classes.submissionStats}>
                                        {submission_stats_section}

                                        {file_validation_error_section}
                                    </Grid>

                                    <Grid container
                                        direction="row"
                                        justify="flex-start"
                                        alignItems="center">
                                        {upload_component}
                                    </Grid>

                                </Grid>
                            </Paper>

                        </Grid>
                    </Grid>
                </div >
            </Fragment >
        )
    }
}

SubmissionDetails.propTypes = {
    classes: PropTypes.object.isRequired,
};

SubmissionDetails = withStyles(styles)(SubmissionDetails)

export default ({ location }) => (
    <AuthConsumer>
        {({ onAuthenticate, JWTToken }) => <SubmissionDetails onAuthenticate={onAuthenticate} token={JWTToken} location={location} />}
    </AuthConsumer>
)
