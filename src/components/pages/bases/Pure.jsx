import React from "react";
import { useCurrentRoute } from "react-navi";

import BaseList from "@/components/modules/base-list";
import BaseCreationForm from "@/components/modules/base-creation-form";

const PurePageBases = ({ modifier }) => {
  const { data } = useCurrentRoute();
  console.log("data", data);

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
