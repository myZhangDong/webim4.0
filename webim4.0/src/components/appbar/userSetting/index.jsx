import React, { useState } from "react";
import CommonDialog from "@/components/common/dialog";
import i18next from "i18next";
import { Box} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useStore } from "react-redux";
import Typography from "@material-ui/core/Typography";
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
    gridItem: {
      display: "flex",
      alignItems: "center",
    },
  };
});

export default function Setting({ open, onClose }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState();

  const handleClose = () => {
    setError(null);
    onClose();
  };
  function renderContent() {
    return (
      <Box className={classes.root}>
        <Grid container spacing={5}>
          <Grid item xs={12} className={classes.gridItem}>
            <Typography variant="inherit" noWrap>
              {i18next.t("UserSetting-about")}: test
            </Typography>
          </Grid>
          <Grid item xs={12} className={classes.gridItem}>
            <Typography variant="inherit" noWrap>
              sdk:{"test2"}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <CommonDialog
      open={open}
      onClose={handleClose}
      title={i18next.t("User-Setting")}
      content={renderContent()}
    ></CommonDialog>
  );
}