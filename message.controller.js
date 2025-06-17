const Message = require('../models/message.model');

exports.getAll = async (req, res, next) => {
  try {
    const messages = await Message.find()
      .populate('requete_id')
      .populate('expediteur_id', '-mot_de_passe_hash')
      .populate('fichiers_joints');
    res.json(messages);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate('requete_id')
      .populate('expediteur_id', '-mot_de_passe_hash')
      .populate('fichiers_joints');
    if (!message) return res.status(404).json({ message: 'Message non trouvé' });
    res.json(message);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const message = new Message({
      ...req.body,
      expediteur_id: req.user._id // Sécurise l’expéditeur
    });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!message) return res.status(404).json({ message: 'Message non trouvé' });
    res.json(message);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message non trouvé' });
    res.json({ message: 'Message supprimé' });
  } catch (err) {
    next(err);
  }
};