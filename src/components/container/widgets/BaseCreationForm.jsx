import React from "react";
import { send } from "xstate";
import { useService } from "@xstate/react";
import { mutations } from "@/resources/bases";
import { getSvc } from "@/helpers/machine";
import { events as baseListEvents } from "@/components/presents/base-list";
import BaseCreationForm, {
  machine,
  events,
  actionTypes,
  serviceTypes
} from "@/components/presents/base-creation-form";

const baseCreationFormHandler = ({ getState, dispatch }) =>
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

export const BaseCreationFormWidget = ({ service }) => {
  const [current, send] = useService(service);

  return (
    current && (
      <BaseCreationForm
        modifier={current.value}
        onConfirm={() =>
          send({ type: events.CONFIRM, data: { id: "from-creation-form" } })
        }
      />
    )
  );
};

export default baseCreationFormHandler;
