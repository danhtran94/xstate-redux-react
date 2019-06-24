import React from "react";

import BaseList from "@/components/presents/base-list";
import BaseCreationForm from "@/components/presents/base-creation-form";

const PurePageBases = ({ modifier }) => {
  return (
    modifier && (
      <div className="page-bases__main">
        <BaseCreationForm name="baseCreationForm" />
        <BaseList name="baseList" />
      </div>
    )
  );
};

export default PurePageBases;
