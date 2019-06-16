import React from "react";
import { send } from "xstate";
import { useService } from "@xstate/react";
import { getSvc } from "@/helpers/machine";
import { mutations } from "@/resources/bases";

import { events as creationEvents } from "@/components/presents/base-creation-form";

import BaseList, {
  machine,
  events,
  guardTypes,
  actionTypes,
  serviceTypes
} from "@/components/presents/base-list";

export const baseListHandler = ({ getState, dispatch }) =>
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
        }).then(data => {
          dispatch(mutations.updateBases(data));
          return data;
        });
      }
    }
  });

export const BaseListWidget = ({ service, bases }) => {
  const [current, send] = useService(service);

  return (
    current && (
      <BaseList
        modifier={current.value}
        bases={bases}
        onCreateBase={() => send(events.CREATE_BASE)}
      />
    )
  );
};

export default baseListHandler;
