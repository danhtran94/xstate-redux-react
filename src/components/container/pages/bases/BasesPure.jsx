import React from "react";

import WidgetBaseList from "@/components/container/widgets/base-list";
import WidgetBaseCreationForm from "@/components/container/widgets/base-creation-form";

const PageBasesPure = ({ modifier }) => {
  return (
    modifier && (
      <React.Fragment>
        <WidgetBaseCreationForm name="widgetBaseCreationForm" />
        <WidgetBaseList name="widgetBaseList" />
      </React.Fragment>
    )
  );
};

export default PageBasesPure;
