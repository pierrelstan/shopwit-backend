import axios from 'axios';
import axiosCancel from 'axios-cancel';
import openSocket from 'socket.io-client';
import {
  FETCH_ITEMS,
  SEARCH_ITEMS,
  CLEAR_SEARCH_ITEMS,
  FETCH_ITEM_BY_ID,
  REMOVE_ITEM_BY_ID,
  ADD_TO_CART_BY_ID,
  FAILED_ADD_TO_CART_BY_ID,
  FETCH_CARTS,
  REMOVE_CART_BY_ID,
  UPDATE_CART,
  SET_ALERT,
  CREATE_ITEM,
  CREATE_ITEM_FAILED,
  UPDATE_ITEM,
  UPDATE_ITEM_FAIL,
  FETCH_ITEMS_BY_USER_ID,
  FETCH_ITEMS_BY_USER_ID_FAILED,
  FETCH_LAST_PRODUCTS,
} from './types';
import { setAlert } from './alert';

export const fetchLastProducts = (cancelToken) => async (dispatch) => {
  let config = {
    headers: {
      'Content-Type': 'application/json',
      cancelToken,
    },
  };
  try {
    let items = await axios.get('/item/lastproducts', config);
    dispatch({
      type: FETCH_LAST_PRODUCTS,
      payload: items.data,
      isLoaded: true,
      error: null,
    });
  } catch (err) {
    let a = axios.isCancel(err);
    if (a) {
      console.log('request cancelled');
    } else {
      console.log('some other reason');
    }
  }
  // cancelTokenSource.cancel();
};
export const fetchItems = (cancelToken) => async (dispatch, getState) => {
  let requestId = 'stanley';
  let config = {
    headers: {
      'Content-Type': 'application/json',
      cancelToken,
    },
  };
  axios.cancel(requestId);
  try {
    let items = await axios.get('/item/all', config);
    dispatch({
      type: FETCH_ITEMS,
      payload: items.data,
      isLoaded: true,
      error: null,
    });
  } catch (err) {
    console.log('called');
    let a = axios.isCancel(err);
    if (a) {
      console.log('request cancelled');
    } else {
      console.log('some other reason');
    }
  }
};

export const CreateItem = (product, history) => (dispatch) => {
  axios
    .post('/item/new', product, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      dispatch({
        type: CREATE_ITEM,
        payload: response,
      });
      history.push('/');
      dispatch(fetchItems());
    })
    .catch((err) => {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'warning')));
      }
      dispatch({
        type: CREATE_ITEM_FAILED,
        payload: err,
      });
    });
};
export const searchItems = (data) => (dispatch) => {
  const { search } = data;
  axios
    .get(`/item/s/search?`, {
      params: {
        title: `${search}`,
      },
    })
    .then((items) => {
      if (search === '') {
        dispatch({
          type: SEARCH_ITEMS,
          payload: [],
          value: '',
          isLoaded: true,
          error: null,
        });
      } else {
        dispatch({
          type: SEARCH_ITEMS,
          payload: items,
          value: search,

          isLoaded: true,
          error: null,
        });
      }
    })
    .catch((error) => ({
      error: error,
    }));
};

export const clearSearchItems = () => (dispatch) => {
  dispatch({
    type: CLEAR_SEARCH_ITEMS,
    isLoaded: false,
  });
};
export const fetchItemById = (id) => (dispatch) => {
  let config = {
    headers: {
      'content-type': 'application/json',
    },
  };

  axios
    .get(`/item/${id}`, config)
    .then((item) =>
      dispatch({
        type: FETCH_ITEM_BY_ID,
        payload: item,
        isLoaded: true,
        error: null,
      }),
    )
    .catch((error) => {
      console.log(error);
    });
};

export const removeItemById = (id) => (dispatch) => {
  let config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  axios
    .delete(`/item/${id}`, config)
    .then(() => {
      dispatch({
        type: REMOVE_ITEM_BY_ID,
        payload: id,
      });
      dispatch(setAlert('Delete Item successfully!', 'success'));
      dispatch(fetchItems());
    })
    .catch((error) => ({
      error: error,
    }));
};

export const fetchItemsByUserId = (id, cancelToken) => async (dispatch) => {
  let config = {
    headers: {
      'Content-Type': 'application/json',
    },
    // cancelToken,
  };
  try {
    let itemsByUserId = await axios.get(`/item/user/items/${id}`, config);
    console.log(itemsByUserId.data);
    dispatch({
      type: FETCH_ITEMS_BY_USER_ID,
      payload: itemsByUserId.data,
      isLoaded: true,
    });
  } catch (error) {
    const errors = error.response;
    if (errors) {
      dispatch({
        type: FETCH_ITEMS_BY_USER_ID_FAILED,
      });
    }
    if (axios.isCancel(errors)) {
      console.log('request cancelled');
    } else {
      console.log('some other reason');
    }
  }
};

export const updateItem = (id, state) => async (dispatch) => {
  let config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    let data = await axios.put(`/item/${id}`, state, {
      config,
    });
    dispatch({
      type: UPDATE_ITEM,
      payload: data.data,
      isLoaded: true,
    });
    dispatch(setAlert('Updated cart successfully!', 'success'));
    dispatch(fetchItems());
  } catch (error) {
    const errors = error.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'warning')));
    }
    dispatch({
      type: UPDATE_ITEM_FAIL,
    });
    if (axios.isCancel(error)) {
      console.log('request cancelled');
    } else {
      console.log('some other reason');
    }
  }
  axios.cancel(config);
};

export const addToCart = (id) => async (dispatch) => {
  try {
    await axios
      .post(`/item/add-to-cart/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((data) => {
        dispatch(allCarts());
        dispatch({
          type: ADD_TO_CART_BY_ID,
          payload: data,
          isLoaded: true,
        });
        dispatch(setAlert('Add to cart successfully!', 'success'));
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
      type: FAILED_ADD_TO_CART_BY_ID,
    });
  }
};

export const allCarts = (id, cancelToken) => async (dispatch) => {
  let config = {
    headers: {
      'Content-Type': 'application/json',
    },
    cancelToken,
  };
  try {
    let carts = await axios.get(`/item/cart/${id}`, config);
    dispatch({
      type: FETCH_CARTS,
      payload: carts.data,
      isLoaded: true,
      error: null,
    });
  } catch (err) {
    if (axios.isCancel(err)) {
      console.log('request cancelled');
    } else {
      console.log('some other reason');
    }
  }
};
export const updateCart = (id, number) => async (dispatch) => {
  let config = {
    headers: {
      'Content-Type': 'application/json',
    },
    body: number,
  };
  try {
    let res = await axios.put(`/item/updateCart/${id}`, number, config);
    dispatch({
      type: UPDATE_CART,
      payload: res.data,
      isLoaded: true,
    });
    dispatch(setAlert('Updated cart successfully!', 'success'));
    dispatch(allCarts());
  } catch (error) {
    dispatch({
      type: SET_ALERT,
    });
    if (axios.isCancel(error)) {
      console.log('request cancelled');
    } else {
      console.log('some other reason');
    }
  }
  return await axios.cancel(config);
};
export const removeCart = (id) => (dispatch) => {
  let config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  axios
    .post(`/item/removecart/${id}`, config)
    .then((res) => {
      dispatch({
        type: REMOVE_CART_BY_ID,
        payload: res.data,
        isLoaded: true,
        error: null,
      });
      dispatch(setAlert('Remove to cart successfully!', 'success'));
      dispatch(allCarts());
    })
    .catch((err) => console.log(err));
};