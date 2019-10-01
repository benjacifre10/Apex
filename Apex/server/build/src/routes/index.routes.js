"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const question_routes_1 = __importDefault(require("./question.routes"));
class IndexRoutes {
    constructor(index) {
        this.index = index;
        this.setRoutes();
    }
    setRoutes() {
        this.index.use('/', question_routes_1.default);
    }
}
exports.default = IndexRoutes;
