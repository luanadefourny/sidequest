import express, { Router } from 'express';
import { getUsers, registerUser, loginUser } from '../controllers/userController';

const router: Router = express.Router();

router.get('/users', getUsers);
router.post('/users', registerUser);
router.put('/users', loginUser);

export default router;