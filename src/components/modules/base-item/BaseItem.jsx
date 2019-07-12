import React, { useMemo } from "react";
import { sendParent } from "xstate";
import { compose } from "ramda";

import { intercept } from "@/helpers/intercept";
import { useActor } from "@/helpers/machine";

import { machineService } from "@/resources/machine/service";

import { events as baseListEvents } from "@/components/modules/base-list/machine";
import machine, { actionTypes, serviceTypes, events } from "./machine";
import PureBaseItem from "./Pure";

const implMachine = machine.withConfig({
  actions: {
    [actionTypes.notifyDeleted]: sendParent(baseListEvents.REMOVE_BASE),
    [actionTypes.notifyError](ctx, evt) {},
  },
  services: {
    [serviceTypes.removeBase](ctx, evt) {
      return new Promise((resolve, reject) => {
        resolve();
      });
    },
  },
});

export const HocCtrlBaseItem = PureView =>
  function CtrlBaseItem({ base, idx }) {
    const [current, svc, svcSetter] = useActor();
    useMemo(
      () =>
        machineService.regService(implMachine, {
          parent: "base-list",
          name: `base-item-${idx}`,
          ref: `baseItemRef${idx}`,
          svcSetter,
        }),
      [],
    );

    return current ? <PureView modifier={current.value} base={base} onRemove={() => svc.send(events.DELETE)} /> : null;
  };

export default compose(
  intercept,
  HocCtrlBaseItem,
)(PureBaseItem);
