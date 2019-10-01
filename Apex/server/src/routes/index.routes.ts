import questionRoutes from './question.routes';

export default class IndexRoutes {
    index: any;

    constructor(index: any) {
        this.index = index;
        this.setRoutes();
    }

    setRoutes(): void {
        this.index.use('/', questionRoutes);
    }
}