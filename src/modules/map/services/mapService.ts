// Сервис взаимодействия с API карты 
// Форма добавления растения 

export { };

export interface MapData {
  id: number;
  name: string;
  description: string;
  filePath: string;
  contentType: string;
  fileSize: number;
  uploadDate: string;
  lastUpdated: string;
  isActive: boolean;
  specimensCount: number;
}

// Функция для получения активной карты
export const getActiveMap = async (): Promise<MapData[]> => {
  try {
    const response = await fetch('http://localhost:7254/api/Map/active');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Ошибка при получении активной карты:', error);
    throw error;
  }
};
