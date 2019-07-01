import React from "react";
import { Button, Table, Divider } from "antd";

export const PureBaseList = ({
  empty,
  error,
  loading,
  bases,
  onCreateBase
}) => {
  if (empty) {
    return (
      <Button
        icon="plus"
        type="primary"
        // size="large"
        onClick={onCreateBase}
      >
        Create first base
      </Button>
    );
  }

  if (error) {
    return <div>Error while fetching bases.</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "id",
      key: "id",
      // eslint-disable-next-line react/display-name
      render: text => <a href="javascript:;">{text}</a>
    },
    {
      title: "Action",
      key: "action",
      // eslint-disable-next-line react/display-name
      render: (text, record) => (
        <span>
          <a href="javascript:;">View</a>
          <Divider type="vertical" />
          <a href="javascript:;">Delete</a>
        </span>
      )
    }
  ];

  return (
    <div>
      <Button
        style={{
          marginBottom: "1.5rem"
        }}
        type="primary"
        icon="plus"
        onClick={onCreateBase}
      >
        Create new
      </Button>
      <Table columns={columns} dataSource={bases} />
    </div>
  );
};

export default PureBaseList;
