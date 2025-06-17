const Request = require('../models/request.model');
const User = require('../models/user.model');
const RequestType = require('../models/requestType.model');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

// Rapport Excel : Statistiques des requêtes
exports.exportExcel = async (req, res, next) => {
  try {
    const requests = await Request.find()
      .populate('type_requete')
      .populate('etudiant_id', 'nom prenom matricule')
      .populate('agent_assigne_id', 'nom prenom');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Requêtes');

    worksheet.columns = [
      { header: 'Référence', key: 'numero_reference', width: 20 },
      { header: 'Type', key: 'type', width: 40 },
      { header: 'Titre', key: 'titre', width: 30 },
      { header: 'Statut', key: 'statut', width: 20 },
      { header: 'Priorité', key: 'priorite', width: 15 },
      { header: 'Étudiant', key: 'etudiant', width: 25 },
      { header: 'Agent assigné', key: 'agent', width: 25 },
      { header: 'Date création', key: 'date_creation', width: 20 }
    ];

    requests.forEach(req => {
      worksheet.addRow({
        numero_reference: req.numero_reference,
        type: req.type_requete?.nom,
        titre: req.titre,
        statut: req.statut,
        priorite: req.priorite,
        etudiant: req.etudiant_id ? `${req.etudiant_id.prenom} ${req.etudiant_id.nom} (${req.etudiant_id.matricule})` : '',
        agent: req.agent_assigne_id ? `${req.agent_assigne_id.prenom} ${req.agent_assigne_id.nom}` : '',
        date_creation: req.date_creation ? req.date_creation.toISOString().split('T')[0] : ''
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=rapport_requetes.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    next(err);
  }
};

// Rapport PDF : Liste des requêtes
exports.exportPDF = async (req, res, next) => {
  try {
    const requests = await Request.find()
      .populate('type_requete')
      .populate('etudiant_id', 'nom prenom matricule')
      .populate('agent_assigne_id', 'nom prenom');

    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    const filename = 'rapport_requetes.pdf';

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    doc.fontSize(18).text('Rapport des Requêtes Étudiantes', { align: 'center' });
    doc.moveDown();

    requests.forEach((req, idx) => {
      doc.fontSize(12).text(
        `${idx + 1}. [${req.numero_reference}] ${req.titre}
Type: ${req.type_requete?.nom}
Statut: ${req.statut} | Priorité: ${req.priorite}
Étudiant: ${req.etudiant_id ? req.etudiant_id.prenom + ' ' + req.etudiant_id.nom : ''}
Agent assigné: ${req.agent_assigne_id ? req.agent_assigne_id.prenom + ' ' + req.agent_assigne_id.nom : ''}
Date création: ${req.date_creation ? req.date_creation.toISOString().split('T')[0] : ''}
`, { underline: false });
      doc.moveDown(0.5);
    });

    doc.end();
    doc.pipe(res);
  } catch (err) {
    next(err);
  }
};