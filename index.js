// ===== Часть 1: Работа с суммой =====
// Функция для форматирования суммы с разделением по три числа

const footbarWidgetId = document.getElementById('widget-foorbar');

function formatNumberWithSpaces(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

// Функция для обновления суммы
function updateSum() {
    const element = document.getElementById('widget-footbar-sum');
    if (!element) return;

    // Извлекаем текущую сумму (только цифры)
    const text = element.innerText.trim();
    const currencySymbol = text.match(/[^\d\s]/g)?.join('') || ''; // Извлекаем валютный символ
    let currentSum = parseFloat(text.replace(/[^\d]/g, ''));

    // Увеличиваем сумму на 150
    currentSum += 150;

    // Форматируем сумму с разделением по 3 числа и добавляем валютный символ
    const formattedSum = currencySymbol + ' ' + formatNumberWithSpaces(currentSum);

    // Обновляем текст элемента
    element.innerText = formattedSum;
}

// Инициализация: форматируем сумму сразу при загрузке
document.addEventListener('DOMContentLoaded', () => {
    const element = document.getElementById('widget-footbar-sum');
    if (element) {
        const text = element.innerText.trim();
        const currencySymbol = text.match(/[^\d\s]/g)?.join('') || '';
        const currentSum = parseFloat(text.replace(/[^\d]/g, ''));

        // Форматируем сумму сразу
        element.innerText = currencySymbol + ' ' + formatNumberWithSpaces(currentSum);
    }
});

// Запускаем обновление суммы каждую 0.1 секунды
setInterval(updateSum, 100);


// ===== Часть 2: Анимация появления/закрытия блока footbar =====
window.addEventListener("load", () => {
    const footbar = document.querySelector('.widget-footbar');
    const closeButton = document.querySelector('.widget-footbar-close');

    if (footbar) {
        // Сбрасываем все потенциальные кешированные стили
        footbar.removeAttribute('style');

        // Принудительная синхронизация перед измерениями
        requestAnimationFrame(() => {
            // Фиксируем начальную высоту контента
            footbar.style.display = 'block'; // Гарантируем видимость
            footbar.style.transition = 'none';
            footbar.style.height = 'auto';
            const initialContentHeight = footbar.offsetHeight;
            footbar.style.height = '0';
            footbar.style.overflow = 'hidden';
            footbar.style.transition = 'height 1s ease-in-out';

            // Анимация появления
            setTimeout(() => {
                footbar.style.height = initialContentHeight + 'px';

                footbar.addEventListener(
                    'transitionend',
                    () => {
                        footbar.style.height = 'auto';
                        footbar.style.overflow = 'visible';
                    },
                    { once: true }
                );
            }, 100);

            // Анимация закрытия
            if (closeButton) {
                closeButton.addEventListener('click', () => {
                    // Обновляем высоту перед анимацией закрытия
                    requestAnimationFrame(() => {
                        const currentHeight = footbar.offsetHeight;
                        footbar.style.height = currentHeight + 'px';
                        footbar.style.overflow = 'hidden';

                        setTimeout(() => {
                            footbar.style.height = '0';

                            footbar.addEventListener(
                                'transitionend',
                                (e) => {
                                    if (e.propertyName === 'height') {
                                        footbar.remove();
                                    }
                                },
                                { once: true }
                            );
                        }, 50);
                    });
                });
            }
        });
    }
});


// ===== Часть 3: Локализация/переводы =====
document.addEventListener("DOMContentLoaded", () => {
    const currentLang = document.documentElement.getAttribute("lang") || "en";
    const translationsPath = "./FootbarW/translate.json"; // Путь к файлу с переводами

    // Загрузка переводов из JSON
    fetch(translationsPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка загрузки переводов: ${response.status}`);
            }
            return response.json();
        })
        .then(translations => {
            const translationsForLang = translations[currentLang];
            if (!translationsForLang) {
                console.warn(`Переводы для языка "${currentLang}" не найдены.`);
                return;
            }

            // Замена текста в элементах с data-i18n
            footbarWidgetId.querySelectorAll("[data-i18n]").forEach(el => {
                const key = el.getAttribute("data-i18n");
                if (translationsForLang[key]) {
                    el.textContent = translationsForLang[key];
                } else {
                    console.warn(`Ключ "${key}" не найден в переводах для языка "${currentLang}".`);
                }
            });

            // Замена placeholder в элементах с data-i18n-placeholder
            footbarWidgetId.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
                const key = el.getAttribute("data-i18n-placeholder");
                if (translationsForLang[key]) {
                    el.placeholder = translationsForLang[key];
                } else {
                    console.warn(`Ключ "${key}" не найден в переводах для языка "${currentLang}".`);
                }
            });

            // Замена value в элементах с data-i18n-value
            footbarWidgetId.querySelectorAll("[data-i18n-value]").forEach(el => {
                const key = el.getAttribute("data-i18n-value");
                if (translationsForLang[key]) {
                    el.value = translationsForLang[key];
                } else {
                    console.warn(`Ключ "${key}" не найден в переводах для языка "${currentLang}".`);
                }
            });
        })
        .catch(error => {
            console.error("Ошибка при загрузке или обработке переводов:", error);
        });
});

