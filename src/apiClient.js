import axios from 'axios';
import jwt_decode from 'jwt-decode';

const DOWNLOAD_TEMPLATE_URL = process.env.REACT_APP_TEMPLATE_DOWNLOAD_API_URL;

const BASE_URI = process.env.REACT_APP_LOCAL_BASE_URI;

const client = axios.create({
    baseURL: BASE_URI,
    json: true
});

class APIClient {
    constructor(accessToken) {
        this.accessToken = accessToken;
    }

    /**
     * API call to gwas-template-services app to download template
     * @return {File} Metadata template file
     */
    downloadTemplate() {
        var payload;
        var curator_domain = "self.GWAS_Curator";

        // Check for authentication token
        if (localStorage.getItem('id_token')) {
            let token = localStorage.getItem('id_token');

            // Check if user in GWAS_Curator domain
            let decoded_token = jwt_decode(token);

            if (decoded_token.domains.includes(curator_domain)) {
                payload = JSON.stringify({ "curator": true });
            } else {
                payload = JSON.stringify({ "curator": false });
            }
        } else {
            payload = JSON.stringify({ "curator": false });
        }

        axios.post(DOWNLOAD_TEMPLATE_URL, payload,
            {
                headers:
                {
                    'Content-Disposition': "attachment; filename=template.xlsx",
                    'Content-Type': 'application/json'
                },
                responseType: 'arraybuffer',
            }
        ).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'template.xlsx');
            document.body.appendChild(link);
            link.click();
        })
            .catch((error) => console.log(error));
    }


    /**
     * API call to gwas-backend app to 
     * download file for submission
     * TODO: Decide whether to keep this method here
     * or just use directly in Component
     * 
     * @param GET
     * @param {String} submissionId
     * @param {String} fileUploadId
     * @param {String} fileName
     */
    // downloadDataFile(submissionId, fileUploadId, fileName) {
    //     // Name SS default file as "template.xlsx", otherwise use existing filename
    //     if (!fileName) {
    //         fileName = "template.xlsx";
    //     }

    //     axios.get(BASE_URI + 'submissions/' + submissionId + '/uploads/' + fileUploadId + '/download',
    //         {
    //             responseType: 'blob',
    //         }
    //     ).then((response) => {
    //         const url = window.URL.createObjectURL(new Blob([response.data]));
    //         const link = document.createElement('a');
    //         link.href = url;
    //         link.setAttribute('download', fileName);
    //         document.body.appendChild(link);
    //         link.click();
    //     });
    // }


    /**
     * API call to backend app to get all publications
     */
    getPublications() {
        return this.perform('get', '/publications');
    }

    /**
     * Get details for Publication by PMID
     * @param {*} pmid PubMedId
     * @param {*} JWTToken Authorization token
     */
    // TODO: Add JWTToken to Authorization header
    getPublication(pmid) {
        return this.perform('get', '/publications/' + pmid + '?pmid=true');
    }


    /**
     * Get Submission by Id
     * @param {} submissionId
     * @param {*} JWTToken 
     */
    // TODO: Add JWTToken to Authorization header
    getSubmission(submissionId) {
        return this.perform('get', '/submissions/' + submissionId);
    }


    /**
     * Delete file upload
     * @param {*} submissionId
     * @param {*} fileId
     * @param {*} JWTToken
     */
    deleteFileUpload(submissionId, fileId) {
        console.log("** Trying to delete a file...")
        return this.perform('delete', 'submissions/' + submissionId + '/uploads/' + fileId);
    }


    /**
     * API call to backend app to create a submission
     *  @param {String} pmid PubMedId
     *  @param {String} JWTToken Authorization token
     */
    // TODO: Add JWTToken to Authorization header
    createSubmission(pmid, JWTToken) {
        console.log("** Trying to create a submission...")
        let pmid_data = { publication: { pmid: pmid } };
        console.log("** Pub Data: ", pmid_data);

        return axios.post(BASE_URI + 'submissions', pmid_data
            // {
            //     headers:
            //     {
            //         'Authorization': `Bearer ${JWTToken}`
            //     },
            // }
        )
        // WORKS - BUT CATCH ERROR IN COMPONENT TO PROVIDE ALERT DIALOG
        // .then((response) => { console.log(response) })
        //     .catch((error) => {
        //         console.log(error)
        //         return error
        //     });
    }


    /**
     * Get Submission ID from PMID
     * @param {*} pmid
     */
    getSubmissionId(pmid) {
        return axios.get(BASE_URI + 'submissions?pmid=' + pmid)
    }


    /**
     *
     * @param {*} PUT
     * @param {*} submissionId
     * @param {*} JWTToken
     */
    submitSubmission(submissionId) {
        console.log("** Trying to submit a submission...");
        return axios.put(BASE_URI + '/submissions/' + submissionId + '/submit');
    }




    /**
     * Create file upload
     * @param {*} POST
     * @param {*} submissionId
     * @param {*} JWTToken
     * @param {*} File
     */
    // createFileUpload(submissionId) {
    //     console.log("** Trying to upload file...");

    //     return axios.post(BASE_URI + 'submissions/' + submissionId + '/uploads')
    // }




    async perform(method, resource, data) {
        return client({
            method,
            url: resource,
            data,
            // Add after Authentication/Authorization enabled
            // headers: {
            //     Authorization: `Bearer ${this.accessToken}`
            // }
        }).then(resp => {
            return resp.data ? resp.data : [];
        })
    }
}

export default APIClient;
