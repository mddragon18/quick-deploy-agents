"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const configs_1 = require("./configs");
(0, configs_1.validateRequired)();
app_1.default.listen(configs_1.PORT, () => {
    console.log(`Server Started at https://localhost:${configs_1.PORT}`);
});
//# sourceMappingURL=index.js.map