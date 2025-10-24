import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import { createSession, setSessionCookies } from '../services/auth.js';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/sendMail.js';


export async function registerUser(req, res, next) {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) throw createHttpError(400, 'Email in use');

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashedPassword });

    const session = await createSession(newUser._id);
    setSessionCookies(res, session);

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
}


export async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw createHttpError(401, 'User not found');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw createHttpError(401, 'Invalid credentials');

    await Session.deleteMany({ userId: user._id });

    const session = await createSession(user._id);
    setSessionCookies(res, session);

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

export async function refreshUserSession(req, res, next) {
  try {
    const { sessionId, refreshToken } = req.cookies;

    const session = await Session.findOne({ _id: sessionId, refreshToken });
    if (!session) throw createHttpError(401, 'Session not found');

    if (session.refreshTokenValidUntil < new Date())
      throw createHttpError(401, 'Session token expired');

    await Session.deleteOne({ _id: session._id });

    const newSession = await createSession(session.userId);
    setSessionCookies(res, newSession);

    res.status(200).json({ message: 'Session refreshed' });
  } catch (error) {
    next(error);
  }
}


export async function logoutUser(req, res, next) {
  try {
    const { sessionId } = req.cookies;

    if (sessionId) {
      await Session.deleteOne({ _id: sessionId });
    }

    // Очищаємо кукі
    res.clearCookie('sessionId');
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}


export const requestResetEmail = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(200).json({
      message: 'If this email exists, a reset link has been sent',
    });
  }

  const resetToken = jwt.sign(
    { sub: user._id, email },
    process.env.JWT_SECRET,
    { expiresIn: '15m' },
  );

  const templatePath = path.resolve('src/templates/reset-password-email.html');

  const templateSource = await fs.readFile(templatePath, 'utf-8');

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.username,
    link: `${process.env.FRONTEND_DOMAIN}/reset-password?token=${resetToken}`,
  });

  try {
    await sendEmail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch {
    next(
      createHttpError(500, 'Failed to send the email, please try again later.'),
    );
    return;
  }

  res.status(200).json({
    message: 'If this email exists, a reset link has been sent',
  });
};

export const resetPassword = async (req, res, next) => {
  const { token, password } = req.body;

  try {
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return next(createHttpError(401, 'Invalid or expired token'));
    }

    const user = await User.findOne({ _id: payload.sub, email: payload.email });
    if (!user) {
      return next(createHttpError(404, 'User not found'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    next(error);
  }
};