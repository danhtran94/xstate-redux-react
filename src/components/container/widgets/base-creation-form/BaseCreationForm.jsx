import React, { useMemo } from "react";
import { bindActionCreators } from "redux";
import { send } from "xstate";
import { connect } from "react-redux";
import { useService } from "@xstate/react";
import { compose } from "ramda";

import { intercept } from "@/helpers/intercept";
import { getSvc } from "@/helpers/machine";
import { mutations as xstateMutations } from "@/resources/xstates";
import { mutations } from "@/resources/bases";

import { events as baseListEvents } from "@/components/container/widgets/base-list/machine";
import machine, { events, actionTypes, serviceTypes } from "./machine";
import BaseCreationForm from "@/components/presents/base-creation-form/BaseCreationForm";

const machineHandler = ({ getState, dispatch }) =>
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
        }).then(data => dispatch(mutations.addBase(data)));
      }
    }
  });

export const WidgetBaseCreationForm = ({ regService }) => {
  const service = useMemo(
    () =>
      regService(machineHandler, {
        parent: "page-bases",
        name: "base-creation-form",
        ref: "baseCreationFormRef"
      }),
    []
  );
  const [current, send] = useService(service);

  return (
    <BaseCreationForm
      modifier={current.value}
      onConfirm={() =>
        send({ type: events.CONFIRM, data: { id: "from-creation-form" } })
      }
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
)(WidgetBaseCreationForm);
