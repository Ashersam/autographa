import React from 'react';
import Router from 'next/router';
import NProgress from 'nprogress';
import DescriptionIcon from '@material-ui/icons/Description';
import SettingsIcon from '@material-ui/icons/Settings';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import {
  IconButton, Badge, List, ListItem, ListItemIcon, ListItemText, Avatar,
} from '@material-ui/core';
import { Notifications } from '@material-ui/icons';
import ApplicationBar from '../ApplicationBar/ApplicationBar';

Router.onRouteChangeStart = () => {
  NProgress.start();
};

Router.onRouteChangeComplete = () => {
  NProgress.done();
};

Router.onRouteChangeError = () => {
  NProgress.done();
};

export default function ProjectsDrawer() {
  const buttons = (
    <IconButton color="inherit">
      <Badge badgeContent={17} color="secondary">
        <Notifications />
      </Badge>
    </IconButton>
  );
  const showIcon = (index) => {
    switch (index) {
      case 0:
        return <AddCircleIcon fontSize="large" />;
      case 1:
        return <DescriptionIcon fontSize="large" />;
      case 2:
        return <SettingsIcon fontSize="large" />;
      default:
        return <Avatar alt="My Avatar" />;
    }
  };

  const drawerMenu = (
    <List>
      {['New', 'Project List', 'Sync', 'Profile'].map((text, index) => (
        <ListItem style={{ marginBottom: '20px' }} button key={text}>
          <ListItemIcon style={{ margin: 0 }}>
            {showIcon(index)}
          </ListItemIcon>
          <ListItemText primary={text} />
        </ListItem>
      ))}
    </List>
  );

  return (
    <ApplicationBar
      title="Autographa"
      buttons={buttons}
      drawerMenu={drawerMenu}
    />
  );
}