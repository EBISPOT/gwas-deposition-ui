import React, { useState, Fragment } from 'react';
import axios from 'axios';
import { Button, Typography } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';


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
        console.log(error)
    })
}

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
