// Success response helper
export const sendSuccess = (res, data, message = null, statusCode = 200) => {
  const response = { ...data };
  if (message) {
    response.message = message;
  }
  return res.status(statusCode).json(response);
};

// Error response helper
export const sendError = (res, message, statusCode = 500) => {
  return res.status(statusCode).json({ error: message });
};

// Not found response helper
export const sendNotFound = (res, resource = 'Resource') => {
  return res.status(404).json({ error: `${resource} not found` });
};

// Bad request response helper
export const sendBadRequest = (res, message = 'Bad request') => {
  return res.status(400).json({ error: message });
};

