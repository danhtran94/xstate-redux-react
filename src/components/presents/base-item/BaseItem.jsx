import React, { useMemo } from "react";
import { sendParent } from "xstate";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { compose } from "ramda";

import { intercept } from "@/helpers/intercept";
import { useActor } from "@/helpers/machine";
import { xstateMutations } from "@/resources/xstates";
import { events as baseListEvents } from "@/components/presents/base-list/machine";
import machine, { actionTypes, serviceTypes, events } from "./machine";
import PureBaseItem from "./Pure";

const handler = ({ getState, dispatch }) =>
  machine.withConfig({
    actions: {
      [actionTypes.notifyDeleted]: sendParent(baseListEvents.REMOVE_BASE),
      [actionTypes.notifyError](ctx, evt) {}
    },
    services: {
      [serviceTypes.removeBase](ctx, evt) {
        return new Promise((resolve, reject) => {
          resolve();
        });
      }
    }
  });

export const CtrlBaseItem = ({ regService, base, idx }) => {
  const parentService = useMemo(
    () =>
      regService(handler, {
        parent: "base-list",
        name: `base-item-${idx}`,
        ref: `baseItemRef${idx}`
      }),
    []
  );
  const [current, send] = useActor(parentService, `baseItemRef${idx}`);

  return (
    <PureBaseItem
      modifier={current.value}
      base={base}
      onRemove={() => send(events.DELETE)}
    />
  );
};

export default compose(
  intercept,
  connect(
    (state, ownProps) => ({ idx: ownProps.idx }),
    dispatch =>
      bindActionCreators(
        {
          regService: xstateMutations.regService
        },
        dispatch
      )
  )
)(CtrlBaseItem);
