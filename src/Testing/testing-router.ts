import express, { Express } from 'express';
import testingController from './testing-controller';

//Testing
export const testingRoutes = express.Router()

testingRoutes.delete('/testing/all-data',
    testingController.deleteAll,
)

// testingRoutes.all("*", (req, res, next) => {

//     console.log('req.method:', req.method);
//     console.log('req.url:', req.url);
//     console.log('req.params:', req.params);
//     console.log('req.query:', req.query);
//     console.log('req.body:', req.body);
//     next();
// })



