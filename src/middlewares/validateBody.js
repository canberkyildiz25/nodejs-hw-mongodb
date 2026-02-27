import createHttpError from 'http-errors';

export default function validateBody(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return next(createHttpError(400, error.message));
    }

    next();
  };
}
