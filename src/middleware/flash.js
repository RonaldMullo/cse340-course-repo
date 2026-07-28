/**
 * Stores temporary messages in the user's session.
 * Messages disappear after being displayed once.
 */
function flash(req, res, next) {
  const emptyMessages = () => ({
    success: [],
    error: [],
    warning: [],
    info: [],
  });

  if (!req.session.flash) {
    req.session.flash = emptyMessages();
  }

  req.flash = (type, message) => {
    // Store a message.
    if (type && message) {
      if (!req.session.flash[type]) {
        req.session.flash[type] = [];
      }

      req.session.flash[type].push(message);
      return undefined;
    }

    // Retrieve and clear one message type.
    if (type) {
      const messages = req.session.flash[type] || [];
      req.session.flash[type] = [];
      return messages;
    }

    // Retrieve and clear every message.
    const messages = req.session.flash;
    req.session.flash = emptyMessages();

    return messages;
  };

  res.locals.flash = req.flash;
  next();
}

export default flash;