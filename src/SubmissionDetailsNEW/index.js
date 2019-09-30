import React, { Component, Fragment } from 'react';
import Upload from "../Upload";

import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import ReactSVG from 'react-svg'

import { AuthConsumer } from '../auth-context';

import API_CLIENT from '../apiClient';
import history from "../history";

import axios from 'axios';


const styles = theme => ({
    root: {
        padding: theme.spacing(3, 2),
    },
    paper: {
        padding: theme.spacing(2),
        height: '100%',
        // margin: 'auto',
        // maxWidth: 1200,
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
    submissionTextStyle: {
        fontSize: 18,
        marginLeft: 12,
        marginRight: 8,
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
    constructor(props) {
        super(props)
        this.API_CLIENT = new API_CLIENT();

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
            userName: null,
            submissionCreatedDate: null,
            publication_obj: [],
            file_upload_error: null,
            isNotValid: true,
            submissionError: null,
            deleteFileError: null,
            downloadSummaryStatsFileError: null,
            submissionStatus: null,
            metadataStatus: null,
            summaryStatisticsStatus: null,
            publicationStatus: null,
            showComponent: false,
            showButtonVisibility: 'visible',
            fileUploadId: null,
            fileName: null,
            fileValidationErrorMessage: null,
            displaySummaryStatsSection: true,
            summaryStatsTemplateFileUploadId: null,
            summaryStatsTemplateFileName: null,
        })
        this.downloadDataFile = this.downloadDataFile.bind(this);
        this.downloadSummaryStatsTemplate = this.downloadSummaryStatsTemplate.bind(this);
        this.submitData = this.submitData.bind(this);
        this.deleteData = this.deleteData.bind(this);
        this.displayUploadComponent = this.displayUploadComponent.bind(this);
        this.hideUploadComponent = this.hideUploadComponent.bind(this);
        this.parseFileMetadata = this.parseFileMetadata.bind(this);
    }

    /**
     * Get Submission details and update state
     */
    async componentDidMount() {
        this.API_CLIENT.getSubmission(this.SUBMISSION_ID).then((data) => {

            this.setState({ ...this.state, submission_data: data });
            this.setState({ ...this.state, submissionStatus: data.submission_status });
            this.setState({ ...this.state, metadataStatus: data.metadata_status });
            this.setState({ ...this.state, summaryStatisticsStatus: data.summary_statistics_status });
            this.setState({ ...this.state, publication_obj: data.publication });
            this.setState({ ...this.state, publicationStatus: data.publication.status });

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

            if (data.files.length > 0) {
                /** 
                 * Parse file metadata
                */
                const { summaryStatsFileMetadata,
                    metadataFileMetadata,
                    summaryStatsTemplateFileMetadata } = this.parseFileMetadata(data.files);

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

                /**
                 * Set data for Download Summary Stats template
                 */
                if (summaryStatsTemplateFileMetadata.fileUploadId !== undefined) {
                    this.setState({ ...this.state, summaryStatsTemplateFileUploadId: summaryStatsTemplateFileMetadata.fileUploadId });
                    this.setState({ ...this.state, summaryStatsTemplateFileName: summaryStatsTemplateFileMetadata.fileName });
                }
            }
        }).catch(error => {
            console.log("** Error: ", error);
        });
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
     * Download data file for submission
     */
    downloadDataFile() {
        let submissionId = this.SUBMISSION_ID;
        let fileId = this.state.fileUploadId;
        let fileName = this.state.fileName;

        this.API_CLIENT.downloadDataFile(submissionId, fileId, fileName);
    }

    downloadMetadataTemplate() {
        this.API_CLIENT.downloadTemplate();
    }

    /**
     * Download prefilled SS template
     */
    downloadSummaryStatsTemplate() {
        let submissionId = this.SUBMISSION_ID;
        let pmid = this.state.publication_obj.pmid;
        let summaryStatsTemplateFileId = this.state.summaryStatsTemplateFileUploadId;
        // let summaryStatsTemplateFileName = this.state.summaryStatsTemplateFileName;
        let summaryStatsTemplateFileName = `prefilled_template_${pmid}.xlsx`;

        const BASE_URI = process.env.REACT_APP_LOCAL_BASE_URI;

        axios.get(BASE_URI + 'submissions/' + submissionId + '/uploads/' + summaryStatsTemplateFileId + '/download',
            {
                responseType: 'blob',
            }
        ).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', summaryStatsTemplateFileName);
            document.body.appendChild(link);
            link.click();
        }
        ).catch((error) => {
            let downloadSSTemplateErrorLabel = "Error: File not found."
            this.setState({ downloadSummaryStatsFileError: downloadSSTemplateErrorLabel });
        })
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
            history.push(`${process.env.PUBLIC_URL}/login`);
        }
    }


    /**
     * Submit data 
     */
    submitData() {
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
            history.push(`${process.env.PUBLIC_URL}/submissions`);
        }
        else {
            alert("Please login to create a submission")
            history.push(`${process.env.PUBLIC_URL}/login`);
        }
    }


    render() {
        const { classes } = this.props;
        const { error } = this.state;
        const { submissionError } = this.state;
        // const bull = <span className={classes.bullet}>•</span>;

        const OVERALL_STATUS_STARTED = 'STARTED';
        const VALID_SUBMISSION = 'VALID';
        const VALIDATING = 'VALIDATING';
        const SUBMITTED = 'SUBMITTED';

        const { publicationStatus } = this.state;
        let transformedPublicationStatus;
        if (publicationStatus === 'UNDER_SUMMARY_STATS_SUBMISSION') {
            transformedPublicationStatus = 'OPEN FOR SUMMARY STATISTICS SUBMISSION';
        }
        else {
            transformedPublicationStatus = 'OPEN FOR SUBMISSION';
        }

        const { submissionStatus } = this.state;
        const { metadataStatus } = this.state;
        let metadata_status_icon;
        const { summaryStatisticsStatus } = this.state;
        let summary_statistics_status_icon;

        const { displaySummaryStatsSection } = this.state;
        const { fileValidationErrorMessage } = this.state;
        const { userName } = this.state;
        const { submissionCreatedDate } = this.state;

        let submission_stats_section;
        let file_validation_error_section;
        let download_summary_stats_button;
        let download_template;
        let select_upload_file_button;
        let upload_component;
        let submit_data_button;
        let delete_file_button;
        let download_data_file_button;

        /**
         * Display Submission statistics section if a file has been uploaded
         * and the file Dropzone component is not being displayed
         */
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
         * Manage display of "Download template" file button
         * For a publication with status UNDER_SUMMARY_STATS_SUBMISSION, 
         * this downloads the pre-filled template file.
         * 
         * For a publication with status UNDER_SUBMISSION, this downloads 
         * the metadata template. 
         */
        if (submissionStatus === 'STARTED') {
            if (publicationStatus === 'UNDER_SUMMARY_STATS_SUBMISSION') {
                download_template =
                    <Fragment>
                        <Button onClick={this.downloadSummaryStatsTemplate} fullWidth className={classes.button}>
                            Download template
                        </Button>
                        <Typography variant="body2" gutterBottom className={classes.inputCenter}>
                            {this.state.downloadSummaryStatsFileError}
                        </Typography>
                    </Fragment>
            }
            if (publicationStatus === 'UNDER_SUBMISSION') {
                download_template =
                    <Fragment>
                        <Button onClick={this.downloadMetadataTemplate} fullWidth className={classes.button}>
                            Download template
                        </Button>
                        <Typography variant="body2" gutterBottom className={classes.inputCenter}>
                            {/* {this.state.downloadSummaryStatsFileError} */}
                        </Typography>
                    </Fragment>
            }
        }
        else {
            download_template =
                <Fragment>
                    <Button fullWidth className={classes.button} disabled style={{ visibility: this.state.showButtonVisibility }} variant="outlined">
                        Download template
                    </Button>
                </Fragment>
        }


        /**
         * Manage display of "Upload template" file button
         */
        if (submissionStatus === 'STARTED') {
            select_upload_file_button =
                <Fragment>
                    <Button fullWidth onClick={this.displayUploadComponent} className={classes.button} variant="outlined">
                        Upload template
                    </Button>
                    <Typography variant="body2" gutterBottom className={classes.inputCenter}>
                        {   /* TODO: Add upload Error: {this.state.downloadSummaryStatsFileError} */}
                    </Typography>
                </Fragment>
        } else {
            select_upload_file_button =
                <Fragment>
                    <Button fullWidth disabled size="small" className={classes.button} variant="outlined">
                        Upload template
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
                </Fragment>
        }


        /**
        * Manage display of "Review latest file" button
        * This downloads the user provided data file.
        */
        if (submissionStatus === 'VALID' || submissionStatus === 'INVALID' || submissionStatus === 'SUBMITTED') {
            download_data_file_button =
                <Fragment>
                    <Button onClick={this.downloadDataFile} fullWidth className={classes.button}>
                        Review latest file
                    </Button>
                </Fragment>
        } else {
            download_data_file_button =
                <Fragment>
                    <Button disabled fullWidth className={classes.button} variant="outlined">
                        Review latest file
                    </Button>
                </Fragment>
        }


        /**
         * Manage display of "Delete latest file" button 
         * This allows the submitter needs delete an existing file and re-submit a new one.
         */
        if ((submissionStatus === 'VALID' || submissionStatus === 'INVALID') && this.state.fileUploadId !== null) {
            delete_file_button =
                <Button onClick={this.deleteData} fullWidth className={classes.button}>
                    Delete latest file
                </Button>
        } else {
            delete_file_button =
                <Button disabled fullWidth className={classes.button} variant="outlined">
                    Delete latest file
                </Button>
        }


        /** 
         * Manage display of Metadata status image
         */
        if (metadataStatus === 'VALID' || metadataStatus === 'NA') {
            metadata_status_icon =
                <Fragment>
                    <Grid item xs={8}>
                        <Typography variant="h6" className={classes.submissionTextStyle}>
                            <ReactSVG src={process.env.PUBLIC_URL + '/images/check_24px.svg'} className={classes.logo} />
                        </Typography>
                    </Grid>
                </Fragment>
        } else {
            metadata_status_icon =
                <Fragment>
                    <Grid item xs={8}>
                        <Typography variant="h6" className={classes.submissionTextStyle}>
                            <ReactSVG src={process.env.PUBLIC_URL + '/images/error_24px.svg'} className={classes.logo} />
                        </Typography>
                    </Grid>
                </Fragment>
        }


        /** 
         * Manage display of Summary statistics status image
         */
        if (summaryStatisticsStatus === 'VALID') {
            summary_statistics_status_icon =
                <Grid item xs={8}>
                    <Typography variant="h6" className={classes.submissionTextStyle}>
                        <ReactSVG src={process.env.PUBLIC_URL + '/images/check_24px.svg'} className={classes.logo} />
                    </Typography>
                </Grid>
        } else if (summaryStatisticsStatus === 'INVALID') {
            summary_statistics_status_icon =
                <Grid item xs={8}>
                    <Typography variant="h6" className={classes.submissionTextStyle}>
                        <ReactSVG src={process.env.PUBLIC_URL + '/images/error_24px.svg'} className={classes.logo} />
                    </Typography>
                </Grid>
        } else if (summaryStatisticsStatus === 'VALIDATING') {
            summary_statistics_status_icon =
                <Grid item xs={8}>
                    <Typography variant="h6" className={classes.submissionTextStyle}>
                        <CircularProgress className={classes.progress} size={24} />
                    </Typography>
                </Grid>
        } else {
            summary_statistics_status_icon =
                <Grid item xs={8}>
                    <Typography variant="h6" className={classes.submissionTextStyle}>
                        <ReactSVG src={process.env.PUBLIC_URL + '/images/error_24px.svg'} className={classes.logo} />
                    </Typography>
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
                    <button variant="outlined" color="secondary" size="small" className={classes.button}
                        onClick={this.hideUploadComponent}
                    >
                        Cancel
                        </button> : null}
            </Grid>



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
                                <Typography gutterBottom variant="h5" className={classes.headerTextStyle}>
                                    Publication details for PMID: {this.state.publication_obj.pmid}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h6" className={classes.publicationTitleTextStyle}>
                                    {this.state.publication_obj.title}
                                </Typography>
                            </Grid>

                            <Grid container item>
                                <Typography className={classes.publicationTextStyle} >
                                    {this.state.publication_obj.firstAuthor} et al.
                                    </Typography>
                                <Typography className={classes.publicationTextStyle} >
                                    {this.state.publication_obj.publicationDate}
                                </Typography>
                                <Typography className={classes.publicationTextStyle} >
                                    {this.state.publication_obj.journal}
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography className={classes.publicationCatalogStatusTextStyle}>
                                    Catalog status: {transformedPublicationStatus}
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
                                                        {submissionStatus}
                                                    </Typography>
                                                </Grid>
                                            </Grid>

                                            <Grid item container xs={6}>
                                                <Grid item xs={4}>
                                                    <Typography variant="h6" className={classes.submissionTextStyle}>
                                                        Metadata valid
                                                    </Typography>
                                                </Grid>
                                                {metadata_status_icon}

                                                <Grid item xs={4}>
                                                    <Typography variant="h6" className={classes.submissionTextStyle}>
                                                        SumStats valid
                                                    </Typography>
                                                </Grid>
                                                {summary_statistics_status_icon}

                                                <Grid item xs={12} className={classes.filler}></Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid container className={classes.submissionStats}>
                                        {submission_stats_section}

                                        {/* {fileValidationErrorMessage} */}

                                        {file_validation_error_section}

                                        {/* <Grid item container xs={12}>
                                            <Grid item xs={2}>
                                                <Typography variant="h6" className={classes.submissionTextStyle}>
                                                    Errors:
                                                 </Typography>
                                            </Grid>
                                            <Grid item xs={10}>
                                                <Typography gutterBottom>
                                                {fileValidationErrorMessage}
                                                </Typography>
                                            </Grid>
                                        </Grid> */}

                                    </Grid>

                                </Grid>
                            </Paper>


                            {/* <Paper className={classes.paper}>

                                    <Grid container>
                                        <Grid item xs={12}>
                                            <Typography gutterBottom variant="h5" className={classes.headerTextStyle}>
                                                Submission Report
                                            </Typography>
                                        </Grid>

                                        <Grid container xs={6}>
                                            <Grid item xs={3}>
                                                <Typography variant="h6" className={classes.submissionTextStyle}>
                                                    Submission ID:
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={9}>
                                                <Typography variant="h6" className={classes.submissionTextStyle}>
                                                    Some value...
                                                </Typography>
                                            </Grid>
                                        </Grid>

                                        <Grid container item xs={6}>
                                            <Grid item xs={4}>
                                                <Typography variant="h6" className={classes.submissionTextStyle}>
                                                    Metadata valid
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={8}>
                                                <Typography variant="h6" className={classes.submissionTextStyle}>
                                                    metadata status image... check or x
                                                </Typography>
                                            </Grid>
                                        </Grid>

                                        <Grid container xs={6}>
                                            <Grid item xs={3}>
                                                <Typography variant="h6" className={classes.submissionTextStyle}>
                                                    Date created:
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={9}>
                                                <Typography variant="h6" className={classes.submissionTextStyle}>
                                                    Some value...
                                                </Typography>
                                            </Grid>
                                        </Grid>

                                        <Grid container item xs={6}>
                                            <Grid item xs={4}>
                                                <Typography variant="h6" className={classes.submissionTextStyle}>
                                                    SumStats valid
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={8}>
                                                <Typography variant="h6" className={classes.submissionTextStyle}>
                                                    sumstats status image... check or x
                                                </Typography>
                                            </Grid>
                                        </Grid>

                                        <Grid container xs={12}>
                                            <Grid item xs={3}>
                                                <Typography variant="h6" className={classes.submissionTextStyle}>
                                                    User:
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={9}>
                                                <Typography variant="h6" className={classes.submissionTextStyle}>
                                                    User name
                                                </Typography>
                                            </Grid>
                                        </Grid>


                                        <Grid container xs={12}>
                                            <Grid item xs={3}>
                                                <Typography variant="h6" className={classes.submissionTextStyle}>
                                                    Current status:
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={9}>
                                                <Typography variant="h6" className={classes.submissionTextStyle}>
                                                    submission status here...
                                                </Typography>
                                            </Grid>
                                        </Grid>

                                        <Grid item xs={3}>
                                            <Paper className={classes.paper}>xs=3</Paper>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Paper className={classes.paper}>xs=3</Paper>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Paper className={classes.paper}>xs=3</Paper>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Paper className={classes.paper}>xs=3</Paper>
                                        </Grid>
                                    </Grid>
                                </Paper>
                                </Grid>
                                */}


                        </Grid>

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
                    {/* <Grid container
                        direction="column"
                        justify="center"
                        alignItems="flex-start"
                        spacing={3}
                    >
                        {download_data_file_button}
                    </Grid> */}
                    {/* </Grid> */}

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
