import { Router } from 'express';
import { questionController } from './../controllers/question.controller';

class InitialRoutes {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router
            .get('/question', questionController.getQuestions);
    }
}

export default new InitialRoutes().router;