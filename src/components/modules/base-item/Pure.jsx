import React from "react";
import { Card, Icon, Avatar } from "antd";
const { Meta } = Card;

const PureBaseItem = ({ modifier, base, onRemove }) => {
  return (
    <Card
      style={{ width: "100%" }}
      actions={[
        <Icon key="setting" type="setting" />,
        <Icon key="edit" type="edit" />,
        <Icon key="ellipsis" type="ellipsis" />
      ]}
    >
      <Meta title={base.id} description="This is the description" />
    </Card>
  );
};

export default PureBaseItem;
