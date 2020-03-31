import React from 'react';
import './style.css';
import { withFormik } from 'formik';
import { Grid, TextField, Button, Typography, FormControl, InputLabel } from '@material-ui/core';
import { makeStyles, withStyles, fade } from '@material-ui/core/styles';
import PropTypes from "prop-types";

import {
    Header, Title, Description, JournalName, JournalDOI,
    PrePrintName, PrePrintDOI, AuthorName, CorrespondingAuthor, BasicDatePicker, DatePicker2
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

                <JournalDOI {...props} />

                <AuthorName {...props} />

                <CorrespondingAuthor {...props} />

                <PrePrintName {...props} />

                <PrePrintDOI {...props} />

                {/* <DatePicker2 {...props} /> */}
                <BasicDatePicker name="date" />

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
        title: '', description: '', first_author_first_name: '', first_author_last_name: '',
        email: '', embargo_date: ''
    }),

    // Custom sync validation
    validate: values => {
        let errors = {};

        // Title of work
        // if (values.test !== '') {
        if (!values.title) {
            errors.title = 'Required';
        }
        // }
        if (values.title && values.title.length > 150) {
            errors.title = 'The title field is limited to 150 characters.'
        }

        // Description of work
        if (values.description && values.description.length > 4) {
            errors.description = 'The project description field is limited to 500 characters.'
        }

        // First Author name
        if (!values.first_author_first_name) {
            errors.first_author_first_name = 'Required';
        }
        if (values.first_author_first_name && values.first_author_first_name.length > 60) {
            errors.first_author_first_name = 'The author field is limited to 60 characters.'
        }

        // Last Author name
        if (!values.first_author_last_name) {
            errors.first_author_last_name = 'Required';
        }
        if (values.first_author_last_name && values.first_author_last_name.length > 60) {
            errors.first_author_last_name = 'The author field is limited to 60 characters.'
        }

        // Email
        if (!values.email) {
            errors.email = 'Required';
        } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
                values.email
            )
        ) {
            errors.email = 'Invalid email address';
        }

        // Journal name

        // Journal article DOI/URL

        // Corresponding Author -- will include 1 name field and email 
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
