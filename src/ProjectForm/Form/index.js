import React, { Fragment } from 'react';
import './style.css';
import { withFormik } from 'formik';
import { Grid, Button, Typography } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import PropTypes from "prop-types";
import ElixirAuthService from '../../ElixirAuthService';
import jwt_decode from 'jwt-decode';
import { Persist } from 'formik-persist'

import {
    Header, Title, Description, JournalName, JournalURL,
    PrePrintName, PrePrintDOI, FirstAuthorName, LastAuthorName,
    CorrespondingAuthor, EmbargoDate, EmbargoDateCheckbox
} from "./FormComponents";

// Helper for the demo
// import { DisplayFormikState } from './helper.js';
import { isBlock } from 'typescript';

import axios from 'axios';
import history from '../../history';


const useStyles = makeStyles(theme => ({
    focused: {},
    label: {
        color: theme.palette.primary.main,
        fontSize: 22,
    },
    margin: {
        margin: theme.spacing(1),
    },
    inputAlignment: {
        display: isBlock,
    },
    emailField: {
        display: 'block',
        margin: 8
    },
    button: {
        margin: theme.spacing(1),
        padding: theme.spacing(1),
        color: '#333',
        background: 'linear-gradient(to bottom, #E7F7F9 50%, #D3EFF3 100%)',
        borderRadius: 4,
        border: '1px solid #aaa',
        fontWeight: 'bold',
        textShadow: '0 1px 0 #fff',
        textTransform: 'none',
        boxShadow: 'none',
        '&:disabled': {
            textShadow: 'none',
        },
    },
    buttonReset: {
        margin: theme.spacing(1),
        padding: theme.spacing(1),
        backgroundColor: '#eee',
        borderRadius: 4,
        border: '1px solid #aaa',
        color: '#555',
        fontWeight: 'bold',
        textShadow: '0 1px 0 #fff',
        textTransform: 'none',
        boxShadow: 'none',
        '&:disabled': {
            textShadow: 'none',
        },
    },
    header: {
        fontWeight: "bold",
        fontSize: 18,
    },
}));

const MyForm = props => {
    const classes = useStyles();

    const isFieldRequired = true;

    const {
        isSubmitting,
        handleSubmit,
        handleReset,
        dirty,
    } = props;
    return (
        <div>
            <form onSubmit={handleSubmit}>
                {/* <Header /> */}

                <Title {...props} />

                <Description {...props} />

                {[1, 2].includes(JSON.parse(props.answer).answerId) && (
                    <JournalName {...props} />
                )}

                {[1].includes(JSON.parse(props.answer).answerId) && (
                    <JournalURL {...props} />
                )}

                {[1, 2, 3].includes(JSON.parse(props.answer).answerId) && (
                    <Fragment>
                        <FirstAuthorName {...props} />
                        <LastAuthorName {...props} />
                    </Fragment>
                )}

                {[4].includes(JSON.parse(props.answer).answerId) &&
                    (JSON.parse(props.answer).answerValue === 'Yes') && (
                        <Fragment>
                            <FirstAuthorName {...props} />
                            <LastAuthorName {...props} />
                        </Fragment>
                    )}


                <CorrespondingAuthor {...props} />


                {[1, 2].includes(JSON.parse(props.answer).answerId) && (
                    <Fragment>
                        <PrePrintName {...props} />
                        <PrePrintDOI {...props} />
                    </Fragment>
                )}

                {[3].includes(JSON.parse(props.answer).answerId) && (
                    <Fragment>
                        <PrePrintName {...props} required={isFieldRequired} />
                        <PrePrintDOI {...props} required={isFieldRequired} />
                    </Fragment>
                )}


                {[2, 3, 4].includes(JSON.parse(props.answer).answerId) && (
                    <Fragment>
                        <EmbargoDate {...props} name="embargoDate" />
                        <EmbargoDateCheckbox />
                    </Fragment>
                )}

                <Persist name="form_data" />

                <Button
                    type="button"
                    className={classes.buttonReset}
                    variant="outlined"
                    onClick={handleReset}
                    disabled={!dirty || isSubmitting}
                >
                    Reset
                </Button>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className={classes.button}
                    // onClick={checkUserAuthStatus}
                    onClick={() => checkUserAuthStatus(props)}
                >
                    Submit
                </Button>

                {/* <DisplayFormikState {...props} /> */}
            </form>
        </div>
    );
};

