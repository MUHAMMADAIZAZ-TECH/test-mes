import React, { createContext, useContext, useState, useEffect } from "react";
import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { ReactPlugin } from "@microsoft/applicationinsights-react-js";
import { ClickAnalyticsPlugin } from "@microsoft/applicationinsights-clickanalytics-js";
import { createBrowserHistory } from "history";

const browserHistory = createBrowserHistory({ basename: "" });
const reactPlugin = new ReactPlugin();
const clickPluginInstance = new ClickAnalyticsPlugin();

const clickPluginConfig = {
  autoCapture: false,
};

const appInsights = new ApplicationInsights({
  config: {
    instrumentationKey: process.env.REACT_APP_APPINSIGHTS_INSTRUMENTATIONKEY,
    connectionString: process.env.REACT_APP_APPLICATIONINSIGHTS_CONNECTION_STRING,
    extensions: [reactPlugin, clickPluginInstance],
    extensionConfig: {
      [reactPlugin.identifier]: { history: browserHistory },
      [clickPluginInstance.identifier]: clickPluginConfig,
    },
    enableAutoRouteTracking: true, //Track Router History (Automatically)
    samplingPercentage: 100, //sampling 100%
    disableTelemetry: false,
    enableAdaptiveSampling: false,
    disableAjaxTracking: false,
    autoTrackPageVisitTime: true,
    enableCorsCorrelation: true,
    enableRequestHeaderTracking: true,
    enableResponseHeaderTracking: true,
  },
});


const AppInsightsContext = createContext();

export function useAppInsights() {
  return useContext(AppInsightsContext);
}
export function AppInsightsProvider({ children }) {
  const [appInsightsInstance, setAppInsightsInstance] = useState(null);

  useEffect(() => {
    setAppInsightsInstance(appInsights);
  }, []);

  return (
    <AppInsightsContext.Provider value={appInsightsInstance}>
      {children}
    </AppInsightsContext.Provider>
  );
}

export { reactPlugin, appInsights }