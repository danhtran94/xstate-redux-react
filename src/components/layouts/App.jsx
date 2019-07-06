import React, { Suspense } from "react";
import { Alert } from "antd";
import { View } from "react-navi";

const LayoutApp = () => {
  return (
    <div className="layout-app">
      <Alert message="Development Environment" banner />
      <Suspense fallback={null}>
        <View />
      </Suspense>
    </div>
  );
};

export default LayoutApp;
