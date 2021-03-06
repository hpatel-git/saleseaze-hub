import React from 'react';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Hidden from '@material-ui/core/Hidden';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
// @material-ui/icons
import Person from '@material-ui/icons/Person';
import Dashboard from '@material-ui/icons/Dashboard';
import Search from '@material-ui/icons/Search';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
// core components
import CustomInput from '../CustomInput/CustomInput';
import Button from '../CustomButtons/Button';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import headerLinksStyle from '../../assets/jss/material-dashboard-react/components/headerLinksStyle';
import NavbarAlerts from './NavbarAlerts';

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white
      }
    }
  }
}))(MenuItem);

interface Props {
  classes: any;
  handleLogout: () => any;
}

class HeaderLinks extends React.Component<Props, {}> {
  anchorEl: any;
  userAnchorEl: any;

  state = {
    open: false,
    isUserActionOpen: false
  };

  handleToggle = () => {
    this.setState({ open: !this.state.open });
  };

  handleClose = (event: any) => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }

    this.setState({ open: false });
  };

  handleUserActionToggle = () => {
    this.setState({ isUserActionOpen: !this.state.isUserActionOpen });
  };

  handleUserActionClose = (event: any) => {
    if (this.userAnchorEl.contains(event.target)) {
      return;
    }
    this.setState({ isUserActionOpen: false });
  };

  handleLogoutAction = (event: any) => {
    this.props.handleLogout();
    this.handleUserActionClose(event);
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <div className={classes.searchWrapper}>
          <CustomInput
            formControlProps={{
              className: classes.margin + ' ' + classes.search
            }}
            inputProps={{
              placeholder: 'Search',
              inputProps: {
                'aria-label': 'Search'
              }
            }}
          />
          <Button color="white" aria-label="edit" justIcon={true} round={true}>
            <Search />
          </Button>
        </div>
        <Button
          color={window.innerWidth > 959 ? 'transparent' : 'white'}
          justIcon={window.innerWidth > 959}
          simple={!(window.innerWidth > 959)}
          aria-label="Dashboard"
          className={classes.buttonLink}
        >
          <Dashboard className={classes.icons} />
          <Hidden mdUp={true} implementation="css">
            <p className={classes.linkText}>Dashboard</p>
          </Hidden>
        </Button>
        <div className={classes.manager}>
          <NavbarAlerts />
        </div>
        <ClickAwayListener onClickAway={this.handleUserActionClose}>
          <Menu
            elevation={0}
            getContentAnchorEl={null}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center'
            }}
            id="user-action-menu"
            anchorEl={this.userAnchorEl}
            keepMounted
            open={this.state.isUserActionOpen}
            onClose={this.handleUserActionClose}
          >
            <StyledMenuItem onClick={this.handleLogoutAction}>
              <ListItemIcon>
                <ExitToAppIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </StyledMenuItem>
          </Menu>
        </ClickAwayListener>
        <Button
          color={window.innerWidth > 959 ? 'transparent' : 'white'}
          justIcon={window.innerWidth > 959}
          simple={!(window.innerWidth > 959)}
          aria-label="Person"
          buttonRef={(node: any) => {
            this.userAnchorEl = node;
          }}
          className={classes.buttonLink}
          onClick={this.handleUserActionToggle}
        >
          <Person className={classes.icons} />
          <Hidden mdUp={true} implementation="css">
            <p className={classes.linkText}>Profile</p>
          </Hidden>
        </Button>
      </div>
    );
  }
}

export default withStyles(headerLinksStyle)(HeaderLinks);
