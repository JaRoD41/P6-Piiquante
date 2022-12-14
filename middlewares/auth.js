"use strict";
//création du middleware d'authentification

const jwt = require('jsonwebtoken');
const KEY = process.env.JWT_KEY; //mise en place de la clé d'encryption/décryption du token 

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, KEY);
    const userId = decodedToken.userId;

    req.auth = { userId };

    if (req.body.userId && req.body.userId !== userId) {
      throw process.env.AUTH_ID;
    } else {
      next();
    }

  } catch(error) {
    res.status(401).json({ message: process.env.FORBIDDEN });
  }
};
