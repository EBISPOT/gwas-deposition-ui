import React, { Component, Fragment } from 'react';

import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
// import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';

import { AuthConsumer } from '../auth-context';
import jwt_decode from 'jwt-decode';
import API_CLIENT from '../apiClient';
import axios from 'axios';
import history from "../history";

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
    statusExplanationMessageTextStyle: {
        fontSize: 18,
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
    wrapper: {
        position: 'relative',
    },
    buttonProgress: {
        color: 'rgb(57, 138, 150)',
        position: 'absolute',
        top: '50%',
        left: 62,
        marginTop: -12,
        marginLeft: -12,
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    },
    iconSmall: {
        fontSize: 20,
    },
    errorText: {
        color: 'red',
        marginRight: 8,
    },
    bold: {
        fontWeight: 600,
    },
});

const BlueCheckbox = withStyles({
    root: {
        '&$checked': {
            color: 'rgb(57, 138, 150)',
        },
    },
    checked: {},
})(props => <Checkbox color="default" {...props} />);


class ProjectDetails extends Component {
    constructor(props) {
        super(props)
        this.API_CLIENT = new API_CLIENT();
        this.ElixirAuthService = new ElixirAuthService();

        // NOTE: bodyOfWorkId is passed from location prop in Route pathname
        if (process.env.PUBLIC_URL) {
            let URL = this.props.location.pathname.split(process.env.PUBLIC_URL)[1];
            this.bodyOfWorkId = URL.split('/')[2];
        }
        else {
            this.bodyOfWorkId = this.props.location.pathname.split('/')[2];
        }

        this.state = ({
            auth: null,
            authEmail: null,
            bodyofwork: [],
            status: null,
            createSubmissionError: false,
            createSubmissionErrorMessage: null,
            isCreateSubmissionDisabled: false,
            redirectError: false,
            redirectErrorMessage: null,
            elixirRegistration: false,
            installGlobus: false,
            linkElixir2Globus: false,
            globusIdentity: null,
            globusIdentityFormatError: false,
            globusIdentityHelperText: null,
            validateSummaryStats: false,
        })
        this.handleChange = this.handleChange.bind(this);
        this.validateGlobusIdentity = this.validateGlobusIdentity.bind(this);
        this.createSubmission = this.createSubmission.bind(this);
        this.redirectToSubmissionDetails = this.redirectToSubmissionDetails.bind(this);
        this.getToken = this.getToken.bind(this);
        this.ElixirAuthService.isTokenExpired = this.ElixirAuthService.isTokenExpired.bind(this);
    }

    /**
     * Get BodyofWork details
     */
    async componentDidMount() {
        this.getBodyOfWork()
    }

    /**
     * Get Body of Work details
     */
    async getBodyOfWork() {
        let token = this.getToken().auth;

        // this.API_CLIENT.getBodyOfWork(this.bodyOfWorkId, token).then((response) => {
        await axios.get(BASE_URI + 'bodyofwork/' + this.bodyOfWorkId,
            { headers: { 'Authorization': 'Bearer ' + token, }, }).then((response) => {
                this.setState({ ...this.state, bodyofwork: response.data })
                this.setState({ ...this.state, status: response.data.status })
                this.setState({ ...this.state, authEmail: this.getToken().authEmail, auth: this.getToken().auth, globusIdentity: this.getToken().authEmail })
            });
    }

    /**
     * Check for token in local storage
     * and parse out email if token is present.
     */
    getToken() {
        let token = null;
        let userEmail = null;
        if (localStorage.getItem('id_token')) {
            token = localStorage.getItem('id_token');
            userEmail = jwt_decode(token).email;
        }
        return { authEmail: userEmail, auth: token };
    }


    /**
     * Handle state of checkboxes
     */
    handleChange = name => event => {
        // If the "linkElixir2Globus" checkbox is checked and either no globusIdentity value is present
        // or an invalid globusIdentity value is present, prevent check and show helper text error.
        if (name === 'linkElixir2Globus' && (this.state.globusIdentity === null || this.state.globusIdentityFormatError)) {
            // Set helper error text based on error type condition
            let errorHelperText = this.state.globusIdentityFormatError ? 'Add valid email to link to Globus' : 'Add email to link to Globus'

            this.setState({
                ...this.state,
                globusIdentityHelperText: errorHelperText,
                globusIdentityFormatError: true,
                linkElixir2Globus: false
            })
        }
        else {
            this.setState({
                ...this.state, [name]:
                    event.target.checked,
                globusIdentityHelperText: '',
            });
        }
    };


