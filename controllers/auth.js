const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keyJWT = require("../key/index");

module.exports.login = async function (req, res) {
  const candidate = await User.findOne({ email: req.body.email });

  if (candidate) {
    const passwordVerification = bcrypt.compareSync(
      req.body.password,
      candidate.password
    );

    if (passwordVerification) {
      const token = jwt.sign(
        {
          email: candidate.email,
          userID: candidate._id,
        },
        keyJWT.jwt,
        { expiresIn: 60 * 60 }
      );
      res.status(200).json({
        token: `Bearer ${token}`,
      });
    } else {
      res.status(401).res.json({
        message: "Пароли не совпали",
      });
    }
  } else {
    res.status(401).res.json({
      message: "Пользователь с таким email не найден",
    });
  }
};

module.exports.register = async function (req, res) {
  const candidate = await User.findOne({ email: req.body.email });
  if (candidate) {
    res.status(409).json({
      message: "Такой email уже существует",
    });
  } else {
    const salt = bcrypt.genSaltSync(10);
    const password = req.body.password;
    const user = new User({
      email: req.body.email,
      password: bcrypt.hashSync(password, salt),
    });

    try {
      await user.save();
      res.status(201).json(user);
    } catch (e) {
      console.log(e);
    }
  }
};
