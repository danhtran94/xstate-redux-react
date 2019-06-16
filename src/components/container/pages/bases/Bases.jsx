import React, { useEffect } from "react";
import { useService } from "@xstate/react";
import { customConnect } from "@/resources/index";
import { syncSpawnedReduxActs, createSpawnEvent } from "@/helpers/machine";

import baseListHandler, {
  BaseListWidget
} from "@/components/container/widgets/BaseList";
import baseCreationFormHandler, {
  BaseCreationFormWidget
} from "@/components/container/widgets/BaseCreationForm";

import machine from "./machine";

export const pageBasesHandler = ({ dispatch }) =>
  machine.withConfig({
    actions: {
      ...syncSpawnedReduxActs(dispatch)
    }
  });

const BasesPage = ({
  service,
  baseCreationFormMachine,
  baseListMachine,
  bases
}) => {
  const [current, send] = useService(service);

  useEffect(() => {
    send(
      createSpawnEvent(baseListMachine, {
        name: "base-list",
        ref: "baseListRef"
      })
    );
    send(
      createSpawnEvent(baseCreationFormMachine, {
        name: "base-creation-form",
        ref: "baseCreationFormRef"
      })
    );
  }, []);

  const baseCreationFormSvc = current.context.baseCreationFormRef;
  const baseListSvc = current.context.baseListRef;

  return (
    <React.Fragment>
      {baseCreationFormSvc && (
        <BaseCreationFormWidget service={baseCreationFormSvc} />
      )}
      {baseListSvc && <BaseListWidget service={baseListSvc} bases={bases} />}
    </React.Fragment>
  );
};

export default customConnect(
  (dispatch, { bindStoreToHandler }) => (state, { service }) => {
    return {
      service,
      baseCreationFormMachine: bindStoreToHandler(baseCreationFormHandler),
      baseListMachine: bindStoreToHandler(baseListHandler),
      bases: state.bases
    };
  }
)(BasesPage);