const MyEnhancedForm = withFormik({
    mapPropsToValues: (props) => ({
        title: '', description: '', journal: '', url: '',
        firstAuthor: { firstName: '', lastName: '', email: '', group: '', groupEmail: '' },
        lastAuthor: { firstName: '', lastName: '', email: '', group: '', groupEmail: '' },
        correspondingAuthors: [{ firstName: '', lastName: '', email: '' }],
        prePrintServer: '', preprintServerDOI: '', embargoDate: new Date(),
        embargoUntilPublished: true
    }),

    // Custom sync validation
    validate: (values, props) => {
        let errors = {};

        let answerPropsObj = JSON.parse(props.answer)

        /**
         * Title
         */
        if (!values.title || /^\s*$/.test(values.title)) {
            errors.title = 'Required';
        }
        if (values.title && values.title.length > 350) {
            errors.title = 'The title field is limited to 300 characters.'
        }

        /**
         * Description
         */
        if (!values.description || /^\s*$/.test(values.description)) {
            errors.description = 'Required';
        }
        if (values.description && values.description.length > 4000) {
            errors.description = 'The project description field is limited to 4000 characters.'
        }

        /**
         * Journal URL
         */
        // From:  https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
        var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        if (answerPropsObj.answerId === 1) {
            if (values.url) {
                if (!pattern.test(values.url)) {
                    errors.url = "Add valid URL"
                }
            }
        }

        /**
        * PrePrint URL
        */
        if ([3].includes(answerPropsObj.answerId)) {
            if (!values.preprintServerDOI || /^\s*$/.test(values.preprintServerDOI)) {
                errors.preprintServerDOI = 'Required'
            }
        }
        if ([1, 2, 3].includes(answerPropsObj.answerId)) {
            if (values.preprintServerDOI) {
                if (!pattern.test(values.preprintServerDOI)) {
                    errors.preprintServerDOI = "Add valid URL"
                }
            }
        }

        /**
        * PrePrint server name
        */
        if ([3].includes(answerPropsObj.answerId)) {
            if (!values.prePrintServer || /^\s*$/.test(values.prePrintServer)) {
                errors.prePrintServer = 'Required'
            }
        }
        if ([1, 2, 3].includes(answerPropsObj.answerId)) {
            if (values.prePrintServer && values.prePrintServer.length > 240) {
                errors.prePrintServer = 'The PrePrint server field is limited to 240 characters.'
            }
        }

        /**
         * First Author Validation for fields:
         * First name
         * Last name
         * Email
         * Group
         * Group email
         */
        if ([1, 2, 3].includes(answerPropsObj.answerId)) {
            let firstAuthorError = {
                firstAuthor: {
                    firstName: undefined, lastName: undefined, email: undefined,
                    group: undefined, groupEmail: undefined
                }
            }

            // Object to track valid FirstAuthor name values to clear "errors" object
            let validFirstAuthorNameFields = { firstAuthor: { firstName: true, lastName: true, email: true } }

            if (!values.firstAuthor.firstName || /^\s*$/.test(values.firstAuthor.firstName)) {
                firstAuthorError.firstAuthor.firstName = 'Required';
                Object.assign(errors, firstAuthorError);
                validFirstAuthorNameFields.firstAuthor.firstName = false;
            }

            if (!values.firstAuthor.lastName || /^\s*$/.test(values.firstAuthor.lastName)) {
                firstAuthorError.firstAuthor.lastName = 'Required';
                Object.assign(errors, firstAuthorError);
                validFirstAuthorNameFields.firstAuthor.lastName = false;
            }

            if (!values.firstAuthor.email || /^\s*$/.test(values.firstAuthor.email)) {
                firstAuthorError.firstAuthor.email = 'Required';
                Object.assign(errors, firstAuthorError);
                validFirstAuthorNameFields.firstAuthor.email = false;
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
                values.firstAuthor.email)) {
                firstAuthorError.firstAuthor.email = 'Invalid email address';
                Object.assign(errors, firstAuthorError);
                validFirstAuthorNameFields.lastAuthor.email = false;
            }

            // Clear errors for FirstAuthor _if_ firstName, lastName, email are valid
            if (validFirstAuthorNameFields.firstAuthor.firstName &&
                validFirstAuthorNameFields.firstAuthor.lastName &&
                validFirstAuthorNameFields.firstAuthor.email) {
                delete errors.firstAuthor;
            }

            // Object to track valid First Author Group values to clear "errors" object
            let validFirstAuthorGroupFields = { firstAuthor: { group: true, groupEmail: true } }

            if (!validFirstAuthorNameFields.firstAuthor.firstName &&
                !validFirstAuthorNameFields.firstAuthor.lastName &&
                !validFirstAuthorNameFields.firstAuthor.email) {
                if (!values.firstAuthor.group || /^\s*$/.test(values.firstAuthor.group)) {
                    firstAuthorError.firstAuthor.group = 'Required';
                    Object.assign(errors, firstAuthorError);
                    validFirstAuthorGroupFields.firstAuthor.group = false;
                }

                if (!values.firstAuthor.groupEmail || /^\s*$/.test(values.firstAuthor.groupEmail)) {
                    firstAuthorError.firstAuthor.groupEmail = 'Required';
                    Object.assign(errors, firstAuthorError);
                    validFirstAuthorGroupFields.firstAuthor.groupEmail = false;
                } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
                    values.firstAuthor.groupEmail)) {
                    firstAuthorError.firstAuthor.groupEmail = 'Invalid email address';
                    Object.assign(errors, firstAuthorError);
                    validFirstAuthorGroupFields.firstAuthor.groupEmail = false;
                }
            }

            // Clear errors for FirstAuthor - firstName, lastName, email _if_ group and groupEmail are valid
            if (values.firstAuthor.firstName === '' &&
                values.firstAuthor.lastName === '' &&
                values.firstAuthor.email === '') {
                if (validFirstAuthorGroupFields.firstAuthor.group &&
                    validFirstAuthorGroupFields.firstAuthor.groupEmail) {
                    delete errors.firstAuthor;
                }
            }
        }

        /**
         * Last Author Validation for fields:
         * First name
         * Last name
         * Email
         * Group
         * Group email
         */
        if ([1, 2, 3].includes(answerPropsObj.answerId)) {
            let lastAuthorError = {
                lastAuthor: {
                    firstName: undefined, lastName: undefined, email: undefined,
                    group: undefined, groupEmail: undefined
                }
            }

            // Object to track valid LastAuthor name values to clear "errors" object
            let validLastAuthorNameFields = { lastAuthor: { firstName: true, lastName: true, email: true } }

            if (!values.lastAuthor.firstName || /^\s*$/.test(values.lastAuthor.firstName)) {
                lastAuthorError.lastAuthor.firstName = 'Required';
                Object.assign(errors, lastAuthorError);
                validLastAuthorNameFields.lastAuthor.firstName = false;
            }

            if (!values.lastAuthor.lastName || /^\s*$/.test(values.lastAuthor.lastName)) {
                lastAuthorError.lastAuthor.lastName = 'Required';
                Object.assign(errors, lastAuthorError);
                validLastAuthorNameFields.lastAuthor.lastName = false;
            }

            if (!values.lastAuthor.email || /^\s*$/.test(values.lastAuthor.email)) {
                lastAuthorError.lastAuthor.email = 'Required';
                Object.assign(errors, lastAuthorError);
                validLastAuthorNameFields.lastAuthor.email = false;
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
                values.lastAuthor.email)) {
                lastAuthorError.firstAuthor.email = 'Invalid email address';
                Object.assign(errors, lastAuthorError);
                validLastAuthorNameFields.lastAuthor.email = false;
            }

            // Clear errors for LastAuthor _if_ firstName, lastName, email are valid
            if (validLastAuthorNameFields.lastAuthor.firstName &&
                validLastAuthorNameFields.lastAuthor.lastName &&
                validLastAuthorNameFields.lastAuthor.email) {
                delete errors.lastAuthor;
            }

            // Object to track valid Last Author Group values to clear "errors" object
            let validLastAuthorGroupFields = { lastAuthor: { group: true, groupEmail: true } }

            if (!validLastAuthorNameFields.lastAuthor.firstName &&
                !validLastAuthorNameFields.lastAuthor.lastName &&
                !validLastAuthorNameFields.lastAuthor.email) {
                if (!values.lastAuthor.group || /^\s*$/.test(values.lastAuthor.group)) {
                    lastAuthorError.lastAuthor.group = 'Required';
                    Object.assign(errors, lastAuthorError);
                    validLastAuthorGroupFields.lastAuthor.group = false;
                }

                if (!values.lastAuthor.groupEmail || /^\s*$/.test(values.lastAuthor.groupEmail)) {
                    lastAuthorError.lastAuthor.groupEmail = 'Required';
                    Object.assign(errors, lastAuthorError);
                    validLastAuthorGroupFields.lastAuthor.groupEmail = false;
                } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
                    values.lastAuthor.groupEmail)) {
                    lastAuthorError.lastAuthor.groupEmail = 'Invalid email address';
                    Object.assign(errors, lastAuthorError);
                    validLastAuthorGroupFields.lastAuthor.groupEmail = false;
                }
            }

            // Clear errors for LastAuthor - firstName, lastName, email _if_ group and groupEmail are valid
            if (values.lastAuthor.firstName === '' &&
                values.lastAuthor.lastName === '' &&
                values.lastAuthor.email === '') {
                if (validLastAuthorGroupFields.lastAuthor.group &&
                    validLastAuthorGroupFields.lastAuthor.groupEmail) {
                    delete errors.lastAuthor;
                }
            }
        }

        /**
         * Journal name
         */
        if ([1, 2].includes(answerPropsObj.answerId)) {
            if (!values.journal || /^\s*$/.test(values.journal)) {
                errors.journal = 'Required';
            }
            if (values.journal && values.journal.length > 250) {
                errors.title = 'The title journal is limited to 250 characters.'
            }
        }

        /**
         * Corresponding Authors
         * First name
         * Last name
         * Email
         */
        let caErrors = []

        if (values.correspondingAuthors) {
            values.correspondingAuthors.forEach(function (corrAuthor, index) {

                let corrAuthorError = { firstName: undefined, lastName: undefined, email: undefined }

                if (corrAuthor.firstName === '') {
                    corrAuthorError.firstName = 'Required';

                    caErrors[index] = corrAuthorError

                    let caTest = { correspondingAuthors: caErrors }
                    Object.assign(errors, caTest)
                }
                if (corrAuthor.lastName === '') {
                    corrAuthorError.lastName = 'Required';
                    caErrors[index] = corrAuthorError

                    let caTest = { correspondingAuthors: caErrors }
                    Object.assign(errors, caTest)

                }
                if (corrAuthor.email === '') {
                    corrAuthorError.email = 'Required';
                    caErrors[index] = corrAuthorError

                    let caTest = { correspondingAuthors: caErrors }
                    Object.assign(errors, caTest)

                }
            })
        }

        /**
         * Embargo date
         */
        if ([2, 3, 4].includes(answerPropsObj.answerId)) {
            if (answerPropsObj.answerId !== 1) {
                if (!values.embargoDate) {
                    errors.embargoDate = 'Required'
                }
                if (values.embargoDate && isNaN(Date.parse(values.embargoDate))) {
                    errors.embargoDate = "Valid date format MM/DD/YYYY required."
                }
            }
        }

        return errors;
    },

    handleSubmit: (values, { props, setSubmitting, resetForm }) => {

        setTimeout(() => {
            // Create new object to modify
            let valuesCopy = {};
            valuesCopy = JSON.parse(JSON.stringify(values));

            processValues(valuesCopy, props)
            // alert(JSON.stringify(valuesCopy, null, 2));

            // Post form data to bodyofwork endpoint
            createBodyOfWork(valuesCopy)

            // setSubmitting(false) // With async call, Formik will automatically set to false once resolved

            // Clear form values from Persist component
            resetForm();
        }, 1000);
    },
    displayName: 'BasicForm', // helps with React DevTools
})(MyForm);


