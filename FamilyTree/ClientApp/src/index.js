import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ScrollToTop from './components/Shared/ScrollToTop'
import 'font-awesome/css/font-awesome.min.css'
import configureStore from './configureStore'

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');

const { store, _ } = configureStore()

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter basename={baseUrl}>
            <ScrollToTop>
                <App />
            </ScrollToTop>
        </BrowserRouter>
    </Provider>,
    rootElement);

// Uncomment the line above that imports the registerServiceWorker function
// and the line below to register the generated service worker.
// By default create-react-app includes a service worker to improve the
// performance of the application by caching static assets. This service
// worker can interfere with the Identity UI, so it is
// disabled by default when Identity is being used.
//
//registerServiceWorker();

