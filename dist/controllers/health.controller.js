"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHealth = getHealth;
const health_service_1 = require("../services/health.service");
function getHealth(req, res) {
    const health = (0, health_service_1.getHealthStatus)();
    res.json(health);
}
//# sourceMappingURL=health.controller.js.map