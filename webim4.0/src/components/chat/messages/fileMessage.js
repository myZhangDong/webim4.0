import React, { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import clsx from 'clsx';
import { IconButton, Icon } from '@material-ui/core';
const useStyles = makeStyles((theme) => ({
    pulldownListItem: {
        padding: '10px 0',
        listStyle: 'none',
        marginBottom: '26px',
        position: 'relative',
        display: 'flex'
    },
    fileCard: {
        width: '252px',
        height: '72px',
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'center',
        marginLeft: '10px',
        marginBottom: '26px'
    },
    fileIcon: {
        width: '59px',
        height: '59px',
        background: 'rgba(35, 195, 129, 0.06)',
        borderRadius: '4px',
        border: '1px solid rgba(35, 195, 129, 0.06)',
        textAlign: 'center',
        lineHeight: '59px',
        margin: '0 7px 0 7px',
        flexShrink: 0,
    },
    fileInfo: {
        '& p': {
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            width: '126px',
            margin: '0'
        },
        '& span': {
            fontSize: '12px',
            color: '#010101',
            lineHeight: '16px'
        }
    },
    icon: {
        color: 'rgba(35, 195, 129, 1)',
        fontWeight: 'bold',
        fontSize: '38px'
    },
    download: {
        fontSize: '16px',
        color: 'rgba(0,0,0,.6)',
        fontWeight: 'bold',
        cursor: 'pointer'
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

function FileMessage() {
    const classes = useStyles({ bySelf: true });
    return (
        <li className={classes.pulldownListItem}>
            <Avatar>ss</Avatar>
            <div className={classes.fileCard}>
                <div className={classes.fileIcon}>
                    <Icon className={clsx(classes.icon, 'iconfont icon-fujian')}></Icon>
                </div>
                <div className={classes.fileInfo}>
                    <p>file name ddddddddddd</p>
                    <span>file size</span>
                </div>
                <div className={classes.download}>
                    <IconButton className="iconfont icon-xiazai"></IconButton>
                </div>
            </div>
            <div className={classes.time}>
                2020/12/21 12:54 Mon
            </div>
        </li>

    )
}

export default memo(FileMessage)