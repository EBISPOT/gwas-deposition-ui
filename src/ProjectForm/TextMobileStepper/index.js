import React, {Fragment, useEffect} from 'react';
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import {
    Grid,
    Paper,
    Typography,
    Button,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@material-ui/core';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

import question_data from '../Questions/questions.json';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import history from "../../history";


const useStyles = makeStyles(theme => ({
    root: {
        minWidth: 400,
        maxWidth: 400,
        flexGrow: 1,
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing(5),
        paddingRight: theme.spacing(6),
        paddingTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        backgroundColor: theme.palette.background.default,
    },
    questionGrid: {
        marginTop: theme.spacing(2),
        borderColor: '#ccc',
        borderStyle: 'solid',
        borderWidth: 'thin',
        boxShadow: '1px 1px 4px #d9d9d9',
        maxWidth: 500,
    },
    questionText: {
        fontStyle: 'italic',
        wordBreak: 'break-word',
        textAlign: 'center',
    },
}));

const GreenRadio = withStyles({
    root: {
        color: "primary",
        '&$checked': {
            color: "rgb(57, 138, 150)",
        },
    },
    checked: {},
})(props => <Radio color="default" {...props} />);


export default function TextMobileStepper() {
    const classes = useStyles();
    const theme = useTheme();

    const allQuestions = question_data.questions;

    const [activeStep, setActiveStep] = React.useState(0);
    const [value, setValue] = React.useState('-- clear --');
    const [openDialog, setOpenDialog] = React.useState(false);
    const [dialogText, setDialogText] = React.useState('');

    const handleOpenDialog = (text) => {
        setDialogText(text);
        setOpenDialog(true);
    };


    const handleNext = () => {
        const currentQuestion = allQuestions.find(q => q.id === activeStep);
        if (!currentQuestion) return;

        const selectedAnswer = currentQuestion.answers.find(a => a.label === value);

        if (!selectedAnswer) {
            alert("Must answer question");
            return;
        }

        const next = selectedAnswer.next;

        if (!next) {
            alert("No next step defined.");
            return;
        }

        if (next.type === 'question') {
            setActiveStep(next.id);
            setValue('-- clear --');
        } else if (next.type === 'route') {
            history.push({
                pathname: `${process.env.PUBLIC_URL}/${next.path}`,
                state: {
                    id: next.formType,
                    answer: next.formAnswer
                }
            });
        } else if (next.type === 'alert') {
            // alert(next.message);
            handleOpenDialog(next.message);
        }
        else if (next.type === 'jump') {
            setActiveStep(next.jumpTo);
            setValue(next.selectedOnJump);
            if (next.message) alert(next.message);
        }
        else{
            console.warn("Unknown navigation type:", next.type);
        }
    };

    const handleBack = () => {
        const prevQuestion = allQuestions.find(q => q.id === (allQuestions.find(q => q.id === activeStep).prevId));
        setActiveStep(prevQuestion.id);
        setValue(prevQuestion.answers.find(a => a?.next?.id === activeStep)?.label);
    };

    const currentQuestion = allQuestions.find(q => q.id === activeStep);

    if (!currentQuestion) {
        return <Typography>Error: Question not found.</Typography>;
    }

    return (
        <Fragment>
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogContent>
                    <DialogContentText>
                        {dialogText}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>
                        Continue
                    </Button>
                </DialogActions>
            </Dialog>
            <Grid container
                  direction="column"
                  justify="center"
                  alignItems="center"
                  spacing={2}
                  className={classes.questionGrid}
            >
                <Grid item xs={12}>
                    <Paper square elevation={0} className={classes.header}>
                        <Typography className={classes.questionText}>
                            {currentQuestion.question}
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <FormControl component="fieldset">
                        <RadioGroup
                            aria-label="position"
                            name="position"
                            value={value || '-- clear --'}
                            onChange={(event) => setValue(event.target.value)}
                        >
                            {currentQuestion.answers.map((answer, index) => (
                                <FormControlLabel
                                    key={index}
                                    value={answer.label}
                                    label={answer.label}
                                    control={<GreenRadio />}
                                    labelPlacement="end"
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>
                </Grid>

                <Grid item xs={12} className={classes.root}>
                    <MobileStepper
                        steps={6}
                        position="static"
                        variant="progress"
                        activeStep={activeStep%10}
                        nextButton={
                            <Button size="small" onClick={handleNext}>
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
                </Grid>
            </Grid>
        </Fragment>
    );
}
