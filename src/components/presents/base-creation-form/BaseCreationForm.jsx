import React from "react";
import { useService } from "@xstate/react";
import { events, states } from "./machine";

const BaseCreationForm = ({ service }) => {
  const [current, send] = useService(service, {
    devTools: true
  });

  // console.log(current.value);

  const views = {
    [states.END]: <div />,
    [states.ERROR]: <div>Creating error.</div>,
    [states.INIT]: (
      <div>
        Please enter.
        <button
          onClick={() =>
            send(events.CONFIRM, { base: { name: "hello-xstate" } })
          }
        >
          Confirm
        </button>
      </div>
    ),
    [states.INVALID]: <div>Invalid.</div>,
    [states.LOADING]: <div>Requesting.</div>,
    [states.SUCCESS]: <div>Complete.</div>
  };

  return views[current.value];
};

export default BaseCreationForm;
