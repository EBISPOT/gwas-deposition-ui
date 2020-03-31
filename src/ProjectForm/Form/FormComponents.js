import React, { Fragment } from 'react';
import { Grid, Typography, TextField, FormControl, InputLabel } from '@material-ui/core';
import { makeStyles, withStyles, fade } from '@material-ui/core/styles';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';
import { useField, useFormikContext } from "formik";

const useStyles = makeStyles(theme => ({
    header: {
        fontSize: 18,
    },
    margin: {
        margin: theme.spacing(1),
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

// Form header text
export const Header = () => {
    const classes = useStyles();

    return (
        <Grid item xs={12}>
            <Typography gutterBottom variant="body1" className={classes.header}>
                TEST - Published manuscript, but no PMID
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
                    placeholder="Enter title"
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
    )
}

// Author Name - First name and Last name fields
export const AuthorName = (props) => {
    const classes = useStyles();

    const {
        values,
        touched,
        errors,
        handleChange,
        handleBlur,
    } = props;
    return (
        <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
        >
            <Grid item >
                <FormControl className={classes.margin}>
                    <InputLabel
                        shrink required htmlFor="first_author_first_name"
                        className={classes.label}
                    >
                        First Name/Given Name
                </InputLabel>

                    <CssTextField
                        id="first_author_first_name"
                        type="input"
                        variant="outlined"
                        placeholder="Add first/given name"
                        value={values.first_author_first_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.first_author_first_name && touched.first_author_first_name}
                        style={{ width: 300 }}
                    />
                    {errors.first_author_first_name &&
                        touched.first_author_first_name && (
                            <div className="input-feedback" style={{ display: 'block', margin: 8 }}>
                                {errors.first_author_first_name}
                            </div>
                        )}
                </FormControl>
            </Grid>

            <Grid item >
                <FormControl className={classes.margin}>
                    <InputLabel
                        shrink required htmlFor="first_author_last_name"
                        className={classes.label}
                    >
                        Last Name/Surname
                </InputLabel>

                    <CssTextField
                        id="first_author_last_name"
                        type="input"
                        variant="outlined"
                        placeholder="Add last name/surname"
                        value={values.first_author_last_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.first_author_last_name && touched.first_author_last_name}
                        style={{ width: 300 }}
                    />
                    {errors.first_author_last_name &&
                        touched.first_author_last_name && (
                            <div className="input-feedback" style={{ display: 'block', margin: 8 }}>
                                {errors.first_author_last_name}
                            </div>
                        )}
                </FormControl>
            </Grid>
        </Grid>
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
        <Grid item xs={12}>
            <FormControl className={classes.margin}>
                <InputLabel shrink htmlFor="description" className={classes.label}>
                    Description
                </InputLabel>

                <CssTextField
                    id="description"
                    variant="outlined"
                    placeholder="Enter the project description"
                    multiline
                    rows="4"
                    rowsMax="8"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
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
    } = props;
    return (
        <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
        >
            <Grid item >
                <FormControl className={classes.margin}>
                    <InputLabel
                        shrink required htmlFor="corresponding_author"
                        className={classes.label}
                    >
                        Corresponding Author Name
                </InputLabel>

                    <CssTextField
                        id="corresponding_author"
                        type="input"
                        variant="outlined"
                        placeholder="Add corresponding author name"
                        value={values.corresponding_author}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.corresponding_author && touched.corresponding_author}
                        style={{ width: 600 }}
                    />
                    {errors.corresponding_author &&
                        touched.corresponding_author && (
                            <div className="input-feedback" style={{ display: 'block', margin: 8 }}>
                                {errors.corresponding_author}
                            </div>
                        )}
                </FormControl>
            </Grid>

            <Grid item>
                <Email {...props} />
            </Grid>
        </Grid>
    )
}


export const Email = props => {
    const classes = useStyles();

    const {
        values,
        touched,
        errors,
        handleChange,
        handleBlur,
    } = props;
    return (
        <Grid item>
            <FormControl className={classes.margin}>
                <InputLabel shrink required htmlFor="email" className={classes.label}>
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
    )
}

// Journal Name
export const JournalName = props => {
    const classes = useStyles();

    const {
        values,
        touched,
        errors,
        handleChange,
        handleBlur,
    } = props;
    return (
        <Grid item>
            <FormControl className={classes.margin}>
                <InputLabel shrink htmlFor="journal_name" className={classes.label}>
                    Journal Name
                </InputLabel>

                <CssTextField
                    id="journal_name"
                    variant="outlined"
                    placeholder="Enter the Journal name"
                    value={values.journal_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{ width: 600 }}
                />
                {errors.journal_name &&
                    touched.journal_name && (
                        <div className="input-feedback" style={{ display: 'block', margin: 8 }}>
                            {errors.journal_name}
                        </div>
                    )}
            </FormControl>
        </Grid>
    )
}


// Journal DOI
export const JournalDOI = props => {
    const classes = useStyles();

    const {
        values,
        touched,
        errors,
        handleChange,
        handleBlur,
    } = props;
    return (
        <Grid item>
            <FormControl className={classes.margin}>
                <InputLabel shrink htmlFor="journal_doi" className={classes.label}>
                    Journal DOI
                </InputLabel>

                <CssTextField
                    id="journal_doi"
                    variant="outlined"
                    placeholder="Enter the Journal DOI"
                    value={values.journal_doi}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{ width: 600 }}
                />
                {errors.journal_doi &&
                    touched.journal_doi && (
                        <div className="input-feedback" style={{ display: 'block', margin: 8 }}>
                            {errors.journal_doi}
                        </div>
                    )}
            </FormControl>
        </Grid>
    )
}


// PrePrint Name
export const PrePrintName = props => {
    const classes = useStyles();

    const {
        values,
        touched,
        errors,
        handleChange,
        handleBlur,
    } = props;
    return (
        <Grid item>
            <FormControl className={classes.margin}>
                <InputLabel shrink htmlFor="preprint_name" className={classes.label}>
                    PrePrint server name
                </InputLabel>

                <CssTextField
                    id="preprint_name"
                    variant="outlined"
                    placeholder="Enter the PrePrint server name"
                    value={values.preprint_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{ width: 600 }}
                />
                {errors.preprint_name &&
                    touched.preprint_name && (
                        <div className="input-feedback" style={{ display: 'block', margin: 8 }}>
                            {errors.preprint_name}
                        </div>
                    )}
            </FormControl>
        </Grid>
    )
}


// PrePrint DOI
export const PrePrintDOI = props => {
    const classes = useStyles();

    const {
        values,
        touched,
        errors,
        handleChange,
        handleBlur,
    } = props;
    return (
        <Grid item>
            <FormControl className={classes.margin}>
                <InputLabel shrink htmlFor="preprint_doi" className={classes.label}>
                    PrePrint DOI
                </InputLabel>

                <CssTextField
                    id="preprint_doi"
                    variant="outlined"
                    placeholder="Enter the PrePrint DOI"
                    value={values.preprint_doi}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{ width: 600 }}
                />
                {errors.preprint_doi &&
                    touched.preprint_doi && (
                        <div className="input-feedback" style={{ display: 'block', margin: 8 }}>
                            {errors.preprint_doi}
                        </div>
                    )}
            </FormControl>
        </Grid>
    )
}


export const BasicDatePicker = (props, theme) => {
    const classes = useStyles();

    // const maxDate = new Date('2025-01-01')
    const { setFieldValue } = useFormikContext();
    const [field] = useField(props);

    return (
        <Grid item xs={3}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <InputLabel shrink required htmlFor="embargo_date" className={classes.label}>
                    Embargo Date (Month/Day/Year)
                </InputLabel>

                <KeyboardDatePicker
                    {...field}
                    {...props}
                    autoOk
                    disableToolbar
                    variant="inline"
                    inputVariant="outlined"
                    format="MM/dd/yyyy"
                    id="embargo_date"
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
        </Grid>
    );
}


export const DatePicker2 = props => {
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
            <InputLabel shrink htmlFor="embargo_date2" className={classes.label}>
                Embargo Date2
            </InputLabel>

            <TextField
                id="embargo_date2"
                type="date"
                variant="outlined"
                value={values.embargo_date2}
                onChange={handleChange}
                onBlur={handleBlur}
                className={classes.textField}
                InputLabelProps={{
                    shrink: true,
                }}
            />
        </Fragment>
    )
}
