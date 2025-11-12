import express from 'express';

import { createSociety, addSocietyMembers, getSocietyMembers, getAllSocieties } from '../controllers/society.controllers.js';

const router = express.Router();

router.post('/create-society', createSociety);
router.post('/add-member', addSocietyMembers);
router.get('/:managerId', getSocietyMembers)
router.get('/', getAllSocieties)

export default router;