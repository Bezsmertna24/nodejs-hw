import { Router } from 'express';
import { celebrate, Segments } from 'celebrate';
import { authenticate } from '../middlewares/authenticate.js';

import {
  getAllNotes,
  getNoteById,
  createNote,
  deleteNote,
  updateNote,
} from '../controllers/notesController.js';

import {
  getAllNotesSchema,
  noteIdSchema,
  createNoteSchema,
  updateNoteSchema,
} from '../validations/notesValidation.js';

const router = Router();

router.get(
  '/notes',
  authenticate,
  celebrate({ [Segments.QUERY]: getAllNotesSchema }),
  getAllNotes
);

router.get(
  '/notes/:noteId',
  authenticate,
  celebrate({ [Segments.PARAMS]: noteIdSchema }),
  getNoteById
);

router.post(
  '/notes',
  authenticate,
  celebrate({ [Segments.BODY]: createNoteSchema }),
  createNote
);

router.delete(
  '/notes/:noteId',
  authenticate,
  celebrate({ [Segments.PARAMS]: noteIdSchema }),
  deleteNote
);

// (path + body одночасно)
router.patch(
  '/notes/:noteId',
  authenticate,
  celebrate({
    [Segments.PARAMS]: noteIdSchema,
    [Segments.BODY]: updateNoteSchema,
  }),
  updateNote
);

export default router;


