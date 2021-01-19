import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import { useHistory } from 'react-router-dom';
import Wrapper from './Wrapper';
import Titles from './Titles';

const images = [
  {
    id: 0,
    url:
      'https://res.cloudinary.com/stanley/image/upload/v1593138547/sickfits/ben-rosett-WdJkXFQ4VHY-unsplash.jpg',
    title: 'Men',
    width: '40%',
    height: '550px',
    margin: '0px',
  },
  {
    id: 1,
    url:
      'https://res.cloudinary.com/stanley/image/upload/v1593138171/sickfits/freestocks-VFrcRtEQKL8-unsplash.jpg',
    title: 'Woman',
    width: '30%',
    height: '550px',
    margin: '40px',
  },
  {
    id: 3,
    url:
      'https://res.cloudinary.com/stanley/image/upload/v1610430022/kelly-sikkema-EcvLKMVvd4s-unsplash_qmqthx.jpg',
    title: 'Children',
    width: '30%',
    height: '550px',
    margin: '0px',
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  image: {
    position: 'relative',
    height: '300px',
    [theme.breakpoints.down('xs')]: {
      width: '100% !important', // Overrides inline-style
      height: ' 253px !important',
      margin: '0px !important',
    },
    [theme.breakpoints.up('sm')]: {
      width: '30% !important', // Overrides inline-style
      height: '400px',
    },
    [theme.breakpoints.down('600px')]: {
      width: '30% !important', // Overrides inline-style
      height: '400px',
      margin: '0px !important',
    },

    '&:hover, &$focusVisible': {
      zIndex: 1,
      '& $imageBackdrop': {
        opacity: 0.15,
      },
      '& $imageMarked': {
        opacity: 0,
      },
      '& $imageTitle': {
        border: '4px solid #fff',
      },
    },
  },
  focusVisible: {},
  imageButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white,
    backgroundImage: 'linear-gradient(#a67a4b66,rgba(0, 0, 0, 0.87))',
  },
  imageSrc: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center 40%',
  },
  imageBackdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.4,
    transition: theme.transitions.create('opacity'),
  },
  imageTitle: {
    position: 'relative',
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px ${
      theme.spacing(1) + 6
    }px`,
  },
  imageMarked: {
    height: 3,
    width: 18,
    backgroundColor: theme.palette.common.white,
    position: 'absolute',
    bottom: -2,
    left: 'calc(50% - 9px)',
    transition: theme.transitions.create('opacity'),
  },
}));

function MenuNavigation({ items }) {
  let history = useHistory();
  const classes = useStyles();
  const [Data, setData] = useState([]);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      setData([...images]);
    }
    return () => {
      console.log('unmo false');
      mounted = false;
    };
  }, []);

  const handleClick = (image) => {
    history.push(`/${image.title.toLowerCase()}`);
  };

  return (
    <Wrapper>
      <Titles>DISCOVER THE COLLECTIONS</Titles>
      <div className={classes.root}>
        {Data &&
          Data.map((image) => (
            <ButtonBase
              focusRipple
              key={image.id}
              className={classes.image}
              focusVisibleClassName={classes.focusVisible}
              onClick={() => handleClick(image)}
              style={{
                width: image.width,
                height: image.height,
                margin: image.margin,
              }}
            >
              <span
                className={classes.imageSrc}
                style={{
                  backgroundImage: `url(${image.url})`,
                }}
              />
              <span className={classes.imageBackdrop} />
              <span className={classes.imageButton}>
                <Typography
                  component='span'
                  variant='subtitle1'
                  color='inherit'
                  className={classes.imageTitle}
                >
                  {image.title} ({items.items.length})
                  <span className={classes.imageMarked} />
                </Typography>
              </span>
            </ButtonBase>
          ))}
      </div>
    </Wrapper>
  );
}

const mapStateToProps = (state) => ({
  items: state.items,
  carts: state.RootCarts,
  favorites: state.favorites,
});

export default connect(mapStateToProps, null)(MenuNavigation);
