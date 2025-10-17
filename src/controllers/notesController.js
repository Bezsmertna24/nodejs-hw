import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

// GET /notes
export const getAllNotes = async (req, res, next) => {
  try {
    const { tag, search, page = 1, perPage = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(perPage);

    let query = Note.find();

    if (tag) {
      query = query.where('tag').equals(tag);
    }

    if (search) {
      query = query.find({ $text: { $search: search } });
    }

    const [totalNotes, notes] = await Promise.all([
      Note.countDocuments(query.getQuery()), // filter
      query.skip(skip).limit(Number(perPage)) //all
    ]);

    const totalPages = Math.ceil(totalNotes / Number(perPage));

    res.status(200).json({
      page: Number(page),
      perPage: Number(perPage),
      totalNotes,
      totalPages,
      notes,
    });
  } catch (err) {
    next(err);
  }
};

// GET /notes/:noteId
export const getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.noteId);
    if (!note) throw createHttpError(404, 'Note not found');
    res.status(200).json(note);
  } catch (err) {
    next(err);
  }
};

// POST /notes
export const createNote = async (req, res, next) => {
  try {
    const newNote = await Note.create(req.body);
    res.status(201).json(newNote);
  } catch (err) {
    next(err);
  }
};

// DELETE /notes/:noteId
export const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.noteId);
    if (!note) throw createHttpError(404, 'Note not found');
    res.status(200).json(note);
  } catch (err) {
    next(err);
  }
};

// PATCH /notes/:noteId
export const updateNote = async (req, res, next) => {
  try {
    const updatedNote = await Note.findByIdAndUpdate(req.params.noteId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedNote) throw createHttpError(404, 'Note not found');
    res.status(200).json(updatedNote);
  } catch (err) {
    next(err);
  }
};
