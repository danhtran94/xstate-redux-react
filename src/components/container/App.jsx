import React, { useEffect } from "react";
import { bindActionCreators } from "redux";
import { useMachine } from "@xstate/react";
import { customConnect } from "@/resources/index";
import { mutations } from "@/resources/xstates";
import { createSpawnEvent } from "@/helpers/machine";

import rootHandler from "./rootMachine";
import PageBases, { pageBasesHandler } from "./pages/bases/Bases";

const App = ({ rootMachine, pageBasesMachine, addService, update }) => {
  const [current, send, service] = useMachine(rootMachine);

  useEffect(() => {
    addService({ name: "root", service });

    service.onTransition(rootState => {
      if (rootState.changed) {
        update({ name: "root", state: rootState });
      }
    });

    return () => service.stop();
  }, []);

  useEffect(() => {
    send(
      createSpawnEvent(pageBasesMachine, {
        name: "page-bases",
        ref: "pageBasesRef"
      })
    );
  }, []);

  const pageBasesSvc = current.context.pageBasesRef;

  return <div>{pageBasesSvc && <PageBases service={pageBasesSvc} />}</div>;
};

export default customConnect(
  (dispatch, { bindStoreToHandler }) => (state, ownProps) => {
    return {
      ...ownProps,
      ...bindActionCreators(
        {
          ...mutations
        },
        dispatch
      ),
      rootMachine: bindStoreToHandler(rootHandler),
      pageBasesMachine: bindStoreToHandler(pageBasesHandler)
    };
  }
)(App);
