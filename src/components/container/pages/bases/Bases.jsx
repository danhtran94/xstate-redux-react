import React, { useMemo } from "react";
import { useService } from "@xstate/react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { mutations } from "@/resources/xstates";
import { syncSpawnedReduxActs } from "@/helpers/machine";

import WidgetBaseList from "@/components/container/widgets/base-list";
import WidgetBaseCreationForm from "@/components/container/widgets/base-creation-form";

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
  const [current, send] = useService(service);

  return (
    <React.Fragment>
      <WidgetBaseCreationForm />
      <WidgetBaseList />
    </React.Fragment>
  );
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
