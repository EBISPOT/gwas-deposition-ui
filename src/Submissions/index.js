import React, { Component } from 'react';
import MaterialTable, { MTableToolbar } from 'material-table';
import { Link } from 'react-router-dom'
import { forwardRef } from 'react';
import ElixirAuthService from '../ElixirAuthService';
import history from "../history";
import './submissions.css';

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
import { Grid, Paper, TextField, Container, InputAdornment } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';


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

const GET_SUBMISSIONS_URL = process.env.REACT_APP_LOCAL_BASE_URI + 'submissions';

const styles = theme => ({
    textField: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(3),
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 410,
        verticalAlign: 'inherit',
    },
    noResultsTextStyle: {
        fontSize: 18,
    },
    title: {
        fontSize: '1.25rem',
        paddingLeft: theme.spacing(3),
    },
    button: {
        border: 'none',
        color: 'rgba(0, 0, 0, 0.54)',
        backgroundColor: 'inherit',
    },
    Container: {
        padding: 0,
    },
    table: {
        zDepthShadows: 'none',
        fontColor: 'red',
    },
});

const CustomMTableToolbar = withStyles({
    root: {
        minHeight: 8,
    }
})(MTableToolbar);


class Submissions extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = ({
            value: '',
            searchValue: '',
        });

        this.handleChange = this.handleChange.bind(this);
        this.auth = this.getToken.bind(this);
        this.ElixirAuthService = new ElixirAuthService();
    }

    tableRef = React.createRef();

    // Get text input value
    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    clearSearchInput = () => {
        // clear value
        this.setState({
            value: '',
            searchValue: '',
        })

        // refresh table
        if (this.tableRef.current) {
            this.tableRef.current.onQueryChange();
        }
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

    transformDateFormat(timestamp) {
        let formattedTimestamp = new Date(timestamp);
        formattedTimestamp = formattedTimestamp.getFullYear() + "-" + (formattedTimestamp.getMonth() + 1) + "-" + formattedTimestamp.getDate()
        return formattedTimestamp
    }

    transformStatusLabel(status) {
        if (status === 'CURATION_COMPLETE') {
            return 'SUBMITTED'
        }
        else {
            return status
        }
    }

    handleFirstAuthor(submissions) {
        // added specific firstAuthor field for submissions JSON that encapsulates
        // firstAuthors from Pub and BoW objects to enable sorting
        submissions.forEach(item => {
            if (item.publication) item.firstAuthor = item.publication.firstAuthor
            // noticed that some BoWs do not have first author
            else if (item.bodyOfWork.firstAuthor) item.firstAuthor = item.bodyOfWork.firstAuthor.lastName + ' ' + item.bodyOfWork.firstAuthor.firstName.charAt(0)
            else item.firstAuthor = 'NA'
        })
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const { classes } = this.props;

        let { searchValue } = this.state;
        let searchTextValue = searchValue.trim();
        const tableHeaderStyle = '1px dashed gray';

        return (
            <Container maxWidth="xl" className={classes.Container}>
                <MaterialTable
                    tableRef={this.tableRef}
                    icons={tableIcons}
                    title="My Submissions"
                    columns={[
                        {
                            title: 'PMID', field: 'publication.pmid', sorting: true,
                            render: rowData => {
                                if (!rowData.publication) { return 'NA' }
                                else { return rowData.publication.pmid }
                            }
                        },
                        {
                            title: <div className="tooltip" style={{ borderBottom: tableHeaderStyle }}>GCP ID
                                <span className="tooltiptext">Unique identifier for the Body of Work.</span></div>,
                            field: 'bodyOfWork.bodyOfWorkId', sorting: true,
                            render: rowData => {
                                if (!rowData.bodyOfWork) { return 'NA' }
                                else {
                                    return <Link to={{
                                        pathname: `${process.env.PUBLIC_URL}/bodyofwork/${rowData.bodyOfWork.bodyOfWorkId}`,
                                        state: { submissionId: rowData.submissionId }
                                    }}
                                        style={{ textDecoration: 'none' }}>{rowData.bodyOfWork.bodyOfWorkId}
                                    </Link>
                                }
                            }
                        },
                        {
                            title: <div className="tooltip" style={{ borderBottom: tableHeaderStyle }}>Submission ID
                                <span className="tooltiptext">Unique identifier for submission.</span></div>,
                            field: 'submissionId',
                            render: rowData => (<Link to={{
                                pathname: `${process.env.PUBLIC_URL}/submission/${rowData.submissionId}`, state: { submissionId: rowData.submissionId }
                            }} style={{ textDecoration: 'none' }}>{rowData.submissionId}</Link>)
                        },
                        {
                            title: 'First author', field: 'firstAuthor', sorting: true,
                            render: rowData => (rowData.firstAuthor)
                        },
                        {
                            title: <div className="tooltip" style={{ borderBottom: tableHeaderStyle }}>
                                Submission Status
                                <span className="tooltiptext">Overall status of the submission.</span></div>,
                            field: 'submission_status', sorting: true,
                            render: rowData => (this.transformStatusLabel(rowData.submission_status))
                        },
                        {
                            title: <div className="tooltip" style={{ borderBottom: tableHeaderStyle }}>
                                Metadata Status
                                <span className="tooltiptext">Validation status of the template metadata.</span></div>,
                            field: 'metadata_status', sorting: true
                        },
                        {
                            title: <div className="tooltip" style={{ borderBottom: tableHeaderStyle }}>
                                Summary statistics Status
                                <span className="tooltiptext">Validation status of the summary statistics files.</span></div>,
                            field: 'summary_statistics_status', sorting: true
                        },
                        { title: 'Submitter', field: 'created.user.name', sorting: true },
                        {
                            title: <div className="tooltip" style={{ borderBottom: tableHeaderStyle }}>
                                Date submission last updated
                                <span className="tooltiptext">YYYY-MM-DD</span></div>,
                            field: 'lastUpdated.timestamp', sorting: true, defaultSort: 'desc',
                            render: rowData => (this.transformDateFormat(rowData.lastUpdated.timestamp))
                        },
                        {
                            title: <div className="tooltip" style={{ borderBottom: tableHeaderStyle }}>
                                Date submission started
                                <span className="tooltiptext">YYYY-MM-DD</span></div>,
                            field: 'created.timestamp', sorting: true, defaultSort: 'desc',
                            render: rowData => (this.transformDateFormat(rowData.created.timestamp))
                        },
                    ]}
                    data={query =>
                        new Promise((resolve, reject) => {

                            this._isMounted = true;

                            // Re-set search page for new query
                            if (query.search !== searchTextValue) {
                                query.page = 0
                            }

                            // Replace search text value in Query object with input from TextField
                            query.search = searchTextValue;

                            let url = GET_SUBMISSIONS_URL

                            let myHeaders = new Headers();
                            myHeaders.append('Authorization', 'Bearer ' + this.auth());

                            // Handle search by PMID
                            let onlyNumbers = /^\d+$/;

                            if (query.search) {
                                if (onlyNumbers.test(query.search)) {
                                    url += '?pmid=' + query.search
                                    fetch(url, {
                                        headers: myHeaders
                                    })
                                        .then(response => response.json())
                                        .then(result => {
                                            if (this._isMounted) {
                                                this.handleFirstAuthor(result._embedded.submissions)
                                                resolve({
                                                    data: result._embedded.submissions,
                                                    page: result.page.number,
                                                    totalCount: result.page.totalElements,
                                                })
                                            }
                                        }).catch(error => {
                                        })
                                }
                                // Handle search by GCP ID
                                const GCP_PREFIX = 'GCP';
                                if (query.search.includes(GCP_PREFIX)) {
                                    url += '?bowId=' + query.search
                                    fetch(url, {
                                        headers: myHeaders
                                    })
                                        .then(response => response.json())
                                        .then(result => {
                                            if (this._isMounted) {
                                                this.handleFirstAuthor(result._embedded.submissions)
                                                resolve({
                                                    data: result._embedded.submissions,
                                                    page: result.page.number,
                                                    totalCount: result.page.totalElements,
                                                })
                                            }
                                        }).catch(error => {
                                        })
                                }
                                // Handle search by SubmissionID
                                else {
                                    url += '/' + query.search
                                    fetch(url, {
                                        headers: myHeaders
                                    })
                                        .then(response => response.json())
                                        .then(result => {
                                            if (this._isMounted) {
                                                if (result.publication) result.firstAuthor = result.publication.firstAuthor
                                                else if (result.bodyOfWork.firstAuthor) result.firstAuthor = result.bodyOfWork.firstAuthor.lastName + ' ' + result.bodyOfWork.firstAuthor.firstName.charAt(0)
                                                else result.firstAuthor = 'NA'
                                                resolve({
                                                    data: [result],
                                                    page: 0,
                                                    totalCount: 1,
                                                })
                                            }
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
                                    // NOTE: Server-side Sorting for submissions is only supported for submissionId
                                    url += '&sort=' + query.orderBy.field + ',' + sortOrder
                                }

                                fetch(url, {
                                    headers: myHeaders
                                })
                                    .then(response => response.json())
                                    .then(result => {
                                        if (this._isMounted) {
                                            this.handleFirstAuthor(result._embedded.submissions)
                                            resolve({
                                                data: result._embedded.submissions,
                                                page: result.page.number,
                                                totalCount: result.page.totalElements,
                                            })
                                        }
                                    }).catch(error => {
                                    })
                            }
                            setTimeout(() => {
                                if (this._isMounted) {
                                    resolve({
                                        data: [],
                                        page: 0,
                                        totalCount: 0,
                                    });
                                }
                            }, 5000);
                        })
                    }
                    components={{
                        Container: props => <Paper {...props} elevation={0} square />,
                        Toolbar: props => (
                            <div>
                                <CustomMTableToolbar {...props} />
                                <Grid container
                                    direction="row"
                                    justify="space-between"
                                    alignItems="center">
                                    <Grid item className={classes.title}>
                                        My Submissions
                                    </Grid>
                                    <Grid item>
                                        <TextField
                                            autoFocus
                                            id="search-submission"
                                            name="searchInput"
                                            value={this.state.value}
                                            className={classes.textField}
                                            placeholder="Search by PMID, GCP ID, or Submission ID"
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                                                endAdornment: <InputAdornment position="end">
                                                    <button label="Clear" className={classes.button} onClick={this.clearSearchInput} >
                                                        <ClearIcon />
                                                    </button>
                                                </InputAdornment>
                                            }}

                                            onChange={this.handleChange}

                                            onKeyPress={(event) => {
                                                if (event.key === 'Enter') {
                                                    event.preventDefault();
                                                    this.setState({ value: event.target.value, searchValue: event.target.value });
                                                    this.tableRef.current && this.tableRef.current.onQueryChange();
                                                }
                                            }}
                                        />

                                    </Grid>
                                </Grid>
                            </div>
                        ),
                    }}
                    options={{
                        search: false,
                        showTitle: false,
                        pageSize: 10,
                        pageSizeOptions: [10, 20, 50],
                        sorting: true,
                    }}
                />
            </Container>
        )
    }
}

Submissions.propTypes = {
    classes: PropTypes.object.isRequired,
};
Submissions = withStyles(styles)(Submissions)

export default (Submissions);
