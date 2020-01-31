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
import history from "../history";

import ElixirAuthService from '../ElixirAuthService';


// THIS WORKS
// const PublicationDetails = ({ location }) => {
//     (console.log(location));
//     return (
//         // <div>{location.state.pmid}</div> // undefined if page opened in new tab
//         <div>{location.pathname}</div>
//     )
// }
// export default PublicationDetails;

// const auth = localStorage.getItem('id_token');

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
        // color: blue[400],
        '&$checked': {
            // color: blue[600],
            color: 'rgb(57, 138, 150)',
        },
    },
    checked: {},
})(props => <Checkbox color="default" {...props} />);


class PublicationDetails extends Component {
    constructor(props) {
        super(props)
        this.API_CLIENT = new API_CLIENT();
        this.ElixirAuthService = new ElixirAuthService();

        // NOTE: PUBMED_ID is passed from location prop in Route pathname
        if (process.env.PUBLIC_URL) {
            let URL = this.props.location.pathname.split(process.env.PUBLIC_URL)[1];
            this.PUBMED_ID = URL.split('/')[2];
        }
        else {
            this.PUBMED_ID = this.props.location.pathname.split('/')[2];
        }

        this.state = ({
            auth: localStorage.getItem('id_token'),
            publication: [],
            publicationStatus: null,
            transformedPublicationStatus: null,
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
            validateSummaryStats: false,
        })
        this.handleChange = this.handleChange.bind(this);
        this.validateGlobusIdentity = this.validateGlobusIdentity.bind(this);
        this.createSubmission = this.createSubmission.bind(this);
        this.redirectToSubmissionDetails = this.redirectToSubmissionDetails.bind(this);
        this.getUserFriendlyStatusLabels = this.getUserFriendlyStatusLabels.bind(this);
        this.ElixirAuthService.isTokenExpired = this.ElixirAuthService.isTokenExpired.bind(this);
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
     * Handle state of checkboxes
     */
    handleChange = name => event => {
        this.setState({ ...this.state, [name]: event.target.checked });
    };


    /**
     * Handle state of Input Textfield
     */
    validateGlobusIdentity(event) {
        const email = event.target.value;

        // Regex to check for valid email formatted text
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(String(email).toLowerCase())) {
            this.setState({ ...this.state, globusIdentity: email, globusIdentityFormatError: false, linkElixir2Globus: true })
        } else {
            this.setState({ ...this.state, globusIdentity: jwt_decode(this.state.auth).email, globusIdentityFormatError: true, linkElixir2Globus: false })
        }
    }


