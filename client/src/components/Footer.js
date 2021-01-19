import React from 'react';
import Typography from '@material-ui/core/Typography';
import Subscribe from './Subscribe';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import TwitterIcon from '@material-ui/icons/Twitter';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import { IconButton } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  main_Container: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr ',
    justifyItems: 'center',
    alignItems: 'center',
    paddingTop: '100px',
    [theme.breakpoints.down('xs')]: {
      rowGap: '33px',
      display: 'grid',
      gridTemplateColumns: '1fr',
    },
    [theme.breakpoints.down('792')]: {
      rowGap: '33px',
      display: 'grid',
      gridTemplateColumns: '1fr',
    },
  },
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr ',
    // justifyItems: 'center',
    color: '#454754',

    [theme.breakpoints.down('xs')]: {
      rowGap: '33px',
      display: 'grid',
      gridTemplateColumns: '1fr',
      textAlign: 'center',
    },
  },
  title: {
    fontWeight: '700',
    color: '#fff',
  },
  textColor: {
    color: '#fff',
    listStyleType: 'none',
    padding: 0,
  },
  titleLogo: {
    border: '3px solid #fff',
    width: '261px',
    padding: '10px',
    textTransform: 'uppercase',
    color: '#fff',
    textAlign: 'center',
  },

  containerIcons: {
    textAlign: 'center',
    margin: '17px',
    color: '#fff',
  },
}));

export default function Footer(props) {
  const classes = useStyles();
  return (
    <div
      style={{
        backgroundColor: '#333',
        padding: '20px',
      }}
    >
      <div className={classes.main_Container}>
        <div>
          <Typography variant='h3' className={classes.titleLogo}>
            Shopwit
          </Typography>
          <div className={classes.containerIcons}>
            <IconButton
              aria-label='account of current user'
              aria-controls='primary-search-account-menu'
              aria-haspopup='true'
              color='inherit'
            >
              <FacebookIcon />
            </IconButton>
            <IconButton
              aria-label='account of current user'
              aria-controls='primary-search-account-menu'
              aria-haspopup='true'
              color='inherit'
            >
              <TwitterIcon />
            </IconButton>
            <IconButton
              aria-label='account of current user'
              aria-controls='primary-search-account-menu'
              aria-haspopup='true'
              color='inherit'
            >
              <InstagramIcon />
            </IconButton>
            <IconButton
              aria-label='account of current user'
              aria-controls='primary-search-account-menu'
              aria-haspopup='true'
              color='inherit'
            >
              <LinkedInIcon />
            </IconButton>
          </div>
        </div>
        <div style={{ marginTop: '50px' }}>
          <div className={classes.container}>
            <div>
              <Typography variant='h6' className={classes.title}>
                QUICK LINKS
              </Typography>
              <ul className={classes.textColor}>
                {['Sell online', 'Shopping cart'].map((link) => (
                  <li key={link}>{link}</li>
                ))}
              </ul>
            </div>
            <div>
              <Typography variant='h6' className={classes.title}>
                CONTACT INFO{' '}
              </Typography>
              <ul className={classes.textColor}>
                {['Sell online', 'Shopping cart'].map((link) => (
                  <li key={link}>{link}</li>
                ))}
              </ul>
              <div>
                <Divider style={{ marginTop: '20px', marginBottom: '20px' }} />
                <Typography variant='h6' className={classes.title}>
                  SUBSCRIBE
                </Typography>
                <Subscribe />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          width: '100%',
          textAlign: 'center',
          paddingTop: '30px',
        }}
      >
        <p
          style={{
            color: '#fff',
            margin: 0,
          }}
        >
          &copy; {new Date().getFullYear()} All rights reserved | Stanley Pierre
          Louis
        </p>
      </div>
    </div>
  );
}