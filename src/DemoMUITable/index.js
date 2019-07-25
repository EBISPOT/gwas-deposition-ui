import React from 'react';
import MaterialTable from 'material-table';


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

export default function MaterialTableDemo() {
    // setState only used with editable options 
    // const [state, setState] = React.useState({
    const [state] = React.useState({
        columns: [
            { title: 'Publication ID', field: 'publicationId', type: 'numeric' },
            { title: 'PMID', field: 'pmid', type: 'numeric' },
            { title: 'First author', field: 'firstAuthor' },
            { title: 'Publication', field: 'title' },
            { title: 'Journal', field: 'journal' },
            { title: 'Status', field: 'status' }
        ],
        data: [
            { publicationId: 1, pmid: 12345678, firstAuthor: 'Smith A.', title: 'An awesome paper...', journal: 'Just GWAS Journal', status: 'eligible' },
            {
                publicationId: 2,
                pmid: 9012345,
                firstAuthor: 'Jones B.',
                title: 'A great paper...',
                journal: 'Nature',
                status: 'eligible'
            },
        ],
    });

    return (
        <MaterialTable
            icons={tableIcons}
            title="Demo Publication table"
            columns={state.columns}
            data={state.data}
        // editable={{
        //     onRowAdd: newData =>
        //         new Promise(resolve => {
        //             setTimeout(() => {
        //                 resolve();
        //                 const data = [...state.data];
        //                 data.push(newData);
        //                 setState({ ...state, data });
        //             }, 600);
        //         }),
        //     onRowUpdate: (newData, oldData) =>
        //         new Promise(resolve => {
        //             setTimeout(() => {
        //                 resolve();
        //                 const data = [...state.data];
        //                 data[data.indexOf(oldData)] = newData;
        //                 setState({ ...state, data });
        //             }, 600);
        //         }),
        //     onRowDelete: oldData =>
        //         new Promise(resolve => {
        //             setTimeout(() => {
        //                 resolve();
        //                 const data = [...state.data];
        //                 data.splice(data.indexOf(oldData), 1);
        //                 setState({ ...state, data });
        //             }, 600);
        //         }),
        // }}
        />
    );
}
