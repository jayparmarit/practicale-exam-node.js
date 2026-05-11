import HttpError from "../middlewares/HttpError.js";
import User from "../model/User.js";

const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(new HttpError("User already exist", 400));
    }

    const newUser = new User({
      name,
      email,
      password,
      phone,
      role,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      newUser,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByCredentials(email, password);

    if (!user) {
      return next(new HttpError("Invalid email or password", 400));
    }

    const token = await user.generateAuthToken();

    res
      .status(200)
      .json({ success: true, message: "Login Successfully", user, token });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const authLogin = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return next(new HttpError("Unable to login"));
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(new HttpError(error.message, 404));
  }
};

const logout = async (req, res, next) => {
  try {
    const token = req.token;

    req.user.tokens = req.user.tokens.filter((t) => {
      return t.token !== token;
    });

    await req.user.save();

    res
      .status(200)
      .json({ success: true, message: "User logout successfully" });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const logoutAll = async (req, res, next) => {
  try {
    req.user.tokens = [];

    await req.user.save();

    res
      .status(200)
      .json({ success: true, message: "User Logout from all device" });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const update = async (req, res, next) => {
  try {
    const targetUser = req.params.id || req.user._id;

    const user = await User.findById(targetUser);

    if (!user) {
      return next(new HttpError("User not found", 404));
    }

    const update = Object.keys(req.body);

    let allowedFields = ["name", "password", "phone"];

    const isValid = update.every((fields) => allowedFields.includes(fields));

    if (
      !req.user.role == "admin" &&
      !req.user._id.toString() !== user._id.toString()
    ) {
      return next(new HttpError("Unauthorized access", 401));
    }

    update.forEach((update) => (user[update] = req.body[update]));

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "User update successfully", user });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const targetUser = req.params.id || req.user._id;

    const user = await User.findById(targetUser);

    if (!user) {
      return next(new HttpError("User not found", 404));
    }

    if (
      !req.user.role === "admin" &&
      !req.user._id.toString() !== user._id.toString()
    ) {
      return next(new HttpError("Unauthorized access", 401));
    }

    await User.deleteOne(user);

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

export default {
  register,
  login,
  authLogin,
  logout,
  logoutAll,
  update,
  deleteUser,
};
