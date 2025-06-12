/**
 * Скрипт для очистки неправильных настроек карты из localStorage
 * Запустите этот код в консоли браузера после обновления кода
 */

// Очистка настроек MapConfig
const clearMapConfig = () => {
  const keysToRemove = [
    'mapConfig',
    'mapConfigSchematic',
    'mapConfigGeo',
    'mapSettings',
    'mapState',
  ];

  keysToRemove.forEach((key) => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      console.log(`Удален ключ localStorage: ${key}`);
    }
  });

  console.log('Очистка localStorage завершена. Перезагрузите страницу.');
};

// Запуск очистки
clearMapConfig();
