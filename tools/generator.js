/* eslint-disable no-undef */
const fs = require("fs");
const camelCase = require("camelcase");

const args = process.argv.slice(2);
const length = args.length;
let machineTemplate, pureViewTemplate, ctrlTemplate, indexTemplate;

let type, name;
if (length === 1) {
  type = "module";
  [name] = args;
}

if (length === 2) {
  [type, name] = args;
}

const pascalName = camelCase(name, { pascalCase: true });
// var camelName = camelCase(name);

indexTemplate = `
export { default } from "./${pascalName}";
`;

machineTemplate = `
import { Machine } from "xstate";
import { objNameCreator, spawnEventLogic } from "@/helpers/machine";

const machineName = "${name}";
const name = objNameCreator(machineName);

export const events = {
  LOAD: name.Event("LOAD")
};

export const guardTypes = {};

export const actionTypes = {
  doSomething: name.Action("doSomething"),  
};

export const activities = {};

export const serviceTypes = {
  doFetch: name.Service("doFetch")
};

export const states = {
  INIT: name.State("INIT"),
  LOADING: name.State("LOADING"),
  SUCCESS: name.State("SUCCESS")
};

export default Machine({
  id: machineName,
  initial: states.INIT,
  states: {
    [states.INIT]: {
      on: {
        [events.LOAD]: {
          target: states.LOADING
        }
      }
    },
    [states.LOADING]: {
      invoke: {
        src: serviceTypes.doFetch,
        onDone: {
          actions: [],
          target: states.SUCCESS
        },
        onError: {
          actions: [],
          target: states.INIT
        }
      }
    },
    [states.SUCCESS]: {
      entry: [actionTypes.doSomething]
    }
  }
});
`;

pureViewTemplate = `
import React from "react";
import { Button } from "antd";

const Pure${pascalName} = ({ loading, success, onDo }) => {
  return (
    <div>
      {loading && "loading"}
      {success ? (
        "success"
      ) : (
        <Button type="primary" onClick={onDo}>
          Do it!
        </Button>
      )}
    </div>
  );
};

export default Pure${pascalName};
`;

if (type === "module") {
  ctrlTemplate = `
import React, { useMemo } from "react";
import { connect } from "react-redux";
import { useService } from "@xstate/react";
import { bindActionCreators } from "redux";
import { compose } from "ramda";

import { intercept } from "@/helpers/intercept";
import { xstateMutations } from "@/resources/xstates";
import machine, { states, actionTypes, serviceTypes, events } from "./machine";
import Pure${pascalName} from "./Pure";

const handler = ({ getState, dispatch }) =>
  machine.withConfig({
    actions: {
      [actionTypes.doSomething](ctx, evt) {
        console.log("do something!");
      },
    },
    services: {
      [serviceTypes.doFetch](ctx, evt) {
        // fake fetch
        return new Promise((resolve, reject) => {
          resolve();
        });
      }
    }
  });

export const HocCtrl${pascalName} = PureView =>
  function Ctrl${pascalName}({ regService, base, idx }) {    
    const service = useMemo(
      () =>
        regService(handler, {
          name: "${name}",
        }),
      []
    );
    const [current, send] = useService(service);

    return (
      <PureView
        loading={current.value === states.LOADING}
        success={current.value === states.SUCCESS}
        onDo={() => send(events.LOAD)}
      />
    );
  };

export default compose(
  intercept,
  connect(
    (state, ownProps) => ({}),
    dispatch =>
      bindActionCreators(
        {
          regService: xstateMutations.regService
        },
        dispatch
      )
  ),
  HocCtrl${pascalName}
)(Pure${pascalName});
`;
}

const path = `src/components/modules/${name}`;
const files = [
  { fileName: `index.js`, content: indexTemplate },
  { fileName: `Pure.jsx`, content: pureViewTemplate },
  { fileName: `${pascalName}.jsx`, content: ctrlTemplate },
  { fileName: `machine.js`, content: machineTemplate }
];

fs.mkdir(path, { recursive: true }, err => {
  if (err) throw err;
  files.forEach(file => {
    fs.writeFile(`${path}/${file.fileName}`, file.content, err => {
      if (err) throw err;
    });
  });
});
