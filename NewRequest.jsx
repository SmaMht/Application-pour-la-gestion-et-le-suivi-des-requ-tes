import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import RequestForm from '../../components/forms/RequestForm';

const NewRequest = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          to="/dashboard/student/requests"
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Retour aux requêtes
        </Link>
      </div>
      
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Nouvelle Requête</h1>
        <p className="text-gray-600 mt-1">
          Suivez les étapes pour soumettre votre demande administrative
        </p>
      </div>

      {/* Request Form */}
      <RequestForm />
    </div>
  );
};

export default NewRequest;