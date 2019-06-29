import React, { useMemo } from "react";
import { useService } from "@xstate/react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { syncSpawnedReduxActs } from "@/helpers/machine";
import { xstateMutations } from "@/resources/xstates";

import PurePageBases from "./Pure";

import machine from "./machine";

export const handler = ({ dispatch }) =>
  machine.withConfig({
    actions: {
      ...syncSpawnedReduxActs(dispatch)
    }
  });

const CtrlPageBases = ({ regService }) => {
  const service = useMemo(
    () =>
      regService(handler, {
        name: "page-bases"
      }),
    []
  );
  const [current] = useService(service);

  return <PurePageBases modifier={current.value} />;
};

export default connect(
  state => ({
    bases: state.bases
  }),
  dispatch =>
    bindActionCreators(
      {
        regService: xstateMutations.regService
      },
      dispatch
    )
)(CtrlPageBases);
