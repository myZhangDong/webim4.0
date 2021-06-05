import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import _ from 'lodash'
import WebIM from '@/common/WebIM';
import CommonActions from '@/redux/common'

const { Types, Creators } = createActions({
    updateGroup: ['groups'],
    dissolveGroup: ['group'],
    updateGroupInfo: ['info'],
    getGroups: () => {
        return (dispatch, getState) => {
            dispatch(CommonActions.setLoading(true))
            WebIM.conn.getGroup({
                success: function (response) {
                    dispatch(CommonActions.setLoading(false))
                    dispatch(Creators.updateGroup(response.data))
                },
                error: function (e) {
                    dispatch(CommonActions.setLoading(false))
                }
            })
        }
    },
    dissolveGroupAsync: ({ groupId, groupName }) => {
        return (dispatch, getState) => {
            WebIM.conn.dissolveGroup({
                groupId,
                success: () => {
                    dispatch(Creators.dissolveGroup({ groupId, groupName }))
                },
                error: e => {
                }
            })
        }
    },
    updateGroupInfoAsync: info => {
        return (dispatch, getState) => {
            WebIM.conn.modifyGroup({
                groupId: info.groupId,
                groupName: info.groupName,
                // description: info.description,
                success: response => {
                    // const info = response.data // <-- !!!
                    dispatch(Creators.updateGroupInfo(info))
                },
                error: e => {
                }
            })
        }
    },
})

/*---------------- reducer ------------------*/
export const updateGroup = (state, { groups }) => {
    let byId = {}
    let names = []
    groups.forEach(v => {
        byId[v.groupid] = {
            groupId: v.groupid,
            groupName: v.groupname
        }
        names.push(v.groupname + '_#-#_' + v.groupid)
    })
    return state.merge({
        byId,
        names: names.sort()
    })
}

export const dissolveGroup = (state, { group }) => {
    const { groupId, groupName } = group
    let byId = state.getIn(['byId']).without(groupId)
    const names = state.getIn(['names']).asMutable()
    names.splice(names.indexOf(`${groupName}_#-#_${groupId}`), 1)
    return state.merge({
        byId,
        names: names.sort()
    })
}

export const updateGroupInfo = (state, { info }) => {
    const group = state.getIn(['byId', info.groupId])
    const oldName = `${group.groupName}_#-#_${group.roomId || group.groupId}`
    const newName = `${info.groupName}_#-#_${group.roomId || group.groupId}`
    const names = state.getIn(['names']).asMutable()
    names.splice(names.indexOf(oldName), 1, newName)
    return state.setIn(['byId', info.groupId, 'groupName'], info.groupName).set('names', names.sort())
}
/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    groupMember: [],
    byId: {},
    names: []
})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
    [Types.UPDATE_GROUP]: updateGroup,
    [Types.UPDATE_GROUP_INFO]: updateGroupInfo,
    [Types.DISSOLVE_GROUP]: dissolveGroup,
})


export default Creators