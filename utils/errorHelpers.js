exports.getErrorMessage = (err) => {
  let message = err.message;

  if (err.errors) {
    message = Object.values(err.errors)[0].message;
  }

  return message;
};
