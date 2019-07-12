import { createElement } from "react";
import { render } from "react-dom";
import { akitaDevtools } from "@datorama/akita";
akitaDevtools();

import Root from "./Root";
render(createElement(Root), document.getElementById("root"));
