import React from 'react';
import './style.css';
import { withFormik } from 'formik';
import { Grid, TextField, Button, Typography, FormControl, InputLabel } from '@material-ui/core';
import { makeStyles, withStyles, fade } from '@material-ui/core/styles';
import PropTypes from "prop-types";

import {
    Header, Title, Description, JournalName, JournalURL,
    PrePrintName, PrePrintDOI, FirstAuthorName, LastAuthorName,
    CorrespondingAuthor, EmbargoDate, EmbargoDateCheckbox
} from "./FormComponents";

// Helper for the demo
import {
    DisplayFormikState,
} from './helper.js';
import { isBlock } from 'typescript';


const useStyles = makeStyles(theme => ({
    // root: {
    //     flexGrow: 1
    // },
    // root: {
    //     '& .MuiTextField-root': {
    //         // margin: theme.spacing(1),
    //         // width: 400,
    //     },
    //     // '& .MuiFormLabel-root': {
    //     //     '&.Mui-focused': {
    //     //         color: "red",
    //     //     },
    //     // },
    // },
    focused: {},
    label: {
        color: theme.palette.primary.main,
        fontSize: 22,
        // "&.Mui-focused": {
        //     color: "red"
        // }
    },
    // focused: {},
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

    const {
        values,
        touched,
        errors,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        handleReset,
        setFieldValue,
        dirty,
    } = props;
    return (
        <div>
            {/* <Grid container
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
            > */}


            <form onSubmit={handleSubmit}>
                <Header />

                <Title {...props} />

                <Description {...props} />

                <JournalName {...props} />

                <JournalURL {...props} />

                <FirstAuthorName {...props} />

                <LastAuthorName {...props} />

                <CorrespondingAuthor {...props} />

                <PrePrintName {...props} />

                <PrePrintDOI {...props} />

                {/* <EmbargoDate name="date" /> */}
                <EmbargoDate name="embargoDate" />

                <EmbargoDateCheckbox />

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
                >
                    Submit
                    </Button>

                <DisplayFormikState {...props} />

            </form>
            {/* </Grid> */}
        </div>
    );
};

const MyEnhancedForm = withFormik({
    mapPropsToValues: (props) => ({
        title: '', description: '', journal: '', url: '',
        firstAuthor: { firstName: '', lastName: '', email: '', group: '', groupEmail: '' },
        lastAuthor: { firstName: '', lastName: '', email: '', group: '', groupEmail: '' },
        correspondingAuthors: [{ firstName: '', lastName: '', email: '' }],
        prePrintServer: '', preprintServerDOI: '',
        embargoUntilPublished: true
    }),

    // Custom sync validation
    validate: values => {
        let errors = {};
        // let errors = {
        //     title: '', description: '', journal: '', url: '',
        //     firstAuthor: { firstName: '', lastName: '', email: '', group: '', groupEmail: '' },
        //     lastAuthor: { firstName: '', lastName: '', email: '', group: '', groupEmail: '' },
        //     correspondingAuthors: [{ firstName: '', lastName: '', email: '' }],
        //     prePrintServer: '', preprintServerDOI: '',
        //     embargoUntilPublished: true
        // }
        console.log("\n** All Errors: ", errors);
        console.log("** All Values: ", values);

        /**
         * Title
         */
        if (!values.title) {
            errors.title = 'Required';
        }
        if (values.title && values.title.length > 350) {
            errors.title = 'The title field is limited to 300 characters.'
        }

        /**
         * Description
         */
        if (values.description && values.description.length > 4000) {
            errors.description = 'The project description field is limited to 4000 characters.'
        }

        /**
         * First Author Validation for fields:
         * First name
         * Last name
         * Email
         * Group
         */
        let firstAuthorError = {
            firstAuthor: {
                firstName: undefined, lastName: undefined, email: undefined,
                group: undefined, groupEmail: undefined
            }
        }

        if (!values.firstAuthor.firstName) {
            firstAuthorError.firstAuthor.firstName = 'Required';
            Object.assign(errors, firstAuthorError);
        }
        if (values.firstAuthor && values.firstAuthor.firstName > 50) {
            firstAuthorError.firstAuthor.firstName = 'The first name is limited to 50 characters.'
            Object.assign(errors, firstAuthorError);
        }

        if (!values.firstAuthor.lastName) {
            firstAuthorError.firstAuthor.lastName = 'Required';
            Object.assign(errors, firstAuthorError);
        }
        if (values.firstAuthor && values.firstAuthor.lastName > 50) {
            firstAuthorError.firstAuthor.lastName = 'The last name is limited to 50 characters.'
            Object.assign(errors, firstAuthorError);
        }

        if (!values.firstAuthor.email) {
            firstAuthorError.firstAuthor.email = 'Required';
            Object.assign(errors, firstAuthorError);
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
            values.firstAuthor.email)) {
            firstAuthorError.firstAuthor.email = 'Invalid email address';
            Object.assign(errors, firstAuthorError);
        }
        // First author - Group
        // if (!values.firstAuthor.firstName) {
        //     firstAuthorError.firstAuthor.firstName = 'Required';
        //     Object.assign(errors, firstAuthorError);
        // }


        /**
         * Last Author Validation for fields:
         * First name
         * Last name
         * Email
         */
        let lastAuthorError = {
            lastAuthor: {
                firstName: undefined, lastName: undefined, email: undefined,
                group: undefined, groupEmail: undefined
            }
        }

        // Object to track valid LastAuthor or Group values to clear "errors" object
        let validLastAuthorNameFields = { lastAuthor: { firstName: true, lastName: true, email: true } }

        // if (!validLastAuthorNameFields) {
        if (!values.lastAuthor.firstName) {
            lastAuthorError.lastAuthor.firstName = 'Required';
            Object.assign(errors, lastAuthorError);
            validLastAuthorNameFields.lastAuthor.firstName = false;
        }

        if (!values.lastAuthor.lastName) {
            lastAuthorError.lastAuthor.lastName = 'Required';
            Object.assign(errors, lastAuthorError);
            validLastAuthorNameFields.lastAuthor.lastName = false;
        }

        if (!values.lastAuthor.email) {
            lastAuthorError.lastAuthor.email = 'Required';
            Object.assign(errors, lastAuthorError);
            validLastAuthorNameFields.lastAuthor.email = false;
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
            values.lastAuthor.email)) {
            lastAuthorError.firstAuthor.email = 'Invalid email address';
            Object.assign(errors, lastAuthorError);
            validLastAuthorNameFields.lastAuthor.email = false;
        }
        // }
        console.log("** LA VALID Name: ", validLastAuthorNameFields)

        // Clear errors for LastAuthor - group, groupEmail _if_ firstName, lastName, email are valid
        if (validLastAuthorNameFields.lastAuthor.firstName &&
            validLastAuthorNameFields.lastAuthor.lastName &&
            validLastAuthorNameFields.lastAuthor.email) {
            delete errors.lastAuthor;
            console.log("\n** Clearing lastAuthorError, Name fields all Valid: \nErrors: ", errors)
        }


        // Object to track valid LastAuthor or Group values to clear "errors" object
        let validLastAuthorGroupFields = { lastAuthor: { group: true, groupEmail: true } }

        if (!validLastAuthorNameFields.lastAuthor.firstName &&
            !validLastAuthorNameFields.lastAuthor.lastName &&
            !validLastAuthorNameFields.lastAuthor.email) {
            if (!values.lastAuthor.group) {
                lastAuthorError.lastAuthor.group = 'Required';
                Object.assign(errors, lastAuthorError);
                validLastAuthorGroupFields.lastAuthor.group = false;
            }

            if (!values.lastAuthor.groupEmail) {
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
        console.log("** LA VALID Name: ", validLastAuthorNameFields)

        // Clear errors for LastAuthor - firstName, lastName, email _if_ group and groupEmail are valid
        console.log("** Errors-Group: ", errors)
        if (validLastAuthorGroupFields.lastAuthor.group &&
            validLastAuthorGroupFields.lastAuthor.groupEmail) {
            delete errors.lastAuthor;
            console.log("\n** Clearing lastAuthorError, Group fields all Valid: \nErrors: ", errors)
        }


        /**
         * Journal name
         */
        if (!values.journal) {
            errors.journal = 'Required';
        }
        if (values.journal && values.journal.length > 250) {
            errors.title = 'The title journal is limited to 250 characters.'
        }

        // Journal article DOI/URL
        if (!values.url) {
            errors.url = 'Required';
        }

        // TODO: Tie validation for author and email together
        // Corresponding Author -- will include 1 name field and email
        // if (!values.authors.corresponding_author) {
        //     // errors = { authors: { corresponding_author: 'Required' } }  // Resets errors, but looses existing values
        //     let corr_auth_error = { authors: { corresponding_author: 'Required' } }
        //     Object.assign(errors, corr_auth_error)
        //     console.log("** CorrAuth Error", errors);
        // }

        // Email
        // if (!values.correspondingAuthors.email) {
        //     let corr_auth_email = { correspondingAuthors: { email: 'Required' } }
        //     Object.assign(errors, corr_auth_email)
        // } else if (
        //     !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
        //         values.correspondingAuthors.email
        //     )
        // ) {
        //     errors.correspondingAuthors.email = 'Invalid email address';
        // }

        // Pre-print name
        // Pre-print DOI

        // Embargo date
        // console.log("** Date: ", values.date);


        return errors;
    },

    handleSubmit: (values, { setSubmitting }) => {
        setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
        }, 1000);
    },

    displayName: 'BasicForm', // helps with React DevTools
})(MyForm);


const MaterialSyncValidationForm = () => (
    <div className="app">
        <Grid container
            direction="column"
            justify="space-evenly"
            alignItems="center"
            spacing={4}
        >
            <Typography variant="h5" style={{ fontWeight: 'bold', margin: 12 }}>
                Submission Form
            </Typography>
        </Grid>
        <MyEnhancedForm />
    </div>
);

MaterialSyncValidationForm.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(useStyles)(MaterialSyncValidationForm);
