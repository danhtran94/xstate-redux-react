import React from "react";
import { Layout } from "antd";

const { Footer } = Layout;

const SharedFooter = () => {
  return (
    <Footer style={{ textAlign: "center" }}>
      versions: gui v3.x.x ~ server v3.x.x
    </Footer>
  );
};

export default SharedFooter;
