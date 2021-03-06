import React, { Suspense } from "react";
import { css } from "@emotion/core";
import { View } from "react-navi";
import { Layout, Row, Col } from "antd";

const { Content } = Layout;

const colMarginTop = css`
  margin-top: 2rem;
`;

const LayoutLoginPage = ({ footer }) => {
  return (
    <Layout style={{ minHeight: "calc(100vh - 37px)" }}>
      <Content>
        <Row type="flex" justify="center">
          <Col css={colMarginTop}>
            <Suspense fallback={null}>
              <View />
            </Suspense>
          </Col>
        </Row>
      </Content>
      {footer}
    </Layout>
  );
};

export default LayoutLoginPage;
