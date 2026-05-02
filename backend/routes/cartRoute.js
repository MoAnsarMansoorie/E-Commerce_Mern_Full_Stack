import express from 'express';
import { addToUserCartController, updateUserCartController, getUserCartController } from '../controllers/cartController.js';
import authUser from '../middlewares/authUser.js';

const router = express.Router();

router.post('/add', authUser, addToUserCartController);
router.post('/update', authUser, updateUserCartController);
router.post('/get',authUser, getUserCartController);

export default router;