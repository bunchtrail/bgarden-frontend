import React from 'react';
import { Link } from 'react-router-dom';
import { ExpositionDto } from '../types';

interface ExpositionCardProps {
  exposition: ExpositionDto;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  isAdmin?: boolean;
}

export const ExpositionCard: React.FC<ExpositionCardProps> = ({
  exposition,
  onEdit,
  onDelete,
  isAdmin = false,
}) => {
  const { id, name, description, specimensCount } = exposition;

  return (
    <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md">
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{name}</h3>
        <p className="text-gray-600 mb-3">{description}</p>
        
        {specimensCount !== null && (
          <p className="text-sm text-gray-500 mb-3">
            Количество образцов: {specimensCount}
          </p>
        )}

        <div className="flex justify-between items-center mt-4">
          <Link
            to={`/expositions/${id}`}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Подробнее
          </Link>

          {isAdmin && (
            <div className="space-x-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(id)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                >
                  Изменить
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Удалить
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 