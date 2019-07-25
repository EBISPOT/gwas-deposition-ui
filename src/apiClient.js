import axios from 'axios';

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
     * API call to template services app to download template
     * @return {File} Metadata template file
     */
    downloadTemplate() {
        axios.post(DOWNLOAD_TEMPLATE_URL, { data: null },
            {
                headers:
                {
                    'Content-Disposition': "attachment; filename=template.xlsx",
                    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
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
     * API call to backend app to get publications
     */
    getPublications() {
        return this.perform('get', '/publications');
    }

    /**
     * API call to backend app to create a submission
     *  @param {String} pmid PubMedId
     */
    createSubmission(pmid) {
        console.log("** Trying to create a submission...")
        axios.post(BASE_URI + 'submissions',
            {
                data: { 'publication': { 'pmid': 'Ts9ZuSWVFA' } },
                headers:
                {
                    'Accept': "application/json",
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*"
                },
            }).then((response) => { console.log("** Response: ", response) })
            .catch((error) => console.log(error));
    }


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