    /**
     * Create submission for this publication
     */
    createSubmission() {
        let pmid = this.PUBMED_ID;
        let token = this.state.auth;
        let globusIdentityEmail = this.state.globusIdentity;

        this.setState(() => ({
            isCreateSubmissionDisabled: true
        }));

        // Check if user is logged in and if token is still valid
        if (token && !this.ElixirAuthService.isTokenExpired(token)) {
            this.API_CLIENT.createSubmission(pmid, globusIdentityEmail).then(response => {
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
        }
        // Check if token is expired
        else if (token && this.ElixirAuthService.isTokenExpired(token)) {
            alert("Your session has expired, please login again.")
            history.push(`${process.env.PUBLIC_URL}/login`);
        }
        else {
            alert("Please login to create a submission.")
            history.push(`${process.env.PUBLIC_URL}/login`);
        }
    }


    async redirectToSubmissionDetails() {
        let pmid = this.PUBMED_ID;
        let token = this.state.auth;

        // Check if user is logged in and if token is still valid
        if (token && !this.ElixirAuthService.isTokenExpired(token)) {
            // Get SubmissionId
            await this.API_CLIENT.getSubmissionId(pmid, token).then(response => {
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
        // Check if token is expired
        else if (token && this.ElixirAuthService.isTokenExpired(token)) {
            alert("Your session has expired, please login again.")
            history.push(`${process.env.PUBLIC_URL}/login`);
        }
        else {
            alert("Please login to view the submission details.")
            history.push(`${process.env.PUBLIC_URL}/login`);
        }
    }


    render() {
        const { classes } = this.props;
        const { createSubmissionError } = this.state;
        const { createSubmissionErrorMessage } = this.state;
        const { redirectError } = this.state;
        const { redirectErrorMessage } = this.state;
        const { publicationStatus } = this.state;
        const { isCreateSubmissionDisabled } = this.state;
        const { globusIdentityFormatError } = this.state;
        const { transformedPublicationStatus } = this.state;

        let submission_checklist;
        let elixirRegistrationLink = <a href="https://elixir-europe.org/register" target="_blank" rel="noopener noreferrer">Elixir ID</a>
        let globusLink = <a href="https://www.globus.org/globus-connect-personal" target="_blank" rel="noopener noreferrer">Globus Connect Personal</a>
        let linkElixir2GlobusLink = <a href=" https://docs.globus.org/how-to/link-to-existing/" target="_blank" rel="noopener noreferrer">Elixir account to Globus</a>
        let summaryStatsFormattingLink = <a href="https://www.ebi.ac.uk/gwas/docs/summary-statistics-format" target="_blank" rel="noopener noreferrer">Format and validate</a>
        const { elixirRegistration, installGlobus, linkElixir2Globus, validateSummaryStats } = this.state;
        const checklistCompleteError = [elixirRegistration, installGlobus, linkElixir2Globus, validateSummaryStats].filter(v => v).length !== 4;

        let create_submission_button;
        let showSubmissionDetailsButton;
        const gwasInfoEmail = <a href="mailto:gwas-info@ebi.ac.uk?subject=Eligibility Review">gwas-info@ebi.ac.uk</a>;
        const gwasSubsEmail = <a href="mailto:gwas-subs@ebi.ac.uk">gwas-subs@ebi.ac.uk</a>;
        let statusExplanationMessageText;
        const eligibleBoldText = <span className={classes.bold}>submit both summary statistics and supporting metadata</span>
        const publishedBoldText = <span className={classes.bold}>submit summary statistics</span>


        // Submission checklist checklist form
        if (publicationStatus === 'ELIGIBLE' || publicationStatus === 'PUBLISHED') {
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
                        {/* <FormLabel component="legend">Please complete these items before
                    creating the submission. Once all items are checked, the "Create Submission"
                    button will be active.
                    </FormLabel> */}
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
                                defaultValue={jwt_decode(this.state.auth).email}
                                onChange={this.validateGlobusIdentity}
                                error={globusIdentityFormatError}
                            />

                            <FormControlLabel
                                control={<BlueCheckbox checked={validateSummaryStats} onChange={this.handleChange('validateSummaryStats')} value="validateSummaryStats" />}
                                label={<Typography>{summaryStatsFormattingLink} your summary statistics data (required to submit summary statistics)</Typography>}
                            />
                        </FormGroup>
                        {/* <FormHelperText>Check all steps to activate the "Create Submission" button</FormHelperText> */}
                    </FormControl>
                </div>
        }


        // Show Create Submission button
        if (publicationStatus === 'ELIGIBLE' || publicationStatus === 'PUBLISHED') {
            create_submission_button =
                <div className={classes.wrapper}>
                    <Fragment>
                        <Button
                            className={classes.button}
                            disabled={isCreateSubmissionDisabled || checklistCompleteError || globusIdentityFormatError}
                            // disabled={checklistCompleteError}
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
        if (publicationStatus === 'UNDER_SUMMARY_STATS_SUBMISSION' || publicationStatus === 'UNDER_SUBMISSION') {
            showSubmissionDetailsButton =
                <Button onClick={this.redirectToSubmissionDetails} className={classes.button}>
                    View Submission Details
                </Button>
        }

        // Show message to explain status
        if (publicationStatus === 'UNDER_SUBMISSION' || publicationStatus === 'UNDER_SUMMARY_STATS_SUBMISSION') {
            statusExplanationMessageText =
                <span>
                    This publication is currently under submission. Please check back
                    for updates or email {gwasInfoEmail} for additional information.
                </span>
        }
        if (publicationStatus === 'PUBLISHED_WITH_SS') {
            statusExplanationMessageText =
                <span>
                    This publication and associated summary statistics are already available in the GWAS Catalog.
                    If you would like to submit additional data or request a change to the GWAS Catalog entry
                    please email {gwasSubsEmail}.
                </span>
        }
        if (publicationStatus === 'ELIGIBLE') {
            statusExplanationMessageText =
                <span>
                    Data describing this publication is not yet available in the GWAS Catalog. If you are an
                    author of this publication please {eligibleBoldText}
                    [link to section in documentation].
                </span>
        }
        if (publicationStatus === 'PUBLISHED') {
            statusExplanationMessageText =
                <span>
                    Data describing this publication is available in the GWAS Catalog. You are provided with a
                    pre-filled template containing the metadata. You can {publishedBoldText}
                    [link to section in documentation] and let us know which file belongs to each study.
                    If you think there is a mistake in the pre-filled spreadsheet containing the data currently
                    in the Catalog (e.g. an incorrect number of studies for your publication), please contact {gwasInfoEmail}.
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
                                <Grid item xs={8} className={classes.pageHeader}>
                                    <Typography variant="h5" className={classes.headerTextStyle}>
                                        Publication details for PMID: {this.PUBMED_ID}
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
                                    {this.state.publication.title}
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography className={classes.publicationTextStyle} >
                                    {this.state.publication.firstAuthor} et al. {this.state.publication.publicationDate} {this.state.publication.journal}
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography className={classes.publicationCatalogStatusTextStyle}>
                                    Catalog status: {transformedPublicationStatus}
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography className={classes.statusExplanationMessageTextStyle}>
                                    {statusExplanationMessageText}
                                </Typography>
                            </Grid>

                            {/* <Grid item xs={12}>
                                <Grid><Typography>&nbsp;</Typography></Grid>
                                <Typography variant="h5" className={classes.headerTextStyle}>
                                    Submission Checklist
                                </Typography>
                            </Grid> */}

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
