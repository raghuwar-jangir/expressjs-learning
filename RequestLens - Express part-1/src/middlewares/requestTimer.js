// Why It Fails
// Event Meaning: The 'finish' event fires after the last chunk of the
// response has been handed off to the operating system for transmission.
// Protocol Rule: HTTP requires headers to travel before the body.
//  Once transmission begins, the header block is locked.
// Error Trigger: Attempting to use res.setHeader()
// here will throw an ERR_HTTP_HEADERS_SENT error

// ********************
// const requestTimer = (req, res, next) => {
//   const reqTime = Date.now();
//   res.on("finish", () => {
//     const resTime = Date.now();
//     const timeTaken = resTime - reqTime;
//     res.setHeader("X-Response-Time", `${timeTaken}ms`);
//   });

//   next();
// };

// ***************** monkey patching 🐒🐵
// request comes in
//       ↓
// requestTimer — saves start, overrides res.send
//       ↓
// controller calls res.send()
//       ↓
// our override runs first — sets header ✅
//       ↓
// original res.send fires — response goes out
//       ↓
// client receives X-Response-Time header ✅

const requestTimer = (req, res, next) => {
  const reqTime = Date.now();

  const originalSend = res.send.bind(res);

  res.send = (...args) => {
    res.setHeader("X-Response-Time", `${Date.now() - reqTime}ms`);
    return originalSend(...args);
  };

  next();
};

module.exports = {
  requestTimer,
};
