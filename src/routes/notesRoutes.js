import { Router } from 'express';
import { celebrate, Segments } from 'celebrate';
import {
  getAllNotes,
  getNoteById,
  createNote,
  deleteNote,
  updateNote,
} from '../controllers/notesController.js';

import {
  getAllNotesJoi,
  noteIdJoi,
  createNoteJoi,
  updateNoteJoi,
} from '../validations/notesValidation.js';

const router = Router();


router.get(
  '/notes',
  celebrate({ [Segments.QUERY]: getAllNotesJoi }),
  getAllNotes
);


router.get(
  '/notes/:noteId',
  celebrate({ [Segments.PARAMS]: noteIdJoi }),
  getNoteById
);


router.post(
  '/notes',
  celebrate({ [Segments.BODY]: createNoteJoi }),
  createNote
);

router.delete(
  '/notes/:noteId',
  celebrate({ [Segments.PARAMS]: noteIdJoi }),
  deleteNote
);

//(path + body одночасно)
router.patch(
  '/notes/:noteId',
  celebrate({
    [Segments.PARAMS]: noteIdJoi,
    [Segments.BODY]: updateNoteJoi,
  }),
  updateNote
);

export default router;

