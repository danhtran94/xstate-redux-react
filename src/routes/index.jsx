import React from "react";
import { compose, mount, redirect, withView, withTitle } from "navi";

import AppLayout from "@/components/layouts/app";
import PageLayout from "@/components/layouts/page";

import PageBases from "@/components/pages/bases";

const PageLayoutComp = <PageLayout />;

const routes = compose(
  withView(<AppLayout />),
  mount({
    "/": redirect("/login"),
    "/login": compose(
      withTitle("Hello my friend, please login ..."),
      withView(PageLayoutComp),
      withView(<PageBases />)
    ),
    "/bases": compose(
      withTitle("Bases"),
      withView(PageLayoutComp),
      withView(<PageBases />)
    )
  })
);

export default routes;
