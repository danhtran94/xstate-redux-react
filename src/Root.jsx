import React from "react";
import { Provider } from "react-redux";

import store from "@/resources/index";

// import Bases from "@/components/container/pages/bases/Bases";
import App from "@/components/container/App";

const Root = () => {
  return (
    <Provider store={store}>
      <App />
      {/* <a href="/#vue">To Vue</a> */}
    </Provider>
  );
};

export default Root;
