import React, { useMemo, useRef } from "react";
import { send } from "xstate";
import { useService } from "@xstate/react";
import { compose } from "ramda";
import { Form } from "antd";

import { intercept } from "@/helpers/intercept";

import { machineQuery } from "@/resources/machine/query";
import { machineService } from "@/resources/machine/service";
import { baseService } from "@/resources/base/service";

import { events as baseListEvents } from "@/components/modules/base-list/machine";
import machine, { states, events, actionTypes, serviceTypes } from "./machine";

import PureBaseCreationForm from "./Pure";

const implMachine = machine.withConfig({
  actions: {
    [actionTypes.reloadBases]: send(baseListEvents.ADDED_BASE, {
      to: () => machineQuery.getEntity("base-list").service,
    }),
  },
  services: {
    [serviceTypes.createNewBase](ctx, event) {
      return new Promise(resolve => {
        resolve(event.data);
      }).then(data => baseService.addBase(data));
    },
  },
});

export const HocCtrlBaseCreationForm = PureView => {
  return function CtrlBaseCreationForm() {
    const service = useMemo(
      () =>
        machineService.regService(implMachine, {
          name: "base-creation-form",
        }),
      [],
    );
    const formRef = useRef();
    const [current, send] = useService(service);

    return (
      <PureView
        wrappedComponentRef={formRef}
        showModal={current.matches(states.INIT)}
        creating={current.matches(states.CREATING)}
        error={current.matches(states.ERROR)}
        onConfirm={() => {
          if (formRef.current) {
            formRef.current.validateFields((err, values) => {
              if (err) {
                return;
              }

              send({
                type: events.CONFIRM,
                data: values,
              });
              formRef.current.resetFields();
            });
          }
        }}
        onCancel={() => send({ type: events.CANCEL })}
      />
    );
  };
};

export default compose(
  intercept,
  HocCtrlBaseCreationForm,
  Form.create({ name: "base-creation" }),
)(PureBaseCreationForm);
