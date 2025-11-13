const bookingForm = document.getElementById('booking-form');
bookingForm.addEventListener('submit', e => {
  e.preventDefault();

  // 폼 유효성은 HTML required, pattern으로 처리됨
  alert('예약이 접수되었습니다. 감사합니다!');
  bookingForm.reset();
});
