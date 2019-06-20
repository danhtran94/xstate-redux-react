import React, { useMemo } from "react";
import { send } from "xstate";
import { useService } from "@xstate/react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { compose } from "ramda";

import { intercept } from "@/helpers/intercept";
import { getSvc } from "@/helpers/machine";
import { mutations as xstateMutations } from "@/resources/xstates";
import { mutations } from "@/resources/bases";

import { events as creationEvents } from "@/components/container/widgets/base-creation-form/machine";
import machine, {
  events,
  guardTypes,
  actionTypes,
  serviceTypes
} from "./machine";
import BaseList from "@/components/presents/base-list/BaseList";

export const machineHandler = ({ getState, dispatch }) =>
  machine.withConfig({
    guards: {
      [guardTypes.shouldCreateNew]() {
        const { bases } = getState();
        return bases.length === 0;
      }
    },
    actions: {
      [actionTypes.beginCreateBase]: send(creationEvents.RESTART, {
        to: () => getSvc(getState, "base-creation-form")
      })
    },
    services: {
      [serviceTypes.fetchBases]() {
        return new Promise(resolve => {
          resolve([]);
        }).then(data => dispatch(mutations.updateBases(data)));
      }
    }
  });

export const WidgetBaseList = ({ regService, bases }) => {
  const service = useMemo(
    () =>
      regService(machineHandler, {
        parent: "page-bases",
        name: "base-list",
        ref: "baseListRef"
      }),
    []
  );
  const [current, send] = useService(service);

  return (
    <BaseList
      modifier={current.value}
      bases={bases}
      onCreateBase={() => send(events.CREATE_BASE)}
    />
  );
};

export default compose(
  intercept,
  connect(
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
  )
)(WidgetBaseList);
