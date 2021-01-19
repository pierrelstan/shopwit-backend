import axios from 'axios';
import axiosCancel from 'axios-cancel';
import { setAlert } from './alert';
import {
  ADD_FAVORITES,
  ADD_FAVORITES_FAILED,
  REMOVE_FAVORITES,
  FETCH_FAVORITES,
} from './types';

axiosCancel(axios, {
  debug: false, // default
});
export const addToFavorites = (id, userId) => async (dispatch) => {
  let config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    await axios
      .post(`/item/add-to-favorites/${id}`, {
        config,
      })
      .then((data) => {
        dispatch({
          type: ADD_FAVORITES,
          payload: data,
          isLoaded: true,
        });
        dispatch(allFavorites());
        dispatch(setAlert('Add to favorites  successfully!', 'success'));
      });
  } catch (err) {
    if (err.response.data.msg) {
      dispatch(setAlert('Please login first!', 'warning'));
    }
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'warning')));
    }
    dispatch({
      type: ADD_FAVORITES_FAILED,
    });
  }
};

export const allFavorites = (id, cancelToken) => async (dispatch) => {
  let config = {
    headers: {
      'Content-Type': 'application/json',
    },
    cancelToken,
  };
  try {
    let favorites = await axios.get(`/item/favorites/${id}`, config);
    dispatch({
      type: FETCH_FAVORITES,
      payload: favorites.data,
      // isLoaded: true,
      error: null,
    });
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('request cancelled');
    } else {
      console.log('some other reason');
    }
  }
};

export const removeFavorites = (id) => (dispatch) => {
  let config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  axios
    .post(`/item/removeFavorites/${id}`, config)
    .then((res) => {
      dispatch({
        type: REMOVE_FAVORITES,
        payload: res.data,
        isLoaded: true,
        error: null,
      });
      dispatch(setAlert('Remove to favorites successfully!', 'success'));
      dispatch(allFavorites());
    })
    .catch((err) => console.log(err));
};
