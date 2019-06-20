import React from "react";
import { states } from "@/components/container/widgets/base-list/machine";

import WidgetBaseItem from "@/components/container/widgets/base-item";

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
        {bases.map(base => (
          <WidgetBaseItem base={base} />
        ))}
        <button onClick={onCreateBase}>Create More</button>
      </div>
    )
  };

  return views[modifier];
};

export default BaseList;
