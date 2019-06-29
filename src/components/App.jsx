import React, { useMemo } from "react";
import { bindActionCreators } from "redux";
import { useService } from "@xstate/react";
import { connect } from "react-redux";
import { View } from "react-navi";

import { InterceptProvider } from "@/helpers/intercept";
import { syncSpawnedReduxActs } from "@/helpers/machine";
import { xstateMutations } from "@/resources/xstates";

import appMachine from "./appMachine";

const handler = ({ dispatch }) =>
  appMachine.withConfig({
    actions: {
      ...syncSpawnedReduxActs()
    }
  });

const BaseCreate = props => {
  console.log(props);
  return <div>Popup creation module</div>;
};

const BaselistMock = props => {
  console.log(props);
  return <div>Base list module</div>;
};

const App = ({ regService }) => {
  const service = useMemo(() => regService(handler, { name: "app" }), []);
  const [current, send] = useService(service);

  return (
    <div className="app">
      <InterceptProvider
        registers={
          {
            // baseList: BaselistMock,
            // baseCreationForm: BaseCreate
          }
        }
      >
        <View />
      </InterceptProvider>
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
