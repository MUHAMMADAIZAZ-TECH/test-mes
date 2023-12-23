import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from '@auth0/auth0-react';
import { appInsights, AppInsightsProvider } from "./AppInsightConfig";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import store from "./store/store";
import { Provider } from 'react-redux';
const Production = process.env.REACT_APP_ENVIRONMENT === "production";
if (Production) {
  appInsights.loadAppInsights();
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AppInsightsProvider>
    <BrowserRouter>
      <LocalizationProvider dateAdapter={AdapterLuxon}>
        <Provider store={store}>
          {Production ? <App /> :
            <Auth0Provider
              domain={process.env.REACT_APP_AUTH0DOMAIN}
              clientId={process.env.REACT_APP_AUTH0CLIENTID}
              authorizationParams={{
                redirect_uri: window.location.origin,
                audience: process.env.REACT_APP_AUDIENCE
              }}
            >
              <App />
            </Auth0Provider>}
        </Provider>
      </LocalizationProvider>
    </BrowserRouter>
  </AppInsightsProvider>
);
