import React from "react";
import ReactDOM from "react-dom";
import MUIDataTable from "mui-datatables";

class DemoMUIDT_Remote extends React.Component {
    state = {
        page: 0,
        count: 100,
        data: []
    };

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        this.xhrRequest().then(data => {
            this.setState({ data });
        });
    };

    // mock async function
    xhrRequest = url => {
        let page = 0;
        let order = "";
        let column = "";
        if (url != undefined) {
            page = url.page;
            order = url.order;
            column = url.column;
        }

        return new Promise((resolve, reject) => {
            const srcData = [
                ["Gabby George", "Business Analyst", "Minneapolis", 10, "$210,000"],
                ["Aiden Lloyd", "Business Consultant", "Dallas", 13, "$250,000"],
                ["Jaden Collins", "Attorney", "Santa Ana", 20, "$310,000"],
                ["Franky Rees", "Business Analyst", "St. Petersburg", 31, "$290,000"],
                ["Aaren Rose", "Business Analyst", "Toledo", 61, "$510,000"],
                [
                    "Frankie Parry",
                    "Agency Legal Counsel",
                    "Jacksonville",
                    71,
                    "$210,000"
                ],
                ["Lane Wilson", "Commercial Specialist", "Omaha", 19, "$65,000"],
                ["Robin Duncan", "Business Analyst", "Los Angeles", 20, "$77,000"],
                ["Mel Brooks", "Business Consultant", "Oklahoma City", 37, "$135,000"],
                ["Harper White", "Attorney", "Pittsburgh", 52, "$420,000"],
                ["Kris Humphrey", "Agency Legal Counsel", "Laredo", 30, "$150,000"],
                ["Frankie Long", "Industrial Analyst", "Austin", 31, "$170,000"],
                ["Brynn Robbins", "Business Analyst", "Norfolk", 22, "$90,000"],
                ["Justice Mann", "Business Consultant", "Chicago", 24, "$133,000"],
                ["Jesse Welch", "Agency Legal Counsel", "Seattle", 28, "$200,000"],
                ["Eli Mejia", "Commercial Specialist", "Long Beach", 65, "$400,000"],
                ["Gene Leblanc", "Industrial Analyst", "Hartford", 34, "$110,000"],
                ["Danny Leon", "Computer Scientist", "Newark", 60, "$220,000"],
                ["Lane Lee", "Corporate Counselor", "Cincinnati", 52, "$180,000"],
                ["Jesse Hall", "Business Analyst", "Baltimore", 44, "$99,000"],
                ["Danni Hudson", "Agency Legal Counsel", "Tampa", 37, "$90,000"],
                ["Terry Macdonald", "Commercial Specialist", "Miami", 39, "$140,000"],
                ["Justice Mccarthy", "Attorney", "Tucson", 26, "$330,000"],
                ["Silver Carey", "Computer Scientist", "Memphis", 47, "$250,000"],
                ["Franky Miles", "Industrial Analyst", "Buffalo", 49, "$190,000"],
                ["Glen Nixon", "Corporate Counselor", "Arlington", 44, "$80,000"]
            ];

            var offset = page * 10;
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
                    var tempData = srcData.sort((a, b) => {
                        return b[3] - a[3];
                    });

                    data =
                        offset + 10 >= srcData.length
                            ? tempData.slice(offset, srcData.length)
                            : tempData.slice(offset, offset + 10);
                }
            } else {
                data =
                    offset + 10 >= srcData.length
                        ? srcData.slice(offset, srcData.length)
                        : srcData.slice(offset, offset + 10);
            }

            setTimeout(() => {
                resolve(data);
            }, 250);
        });
    };

    changePage = page => {
        let temp = {};
        temp.page = page;

        this.xhrRequest(temp).then(data => {
            this.setState({
                page: page,
                data
            });
        });
    };

    sortChange = (column, order) => {
        let temp = {};
        temp.column = column;
        temp.order = order;
        temp.page = this.state.page;

        this.xhrRequest(temp).then(data => {
            this.setState({
                data
            });
        });
    };

    render() {
        const columns = ["Name", "Title", "Location", "Age", "Salary"];
        const { page, count, data } = this.state;

        const options = {
            filter: true,
            filterType: "dropdown",
            responsive: "stacked",
            serverSide: true,
            count: count,
            page: page,

            onTableChange: (action, tableState) => {
                console.log(action, tableState);
                // a developer could react to change on an action basis or
                // examine the state as a whole and do whatever they want

                switch (action) {
                    case "changePage":
                        this.changePage(tableState.page);
                        break;
                    default:
                    // do nothing
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
            <MUIDataTable
                title={"ACME Employee list"}
                data={data}
                columns={columns}
                options={options}
            />
        );
    }
}

// ReactDOM.render(<App />, document.getElementById("root"));
export default DemoMUIDT_Remote;
