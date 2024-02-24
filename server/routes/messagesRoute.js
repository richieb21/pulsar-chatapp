import { addMessage, getAllMessages } from '../controllers/messageController.js';
import express from 'express';

const router = express.Router();

router.post('/addmessage', addMessage);
router.get('/getmsg', getAllMessages);

export default router;