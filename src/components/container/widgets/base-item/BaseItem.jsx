import React, { useMemo, memo } from "react";
import { useService } from "@xstate/react";

import machine, { actionTypes, serviceTypes, events } from "./machine";
import BaseItem from "@/components/presents/base-item";

const machineHandler = machine.withConfig({
  actions: {
    [actionTypes.notifyDeleted](ctx, evt) {},
    [actionTypes.notifyError](ctx, evt) {}
  },
  services: {
    [serviceTypes.removeBase](ctx, evt) {}
  }
});

export const WidgetBaseItem = ({ regService, base }) => {
  const service = useMemo(
    () =>
      regService(machineHandler, {
        parent: "base-list",
        name: `base-item#${base.id}`,
        ref: `baseItemRef#${base.id}`
      }),
    []
  );
  const [current, send] = useService(service);

  return (
    <BaseItem
      modifier={current.value}
      base={base}
      onRemove={() => send(events.DELETE)}
    />
  );
};

// export default connect(
//   state => ({
//     bases: state.bases
//   }),
//   dispatch =>
//     bindActionCreators(
//       {
//         regService: xstateMutations.regService
//       },
//       dispatch
//     )
// )(WidgetBaseList);