/**
 * Check if user is logged in and if token is still valid and if GDPR accepted.
 */
const checkUserAuthStatus = (props) => {
    const token = getToken().auth;
    const gdprAccepted = JSON.parse(localStorage.getItem('gdpr-accepted'));
    const eas = new ElixirAuthService();

    if (token && !eas.isTokenExpired(token) && gdprAccepted) {
        return token;
    } else {
        if (!JSON.parse(gdprAccepted)) {
            history.replace({
                pathname: `${process.env.PUBLIC_URL}/gdpr`,
                state: {
                    id: JSON.parse(props.answer).answerId,
                    answer: JSON.parse(props.answer).answerValue,
                    from: `/form`,
                }
            })
        }
        else {
            history.replace({
                pathname: `${process.env.PUBLIC_URL}/login`,
                state: {
                    id: JSON.parse(props.answer).answerId,
                    answer: JSON.parse(props.answer).answerValue,
                    from: `/form`,
                }
            })
        }
    }
    return;
}

/**
 * Create BodyOfWork
 * @param {*} processedValues 
 */
const createBodyOfWork = async (processedValues) => {
    const token = getToken().auth;
    const BASE_URI = process.env.REACT_APP_LOCAL_BASE_URI;
    const header = { headers: { 'Authorization': 'Bearer ' + token } }

    let debug = false;
    if (!debug) {
        await axios.post(BASE_URI + 'bodyofwork', processedValues, header
        ).then(response => {
            // Redirect to Body of Work details page with "replace"
            // to prevent being able to access this state with back button
            let bodyOfWorkId = response.data.bodyOfWorkId;
            history.replace(`${process.env.PUBLIC_URL}/bodyofwork/${bodyOfWorkId}`);
        }).catch(error => {
            console.log(error);
        })
    }
}

