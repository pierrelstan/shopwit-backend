import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Titles from '../components/Titles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import WorkIcon from '@material-ui/icons/Work';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import Divider from '@material-ui/core/Divider';
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  container: {
    marginLeft: '40px',
  },
}));

export default function Orders() {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Titles>Orders history</Titles>
      <div>
        <List className={classes.root}>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <ImageIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary='Photos' secondary='Jan 9, 2014' />
          </ListItem>
          <Divider variant='inset' component='li' />
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <WorkIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary='Work' secondary='Jan 7, 2014' />
          </ListItem>
          <Divider variant='inset' component='li' />
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <BeachAccessIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary='Vacation' secondary='July 20, 2014' />
          </ListItem>
        </List>
      </div>
    </div>
  );
}
