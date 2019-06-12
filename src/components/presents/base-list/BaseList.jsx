import React from "react";
import { useService } from "@xstate/react";
import { events, states } from "./machine";

const BaseList = ({ service }) => {
  const [current, send] = useService(service, {
    devTools: true
  });

  // console.log(current.value);

  const views = {
    [states.EMPTY]: (
      <div>
        You don't have any base.
        <br />
        <button onClick={() => send(events.CREATE_BASE)}>Create One</button>
      </div>
    ),
    [states.ERROR]: <div>Error while fetching bases.</div>,
    [states.INIT]: <div>Waiting to validating.</div>,
    [states.LOADING]: <div>Loading...</div>,
    [states.SUCCESS]: (
      <div>
        Show your bases. <br />
        <button onClick={() => send(events.CREATE_BASE)}>Create More</button>
      </div>
    )
  };

  return views[current.value];
};

export default BaseList;
