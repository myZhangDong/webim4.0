import { formatLocalMessage, formatServerMessage } from '@/utils'
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import _ from 'lodash'
import store from '@/redux'
import WebIM from '@/common/WebIM';
import AppDB from '@/utils/AppDB';


/* ------------- Initial State ------------- */
export const INITIAL_STATE = Immutable({
    byId: {},
    singleChat: {},
    groupChat: {},
    chatRoom: {},
    stranger: {},
    extra: {},
    unread: {
        singleChat: {},
        groupChat: {},
        chatRoom: {},
        stranger: {},
    }
})

/* -------- Types and Action Creators -------- */
const { Types, Creators } = createActions({
    addMessage: ['message', 'messageType'],
    deleteMessage: ['msgId'],
    updateMessageStatus: ['message', 'status'],
    clearUnread: ["chatType", "sessionId"],
    // -async-
    sendTxtMessage: (to, chatType, message = {}) => {
        return (dispatch, getState) => {
            const formatMsg = formatLocalMessage(to, chatType, message, 'txt')
            const { body, id } = formatMsg
            const { msg } = body
            const msgObj = new WebIM.message('txt', id)
            msgObj.set({
                to,
                msg,
                chatType,
                ext: message.ext,
                success: () => {
                    dispatch(Creators.updateMessageStatus(formatMsg, 'sent'))
                },
                fail: () => {
                    dispatch(Creators.updateMessageStatus(formatMsg, 'fail'))
                }
            })
            WebIM.conn.send(msgObj.body)
            dispatch(Creators.addMessage(formatMsg))
        }
    },

    recallMessage: (to, chatType, message) => {
        return (dispatch, getState) => {
            const { id } = message
            WebIM.conn.recallMessage({
                to: to,
                mid: id, // message id
                type: chatType,
                success: () => {
                    dispatch(Creators.deleteMessage(id))
                },
                fail: (err) => {
                    message.error('撤回失败')
                }
            })
        }
    },

    clearUnreadAsync: (chatType, sessionId) => {
        return (dispatch) => {
            dispatch({ 'type': 'CLEAR_UNREAD', chatType, sessionId })
            AppDB.readMessage(chatType, sessionId)
        }
    },
})

/* ------------- Reducers ------------- */
export const addMessage = (state, { message, messageType = 'txt' }) => {
    const rootState = store.getState()
    console.log('******* rootState ****', rootState)
    !message.status && (message = formatServerMessage(message, messageType)) //remote messages do not have a status field
    // console.log('格式化的消息', message, rootState)
    const username = WebIM.conn.context.userId//_.get(state, 'login.username', '')
    const { id, to, status } = message
    let { chatType } = message
    // where the message comes from, when from current user, it is null
    const from = message.from || username
    // bySelf is true when sent by current user, otherwise is false
    const bySelf = from === username
    // root id: when sent by current user or in group chat, is id of receiver. Otherwise is id of sender
    let chatId = bySelf || chatType !== 'singleChat' ? to : from

    // change type as stranger
    // if (chatType === "singleChat" && !state.roster.byName[chatId]) {
    //     chatType = "stranger";
    //     message.chatType = "stranger";
    //     chatId = from
    // }
    // update message array
    const chatData = state.getIn([chatType, chatId], Immutable([])).asMutable()
    const _message = {
        ...message,
        bySelf,
        time: +new Date(),
        status: status
    }

    // ???
    // the pushed message maybe have exsited in state, ignore
    if (_message.chatType === 'chatRoom' && bySelf) {
        const oid = state.getIn(['byMid', _message.id, 'id'])
        if (oid) {
            _message.id = oid
        }
    }
    let isPushed = false
    chatData.forEach(m => {
        if (m.id === _message.id) {
            isPushed = true
        }
    })

    !isPushed && chatData.push(_message)

    // add a message to db, if by myselt, isUnread equals 0
    !isPushed && AppDB.addMessage(_message, !bySelf ? 1 : 0)

    const maxCacheSize = _.includes(['groupChat', 'chatRoom'], chatType) ? WebIM.config.groupMessageCacheSize : WebIM.config.p2pMessageCacheSize
    if (chatData.length > maxCacheSize) {
        const deletedChats = chatData.splice(maxCacheSize, chatData.length - maxCacheSize)
        let byId = state.getIn(['byId'])
        byId = _.omit(byId, _.map(deletedChats, 'id'))
        state = state.setIn(['byId'], byId)
    }

    state = state.setIn([chatType, chatId], chatData)

    // unread
    const activeContact = _.get(state, ['session', 'currentSession'])
    if (!bySelf && !isPushed && message.from !== activeContact) {
        let count = state.getIn(['unread', chatType, chatId], 0)
        state = state.setIn(['unread', chatType, chatId], ++count)
    }

    state = state.setIn(['byId', id], { chatType, chatId })

    return state
}

export const updateMessageStatus = (state, { message, status = '' }) => {
    let { id } = message
    if (!id) id = state.getIn(['byMid', message.mid, 'id'])
    let mids = state.getIn(['byMid']) || {}
    let mid
    for (var i in mids) {
        if (mids[i].id === id) {
            mid = i
        }
    }
    const byId = state.getIn(['byId', id])
    if (!_.isEmpty(byId)) {
        const { type, chatId } = byId
        let messages = state.getIn([type, chatId]).asMutable()
        let found = _.find(messages, { id: parseInt(id) })
        let msg = found.setIn(['status'], status)
        msg = found.setIn(['toJid'], mid)
        messages.splice(messages.indexOf(found), 1, msg)
        AppDB.updateMessageStatus(id, status).then(res => { })
        state = state.setIn([type, chatId], messages)
    }
    return state
}

export const deleteMessage = (state, { msgId }) => {
    msgId = msgId.mid || msgId
    const byId = state.getIn(['byId', msgId])
    if (!byId) { return console.error(`not found message: ${msgId}`) }
    const { chatType, chatId } = byId
    let messages = state.getIn([chatType, chatId]).asMutable()
    let targetMsg = _.find(messages, { id: msgId })
    const index = messages.indexOf(targetMsg)
    messages.splice(index, 1, {
        ...targetMsg,
        body: {
            ...targetMsg.body,
            type: 'recall'
        }
    })
    state = state.setIn([chatType, chatId], messages)
    AppDB.deleteMessage(msgId)

    return state
}

export const clearUnread = (state, { chatType, sessionId }) => {
    let data = state['unread'][chatType].asMutable()
    delete data[sessionId]
    return state.setIn(['unread', chatType], data)
}

/* ------------- Hookup Reducers To Types ------------- */

export const messageReducer = createReducer(INITIAL_STATE, {
    [Types.ADD_MESSAGE]: addMessage,
    [Types.DELETE_MESSAGE]: deleteMessage,
    [Types.CLEAR_UNREAD]: clearUnread
})

export default Creators