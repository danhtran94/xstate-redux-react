import React, { useState } from "react";
import { View } from "react-navi";
import { Layout, Menu, Breadcrumb, Icon } from "antd";

const { Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const LayoutPageDefault = () => {
  const [collapsed, setCollapsed] = useState(false);
  const onCollapse = collapsed => {
    setCollapsed(collapsed);
  };

  return (
    <Layout style={{ minHeight: "calc(100vh - 37px)" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={["2"]} mode="inline">
          <Menu.Item key="2">
            <Icon type="desktop" />
            <span>Bases</span>
          </Menu.Item>
          <Menu.Item key="9">
            <Icon type="file" />
            <span>Cases</span>
          </Menu.Item>
          <SubMenu
            key="sub1"
            title={
              <span>
                <Icon type="user" />
                <span>User</span>
              </span>
            }
          >
            <Menu.Item key="3">Roles</Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
      <Layout>
        {/* <Header style={{ background: "#fff", padding: 0 }} /> */}
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>Bases</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>
            <View />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          UI v3.x.x - Engine v3.x.x
        </Footer>
      </Layout>
    </Layout>
  );
};

export default LayoutPageDefault;
