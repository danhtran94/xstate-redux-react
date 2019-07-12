import React, { useMemo } from "react";
import { send } from "xstate";
import { useService } from "@xstate/react";
import { compose } from "ramda";

import { intercept } from "@/helpers/intercept";
import { syncSpawnedReduxActs } from "@/helpers/machine";
import { useObservable } from "@/helpers/hooks";

import { baseQuery } from "@/resources/base/query";
import { baseService } from "@/resources/base/service";
import { machineQuery } from "@/resources/machine/query";
import { machineService } from "@/resources/machine/service";

import { events as creationEvents } from "@/components/modules/base-creation-form/machine";
import machine, { states, events, guardTypes, actionTypes, serviceTypes } from "./machine";

import PureBaseList from "./Pure";

export const handler = ({ getMachines }) =>
  machine.withConfig({
    guards: {
      [guardTypes.shouldCreateNew]() {
        const bases = baseQuery.getAll();
        return bases.length === 0;
      },
    },
    actions: {
      ...syncSpawnedReduxActs,
      [actionTypes.beginCreateBase]: send(creationEvents.RESTART, {
        to: () => machineQuery.getEntity("base-creation-form").service,
      }),
    },
    services: {
      [serviceTypes.fetchBases]() {
        return new Promise(resolve => {
          resolve([]);
        }).then(data => baseService.updateBases(data));
      },
    },
  });

export const HocCtrlBaseList = PureView =>
  function CtrlBaseList() {
    const service = useMemo(
      () =>
        machineService.regService(handler, {
          name: "base-list",
        }),
      [],
    );
    const [current, send] = useService(service);

    const bases = useObservable(baseQuery.selectBases$);

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
  HocCtrlBaseList,
)(PureBaseList);
