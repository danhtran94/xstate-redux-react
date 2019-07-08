import React, { useMemo } from "react";
import { useService } from "@xstate/react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { useNavigation, useCurrentRoute } from "react-navi";
import auth0 from "auth0-js";

import { xstateMutations } from "@/resources/xstates";
import { userMutations } from "@/resources/user";

import PurePageLogin from "./Pure";

import machine, {
  actionTypes,
  events,
  guardTypes,
  serviceTypes,
  states
} from "./machine";

const webAuth = new auth0.WebAuth({
  domain: process.env.AUTH0_DOMAIN,
  clientID: process.env.AUTH0_CLIENT_ID,
  audience: process.env.AUTH0_AUD,
  responseType: "token id_token",
  scope: "openid profile email"
});

export const handlerMaker = ({ navigation, route }) => ({
  dispatch,
  getState
}) =>
  machine.withConfig({
    actions: {
      [actionTypes.goToHomePage]: () => {
        navigation.navigate("/bases");
      },
      [actionTypes.auth0Cb]() {
        webAuth.popup.callback();
      }
    },
    services: {
      [serviceTypes.doLogin](ctx, evt) {
        return new Promise((resolve, reject) => {
          webAuth.popup.authorize(
            {
              redirectUri: process.env.AUTH0_REDIRECT
            },
            (err, { idTokenPayload, accessToken }) => {
              if (err) reject(err);
              const user = { idTokenPayload, accessToken };
              dispatch(userMutations.add(user));
              resolve(user);
            }
          );
        });
      }
    },
    guards: {
      [guardTypes.loginSuccess](
        ctx,
        {
          data: { idTokenPayload, accessToken }
        }
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
      }
    }
  });

const CtrlPageLogin = ({ regService, user }) => {
  const navigation = useNavigation();
  const route = useCurrentRoute();

  const service = useMemo(
    () =>
      regService(handlerMaker({ navigation, route }), {
        name: "page-login",
        watch: true
      }),
    []
  );
  // useEffect(() => () => service.stop(), []); // release machine after login
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

export default connect(
  state => ({ user: state.user }),
  dispatch =>
    bindActionCreators(
      {
        regService: xstateMutations.regService
      },
      dispatch
    )
)(CtrlPageLogin);
