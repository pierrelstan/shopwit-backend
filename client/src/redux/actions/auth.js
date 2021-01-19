import axios from 'axios';
import axiosCancel from 'axios-cancel';
import { bindActionCreators } from 'redux';
import {
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  USER_LOAD,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  NEW_PASSWORD,
  NEW_PASSWORD_FAIL,
  UPDATE_PROFILE,
  UPDATE_PROFILE_FAIL,
  REMOVE_UPDATE_SUCCESS_MESSAGE,
} from './types';
import { allCarts, fetchItemsByUserId } from './ItemsActions';
import { allFavorites } from './favorites';
import { setAlert } from './alert';
import setAuthToken from '../../utils/setAuthToken';

// Load user
export const loadUser = () => (dispatch) => {
  let config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  let token = localStorage.getItem('token');

  if (token) {
    setAuthToken(token);
  }
  axios
    .get('/auth', config)
    .then((res) => {
      dispatch({
        type: USER_LOAD,
        payload: res.data,
      });
    })
    .catch((err) => {
      try {
        const errors = err.response;
        if (errors) {
          errors.data.forEach((error) =>
            dispatch(setAlert(error.errors.msg, 'warning')),
          );
        }
        dispatch({
          type: AUTH_ERROR,
        });
      } catch (e) {
        console.log(e);
      }
    });
  return axios.cancel(config);
};

// register user
export const register = ({
  firstname,
  lastname,
  email,
  password,
  confirmPassword,
  //   error,
}) => async (dispatch) => {
  const body = {
    firstname,
    lastname,
    email,
    password,
    confirmPassword,
    // error,
  };

  try {
    axios.post('/auth/signup', body).then((res) => {
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
      // dispatch(loadUser());
    });
  } catch (err) {
    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

// Login user
export const Log_in = (user) => (dispatch) => {
  let config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  axios.post('/auth/login', user, config).then(
    (res) => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });
      // dispatch(loadUser());
    },
    (error) => {
      // error handling
      if (error.response === undefined) {
        dispatch(
          setAlert('CAN NOT CONNECT TO MOBILE BECAUSE OF REDUX ', 'danger'),
        );
        dispatch({
          type: LOGIN_FAIL,
        });
      } else {
        let errors = error.response.data.errors;
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));

        dispatch({
          type: LOGIN_FAIL,
        });
        if (axios.isCancel(error)) {
          console.log('request cancelled');
        } else {
          console.log('some other reason');
        }
      }
    },
  );
  return axios.cancel(config);
};

// Log out clear profile

export const logout = () => (dispatch) => {
  dispatch({
    type: LOGOUT,
  });
};

export const newPassWord = (token, state, props) => async (dispatch) => {
  try {
    let res = await axios.post(`/auth/newpassword/${token}`, state);

    dispatch({
      type: NEW_PASSWORD,
      payload: res.data,
    });

    props.history.push('/');
  } catch (error) {
    dispatch({
      type: NEW_PASSWORD_FAIL,
    });
  }
};

export const updateProfile = (
  userId,
  avatar,
  firstname,
  lastname,
  location,
) => async (dispatch) => {
  try {
    let res = await axios.put(
      `/auth/user/${userId}/edit`,
      { avatar, firstname, lastname },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (res) {
      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data,
        update: true,
      });
      dispatch(setAlert('Update profile successfully!', 'success'));
      setTimeout(() => {
        dispatch({
          type: REMOVE_UPDATE_SUCCESS_MESSAGE,
          update: false,
        });
      }, 3000);
      dispatch(loadUser());
    } else {
      console.log('connect to internet');
    }
  } catch (error) {
    // error handling

    let errors = error.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      dispatch({
        type: UPDATE_PROFILE_FAIL,
      });
    }
  }
};
