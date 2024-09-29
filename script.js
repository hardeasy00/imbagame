let hero = {
    name: '',
    class: '',
    level: 1,
    experience: 0,
    nextLevelExp: 100, // Опыт, необходимый для следующего уровня
    strength: 10,
    agility: 10,
    intelligence: 10
};

let resources = {
    wood: 0,
    stone: 0,
    gold: 0
};

let buildings = {
    farm: {
        level: 1,
        productionRate: 10, // Начальное производство дерева
        upgradeCost: 100 // Стоимость улучшения на 1 уровне
    }
};

// Функция повышения уровня героя
function checkLevelUp() {
    if (hero.experience >= hero.nextLevelExp) {
        hero.level++;
        hero.experience = 0;
        hero.nextLevelExp = hero.level * 100; // Увеличиваем требуемый опыт
        document.getElementById('level').innerText = hero.level;
        document.getElementById('experience').innerText = hero.experience;
        logAction(`Персонаж повысил уровень до ${hero.level}. Требуется ${hero.nextLevelExp} опыта для следующего уровня.`);
    }
}

// Выбор класса персонажа
document.querySelectorAll('.character-class').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.character-class').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    });
});

// Создание героя
document.getElementById('create-hero').onclick = function() {
    const nameInput = document.getElementById('hero-name-input').value;
    const selectedClassButton = document.querySelector('.character-class.active');

    if (nameInput && selectedClassButton) {
        hero.name = nameInput;
        hero.class = selectedClassButton.getAttribute('data-class');

        document.getElementById('hero-name').innerText = hero.name;
        document.getElementById('hero-class').innerText = hero.class;

        document.getElementById('character-creation').style.display = 'none';
        document.getElementById('game-area').style.display = 'block';

        startResourceProduction(); // Начать производство ресурсов
    } else {
        alert('Введите имя и выберите класс персонажа!');
    }
};

// Производство ресурсов (ферма)
function startResourceProduction() {
    setInterval(() => {
        resources.wood += buildings.farm.productionRate;
        document.getElementById('wood').innerText = resources.wood;
        logAction(`Получено ${buildings.farm.productionRate} дерева.`);
    }, 15000); // Каждые 15 секунд
}

// Улучшение фермы
document.getElementById('upgrade-farm').onclick = function() {
    if (resources.wood >= buildings.farm.upgradeCost && buildings.farm.level < 10) {
        resources.wood -= buildings.farm.upgradeCost;
        buildings.farm.level++;
        buildings.farm.productionRate += 10; // Увеличение производства
        buildings.farm.upgradeCost += 100; // Увеличение стоимости улучшения
        document.getElementById('farm-level').innerText = buildings.farm.level;
        logAction(`Ферма улучшена до уровня ${buildings.farm.level}. Производство дерева: +${buildings.farm.productionRate}. Стоимость следующего улучшения: ${buildings.farm.upgradeCost} дерева.`);
    } else if (buildings.farm.level >= 10) {
        logAction('Ферма достигла максимального уровня.');
    } else {
        logAction('Недостаточно дерева для улучшения фермы.');
    }
    document.getElementById('wood').innerText = resources.wood;
};

// Лог действий
function logAction(action) {
    const logContent = document.getElementById('log-content');
    logContent.innerHTML += `<div>${action}</div>`;
    logContent.scrollTop = logContent.scrollHeight; // Прокрутка вниз
}

// Навигация
document.getElementById('village-button').onclick = () => showWindow('village');
document.getElementById('hunting-button').onclick = () => showWindow('hunting');
document.getElementById('character-button').onclick = () => showWindow('character-info');

function showWindow(windowId) {
    document.querySelectorAll('.game-window').forEach(win => win.style.display = 'none');
    document.getElementById(windowId).style.display = 'block';
}

// Система охоты
document.getElementById('start-easy-hunting').onclick = function() {
    let xp = 10;
    let wood = 5;
    let stone = 2;
    let gold = 1;

    gainHuntingRewards(xp, wood, stone, gold, 'лёгкой зоне');
};

document.getElementById('start-medium-hunting').onclick = function() {
    if (hero.level >= 5) {
        let xp = 20;
        let wood = 10;
        let stone = 5;
        let gold = 3;

        gainHuntingRewards(xp, wood, stone, gold, 'средней зоне');
    } else {
        logAction('Нужен 5 уровень для входа в среднюю зону.');
    }
};

document.getElementById('start-hard-hunting').onclick = function() {
    if (hero.level >= 10) {
        let xp = 40;
        let wood = 20;
        let stone = 10;
        let gold = 5;

        gainHuntingRewards(xp, wood, stone, gold, 'сложной зоне');
    } else {
        logAction('Нужен 10 уровень для входа в сложную зону.');
    }
};

function gainHuntingRewards(xp, wood, stone, gold, zoneName) {
    hero.experience += xp;
    resources.wood += wood;
    resources.stone += stone;
    resources.gold += gold;

    document.getElementById('experience').innerText = hero.experience;
    document.getElementById('wood').innerText = resources.wood;
    document.getElementById('stone').innerText = resources.stone;
    document.getElementById('gold').innerText = resources.gold;

    logAction(`Охота в ${zoneName}: получено ${xp} опыта, ${wood} дерева, ${stone} камня, ${gold} золота.`);

    checkLevelUp(); // Проверяем, достиг ли герой нового уровня
}
