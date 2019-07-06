import React from "react";
import { Alert } from "antd";
import { View } from "react-navi";

const LayoutApp = () => {
  return (
    <div className="layout-app">
      <Alert message="Development Environment" banner />
      <View />
    </div>
  );
};

export default LayoutApp;
