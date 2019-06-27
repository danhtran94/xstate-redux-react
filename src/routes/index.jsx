import React from "react";
import { compose, withView, mount, route } from "navi";

import LayoutDefault from "@/components/layouts/default";
import PageBases from "@/components/pages/bases";
import BaseList from "@/components/modules/base-list";

const routes = compose(
  withView(<LayoutDefault />),
  mount({
    "/": route({
      title: "Bases",
      data: {
        Section: <BaseList />
      },
      view: <PageBases />
    })
  })
);

export default routes;
