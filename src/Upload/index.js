import React, { Component, Fragment } from 'react'
import Dropzone from '../Dropzone'
import Progress from '../Progress'
import './upload.css'
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ElixirAuthService from '../ElixirAuthService';
import history from "../history";
import axios from 'axios';

import { withStyles } from '@material-ui/core/styles';

const UPLOAD_TEMPLATE_URL_BASE = process.env.REACT_APP_LOCAL_BASE_URI;

const styles = theme => ({
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
        },
    },
    errorMessageFormat: {
        textAlign: "left",
        color: "red"
    },
});


class Upload extends Component {
    _isMounted = false;

    constructor(props) {
        super(props)
        this.ElixirAuthService = new ElixirAuthService();

        this.state = {
            files: [],
            uploading: false,
            uploadProgress: {},
            successfullUploaded: false,
            uploadError: null,
            fileStatus: false,
            SUBMISSION_ID: this.props.submission_id,
            extraFileProcessing: null,
            extraFileProcessingMessage: null,
        };

        this.onFilesAdded = this.onFilesAdded.bind(this);
        this.uploadFiles = this.uploadFiles.bind(this);
        this.sendRequest = this.sendRequest.bind(this);
        this._updateState = this._updateState.bind(this);
        this.renderActions = this.renderActions.bind(this);
        this.hideUploadComponent = this.hideUploadComponent.bind(this);
    }

    getToken() {
        let auth = localStorage.getItem('id_token');
        // Check if token exists
        if (auth) {
            // Check if token is still valid
            if (this.ElixirAuthService.isTokenExpired(auth)) {
                alert("Your session has expired, redirecting to login.")
                setTimeout(() => {
                    history.push(`${process.env.PUBLIC_URL}/login`);
                }, 1000);

            } else {
                return auth;
            }
        } else {
            alert("You must login to view submissions, redirecting to login.")
            setTimeout(() => {
                history.push(`${process.env.PUBLIC_URL}/login`);
            }, 1000);
        }
    }

    onFilesAdded(files) {
        this.setState(prevState => ({
            files: prevState.files.concat(files)
        }));
    }

    renderProgress(file) {
        const uploadProgress = this.state.uploadProgress[file.name];
        if (this.state.uploading || this.state.successfullUploaded) {
            return (
                <div className="ProgressWrapper">
                    <Progress progress={uploadProgress ? uploadProgress.percentage : 0} />
                    <img
                        className="CheckIcon"
                        alt="done"
                        src={process.env.PUBLIC_URL + '/images/baseline-check_circle_outline-24px.svg'}
                        style={{
                            opacity:
                                uploadProgress && uploadProgress.state === "done" ? 0.5 : 0
                        }}
                    />
                </div>
            );
        }
    }

    renderActions() {
        const { classes } = this.props;
        const { extraFileProcessing } = this.state;

        let { extraFileProcessingMessage } = this.state;
        if (extraFileProcessing) {
            extraFileProcessingMessage = 'Finalizing upload...';
        }

        if (this.state.successfullUploaded) {
            return (
                <Fragment>
                    <Grid item xs={3}>
                        <Button className={classes.button}
                            onClick={this.hideUploadComponent}>
                            Start validation
                        </Button>
                    </Grid>
                </Fragment>
            );
        } else {
            return (
                <Fragment>
                    <Grid item xs={3}>
                        <Button className={classes.button} variant="outlined"
                            disabled={this.state.files.length <= 0 || this.state.uploading}
                            onClick={this.uploadFiles}>
                            Upload File
                        </Button>

                        <Typography>
                            {extraFileProcessingMessage}
                        </Typography>

                        <Typography variant="body2" gutterBottom className={classes.errorMessageFormat}>
                            {this.state.uploadError}
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Button className={classes.button} variant="outlined"
                            disabled={this.state.files.length <= 0 || this.state.uploading}
                            onClick={() =>
                                this.setState({ files: [], successfullUploaded: false, uploadError: null })
                            }>
                            Clear
                        </Button>
                    </Grid>
                </Fragment>
            );
        }
    }

    hideUploadComponent() {
        window.location.reload();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }


    async uploadFiles() {
        this.setState({ uploadProgress: {}, uploading: true });
        const promises = [];
        this.state.files.forEach(file => {
            promises.push(this.sendRequest(file));
        });

        try {
            await Promise.all(promises);
        } catch (error) {
            this.setState({ successfullUploaded: false, uploading: false });
        }
    }


