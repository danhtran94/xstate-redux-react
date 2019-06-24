import React, { useMemo } from "react";
import { bindActionCreators } from "redux";
import { send } from "xstate";
import { connect } from "react-redux";
import { useService } from "@xstate/react";
import { compose } from "ramda";

import { intercept } from "@/helpers/intercept";
import { getSvc } from "@/helpers/machine";
import { xstateMutations } from "@/resources/xstates";
import { basesMutations } from "@/resources/bases";

import { events as baseListEvents } from "@/components/presents/base-list/machine";
import machine, { events, actionTypes, serviceTypes } from "./machine";
import PureBaseCreationForm from "./Pure";

const handler = ({ getState, dispatch }) =>
  machine.withConfig({
    actions: {
      [actionTypes.reloadBases]: send(baseListEvents.ADDED_BASE, {
        to: () => getSvc(getState, "base-list")
      })
    },
    services: {
      [serviceTypes.createNewBase](ctx, event) {
        return new Promise(resolve => {
          resolve(event.data);
        }).then(data => dispatch(basesMutations.addBase(data)));
      }
    }
  });

export const CtrlBaseCreationForm = ({ regService }) => {
  const service = useMemo(
    () =>
      regService(handler, {
        name: "base-creation-form"
      }),
    []
  );
  const [current, send] = useService(service);

  return (
    <PureBaseCreationForm
      modifier={current.value}
      onConfirm={() =>
        send({ type: events.CONFIRM, data: { id: "from-creation-form" } })
      }
      onCancel={() => send({ type: events.CANCEL })}
    />
  );
};

export default compose(
  intercept,
  connect(
    null,
    dispatch =>
      bindActionCreators(
        {
          regService: xstateMutations.regService
        },
        dispatch
      )
  )
)(CtrlBaseCreationForm);
