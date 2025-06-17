const User = require('../models/user.model');
const bcrypt = require('bcrypt');

// GET all users (admin/chef de département)
exports.getAll = async (req, res, next) => {
  try {
    const users = await User.find().select('-mot_de_passe_hash');
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// GET one user
exports.getOne = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-mot_de_passe_hash');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// CREATE user (admin only)
exports.create = async (req, res, next) => {
  try {
    const { mot_de_passe, ...userData } = req.body;
    if (!mot_de_passe) {
      return res.status(400).json({ message: 'Le mot de passe est requis' });
    }
    const hash = await bcrypt.hash(mot_de_passe, 10);
    const user = new User({ ...userData, mot_de_passe_hash: hash });
    await user.save();
    // Ne jamais renvoyer le hash
    const userObj = user.toObject();
    delete userObj.mot_de_passe_hash;
    res.status(201).json(userObj);
  } catch (err) {
    next(err);
  }
};

// UPDATE user
exports.update = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-mot_de_passe_hash');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// DELETE user (admin only)
exports.remove = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    next(err);
  }
};