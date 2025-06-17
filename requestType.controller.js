const RequestType = require('../models/requestType.model');

exports.getAll = async (req, res, next) => {
  try {
    const types = await RequestType.find();
    res.json(types);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const type = await RequestType.findById(req.params.id);
    if (!type) return res.status(404).json({ message: 'Type non trouvé' });
    res.json(type);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const type = new RequestType(req.body);
    await type.save();
    res.status(201).json(type);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const type = await RequestType.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!type) return res.status(404).json({ message: 'Type non trouvé' });
    res.json(type);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const type = await RequestType.findByIdAndDelete(req.params.id);
    if (!type) return res.status(404).json({ message: 'Type non trouvé' });
    res.json({ message: 'Type supprimé' });
  } catch (err) {
    next(err);
  }
};