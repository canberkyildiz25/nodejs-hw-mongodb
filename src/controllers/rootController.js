import { getRootMessage } from '../services/rootService.js';

export const getRootController = (req, res) => {
  const message = getRootMessage();
  res.send(message);
};
