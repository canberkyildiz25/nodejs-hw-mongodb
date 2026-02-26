export const errorHandler = (err, req, res, next) => {
  const status = Number(err.status) || 500;
  const message = err.message || 'Something went wrong';

  req.log?.error({ err }, 'Request failed');

  res.status(status).json({
    message,
  });
};
