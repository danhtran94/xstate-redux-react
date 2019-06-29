import React from "react";
import { View } from "react-navi";
import {
  Header,
  HeaderName,
  Content
} from "carbon-components-react/lib/components/UIShell";

const LayoutDefaultPage = () => {
  return (
    <div className="layout-default-page">
      <Header aria-label="IBM Platform Name">
        <HeaderName href="#" prefix="TSE">
          UI
        </HeaderName>
      </Header>
      <Content id="main-content">
        <View />
      </Content>
    </div>
  );
};

export default LayoutDefaultPage;