    /**
     * Handle state of Input Textfield
     */
    validateGlobusIdentity(event) {
        const email = event.target.value;

        // Regex to check for valid email formatted text
        let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(String(email).toLowerCase())) {
            this.setState({
                ...this.state,
                globusIdentity: email,
                globusIdentityHelperText: '',
                globusIdentityFormatError: false,
                linkElixir2Globus: true
            })
        } else {
            this.setState({
                ...this.state,
                globusIdentity: email,
                globusIdentityHelperText: 'Add valid email to link to Globus',
                globusIdentityFormatError: true,
                linkElixir2Globus: false
            })
        }
    }


    /**
     * Create submission for this publication
     */
    createSubmission() {
        let bodyOfWorkId = this.bodyOfWorkId;
        let token = this.state.auth;
        let globusIdentityEmail = this.state.globusIdentity;
        let gdprAccepted = JSON.parse(localStorage.getItem('gdpr-accepted'));

        this.setState(() => ({
            isCreateSubmissionDisabled: true
        }));

        // Check if user is logged in and if token is still valid and if GDPR accepted
        if (token && !this.ElixirAuthService.isTokenExpired(token) && gdprAccepted) {
            this.API_CLIENT.createSubmission(bodyOfWorkId, globusIdentityEmail).then(response => {
                this.setState(() => ({ createSubmissionError: false }));

                this.redirectToSubmissionDetails();
            })
                .catch(error => {
                    this.setState(() => ({
                        createSubmissionError: true,
                        isCreateSubmissionDisabled: false
                    }));
                    if (error.response) {
                        let createSubmissionErrorMessage = "Error: " + error.response.data
                        this.setState(() => ({ createSubmissionErrorMessage: createSubmissionErrorMessage }));
                    }
                })
        } else {
            if (!JSON.parse(gdprAccepted)) {
                history.push(`${process.env.PUBLIC_URL}/gdpr`, ({
                    from: history.location.pathname
                }));
            }
            else {
                let localPath = history.location.pathname

                // Split off environment specific URL if not localhost (empty string)
                if (localPath.includes(`/gwas/deposition`)) {
                    localPath = history.location.pathname.split(`${process.env.PUBLIC_URL}`)[1]
                }
                history.push(`${process.env.PUBLIC_URL}/login`, ({ from: localPath }));
            }
        }
    }


    async redirectToSubmissionDetails() {
        let bodyOfWorkId = this.bodyOfWorkId;
        let token = this.state.auth;
        let gdprAccepted = JSON.parse(localStorage.getItem('gdpr-accepted'));

        // Check if user is logged in and if token is still valid and if GDPR accepted
        if (token && !this.ElixirAuthService.isTokenExpired(token) && gdprAccepted) {
            // Get SubmissionId by BowId
            await this.API_CLIENT.getSubmissionIdByBowId(bodyOfWorkId, token).then(response => {
                let newSubmissionId = response.data._embedded.submissions[0].submissionId
                return history.push(`${process.env.PUBLIC_URL}/submission/${newSubmissionId}`);
            }).catch(error => {
                if (error.response) {
                    if (error.response.status === 401) {
                        let errorMessage = "Error: You must login to view the submission details."
                        this.setState(() => ({ redirectError: true, redirectErrorMessage: errorMessage }));
                        // Redirect to login page
                        setTimeout(() => {
                            history.push(`${process.env.PUBLIC_URL}/login`);
                        }, 3000)
                    }
                    if (error.response.status === 403) {
                        let errorMessage = "Error: You do not have permission to view the submission details."
                        this.setState(() => ({ redirectError: true, redirectErrorMessage: errorMessage }));
                    }
                    if (error.response.status === 404) {
                        let errorMessage = "Error: No submission exists."
                        this.setState(() => ({ redirectError: true, redirectErrorMessage: errorMessage }));
                    }
                } else {
                    // Zero results returned if user "unauthorized", e.g. did not create the submission
                    if (error.message.includes("undefined")) {
                        let errorMessage = "Error: You do not have permission to view this page."
                        this.setState(() => ({ redirectError: true, redirectErrorMessage: errorMessage }));
                    } else {
                        // Display all other error messages
                        let errorMessage = error.message
                        this.setState(() => ({ redirectError: true, redirectErrorMessage: errorMessage }));
                    }
                }
            })
        }
        else {
            if (!JSON.parse(gdprAccepted)) {
                history.push(`${process.env.PUBLIC_URL}/gdpr`, ({ from: history.location.pathname }));
            }
            else {
                history.push(`${process.env.PUBLIC_URL}/login`, ({ from: history.location.pathname }));
            }
        }
    }


    render() {
        const { classes } = this.props;
        const { createSubmissionError } = this.state;
        const { createSubmissionErrorMessage } = this.state;
        const { redirectError } = this.state;
        const { redirectErrorMessage } = this.state;
        const { status } = this.state;
        const { isCreateSubmissionDisabled } = this.state;
        const { globusIdentityFormatError } = this.state;

        const { authEmail } = this.state;
        const { globusIdentityHelperText } = this.state;

        let submission_checklist;
        let elixirRegistrationLink = <a href="https://elixir-europe.org/register" target="_blank" rel="noopener noreferrer">Elixir ID</a>
        let globusLink = <a href="https://www.globus.org/globus-connect-personal" target="_blank" rel="noopener noreferrer">Globus Connect Personal</a>
        let summaryStatsFormattingLink = <a href="https://www.ebi.ac.uk/gwas/docs/summary-statistics-format" target="_blank" rel="noopener noreferrer">Format and validate</a>
        // const sumStatsDocs = `https://www.ebi.ac.uk/gwas/docs/submission-summary-statistics`;
        // const metadataAndSumStatsDocs = `https://www.ebi.ac.uk/gwas/docs/submission-summary-statistics-plus-metadata`;
        const { elixirRegistration, installGlobus, linkElixir2Globus, validateSummaryStats } = this.state;
        const checklistCompleteError = [elixirRegistration, installGlobus, linkElixir2Globus, validateSummaryStats].filter(v => v).length !== 4;

        let create_submission_button;
        let showSubmissionDetailsButton;
        // const gwasInfoEmail = <a href="mailto:gwas-info@ebi.ac.uk?subject=Eligibility Review">gwas-info@ebi.ac.uk</a>;
        // const gwasSubsEmail = <a href="mailto:gwas-subs@ebi.ac.uk">gwas-subs@ebi.ac.uk</a>;
        // let statusExplanationMessageText;
        // const eligibleBoldText = <span className={classes.bold}>submit both summary statistics and supporting metadata</span>
        // const publishedBoldText = <span className={classes.bold}>submit summary statistics</span>


        // Submission checklist checklist form
        if (status === 'NEW') {
            submission_checklist =
                <div>
                    <Grid item xs={12}>
                        <Grid><Typography>&nbsp;</Typography></Grid>
                        <Typography variant="h5" className={classes.headerTextStyle}>
                            Submission Checklist
                            </Typography>

                        <Typography>
                            Please complete these items before creating the submission. Once all items are checked, the "Create Submission"
                            button will be active.
                        </Typography>
                    </Grid>

                    <FormControl required error={checklistCompleteError} component="fieldset" className={classes.formControl}>
                        <FormGroup>
                            <FormControlLabel
                                control={<BlueCheckbox checked={elixirRegistration} onChange={this.handleChange('elixirRegistration')} color="secondary" value="elixirRegistration" />}
                                label={<Typography>Create an {elixirRegistrationLink} to login to this application</Typography>}
                            />

                            <FormControlLabel
                                control={<BlueCheckbox checked={installGlobus} onChange={this.handleChange('installGlobus')} value="installGlobus" />}
                                label={<Typography>Install {globusLink} (required to submit summary statistics)</Typography>}
                            />

                            <FormControlLabel
                                control={<BlueCheckbox checked={linkElixir2Globus} onChange={this.handleChange('linkElixir2Globus')} value="linkElixir2Globus" />}
                                label={<Typography>Enter your registered Globus email (required to submit summary statistics)</Typography>}
                            />
                            <TextField
                                id="globusIdentity"
                                label="Globus email"
                                required
                                key={authEmail} // Set key to state value to force component to re-render
                                defaultValue={authEmail}
                                onChange={this.validateGlobusIdentity}
                                error={globusIdentityFormatError}
                                helperText={globusIdentityHelperText}
                            />

                            <FormControlLabel
                                control={<BlueCheckbox checked={validateSummaryStats} onChange={this.handleChange('validateSummaryStats')} value="validateSummaryStats" />}
                                label={<Typography>{summaryStatsFormattingLink} your summary statistics data (required to submit summary statistics)</Typography>}
                            />
                        </FormGroup>
                    </FormControl>
                </div>
        }

        // Show Create Submission button
        if (status === 'NEW') {
            create_submission_button =
                <div className={classes.wrapper}>
                    <Fragment>
                        <Button
                            className={classes.button}
                            disabled={isCreateSubmissionDisabled || checklistCompleteError || globusIdentityFormatError}
                            onClick={this.createSubmission}
                        >
                            Create Submission
                        </Button >
                        {isCreateSubmissionDisabled && (
                            <div><CircularProgress size={24} className={classes.buttonProgress} /></div>
                        )}
                    </Fragment>
                </div>
        }

        // Show View Submission details button
        if (status === 'SUBMISSION_EXISTS') {
            showSubmissionDetailsButton =
                <Button onClick={this.redirectToSubmissionDetails} className={classes.button}>
                    View Submission Details
                </Button>
        }

        // Journal URL
        let journalURLDisplay = <a href={this.state.bodyofwork.url} target="_blank" rel="noopener noreferrer">{this.state.bodyofwork.url}</a>

        // PrePrint URL
        let preprintServerDOIDisplay = <a href={this.state.bodyofwork.preprintServerDOI} target="_blank" rel="noopener noreferrer">{this.state.bodyofwork.preprintServerDOI}</a>

        // First Author
        let firstAuthorDisplay;
        if (this.state.bodyofwork.firstAuthor && this.state.bodyofwork.firstAuthor.firstName
            && this.state.bodyofwork.firstAuthor.lastName) {
            firstAuthorDisplay =
                <Typography className={classes.publicationTextStyle}>
                    {this.state.bodyofwork.firstAuthor.firstName} &nbsp;
                    {this.state.bodyofwork.firstAuthor.lastName}
                </Typography>
        }
        if (this.state.bodyofwork.firstAuthor && this.state.bodyofwork.firstAuthor.group) {
            firstAuthorDisplay =
                <Typography className={classes.publicationTextStyle}>
                    {this.state.bodyofwork.firstAuthor.group}
                </Typography>
        }

        // Last Author
        let lastAuthorDisplay;
        if (this.state.bodyofwork.lastAuthor && this.state.bodyofwork.lastAuthor.firstName
            && this.state.bodyofwork.lastAuthor.lastName) {
            lastAuthorDisplay =
                <Typography className={classes.publicationTextStyle}>
                    {this.state.bodyofwork.lastAuthor.firstName} &nbsp;
                            {this.state.bodyofwork.lastAuthor.lastName}
                </Typography>
        }
        if (this.state.bodyofwork.lastAuthor && this.state.bodyofwork.lastAuthor.group) {
            lastAuthorDisplay =
                <Typography className={classes.publicationTextStyle}>
                    {this.state.bodyofwork.lastAuthor.group}
                </Typography>
        }

        // Corresponding Authors
        let correspondingAuthorDisplay;
        if (this.state.bodyofwork.correspondingAuthors) {
            correspondingAuthorDisplay =
                this.state.bodyofwork.correspondingAuthors.map((corrAuthor, index) => (
                    <Typography key={index} className={classes.publicationTextStyle}>
                        {corrAuthor.firstName}  &nbsp;
                            {corrAuthor.lastName} &nbsp;
                            <a href={"mailto:" + corrAuthor.email}>{corrAuthor.email}</a>
                    </Typography>
                ))
        }

        return (
            <div className={classes.root} >
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
                                <Grid item xs={8} className={classes.pageHeader}>
                                    <Typography variant="h5" className={classes.headerTextStyle}>
                                        Details for GCP ID: {this.bodyOfWorkId}
                                    </Typography>
                                    <Grid><Typography>&nbsp;</Typography></Grid>
                                </Grid>

                                <Grid item xs={4} container alignItems="flex-start" justify="flex-end" direction="row">
                                    {showSubmissionDetailsButton}

                                    <Grid container alignItems="flex-start" justify="flex-end">
                                        <Typography variant="body2" gutterBottom className={classes.errorText}>
                                            {redirectError ? redirectErrorMessage : null}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h6" className={classes.publicationTitleTextStyle}>
                                    {this.state.bodyofwork.title}
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
                                        {this.state.bodyofwork.description}
                                    </Typography>
                                </Grid>


                                <Grid item xs={3}>
                                    <Typography variant="h6" className={classes.publicationTextStyle}>
                                        First Author:
                                    </Typography>
                                </Grid>
                                <Grid item xs={9} >
                                    {firstAuthorDisplay}
                                </Grid>

                                <Grid item xs={3}>
                                    <Typography variant="h6" className={classes.publicationTextStyle}>
                                        Last Author:
                                    </Typography>
                                </Grid>
                                <Grid item xs={9} >
                                    {lastAuthorDisplay}
                                </Grid>

                                <Grid item xs={3}>
                                    <Typography variant="h6" className={classes.publicationTextStyle}>
                                        Corresponding Author(s):
                                    </Typography>
                                </Grid>
                                <Grid item xs={9} >
                                    {correspondingAuthorDisplay}
                                </Grid>


                                {(this.state.bodyofwork.journal) && (
                                    <Fragment>
                                        <Grid item xs={3}>
                                            <Typography variant="h6" className={classes.publicationTextStyle}>
                                                Published in:
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={9}>
                                            <Typography className={classes.publicationTextStyle} >
                                                {this.state.bodyofwork.journal}
                                            </Typography>

                                            {(this.state.bodyofwork.url) && (
                                                <Typography>
                                                    {journalURLDisplay}
                                                </Typography>
                                            )}
                                        </Grid>
                                    </Fragment>
                                )}


                                {(this.state.bodyofwork.prePrintServer) && (
                                    <Fragment>
                                        <Grid item xs={3}>
                                            <Typography variant="h6" className={classes.publicationTextStyle}>
                                                PrePrint available in:
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={9}>
                                            <Typography className={classes.publicationTextStyle}>
                                                {this.state.bodyofwork.prePrintServer} &nbsp;

                                                {preprintServerDOIDisplay}
                                            </Typography>
                                        </Grid>
                                    </Fragment>
                                )}

                                {(this.state.bodyofwork.embargoDate || this.state.bodyofwork.embargoUntilPublished) && (
                                    <Fragment>
                                        <Grid item xs={3}>
                                            <Typography className={classes.publicationTextStyle}>
                                                Embargo until:
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={9}>
                                            <Typography className={classes.publicationTextStyle}>
                                                {this.state.bodyofwork.embargoUntilPublished
                                                    ? 'date of publication' : `${this.state.bodyofwork.embargoDate}`}
                                            </Typography>
                                        </Grid>
                                    </Fragment>
                                )}

                                <Grid item xs={12}>
                                    {submission_checklist}
                                </Grid>

                                <Grid item xs={12}>
                                    {create_submission_button}
                                </Grid>

                                <Grid container alignItems="flex-start" justify="flex-start">
                                    <Typography variant="body2" gutterBottom className={classes.errorText}>
                                        {createSubmissionError ? createSubmissionErrorMessage : null}
                                    </Typography>
                                </Grid>

                            </Grid>

                        </Grid>
                    </Grid>

                </Paper>
            </div>


            // <h4> JWTToken: {this.props.token}</h4>

            //Alternative option to get info from Context with just "export default Home"
            // <AuthConsumer>
            //     {({ isAuthenticated }) => <h4> Login State: {isAuthenticated.toString()}</h4>}
            // </AuthConsumer>

        )
    }
}

ProjectDetails.propTypes = {
    classes: PropTypes.object.isRequired,
};

ProjectDetails = withStyles(styles)(ProjectDetails)

export default ({ location }) => (
    <AuthConsumer>
        {({ onAuthenticate, JWTToken }) => <ProjectDetails onAuthenticate={onAuthenticate} token={JWTToken} location={location} />}
    </AuthConsumer>
)
