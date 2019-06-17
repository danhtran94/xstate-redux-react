import React, { useMemo } from "react";
import { bindActionCreators } from "redux";
import { useService } from "@xstate/react";
import { connect } from "react-redux";

import { syncSpawnedReduxActs } from "@/helpers/machine";
import { mutations } from "@/resources/xstates";

import rootMachine from "./rootMachine";
import PageBases from "./pages/bases/Bases";

const appHandler = ({ dispatch }) =>
  rootMachine.withConfig({
    actions: {
      ...syncSpawnedReduxActs(dispatch)
    }
  });

const App = ({ regService }) => {
  const service = useMemo(() => regService(appHandler, { name: "app" }), []);
  const [current, send] = useService(service);

  return <PageBases />;
};

export default connect(
  null,
  dispatch =>
    bindActionCreators(
      {
        regService: mutations.regService
      },
      dispatch
    )
)(App);
