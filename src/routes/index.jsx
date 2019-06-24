import React from "react";
import { compose, withView, mount, route } from "navi";

import LayoutDefault from "@/components/layouts/default";
import PageBases from "@/components/pages/bases";

const routes = compose(
  withView(<LayoutDefault />),
  mount({
    "/": route({
      title: "Bases",
      view: <PageBases />
    })
  })
);

export default routes;
