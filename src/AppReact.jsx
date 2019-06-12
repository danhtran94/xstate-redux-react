import React, { Fragment } from "react";
import { Provider } from "react-redux";

import store from "@/resources/index";

import Bases from "@/components/container/pages/Bases";

const App = () => {
  return (
    <Provider store={store}>
      {/* <p>Hello from React App !</p> */}
      <section
        style={{
          marginBottom: "10px"
        }}
      >
        <Bases />
      </section>

      {/* <a href="/#vue">To Vue</a> */}
    </Provider>
  );
};

export default App;
