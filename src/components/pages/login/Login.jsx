import React, { useMemo } from "react";
import { useService } from "@xstate/react";
import { useNavigation, useCurrentRoute } from "react-navi";
import auth0 from "auth0-js";

import { use$ } from "@/helpers/hooks";

import { machineService } from "@/resources/machine/service";
import { userService } from "@/resources/user/service";
import { userQuery } from "@/resources/user/query";

import machine, { actionTypes, events, guardTypes, serviceTypes, states } from "./machine";
import PurePageLogin from "./Pure";

const webAuth = new auth0.WebAuth({
  domain: process.env.AUTH0_DOMAIN,
  clientID: process.env.AUTH0_CLIENT_ID,
  audience: process.env.AUTH0_AUD,
  responseType: "token id_token",
  scope: "openid profile email",
});

export const machineCreator = ({ navigation, route }) =>
  machine.withConfig({
    actions: {
      [actionTypes.goToHomePage]: () => {
        navigation.navigate("/bases");
      },
      [actionTypes.auth0Cb]() {
        webAuth.popup.callback();
      },
    },
    services: {
      [serviceTypes.doLogin](ctx, evt) {
        return new Promise((resolve, reject) => {
          webAuth.popup.authorize(
            {
              redirectUri: process.env.AUTH0_REDIRECT,
            },
            (err, { idTokenPayload, accessToken }) => {
              if (err) reject(err);
              const user = { idTokenPayload, accessToken };
              userService.saveCredential(user);
              resolve(user);
            },
          );
        });
      },
    },
    guards: {
      [guardTypes.loginSuccess](
        ctx,
        {
          data: { idTokenPayload, accessToken },
        },
      ) {
        return !!idTokenPayload && !!accessToken;
      },
      [guardTypes.shouldRedirect]() {
        return !!route.url.hash;
      },
      [guardTypes.shouldLogin]() {
        return !route.url.hash;
      },
      [guardTypes.loginFail](ctx, evt) {
        return true;
      },
    },
  });

const CtrlPageLogin = () => {
  const navigation = useNavigation();
  const route = useCurrentRoute();

  const service = useMemo(
    () =>
      machineService.regService(machineCreator({ navigation, route }), {
        name: "page-login",
        watch: true,
      }),
    [],
  );

  const user = use$(userQuery.getCurrentUser$);
  const [current, send] = useService(service);

  return (
    <PurePageLogin
      redirect={current.matches({ [states.INIT]: [states.REDIRECT] })}
      logged={current.matches({ [states.INIT]: [states.LOGGED] })}
      logging={current.matches({ [states.INIT]: [states.LOGGING] })}
      onLogin={() => {
        send(events.DO_LOGIN);
      }}
      user={user}
    />
  );
};

export default CtrlPageLogin;