    sendRequest(file) {
        this._isMounted = true;
        const formData = new FormData();
        formData.append("file", file);

        let token = localStorage.getItem('id_token');

        var config = {
            onUploadProgress: progressEvent => {
                if (progressEvent.lengthComputable) {
                    var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);

                    if (progressEvent.lengthComputable) {
                        const copy = { ...this.state.uploadProgress };
                        copy[file.name] = {
                            state: "pending",
                            percentage: percentCompleted
                        };
                        this.setState({ uploadProgress: copy });

                        if (percentCompleted === 100) {
                            this.setState({ extraFileProcessing: true });
                        }
                    }
                }
            },
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        };

        // Post file to GWAS Backend app
        let file_upload_url = UPLOAD_TEMPLATE_URL_BASE + "submissions/" + this.state.SUBMISSION_ID + "/uploads";

        if (this._isMounted) {
            // Check if user is logged in and if token is still valid
            if (token && !this.ElixirAuthService.isTokenExpired(token)) {
                axios.post(file_upload_url, formData, config
                )
                    .then(response => {
                        if (response.status === 201) {
                            // Update file upload status on successful upload after response status 201 is returned
                            this._updateState();
                        }

                    })
                    .catch(err => {
                        console.log("** Error: ", err);
                    });
            };
        }
        // Check if token is expired
        else if (token && this.ElixirAuthService.isTokenExpired(token)) {
            alert("Your session has expired, please login again.")
            history.push(`${process.env.PUBLIC_URL}/login`);
        }
        else {
            alert("Please login to create a submission.")
            history.push(`${process.env.PUBLIC_URL}/login`);
        }
    }

    /**
     * Update file upload status on successful upload.
     */
    _updateState() {
        this.setState(() => ({ successfullUploaded: true, uploading: false }));
    }




    // sendRequest(file) {
    //     return new Promise((resolve, reject) => {
    //         this._isMounted = true;
    //         const req = new XMLHttpRequest();

    //         req.upload.addEventListener("progress", event => {
    //             if (event.lengthComputable) {
    //                 const copy = { ...this.state.uploadProgress };
    //                 copy[file.name] = {
    //                     state: "pending",
    //                     percentage: (event.loaded / event.total) * 100
    //                 };
    //                 this.setState({ uploadProgress: copy });
    //             }
    //         });

    //         req.upload.addEventListener("load", event => {
    //             const copy = { ...this.state.uploadProgress };
    //             copy[file.name] = { state: "done", percentage: 100 };
    //             this.setState({ uploadProgress: copy });
    //             resolve(req.response);
    //         });

    //         req.upload.addEventListener("error", event => {
    //             const copy = { ...this.state.uploadProgress };
    //             copy[file.name] = { state: "error", percentage: 0 };
    //             this.setState({ uploadProgress: copy, uploadError: "Error uploading file." });
    //             reject(req.response);
    //         });

    //         const formData = new FormData();
    //         formData.append("file", file);

    //         // Post file to GWAS Backend app
    //         let file_upload_url = UPLOAD_TEMPLATE_URL_BASE + "submissions/" + this.state.SUBMISSION_ID + "/uploads";
    //         let token = localStorage.getItem('id_token');

    //         if (this._isMounted) {
    //             // Check if user is logged in and if token is still valid
    //             if (token && !this.ElixirAuthService.isTokenExpired(token)) {
    //                 req.open("POST", file_upload_url);
    //                 req.setRequestHeader('Authorization', 'Bearer ' + token);
    //                 req.send(formData);
    //             }
    //             // Check if token is expired
    //             else if (token && this.ElixirAuthService.isTokenExpired(token)) {
    //                 alert("Your session has expired, please login again.")
    //                 history.push(`${process.env.PUBLIC_URL}/login`);
    //             }
    //             else {
    //                 alert("Please login to create a submission.")
    //                 history.push(`${process.env.PUBLIC_URL}/login`);
    //             }
    //         }
    //     });
    // }


    render() {
        return (
            <div style={{ padding: 24 }}>
                <Grid item xs={12}
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={3}>
                    <Grid item xs={2}>
                        <Dropzone
                            onFilesAdded={this.onFilesAdded}
                            disabled={this.state.uploading || this.state.successfullUploaded}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        {this.state.files.map(file => {
                            return (
                                <div key={file.name} className="Row">
                                    <span className="Filename">Filename: {file.name}</span>
                                    {this.renderProgress(file)}
                                </div>
                            );
                        })}
                    </Grid>
                    {this.renderActions()}
                </Grid>
            </div>
        );
    }
}

Upload = withStyles(styles)(Upload)
export default Upload
