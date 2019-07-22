import axios from 'axios';

const DOWNLOAD_TEMPLATE_URL = process.env.REACT_APP_TEMPLATE_DOWNLOAD_API_URL;


class APIClient {
    constructor(accessToken) {
        this.accessToken = accessToken;
    }

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
}

export default APIClient;
