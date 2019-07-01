import React, { useMemo } from "react";
import { send } from "xstate";
import { useService } from "@xstate/react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { compose } from "ramda";

import { intercept } from "@/helpers/intercept";
import { getSvc } from "@/helpers/machine";
import { xstateMutations } from "@/resources/xstates";
import { basesMutations } from "@/resources/bases";
import { syncSpawnedReduxActs } from "@/helpers/machine";

import { events as creationEvents } from "@/components/modules/base-creation-form/machine";
import machine, {
  states,
  events,
  guardTypes,
  actionTypes,
  serviceTypes
} from "./machine";
import PureBaseList from "./Pure";

export const handler = ({ getState, dispatch }) =>
  machine.withConfig({
    guards: {
      [guardTypes.shouldCreateNew]() {
        const { bases } = getState();
        return bases.length === 0;
      }
    },
    actions: {
      ...syncSpawnedReduxActs(dispatch),
      [actionTypes.beginCreateBase]: send(creationEvents.RESTART, {
        to: () => getSvc(getState, "base-creation-form")
      })
    },
    services: {
      [serviceTypes.fetchBases]() {
        return new Promise(resolve => {
          resolve([]);
        }).then(data => dispatch(basesMutations.updateBases(data)));
      }
    }
  });

export const HocCtrlBaseList = PureView =>
  function CtrlBaseList({ regService, bases }) {
    const service = useMemo(
      () =>
        regService(handler, {
          name: "base-list"
        }),
      []
    );
    const [current, send] = useService(service);

    return (
      <PureView
        empty={current.matches({ [states.SUCCESS]: states.EMPTY })}
        error={current.matches(states.ERROR)}
        loading={current.matches(states.LOADING)}
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
  ),
  HocCtrlBaseList
)(PureBaseList);
