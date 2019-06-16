import React from "react";
import { states } from "./machine";

export const BaseList = ({ modifier, bases, onCreateBase }) => {
  const views = {
    [states.EMPTY]: (
      <div>
        {"You don't have any base."}
        <br />
        <button onClick={onCreateBase}>Create One</button>
      </div>
    ),
    [states.ERROR]: <div>Error while fetching bases.</div>,
    [states.INIT]: <div>Waiting to validating.</div>,
    [states.LOADING]: <div>Loading...</div>,
    [states.SUCCESS]: (
      <div>
        {JSON.stringify(bases)} <br />
        <button onClick={onCreateBase}>Create More</button>
      </div>
    )
  };

  return views[modifier];
};

export default BaseList;
