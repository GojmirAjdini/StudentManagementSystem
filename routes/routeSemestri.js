import kontrollerSemestri from '../controllers/Semestri.js';
import { Router } from 'express';

const router = Router();

router.get('/all', kontrollerSemestri.readAllSemestrat);
router.post('/register', kontrollerSemestri.regjistroSemestrin);    

export default router;