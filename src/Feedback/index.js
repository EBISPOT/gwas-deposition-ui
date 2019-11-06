import React from 'react';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
    feedback: {
        top: `45%`,
        height: 100,
        width: 55,
        position: 'fixed',
        right: -2,
    },
    feedbackButton: {
        textTransform: 'none',
        backgroundColor: 'black',
        outline: 'none',
        verticalAlign: 'top',
        marginTop: 23,
        width: 80,
        height: 30,
        transform: `rotate(-90deg)`,
    },
    link: {
        color: 'white',
        textDecoration: 'none',
    }
}));

export default function Feedback() {
    const classes = useStyles();

    return (
        <div className={classes.feedback}>
            <button target="_blank" className={classes.feedbackButton}>
                <a href="mailto:gwas-info@ebi.ac.uk" className={classes.link}>feedback</a>
            </button>
        </div>
    );
}


