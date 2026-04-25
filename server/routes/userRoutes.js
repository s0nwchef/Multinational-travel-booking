import express from 'express';
import { getAllUsers, createUser, loginUser, getCurrentUser, logoutUser } from '../controllers/userController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllUsers);
router.post('/', createUser);
router.post('/login', loginUser);
router.post('/logout', requireAuth(), logoutUser);
router.get('/current', requireAuth(), getCurrentUser);

export default router;
