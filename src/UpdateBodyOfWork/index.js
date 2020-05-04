import React, { useState, useEffect } from 'react';
import { Grid, Typography, Button, FormControl, InputLabel } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { withFormik } from 'formik';
import _ from 'lodash';
import PropTypes from "prop-types";

import ChipInput from 'material-ui-chip-input';

import ElixirAuthService from '../ElixirAuthService';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import history from '../history';


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


const MyPubMedInputForm = props => {
    const classes = useStyles();

    const {
        values,
        touched,
        errors,
        handleBlur,
        handleSubmit,
        isSubmitting,
    } = props;

    // Save Form data to local storage on page load
    const initialPmids = JSON.parse(localStorage.getItem('initial_pmids'))

    // Manage PMID input data
    const [chipData, setChipData] = useState([...values.pmids]);

    /**
    * Manage storage of Body of Work data in local storage
    * to prevent updates of data on page redirect vs. actual
    * updates of the data.
    * @param {*} props 
    */
    const manageBowData = (props) => {
        let bowLocalStorage = JSON.parse(localStorage.getItem('bow_data'))

        // Add to localStorage on first load
        if (bowLocalStorage === null || bowLocalStorage === undefined) {
            localStorage.setItem('bow_data', JSON.stringify(props.values.bodyOfWorkObj))
        }
        // Update localStorage if BOW data is different
        if (bowLocalStorage && !_.isEqual(props.values.bodyOfWorkObj.pmids, props.values.pmids)) {
            let updated_pmids = props.values.pmids;
            Object.assign(bowLocalStorage, { pmids: updated_pmids })
            localStorage.setItem('bow_data', JSON.stringify(bowLocalStorage));
        }
    }

    useEffect(() => {
        values.pmids = chipData;

        // Add data to localStorage for each change if the data is different!
        manageBowData(props)

        // Redirect to BOW details page if submit response is successful
        if (props.formState.isDone) {
            history.replace(`${process.env.PUBLIC_URL}/bodyofwork/${props.values.bodyOfWorkId}`);
        }
    });

    const handleChange = (val) => {
        setChipData(val);
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <Grid container className={classes.componentSpacing}>
                    <Grid item xs={12}>
                        {props.values && (
                            <div>
                                <Typography gutterBottom variant="body1" className={classes.header}>
                                    Body of Work Details for: &nbsp;
                                {props.values.bodyOfWorkId}
                                </Typography>

                                <Typography gutterBottom>
                                    Initial PMID(s): &nbsp;
                                    {initialPmids.map((pmid, index) => [
                                    index > 0 && ", ",
                                    <span key={index} className={classes.pmidListStyle} >{pmid}</span>
                                ])}
                                </Typography>
                            </div>
                        )}
                    </Grid>

                    <Grid item xs={12}>
                        <Typography gutterBottom variant="body1" className={classes.header}>
                            Add PMID(s)
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <FormControl className={classes.margin}>
                            <InputLabel shrink required htmlFor="pmids" className={classes.label}>
                                PMID
                            </InputLabel>

                            <ChipInput
                                id="pmids"
                                variant="outlined"
                                helperText="Enter PMID(s)"
                                defaultValue={values.pmids}
                                onChange={(chips) => handleChange(chips)}
                                onBlur={handleBlur}
                                error={errors.pmids && touched.pmids}
                                style={{ width: 500, marginTop: 24 }}
                            />
                            {errors.pmids &&
                                touched.pmids && (
                                    <div className="input-feedback" style={{ display: 'block', marginTop: 24 }}>
                                        {errors.pmids}
                                    </div>
                                )}
                        </FormControl>
                    </Grid>
                </Grid>

                {/* <Button
                    type="button"
                    className={classes.buttonReset}
                    onClick={handleReset}
                    disabled={!dirty || isSubmitting}
                >
                    Reset
                </Button> */}

                <Button
                    type="submit"
                    className={classes.button}
                    disabled={isSubmitting}
                    onClick={() => checkUserAuthStatus(props)}
                >
                    Submit
                </Button>
            </form>
        </div>
    );
};


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
            history.push({
                pathname: `${process.env.PUBLIC_URL}/gdpr`,
                state: {
                    from: `/update-bodyofwork`,
                }
            })
        }
        else {
            history.push({
                pathname: `${process.env.PUBLIC_URL}/login`,
                state: {
                    from: `/update-bodyofwork`,
                }
            })
        }
    }
    return;
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

