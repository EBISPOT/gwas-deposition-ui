import React, { useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Typography } from '@material-ui/core/';
import history from "../history";
import axios from 'axios';
import ApiClient from '../apiClient';
import ElixirAuthService from '../ElixirAuthService';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


const useStyles = makeStyles(theme => ({
    errorText: {
        color: 'red',
    },
    button: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(1),
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
        }
    },
}));


/**
 * Download Study Accessions
 * @param {*} props
 * @param {*} gcstDownloadError
 */
const downloadFile = (props, gcstDownloadError) => {
    const GCST_DOWNLOAD_URL = process.env.REACT_APP_LOCAL_BASE_URI + 'submissions/' + props.submissionId + '/study-envelopes';
    let headers = { headers: { 'Authorization': 'Bearer ' + props.token, }, responseType: 'blob' }
    let fileName = 'gcst_list.xlsx';

    axios.get(GCST_DOWNLOAD_URL, headers,
    ).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');

        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        gcstDownloadError.setGcstDownloadError(false)
    }).catch((error) => {
        gcstDownloadError.setGcstDownloadError(true)
    })
}

/**
 * Download Study Accessions Button
 * @param {*} props
 */
export const DownloadGcstButton = (props) => {
    const classes = useStyles();

    const [isGcstDownloadError, setGcstDownloadError] = useState(false);
    let gcstDownloadError = { "setGcstDownloadError": setGcstDownloadError }

    return (
        <Fragment>
            <Button
                className={classes.button}
                onClick={() => { downloadFile(props, gcstDownloadError) }}>
                Download Study Accessions
            </Button>
            {isGcstDownloadError && (
                <div>
                    <Typography variant="body2" className={classes.errorText}>
                        Error downloading file. Please contact gwas-subs@ebi.ac.uk
                    </Typography>
                </div>
            )}
        </Fragment>
    )
};




/**
 * Delete Submission
 */
const deleteSubmission = (props, deleteSubmissionError, isModalOpen) => {
    let EAS = new ElixirAuthService();
    let API_CLIENT = new ApiClient();

    // Check if user is logged in
    if (props.token && !EAS.isTokenExpired(props.token)) {
        API_CLIENT.deleteSubmission(props.submissionId).then(response => {
            if (response.status === 200) {
                history.replace(`${process.env.PUBLIC_URL}`);
            }
        }).catch(error => {
            deleteSubmissionError.setDeleteSubmissionError(true)
            isModalOpen.setOpen(false)
        })
    }
    // Check if token is valid
    else if (props.token && EAS.isTokenExpired(props.token)) {
        alert("Your session has expired, redirecting to login.")
        setTimeout(() => {
            history.push(`${process.env.PUBLIC_URL}/login`);
        }, 1000);
    }
    else {
        alert("Please login to delete a file")
        history.push(`${process.env.PUBLIC_URL}/login`);
    }
}

/**
 * Delete Submission Button
 * @param {*} props
 */
export const DeleteSubmissionButton = (props) => {
    const classes = useStyles();

    const [isDeleteSubmissionError, setDeleteSubmissionError] = useState(false);
    let deleteSubmissionError = { "setDeleteSubmissionError": setDeleteSubmissionError }

    // Set disabled button state based on submissionStatus value
    // TODO: Confirm submissionStatus labels to set isDisabled
    let isDisabled = true;

    if (props.submissionStatus === 'VALID' || props.submissionStatus === 'INVALID'
        || props.submissionStatus === 'STARTED' || props.submissionStatus === null) {
        isDisabled = false;
    }

    const [open, setOpen] = React.useState(false);
    let isModalOpen = { "setOpen": setOpen }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Fragment>
            <Button fullWidth className={classes.button}
                onClick={handleClickOpen}
                disabled={isDisabled}>
                Delete Submission
            </Button>
            {isDeleteSubmissionError && (
                <Typography variant="body2" className={classes.errorText}>
                    Error deleting submission. Please contact gwas-subs@ebi.ac.uk
                </Typography>
            )}

            <Dialog
                open={open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this submission?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => { deleteSubmission(props, deleteSubmissionError, isModalOpen) }}>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    )
}
