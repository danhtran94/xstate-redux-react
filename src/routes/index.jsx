import React from "react";
import { compose, mount, redirect, withView, withTitle } from "navi";

import LayoutApp from "@/components/layouts/App";
import LayoutLoginPage from "@/components/layouts/LoginPage";
import LayoutCommonPage from "@/components/layouts/CommonPage";

import SharedFooter from "@/components/pages/shared/Footer";

const SharedFooterComp = <SharedFooter />;

const routes = compose(
  withView(<LayoutApp />),
  mount({
    "/": redirect("/login"),
    "/login": compose(
      withTitle("Hello my friend, please login..."),
      withView(<LayoutLoginPage footer={SharedFooterComp} />),
      // Page content
      withView(async () => {
        let { default: PageLogin } = await import(/* webpackChunkName: "login-page" */ "@/components/pages/login");
        return <PageLogin />;
      }),
    ),
    "/bases": compose(
      withTitle("All your bases"),
      withView(<LayoutCommonPage footer={SharedFooterComp} />),
      // Page content
      withView(async () => {
        let { default: PageBases } = await import(/* webpackChunkName: "bases-page" */ "@/components/pages/bases");
        return <PageBases />;
      }),
    ),
  }),
);

export default routes;
