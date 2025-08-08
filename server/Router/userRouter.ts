import express, { Router } from 'express';
import { getAllUsers, createUser } from '../Controllers/userControllers';

const router: Router = express.Router();

router.get('/users', getAllUsers);
router.post('/users', createUser);

export default router;