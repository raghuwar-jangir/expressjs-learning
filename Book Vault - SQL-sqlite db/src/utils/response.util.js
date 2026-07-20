const sendResponse = (res, statusCode, data, message) => {
  res.status(statusCode).json({
    success: true,
    data: data,
    message: message,
  });
};

module.exports = { sendResponse };
