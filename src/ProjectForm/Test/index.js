import React from 'react';
import ProjectForm from '../Form';
import { Typography } from '@material-ui/core';

import history from "../../history";
import Publications from "../../Publications";

const test = (props) => {
    return (
        <div>
            {props.answer1 === 'Yes' && (
                // <Typography>
                //     Show form to search for PMID
                // </Typography>
                <Publications />
            )}

            {props.answer1 === 'No' && (
                <Typography>
                    Show form to add Manuscript
                </Typography>
            )}

            {props.answer2 === 'Yes' && (
                <Typography>
                    Show form for published manuscript accepted for publication
                </Typography>
                // <ProjectForm />
            )}
        </div>
    )
}
export default test;
