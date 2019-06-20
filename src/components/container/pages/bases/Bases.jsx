import React, { useMemo } from "react";
import { useService } from "@xstate/react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { syncSpawnedReduxActs } from "@/helpers/machine";
import { mutations } from "@/resources/xstates";

import BasesPure from "./BasesPure";

import machine from "./machine";

export const machineHandler = ({ dispatch }) =>
  machine.withConfig({
    actions: {
      ...syncSpawnedReduxActs(dispatch)
    }
  });

const BasesPage = ({ machine, regService }) => {
  const service = useMemo(
    () =>
      regService(machine, {
        parent: "app",
        name: "page-bases",
        ref: "pageBasesRef"
      }),
    []
  );
  const [current] = useService(service);
  return <BasesPure modifier={current.value} />;
};

export default connect(
  state => ({
    bases: state.bases,
    machine: machineHandler
  }),
  dispatch =>
    bindActionCreators(
      {
        regService: mutations.regService
      },
      dispatch
    )
)(BasesPage);