const MyEnhancedPubMedInputForm = withFormik({

    mapPropsToValues: (props) => ({
        pmids: [...props.values.pmids],
        bodyOfWorkId: props.values.bodyOfWorkId,
        bodyOfWorkObj: props.values,
    }),

    // Custom sync validation
    validate: (values) => {
        const errors = {};
        let longPmids = [];
        let nonNumericPmids = [];

        // Check for empty value
        if (values.pmids === undefined || values.pmids.length === 0) {
            errors.pmids = 'Required';
        }

        // Validate each PMID entered
        for (const pmid of values.pmids) {
            if (!/^\d+$/.test(pmid)) {
                nonNumericPmids.push(pmid)
                errors.pmids = `PMID(s) "${nonNumericPmids}" must be numbers`;
            }

            if (/^\d+$/.test(pmid) && pmid.length > 8) {
                longPmids.push(pmid)
                errors.pmids = `Error: PMID(s) "${longPmids}" must be 8 digits or less`;
            }
        }

        return errors;
    },

    handleSubmit: (values, { setSubmitting, resetForm, props }) => {

        setTimeout(() => {
            // Create new object to modify
            let valuesCopy = {};

            // valuesCopy = JSON.parse(JSON.stringify(values.bodyOfWorkObj));
            valuesCopy = values.bodyOfWorkObj;

            // PMIDs to update BOW
            let updatedPmids = { pmids: values.pmids }

            // Update PMIDs in BOW
            updatePMIDs(valuesCopy, updatedPmids)

            // Update BodyOfWork
            updateBodyOfWork(valuesCopy, props)

            // alert(JSON.stringify(valuesCopy, null, 2));
            setSubmitting(false);

            resetForm();
        }, 1000);
    },

    displayName: 'MyEnhancedPubMedInputForm',
})(MyPubMedInputForm);



/**
 * Update PMID(s) in BodyOfWorkObj 
 */
const updatePMIDs = (allBowValues, updatedPmids) => {
    // Prevent object update after redirects for GDPR/Login
    // TODO Update to use !_.isEqual from Lodash
    if (JSON.stringify(allBowValues.pmids.sort()) !== JSON.stringify(updatedPmids.pmids.sort())) {
        Object.assign(allBowValues, updatedPmids)
    }

    return allBowValues
}


/**
 * Submit updated BodyOfWork
 * @param {*} props 
 */
const updateBodyOfWork = async (updatedBowValues, props) => {
    const token = getToken().auth;
    const BASE_URI = process.env.REACT_APP_LOCAL_BASE_URI;
    const header = { headers: { 'Authorization': 'Bearer ' + token } }

    let debug = false;
    if (!debug) {
        await axios.put(BASE_URI + `bodyofwork/${updatedBowValues.bodyOfWorkId}`, updatedBowValues, header
        ).then(response => {
            props.formState.setIsDone(true)
        }).catch(error => {
            console.log(error);
        })
    }
}


const PubMedInputForm = (props) => {
    let bodyOfWorkObj;
    let initialPmids;

    const [isDone, setIsDone] = useState(false)
    let formState = { "isDone": isDone, "setIsDone": setIsDone }

    // Check localStorage for form data
    if (!props.location.state.bodyOfWorkObj) {
        bodyOfWorkObj = JSON.parse(localStorage.getItem('bow_data'));
    } else {
        bodyOfWorkObj = props.location.state.bodyOfWorkObj;

        // Store initial PMIDs so they are available after login redirect
        localStorage.setItem('initial_pmids', JSON.stringify(bodyOfWorkObj.pmids))
    }

    initialPmids = localStorage.getItem('initial_pmids')

    return (
        <MyEnhancedPubMedInputForm
            values={bodyOfWorkObj}
            initialPmids={initialPmids}
            formState={formState} />
    )
}

PubMedInputForm.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(useStyles)(PubMedInputForm);



