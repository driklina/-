function initTilt() {
    document.querySelectorAll('.tilt-card').forEach(card => {
      // Удаляем предыдущие обработчики (защита от дублирования)
      if (card.__tiltMove) {
        card.removeEventListener('mousemove', card.__tiltMove);
        card.removeEventListener('mouseleave', card.__tiltLeave);
      }
  
      const rect = card.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
  
      const handleMove = (e) => {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = (x - width / 2) / (width / 2);
        const centerY = (y - height / 2) / (height / 2);
        const rotateY = centerX * 8;
        const rotateX = -centerY * 8;
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
      };
  
      const handleLeave = () => {
        card.style.transform = 'rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      };
  
      card.addEventListener('mousemove', handleMove);
      card.addEventListener('mouseleave', handleLeave);
  
      // Сохраняем для удаления
      card.__tiltMove = handleMove;
      card.__tiltLeave = handleLeave;
    });
  }
  
  // Запуск при загрузке
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTilt);
  } else {
    initTilt();
  }
  
  // Глобальный доступ (на случай динамического контента)
  window.initTilt = initTilt;
