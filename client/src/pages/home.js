import React from 'react';
import { connect } from 'react-redux';

import Hero from '../components/Hero';
import Navigation from '../components/MenuNavigation';
import PopularProducts from '../components/PopularProducts';
import Wrapper from '../components/Wrapper';
import MostRated from '../components/MostRated';
import NewArrivals from '../components/NewArrivals';
import NewsLetters from '../components/NewsLetter';
import Services from '../components/Services';
import { allFavorites } from '../redux/actions/favorites';
import { fetchItemsByUserId, allCarts } from '../redux/actions/ItemsActions';
import store from '../redux/store/store';
const Home = ({
  fetchItemsByUserId,
  allCarts,
  allFavorites,
  auth,
  items,
  carts,
  favorites,
}) => {
  const [Favs, setFavs] = React.useState([]);
  const [Carts, setCarts] = React.useState([]);
  // It takes a function
  React.useEffect(() => {
    // This gets called after every render, by default
    // (the first one, and every one after that)

    // allCarts(auth.user._id);
    // allFavorites(auth.user._id);
    // fetchItemsByUserId(auth.user._id);

    console.log('render!');

    // If you want to implement componentWillUnmount,
    // return a function from here, and React will call
    // it prior to unmounting.
    return () => {
      console.log('unmounting...');
    };
  }, [
    allCarts,
    allFavorites,
    auth.token,
    auth.user._id,
    carts.allCarts,
    favorites.allFavorites,
    fetchItemsByUserId,
    items.items,
  ]);
  return (
    <div>
      <Wrapper>
        <Hero />
      </Wrapper>
      <Navigation />
      <PopularProducts />
      <NewsLetters />
      <MostRated />
      <Services />
      <NewArrivals />
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  items: state.items,
  carts: state.carts,
  favorites: state.favorites,
});

export default connect(mapStateToProps, {
  fetchItemsByUserId,
  allCarts,
  allFavorites,
})(Home);
