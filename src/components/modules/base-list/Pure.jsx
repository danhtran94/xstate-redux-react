import React from "react";
import { Button, Row, Col } from "antd";
import { groupBy, values, addIndex, map } from "ramda";

import BaseItem from "@/components/modules/base-item";

export const PureBaseList = ({ empty, error, loading, bases, onCreateBase }) => {
  if (empty) {
    return (
      <div>
        <Button icon="plus" type="primary" onClick={onCreateBase}>
          Create first base
        </Button>
      </div>
    );
  }

  if (error) {
    return <div>Error while fetching bases.</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  const mapIndexed = addIndex(map);
  const basesWithIdx = mapIndexed((base, idx) => ({ base: base, idx }), bases);
  const grouped4Bases = groupBy(({ idx }) => Math.floor(idx / 4), basesWithIdx);

  return (
    <div>
      <Button
        style={{
          marginBottom: "1.5rem",
        }}
        type="primary"
        icon="plus"
        onClick={onCreateBase}
      >
        Create new
      </Button>
      {values(grouped4Bases).map((row, rowIdx) => (
        <Row key={rowIdx} style={{ marginBottom: "1.5rem" }} gutter={16}>
          {row.map(({ base }, colIdx) => (
            <Col key={colIdx} span={6}>
              <BaseItem name={`baseItem${rowIdx}${colIdx}`} base={base} idx={`${rowIdx}${colIdx}`} />
            </Col>
          ))}
        </Row>
      ))}
    </div>
  );
};

export default PureBaseList;
