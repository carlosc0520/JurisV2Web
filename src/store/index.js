import { createStore } from "vuex";

import theme from "./modules/theme.js";
import filter from "./modules/filter.js";
import auth from "./modules/auth.js";

export default createStore({
  modules: {
    theme,
    filter,
    auth
  },
});