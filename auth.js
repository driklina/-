function initUser(email) {
  return {
    email: email,
    name: 'Имя',
    pass: '',
    points: 0,
    totalHours: 0,
    bookingsCount: 0,
    lastOrder: null,
    registeredTournaments: [],
    activityLog: [] // для графика активности
  };
}

function saveUser(user) {
  const users = JSON.parse(localStorage.getItem('cyberxUsers') || '[]');
  const index = users.findIndex(u => u.email === user.email);
  if (index !== -1) {
    users[index] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem('cyberxUsers', JSON.stringify(users));
}

// Добавление записи об активности (бронь, заказ и т.д.)
function logActivity(email) {
  const users = JSON.parse(localStorage.getItem('cyberxUsers') || '[]');
  const user = users.find(u => u.email === email);
  if (!user) return;

  const today = new Date().toISOString().split('T')[0]; // "2025-12-25"
  if (!user.activityLog.includes(today)) {
    user.activityLog.push(today);
    // Ограничиваем историю 30 днями
    if (user.activityLog.length > 30) {
      user.activityLog = user.activityLog.slice(-30);
    }
    localStorage.setItem('cyberxUsers', JSON.stringify(users));
  }
}

function initAuth() {
  // Регистрация
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('regName')?.value;
      const email = document.getElementById('regEmail')?.value;
      const pass = document.getElementById('regPass')?.value;
      if (!name || !email || !pass) return;

      const users = JSON.parse(localStorage.getItem('cyberxUsers') || '[]');
      if (users.some(u => u.email === email)) {
        alert('Пользователь с таким email уже существует!');
        return;
      }

      const newUser = initUser(email);
      newUser.name = name;
      newUser.pass = pass;
      saveUser(newUser);

      localStorage.setItem('cyberxCurrent', email);
      alert('Регистрация успешна!');
      window.location.href = 'dashboard.html';
    });
  }

  // Вход
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail')?.value;
      const pass = document.getElementById('loginPass')?.value;
      const users = JSON.parse(localStorage.getItem('cyberxUsers') || '[]');
      const user = users.find(u => u.email === email && u.pass === pass);
      if (user) {
        localStorage.setItem('cyberxCurrent', email);
        window.location.href = 'dashboard.html';
      } else {
        alert('Неверный email или пароль');
      }
    });
  }

  // Загрузка профиля (только на dashboard.html)
  if (document.getElementById('userName')) {
    const email = localStorage.getItem('cyberxCurrent');
    if (!email) return window.location.href = 'login.html';
    const users = JSON.parse(localStorage.getItem('cyberxUsers') || '[]');
    const user = users.find(u => u.email === email);
    if (!user) {
      localStorage.removeItem('cyberxCurrent');
      return window.location.href = 'login.html';
    }

    document.getElementById('userName').textContent = user.name;
    document.getElementById('points').textContent = user.points || 0;
    document.getElementById('total-hours').textContent = user.totalHours || 0;
    document.getElementById('bookings-count').textContent = user.bookingsCount || 0;
    document.getElementById('last-order').textContent = user.lastOrder
      ? `${user.lastOrder.items.length} поз., ${user.lastOrder.total} ₽`
      : '—';
    document.getElementById('next-tournament').textContent =
      user.registeredTournaments.length > 0
        ? user.registeredTournaments[user.registeredTournaments.length - 1]
        : '—';
  }
}

// === Функции для динамической навигации ===

// Обновление кнопок авторизации в шапке
function updateAuthButtons() {
  const authContainer = document.getElementById('auth-buttons');
  if (!authContainer) return;

  const currentEmail = localStorage.getItem('cyberxCurrent');
  if (currentEmail) {
    authContainer.innerHTML = `
      <a href="dashboard.html" class="btn-auth">Личный кабинет</a>
      <a href="#" class="btn-auth" onclick="logoutFromHeader(); return false;">Выйти</a>
    `;
  } else {
    authContainer.innerHTML = `<a href="login.html" class="btn-auth">Вход</a>`;
  }
}

// Выход из аккаунта (из шапки)
function logoutFromHeader() {
  localStorage.removeItem('cyberxCurrent');
  updateAuthButtons();
  // Перенаправление на главную, если не на ней
  if (!window.location.pathname.endsWith('index.html')) {
    window.location.href = 'index.html';
  }
}

// Глобальный экспорт функций
window.logActivity = logActivity;
window.updateAuthButtons = updateAuthButtons;
window.logoutFromHeader = logoutFromHeader;

// Запуск при загрузке
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAuth);
} else {
  initAuth();
}
