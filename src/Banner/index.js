import React from 'react';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import data from './alert_message.json';

const styles = theme => ({
    banner: {
        backgroundColor: '#FFF6EC',
        fontWeight: 800,
        border: '1px solid #C0C0C0',
        borderRadius: '5px',
        padding: '8px',
    }
});

const Banner = (props) => {
    const { classes } = props;

    return (
        <div>
            {data.map(message => (
                Date.parse(message.display_start_time) < Date.now() && Date.parse(message.display_end_time) > Date.now() && (
                    <Typography key={message.id} gutterBottom variant="h5" className={classes.banner}>
                        {message.message}
                    </Typography>

                )
            ))}
        </div>
    )
}

export default withStyles(styles)(Banner);
