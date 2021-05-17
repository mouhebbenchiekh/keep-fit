/*eslint-disable*/
import React from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
// react components for routing our app without refresh
import { Link } from "react-router-dom";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Tooltip from "@material-ui/core/Tooltip";

// @material-ui/icons
import { Apps, CloudDownload } from "@material-ui/icons";

// core components
import CustomDropdown from "components/CustomDropdown/CustomDropdown.js";
import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/material-kit-react/components/headerLinksStyle.js";

const useStyles = makeStyles(styles);

export default function HeaderLinks(props) {
  const classes = useStyles();
  return (
    <List className={classes.list}>
    
      <ListItem className={classes.listItem}>
        <Button
          
          color="transparent"
          target="_blank"
          className={classes.navLink}
        >
          <Link to="/results" style={{color:"inherit"}}>
           results
           </Link>
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button
          
          color="transparent"
          target="_blank"
          className={classes.navLink}
        >
           <Link to="/events" style={{color:"inherit"}}>events</Link>
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button
          
          color="transparent"
          target="_blank"
          className={classes.navLink}
        >
          <Link to="/parks" style={{color:"inherit"}}>reserve</Link>
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button
         
          color="transparent"
          target="_blank"
          className={classes.navLink}
        >
          <Link to="/gyms"style={{color:"inherit"}}> subscribe </Link>
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button
         
          color="transparent"
          target="_blank"
          className={classes.navLink}
        >
          <Link to="/" style={{color:"inherit"}}> coaches </Link>
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button
          
          color="transparent"
          target="/profile-page"
          className={classes.navLink}
        >
          <Link to="/login-page" style={{color:"inherit"}}> login</Link> 
        </Button>
      </ListItem>
      
    </List>
  );
}
