import React from 'react';
import './style.css';
import { withFormik, getIn } from 'formik';
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

                <EmbargoDate name="date" />

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
        firstAuthor: { firstName: '', lastName: '', email: '' },
        lastAuthor: { firstName: '', lastName: '', email: '' },
        correspondingAuthors: [{ firstName: '', lastName: '', email: '' }],
        prePrintServer: '', preprintServerDOI: '',
        embargoUntilPublished: true
    }),

    // Custom sync validation
    validate: values => {
        let errors = {};
        console.log("** Errors: ", errors);

        console.log("** Values: ", values);

        // Title of work
        if (!values.title) {
            errors.title = 'Required';
        }
        if (values.title && values.title.length > 150) {
            errors.title = 'The title field is limited to 150 characters.'
        }

        // Description of work
        if (values.description && values.description.length > 4) {
            errors.description = 'The project description field is limited to 500 characters.'
        }

        /**
         * First Author - First Name
         */
        if (!values.firstAuthor.firstName) {
            let firstAuthorFirstNameError = { firstAuthor: { firstName: 'Required' } }
            Object.assign(errors, firstAuthorFirstNameError)
            console.log("** firstAuthorFirstNameError", errors);
        }

        /**
         * First Author - Last Name
         */
        if (!values.firstAuthor.lastName) {
            let firstAuthorLastNameError = { firstAuthor: { lastName: 'Required' } }
            Object.assign(errors, firstAuthorLastNameError)
            console.log("** firstAuthorLastNameError", errors);
        }

        /**
         * Last Author - First Name
         */
        if (!values.lastAuthor.firstName) {
            let lastAuthorFirstNameError = { lastAuthor: { firstName: 'Required' } }
            Object.assign(errors, lastAuthorFirstNameError)
            console.log("** lastAuthorFirstNameError", errors);
        }

        /**
         * Last Author - Last Name
         */
        if (!values.lastAuthor.lastName) {
            let lastAuthorLastNameError = { lastAuthor: { lastName: 'Required' } }
            Object.assign(errors, lastAuthorLastNameError)
            console.log("** lastAuthorLastNameError", errors);
        }

        // Journal name
        if (!values.journal) {
            errors.journal = 'Required';
        }

        // Journal article DOI/URL

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
        console.log("** Date: ", values.date);


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
