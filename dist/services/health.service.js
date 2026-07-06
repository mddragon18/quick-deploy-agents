"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHealthStatus = getHealthStatus;
function getHealthStatus() {
    return {
        "status": "ok",
        "uptime": process.uptime()
    };
}
//# sourceMappingURL=health.service.js.map