import React from "react";
import { Layout } from "antd";

const { Footer } = Layout;

const SharedFooter = () => {
  return (
    <Footer style={{ textAlign: "center" }}>
      current version # gui 4.0.0-alpha ~ server 3.10.0
    </Footer>
  );
};

export default SharedFooter;
