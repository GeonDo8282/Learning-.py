// 햄버거 메뉴 토글
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('open');
});

// 스크롤 페이드인
const faders = document.querySelectorAll('.fade-in');
const appearOptions = {
  threshold: 0.3,
  rootMargin: "0px 0px -100px 0px"
};

const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, appearOptions);

faders.forEach(fader => {
  appearOnScroll.observe(fader);
});

// 다국어 지원
const translations = {
  ko: {
    nav_services: "서비스",
    nav_templates: "템플릿",
    nav_pricing: "요금제",
    nav_contact: "주문",
    hero_title: "원하는 웹사이트, 쉽게 주문하세요",
    hero_subtitle: "포트폴리오, 블로그, 브랜드 페이지까지 – 맞춤형 제작 서비스 제공",
    hero_cta: "지금 주문하기",
    services_title: "🛠️ 제공 서비스",
    service_resp: "반응형 웹",
    service_resp_desc: "모바일, 태블릿, PC까지 완벽 대응",
    service_multi: "다국어 지원",
    service_multi_desc: "한국어와 영어를 자유롭게 전환",
    service_form: "폼 연동",
    service_form_desc: "디스코드 웹훅 폼 연동 가능",
    service_anim: "애니메이션",
    service_anim_desc: "부드러운 인터랙션 효과 포함",
    service_custom: "100% 맞춤 제작",
    service_custom_desc: "고객 요구에 딱 맞는 디자인",
    templates_title: "🎨 인기 템플릿",
    template_blog: "감성 블로그",
    template_blog_desc: "따뜻하고 부드러운 디자인",
    template_portfolio: "포트폴리오",
    template_portfolio_desc: "개발자/디자이너 전용 슬라이드",
    template_product: "제품 소개",
    template_product_desc: "서비스와 제품 홍보용 랜딩페이지",
    pricing_title: "💰 요금제 안내",
    pricing_free: "무료",
    pricing_free_desc: "기본 템플릿 제공",
    pricing_basic: "기본형",
    pricing_basic_desc: "+ 다국어, 애니메이션 포함",
    pricing_advanced: "고급형",
    pricing_advanced_desc: "+ 맞춤 제작 및 디스코드 폼 연동",
    contact_title: "📬 주문서 작성",
    contact_service_select: "원하는 서비스 선택",
    contact_service_basic: "기본형",
    contact_service_advanced: "고급형 (폼 연동 포함)",
    contact_submit: "의뢰하기"
  },
  en: {
    nav_services: "Services",
    nav_templates: "Templates",
    nav_pricing: "Pricing",
    nav_contact: "Order",
    hero_title: "Order Your Website Easily",
    hero_subtitle: "Portfolio, blog, brand page - custom made service",
    hero_cta: "Order Now",
    services_title: "🛠️ Our Services",
    service_resp: "Responsive Design",
    service_resp_desc: "Optimized for mobile, tablet, desktop",
    service_multi: "Multi-language Support",
    service_multi_desc: "Switch freely between Korean and English",
    service_form: "Form Integration",
    service_form_desc: "Discord webhook form integration available",
    service_anim: "Animations",
    service_anim_desc: "Smooth interaction effects included",
    service_custom: "100% Custom Made",
    service_custom_desc: "Design tailored exactly to your needs",
    templates_title: "🎨 Popular Templates",
    template_blog: "Emotional Blog",
    template_blog_desc: "Warm and soft design",
    template_portfolio: "Portfolio",
    template_portfolio_desc: "Slides for developers/designers",
    template_product: "Product Showcase",
    template_product_desc: "Landing page for services and products",
    pricing_title: "💰 Pricing Plans",
    pricing_free: "Free",
    pricing_free_desc: "Basic templates included",
    pricing_basic: "Basic",
    pricing_basic_desc: "+ Multi-language, animations",
    pricing_advanced: "Advanced",
    pricing_advanced_desc: "+ Custom work & Discord form integration",
    contact_title: "📬 Order Form",
    contact_service_select: "Select your service",
    contact_service_basic: "Basic",
    contact_service_advanced: "Advanced (with form)",
    contact_submit: "Submit Order"
  }
};
const langBtns = document.querySelectorAll('.lang-switch button');
const langElements = document.querySelectorAll('[data-lang-key]');

function setLanguage(lang) {
  langElements.forEach(el => {
    const key = el.getAttribute('data-lang-key');
    if (translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
  langBtns.forEach(btn => btn.classList.remove('active'));
  document.getElementById('btn-' + lang).classList.add('active');
}
langBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    setLanguage(btn.id.replace('btn-', ''));
  });
});
// 초기 언어 설정
setLanguage('ko');

// 디스코드 웹훅 연동 폼 제출
const form = document.getElementById('contactForm');
const formMessage = document.querySelector('.form-message');

// ⚠️ 실 사용시 반드시 본인 웹훅 URL로 변경하세요!
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1402175755412049982/JbkHimrLqr_Z9df8lQgDR7KVk5x_FPFR8oVAkoWa31mYjWSyO25noc8CZtY0daHPjQQ3';

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const name = formData.get('name');
  const email = formData.get('email');
  const service = formData.get('service');
  const details = formData.get('details') || '없음';

  if(!name || !email || !service){
    formMessage.textContent = '모든 필수 항목을 채워주세요.';
    formMessage.style.color = 'red';
    return;
  }

  const content = `🆕 **새 주문 접수**\n**이름:** ${name}\n**연락처:** ${email}\n**서비스:** ${service}\n**요청사항:** ${details}`;

  try {
    const res = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });

    if(res.ok){
      formMessage.textContent = '주문서가 정상적으로 제출되었습니다. 감사합니다!';
      formMessage.style.color = '#4a90e2';
      form.reset();
    } else {
      throw new Error('전송 실패');
    }
  } catch (err) {
    formMessage.textContent = '전송 중 오류가 발생했습니다. 나중에 다시 시도해주세요.';
    formMessage.style.color = 'red';
  }
});
// 페이지 로드 후 애니메이션 트리거
window.addEventListener('DOMContentLoaded', () => {
  const businessInfo = document.querySelector('.business-info-main');
  if (businessInfo) {
    // opacity 0 -> 1 애니메이션 시작
    setTimeout(() => {
      businessInfo.classList.add('animated');
    }, 100); // 약간 딜레이 줘 자연스럽게
  }
});
async function processPayment(amount) {
  // 실제 토스페이먼츠 API 연동 (예시)
  try {
    const response = await fetch('/api/tosspayments/pay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    });
    if (!response.ok) {
      throw new Error(`서버 오류: ${response.status}`);
    }
    const data = await response.json();
    if (data.success) {
      return { success: true, data };
    } else {
      return { success: false, errorCode: data.errorCode || 'UNKNOWN_ERROR', message: data.message };
    }
  } catch (error) {
    return { success: false, errorCode: 'NETWORK_ERROR', message: error.message };
  }
}
function saveOrder(email, templateName, request) {
  let orders = JSON.parse(localStorage.getItem('orders')) || [];
  orders.push({
    id: Date.now(),
    email,
    templateName,
    request,
    status: "pending",
    orderDate: new Date().toISOString().slice(0, 10),
  });
  localStorage.setItem('orders', JSON.stringify(orders));
}

