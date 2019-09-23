import React from 'react';
import MaterialTable from 'material-table';
import { Link } from 'react-router-dom';

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
import { doesNotReject } from 'assert';

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

const GET_PUBLICATIONS_URL = process.env.REACT_APP_LOCAL_BASE_URI + 'publications';


class PublicationsMatTable extends React.Component {

    render() {
        const emailContact = <a href="mailto:gwas-info@ebi.ac.uk?subject=Eligibility Review">GWAS Info</a>;
        const noResultsMessage = <span>No results were found. Please email {emailContact} to request an eligbility review of your publication.</span>;

        return (
            <MaterialTable
                icons={tableIcons}
                title="Publications"
                columns={[
                    {
                        title: 'PubMedID', field: 'pmid',
                        render: rowData => (<Link to={{ pathname: `${process.env.PUBLIC_URL}/publication/${rowData.pmid}`, state: { pmid: rowData.pmid } }}
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

                        // Handle search by PubMedID
                        let onlyNumbers = /^\d+$/;

                        if (query.search) {
                            if (onlyNumbers.test(query.search)) {
                                url += '/' + query.search + '?pmid=true'
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
                            // Handle search by Author
                            else {
                                url += '?author=' + query.search
                                url += '&size=' + query.pageSize
                                url += '&page=' + (query.page)

                                // Handle sorting search by Author results
                                if (query.orderBy) {
                                    let sortOrder = query.orderDirection;
                                    url += '&sort=' + query.orderBy.field + ',' + sortOrder
                                }
                                else {
                                    // Sort search by Author results asc by default
                                    // Note: Sorting is supported for only 1 column
                                    url += '&sort=firstAuthor,asc'
                                }

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
                        }
                        // Display all results
                        else {
                            url += '?size=' + query.pageSize
                            url += '&page=' + (query.page)

                            // Handle sorting all results
                            if (query.orderBy) {
                                let sortOrder = query.orderDirection;
                                url += '&sort=' + query.orderBy.field + ',' + sortOrder
                            }

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
                        }, 5000);
                    })
                }
                options={{
                    search: true,
                    pageSize: 10,
                    pageSizeOptions: [10, 20, 50],
                    searchFieldStyle: {
                        width: 350,
                    },
                    debounceInterval: 2500,
                    sorting: true,
                }}
                localization={{
                    toolbar: {
                        searchPlaceholder: 'Search by PubMedID or Author',
                    },
                    body: {
                        emptyDataSourceMessage: noResultsMessage
                    }
                }}
            />
        )
    }
}

export default (PublicationsMatTable);
