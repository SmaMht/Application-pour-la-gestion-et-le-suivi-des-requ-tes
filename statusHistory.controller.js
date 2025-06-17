const StatusHistory = require('../models/statusHistory.model');

exports.getAll = async (req, res, next) => {
  try {
    const history = await StatusHistory.find().populate('requete_id').populate('agent_id', '-mot_de_passe_hash');
    res.json(history);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const history = await StatusHistory.findById(req.params.id).populate('requete_id').populate('agent_id', '-mot_de_passe_hash');
    if (!history) return res.status(404).json({ message: 'Historique non trouvé' });
    res.json(history);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const history = new StatusHistory(req.body);
    await history.save();
    res.status(201).json(history);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const history = await StatusHistory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!history) return res.status(404).json({ message: 'Historique non trouvé' });
    res.json(history);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const history = await StatusHistory.findByIdAndDelete(req.params.id);
    if (!history) return res.status(404).json({ message: 'Historique non trouvé' });
    res.json({ message: 'Historique supprimé' });
  } catch (err) {
    next(err);
  }
};