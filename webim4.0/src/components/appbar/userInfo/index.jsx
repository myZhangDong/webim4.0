import React, { useState } from "react";
import CommonDialog from "@/components/common/dialog";
import i18next from "i18next";
import { Box, TextField, Avatar, Button } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useStore } from "react-redux";
import Typography from "@material-ui/core/Typography";
import SettingsIcon from "@material-ui/icons/Settings";
const useStyles = makeStyles((theme) => {
  return {
    root: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      minWidth: "300px",
      paddingBottom: theme.spacing(4),
      margin: "16px 24px",
    },
    inputLabel: {
      marginBottom: theme.spacing(4),
      width: "100%",
    },
    button: {
      width: "50%",
      marginTop: theme.spacing(11),
      color: "#fff",
    },
    avatar: {
      width: theme.spacing(20),
      height: theme.spacing(20),
    },
    gridAvatar: {
      justifyContent: "center",
      display: "flex",
      alignItems: "center",
    },
    gridItem: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
    },
  };
});

export default function UserInfo({ open, onClose }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");
  const [isEdit, setIsEdit] = useState(true);
  const [error, setError] = useState();

  const handleChange = (event) => {
    setInputValue(event.target.value);
    setError(null);
  };
  const handleClose = () => {
    setIsEdit(true)
    setError(null);
    onClose();
  };
  function renderContent() {
    return (
      <Box className={classes.root}>
        <Grid container spacing={5}>
          <Grid item xs={12} className={classes.gridAvatar}>
            <Avatar className={classes.avatar} />
          </Grid>

          <Grid item xs={2} className={classes.gridItem}>
            <Typography variant="inherit" noWrap>
              {i18next.t("Name")}
            </Typography>
          </Grid>
          <Grid item xs={10} className={classes.gridItem}>
            <TextField
              id="outlined-basic"
              variant="outlined"
              fullWidth
              autoFocus
              name="userName"
              size="small"
              error={error}
              value={inputValue}
              onChange={handleChange}
              disabled={isEdit}
            />
            {isEdit ? (
              <SettingsIcon
                style={{ color: "#888888", marginLeft: "10px" }}
                onClick={() => setIsEdit(false)}
              />
            ) : (
              <>
                <Button>{i18next.t("UserInfo-Save")}</Button>
                <Button onClick={() => setIsEdit(true)}>{i18next.t("UserInfo-Cancel")}</Button>
              </>
            )}
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <CommonDialog
      open={open}
      onClose={handleClose}
      title={i18next.t("Personal information")}
      content={renderContent()}
    ></CommonDialog>
  );
}
