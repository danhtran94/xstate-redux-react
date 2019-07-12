import React, { useMemo } from "react";
import { View } from "react-navi";

import { InterceptProvider } from "@/helpers/intercept";
import { syncSpawnedReduxActs } from "@/helpers/machine";

import { machineService } from "@/resources/machine/service";

import appMachine from "./appMachine";

// const BaseCreate = props => {
//   console.log(props);
//   return <div>Popup creation module</div>;
// };

// const BaselistMock = props => {
//   console.log(props);
//   return <div>Base list module</div>;
// };

export default function App() {
  useMemo(() => {
    const implMachine = appMachine.withConfig({
      actions: {
        ...syncSpawnedReduxActs,
      },
    });

    return machineService.regService(implMachine, { name: "app" });
  }, []);

  return (
    <div className="app">
      <InterceptProvider
        registers={
          {
            // baseList: BaselistMock,
            // baseCreationForm: BaseCreate
          }
        }
      >
        <View />
      </InterceptProvider>
    </div>
  );
}
