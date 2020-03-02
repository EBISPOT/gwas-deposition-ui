import React from 'react';
import ProjectForm from '../Form';
import { Typography } from '@material-ui/core';

const test = (props) => {
    return (
        <div>
            {props.answer0 === 'No' && (
                <ProjectForm />
            )}

            {props.answer0 === 'Yes' && props.answer1 === 'Yes' && (
                <Typography>
                    Show form to enter PMID for published paper
                </Typography>
            )}

            {props.answer2 === 'Yes' && (
                <Typography>
                    Show preprint server form
                </Typography>
            )}
        </div>
    )
}
export default test;