/**
 * Modify object before sending to BodyOfWork endpoint to
 * match expected endpoint attributes.
 * @param {*} formValues
 */
const processValues = (formValues, props) => {
    // Add value of "groupEmail" to "email" for First Author
    if (formValues.firstAuthor.groupEmail !== '') {
        formValues.firstAuthor.email = formValues.firstAuthor.groupEmail;
        delete formValues.firstAuthor.groupEmail
    }
    // Add value of "groupEmail" to "email" for First Author
    if (formValues.lastAuthor.groupEmail !== '') {
        formValues.lastAuthor.email = formValues.lastAuthor.groupEmail;
        delete formValues.lastAuthor.groupEmail
    }

    // Delete "embargoDate" if "embargoUntilPublished" is true
    if (formValues.embargoUntilPublished === true) {
        delete formValues.embargoDate
    }

    // Format "embargoDate" if "embargoUntilPublished" is not selected
    if (formValues.embargoUntilPublished === false) {
        // Format Embargo date to YYYY-MM-DD
        let date = new Date(formValues.embargoDate)
        let year = date.getFullYear();
        let month = date.getMonth() + 1
        let day = date.getDate();
        formValues.embargoDate = `${year}-${month}-${day}`;
    }

    // Remove "embargoDate" and "embargoUntilPublished" for body of work
    // types of "published, not yet indexed"
    if (JSON.parse(props.answer).answerId === 1) {
        if (formValues.embargoDate) {
            delete formValues.embargoDate
        }
        delete formValues.embargoUntilPublished
    }

    // Remove empty First and Last Author objects for body of work
    // type of "no manuscript"
    if (JSON.parse(props.answer).answerId === 4) {
        delete formValues.firstAuthor
        delete formValues.lastAuthor
    }

    // Remove any properties with an empty string value
    removeEmpty(formValues)

    trimValues(formValues)

    return formValues
}

