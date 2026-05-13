import express from 'express';
import { getAllUsers, createUser, loginUser, getCurrentUser, logoutUser, registerUser, googleOAuthLogin, updateProfile, updateAvatar, deleteAvatar, changePassword } from '../controllers/userController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import multer from 'multer';

const router = express.Router();

// Configure multer for avatar uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});

router.get('/', getAllUsers);
router.post('/', createUser);
router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/auth/google', googleOAuthLogin);
router.post('/logout', requireAuth(), logoutUser);
router.get('/current', requireAuth(), getCurrentUser);
router.put('/profile', requireAuth(), updateProfile);
router.put('/avatar', requireAuth(), upload.single('avatar'), updateAvatar);
router.delete('/avatar', requireAuth(), deleteAvatar);
router.put('/password', requireAuth(), changePassword);

export default router;
