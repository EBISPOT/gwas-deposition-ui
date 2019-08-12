import React from 'react';
import MaterialTable from 'material-table';
import Button from '@material-ui/core/Button';
import API_CLIENT from '../apiClient';
import history from "../history";

import { Link } from 'react-router-dom'


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

const GET_PUBLICATIONS_URL = process.env.REACT_APP_LOCAL_BASE_URI + '/publications/';


class PublicationsMatTable extends React.Component {
    constructor(props) {
        super(props);
        this.API_CLIENT = new API_CLIENT();
        this.createSubmission = this.createSubmission.bind(this);
    }

    createSubmission(pmid) {
        console.log("** PMID: ", pmid);
        // Get token from local storage
        if (localStorage.getItem('id_token')) {
            let JWTToken = localStorage.getItem('id_token')
            this.API_CLIENT.createSubmission(pmid, JWTToken);
        }
        else {
            alert("Please login to create a submission")
            history.push('/login');
        }
    }

    render() {
        return (
            <MaterialTable
                icons={tableIcons}
                title="Publication List"
                columns={[
                    {
                        // title: 'Avatar',
                        // field: 'avatar',
                        // render: rowData => (
                        //     <img
                        //         style={{ height: 36, borderRadius: '50%' }}
                        //         src={rowData.avatar}
                        //     />
                        // ),
                    },
                    // {
                    //     title: 'Publication ID', field: 'publicationId',
                    //     render: rowData => (<a href={`/submission/${rowData.publicationId}`} >{rowData.publicationId}</a>)
                    // },
                    // { title: 'Publication ID', field: 'publicationId' },
                    // <Link to={`/submission/${row.id}`} style={{ textDecoration: 'none' }}>{row.publication_id}</Link>
                    {
                        title: 'PMID', field: 'pmid',
                        // render: rowData => (<a href={`/publication/${rowData.pmid}`} >{rowData.pmid}</a>)
                        render: rowData => (<Link to={{ pathname: `/publication/${rowData.pmid}`, state: { pmid: rowData.pmid } }}
                            style={{ textDecoration: 'none' }}>{rowData.pmid}</Link>)
                    },
                    { title: 'First author', field: 'firstAuthor' },
                    { title: 'Publication', field: 'title' },
                    { title: 'Journal', field: 'journal' },
                    { title: 'Status', field: 'status' },
                ]}
                data={query =>
                    new Promise((resolve, reject) => {

                        let url = GET_PUBLICATIONS_URL

                        // Handle display of search results
                        if (query.search) {
                            url += query.search + '?pmid=true'
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
                                        data: result._embedded.publications,
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
                actions={[
                    {
                        icon: 'save',
                        tooltip: 'Create submission',
                        // onClick: (event, rowData) => alert("Create submission for: " + rowData.pmid)
                        onClick: (event, rowData) => this.createSubmission(rowData.pmid)
                    }
                ]}
                components={{
                    Action: props => (
                        <Button
                            onClick={(event) => props.action.onClick(event, props.data)}
                            color="inherit"
                            variant="contained"
                            style={{ textTransform: 'none' }}
                            size="small"
                        >
                            My Button
                        </Button>
                    ),
                }}
                localization={{
                    toolbar: {
                        searchPlaceholder: 'Search by PMID',
                    }
                }}
            />
        )
    }
}

export default (PublicationsMatTable);
