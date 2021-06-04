import React, { Component, useState, memo, useEffect, useCallback } from 'react'
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import withWidth, { isWidthUp, isWidthDown } from '@material-ui/core/withWidth';
import SessionList from '@/components/session/sessionList'
import AppBar from '@/components/appbar/appBar'
import Chat from '@/components/chat/index'
import { useParams, Route } from "react-router-dom";
import _ from 'lodash'
import { useSelector, useDispatch } from 'react-redux'
import SessionActions from '@/redux/session'
import MessageActions from '@/redux/message'
const MemoAppBar = memo(AppBar)
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        '& main': {
            display: 'flex',
            flex: 1
        }
    },
    aside: {
        width: '30vw',
    },
    article: {
        flex: 1
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

function Main(props) {
    let { chatType, to } = useParams();
    // let match = useRouteMatch();
    const classes = useStyles();
    const dispatch = useDispatch()
    const messageList = useSelector(state => _.get(state, ['message', chatType, to], [])) || []
    console.log('当前人的消息', messageList, to, chatType)
    const [showLeft, setShowLeft] = useState(true)
    const [showRight, setShowRight] = useState(true)
    const [isSmallScreen, setIsSmallScreen] = useState(false)

    useEffect(() => {
        to && dispatch(SessionActions.setCurrentSession(to))
    }, [])

    console.log(`当前宽度: ${props.width}`)
    // when width changed relayout
    useEffect(() => {
        if (isWidthUp('sm', props.width)) {
            console.log('大屏幕')
            setShowRight(true)
            setIsSmallScreen(false)
            setShowLeft(true)
            setShowRight(true)
        } else {
            console.log('小屏幕')
            setShowRight(false)
            setIsSmallScreen(true)
            setShowLeft(true)
            setShowRight(false)
        }
    }, [props.width])

    const handleGoBack = useCallback(() => {
        if (isWidthUp('xs', props.width)) {
            setShowLeft(true)
            setShowRight(false)
        }
    }, [props.width])

    const handleClickItem = useCallback((session) => {
        console.log('handleClickItem', session)
        const { sessionType, sessionId } = session
        const redirectPath = `/${sessionType}/` + [sessionId].join('/')
        dispatch(SessionActions.setCurrentSession(sessionId))
        dispatch(MessageActions.clearUnreadAsync(sessionType, sessionId))
        props.history.push(redirectPath + props.location.search)
        if (isWidthDown('xs', props.width)) {
            setShowLeft(false)
            setShowRight(true)
        }
    }, [props.width])
    return (
        <div className={classes.root}>
            <header>
                <MemoAppBar
                    {...props}
                    isSmallScreen={isSmallScreen}
                    showLeft={showLeft}
                    showRight={showRight}
                    onGoBack={handleGoBack} />
            </header>
            <main>
                <aside className={classes.aside} style={{ display: showLeft ? 'block' : 'none', width: isSmallScreen ? '100vw' : '30vw' }}>
                    <SessionList onClickItem={handleClickItem} />
                </aside>

                <article className={classes.article} style={{ display: showRight ? 'block' : 'none' }}>
                    {/* <MemoAppBar onGoBack={handleGoBack} /> */}
                    {/* <Chat chatType={chatType} to={to} /> */}
                    <Route
                        path="/:chatType/:to"
                        render={props => <Chat {...props} messageList={messageList} />}
                    />
                </article>
            </main>
        </div >
    )
}

export default withWidth()(Main);


