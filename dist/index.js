"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const index_1 = require("./configs/index");
app_1.default.listen(index_1.env.PORT, () => {
    console.log(`Server Started at https://localhost:${index_1.env.PORT}`);
});
//# sourceMappingURL=index.js.map