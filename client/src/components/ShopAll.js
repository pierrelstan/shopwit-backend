import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Box, CircularProgress } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { Button } from '@material-ui/core';
import FavoriteSharpIcon from '@material-ui/icons/FavoriteSharp';
import RemoveShoppingCartSharpIcon from '@material-ui/icons/RemoveShoppingCartSharp';
import { Link as RouterLink } from 'react-router-dom';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { addToCart, allCarts, removeCart } from '../redux/actions/ItemsActions';
import { addToFavorites, removeFavorites } from '../redux/actions/favorites';
const useStyles = makeStyles((theme) => ({
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  containerItems: {
    display: 'grid',
    gridTemplateColumns: '347px 347px 347px ',
    // gridTemplateRows: '1fr 1fr',
    gap: '20px',
    // margin: 0,
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: '247px',
    },

    [theme.breakpoints.only('md')]: {
      gridTemplateColumns: '300px 300px',
      margin: 0,
    },
    [theme.breakpoints.between('sm', 'md1030')]: {
      gridTemplateColumns: '300px 300px',
      margin: 0,
    },
    [theme.breakpoints.only('sm')]: {
      gridTemplateColumns: '250px 250px',
      margin: 0,
    },
  },
  textLink: {
    textDecoration: 'none',
    color: '#333',
  },

  main: {
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      margin: ' 30px',
      justifyContent: 'center',
    },
  },
  card: {
    height: '337px',

    position: 'relative',
    borderRadius: '24px',
    transition: '0.5s ease-in-out ',
    zIndex: 1,
    boxShadow:
      ' 0 5px 10px rgba(154,160,185,.05), 0 15px 40px rgba(166,173,201,.2)',
    '&:hover': {
      position: 'inherit',
      boxShadow:
        'linear-gradient(to bottom, rgba(0,176,155,1.8), rgba(150,201,61,2))',
      transform: 'translateY(20px)',
    },
    '&:hover:before': {
      opacity: 1,
    },
    '&:before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      display: 'block',
      width: '100%',
      height: '100%',
      zIndex: 2,
      transition: '0.5s all',
      opacity: 0,
      // background: 'linear-gradient(to bottom, rgba(0,0,0,0.6),rgba(0,0,0,0.2))',
      background:
        'linear-gradient(to bottom, rgb(0 0 0 / 44%),rgb(0 0 0 / 67%))',
    },
    '&:hover $price': {
      background: '#fff',
      color: '#333',
    },
    '& a': {
      display: 'none',
    },
    '&:hover a': {
      display: 'block',
    },
    '& p': {
      position: 'absolute',
      top: '100px',
      zIndex: 2,
      color: '#fff',
      opacity: 0,
      transform: 'translateY(30px)',
      transition: '0.5s all',
      fontSize: '14px',
      wordWrap: 'break-all',
      display: 'none',
    },
    '&:hover p': {
      display: 'block',
      opacity: 1,
      transform: 'translateY(0px)',
    },

    '& h1': {
      textTransform: 'uppercase',
      position: 'absolute',
      top: '20px',
      zIndex: 3,
      color: '#fff',
      opacity: 0,
      transform: 'translateY(30px)',
      transition: '0.5s all',
    },
    '&:hover h1': {
      opacity: 1,
      transform: 'translateY(0px)',
    },
    '& button': {
      position: 'relative',
      top: `${-437}px`,
      zIndex: 4,
      color: '#fff',
      opacity: 0,
      transform: 'translateY(30px)',
      transition: '0.5s all',
    },

    '&:hover button': {
      opacity: 1,
      transform: 'translateY(0px)',
    },
  },
  imageCard: {
    width: '100%',
    height: 'auto',
    MaxWidth: '347px',
    position: 'relative',
    top: '-175px',
    objectFit: 'cover',
    '&:hover': {
      boxShadow: 'none',
    },
    [theme.breakpoints.between('sm', 'lg')]: {
      objectFit: 'cover',
    },
    [theme.breakpoints.only('xs')]: {
      objectFit: 'contain',
      // width: '145px',
      position: 'relative',
      top: '-89px',
      // left: '58px',
    },
    [theme.breakpoints.up('sm')]: {
      objectFit: 'cover',
    },
    [theme.breakpoints.down('sm')]: {
      objectFit: 'cover',
      top: '-180px',
    },
    [theme.breakpoints.down('sm')]: {
      objectFit: 'cover',
      top: '-130px',
    },
  },
  removeHover: {
    backgroundColor: 'none',
    '&:focus': {
      boxShadow: 'none',
      backgroundColor: 'none',
    },
  },
  price: {
    color: '#ffffff',
    borderRadius: '50%',
    backgroundColor: '#d13c6f',
    width: '60px',
    height: '60px',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '18px',
    zIndex: 2,
    boxShadow:
      '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
  },
  centered: {
    display: 'flex',
    justifyContent: 'center',
  },
  containerButton: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '322px',
    top: '200px',

    // [theme.breakpoints.down('xs')]: {
    //   position: 'relative',
    //   top: '120px',
    // },
    // [theme.breakpoints.down('380')]: {
    //   position: 'relative',
    //   top: '70px',
    // },
    // [theme.breakpoints.only('sm')]: {
    //   position: 'relative',
    //   top: '-40px',
    // },
  },
}));
function ShopAll({
  addToCart,
  removeCart,
  removeFavorites,
  itemsPerPages,
  favorites,
  carts,
  addToFavorites,
}) {
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('xs'));
  const [Favs, setFavs] = React.useState([]);
  const [Carts, setCarts] = React.useState([]);

  React.useEffect(() => {
    const favs = favorites.allFavorites;
    const Carrts = carts.allCarts;

    setFavs([...favs]);
    setCarts([...Carrts]);
  }, [carts.allCarts, favorites.allFavorites]);

  const handleRemoveFavorite = React.useCallback(
    (id) => {
      let fav = Favs.find((item) => item.item._id === id);
      removeFavorites(fav._id);
    },
    [Favs, removeFavorites],
  );

  const hanldeRemoveCart = React.useCallback(
    (id) => {
      let cart = Carts.filter((item) => item.item._id === id);
      removeCart(cart[0]._id);
    },
    [Carts, removeCart],
  );

  const handleAddCart = React.useCallback(
    (id) => {
      addToCart(id);
    },
    [addToCart],
  );

  const handleAddFavorites = React.useCallback(
    (id) => {
      addToFavorites(id);
    },
    [addToFavorites],
  );

  const DisplayFavoriteIcon = (id) => (
    <div>
      {Favs.findIndex((item) => item.item._id === id) !== -1 ? (
        <FavoriteSharpIcon
          onClick={() => handleRemoveFavorite(id)}
          style={{
            fontSize: 62,
            color: '#cb436b',
          }}
        />
      ) : (
        <FavoriteBorderIcon
          style={{
            fontSize: 62,
          }}
          onClick={() => handleAddFavorites(id)}
        />
      )}
    </div>
  );

  const DisplayShoppingIcon = (id) => {
    if (Carts.findIndex((item) => item.item._id === id) !== -1) {
      return (
        <AddShoppingCartIcon
          onClick={() => hanldeRemoveCart(id)}
          style={{
            fontSize: 62,
            color: '#4BB543',
          }}
        />
      );
    } else {
      return (
        <RemoveShoppingCartSharpIcon
          style={{
            fontSize: 62,
          }}
          onClick={() => handleAddCart(id)}
        />
      );
    }
  };
  if (itemsPerPages.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
        }}
      >
        <CircularProgress color='secondary' />
      </div>
    );
  }
  return (
    <div className={classes.main}>
      <Grid className={classes.containerItems}>
        {itemsPerPages &&
          itemsPerPages.map((data) => (
            <Card
              className={classes.card}
              key={data.title}
              elevation={matches ? 1 : 0}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  padding: '20px',
                }}
              >
                <Typography component='span' className={classes.price}>
                  ${data.price}
                </Typography>
              </div>

              <img
                alt={data.title}
                src={data.imageUrl}
                title={data.title}
                className={classes.imageCard}
              />
              <Link
                component={RouterLink}
                to={`/item/${data._id}`}
                className={classes.textLink}
              >
                <CardContent>
                  <div>
                    <h1>{data.title}</h1>
                  </div>
                  <p>{data.description}</p>
                </CardContent>
              </Link>
              <div className={classes.containerButton}>
                <div>
                  <Box>
                    <div className={classes.textLink}>
                      <Button className={classes.button}>
                        {DisplayFavoriteIcon(data._id)}
                      </Button>
                    </div>
                  </Box>
                </div>
                <div>
                  <Box>
                    <div>
                      <Button className={classes.button}>
                        {DisplayShoppingIcon(data._id)}
                      </Button>
                    </div>
                  </Box>
                </div>
              </div>
            </Card>
          ))}
      </Grid>
    </div>
  );
}

const mapStateToProps = (state) => ({
  items: state.items,
  carts: state.carts,
  favorites: state.favorites,
});

export default withRouter(
  connect(mapStateToProps, {
    addToCart,
    allCarts,
    removeCart,
    removeFavorites,
    addToFavorites,
  })(ShopAll),
);
