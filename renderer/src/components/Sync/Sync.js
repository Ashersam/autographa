/* eslint-disable no-alert */
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@material-ui/core/styles';
import {
 Typography, Paper, AppBar, Tabs, Tab, Box, Divider,
 Grid, List, ListItem, ListItemText, ListItemIcon, Stepper, StepButton,
} from '@material-ui/core';
import FolderOpenOutlinedIcon from '@material-ui/icons/FolderOpenOutlined';
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';
import SyncOutlinedIcon from '@material-ui/icons/SyncOutlined';
import { GitHub } from '@material-ui/icons';
import { isUSFM, getId } from '../../core/Sync/handleSync';
import Gitea from './Gitea/Gitea';
import Dropzone from './Dropzone/Dropzone';
import fetchParseFiles from '../../core/projects/fectchParseFiles';
import parseFetchProjects from '../../core/projects/parseFetchProjects';
import { useStyle } from './useStyle';
import parseFileUpdate from '../../core/projects/parseFileUpdate';
import * as logger from '../../logger';

function TabPanel(props) {
  const {
    children, value, index, ...other
  } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export default function Sync() {
  const username = 'Michael';
  const classes = useStyle();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [index, setIndex] = React.useState(-1);
  const [activeStep, setActiveStep] = React.useState(0);
  const [dragValue, setDragValue] = React.useState();
  const [projects, setProjects] = React.useState([]);
  const [files, setFiles] = React.useState([]);
  const projectList = [];
  const [trigger, setTrigger] = React.useState(false);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleStep = (step) => () => {
    logger.debug('Dropzone.js', 'calling handleStep event');
    setActiveStep(step);
    setIndex();
  };
  const handleProjects = async (projectName, indexValue) => {
    logger.debug('Dropzone.js', 'calling handleProjects event');
    await fetchParseFiles(username, projectName)
    .then((res) => {
      setIndex(indexValue);
      setActiveStep(1);
      setFiles(res);
    });
  };
  const onDragEnd = useCallback((result) => {
    logger.debug('Dropzone.js', 'calling onDragEnd event');
    fetch(result.filedataURL)
    .then((url) => url.text())
    .then((usfmValue) => {
      logger.debug('Dropzone.js', 'sending dragged value');
      setDragValue({ result: { ...result, content: usfmValue, from: 'autographa' } });
    });
  }, []);
  const fetchProjects = async () => {
    logger.debug('Dropzone.js', 'calling fetchProjects event');
    await parseFetchProjects(username)
    .then((res) => {
      res.forEach((project) => {
        // eslint-disable-next-line prefer-const
        let file = [];
        project.get('canoncontent').forEach((val, i) => {
          file.push({ filename: val, meta: project.get(`file${i + 1}`) });
        });
        projectList.push(project.get('projectName'));
      });
    }).finally(() => {
      logger.debug('Dropzone.js', 'Updating project List');
      setProjects(projectList);
    });
  };

  const dropHere = async (data) => {
    logger.debug('Dropzone.js', 'calling dropHere event');
    if (trigger && data.result.from === 'gitea') {
      const checkFile = isUSFM(data.result.name);
      if (checkFile) {
        fetch(data.result.download_url)
        .then((url) => url.text())
        .then((usfmValue) => {
          const lines = usfmValue.trim().split(/\s*[\r\n]+\s*/g);
          // eslint-disable-next-line no-plusplus
          const bookCode = getId(lines);
          // eslint-disable-next-line no-unused-vars
          // let status;
          parseFileUpdate({
            username,
            projectName: projects[index],
            filename: bookCode,
            fileExtention: 'usfm',
            data: usfmValue,
            filenameAlias: data.result.name,
          })
          .then((response) => {
              alert(response);
          });
        });
      } else {
        logger.debug('Dropzone.js', 'Not a USFM file.');
        alert('Not a USFM file.');
      }
      setTrigger(false);
    }
  };
  React.useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <Paper className={classes.mainPaper}>
        <Grid container justify="center" spacing={1}>
          <Grid key={1} style={{ width: '50%' }} item>
            <Paper className={classes.paper}>
              <AppBar position="static" color="default">
                <h1>Sync</h1>
              </AppBar>
              <div className={classes.column}>
                <Stepper nonLinear activeStep={activeStep}>
                  <StepButton onClick={handleStep(0)}>
                    Autographa Projects
                  </StepButton>
                  <StepButton>
                    {projects[index]}
                  </StepButton>
                </Stepper>
              </div>
              <Divider />

              <List
                id="project-id"
                component="nav"
                className={classes.root}
                aria-label="mailbox folders"
                style={{ display: (activeStep === 1 ? 'none' : '') }}
              >
                {projects.map((project, i) => (
                  <ListItem
                    button
                    divider
                    key={project}
                    onClick={() => handleProjects(project, i)}
                  >
                    <ListItemIcon>
                      <FolderOpenOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary={project} />
                  </ListItem>
))}
              </List>

              <Typography variant="caption">
                {index !== -1 && projects[index] !== undefined ? (
                  <List component="nav" className={classes.root} aria-label="mailbox folders">
                    {files.map((val, i) => (
                      <ListItem
                        button
                        divider
                        key={val[i]}
                        draggable
                        onDragEnd={() => onDragEnd(val)}
                      >
                        <ListItemIcon>
                          <InsertDriveFileOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary={val.filename} />
                      </ListItem>
                    ))}
                    <Dropzone dropped={() => setTrigger(true)} />
                  </List>

                  ) : (
                    <div />
                  )}

              </Typography>
            </Paper>
          </Grid>
          <Grid key={2} style={{ width: '50%' }} item>
            <Paper className={classes.paper}>
              <AppBar position="static" color="default">
                <Tabs
                  value={value}
                  onChange={handleChange}
                  indicatorColor="primary"
                  textColor="primary"
                  scrollButtons="auto"
                  variant="scrollable"
                >
                  <Tab label="Github" icon={<GitHub />} {...a11yProps(0)} />
                  <Tab
                    label="Paratext"
                    icon={<SyncOutlinedIcon />}
                    {...a11yProps(1)}
                  />
                  <Tab
                    label="Gitea"
                    icon={<SyncOutlinedIcon />}
                    {...a11yProps(2)}
                  />
                </Tabs>
              </AppBar>
              <TabPanel value={value} index={0} dir={theme.direction}>
                <Dropzone />
              </TabPanel>
              <TabPanel value={value} index={1} dir={theme.direction}>
                Paratext
              </TabPanel>
              <TabPanel value={value} index={2} dir={theme.direction}>
                <Gitea data={dragValue} onDrop={(e) => { dropHere(e); }} />
              </TabPanel>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}
