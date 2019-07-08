import React, { useState } from "react";
import { Button } from "antd";
import { css } from "@emotion/core";

export const PurePageLogin = ({ redirect, logged, logging, onLogin, user }) => {
  if (redirect) {
    return (
      <div
        css={css`
          margin: 0 auto;
          overflow: hidden;
        `}
      >
        {`Login success, redirecting...`}
      </div>
    );
  }
  return logged ? (
    <div
      css={css`
        margin: 0 auto;
        overflow: hidden;
      `}
    >
      {`Logged: ${user.idTokenPayload.email}`}
    </div>
  ) : (
    <Button loading={logging} icon="user" type="primary" onClick={onLogin}>
      Login
    </Button>
  );
};

export default PurePageLogin;
