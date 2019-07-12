import React, { useMemo } from "react";
import { useService } from "@xstate/react";

import { syncSpawnedReduxActs } from "@/helpers/machine";
import { machineService } from "@/resources/machine/service";

import machine from "./machine";
import PurePageBases from "./Pure";

export const handler = ({ getMachines }) =>
  machine.withConfig({
    actions: {
      ...syncSpawnedReduxActs,
    },
  });

const CtrlPageBases = () => {
  const service = useMemo(
    () =>
      machineService.regService(handler, {
        name: "page-bases",
      }),
    [],
  );
  const [current] = useService(service);

  return <PurePageBases modifier={current.value} />;
};

export default CtrlPageBases;
