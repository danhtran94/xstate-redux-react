import React, { useMemo } from "react";
import { View } from "react-navi";

import { InterceptProvider } from "@/helpers/intercept";
import { machineService } from "@/resources/machine/service";
import { syncSpawnedReduxActs } from "@/helpers/machine";

import appMachine from "./appMachine";

const handler = ({ getMachines }) =>
  appMachine.withConfig({
    actions: {
      ...syncSpawnedReduxActs,
    },
  });

// const BaseCreate = props => {
//   console.log(props);
//   return <div>Popup creation module</div>;
// };

// const BaselistMock = props => {
//   console.log(props);
//   return <div>Base list module</div>;
// };

export default function App() {
  useMemo(() => machineService.regService(handler, { name: "app" }), []);

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
