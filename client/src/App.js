import React, { Fragment } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  HashRouter,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import axios from 'axios';
import './App.css';
import Home from './pages/home';
import Navbar from './components/Navbar';
import AuthLinks from './components/AuthLinks';
import GuestLinks from './components/GuestLinks';
import { loadUser, logout } from './redux/actions/auth';
import {
  allCarts,
  fetchItemsByUserId,
  fetchItems,
  fetchLastProducts,
} from './redux/actions/ItemsActions';
import { allFavorites } from './redux/actions/favorites';
import Login from './pages/Login';
import Profile from './pages/profile';
import NoMatch from './components/NoMatch';
import { MemoAlert } from './components/Alert';
import SignUp from './pages/SignUp';
import ProtectedRoutes from './components/protectedRoutes/Protected';
import store from './redux/store/store';
import Sell from './pages/Sell';
import EditItem from './pages/EditItem';
import Item from './pages/Item';
import Footer from './components/Footer';
import Shop from './pages/shop';
import Woman from './pages/woman';
import Men from './pages/men';
import Shoes from './pages/shoes';
import NewPassword from './components/NewPassword';
import ResetPassword from './components/ResetPassword';
import MyProducts from './pages/MyProducts';
import Orders from './pages/orders';
import Dashboard from './pages/dashboard';
import MobileNavbar from './components/MobileNavbar';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  hideOnDeskTop: {
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
    [theme.breakpoints.up('600px')]: {
      display: 'none',
    },
  },
  centeredLogo: {
    textAlign: 'center',
  },
  logo: {
    textTransform: 'upperCase',
    textDecoration: 'none',
    color: '#333',
  },
}));

function App(props) {
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('xs'));

  React.useEffect(() => {
    const source = axios.CancelToken.source();

    if (props.token) {
      store.dispatch(loadUser());
      store.dispatch(fetchItemsByUserId(props.userId));
    }
  }, [props.token, props.userId]);

  return (
    <Router>
      {/* <ScrollOnTop /> */}
      <div className={classes.root}>
        <Navbar>
          {!props.loading && (
            <Fragment>{props.active ? <AuthLinks /> : <GuestLinks />}</Fragment>
          )}
        </Navbar>

        <MemoAlert />

        <Switch>
          <Route exact path='/' render={(props) => <Home {...props} />} />
          <Route exact path='/login' render={(props) => <Login {...props} />} />
          <Route
            exact
            path='/register'
            render={(props) => <SignUp {...props} />}
          />
          <ProtectedRoutes exact path='/profile' component={Profile} />
          <ProtectedRoutes exact path='/orders' component={Orders} />
          <ProtectedRoutes exact path='/dashboard' component={Dashboard} />
          <ProtectedRoutes exact path='/item/new' component={Sell} />
          <ProtectedRoutes exact path='/item/update/:id' component={EditItem} />
          <ProtectedRoutes exact path='/item/:id' component={Item} />
          <Route exact path='/newpassword/:id' component={NewPassword} />
          <Route exact path='/myproducts' component={MyProducts} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/resetpassword' component={ResetPassword} />
          <Route exact path='/shop' component={Shop} />
          <Route exact path='/woman' component={Woman} />
          <Route exact path='/men' component={Men} />
          <Route exact path='/shoes' component={Shoes} />
          <Route path='*' component={NoMatch} />
        </Switch>
      </div>

      {matches && <MobileNavbar />}
      {!matches && <Footer />}
    </Router>
  );
}

const mapStateToProps = (state) => {
  const {
    auth: { isAuthenticated },
    loading,
    logout,
  } = state;
  return {
    isAuthenticated: isAuthenticated,
    loading: loading,
    active: state.auth.user.active,
    values: state.scrollValues.values,
    carts: state.carts.allCarts,
    logout: logout,
    items: state.items,
    userId: state.auth.user._id,
    open: state.openFavoritesAndClosing.open,
    token: state.auth.token,
  };
};
export default connect(mapStateToProps, {
  allCarts,
  loadUser,
  logout,
  fetchItems,
  allFavorites,
  fetchLastProducts,
})(App);
