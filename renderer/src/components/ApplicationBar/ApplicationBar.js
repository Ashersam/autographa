import React from 'react';
import PropTypes from 'prop-types';
import {
  AppBar,
  CssBaseline,
  Toolbar,
  Typography,
} from '@material-ui/core';

import { useStyles } from './useStyles';
import DrawerMenu from './DrawerMenu';

function ApplicationBar({
  title,
  buttons,
  drawerMenu,
  appBarStyle,
  theme,
}) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={classes.appBar}
        style={appBarStyle || {}}
        color={theme || ''}
      >
        <Toolbar>
          <Typography
            variant="h6"
            data-testid="app-title"
            noWrap
          >
            {title}
          </Typography>
          <div className={classes.grow} />
          <span data-testid="app-buttons">
            {buttons}
          </span>
        </Toolbar>
      </AppBar>
      {drawerMenu && (
        <DrawerMenu open classes={classes} direction="left">
          {drawerMenu}
        </DrawerMenu>
      )}
    </div>
  );
}

ApplicationBar.propTypes = {
  /** The title string or jsx to be displayed. */
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  /** Additional buttons to be displayed. */
  buttons: PropTypes.element,
  /** Component to render inside of the drawer menu. */
  drawerMenu: PropTypes.element,
  /** Drawer menu props. */
  appBarStyle: PropTypes.object,
  theme: PropTypes.string,
};

export default ApplicationBar;
