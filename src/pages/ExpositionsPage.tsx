import React, { useState } from 'react';
import { useAuth } from '../modules/auth';
import {
  ExpositionDto,
  ExpositionForm,
  ExpositionsList,
} from '../modules/expositions';
import { UserRole } from '../modules/specimens/types';

const ExpositionsPage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user && user.role === UserRole.Administrator ? true : false;

  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [editExpositionId, setEditExpositionId] = useState<number | undefined>(
    undefined
  );

  const handleAddExposition = () => {
    setEditExpositionId(undefined);
    setIsFormVisible(true);
  };

  const handleEditExposition = (id: number) => {
    setEditExpositionId(id);
    setIsFormVisible(true);
  };

  const handleFormSuccess = (exposition: ExpositionDto) => {
    setIsFormVisible(false);
    // В реальном приложении здесь можно было бы обновить список экспозиций
    window.location.reload();
  };

  const handleFormCancel = () => {
    setIsFormVisible(false);
    setEditExpositionId(undefined);
  };

  return (
    <div className='container mx-auto p-6'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold text-gray-800'>
          Экспозиции Ботанического сада
        </h1>

        {isAdmin && !isFormVisible && (
          <button
            onClick={handleAddExposition}
            className='px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors'
          >
            Добавить экспозицию
          </button>
        )}
      </div>

      {isFormVisible ? (
        <div className='bg-white p-6 rounded-lg shadow mb-8'>
          <ExpositionForm
            expositionId={editExpositionId}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </div>
      ) : (
        <ExpositionsList isAdmin={isAdmin} onEdit={handleEditExposition} />
      )}
    </div>
  );
};

export default ExpositionsPage;
