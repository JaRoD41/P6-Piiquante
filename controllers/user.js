const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require("../models/User");

exports.signup = (req, res, next) => {
	console.log("params :", req.params);
	console.log("requete :", req.body);
  bcrypt.hash(req.body.password, 10)
  .then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user
			.save()
			.then(() =>
				res.status(201).json({ message: process.env.CREATE_USER_SUCCESS })
			)
			.catch((error) => res.status(400).json({ error }));
  })
  .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
		.then(user => {
      if (user === null) {
        res.status(401).json({ message: process.env.LOGIN_ERROR });
      } else {
        bcrypt
					.compare(req.body.password, user.password)
					.then(valid => {
            if (!valid) {
              res.status(401).json({ message: process.env.LOGIN_ERROR });
            } else {
              res.status(200).json({
								userId: user._id,
								token: jwt.sign({ userId: user._id }, process.env.JWT_KEY, {
									expiresIn: process.env.TOKEN_EXPIRATION_TIME,
								}),
							});
            }
          })
					.catch((error) => res.status(500).json({ error }));
      }
    })
		.catch((error) => res.status(500).json({ error }));
};