import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from '@material-ui/core/styles';
import store, { persistor } from './redux/store/store';
import './index.css';
import 'sal.js/dist/sal.css';
import 'swiper/swiper-bundle.css';
import { SnackbarProvider } from 'notistack';
import App from './App';
import { theme } from './Theme/theme';
import * as serviceWorker from './serviceWorker';
import {
  fetchItems,
  fetchItemsByUserId,
  fetchLastProducts,
} from './redux/actions/ItemsActions';
import { loadUser } from './redux/actions/auth';

store.dispatch(fetchItems());

store.dispatch(fetchLastProducts());

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SnackbarProvider maxSnack={1}>
            <ThemeProvider theme={theme}>
              <App />
            </ThemeProvider>
          </SnackbarProvider>
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();