import React from 'react';
// import { FixedSizeList as List } from 'react-window';
import { connect } from 'react-redux';
import { useHistory, withRouter } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import {
  addToCart,
  removeCart,
  fetchItems,
} from '../redux/actions/ItemsActions';
import { addToFavorites, removeFavorites } from '../redux/actions/favorites';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Box, Button } from '@material-ui/core';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import CircularProgress from '@material-ui/core/CircularProgress';
import Wrapper from './Wrapper';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import FavoriteSharpIcon from '@material-ui/icons/FavoriteSharp';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import RemoveShoppingCartSharpIcon from '@material-ui/icons/RemoveShoppingCartSharp';
import Titles from './Titles';

const useStyles = makeStyles((theme) => ({
  media: {
    height: 0,
  },
  container: {
    width: 'auto',
    margin: 0,
    [theme.breakpoints.between('1200', '1368')]: {
      width: '1080px',
      margin: '0 auto',
    },
  },
  containerItems: {
    display: 'grid',
    gridTemplateColumns: '320px 320px 320px 320px',
    justifyItems: 'center',
    gap: '42px',
    margin: '20px',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
      gridTemplateColumns: '1fr 1fr',
    },
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center',
      gridTemplateColumns: '1fr 1fr',
    },
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'center',
      gridTemplateColumns: '320px',
    },
    [theme.breakpoints.between('1200', '1368')]: {
      gridTemplateColumns: '320px 320px 320px',
    },
  },
  textLink: {
    textDecoration: 'none',
    color: '#333',
    '&:hover': {
      textDecoration: 'none',
    },
  },
  imageCard: {
    // width: '100%',
    // height: 'auto',
    maxWidth: '317px',
    verticalAlign: 'middle',
    position: 'relative',
    top: ' -89px',
    objectFit: 'cover',
    margin: 0,
    padding: 0,
    width: '322px',
    height: '304px',
    zIndex: 1,
    // objectFit: 'cover',
    '&:hover': {
      boxShadow: 'none',
    },
    [theme.breakpoints.between('sm', 'lg')]: {
      objectFit: 'cover',
    },
    [theme.breakpoints.only('xs')]: {
      objectFit: 'contain',
      position: 'relative',
      top: '-89px',
    },
    [theme.breakpoints.up('sm')]: {
      objectFit: 'cover',
    },
    [theme.breakpoints.down('sm')]: {
      objectFit: 'cover',
      top: '-180px',
    },
    [theme.breakpoints.down('md')]: {
      objectFit: 'cover',
      top: '-130px',
    },
  },
  card: {
    maxWidth: '327px',
    height: '337px',
    position: 'relative',
    borderRadius: '24px',
    transition: '0.5s ease-in-out ',
    zIndex: 1,
    // background: 'linear-gradient(to bottom, rgb(0 0 0 / 4%),rgb(0 0 0 / 67%))',
    [theme.breakpoints.down('xs')]: {
      width: '277px',
      height: '296px',
    },
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
      borderRadius: '24px',
      background:
        'linear-gradient(to bottom, rgb(0 0 0 / 14%),rgb(0 0 0 / 87%))',
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
  button: {
    color: '#fff !important',
    objectFit: 'filled',
    margin: '20px',
    padding: '10px 20px',
    borderRadius: '5px',
    transition: '1s cubic-bezier(0.2, 0.8, 0.2, 1)',
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
    position: 'relative',
    width: '322px',
    top: '200px',
  },
}));

const DisplayShoppingIcon = ({
  Carts,
  id,
  hanldeRemoveCart,
  handleAddCart,
}) => {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    let carts = Carts && Carts.findIndex((item) => item.item._id === id) !== -1;
    if (carts) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [Carts, id]);
  return (
    <div>
      {show ? (
        <AddShoppingCartIcon
          onClick={() => hanldeRemoveCart(id)}
          style={{
            fontSize: 62,
            color: '#4BB543',
          }}
        />
      ) : (
        <ShoppingCartIcon
          style={{
            fontSize: 62,
          }}
          onClick={() => handleAddCart(id)}
        />
      )}
    </div>
  );
};

const DisplayFavoriteIcon = ({
  id,
  Favs,
  handleRemoveFavorite,
  handleAddFavorites,
}) => {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    let favs = Favs && Favs.findIndex((item) => item.item._id === id) !== -1;
    if (favs) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [Favs, id]);

  return (
    <div>
      {show ? (
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
};

function PopularProducts({
  removeCart,
  removeFavorites,
  addToCart,
  addToFavorites,
  carts,
  items,
  favorites,
  fetchItems,
  lastProducts,
}) {
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('xs'));
  let history = useHistory();

  let fetchAllItems = React.useRef(() => {});

  fetchAllItems.current = () => {
    fetchItems();
  };

  // React.useEffect(() => {
  //   // fetchAllItems.current();
  // }, []);

  const handleRemoveFavorite = React.useCallback(
    (id) => {
      let fav = favorites.allFavorites.find((item) => item.item._id === id);
      removeFavorites(fav._id);
    },
    [favorites.allFavorites, removeFavorites],
  );

  const hanldeRemoveCart = React.useCallback(
    (id) => {
      let cart = carts.allCarts.filter((item) => item.item._id === id);
      const { _id } = cart[0];
      removeCart(_id);
    },
    [carts.allCarts, removeCart],
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
  const handleViewAllClick = () => {
    history.push('/shop');
  };

  if (!items) {
    return (
      <Wrapper>
        <Titles>LAST PRODUCTS</Titles>
        <div>
          <CircularProgress color='secondary' />
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Titles>LAST PRODUCTS</Titles>
      <div className={classes.container}>
        <div className={classes.containerItems}>
          {lastProducts &&
            lastProducts.map((data) => (
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
                    <p>
                      <span>{data.description}</span>
                    </p>
                  </CardContent>
                </Link>
                <div className={classes.containerButton}>
                  <div>
                    <Box>
                      <div>
                        <Button className={classes.button}>
                          <DisplayFavoriteIcon
                            id={data._id}
                            Favs={favorites.allFavorites}
                            handleAddFavorites={handleAddFavorites}
                            handleRemoveFavorite={handleRemoveFavorite}
                          />
                        </Button>
                      </div>
                    </Box>
                  </div>
                  <div>
                    <Box>
                      <div className={classes.textLink}>
                        <Button className={classes.button}>
                          <DisplayShoppingIcon
                            Carts={carts.allCarts}
                            id={data._id}
                            handleAddCart={handleAddCart}
                            hanldeRemoveCart={hanldeRemoveCart}
                          />
                        </Button>
                      </div>
                    </Box>
                  </div>
                </div>
              </Card>
            ))}
        </div>

        <div
          style={{
            marginTop: '100px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Button
            variant='outlined'
            style={{
              color: '#d13c6f',
              borderColor: '#d13c6f',
              padding: '8px 42px',
            }}
            onClick={handleViewAllClick}
          >
            View all
          </Button>
        </div>
      </div>
    </Wrapper>
  );
}

const mapStateToProps = (state) => ({
  items: state.items.lastProducts,
  lastProducts: state.items.lastProducts,
  carts: state.carts,
  favorites: state.favorites,
});

export default withRouter(
  connect(mapStateToProps, {
    addToCart,
    addToFavorites,
    removeFavorites,
    removeCart,
    fetchItems,
  })(PopularProducts),
);