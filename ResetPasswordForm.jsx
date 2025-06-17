import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

const ResetPasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { resetPassword, loading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const password = watch('password');

  const passwordCriteria = [
    { label: 'Au moins 8 caractères', test: (pwd) => pwd && pwd.length >= 8 },
    { label: 'Une lettre majuscule', test: (pwd) => pwd && /[A-Z]/.test(pwd) },
    { label: 'Une lettre minuscule', test: (pwd) => pwd && /[a-z]/.test(pwd) },
    { label: 'Un chiffre', test: (pwd) => pwd && /\d/.test(pwd) }
  ];

  const onSubmit = async (data) => {
    try {
      await resetPassword('fake-token', data.password);
      navigate('/login', { 
        state: { message: 'Mot de passe mis à jour avec succès. Vous pouvez maintenant vous connecter.' }
      });
    } catch (error) {
      // Error is handled in context
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Nouveau mot de passe</h2>
        <p className="mt-2 text-sm text-gray-600">
          Créez un nouveau mot de passe sécurisé pour votre compte.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Nouveau mot de passe
          </label>
          <div className="mt-1 relative">
            <input
              {...register('password', {
                required: 'Ce champ est requis',
                minLength: {
                  value: 8,
                  message: 'Le mot de passe doit contenir au moins 8 caractères'
                }
              })}
              type={showPassword ? 'text' : 'password'}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pr-10"
              placeholder="Nouveau mot de passe"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* Password Strength Indicator */}
        {password && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Critères du mot de passe:</p>
            <div className="space-y-1">
              {passwordCriteria.map((criterion, index) => (
                <div key={index} className="flex items-center text-sm">
                  {criterion.test(password) ? (
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                  ) : (
                    <X className="h-4 w-4 text-red-500 mr-2" />
                  )}
                  <span className={criterion.test(password) ? 'text-green-700' : 'text-red-700'}>
                    {criterion.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirmer le mot de passe
          </label>
          <div className="mt-1 relative">
            <input
              {...register('confirmPassword', {
                required: 'Ce champ est requis',
                validate: (value) => value === password || 'Les mots de passe ne correspondent pas'
              })}
              type={showConfirmPassword ? 'text' : 'password'}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pr-10"
              placeholder="Confirmer le mot de passe"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div>
          <Button
            type="submit"
            className="w-full"
            loading={loading}
            disabled={loading}
          >
            Mettre à jour le mot de passe
          </Button>
        </div>

        <div className="text-center">
          <Link
            to="/login"
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            Retour à la connexion
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordForm;