import React from 'react';
import './style.css';
import { withFormik } from 'formik';
import { Grid, TextField, Button, Typography, FormControl, InputLabel } from '@material-ui/core';
import { makeStyles, withStyles, fade } from '@material-ui/core/styles';
import PropTypes from "prop-types";
// import TextMobileStepper from '../TextMobileStepper';
// import Test from '../Test';

// Helper for the demo
import {
    DisplayFormikState,
} from './helper.js';
import { isBlock } from 'typescript';
// import { green, blue } from '@material-ui/core/colors';


const useStyles = makeStyles(theme => ({
    root: {
        '& .MuiTextField-root': {
            // margin: theme.spacing(1),
            width: 400,
        },
        // '& .MuiFormLabel-root': {
        //     '&.Mui-focused': {
        //         color: "red",
        //     },
        // },
    },
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
        border: '1px solid #ccc',
        fontWeight: 'bold',
        textShadow: '0 1px 0 #fff',
        textTransform: 'none',
        '&:disabled': {
            textShadow: 'none',
        },
        boxShadow: 'none',
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
    },
    header: {
        fontWeight: "bold",
        fontSize: 18,
    },
}));

const CssTextField = withStyles(theme => ({
    root: {
        'label + &': {
            marginTop: theme.spacing(3),
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: 'gray',
            },
            '&.Mui-focused fieldset': {
                boxShadow: `${fade('#1976d2', 0.25)} 0 0 0 0.2rem`,
                borderColor: '#1976d2',
                border: '1px solid #ced4da',
            },
            '&.Mui-error fieldset': {
                boxShadow: `${fade('#f44336', 0.25)} 0 0 0 0.2rem`,
                borderColor: '#f44336',
                border: '1px solid #ced4da',
            },
        },
    },
    // input: {
    //     borderRadius: 4,
    //     position: 'relative',
    //     backgroundColor: theme.palette.common.white,
    //     border: '1px solid #ced4da',
    //     fontSize: 16,
    //     width: 'auto',
    //     padding: '10px 12px',
    //     transition: theme.transitions.create(['border-color', 'box-shadow']),
    // },
}))(TextField);


const MyForm = props => {
    const classes = useStyles();

    // const [answer00, setAnswer00State] = React.useState('');
    // function answerChangeHandler(event) {
    //     setAnswer00State(event.target.value);
    //     console.log("** answerChangeHandler - value: ", event.target.value)
    // }
    // console.log("** Ans0 Form: ", answer00);


    const {
        values,
        touched,
        errors,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        handleReset,
        dirty,
    } = props;
    return (
        <Grid container
            direction="column"
            justify="center"
            alignItems="center"
            spacing={4}>

            {/* <TextMobileStepper changedAnswers={answerChangeHandler} /> */}

            <Grid item>
                <Typography gutterBottom variant="body1" className={classes.fontStyle}>
                    Some details on how to fill out the form...
                </Typography>

            </Grid>

            <form onSubmit={handleSubmit} className={classes.root}>

                {props.test !== 'No' && (
                    <Grid item>
                        {/* <FormControl variant="outlined">
                        <InputLabel htmlFor="component-outlined">Name</InputLabel>
                        <OutlinedInput id="component-outlined" value={name} onChange={handleChange} label="Name" />
                    </FormControl> */}

                        <FormControl className={classes.margin}>
                            <InputLabel
                                // focused
                                shrink required htmlFor="title"
                                className={classes.label}
                            // style={{
                            //     fontSize: 18,
                            //     color: '#00cc00',
                            // }}
                            >
                                Title
                            </InputLabel>

                            {/* <OutlinedInput */}
                            <CssTextField
                                id="title"
                                type="input"
                                variant="outlined"
                                placeholder="Enter project title"
                                value={values.title}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errors.title && touched.title}
                            />
                            {errors.title &&
                                touched.title && (
                                    <div className="input-feedback" style={{ display: 'block', margin: 8 }}>
                                        {errors.title}
                                    </div>
                                )}
                        </FormControl>
                    </Grid>
                )}

                <Grid item>
                    <FormControl className={classes.margin}>
                        <InputLabel shrink required htmlFor="title" className={classes.label}>
                            Email
                        </InputLabel>

                        <CssTextField
                            id="email"
                            type="input"
                            variant="outlined"
                            placeholder="Enter your email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.email && touched.email}
                        />
                        {errors.email &&
                            touched.email && (
                                <div className="input-feedback" style={{ display: 'block', margin: 8 }}>
                                    {errors.email}
                                </div>
                            )}
                    </FormControl>
                </Grid>

                <Grid item>
                    <FormControl className={classes.margin}>
                        <InputLabel shrink htmlFor="project_desc" className={classes.label}>
                            Project description
                        </InputLabel>

                        <CssTextField
                            id="project_desc"
                            variant="outlined"
                            placeholder="Enter the project description"
                            multiline
                            rows="4"
                            rowsMax="8"
                            value={values.project_desc}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        {errors.project_desc &&
                            touched.project_desc && (
                                <div className="input-feedback" style={{ display: 'block', margin: 8 }}>
                                    {errors.project_desc}
                                </div>
                            )}
                    </FormControl>
                </Grid>


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
        </Grid>
    );
};

const MyEnhancedForm = withFormik({
    mapPropsToValues: (props) => ({ email: '', title: '', }),

    // Custom sync validation
    validate: values => {

        let errors = {};
        if (!values.email) {
            errors.email = 'Required';
        } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
                values.email
            )
        ) {
            errors.email = 'Invalid email address';
        }

        if (values.test !== '') {
            if (!values.title) {
                errors.title = 'Required';
            }
        }
        if (values.title && values.title.length > 150) {
            errors.title = 'The title field is limited to 150 characters.'
        }

        if (values.project_desc && values.project_desc.length > 4) {
            errors.project_desc = 'The project description field is limited to 500 characters.'
        }
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
                Start Submission
            </Typography>
        </Grid>

        {/* <TextMobileStepper /> */}

        {/* <Test answer0="YES">This is a TEST!!!</Test> */}

        <MyEnhancedForm />
    </div>
);

MaterialSyncValidationForm.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(useStyles)(MaterialSyncValidationForm);
