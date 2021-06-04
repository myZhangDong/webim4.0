import React, { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import i18next from "i18next";
const useStyles = makeStyles((theme) => ({
    pulldownListItem: {
        padding: '10px 0',
        listStyle: 'none',
        marginBottom: '26px',
        position: 'relative',
    },
    text: {
        textAlign: 'center',
        color: 'rgba(1, 1, 0, 0.3)',
        fontSize: '12px',
        marginBottom: '26px'
    },
    time: {
        position: 'absolute',
        fontSize: '11px',
        height: '16px',
        color: 'rgba(1, 1, 1, .2)',
        lineHeight: '16px',
        textAlign: 'center',
        top: '-18px',
        width: '100%'
    }
}))

function RetractedMessage() {
    const classes = useStyles({ bySelf: true });
    return (
        <li className={classes.pulldownListItem}>
            <div className={classes.text}>
                {i18next.t('You retracted a message')}
            </div>
            <div className={classes.time}>
                2020/12/21 12:54 Mon
            </div>
        </li>
    )
}

export default memo(RetractedMessage)

