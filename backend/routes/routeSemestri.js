import kontrollerSemestri from '../controllers/Semestri.js';
import { Router } from 'express';

const router = Router();

router.post('/register', kontrollerSemestri.regjistroSemestrin);    

export default router;