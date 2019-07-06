import React from "react";
import { compose, mount, redirect, withView, withTitle } from "navi";

import LayoutApp from "@/components/layouts/App";

import PageLogin from "@/components/pages/login";
import PageBases from "@/components/pages/bases";

import SharedFooter from "@/components/pages/shared/Footer";

const SharedFooterComp = <SharedFooter />;
const routes = compose(
  withView(<LayoutApp />),
  mount({
    "/": redirect("/login"),
    "/login": compose(
      withTitle("Hello my friend, please login..."),
      withView(async () => {
        let { default: LayoutLoginPage } = await import(
          /* webpackChunkName: "layout-login-page" */ "@/components/layouts/LoginPage"
        );
        return <LayoutLoginPage footer={SharedFooterComp} />;
      }),
      withView(<PageLogin />)
    ),
    "/bases": compose(
      withTitle("All your bases"),
      withView(async () => {
        let { default: LayoutCommonPage } = await import(
          /* webpackChunkName: "layout-common-page" */ "@/components/layouts/CommonPage"
        );
        return <LayoutCommonPage footer={SharedFooterComp} />;
      }),
      withView(<PageBases />)
    )
  })
);

export default routes;
