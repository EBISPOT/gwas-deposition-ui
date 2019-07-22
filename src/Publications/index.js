import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import APIClient from '../apiClient';
import Container from '@material-ui/core/Container';

// import SubmissionDetails from '../SubmissionDetails';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom'


// const useStyles = makeStyles(theme => ({
// TODO: Check if 'styles' is being applied
const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
        overflowX: 'auto',
    },
    table: {
        minWidth: 650,
    },
});

const StyledTableHeaderCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.secondary.light,
        color: theme.palette.common.white,
        fontSize: 14,
        textAlign: 'center',
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableBodyCell = withStyles(theme => ({
    body: {
        fontSize: 14,
        textAlign: 'center',
    },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.tableRowHighlight.main,
        },
    },
}))(TableRow);

// function createData(pmid, title, file_valid_status, data_valid_status, curator) {
//     return { pmid, title, file_valid_status, data_valid_status, curator };
// }

// const rows = [
//     createData('PMID:1234', 'Super GWAS paper', 'In Progress', 'In Progress', 'Test Curator'),
//     createData('PMID:5', 'Super GWAS paper', 'In Progress', 'In Progress', 'Test Curator'),
//     createData('PMID:6', 'Super GWAS paper', 'In Progress', 'In Progress', 'Test Curator'),
//     createData('PMID:7', 'Super GWAS paper', 'In Progress', 'In Progress', 'Test Curator'),
//     createData('PMID:8', 'Super GWAS paper', 'In Progress', 'In Progress', 'Test Curator'),
//     createData('PMID:8', 'Super GWAS paper', 'In Progress', 'In Progress', 'Test Curator'),
// ];


// function SubmissionsTable() {
class Publications extends React.Component {
    // constructor(props) {
    //     super(props)
    // this.state = { isAddTripState: false }
    // this.state = { value: 0 }
    // this.state = { repos: [] }
    // this.state = { submissions: [] }
    // }

    state = {
        value: 0,
        repos: [],
        submissions: [],
        // isAddTripState: false,
        submissionPMID: 0
    };

    async componentDidMount() {
        // const accessToken = await this.props.auth.getAccessToken()
        // this.apiClient = new APIClient(accessToken);
        this.apiClient = new APIClient();
        this.apiClient.getPublications().then((data) =>
            this.setState({ ...this.state, submissions: data })
        );
    }

    // TEST --> Add back later
    // showSubmissionDetails = (Event) => {
    //     const submissionID = Event.currentTarget.getAttribute('data-item');
    //     console.log('Getting submission details page...', submissionID)

    //     // Store submissionID to local storage to access on page refresh
    //     localStorage.setItem("submissionID", submissionID);

    //     this.setState({
    //         ...this.state,
    //         isAddTripState: true,
    //         submissionID: submissionID
    //     })
    // }

    renderRepos = (repos) => {
        console.log(repos._embedded)

        if (!repos) { return [] }

        if (repos._embedded !== undefined) {
            return (
                <Paper className={styles.root}>
                    <Table className={styles.table}>
                        <TableHead>
                            <TableRow>
                                <StyledTableHeaderCell>ID</StyledTableHeaderCell>
                                <StyledTableHeaderCell>PMID</StyledTableHeaderCell>
                                <StyledTableHeaderCell>Title</StyledTableHeaderCell>
                                <StyledTableHeaderCell>Journal</StyledTableHeaderCell>
                                <StyledTableHeaderCell>First Author</StyledTableHeaderCell>
                                <StyledTableHeaderCell>Publication Date</StyledTableHeaderCell>
                                <StyledTableHeaderCell>Status</StyledTableHeaderCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {repos._embedded.publications.map(row => (
                                // <StyledTableRow key={row.id} data-item={row.id} onClick={this.showSubmissionDetails}>
                                <StyledTableRow key={row.publicationId} data-item={row.publicationId} >
                                    <StyledTableBodyCell component="th" scope="row">
                                        <Link to={`/submission/${row.publicationId}`} style={{ textDecoration: 'none' }}>{row.publicationId}</Link>
                                    </StyledTableBodyCell>
                                    <StyledTableBodyCell data-title="ID">{row.pmid}</StyledTableBodyCell>
                                    <StyledTableBodyCell data-title="IVF">{row.title}</StyledTableBodyCell>
                                    <StyledTableBodyCell data-title="IVD">{row.journal}</StyledTableBodyCell>
                                    <StyledTableBodyCell data-title="UserID">{row.firstAuthor}</StyledTableBodyCell>
                                    <StyledTableBodyCell data-title="UserID">{row.publicationDate}</StyledTableBodyCell>
                                    <StyledTableBodyCell data-title="UserID">{row.status}</StyledTableBodyCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            );
        }
    }

    render() {
        return (
            <Router>
                <Container style={{ marginTop: 20 }}>
                    <Route exact={true} path="/" render={() => (
                        <div>
                            {this.renderRepos(this.state.submissions)}
                        </div>
                    )} />

                    {/* <Route path="/submission/:submissionId" render={({ match }) => <SubmissionDetails submissionID={this.state.submissionID} />} /> */}
                </Container>
            </Router>
        );
    }
}

export default withStyles(styles)(Publications);
