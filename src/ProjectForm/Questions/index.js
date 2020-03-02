import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import Button from '@material-ui/core/Button';
// import Paper from '@material-ui/core/Paper';
// import Typography from '@material-ui/core/Typography';

// import Stepper from '@material-ui/core/Stepper';
// import Step from '@material-ui/core/Step';
// import StepLabel from '@material-ui/core/StepLabel';
// import StepContent from '@material-ui/core/StepContent';

// import { Grid } from '@material-ui/core';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import question_data from './questions.json';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
    },
    button: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    actionsContainer: {
        marginBottom: theme.spacing(2),
    },
    resetContainer: {
        padding: theme.spacing(3),
    },
}));

// function getQuestions() {
//     return ['Are these GWAS described in a manuscript?',
//         'Has this manuscript alreay been published?',
//         'Is this manuscript available on a pre-print server?',
//     ];
// }

// function getStepContent(step) {
//     switch (step) {
//         case 0:
//             return `For each ad campaign that you create, you can control how much
//               you're willing to spend on clicks and conversions, which networks
//               and geographical locations you want your ads to show on, and more.`;
//         case 1:
//             return 'An ad group contains one or more ads which target a shared set of keywords.';
//         case 2:
//             return `Try out different ad text to see what brings in the most customers,
//               and learn how to enhance your ads using features like ad extensions.
//               If you run into any problems with your ads, find out how to tell if
//               they're running and how to resolve approval issues.`;
//         default:
//             return 'Unknown step';
//     }
// }

export default function VerticalLinearStepper() {
    const classes = useStyles();
    // const [activeStep, setActiveStep] = React.useState(0);
    // const steps = getQuestions();

    const all_questions = question_data;

    // const handleNext = () => {
    //     setActiveStep(prevActiveStep => prevActiveStep + 1);
    // };

    // const handleBack = () => {
    //     setActiveStep(prevActiveStep => prevActiveStep - 1);
    // };

    // const handleReset = () => {
    //     setActiveStep(0);
    // };

    // const [selectedValue, setSelectedValue] = React.useState('a');

    // const handleChange = event => {
    //     setSelectedValue(event.target.value);
    // };

    const [value, setValue] = React.useState('female');

    const handleChange = event => {
        setValue(event.target.value);
    };

    return (
        <div className={classes.root}>

            <FormControl component="fieldset">
                <FormLabel component="legend">labelPlacement</FormLabel>
                <RadioGroup aria-label="position" name="position" value={value} onChange={handleChange} row>
                    <FormControlLabel
                        value="top"
                        control={<Radio color="primary" />}
                        label="Top"
                        labelPlacement="start"
                    />
                    <FormControlLabel
                        value="start"
                        control={<Radio color="primary" />}
                        label="Start"
                        labelPlacement="start"
                    />
                </RadioGroup>
            </FormControl>

            {/* {all_questions.questions.map((data, index) => (
                <Grid container
                    direction="column"
                    justify="center"
                    alignItems="center"
                    spacing={4}>
                    <Grid item>
                        <Typography key={data.id}>
                            {data.question}
                        </Typography>
                        <Radio
                            // checked={selectedValue === `${question.answer[question.id]}`}
                            onChange={handleChange}
                            value={data.answer[0]}
                            // name="radio-button-demo"
                            label={data.answer[0]}
                            labelPlacement="end"
                        />
                        <Radio
                            // checked={selectedValue === `${question.answer[question.id]}`}
                            onChange={handleChange}
                            value={data.answer[1]}
                            // name="radio-button-demo"
                            label={data.answer[1]}
                            labelPlacement="end"
                        />
                    </Grid>
                </Grid>
            ))} */}

        </div>
    );
}