/**
 * Remove key/value when the value is empty.
 * @param {} obj
 */
const removeEmpty = (obj) => {
    Object.keys(obj).forEach(k =>
        ((obj[k] && typeof obj[k] === 'object') && removeEmpty(obj[k])) ||
        ((!obj[k] && obj[k] !== undefined) && delete obj[k])
    );
    return obj;
};


/**
 * Trim leading/trailing whitespace in values.
 */
const trimValues = (obj) => {
    for (var prop in obj) {
        var value = obj[prop], type = typeof value;
        if (value != null && (type === "string" || type === "object") && obj.hasOwnProperty(prop)) {
            if (type === "object") {
                trimValues(obj[prop]);
            } else {
                obj[prop] = obj[prop].trim();
            }
        }
    }
    return obj;
}


/**
     * Check for token in local storage
     * and parse out email if token is present.
     */
const getToken = () => {
    let token = null;
    let userEmail = null;
    if (localStorage.getItem('id_token')) {
        token = localStorage.getItem('id_token');
        userEmail = jwt_decode(token).email;
    }
    return { authEmail: userEmail, auth: token };
}


const MaterialSyncValidationForm = (props) => {
    let answerProps;
    let answerObj

    if (props.location.state && props.location.state.id && props.location.state.answer) {
        answerObj = { answerId: props.location.state.id, answerValue: props.location.state.answer }
        answerProps = JSON.stringify(answerObj)
    }

    // Redirect user to questionnaire page if there isn't a stored answer
    if (!answerProps) {
        history.push(`${process.env.PUBLIC_URL}/`)
    }

    return (
        <div className="app">
            {answerProps && (
                <Fragment>
                    <Grid container
                        direction="column"
                        justify="space-evenly"
                        alignItems="center"
                        spacing={4}
                    >
                        <Typography variant="h5" style={{ fontWeight: 'bold', margin: 12 }}>
                            Submission Form -- {answerProps}
                        </Typography>
                    </Grid>
                    <MyEnhancedForm answer={answerProps} />
                </Fragment>
            )}
        </div>

    )
}

MaterialSyncValidationForm.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(useStyles)(MaterialSyncValidationForm);
