import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import {
  Box,
  Grid,
  ListItem,
  ListItemText,
  TextField,
  Zoom,
} from "@material-ui/core";
import { CreateProjectStyles } from "./useStyles/CreateProjectStyles";

const Transition = React.forwardRef(function Transition(props, ref) {
  return (
    <Zoom
      style={{ transitionDelay: "50ms" }}
      direction="up"
      ref={ref}
      {...props}
    />
  );
});

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function CustomSpecification({
  opencustom,
  setCustonOpen,
  allbooks,
  setContent,
  updateCanonItems,
  setUpdateCanonItems,
}) {
  const classes = CreateProjectStyles();
  const [selectedbook, setSelectedbook] = React.useState([]);
  const [highlight, setHighlight] = React.useState(false);
  const [canonspecName, setCanonspecName] = React.useState("");
  const [duplicates, setduplicates] = React.useState(false);

  const handleClose = () => {
    setCustonOpen(false);
    updateCanonItems.forEach((element) => {
      if (element.spec.includes(canonspecName) === true) {
        setduplicates(true);
      }
    });
    if (duplicates === false) {
      let custonspec = { id: canonspecName, spec: canonspecName };
      updateCanonItems.push(custonspec);
      setUpdateCanonItems(updateCanonItems);
      setduplicates(false);
    }
  };

  const selectedBooks = (bookname) => {
    if (selectedbook.includes(bookname) === false) {
      selectedbook.push(bookname);
      setHighlight(!highlight);
    } else {
      let selectedIndex = selectedbook.indexOf(bookname);
      selectedbook.splice(selectedIndex, 1);
      setSelectedbook(selectedbook);
      setHighlight(!highlight);
    }
  };

  function FormRow() {
    return (
      <React.Fragment>
        {allbooks.map((bookname, index) => {
          return (
            <Grid key={index} item xs={2}>
              <ListItem
                button
                className={classes.paper}
                classes={{ selected: classes.selected }}
                selected={selectedbook.includes(bookname)}
                style={{ backgroundColor: "white" }}
                onClick={() => selectedBooks(bookname)}
              >
                <ListItemText primary={bookname} />
              </ListItem>
            </Grid>
          );
        })}
      </React.Fragment>
    );
  }

  return (
    <div>
      <Dialog
        maxWidth="xl"
        fullWidth={true}
        TransitionComponent={Transition}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={opencustom}
      >
        <DialogTitle id="customized-dialog-title">
          <Box fontWeight={600} m={1}>
            Add Canon Specification
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box fontWeight={600} m={1}>
            Enter Name
          </Box>
          <div>
            <TextField
              className={classes.Specification}
              variant="outlined"
              placeholder="Enter Specification Name"
              value={canonspecName}
              onChange={(e) => {
                setCanonspecName(e.target.value);
              }}
            />
          </div>
          <div className={classes.root}>
            <Grid container spacing={1}>
              <Grid container item xs={12} spacing={3}>
                <FormRow />
              </Grid>
            </Grid>
          </div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Save changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
