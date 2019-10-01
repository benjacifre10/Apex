"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const question_controller_1 = require("./../controllers/question.controller");
class InitialRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router
            .get('/question', question_controller_1.questionController.getQuestions);
    }
}
exports.default = new InitialRoutes().router;
