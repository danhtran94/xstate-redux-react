import React from "react";
import { Provider } from "react-redux";
import { Router } from "react-navi";

import store from "@/resources/index";
import routes from "@/routes/index";

import App from "@/components/App";
import "@/assets/style.scss";

const Root = () => {
  return (
    <Provider store={store}>
      <Router routes={routes}>
        <App />
      </Router>
    </Provider>
  );
};

export default Root;
