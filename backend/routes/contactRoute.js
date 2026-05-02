import express from 'express';
import { createContact, listContacts } from '../controllers/contactController.js';
import adminAuth from '../middlewares/adminAuth.js';
import authUser from '../middlewares/authUser.js';

const router = express.Router();

// Protected: submit contact message (user must be logged in)
router.post('/', authUser, createContact);

// Admin: list all contact messages
router.get('/', adminAuth, listContacts);

export default router;
