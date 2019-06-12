import React, { useState, useRef, useEffect } from "react";
import { spawn, assign, send, sendParent } from "xstate";
import { useMachine } from "@xstate/react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { basesActions } from "@/resources/bases";

import BaseList, {
  machine as baseListMachine,
  events as baseListEvents,
  actionTypes as baseListActionTypes,
  serviceTypes as baseListServiceTypes
} from "@/components/presents/base-list";

import BaseCreationForm, {
  machineName as baseCreationFormId,
  machine as baseCreationFormMachine,
  actionTypes as baseCreationActionTypes,
  serviceTypes as baseCreationServiceTypes,
  events as baseCreationEvents
} from "@/components/presents/base-creation-form";

const Bases = ({ xstate, xservice, bases, addBase }) => {
  console.log("bases", xstate, xservice, bases.data);
  useEffect(() => {
    // xservice.start();
    return () => xservice.stop();
  }, [xservice]);

  xservice.send("HELLO");

  const baseCreationFormMachineIns = baseCreationFormMachine.withConfig({
    actions: {
      [baseCreationActionTypes.reloadBases]: sendParent(baseListEvents.RELOAD)
    },
    services: {
      [baseCreationServiceTypes.createNewBase](ctx, event) {
        const created = {
          id: 100,
          name: event.base.name
        };

        return new Promise((resolve, reject) => {
          console.log(created);
          setTimeout(() => {
            addBase(created);
            resolve(created);
          }, 1000);
        });
      }
    }
  });

  const baseListMachineIns = baseListMachine.withConfig({
    actions: {
      [baseListActionTypes.spawnBaseCreationForm]: assign({
        baseCreationFormRef: () =>
          spawn(baseCreationFormMachineIns, baseCreationFormId)
      }),
      [baseListActionTypes.updateBasesData](ctx, event) {
        console.log(
          "baseListActionTypes.updateBasesData",
          ctx,
          event,
          bases.data
        );
        return ctx;
      },
      [baseListActionTypes.beginCreateBase]: send(baseCreationEvents.RESTART, {
        to: ctx => ctx.baseCreationFormRef
      })
    },
    services: {
      [baseListServiceTypes.fetchBases]() {
        return new Promise((resolve, reject) => {
          resolve({ bases: bases.data });
        });
      }
    }
  });

  const [current, _, baseListService] = useMachine(baseListMachineIns);

  return (
    <React.Fragment>
      <BaseCreationForm service={current.context.baseCreationFormRef} />
      <BaseList service={baseListService} />
    </React.Fragment>
  );
};

export default connect(
  state => ({ ...state }),
  dispatch => bindActionCreators(basesActions, dispatch)
)(Bases);
