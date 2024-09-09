const staticCacheName = 'fuel-app-cache-v1.3';

const assetUrls = [
    '/',                    // Корневой путь для index.html
    '/index.html',
    '/css/style.css',
    '/js/script.js',
    '/manifest.json',
    '/android/icon-192x192.png',  // Убедитесь, что иконки указаны правильно
    '/android/icon-512x512.png',
    '/img/photo_2024-08-11_03-36-19-_2_.webp',
    '/img/photo_2024-08-11_03-36-19.webp',
];

// Установка Service Worker и кэширование ресурсов
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(staticCacheName)
            .then(cache => cache.addAll(assetUrls))
            .catch(error => console.error('Failed to cache assets:', error))
    );
});

// Активация Service Worker и удаление старых кэшей
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(name => name !== staticCacheName)
                    .map(name => caches.delete(name))
            );
        })
    );
});

// Обработка запросов
self.addEventListener('fetch', event => {
    event.respondWith(
        (async () => {
            const { request } = event;

            // Если метод запроса не GET, возвращаем стандартный ответ
            if (request.method !== 'GET') {
                return fetch(request);
            }

            // Проверка кэша
            const cachedResponse = await caches.match(request);
            if (cachedResponse) {
                return cachedResponse;
            }

            // Запрос к сети
            try {
                const networkResponse = await fetch(request);
                const cache = await caches.open(staticCacheName);

                // Сохраняем только успешные ответы в кэш
                if (networkResponse && networkResponse.ok) {
                    cache.put(request, networkResponse.clone());
                }

                return networkResponse;
            } catch (error) {
                // Если запрос не удался, возвращаем оффлайн-страницу
                return caches.match('/index.html');
            }
        })()
    );
});
