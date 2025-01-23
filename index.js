// ===== Часть 1: Работа с суммой =====
function formatNumberWithSpaces(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function updateSum() {
    const element = document.getElementById('widget-footbar-sum');
    if (!element) return;

    // Получаем текущие данные
    const text = element.innerText.trim();
    const currencySymbol = text.match(/[^\d\s]/g)?.join('') || '';
    const currentSum = parseFloat(localStorage.getItem('footbarSum') || text.replace(/[^\d]/g, ''));

    // Обновляем и сохраняем
    const newSum = currentSum + 75133;
    localStorage.setItem('footbarSum', newSum.toString());

    // Форматируем и отображаем
    element.innerText = `${currencySymbol} ${formatNumberWithSpaces(newSum)}`;
}

// ===== Часть 2: Анимация =====
function initAnimation() {
    const footbar = document.querySelector('.widget-footbar');
    const closeButton = document.querySelector('.widget-footbar-close');

    if (footbar) {
        footbar.removeAttribute('style');
        requestAnimationFrame(() => {
            footbar.style.display = 'block';
            footbar.style.transition = 'none';
            footbar.style.height = 'auto';
            const initialContentHeight = footbar.offsetHeight;
            footbar.style.height = '0';
            footbar.style.overflow = 'hidden';
            footbar.style.transition = 'height 1s ease-in-out';

            setTimeout(() => {
                footbar.style.height = initialContentHeight + 'px';
                footbar.addEventListener('transitionend', () => {
                    footbar.style.height = 'auto';
                    footbar.style.overflow = 'visible';
                }, { once: true });
            }, 100);

            if (closeButton) {
                closeButton.addEventListener('click', () => {
                    requestAnimationFrame(() => {
                        const currentHeight = footbar.offsetHeight;
                        footbar.style.height = currentHeight + 'px';
                        footbar.style.overflow = 'hidden';

                        setTimeout(() => {
                            footbar.style.height = '0';
                            footbar.addEventListener('transitionend', (e) => {
                                if (e.propertyName === 'height') footbar.remove();
                            }, { once: true });
                        }, 50);
                    });
                });
            }
        });
    }
}

// ===== Часть 3: Локализация =====
function initTranslations() {
    return new Promise((resolve, reject) => {
        const currentLang = document.documentElement.getAttribute("lang") || "en";
        const footbarWidget = document.getElementById('widget-footbar');

        fetch("./FootbarW/translate.json")
            .then(response => response.json())
            .then(translations => {
                const translationsForLang = translations[currentLang] || {};

                // Применяем переводы
                footbarWidget.querySelectorAll("[data-i18n]").forEach(el => {
                    const key = el.getAttribute("data-i18n");
                    if (translationsForLang[key]) el.textContent = translationsForLang[key];
                });

                footbarWidget.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
                    const key = el.getAttribute("data-i18n-placeholder");
                    if (translationsForLang[key]) el.placeholder = translationsForLang[key];
                });

                footbarWidget.querySelectorAll("[data-i18n-value]").forEach(el => {
                    const key = el.getAttribute("data-i18n-value");
                    if (translationsForLang[key]) el.value = translationsForLang[key];
                });

                resolve();
            })
            .catch(error => reject(error));
    });
}

// ===== Инициализация всего =====
document.addEventListener("DOMContentLoaded", async () => {
    try {
        // 1. Сначала загружаем переводы
        await initTranslations();

        // 2. Инициализируем начальную сумму из переведенного значения
        const element = document.getElementById('widget-footbar-sum');
        if (element && !localStorage.getItem('footbarSum')) {
            const initialValue = parseFloat(element.innerText.replace(/[^\d]/g, ''));
            localStorage.setItem('footbarSum', initialValue.toString());
        }

        // 3. Запускаем анимацию
        initAnimation();

        // 4. Запускаем обновление суммы
        setInterval(updateSum, 100);

    } catch (error) {
        console.error("Initialization error:", error);
    }
});