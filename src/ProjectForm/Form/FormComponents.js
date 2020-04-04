import React, { Fragment } from 'react';
import { Grid, Typography, TextField, Button, FormControl, FormControlLabel, InputLabel, Checkbox } from '@material-ui/core';
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
    embargoDateLabel: {
        margin: theme.spacing(1)
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
            color: 'gray'
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
        <Grid item>
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
        <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
        >
            <Grid item >
                <FormControl className={classes.margin}>
                    <InputLabel
                        shrink required htmlFor="firstName"
                        className={classes.label}
                    >
                        First Name/Given Name
                </InputLabel>

                    <CssTextField
                        id="firstAuthor.firstName"
                        type="input"
                        variant="outlined"
                        placeholder="Add first/given name"
                        value={values.firstAuthor.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.firstAuthor && touched.firstAuthor &&
                            errors.firstAuthor.firstName && touched.firstAuthor.firstName}
                        style={{ width: 300 }}
                    />
                    {errors.firstAuthor && touched.firstAuthor &&
                        errors.firstAuthor.firstName &&
                        touched.firstAuthor.firstName && (
                            <div className="input-feedback" style={{ display: 'block', margin: 8 }}>
                                {errors.firstAuthor.firstName}
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
                        id="firstAuthor.lastName"
                        type="input"
                        variant="outlined"
                        placeholder="Add last name/surname"
                        value={values.firstAuthor.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.firstAuthor && touched.firstAuthor &&
                            errors.firstAuthor.lastName && touched.firstAuthor.lastName}
                        style={{ width: 300 }}
                    />
                    {errors.firstAuthor && touched.firstAuthor &&
                        errors.firstAuthor.lastName &&
                        touched.firstAuthor.lastName && (
                            <div className="input-feedback" style={{ display: 'block', margin: 8 }}>
                                {errors.firstAuthor.lastName}
                            </div>
                        )}
                </FormControl>
            </Grid>
        </Grid>
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
        <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
        >
            <Grid item >
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
                        placeholder="Add first/given name"
                        value={values.lastAuthor.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.lastAuthor && touched.lastAuthor &&
                            errors.lastAuthor.firstName && touched.lastAuthor.firstName}
                        style={{ width: 300 }}
                    />
                    {errors.lastAuthor && touched.lastAuthor &&
                        errors.lastAuthor.firstName &&
                        touched.lastAuthor.firstName && (
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
                        placeholder="Add last name/surname"
                        value={values.lastAuthor.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.lastAuthor && touched.lastAuthor &&
                            errors.lastAuthor.lastName && touched.lastAuthor.lastName}
                        style={{ width: 300 }}
                    />
                    {errors.lastAuthor && touched.lastAuthor &&
                        errors.lastAuthor.lastName &&
                        touched.lastAuthor.lastName && (
                            <div className="input-feedback" style={{ display: 'block', margin: 8 }}>
                                {errors.lastAuthor.lastName}
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
        isSubmitting,
        dirty
    } = props;
    console.log("** Values CA[0]: ", values.correspondingAuthors[0])

    return (
        <Grid>
            <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
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
                            id="correspondingAuthors[0].firstName"
                            type="input"
                            variant="outlined"
                            placeholder="Add corresponding author first name"
                            value={values.correspondingAuthors[0].firstName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.correspondingAuthors && touched.correspondingAuthors &&
                                errors.correspondingAuthors[0].firstName &&
                                touched.correspondingAuthors[0].firstName}
                            style={{ width: 300 }}
                        />

                        {errors.correspondingAuthors && touched.correspondingAuthors &&
                            errors.correspondingAuthors[0].firstName &&
                            touched.correspondingAuthors[0].firstName && (
                                <div className="input-feedback" style={{ display: 'block', margin: 8 }}>
                                    {errors.correspondingAuthors[0].firstName}
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
                            id="correspondingAuthors[0].lastName"
                            type="input"
                            variant="outlined"
                            placeholder="Add corresponding author last name"
                            value={values.correspondingAuthors[0].lastName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.correspondingAuthors && touched.correspondingAuthors &&
                                errors.correspondingAuthors[0].lastName &&
                                touched.correspondingAuthors[0].lastName}
                            style={{ width: 300 }}
                        />

                        {errors.correspondingAuthors && touched.correspondingAuthors &&
                            errors.correspondingAuthors[0].lastName &&
                            touched.correspondingAuthors[0].lastName && (
                                <div className="input-feedback" style={{ display: 'block', margin: 8 }}>
                                    {errors.correspondingAuthors[0].lastName}
                                </div>
                            )}
                    </FormControl>
                </Grid>

                <Grid item>
                    <Email {...props} />
                </Grid>
            </Grid>

            <Button
                type="button"
                className={classes.button}
                variant="outlined"
                // onClick={handleReset}
                disabled={!dirty || isSubmitting}
            >
                Add more Corresponding authors
            </Button>
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
                    id="correspondingAuthors[0].email"
                    type="input"
                    variant="outlined"
                    placeholder="Enter your email"
                    value={values.correspondingAuthors[0].email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.correspondingAuthors && touched.correspondingAuthors &&
                        errors.correspondingAuthors[0].email && touched.correspondingAuthors[0].email}
                />
                {errors.correspondingAuthors && touched.correspondingAuthors &&
                    errors.correspondingAuthors[0].email &&
                    touched.correspondingAuthors[0].email && (
                        <div className="input-feedback" style={{ display: 'block', margin: 8 }}>
                            {errors.correspondingAuthors[0].email}
                        </div>
                    )}
            </FormControl>
        </Grid>
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
    return (
        <Grid item>
            <FormControl className={classes.margin}>
                <InputLabel shrink required htmlFor="journal" className={classes.label}>
                    Journal Name
                </InputLabel>

                <CssTextField
                    id="journal"
                    type="input"
                    variant="outlined"
                    placeholder="Enter the Journal name"
                    value={values.journal}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.journal && touched.journal}
                    style={{ width: 600 }}
                />
                {errors.journal &&
                    touched.journal && (
                        <div className="input-feedback" style={{ display: 'block', margin: 8 }}>
                            {errors.journal}
                        </div>
                    )}
            </FormControl>
        </Grid>
    )
}


// Journal URL
export const JournalURL = props => {
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
                <InputLabel shrink htmlFor="url" className={classes.label}>
                    Journal URL
                </InputLabel>

                <CssTextField
                    id="url"
                    type="input"
                    variant="outlined"
                    placeholder="Enter the Journal URL"
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
                <InputLabel shrink htmlFor="prePrintServer" className={classes.label}>
                    PrePrint server name
                </InputLabel>

                <CssTextField
                    id="prePrintServer"
                    variant="outlined"
                    placeholder="Enter the PrePrint server name"
                    value={values.prePrintServer}
                    onChange={handleChange}
                    onBlur={handleBlur}
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
                <InputLabel shrink htmlFor="preprintServerDOI" className={classes.label}>
                    PrePrint DOI
                </InputLabel>

                <CssTextField
                    id="preprintServerDOI"
                    variant="outlined"
                    placeholder="Enter the PrePrint DOI"
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
    )
}


export const EmbargoDate = (props) => {
    const classes = useStyles();

    // const maxDate = new Date('2025-01-01')
    const { setFieldValue } = useFormikContext();
    const [field] = useField(props);

    return (
        <Grid item>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <InputLabel shrink required htmlFor="embargo_date" className={classes.embargoDateLabel}>
                    Embargo Date (Month/Day/Year)
                </InputLabel>

                <CustomKeyboardDatePicker
                    {...field}
                    {...props}
                    autoOk
                    disableToolbar
                    variant="inline"
                    inputVariant="outlined"
                    format="MM/dd/yyyy"
                    id="date"
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

    const { setFieldValue } = useFormikContext();
    const [field] = useField(props);
    console.log("Checked value: ", field.value.embargoUntilPublished)

    return (
        <Grid item>
            <FormControlLabel
                control={<CustomCheckbox
                    id="embargoUntilPublished"
                    checked={field.value.embargoUntilPublished}
                    onChange={() => setFieldValue("embargoUntilPublished", !field.value.embargoUntilPublished)}
                />
                }
                label="Embargo until published"
            />
        </Grid>
    )
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
