import React, { memo, useRef, useEffect, useState, useCallback } from 'react';
import ReactDOM from 'react-dom'
import { makeStyles } from '@material-ui/core/styles';
import { FixedSizeList, areEqual } from 'react-window';
import AutoSizer from "react-virtualized-auto-sizer";
import memoize from 'memoize-one';
import './index.css'
import { useDispatch } from 'react-redux';
import MessageActions from '@/redux/message'
import RetractedMessage from './messages/retractedMessage';
import FileMessage from './messages/fileMessage';
import ImgMessage from './messages/imageMessage';
import AudioMessage from './messages/audioMessage';
import TextMessage from './messages/textMessage';
const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        flex: 1,
        display: 'flex',
        position: 'absolute',
        bottom: '210px',
        top: '0',
        overflow: 'hidden'
    },
}))

const createItemData = memoize((items) => ({
    items
}));
const itemData = createItemData([{ a: 1 }, { a: 2 }])

function MessageList({ messageList }) {
    const classes = useStyles();
    const dispatch = useDispatch()
    console.log('** Render MessageList **')
    const scrollEl = useRef(null)
    const [beforePullDown, setBeforePullDown] = useState(true)
    const [isPullingDown, setIsPullingDown] = useState(false)

    let _not_scroll_bottom = false
    // useEffect(() => {
    //     document.oncontextmenu = function (e) {
    //         console.log('oncontextmenu', e);
    //         e.stopPropagation()
    //         return false
    //     }
    // }, [])

    useEffect(() => {
        if (!_not_scroll_bottom) {
            setTimeout(() => {
                const dom = scrollEl.current
                if (!ReactDOM.findDOMNode(dom)) return
                dom.scrollTop = dom.scrollHeight
            }, 0)
        }
    })

    const handleRecallMsg = useCallback((message) => {
        console.log('handleRecallMsg', message)
        const { to, chatType } = message
        dispatch(MessageActions.recallMessage(to, chatType, message))
    }, [dispatch])
    return (
        <div className={classes.root}>
            <div ref={scrollEl} className="pulldown-wrapper">
                <div className="pulldown-tips">
                    <div style={{ display: beforePullDown ? 'block' : 'none' }}>
                        <span>Pull Down and refresh</span>
                    </div>
                    <div style={{ display: !beforePullDown ? 'block' : 'none' }}>
                        <div style={{ display: isPullingDown ? 'block' : 'none' }}>
                            <span>Loading...</span>
                        </div>
                        <div style={{ display: !isPullingDown ? 'block' : 'none' }}><span>Refresh success</span></div>
                    </div>
                </div>
                <ul className="pulldown-list">
                    {messageList.map((msg) => {
                        if (msg.body.type === 'txt') {
                            return <TextMessage message={msg} key={msg.id} onRecallMessage={handleRecallMsg} />
                        }
                        else if (msg.body.type === 'file') {
                            return <FileMessage message={msg} key={msg.id} onRecallMessage={handleRecallMsg} />
                        }
                        else if (msg.body.type === 'img') {
                            return <ImgMessage message={msg} key={msg.id} onRecallMessage={handleRecallMsg} />
                        }
                        else if (msg.body.type === 'audio') {
                            <AudioMessage message={msg} key={msg.id} />
                        }
                        else if (msg.body.type === 'recall') {
                            return <RetractedMessage message={msg} key={msg.id} />
                        } else {
                            return null
                        }
                    })}
                </ul>
            </div>
        </div>
    );
}

export default memo(MessageList)

