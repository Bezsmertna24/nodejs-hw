import mongoose from 'mongoose';
import { TAGS } from '../constants/tags.js';

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, trim: true, default: '' },
    tag: {
      type: String,
      enum: TAGS,
      default: 'Todo',
    },
  },
  { timestamps: true }
);

noteSchema.index({ title: 'text', content: 'text' });

export const Note = mongoose.model('Note', noteSchema);