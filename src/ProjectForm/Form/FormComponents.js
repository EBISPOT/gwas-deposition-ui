import React, { Fragment } from 'react';
import { Grid, Typography, TextField, Button, IconButton, FormControl, FormControlLabel, InputLabel, Checkbox } from '@material-ui/core';
import { makeStyles, withStyles, fade } from '@material-ui/core/styles';
import ClearIcon from '@material-ui/icons/Clear';
import Autocomplete from '@material-ui/lab/Autocomplete';
import journal_abbr_data from './gwas_journal_abbr.json'

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';
import { useField, useFormikContext, FieldArray } from "formik";

const useStyles = makeStyles(theme => ({
    header: {
        fontSize: 18,
        fontWeight: 500,
    },
    margin: {
        margin: theme.spacing(1),
    },
    componentSpacing: {
        margin: theme.spacing(2)
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
}))(TextField);


const CustomKeyboardDatePicker = withStyles(theme => ({
    root: {
        'label + &': {
            // marginTop: theme.spacing(1),
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
        '& .MuiInputBase-root': {
            color: 'black',
            '&.Mui-error': {
                color: 'red'
            },
            '&.Mui-disabled': {
                color: 'gray',
            },
        },
        '& .MuiFormHelperText-root': {
            color: 'red',
        },
        margin: theme.spacing(1),
        // '& .MuiInputLabel-root': {
        //     margin: theme.spacing(4)
        // },
    },
}))(KeyboardDatePicker)

// Form header text
export const Header = () => {
    const classes = useStyles();

    return (
        <Grid item xs={12}>
            <Typography gutterBottom variant="body1" className={classes.header}>
                TEST - All Fields
            </Typography>
        </Grid>
    )
}

// Title of work
export const Title = (props) => {
    const classes = useStyles();

    const {
        values,
        touched,
        errors,
        handleChange,
        handleBlur,
    } = props;
    return (
        <Fragment>
            <Grid container
                className={classes.componentSpacing}>

                <Grid item xs={12}>
                    <Typography gutterBottom variant="body1" className={classes.header}>
                        Description of work
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <FormControl className={classes.margin}>
                        <InputLabel
                            shrink required htmlFor="title"
                            className={classes.label}
                        >
                            Title
                        </InputLabel>

                        <CssTextField
                            id="title"
                            type="input"
                            variant="outlined"
                            helperText="Enter title"
                            value={values.title}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.title && touched.title}
                            style={{ width: 600 }}
                        />
                        {errors.title &&
                            touched.title && (
                                <div className="input-feedback" style={{ display: 'block', margin: 8 }}>
                                    {errors.title}
                                </div>
                            )}
                    </FormControl>
                </Grid>
            </Grid>
        </Fragment>
    )
}

// First Author - Author Name
export const FirstAuthorName = (props) => {
    const classes = useStyles();

    const {
        values,
        touched,
        errors,
        handleChange,
        handleBlur,
    } = props;
    return (
        <Fragment>
            <Grid container
                className={classes.componentSpacing}>
                <Grid item xs={12}>
                    <Typography gutterBottom variant="body1" className={classes.header}>
                        First Author
                    </Typography>
                </Grid>

                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                >
                    <Grid item>
                        <FormControl className={classes.margin}>
                            <InputLabel
                                shrink required htmlFor="firstAuthor.firstName"
                                className={classes.label}
                            >
                                First Name/Given Name
                            </InputLabel>

                            <CssTextField
                                id="firstAuthor.firstName"
                                type="input"
                                variant="outlined"
                                helperText="Please enter first given name followed by any middle initials, e.g. Anne B"
                                value={values.firstAuthor.firstName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={values.firstAuthor.group !== '' ||
                                    values.firstAuthor.groupEmail !== ''}
                                error={errors.firstAuthor && touched.firstAuthor &&
                                    errors.firstAuthor.firstName && touched.firstAuthor.firstName &&
                                    (values.firstAuthor.group === '')}
                                style={{ width: 300 }}
                            />

                            {
                                errors.firstAuthor && touched.firstAuthor &&
                                errors.firstAuthor.firstName &&
                                touched.firstAuthor.firstName &&
                                (values.firstAuthor.group === '') && (
                                    <div className="input-feedback" style={{ display: 'block', margin: 8 }}>
                                        {errors.firstAuthor.firstName}
                                    </div>
                                )}
                        </FormControl>
                    </Grid>

                    <Grid item >
                        <FormControl className={classes.margin}>
                            <InputLabel
                                shrink required htmlFor="firstAuthor.lastName"
                                className={classes.label}
                            >
                                Last Name/Surname
                            </InputLabel>

                            <CssTextField
                                id="firstAuthor.lastName"
                                type="input"
                                variant="outlined"
                                helperText="Add last name/surname"
                                value={values.firstAuthor.lastName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={values.firstAuthor.group !== '' ||
                                    values.firstAuthor.groupEmail !== ''}
                                error={errors.firstAuthor && touched.firstAuthor &&
                                    errors.firstAuthor.lastName && touched.firstAuthor.lastName &&
                                    (values.firstAuthor.group === '')}
                                style={{ width: 300 }}
                            />
                            {errors.firstAuthor && touched.firstAuthor &&
                                errors.firstAuthor.lastName &&
                                touched.firstAuthor.lastName &&
                                (values.firstAuthor.group === '') && (
                                    <div className="input-feedback" style={{ display: 'block', margin: 8 }}>
                                        {errors.firstAuthor.lastName}
                                    </div>
                                )}
                        </FormControl>
                    </Grid>

                    <Grid item >
                        <FormControl className={classes.margin}>
                            <InputLabel
                                shrink htmlFor="firstAuthor.email"
                                className={classes.label}
                            >
                                Email
                            </InputLabel>

                            <CssTextField
                                id="firstAuthor.email"
                                type="input"
                                variant="outlined"
                                helperText="Add email"
                                value={values.firstAuthor.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={values.firstAuthor.group !== '' ||
                                    values.firstAuthor.groupEmail !== ''}
                                error={errors.firstAuthor && touched.firstAuthor &&
                                    errors.firstAuthor.email && touched.firstAuthor.email &&
                                    (values.firstAuthor.group === '')}
                                style={{ width: 300 }}
                            />
                            {errors.firstAuthor && touched.firstAuthor &&
                                errors.firstAuthor.email &&
                                touched.firstAuthor.email &&
                                (values.firstAuthor.group === '') && (
                                    <div className="input-feedback" style={{ display: 'block', margin: 8 }}>
                                        {errors.firstAuthor.email}
                                    </div>
                                )}
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                    className={classes.componentSpacing}
                >
                    <Grid item>
                        <Typography>
                            - OR -
                        </Typography>
                    </Grid>
                </Grid>

                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                >
                    <Grid item >
                        <FormControl className={classes.margin}>
                            <InputLabel
                                shrink required htmlFor="firstAuthor.group"
                                className={classes.label}
                            >
                                Consortium name
                            </InputLabel>

                            <CssTextField
                                id="firstAuthor.group"
                                type="input"
                                variant="outlined"
                                helperText="Add Consortium name"
                                value={values.firstAuthor.group}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={values.firstAuthor.firstName !== '' ||
                                    values.firstAuthor.lastName !== '' ||
                                    values.firstAuthor.email !== ''}
                                error={errors.firstAuthor && touched.firstAuthor &&
                                    errors.firstAuthor.group && touched.firstAuthor.group &&
                                    (values.firstAuthor.firstName === '')}
                                style={{ width: 300 }}
                            />
                            {errors.firstAuthor && touched.firstAuthor &&
                                errors.firstAuthor.group &&
                                touched.firstAuthor.group &&
                                (values.firstAuthor.firstName === '') && (
                                    <div className="input-feedback" style={{ display: 'block', margin: 8 }}>
                                        {errors.firstAuthor.group}
                                    </div>
                                )}
                        </FormControl>
                    </Grid>

                    <Grid item >
                        <FormControl className={classes.margin}>
                            <InputLabel
                                shrink htmlFor="firstAuthor.groupEmail"
                                className={classes.label}
                            >
                                Email
                            </InputLabel>

                            <CssTextField
                                id="firstAuthor.groupEmail"
                                type="input"
                                variant="outlined"
                                helperText="Add email"
                                value={values.firstAuthor.groupEmail}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={values.firstAuthor.firstName !== '' ||
                                    values.firstAuthor.lastName !== '' ||
                                    values.firstAuthor.email !== ''}
                                error={errors.firstAuthor && touched.firstAuthor &&
                                    errors.firstAuthor.groupEmail && touched.firstAuthor.groupEmail &&
                                    (values.firstAuthor.firstName === '')}
                                style={{ width: 300 }}
                            />
                            {errors.firstAuthor && touched.firstAuthor &&
                                errors.firstAuthor.groupEmail &&
                                touched.firstAuthor.groupEmail &&
                                (values.firstAuthor.firstName === '') && (
                                    <div className="input-feedback" style={{ display: 'block', margin: 8 }}>
                                        {errors.firstAuthor.groupEmail}
                                    </div>
                                )}
                        </FormControl>
                    </Grid>
                </Grid>
            </Grid>
        </Fragment >
    )
}


// Last Author - Author Name
export const LastAuthorName = (props) => {
    const classes = useStyles();

    const {
        values,
        touched,
        errors,
        handleChange,
        handleBlur,
    } = props;

    return (
        <Fragment>
            <Grid container
                className={classes.componentSpacing}>
                <Grid item xs={12}>
                    <Typography gutterBottom variant="body1" className={classes.header}>
                        Last Author
                    </Typography>
                </Grid>

                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                >
                    <Grid item>
                        <FormControl className={classes.margin}>
                            <InputLabel
                                shrink required htmlFor="firstName"
                                className={classes.label}
                            >
                                First Name/Given Name
                            </InputLabel>

                            <CssTextField
                                id="lastAuthor.firstName"
                                type="input"
                                variant="outlined"
                                helperText="Please enter first given name followed by any middle initials, e.g. Anne B"
                                value={values.lastAuthor.firstName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={values.lastAuthor.group !== '' ||
                                    values.lastAuthor.groupEmail !== ''}
                                error={errors.lastAuthor && touched.lastAuthor &&
                                    errors.lastAuthor.firstName && touched.lastAuthor.firstName &&
                                    (values.lastAuthor.group === '')}
                                style={{ width: 300 }}
                            />

                            {
                                errors.lastAuthor && touched.lastAuthor &&
                                errors.lastAuthor.firstName &&
                                touched.lastAuthor.firstName &&
                                (values.lastAuthor.group === '') && (
                                    <div className="input-feedback" style={{ display: 'block', margin: 8 }}>
                                        {errors.lastAuthor.firstName}
                                    </div>
                                )}

                        </FormControl>
                    </Grid>

                    <Grid item >
                        <FormControl className={classes.margin}>
                            <InputLabel
                                shrink required htmlFor="lastName"
                                className={classes.label}
                            >
                                Last Name/Surname
                            </InputLabel>

                            <CssTextField
                                id="lastAuthor.lastName"
                                type="input"
                                variant="outlined"
                                helperText="Add last name/surname"
                                value={values.lastAuthor.lastName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={values.lastAuthor.group !== '' ||
                                    values.lastAuthor.groupEmail !== ''}
                                error={errors.lastAuthor && touched.lastAuthor &&
                                    errors.lastAuthor.lastName && touched.lastAuthor.lastName &&
                                    (values.lastAuthor.group === '')}
                                style={{ width: 300 }}
                            />
                            {errors.lastAuthor && touched.lastAuthor &&
                                errors.lastAuthor.lastName &&
                                touched.lastAuthor.lastName &&
                                (values.lastAuthor.group === '') && (
                                    <div className="input-feedback" style={{ display: 'block', margin: 8 }}>
                                        {errors.lastAuthor.lastName}
                                    </div>
                                )}
                        </FormControl>
                    </Grid>

                    <Grid item >
                        <FormControl className={classes.margin}>
                            <InputLabel
                                shrink htmlFor="email"
                                className={classes.label}
                            >
                                Email
                            </InputLabel>

                            <CssTextField
                                id="lastAuthor.email"
                                type="input"
                                variant="outlined"
                                helperText="Add email"
                                value={values.lastAuthor.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={values.lastAuthor.group !== '' ||
                                    values.lastAuthor.groupEmail !== ''}
                                error={errors.lastAuthor && touched.lastAuthor &&
                                    errors.lastAuthor.email && touched.lastAuthor.email &&
                                    (values.lastAuthor.group === '')}
                                style={{ width: 300 }}
                            />
                            {errors.lastAuthor && touched.lastAuthor &&
                                errors.lastAuthor.email &&
                                touched.lastAuthor.email &&
                                (values.lastAuthor.group === '') && (
                                    <div className="input-feedback" style={{ display: 'block', margin: 8 }}>
                                        {errors.lastAuthor.email}
                                    </div>
                                )}
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                    className={classes.componentSpacing}
                >
                    <Grid item>
                        <Typography>
                            - OR -
                        </Typography>
                    </Grid>
                </Grid>

                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                >
                    <Grid item >
                        <FormControl className={classes.margin}>
                            <InputLabel
                                shrink required htmlFor="group"
                                className={classes.label}
                            >
                                Consortium name
                            </InputLabel>

                            <CssTextField
                                id="lastAuthor.group"
                                type="input"
                                variant="outlined"
                                helperText="Add Consortium name"
                                value={values.lastAuthor.group}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={values.lastAuthor.firstName !== '' ||
                                    values.lastAuthor.lastName !== '' ||
                                    values.lastAuthor.email !== ''}
                                error={errors.lastAuthor && touched.lastAuthor &&
                                    errors.lastAuthor.group && touched.lastAuthor.group &&
                                    (values.lastAuthor.firstName === '')}
                                style={{ width: 300 }}
                            />
                            {errors.lastAuthor && touched.lastAuthor &&
                                errors.lastAuthor.group &&
                                touched.lastAuthor.group &&
                                (values.lastAuthor.firstName === '') && (
                                    <div className="input-feedback" style={{ display: 'block', margin: 8 }}>
                                        {errors.lastAuthor.group}
                                    </div>
                                )}
                        </FormControl>
                    </Grid>

                    <Grid item >
                        <FormControl className={classes.margin}>
                            <InputLabel
                                shrink htmlFor="groupEmail"
                                className={classes.label}
                            >
                                Email
                            </InputLabel>

                            <CssTextField
                                id="lastAuthor.groupEmail"
                                type="input"
                                variant="outlined"
                                helperText="Add email"
                                value={values.lastAuthor.groupEmail}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={values.lastAuthor.firstName !== '' ||
                                    values.lastAuthor.lastName !== '' ||
                                    values.lastAuthor.email !== ''}
                                error={errors.lastAuthor && touched.lastAuthor &&
                                    errors.lastAuthor.groupEmail && touched.lastAuthor.groupEmail &&
                                    (values.lastAuthor.firstName === '')}
                                style={{ width: 300 }}
                            />
                            {errors.lastAuthor && touched.lastAuthor &&
                                errors.lastAuthor.groupEmail &&
                                touched.lastAuthor.groupEmail &&
                                (values.lastAuthor.firstName === '') && (
                                    <div className="input-feedback" style={{ display: 'block', margin: 8 }}>
                                        {errors.lastAuthor.groupEmail}
                                    </div>
                                )}
                        </FormControl>
                    </Grid>
                </Grid>
            </Grid>
        </Fragment>
    )
}

// Description
export const Description = props => {
    const classes = useStyles();

    const {
        values,
        touched,
        errors,
        handleChange,
        handleBlur,
    } = props;
    return (
        <Grid container
            className={classes.componentSpacing}>
            <Grid item xs={12}>
                <FormControl className={classes.margin}>
                    <InputLabel shrink required htmlFor="description" className={classes.label}>
                        Description
                    </InputLabel>

                    <CssTextField
                        id="description"
                        variant="outlined"
                        helperText="Enter the project description or manuscript abstract"
                        multiline
                        rows="4"
                        rowsMax="8"
                        value={values.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.description && touched.description}
                        style={{ width: 600 }}
                    />
                    {errors.description &&
                        touched.description && (
                            <div className="input-feedback" style={{ display: 'block', margin: 8 }}>
                                {errors.description}
                            </div>
                        )}
                </FormControl>
            </Grid>
        </Grid>
    )
}



// Corresponding Author Name - First name and Last name fields
export const CorrespondingAuthor = (props) => {
    const classes = useStyles();

    const {
        values,
        touched,
        errors,
        handleChange,
        handleBlur,
        isSubmitting,
        dirty
    } = props;

    return (
        <Fragment>
            <Grid container
                className={classes.componentSpacing}>
                <Grid item xs={12}>
                    <Typography gutterBottom variant="body1" className={classes.header}>
                        Corresponding Author(s)
                    </Typography>
                </Grid>

                <FieldArray name="correspondingAuthors">
                    {({ push, remove }) => (
                        <Fragment>
                            {values.correspondingAuthors &&
                                values.correspondingAuthors.length > 0 &&
                                values.correspondingAuthors.map((corrAuthor, index) => (
                                    <Grid
                                        key={index}
                                        container
                                        direction="row"
                                        justify="flex-start"
                                        alignItems="center"
                                    >
                                        <Grid item >
                                            <FormControl className={classes.margin}>
                                                <InputLabel
                                                    shrink required htmlFor="correspondingAuthors"
                                                    className={classes.label}
                                                >
                                                    Corresponding Author First Name
                                            </InputLabel>

                                                <CssTextField
                                                    id={`correspondingAuthors[${index}].firstName`}
                                                    type="input"
                                                    variant="outlined"
                                                    helperText="Add corresponding author first name"
                                                    value={values.correspondingAuthors[index].firstName}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={errors.correspondingAuthors && touched.correspondingAuthors &&
                                                        errors.correspondingAuthors[index] &&
                                                        touched.correspondingAuthors[index] &&
                                                        errors.correspondingAuthors[index].firstName &&
                                                        touched.correspondingAuthors[index].firstName}
                                                    style={{ width: 300 }}
                                                />

                                                {errors.correspondingAuthors && touched.correspondingAuthors &&
                                                    errors.correspondingAuthors[index] &&
                                                    touched.correspondingAuthors[index] &&
                                                    errors.correspondingAuthors[index].firstName &&
                                                    touched.correspondingAuthors[index].firstName && (
                                                        <div className="input-feedback" style={{ display: 'block', margin: 8 }}>
                                                            {errors.correspondingAuthors[index].firstName}
                                                        </div>
                                                    )}
                                            </FormControl>
                                        </Grid>

                                        <Grid item >
                                            <FormControl className={classes.margin}>
                                                <InputLabel
                                                    shrink required htmlFor="correspondingAuthors"
                                                    className={classes.label}
                                                >
                                                    Corresponding Author Last Name
                                            </InputLabel>

                                                <CssTextField
                                                    id={`correspondingAuthors[${index}].lastName`}
                                                    type="input"
                                                    variant="outlined"
                                                    helperText="Add corresponding author last name"
                                                    value={values.correspondingAuthors[index].lastName}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={errors.correspondingAuthors && touched.correspondingAuthors &&
                                                        errors.correspondingAuthors[index] &&
                                                        touched.correspondingAuthors[index] &&
                                                        errors.correspondingAuthors[index].lastName &&
                                                        touched.correspondingAuthors[index].lastName}
                                                    style={{ width: 300 }}
                                                />

                                                {errors.correspondingAuthors && touched.correspondingAuthors &&
                                                    errors.correspondingAuthors[index] &&
                                                    touched.correspondingAuthors[index] &&
                                                    errors.correspondingAuthors[index].lastName &&
                                                    touched.correspondingAuthors[index].lastName && (
                                                        <div className="input-feedback" style={{ display: 'block', margin: 8 }}>
                                                            {errors.correspondingAuthors[index].lastName}
                                                        </div>
                                                    )}
                                            </FormControl>
                                        </Grid>


                                        <Grid item >
                                            <FormControl className={classes.margin}>
                                                <InputLabel
                                                    shrink required htmlFor="correspondingAuthorsEmail"
                                                    className={classes.label}
                                                >
                                                    Corresponding Author Email
                                             </InputLabel>

                                                <CssTextField
                                                    id={`correspondingAuthors[${index}].email`}
                                                    type="input"
                                                    variant="outlined"
                                                    helperText="Add email"
                                                    value={values.correspondingAuthors[index].email}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={errors.correspondingAuthors && touched.correspondingAuthors &&
                                                        errors.correspondingAuthors[index] &&
                                                        touched.correspondingAuthors[index] &&
                                                        errors.correspondingAuthors[index].email &&
                                                        touched.correspondingAuthors[index].email}
                                                    style={{ width: 300 }}
                                                />
                                                {errors.correspondingAuthors && touched.correspondingAuthors &&
                                                    errors.correspondingAuthors[index] &&
                                                    touched.correspondingAuthors[index] &&
                                                    errors.correspondingAuthors[index].email &&
                                                    touched.correspondingAuthors[index].email && (
                                                        <div className="input-feedback" style={{ display: 'block', margin: 8 }}>
                                                            {errors.correspondingAuthors[index].email}
                                                        </div>
                                                    )}
                                            </FormControl>
                                        </Grid>

                                        <Grid item>
                                            {(index !== 0) && (
                                                <IconButton aria-label="delete"
                                                    onClick={() => remove(index)}
                                                    disabled={!dirty || isSubmitting || index === 0}>
                                                    <ClearIcon />
                                                </IconButton>
                                            )}
                                        </Grid>
                                    </Grid>
                                ))
                            }
                            <Button
                                type="button"
                                className={classes.button}
                                variant="outlined"
                                onClick={() => push({ firstName: '', lastName: '', email: '' })}
                                disabled={!dirty || isSubmitting}
                            >
                                Add more Corresponding authors
                    </Button>
                        </Fragment>
                    )}
                </FieldArray >
            </Grid>
        </Fragment>
    )
}


// Journal Name
export const JournalName = (props) => {
    const classes = useStyles();

    const {
        values,
        touched,
        errors,
        handleChange,
        handleBlur,
    } = props;

    const onTagsChange = (event, val) => {
        values.journal = val;
    }

    return (
        <Fragment>
            <Grid container
                className={classes.componentSpacing}>
                <Grid item xs={12}>
                    <Typography gutterBottom variant="body1" className={classes.header}>
                        Journal details
                    </Typography>
                </Grid>

                <Grid item>
                    <FormControl className={classes.margin}>
                        <InputLabel shrink required htmlFor="journal"
                            style={{ marginTop: -8 }}
                        >
                            Journal Name
                        </InputLabel>

                        <Autocomplete
                            id="journal"
                            freeSolo
                            options={gwasJournalAbbr.map((option) => option.journalTitle)}
                            onChange={onTagsChange}
                            onBlur={handleBlur}
                            renderInput={(params) => (
                                <CssTextField
                                    {...params}
                                    id="journal-text"
                                    type="input"
                                    // label="freeSolo"
                                    margin="normal"
                                    variant="outlined"
                                    helperText="Enter the Journal name"
                                    value={values.journal}
                                    onChange={handleChange}
                                    error={errors.journal && touched.journal}
                                    style={{ width: 300 }} />
                            )}
                        />

                        {/* ORIGINAL 
                            <CssTextField
                            id="journal"
                            type="input"
                            variant="outlined"
                            helperText="Enter the Journal name"
                            value={values.journal}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.journal && touched.journal}
                            style={{ width: 600 }}
                        /> */}
                        {errors.journal &&
                            touched.journal && (
                                <div className="input-feedback" style={{ display: 'block', margin: 8 }}>
                                    {errors.journal}
                                </div>
                            )}
                    </FormControl>
                </Grid>
            </Grid>
        </Fragment>
    )
}


// Journal URL
export const JournalURL = (props) => {
    const classes = useStyles();

    const {
        values,
        touched,
        errors,
        handleChange,
        handleBlur,
    } = props;
    return (
        <Grid container
            className={classes.componentSpacing}>
            <Grid item>
                <FormControl className={classes.margin}>
                    <InputLabel shrink htmlFor="url" className={classes.label}>
                        Journal URL
                    </InputLabel>

                    <CssTextField
                        id="url"
                        type="input"
                        variant="outlined"
                        helperText="Enter the Journal URL"
                        value={values.url}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.url && touched.url}
                        style={{ width: 600 }}
                    />
                    {errors.url &&
                        touched.url && (
                            <div className="input-feedback" style={{ display: 'block', margin: 8 }}>
                                {errors.url}
                            </div>
                        )}
                </FormControl>
            </Grid>
        </Grid>
    )
}


// PrePrint Name
export const PrePrintName = (props) => {
    const classes = useStyles();

    const {
        values,
        touched,
        errors,
        handleChange,
        handleBlur,
    } = props;
    return (
        <Fragment>
            <Grid container
                className={classes.componentSpacing}>
                <Grid item xs={12}>
                    <Typography gutterBottom variant="body1" className={classes.header}>
                        Pre-print details
                    </Typography>
                </Grid>

                <Grid item>
                    <FormControl className={classes.margin}>
                        <InputLabel shrink required={props.required}
                            htmlFor="prePrintServer" className={classes.label}>
                            Pre-print server name
                </InputLabel>

                        <CssTextField
                            id="prePrintServer"
                            variant="outlined"
                            helperText="Enter the Pre-print server name"
                            value={values.prePrintServer}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.prePrintServer && touched.prePrintServer}
                            style={{ width: 600 }}
                        />
                        {errors.prePrintServer &&
                            touched.prePrintServer && (
                                <div className="input-feedback" style={{ display: 'block', margin: 8 }}>
                                    {errors.prePrintServer}
                                </div>
                            )}
                    </FormControl>
                </Grid>
            </Grid>
        </Fragment>
    )
}


// PrePrint DOI
export const PrePrintDOI = (props) => {
    const classes = useStyles();

    const {
        values,
        touched,
        errors,
        handleChange,
        handleBlur,
    } = props;
    return (
        <Grid container
            className={classes.componentSpacing}>
            <Grid item>
                <FormControl className={classes.margin}>
                    <InputLabel shrink required={props.required}
                        htmlFor="preprintServerDOI" className={classes.label}>
                        Pre-print DOI
                    </InputLabel>

                    <CssTextField
                        id="preprintServerDOI"
                        variant="outlined"
                        helperText="Enter the Pre-print DOI"
                        value={values.preprintServerDOI}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.preprintServerDOI && touched.preprintServerDOI}
                        style={{ width: 600 }}
                    />
                    {errors.preprintServerDOI &&
                        touched.preprintServerDOI && (
                            <div className="input-feedback" style={{ display: 'block', margin: 8 }}>
                                {errors.preprintServerDOI}
                            </div>
                        )}
                </FormControl>
            </Grid>
        </Grid>
    )
}


export const EmbargoDate = (props) => {
    const classes = useStyles();

    const {
        values,
        touched,
        errors,
    } = props;

    // Handle change in touched.embargoDate after pressing "submit" button
    let submittedTouch = true;
    if (typeof touched.embargoDate === 'object') {
        touched.embargoDate = submittedTouch
    }

    // const maxDate = new Date('2025-01-01')
    const { setFieldValue } = useFormikContext();
    const [field] = useField(props); // ToDo: Resolve error: "Warning: Invalid field name. Either pass `useField` a string or an object containing a `name` key."

    return (
        <Fragment>
            <Grid container
                className={classes.componentSpacing}>
                <Grid item xs={12}>
                    <Typography gutterBottom variant="body1" className={classes.header}>
                        Embargo Date
                    </Typography>
                </Grid>

                <Grid item>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <InputLabel shrink required htmlFor="embargoDate" className={classes.margin}>
                            Embargo Date (Year/Month/Day)
                        </InputLabel>

                        <CustomKeyboardDatePicker
                            {...field}
                            id="embargoDate"
                            autoOk
                            disabled={values.embargoUntilPublished}
                            disableToolbar
                            variant="inline"
                            inputVariant="outlined"
                            format="yyyy/MM/dd"
                            invalidDateMessage="" // Use Formik "errors"
                            error={errors.embargoDate && touched.embargoDate}
                            minDate={new Date()}
                            // maxDate={maxDate}
                            selected={(field.value && new Date(field.value)) || null}
                            // InputAdornmentProps={{ position: "start" }}
                            onChange={val => {
                                setFieldValue(field.name, val);
                            }}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                    {errors.embargoDate &&
                        touched.embargoDate && (
                            <div className="input-feedback" style={{ display: 'block', margin: 8 }}>
                                {errors.embargoDate}
                            </div>
                        )}
                </Grid>
            </Grid>
        </Fragment>
    );
}


export const CustomCheckbox = withStyles({
    root: {
        '&$checked': {
            color: "rgb(57, 138, 150);",
        },
    },
    checked: {},
})(props => <Checkbox color="default" {...props} />)


// Embargo Checkbox
export const EmbargoDateCheckbox = (props) => {
    const classes = useStyles();

    // const { setFieldValue } = useFormikContext();
    const [field] = useField(props);

    return (
        <Grid container
            className={classes.componentSpacing}>
            <Grid item className={classes.margin}>
                <FormControlLabel
                    control={<CustomCheckbox
                        {...field}
                        id="embargoUntilPublished"
                        checked={field.value.embargoUntilPublished}
                    // onChange={() => setFieldValue("embargoUntilPublished", !field.value.embargoUntilPublished)}
                    />
                    }
                    label="Embargo until published"
                />
            </Grid>
        </Grid>
    )
}


// Journal Name Autocomplete
const gwasJournalAbbr = journal_abbr_data;

export const FreeSolo = () => {
    return (
        <div style={{ width: 300 }}>
            <Autocomplete
                id="free-solo-demo"
                freeSolo
                options={gwasJournalAbbr.map((option) => option.journalTitle)}
                renderInput={(params) => (
                    <TextField {...params} label="freeSolo" margin="normal" variant="outlined" />
                )}
            />
        </div>
    );
}
