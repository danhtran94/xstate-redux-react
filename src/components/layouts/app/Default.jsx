import React from "react";
import { Alert } from "antd";
import { View } from "react-navi";

const LayoutAppDefault = () => {
  return (
    <div className="layout-app">
      <Alert message="Development Environment" banner />
      <View />
    </div>
  );
};

export default LayoutAppDefault;
