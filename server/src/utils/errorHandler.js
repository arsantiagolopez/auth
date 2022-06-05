// Return generic error message

const errorHandler = (field, message) => ({
  errors: [{ field, message }],
});

export { errorHandler };
