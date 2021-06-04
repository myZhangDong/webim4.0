import React, { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import agora from '@/assets/images/agora@2x.png'
const useStyles = makeStyles((theme) => ({
    pulldownListItem: {
        padding: '10px 0',
        listStyle: 'none',
        marginBottom: '26px',
        position: 'relative',
        display: 'flex'
    },
    imgBox: {
        marginLeft: '10px',
        maxWidth: '50%',
        '& img': {
            maxWidth: '100%'
        }
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

function ImgMessage() {
    const classes = useStyles({ bySelf: true });
    return (
        <li className={classes.pulldownListItem}>
            <Avatar>ss</Avatar>
            <div className={classes.imgBox}>
                <img src={agora} alt='img message'></img>
            </div>
            <div className={classes.time}>
                2020/12/21 12:54 Mon
            </div>
        </li>
    )
}

export default memo(ImgMessage)