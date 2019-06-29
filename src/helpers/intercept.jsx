import React, { useContext, Fragment, createContext } from "react";

const interceptRegistry = createContext({});

export const InterceptProvider = ({ registers, children }) => {
  return (
    <interceptRegistry.Provider value={registers}>
      {children}
    </interceptRegistry.Provider>
  );
};

export function intercept(Component) {
  return function WrappedWithIntercept({ name = "", ...prop }) {
    if (name === "")
      console.warn(Component.displayName, "using intercept without name!");

    const intercepts = useContext(interceptRegistry);
    if (intercepts[name]) {
      console.info("# Intercepted", Component.displayName, "as", name);

      const InterceptedComponent = intercepts[name];
      return <InterceptedComponent {...prop} />;
    }

    return <Component {...prop} />;
  };
}
