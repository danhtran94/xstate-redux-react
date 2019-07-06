import React, { useMemo, useRef } from "react";
import { bindActionCreators } from "redux";
import { send } from "xstate";
import { connect } from "react-redux";
import { useService } from "@xstate/react";
import { compose } from "ramda";
import { Form } from "antd";

import { intercept } from "@/helpers/intercept";
import { getSvc } from "@/helpers/machine";
import { xstateMutations } from "@/resources/xstates";
import { basesMutations } from "@/resources/bases";

import { events as baseListEvents } from "@/components/modules/base-list/machine";
import machine, { states, events, actionTypes, serviceTypes } from "./machine";
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

export const HocCtrlBaseCreationForm = PureView => {
  return function CtrlBaseCreationForm({ regService }) {
    const service = useMemo(
      () =>
        regService(handler, {
          name: "base-creation-form"
        }),
      []
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
                data: values
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
  connect(
    null,
    dispatch =>
      bindActionCreators(
        {
          regService: xstateMutations.regService
        },
        dispatch
      )
  ),
  HocCtrlBaseCreationForm,
  Form.create({ name: "base-creation" })
)(PureBaseCreationForm);
