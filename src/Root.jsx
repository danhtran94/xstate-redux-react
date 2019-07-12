import { hot } from "react-hot-loader/root";
import React from "react";
import { Router } from "react-navi";

import routes from "@/routes/index";

import App from "@/components/App";
import "@/assets/style.scss";

const Root = () => {
  return (
    <Router routes={routes}>
      <App />
    </Router>
  );
};

export default hot(Root);
