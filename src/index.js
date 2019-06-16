import Navigo from "navigo";
import { createElement } from "react";
import { render, unmountComponentAtNode } from "react-dom";
// import Vue from "vue";

import Root from "./Root";
// import AppVue from "./AppVue.vue";

var router = new Navigo("#", true);

router
  .on(
    "react",
    async () => {
      render(createElement(Root), document.getElementById("root"));
    },
    {
      leave: () => {
        unmountComponentAtNode(document.getElementById("root"));
      }
    }
  )
  // .on(
  //   "vue",
  //   async () => {
  //     new Vue({
  //       el: root,
  //       render: h => h(AppVue)
  //     });
  //   },
  //   {
  //     leave: () => {
  //       const vueInstance = document.getElementById("root").__vue__;
  //       vueInstance.$destroy();
  //     }
  //   }
  // )
  .resolve();
