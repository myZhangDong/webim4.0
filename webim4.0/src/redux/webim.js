import { history } from '@/common/routes'
import store from '@/redux'
import WebIM from '@/common/WebIM'
import AppDB from '@/utils/AppDB'
import LoginActions from '@/redux/login'
import CommonActions from '@/redux/common'
import MessageActions from '@/redux/message'
import RosterActions from "@/redux/roster"
import SessionActions from "@/redux/session"

WebIM.conn.listen({
    // success connect
    onOpened: msg => {
        const userName = store.getState().login.username
        // init DB
        AppDB.init(userName)

        const path = history.location.pathname.indexOf('singleChat') === -1 ? '/singleChat' : history.location.pathname
        const redirectUrl = `${path}?username=${userName}`
        console.log('redirectUrl', redirectUrl)
        history.push(redirectUrl)

        // get session list
        store.dispatch(SessionActions.getSessionList())
        // get roster
        store.dispatch(RosterActions.getContacts())

        // store.dispatch(CommonActions.setLoading(false))
    },

    onTextMessage: message => {
        console.log("onTextMessage", message)
        const { type, from, to } = message
        const sessionId = type === 'chat' ? from : to
        const sessionType = {
            chat: 'singleChat',
            groupchat: 'groupChat',
            chatroom: 'chatRoom'
        }
        store.dispatch(MessageActions.addMessage(message, 'txt'))
        store.dispatch(SessionActions.topSession(sessionId, sessionType[type]))
    },

    onError: (err) => {
        console.error(err)
    },
    onClosed: msg => {
        console.warn('onClosed', msg)
    },
})