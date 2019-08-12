import React from 'react';
import MaterialTable from 'material-table';
import Button from '@material-ui/core/Button';
import API_CLIENT from '../apiClient';
import history from "../history";

import { Link } from 'react-router-dom'

import Container from '@material-ui/core/Container';


import { forwardRef } from 'react';

import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const GET_SUBMISSIONS_URL = process.env.REACT_APP_LOCAL_BASE_URI + '/submissions/';


class Submissions extends React.Component {
    constructor(props) {
        super(props);
        this.API_CLIENT = new API_CLIENT();
    }

    render() {
        return (
            <Container>
                <MaterialTable
                    icons={tableIcons}
                    title="My Submissions"
                    columns={[
                        {
                            title: 'ID', field: 'submissionId',
                            render: rowData => (<Link to={{
                                pathname: `/submission/${rowData.submissionId}`, state: { submissionId: rowData.submissionId }
                            }} style={{ textDecoration: 'none' }}>{rowData.submissionId}</Link>)
                        },
                        { title: 'PMID', field: 'publication.pmid' },
                        { title: 'First author', field: 'publication.firstAuthor' },
                        { title: 'Submission Status', field: 'submission_status' },
                        { title: 'Metadata Status', field: 'metadata_status' },
                        { title: 'Summary statistics Status', field: 'summary_statistics_status' },
                        { title: 'Date submission started', field: 'created.timestamp' },
                        { title: 'Date submitted', field: 'date_submitted' },
                    ]}
                    data={query =>
                        new Promise((resolve, reject) => {

                            let url = GET_SUBMISSIONS_URL

                            // Handle display of search results
                            if (query.search) {
                                url += query.search
                                fetch(url)
                                    .then(response => response.json())
                                    .then(result => {
                                        resolve({
                                            data: [result],
                                            page: 0,
                                            totalCount: 1,
                                        })
                                    }).catch(error => {
                                    })
                            }
                            // Display all results
                            else {
                                url += '?size=' + query.pageSize
                                url += '&page=' + (query.page)

                                fetch(url)
                                    .then(response => response.json())
                                    .then(result => {
                                        resolve({
                                            data: result._embedded.submissions,
                                            page: result.page.number,
                                            totalCount: result.page.totalElements,
                                        })
                                    }).catch(error => {
                                    })
                            }
                            setTimeout(() => {
                                resolve({
                                    data: [],
                                    page: 0,
                                    totalCount: 0,
                                });
                            }, 250);
                        })
                    }
                    options={{
                        search: true,
                        pageSize: 10

                    }}
                    localization={{
                        toolbar: {
                            searchPlaceholder: 'Search by ID',
                        }
                    }}
                />
            </Container>
        )
    }
}

export default (Submissions);
