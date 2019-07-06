import React from "react";
import { compose, mount, redirect, withView, withTitle } from "navi";

import LayoutApp from "@/components/layouts/App";
import LayoutCommonPage from "@/components/layouts/CommonPage";
import LayoutLoginPage from "@/components/layouts/LoginPage";

import PageLogin from "@/components/pages/login";
import PageBases from "@/components/pages/bases";

import SharedFooter from "@/components/pages/shared/Footer";

const SharedFooterComp = <SharedFooter />;
const routes = compose(
  withView(<LayoutApp />),
  mount({
    "/": redirect("/login"),
    "/login": compose(
      withTitle("Hello my friend, please login ..."),
      withView(<LayoutLoginPage footer={SharedFooterComp} />),
      withView(<PageLogin />)
    ),
    "/bases": compose(
      withTitle("All your bases"),
      withView(<LayoutCommonPage footer={SharedFooterComp} />),
      withView(<PageBases />)
    )
  })
);

export default routes;
