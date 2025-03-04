import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AuthLogDto } from '../types';

export const AuthHistory: React.FC = () => {
  const [authLogs, setAuthLogs] = useState<AuthLogDto[]>([]);
  const { getAuthHistory, loading, error } = useAuth();

  useEffect(() => {
    const fetchAuthHistory = async () => {
      try {
        const history = await getAuthHistory();
        setAuthLogs(history);
      } catch (error) {
        console.error('Ошибка при получении истории аутентификации:', error);
      }
    };

    fetchAuthHistory();
  }, [getAuthHistory]);

  if (loading && authLogs.length === 0) {
    return <div>Загрузка истории аутентификации...</div>;
  }

  return (
    <div className='auth-history'>
      <h2>История аутентификации</h2>

      {error && <div className='error-message'>{error}</div>}

      {authLogs.length === 0 ? (
        <p>Нет данных об авторизациях</p>
      ) : (
        <div className='table-responsive'>
          <table className='table table-striped'>
            <thead>
              <tr>
                <th>Дата и время</th>
                <th>IP-адрес</th>
                <th>Устройство</th>
                <th>Статус</th>
                <th>Причина отказа</th>
              </tr>
            </thead>
            <tbody>
              {authLogs.map((log) => (
                <tr
                  key={log.id}
                  className={log.succeeded ? 'table-success' : 'table-danger'}
                >
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                  <td>{log.ipAddress}</td>
                  <td>{log.userAgent}</td>
                  <td>{log.succeeded ? 'Успешно' : 'Ошибка'}</td>
                  <td>{log.failureReason || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
