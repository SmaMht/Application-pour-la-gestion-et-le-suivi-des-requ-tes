import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Upload, X, FileText, AlertCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { useRequests } from '../../context/RequestsContext';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

// Types de requêtes selon le cahier des charges
const requestTypes = [
  {
    id: 1,
    nom: "Demandes de documentation (attestations, relevés, diplômes)",
    description: "Demande d'attestation, relevé de notes, diplôme ou tout autre document officiel.",
    delai: 5
  },
  {
    id: 2,
    nom: "Demandes d'assistance financière",
    description: "Demande d'aide ou de soutien financier pour vos études.",
    delai: 10
  },
  {
    id: 3,
    nom: "Demandes de changement de programme/filière",
    description: "Demande de modification de votre programme ou filière d'études.",
    delai: 7
  },
  {
    id: 4,
    nom: "Demandes de transfert",
    description: "Demande de transfert vers une autre université ou établissement.",
    delai: 10
  },
  {
    id: 5,
    nom: "Demandes de lettre de recommandation",
    description: "Demande de lettre de recommandation pour stage, bourse, etc.",
    delai: 7
  },
  {
    id: 6,
    nom: "Autres demandes",
    description: "Toute autre demande ne figurant pas dans la liste.",
    delai: 10
  }
];

const RequestForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const { createRequest, loading } = useRequests();
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      priority: 'Normale' // Valeur par défaut
    }
  });

  const watchedFields = watch();

  const steps = [
    { id: 1, title: 'Type de requête' },
    { id: 2, title: 'Informations' },
    { id: 3, title: 'Documents' },
    { id: 4, title: 'Récapitulatif' }
  ];

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.map(file => ({
        id: Date.now() + Math.random(),
        file,
        name: file.name,
        size: file.size,
        type: file.type
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
    },
    onDropRejected: (rejectedFiles) => {
      rejectedFiles.forEach(rejection => {
        toast.error(`Fichier ${rejection.file.name} rejeté: ${rejection.errors[0].message}`);
      });
    }
  });

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data) => {
    try {
      // Simulation d'une requête créée localement (mock)
      const fakeRequest = {
        etudiant_id: user._id,
        type_requete: data.type_requete,
        numero_reference: `REQ-${Date.now()}`,
        titre: data.titre,
        description: data.description,
        priorite: data.priority,
        date_creation: new Date().toISOString(),
        status: "submitted"
      };

      console.log('Requête simulée (pas envoyée au backend) :', fakeRequest);

      toast.success('Requête simulée créée avec succès !');
      reset();
      setSelectedType(null);
      setUploadedFiles([]);
      navigate('/dashboard/student/requests');
    } catch (error) {
      console.error('Erreur simulation requête:', error);
      toast.error('Erreur lors de la simulation de la requête');
    }
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return selectedType !== null;
      case 2:
        return watchedFields.titre && watchedFields.description;
      case 3:
        return true; // Documents are optional
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <nav aria-label="Progress">
          <ol className="flex items-center justify-center space-x-4">
            {steps.map((step, index) => (
              <li key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${currentStep >= step.id
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-gray-300 text-gray-500'
                  }`}>
                  {step.id}
                </div>
                <span className={`ml-2 text-sm font-medium ${currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <ChevronRight className="ml-4 h-5 w-5 text-gray-300" />
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Request Type */}
        {currentStep === 1 && (
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold">Sélectionnez le type de requête</h3>
              <p className="text-sm text-gray-600">
                Choisissez le type de demande que vous souhaitez effectuer
              </p>
            </Card.Header>
            <Card.Body>
              <div className="mb-4">
                <label htmlFor="type_requete" className="block text-sm font-medium text-gray-700">
                  Type de requête
                </label>
                <select
                  id="type_requete"
                  {...register('type_requete', { required: true })}
                  value={watch('type_requete') || ''}
                  onChange={e => {
                    setValue('type_requete', e.target.value);
                    const type = requestTypes.find(t => t._id === e.target.value);
                    setSelectedType(type);
                  }}
                >
                  <option value="">Sélectionner un type</option>
                  {requestTypes.map(type => (
                    <option key={type._id} value={type._id}>{type.nom}</option>
                  ))}
                </select>
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Step 2: Information */}
        {currentStep === 2 && (
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold">Informations de la requête</h3>
              <p className="text-sm text-gray-600">
                Fournissez les détails de votre demande
              </p>
            </Card.Header>
            <Card.Body className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre de la requête *
                </label>
                <input
                  {...register('titre', { required: 'Ce champ est requis' })}
                  type="text"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Ex: Demande d'attestation d'inscription pour visa"
                />
                {errors.titre && (
                  <p className="mt-1 text-sm text-red-600">{errors.titre.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description détaillée *
                </label>
                <textarea
                  {...register('description', { required: 'Ce champ est requis' })}
                  rows={4}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Décrivez votre demande en détail, incluez toute information pertinente..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priorité
                </label>
                <select
                  {...register('priority')}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="Normale">Normale</option>
                  <option value="Urgente">Urgente</option>
                  <option value="Faible">Faible</option>
                </select>
              </div>

              {selectedType && (
                <div className="p-4 bg-blue-50 rounded-md">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-blue-800">
                        Type sélectionné: {selectedType.nom}
                      </h4>
                      <p className="text-sm text-blue-700 mt-1">
                        {selectedType.description}
                      </p>
                      <p className="text-sm text-blue-600 mt-1">
                        Délai de traitement estimé: {selectedType.delai} jours ouvrables
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        )}

        {/* Step 3: Documents */}
        {currentStep === 3 && (
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold">Documents justificatifs</h3>
              <p className="text-sm text-gray-600">
                Ajoutez les documents nécessaires à votre demande (optionnel)
              </p>
            </Card.Header>
            <Card.Body>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${isDragActive
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
                  }`}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-sm text-gray-600">
                  {isDragActive
                    ? 'Déposez les fichiers ici...'
                    : 'Glissez-déposez vos fichiers ici, ou cliquez pour sélectionner'}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  PDF, DOC, DOCX, PNG, JPG jusqu'à 5MB chacun
                </p>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Fichiers sélectionnés ({uploadedFiles.length})
                  </h4>
                  <div className="space-y-2">
                    {uploadedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                      >
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(file.id)}
                          className="p-1 text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        )}

        {/* Step 4: Summary */}
        {currentStep === 4 && (
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold">Récapitulatif de votre demande</h3>
              <p className="text-sm text-gray-600">
                Vérifiez les informations avant de soumettre votre requête
              </p>
            </Card.Header>
            <Card.Body className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Type de requête</h4>
                  <p className="text-sm text-gray-600">{selectedType?.nom}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Priorité</h4>
                  <p className="text-sm text-gray-600">
                    {watchedFields.priority || 'Normale'}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Titre</h4>
                <p className="text-sm text-gray-600">{watchedFields.titre}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {watchedFields.description}
                </p>
              </div>

              {uploadedFiles.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Documents joints ({uploadedFiles.length})
                  </h4>
                  <div className="space-y-1">
                    {uploadedFiles.map((file) => (
                      <p key={file.id} className="text-sm text-gray-600">
                        • {file.name} ({formatFileSize(file.size)})
                      </p>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4 bg-yellow-50 rounded-md">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-yellow-800">
                      Attention
                    </h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Une fois soumise, votre requête sera traitée selon l'ordre de priorité et le délai estimé.
                      Vous recevrez des notifications à chaque étape du traitement.
                    </p>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Précédent
          </Button>

          {currentStep < steps.length ? (
            <Button
              type="button"
              onClick={nextStep}
              disabled={!canProceedToNext()}
              className="flex items-center"
            >
              Suivant
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              className="flex items-center"
            >
              Soumettre la requête
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default RequestForm;