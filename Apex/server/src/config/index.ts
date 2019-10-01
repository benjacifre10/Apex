import express, { Request, Response, NextFunction, Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';

// Routes
import indexRoutes from './../routes/index.routes';

export class App {
    private app: Application;

    constructor(private port?: number | string) {
        this.app = express();
        this.settings();
        this.middlewares();
        this.routes();
        this.errors();
    }

    settings(): void {
        this.app.set('port', this.port || process.env.PORT || 3000);
    }

    middlewares(): void {
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');//le doy acceso a cualquier cliente
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
            if (req.method === 'OPTIONS') {
                res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
                return res.status(200).json({message:'sinerror'});
            }
            next();
        });
    }

    routes() {
        new indexRoutes(this.app).setRoutes();
    }

    errors() {
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            const error: any = new Error('Not found');
            error.status = 404;
            next(error);//esto apunta a la siguiente funcion que devuelve el json
        });
        
        this.app.use((error: any, req: Request, res: Response, next: NextFunction) => {
            res.status(error.status || 500);
            res.json({
                error: {
                    message: error.message
                }
            });
        });
    }

    async listen() {
        await this.app.listen(this.app.get('port'));
        console.log('Server on port', this.app.get('port'));
    }
}