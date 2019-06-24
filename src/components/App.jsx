import React, { useMemo } from "react";
import { bindActionCreators } from "redux";
import { useService } from "@xstate/react";
import { connect } from "react-redux";
import { View } from "react-navi";

import { syncSpawnedReduxActs } from "@/helpers/machine";
import { xstateMutations } from "@/resources/xstates";

import appMachine from "./appMachine";

const handler = ({ dispatch }) =>
  appMachine.withConfig({
    actions: {
      ...syncSpawnedReduxActs()
    }
  });

const App = ({ regService }) => {
  const service = useMemo(() => regService(handler, { name: "app" }), []);
  const [current, send] = useService(service);

  return (
    <div className="app">
      <View />
    </div>
  );
};

export default connect(
  null,
  dispatch =>
    bindActionCreators(
      {
        regService: xstateMutations.regService
      },
      dispatch
    )
)(App);
