import React, { Fragment, useEffect } from 'react';
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import { Grid, Paper, Typography, Button } from '@material-ui/core';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

import question_data from '../Questions/questions.json';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
// import FormLabel from '@material-ui/core/FormLabel';
import { green } from '@material-ui/core/colors';
import history from "../../history";


const allQuestions = question_data.questions;

const useStyles = makeStyles(theme => ({
    root: {
        minWidth: 400,
        maxWidth: 400,
        flexGrow: 1,
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        height: 50,
        paddingLeft: theme.spacing(4),
        backgroundColor: theme.palette.background.default,
    },
    img: {
        height: 255,
        maxWidth: 400,
        overflow: 'hidden',
        display: 'block',
        width: '100%',
    },
    radioButton: {
        color: green[400],
        '&$checked': {
            color: green[600],
        },
    },
}));

const GreenRadio = withStyles({
    root: {
        color: "primary",
        '&$checked': {
            color: "rgb(57, 138, 150);",
        },
    },
    checked: {},
})(props => <Radio color="default" {...props} />);


export default function TextMobileStepper(props) {
    const classes = useStyles();
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);
    const maxSteps = allQuestions.length;
    const LAST_QUESTION_ID = allQuestions.length - 1;

    const [answer0, setAnswer0State] = React.useState('');
    const [answer1, setAnswer1State] = React.useState('');
    const [answer2, setAnswer2State] = React.useState('');
    const [answer3, setAnswer3State] = React.useState('');
    const [answer4, setAnswer4State] = React.useState('');
    const [answer5, setAnswer5State] = React.useState('');


    const handleNext = () => {
        if (allQuestions[activeStep].next_question_id[value] === undefined) {
            alert("Must answer question")
        }
        else {
            setActiveStep(prevActiveStep => allQuestions[activeStep].next_question_id[value]);

            // console.log("Active Step: ", activeStep);
            // console.log("Next Step: ", allQuestions[activeStep].next_question_id[value]);
            // console.log("Ans: ", value, typeof (value));

            setValue('-- clear --'); // clear value so no radio button is selected on Next
            // console.log("-------------");
        }
    };

    const handleBack = () => {
        setActiveStep(prevActiveStep => 0);
        // TODO: Check other steps and clearing state
        // Clear state when re-setting questions
        // if (activeStep === LAST_QUESTION_ID) {
        setAnswer0State('')
        setAnswer1State('')
        setAnswer2State('')
        setAnswer3State('')
        setAnswer4State('')
        setAnswer5State('')
        // }
    };

    const [value, setValue] = React.useState('Initial');

    const handleChange = event => {
        setValue(event.target.value);

        // Set answer state for current question
        if (activeStep < LAST_QUESTION_ID) {
            getAnswerSetState(activeStep)(event.target.value);
        }
    };
    // console.log("Current Step: ", activeStep);
    // console.log("Selected value: ", value);
    // console.log("Answers: ", answer0, answer1, answer2, answer3, answer4, answer5);
    // console.log("Ans: ", typeof (answer0), answer0);

    function getAnswerSetState(activeStep) {
        switch (activeStep) {
            case 0:
                return setAnswer0State;
            case 1:
                return setAnswer1State;
            case 2:
                return setAnswer2State;
            case 3:
                return setAnswer3State;
            case 4:
                return setAnswer4State;
            case 5:
                return setAnswer5State
            default:
                console.log('Unknown step');
                return 'Unknown step';
        }
    }

    // Manage which form to display depending on the answers
    useEffect(() => {
        if (answer1 === 'Yes') {
            history.replace(`${process.env.PUBLIC_URL}/curation_queue`)
        }
        if (answer1 === 'No') {
            // Show form fields for published, not yet indexed in PubMed fields
            history.replace({
                pathname: `${process.env.PUBLIC_URL}/form`,
                state: {
                    id: 1,
                    answer: 'No'
                },
            })
        }
        if (answer2 === 'Yes') {
            // Show form fields for manuscript accepted or submitted
            history.replace({
                pathname: `${process.env.PUBLIC_URL}/form`,
                state: {
                    id: 2,
                    answer: 'Yes'
                }
            })
        }
        if (answer3 === 'Yes') {
            // Show form for preprint manuscript
            history.replace({
                pathname: `${process.env.PUBLIC_URL}/form`,
                state: {
                    id: 3,
                    answer: 'Yes'
                }
            })
        }
        if (answer4 === 'Yes') {
            // Show form for draft manuscript
            history.replace({
                pathname: `${process.env.PUBLIC_URL}/form`,
                state: {
                    id: 4,
                    answer: 'Yes'
                }
            })
        }
        if (answer4 === 'No') {
            // Show form for no manuscript
            history.replace({
                pathname: `${process.env.PUBLIC_URL}/form`,
                state: {
                    id: 4,
                    answer: 'No'
                }
            })
        }
    })

    let mobile_stepper_navigation =
        <MobileStepper
            steps={maxSteps}
            position="static"
            variant="progress"
            activeStep={activeStep}
            nextButton={
                <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
                    Next
                        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                </Button>
            }
            backButton={
                <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                    {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                    Back
                    </Button>
            }
        />


    return (
        <Fragment>
            <Grid container
                direction="column"
                justify="center"
                alignItems="center"
                spacing={2}>
                <Grid item xs={12}>
                    <Paper square elevation={0} className={classes.header}>
                        <Typography>{allQuestions[activeStep].question}</Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <FormControl component="fieldset">
                        {/* <FormLabel component="legend">{allQuestions[activeStep].question}</FormLabel> */}
                        <RadioGroup aria-label="position" name="position" row
                            value={value}
                            onChange={handleChange}
                        // onChange={props.changedAnswers && handleChange}
                        // onChange={(e) => handleChange(props.changedAnswers, e)}
                        // onChange={props.changedAnswers}
                        >
                            <FormControlLabel
                                value={allQuestions[activeStep].answer[0]}
                                label={allQuestions[activeStep].answer[0]}
                                control={<GreenRadio />}
                                labelPlacement="start"
                            />

                            <FormControlLabel
                                value={allQuestions[activeStep].answer[1]}
                                label={allQuestions[activeStep].answer[1]}
                                labelPlacement="start"
                                control={<GreenRadio />}
                            />
                        </RadioGroup>
                    </FormControl>
                </Grid>

                <Grid item xs={12} className={classes.root}>
                    {mobile_stepper_navigation}
                </Grid>

            </Grid>
        </Fragment>
    );
}
