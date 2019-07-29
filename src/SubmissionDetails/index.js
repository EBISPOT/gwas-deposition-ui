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


class SubmissionDetails extends Component {
    constructor(props) {
        super(props)
        this.API_CLIENT = new API_CLIENT();
        // NOTE: SUBMISSION_ID is passed from location prop in Route pathname
        this.SUBMISSION_ID = this.props.location.pathname.split('/')[2];

        this.state = ({
            submission_data: [],
            publication_obj: [],
            error: null,
            isNotValid: true,
        })
        // this.createSubmission = this.createSubmission.bind(this);
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
            console.log("** Data: ", data);
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
     * Submit data 
     */
    submitData() {
        console.log("** Button click called submitData method...");
        //     let pmid = this.PUBMED_ID;

        //     // Check if user is logged in, Get token from local storage
        //     if (localStorage.getItem('id_token')) {
        //         let JWTToken = localStorage.getItem('id_token')
        //         this.API_CLIENT.createSubmission(pmid, JWTToken).then(response => {
        //             this.setState(() => ({ error: false }));

        //             // history.push('/submissions');
        //         })
        //             .catch(error => {
        //                 this.setState(() => ({ error: true }));
        //                 alert("There was an error creating the submission")
        //             })
        //     }
        //     else {
        //         alert("Please login to create a submission")
        //         history.push('/login');
        //     }
    }


    render() {
        const { classes } = this.props;
        const { error } = this.state;

        return (
            <Container>

                <div>
                    <Paper className={classes.root}>
                        {/* <Typography variant="h5" component="h3">
                            Submission ID: <i>{this.state.submission_data.submissionId}</i>
                        </Typography> */}

                        <Typography variant="h5" component="h3">
                            Submission Details details for PMID: <i>{this.state.publication_obj.pmid}</i>
                        </Typography>


                        <Typography component="h4">
                            <div>
                                {this.state.publication_obj.title}
                            </div>

                            <div>
                                {this.state.publication_obj.firstAuthor}, {this.state.publication_obj.publicationDate}, {this.state.publication_obj.journal}
                            </div>
                        </Typography>

                        <Typography>
                            Submission status: {this.state.submission_data.status}
                        </Typography>


                        {/* Display button only for submission with status VALID */}
                        <Button onClick={this.submitData} variant="contained" color="secondary" size="small"
                            disabled={this.state.isNotValid} className={classes.button}>
                            Submit
                        </Button>


                        {/* <Typography>
                            {error ? "There was an error creating the submission. Please try again." : null}
                        </Typography> */}

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
