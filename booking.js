let currentHall = 'standard';

function loadPCs(hall) {
  const pcList = document.getElementById('pc-list');
  if (!pcList) return;
  pcList.innerHTML = '';
  const count = { standard: 12, vip: 6, tv: 4 }[hall] || 12;
  for (let i = 1; i <= count; i++) {
    const pc = document.createElement('div');
    pc.className = 'pc-item tilt-card';
    pc.textContent = `ПК-${i}`;
    pc.onclick = () => bookPC(hall, `ПК-${i}`);
    pcList.appendChild(pc);
  }
  if (typeof initTilt === 'function') initTilt();
}

function bookPC(hall, pc) {
  const email = localStorage.getItem('cyberxCurrent');
  if (!email) return alert('Войдите в аккаунт!');

  const users = JSON.parse(localStorage.getItem('cyberxUsers') || '[]');
  const user = users.find(u => u.email === email);
  if (!user) return;

  // Обновляем статистику
  user.totalHours += 1;
  user.bookingsCount += 1;

  const pointsMap = { standard: 10, vip: 20, tv: 30 };
  user.points += pointsMap[hall] || 10;

  // Сохраняем
  localStorage.setItem('cyberxUsers', JSON.stringify(users));

  // Запись активности
  if (typeof logActivity === 'function') {
    logActivity(email);
  }

  // Обновляем интерфейс (если на dashboard)
  if (document.getElementById('points')) {
    document.getElementById('points').textContent = user.points;
    document.getElementById('total-hours').textContent = user.totalHours;
    document.getElementById('bookings-count').textContent = user.bookingsCount;
  }

  // Результат
  const resultEl = document.getElementById('booking-result');
  if (resultEl) {
    resultEl.textContent = `✅ ${pc} в зале ${hall} забронирован!`;
  }
}

document.querySelectorAll('.hall-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.hall-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentHall = btn.dataset.type;
    loadPCs(currentHall);
  });
});

if (document.getElementById('pc-list')) {
  loadPCs(currentHall);
}
