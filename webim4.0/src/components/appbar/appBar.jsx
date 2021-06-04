import React, { useEffect, useRef, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import MoreIcon from '@material-ui/icons/MoreVert';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import agora from '@/assets/images/agora@2x.png'
import { Icon, ListItemIcon } from '@material-ui/core';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import { useParams } from "react-router-dom";
import { Menu, MenuItem } from '@material-ui/core';
import i18next from "i18next";
import AddFriendDialog from '@/components/appbar/addFriend'
import AddressBookDialog from '@/components/appbar/addressBook'
const useStyles = makeStyles((theme) => {
    return ({
        root: {
            display: 'flex',
            flexGrow: 1,
            height: '6.67vh',
            background: theme.palette.primary.bg
        },
        leftBar: {
            width: '30vw',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            '& img': {
                width: '64px',
                marginLeft: theme.spacing(4),
            },
            '& .icon': {
                color: '#fff'
            }
        },
        rightBar: {
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#fff',
            '& .icon': {
                color: '#fff'
            }
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        toolbar: {
        },
        title: {
            flexGrow: 1,
            alignSelf: 'flex-end',
        },
        nameBox: {
            marginLeft: '14px'
        },


        menuItemIconBox: {
            marginRight: '5px',
            '& span': {
                color: 'rgba(97, 255, 69, 1)',
                fontWeight: 'bold'
            }
        }
    })
});

function ProminentAppBar(props) {
    const classes = useStyles(props);
    const { to } = useParams()
    const { onGoBack, showLeft, showRight, isSmallScreen } = props
    const [settingEl, setSettingEl] = useState(null)
    const [addEl, setAddEl] = useState(null)
    const [sessionEl, setSessionEl] = useState(null)

    const [showAddFriend, setShowAddFriend] = useState(false) // show AddFriendDialog
    const [showAddressBook, setShowAddressBook] = useState(false) // show AddressBookDisalod
    const handleClickAdd = (e) => {
        setAddEl(e.currentTarget)
    }
    const handleClickSetting = (e) => {
        setSettingEl(e.currentTarget)
    }
    const handleSessionInfoClick = (e) => {
        setSessionEl(e.currentTarget)
    }

    const handleClose = () => { }

    /*********** first icon button: Add ***********/
    function renderAddMenu() {
        return (
            <Menu
                id="simple-menu"
                anchorEl={addEl}
                keepMounted
                open={Boolean(addEl)}
                onClose={() => setAddEl(null)}
            >
                <MenuItem onClick={getAdress}>
                    <Box className={classes.menuItemIconBox}>
                        <Icon className="iconfont icon-tongxunlu"></Icon>
                    </Box>
                    <Typography variant="inherit" noWrap>
                        {i18next.t('Address Book')}
                    </Typography>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <Box className={classes.menuItemIconBox}>
                        <Icon className="iconfont icon-chuangjianqunzu"></Icon>
                    </Box>
                    <Typography variant="inherit" noWrap>
                        {i18next.t('Create Group')}
                    </Typography>
                </MenuItem>
                <MenuItem onClick={addFriend}>
                    <Box className={classes.menuItemIconBox}>
                        <Icon className="iconfont icon-tianjiahaoyou"></Icon>
                    </Box>
                    <Typography variant="inherit" noWrap>
                        {i18next.t('Add Friends')}
                    </Typography>
                </MenuItem>
            </Menu>
        )
    }
    // ------- 1th Add menu item -------
    function getAdress() {
        setShowAddressBook(true)
    }
    function handleAddressBookDialogClose() {
        setShowAddressBook(false)
    }

    // ------- 3th Add menu item -------
    function addFriend() {
        setShowAddFriend(true)
    }
    function handleAddFriendDialogClose() {
        setShowAddFriend(false)
    }


    /*********** first icon button: Setting ***********/
    function renderSettingMenu() {
        return (
            <Menu
                id="simple-menu"
                anchorEl={settingEl}
                keepMounted
                open={Boolean(settingEl)}
                onClose={() => setSettingEl(null)}
            >
                <MenuItem onClick={handleClose}>
                    <Box className={classes.menuItemIconBox}>
                        <Icon className="iconfont icon-gerenziliao"></Icon>
                    </Box>
                    <Typography variant="inherit" noWrap>
                        Personal Data
                    </Typography>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <Box className={classes.menuItemIconBox}>
                        <Icon className="iconfont icon-shezhi"></Icon>
                    </Box>
                    <Typography variant="inherit" noWrap>
                        Set Up
                    </Typography>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <Box className={classes.menuItemIconBox}>
                        <Icon className="iconfont icon-tuichu"></Icon>
                    </Box>
                    <Typography variant="inherit" noWrap>
                        Sign Out
                    </Typography>
                </MenuItem>
            </Menu>
        )
    }

    function renderSessionInfoMenu() {
        return (
            <Menu
                id="simple-menu"
                anchorEl={sessionEl}
                keepMounted
                open={Boolean(sessionEl)}
                onClose={() => setSessionEl(null)}
            >
                <MenuItem onClick={handleClose}>
                    <Box className={classes.menuItemIconBox}>
                        <Icon className="iconfont icon-huihuaxinxi"></Icon>
                    </Box>
                    <Typography variant="inherit" noWrap>
                        Session Info
                    </Typography>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <Box className={classes.menuItemIconBox}>
                        <Icon className="iconfont icon-qingkongxiaoxi"></Icon>
                    </Box>
                    <Typography variant="inherit" noWrap>
                        Clear Message
                    </Typography>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <Box className={classes.menuItemIconBox}>
                        <Icon className="iconfont icon-shanchuhuihua"></Icon>
                    </Box>
                    <Typography variant="inherit" noWrap>
                        Delete Session
                    </Typography>
                </MenuItem>
            </Menu>
        )
    }
    return (
        <div className={classes.root}>
            <Box position="static" className={classes.leftBar}
                style={{ display: showLeft ? 'flex' : 'none', width: isSmallScreen ? '100vw' : '30vw' }}>
                <img src={agora} alt="agora" />
                <Toolbar className={classes.toolbar}>
                    <IconButton
                        onClick={handleClickAdd}
                        className="iconfont icon-tianjia icon"
                    ></IconButton>
                    <IconButton
                        onClick={handleClickSetting}
                        className="iconfont icon-shezhi icon"
                    ></IconButton>
                </Toolbar>
            </Box>

            <Box position="static" className={classes.rightBar}
                style={{ display: showRight ? 'flex' : 'none' }}>
                <IconButton
                    onClick={onGoBack}
                    style={{ display: isSmallScreen ? 'flex' : 'none' }}>
                    {'<'}
                </IconButton>

                <Typography className={classes.nameBox}>
                    {to}
                </Typography>
                <Toolbar className={classes.toolbar}>
                    <IconButton className="iconfont icon-sousuo icon"></IconButton>
                    <IconButton
                        onClick={handleSessionInfoClick}
                        className="iconfont icon-hanbaobao icon"
                    ></IconButton>
                </Toolbar>
            </Box>
            {renderAddMenu()}
            {renderSettingMenu()}
            {renderSessionInfoMenu()}
            <AddFriendDialog
                open={showAddFriend}
                onClose={handleAddFriendDialogClose} />
            <AddressBookDialog
                {...props}
                open={showAddressBook}
                onClose={handleAddressBookDialogClose} />
        </div>
    );
}
export default withWidth()(ProminentAppBar);
