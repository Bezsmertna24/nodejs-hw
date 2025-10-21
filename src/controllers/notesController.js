import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

// GET /notes
export const getAllNotes = async (req, res, next) => {
  try {
    const { tag, search, page = 1, perPage = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(perPage);

    const filter = { userId: req.user._id };

    if (tag) {
      filter.tag = tag;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const query = Note.find(filter);

    const [totalNotes, notes] = await Promise.all([
      Note.countDocuments(filter),
      query.skip(skip).limit(Number(perPage))
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
    const note = await Note.findOne({
      _id: req.params.noteId,
      userId: req.user._id,
    });

    if (!note) throw createHttpError(404, 'Note not found');

    res.status(200).json(note);
  } catch (err) {
    next(err);
  }
};

// POST /notes
export const createNote = async (req, res, next) => {
  try {
    const newNote = await Note.create({
      ...req.body,
      userId: req.user._id,
    });

    res.status(201).json(newNote);
  } catch (err) {
    next(err);
  }
};

// DELETE /notes/:noteId
export const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.noteId,
      userId: req.user._id,
    });

    if (!note) throw createHttpError(404, 'Note not found');

    res.status(200).json(note);
  } catch (err) {
    next(err);
  }
};

// PATCH /notes/:noteId
export const updateNote = async (req, res, next) => {
  try {
    const updatedNote = await Note.findOneAndUpdate(
      { _id: req.params.noteId, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedNote) throw createHttpError(404, 'Note not found');

    res.status(200).json(updatedNote);
  } catch (err) {
    next(err);
  }
};

