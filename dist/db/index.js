"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const configs_1 = require("../configs");
const pg_1 = require("pg");
exports.pool = new pg_1.Pool({
    connectionString: configs_1.env.DB_URL
});
//# sourceMappingURL=index.js.map