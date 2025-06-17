const Request = require('../models/request.model');

exports.getAll = async (req, res, next) => {
  try {
    const requests = await Request.find()
      .populate('type_requete')
      .populate('etudiant_id', '-mot_de_passe_hash')
      .populate('agent_assigne_id', '-mot_de_passe_hash')
      .populate('documents_joints');
    res.json(requests);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('type_requete')
      .populate('etudiant_id', '-mot_de_passe_hash')
      .populate('agent_assigne_id', '-mot_de_passe_hash')
      .populate('documents_joints');
    if (!request) return res.status(404).json({ message: 'Requête non trouvée' });
    res.json(request);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    console.log('Données reçues pour création:', req.body); // Pour debugging
    
    // Générer numéro de référence si absent
    if (!req.body.numero_reference) {
      req.body.numero_reference = `REQ-${Date.now()}`;
    }
    
    // Validation des champs requis
    const requiredFields = ['type_requete', 'titre', 'description', 'etudiant_id'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ 
          message: `Le champ ${field} est requis`,
          field: field 
        });
      }
    }
    
    // Créer la requête
    const request = new Request({
      ...req.body,
      date_derniere_maj: new Date()
    });
    
    await request.save();
    
    // Populer les champs référencés avant de renvoyer
    const populatedRequest = await Request.findById(request._id)
      .populate('type_requete')
      .populate('etudiant_id', '-mot_de_passe_hash')
      .populate('agent_assigne_id', '-mot_de_passe_hash')
      .populate('documents_joints');
    
    res.status(201).json(populatedRequest);
  } catch (err) {
    console.error('Erreur création requête:', err); // Pour debugging
    
    // Gestion des erreurs de validation Mongoose
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ 
        message: 'Erreur de validation', 
        errors: errors 
      });
    }
    
    // Erreur de duplication (numéro de référence)
    if (err.code === 11000) {
      return res.status(400).json({ 
        message: 'Ce numéro de référence existe déjà' 
      });
    }
    
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { ...req.body, date_derniere_maj: new Date() },
      { new: true, runValidators: true }
    )
    .populate('type_requete')
    .populate('etudiant_id', '-mot_de_passe_hash')
    .populate('agent_assigne_id', '-mot_de_passe_hash')
    .populate('documents_joints');
    
    if (!request) return res.status(404).json({ message: 'Requête non trouvée' });
    res.json(request);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const request = await Request.findByIdAndDelete(req.params.id);
    if (!request) return res.status(404).json({ message: 'Requête non trouvée' });
    res.json({ message: 'Requête supprimée' });
  } catch (err) {
    next(err);
  }
};