import React, { Component, Fragment } from 'react'
import Dropzone from '../Dropzone'
import Progress from '../Progress'
import './upload.css'
import Grid from '@material-ui/core/Grid';
import APIClient from '../apiClient'

const UPLOAD_TEMPLATE_URL_BASE = process.env.REACT_APP_LOCAL_BASE_URI;


class Upload extends Component {
    constructor(props) {
        super(props)

        console.log("** SID: ", this.props.submission_id);

        this.state = {
            files: [],
            uploading: false,
            uploadProgress: {},
            successfullUploaded: false,
            fileStatus: false,
            SUBMISSION_ID: this.props.submission_id,
        };

        this.onFilesAdded = this.onFilesAdded.bind(this);
        this.uploadFiles = this.uploadFiles.bind(this);
        this.sendRequest = this.sendRequest.bind(this);
        this.renderActions = this.renderActions.bind(this);
        this.hideUploadComponent = this.hideUploadComponent.bind(this);
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
                        src="/images/baseline-check_circle_outline-24px.svg"
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
        if (this.state.successfullUploaded) {
            return (
                <Fragment>
                    <Grid item xs={3}>
                        <button
                            onClick={() =>
                                this.setState({ files: [], successfullUploaded: false })
                            }>
                            Clear
                    </button>
                    </Grid>
                    <Grid item xs={3}>
                        <button onClick={this.hideUploadComponent}>
                            Complete
                        </button>
                    </Grid>
                </Fragment>
            );
        } else {
            return (
                <Fragment>
                    <Grid item xs={3}>
                        <button
                            disabled={this.state.files.length <= 0 || this.state.uploading}
                            onClick={this.uploadFiles}>
                            Upload File
                    </button>
                    </Grid>
                    <Grid item xs={3}>
                        <button
                            disabled={this.state.files.length <= 0 || this.state.uploading}
                            onClick={() =>
                                this.setState({ files: [], successfullUploaded: false })
                            }>
                            Clear
                    </button>
                    </Grid>
                </Fragment>
            );
        }
    }

    hideUploadComponent() {
        window.location.reload();
    }


    async uploadFiles() {
        this.setState({ uploadProgress: {}, uploading: true });
        const promises = [];
        this.state.files.forEach(file => {
            promises.push(this.sendRequest(file));
            console.log('** File Name: ' + file.name);
        });

        try {
            await Promise.all(promises);
            this.setState({ successfullUploaded: true, uploading: false });

        } catch (e) {
            // TODO: Add error handling for file upload failure
            this.setState({ successfullUploaded: false, uploading: false });
            console.log('** File upload error: ' + e);
        }
    }

    sendRequest(file) {
        return new Promise((resolve, reject) => {
            const req = new XMLHttpRequest();

            req.upload.addEventListener("progress", event => {
                if (event.lengthComputable) {
                    const copy = { ...this.state.uploadProgress };
                    copy[file.name] = {
                        state: "pending",
                        percentage: (event.loaded / event.total) * 100
                    };
                    this.setState({ uploadProgress: copy });
                }
            });

            req.upload.addEventListener("load", event => {
                const copy = { ...this.state.uploadProgress };
                copy[file.name] = { state: "done", percentage: 100 };
                this.setState({ uploadProgress: copy });
                resolve(req.response);
            });

            req.upload.addEventListener("error", event => {
                const copy = { ...this.state.uploadProgress };
                copy[file.name] = { state: "error", percentage: 0 };
                this.setState({ uploadProgress: copy });
                reject(req.response);
            });

            const formData = new FormData();
            formData.append("file", file);
            console.log("** Upload Filename: ", file.name);

            // TODO: Before posting file, check if any previous files exist
            // and delete since file upload versioning is not implemented

            // Post file to GWAS Backend app
            let file_upload_url = UPLOAD_TEMPLATE_URL_BASE + "submissions/" + this.state.SUBMISSION_ID + "/uploads";
            req.open("POST", file_upload_url);
            req.send(formData);
        });
    }


    render() {
        return (
            <div style={{ padding: 24 }}>
                <Grid item xs={12}
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
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

            // <div className="Upload">
            //     {/* <span className="Title">Upload Files</span> */}
            //     <div className="Content">
            //         <div>
            //             <Dropzone
            //                 onFilesAdded={this.onFilesAdded}
            //                 disabled={this.state.uploading || this.state.successfullUploaded}
            //             />
            //         </div>
            //         <div className="Files">
            //             {this.state.files.map(file => {
            //                 return (
            //                     <div key={file.name} className="Row">
            //                         <span className="Filename">{file.name}</span>
            //                         {this.renderProgress(file)}
            //                     </div>
            //                 );
            //             })}
            //         </div>
            //     </div>
            //     <div className="Actions">{this.renderActions()}</div>
            // </div>
        );
    }
}

export default Upload
