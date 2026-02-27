import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

export default function isValidID(req, res, next) {
  const { contactId } = req.params;

  if (!isValidObjectId(contactId)) {
    return next(createHttpError(400, 'Invalid contact ID format'));
  }

  next();
}
