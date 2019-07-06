import React, { useMemo, useEffect } from "react";
import { useService } from "@xstate/react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { useNavigation } from "react-navi";

import { xstateMutations } from "@/resources/xstates";

import PurePageLogin from "./Pure";

import machine, { actionTypes, events } from "./machine";

export const handlerMaker = ({ navigation }) => ({ dispatch }) =>
  machine.withConfig({
    actions: {
      [actionTypes.goToHomePage]: () => {
        setTimeout(() => navigation.navigate("/bases"), 1000);
      }
    }
  });

const CtrlPageLogin = ({ regService }) => {
  const navigation = useNavigation();
  const service = useMemo(
    () =>
      regService(handlerMaker({ navigation }), {
        name: "page-login"
      }),
    []
  );
  useEffect(() => () => service.stop(), []); // release machine after login
  const [, send] = useService(service);

  return (
    <PurePageLogin
      onLogin={() => {
        send(events.DO_LOGIN);
      }}
    />
  );
};

export default connect(
  null,
  dispatch =>
    bindActionCreators(
      {
        regService: xstateMutations.regService
      },
      dispatch
    )
)(CtrlPageLogin);
