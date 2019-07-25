import React from "react";
// import ReactDOM from "react-dom";
import { CircularProgress, Typography } from '@material-ui/core';
import MUIDataTable from "mui-datatables";


const GET_PUBLICATIONS_URL = process.env.REACT_APP_LOCAL_BASE_URI + '/publications?';


class Example extends React.Component {

    state = {
        page: 0,
        count: 1,
        data: [["Loading Data..."]],
        isLoading: false
    };

    componentDidMount() {
        this.getData();
    }

    // Get data to display
    getData = () => {
        this.setState({ isLoading: true });
        // this.xhrRequest().then(res => {
        //     this.setState({ data: res.data, isLoading: false, count: res.total });
        // });
        new Promise((resolve, reject) => {
            let url = GET_PUBLICATIONS_URL
            // url += 'size=' + query.pageSize
            // url += '&page=' + (query.page)
            fetch(url)
                .then(response => response.json())
                .then(result => {
                    resolve({
                        data: result,
                        page: result.page.number,
                        totalCount: result.page.totalElements,
                    })
                    this.setState({
                        // data: result,
                        data: result._embedded.publications.map(row => ([row.publicationId, row.pmid, row.title, row.journal, row.firstAuthor, row.status])),
                        isLoading: false,
                        count: result.page.totalElements
                    });
                    console.log("** Data: ", result._embedded.publications.map(row =>
                        ([row.publicationId, row.pmid, row.title, row.journal, row.fristAuthor, row.status])));
                })
        })
    }

    // mock async function
    // xhrRequest = () => {
    //     return new Promise((resolve, reject) => {
    //         const total = 124;  // mock record count from server
    // mock page data
    // const srcData = [
    //     ["Gabby George", "Business Analyst", "Minneapolis"],
    //     ["Aiden Lloyd", "Business Consultant", "Dallas"],
    //     ["Jaden Collins", "Attorney", "Santa Ana"],
    //     ["Franky Rees", "Business Analyst", "St. Petersburg"],
    //     ["Aaren Rose", "Business Analyst", "Toledo"]
    // ];

    //         const maxRound = Math.floor(Math.random() * 2) + 1;
    //         const data = [...Array(maxRound)].reduce(acc => acc.push(...srcData) && acc, []);
    //         data.sort((a, b) => 0.5 - Math.random());

    //         setTimeout(() => {
    //             resolve({
    //                 data, total
    //             });
    //         }, 2500);

    //     });
    // }

    changePage = (page) => {
        this.setState({
            isLoading: true,
        });

        new Promise((resolve, reject) => {
            let url = `http://193.62.54.159/backend/v1/publications?page=${page}`
            fetch(url)
                .then(response => response.json())
                .then(result => {
                    // result.sort((a, b) => 0.5 - Math.random());
                    resolve({
                        data: result,
                        page: result.page.number,
                        totalCount: result.page.totalElements,
                    })
                    this.setState({
                        data: result._embedded.publications.map(row => ([row.publicationId, row.pmid, row.title, row.journal, row.firstAuthor, row.status])),
                        isLoading: false,
                        count: result.page.totalElements
                    });
                    console.log("** Data: ", result._embedded.publications.map(row =>
                        ([row.publicationId, row.pmid, row.title, row.journal, row.fristAuthor, row.status])));
                })
        })
        console.log("** Page: ", page);
    };


    /**
     * Sort columns - TEST
     * https://github.com/gregnb/mui-datatables/issues/468
     * See: https://codesandbox.io/s/rw42z4lw7n for working example
     */
    sortChange = (column, order) => {
        console.log("** Trying to Sort data...");
        this.setState({
            isLoading: true,
        });

        let temp = {};
        temp.column = column;
        temp.order = order;
        temp.page = this.state.page;

        // this.xhrRequest(temp).then(data => {
        //     this.setState({
        //         data
        //     });
        // });
        new Promise((resolve, reject) => {
            let url = GET_PUBLICATIONS_URL
            fetch(url)
                .then(response => response.json())
                .then(result => {

                    // SORTING CODE
                    var srcData = result._embedded.publications.map(row => ([row.publicationId, row.pmid, row.title, row.journal, row.firstAuthor, row.status]));
                    console.log("** srcData:", srcData);

                    var offset = temp.page * 10;
                    var data = [];

                    if (order != "") {
                        if (order === "asc") {
                            console.log(2);
                            var tempData = srcData.sort((a, b) => {
                                return a[3] - b[3];
                            });

                            data =
                                offset + 10 >= srcData.length
                                    ? tempData.slice(offset, srcData.length)
                                    : tempData.slice(offset, offset + 10);
                        } else {
                            tempData = srcData.sort((a, b) => {
                                return b[3] - a[3];
                            });

                            data =
                                offset + 10 >= srcData.length
                                    ? tempData.slice(offset, srcData.length)
                                    : tempData.slice(offset, offset + 10);
                            console.log("** DESC Sorted data: ", data);
                        }
                    } else {
                        data =
                            offset + 10 >= srcData.length
                                ? srcData.slice(offset, srcData.length)
                                : srcData.slice(offset, offset + 10);
                    }


                    resolve({
                        data: result,
                        page: result.page.number,
                        totalCount: result.page.totalElements,
                    })
                    this.setState({
                        // data: result._embedded.publications.map(row => ([row.publicationId, row.pmid, row.title, row.journal, row.firstAuthor, row.status])),
                        data: data,
                        isLoading: false,
                        count: result.page.totalElements
                    });
                    console.log("** Data-Sorted: ", result._embedded.publications.map(row =>
                        ([row.publicationId, row.pmid, row.title, row.journal, row.fristAuthor, row.status])));
                })
        })
    };


    render() {

        // const columns = ["Name", "Title", "Location"];
        const columns = ['Publication ID', 'PMID', 'First author', 'Publication', 'Journal', 'Status'];
        const { data, page, count, isLoading } = this.state;

        const options = {
            filter: true,
            filterType: 'dropdown',
            responsive: 'stacked',
            serverSide: true,
            count: count,
            page: page,
            sort: true,
            rowsPerPageOptions: [10, 20, 50],
            print: false,  // added to prevent warning
            onTableChange: (action, tableState) => {

                console.log(action, tableState);
                // a developer could react to change on an action basis or
                // examine the state as a whole and do whatever they want

                switch (action) {
                    case 'changePage':
                        this.changePage(tableState.page);
                        break;
                    default:
                    // do nothing, required for linting
                }
            },

            onColumnSortChange: (changedColumn, direction) => {
                let order = "desc";
                if (direction === "ascending") {
                    order = "asc";
                }
                console.log("column=" + changedColumn + ", direction=" + order);

                this.sortChange(changedColumn, order);
            }
        };
        return (
            <div>
                <MUIDataTable title={<Typography variant="inherit">
                    GWAS Remote Publication Data
                    {isLoading && <CircularProgress size={24} style={{ marginLeft: 15, position: 'relative', top: 4 }} />}
                </Typography>
                } data={data} columns={columns} options={options} />
            </div>
        );

    }
}

// ReactDOM.render(<Example />, document.getElementById("app-root"));
export default Example;
