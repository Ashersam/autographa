// @flow
import * as React from "react";
// import ReactMarkdown from "react-markdown";
import { BlockEditable } from "markdown-translatable/dist/components";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Zoom,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
  },
  title: {
    padding: 4,
  },
}));

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

export const MarkdownViewer = ({
  openmdviewer,
  setopenmdviewer,
  selectedLicense,
}) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [preview, setpreview] = React.useState(true);
  const [translation, settranslation] = React.useState();

  React.useEffect(() => {
    const licensefile = require(`../../lib/license/${selectedLicense}.md`);
    fetch(licensefile)
      .then((response) => response.text())
      .then((text) => {
        settranslation(text);
      });
  }, [selectedLicense]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClose = () => {
    setopenmdviewer(false);
  };
  const callback = (markdown) => {
    // do something when the user exits editing element (onBlur).
    settranslation(markdown);
  };
  return (
    <div>
      <div>
        <Dialog
          maxWidth="xl"
          fullWidth={true}
          TransitionComponent={Transition}
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={openmdviewer}
        >
          <DialogTitle className={classes.title} id="customized-dialog-title">
            <AppBar position="static" color="default">
              <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                aria-label="full width tabs example"
              >
                <Tab
                  onClick={() => setpreview(true)}
                  label="Preview"
                  {...a11yProps(0)}
                />
                <Tab
                  onClick={() => setpreview(false)}
                  label="Markdown"
                  {...a11yProps(1)}
                />
              </Tabs>
            </AppBar>
          </DialogTitle>
          <DialogContent dividers>
            {value === 0 ? (
              <div>
                <BlockEditable
                  markdown={translation}
                  preview={preview}
                  onEdit={callback}
                  inputFilters={[
                    [/<br>/gi, "\n"],
                    [/(<u>|<\/u>)/gi, "__"],
                  ]}
                  outputFilters={[[/\n/gi, "<br>"]]}
                />
              </div>
            ) : (
              <div>
                <BlockEditable
                  markdown={translation}
                  preview={preview}
                  onEdit={callback}
                  inputFilters={[
                    [/<br>/gi, "\n"],
                    [/(<u>|<\/u>)/gi, "__"],
                  ]}
                  outputFilters={[[/\n/gi, "<br>"]]}
                />
              </div>
            )}
            {/* <Button
            variant="contained"
            color="primary"
            onClick={() => setpreview(!preview)}
          >
            {!preview ? "Markdown" : "Preview (HTML EDIT)"}
          </Button> */}
            {/* <ReactMarkdown source={translation} /> */}

            {/* <BlockTranslatable
          
            translation={translation}
            preview={preview}
            onTranslation={(translation) => settranslation(translation)}
          /> */}
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose} variant="contained">
              Cancel
            </Button>
            <Button
              autoFocus
              onClick={handleClose}
              variant="contained"
              color="primary"
            >
              save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};
