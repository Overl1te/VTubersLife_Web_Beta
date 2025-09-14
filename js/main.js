document.addEventListener('DOMContentLoaded', () => {
  // Language switching logic
  let translations = {};
  fetch('lang.json')
    .then(response => response.json())
    .then(data => {
      translations = data;
      const savedLang = localStorage.getItem('language') || 'ru';
      document.getElementById('language-switcher').value = savedLang;
      applyTranslations(savedLang);
    });

  const applyTranslations = (lang) => {
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key]) {
        element.textContent = translations[lang][key];
      }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      if (translations[lang] && translations[lang][key]) {
        element.placeholder = translations[lang][key];
      }
    });
    document.documentElement.lang = lang;
    localStorage.setItem('language', lang);
  };

  const languageSwitcher = document.getElementById('language-switcher');
  if (languageSwitcher) {
    languageSwitcher.addEventListener('change', (e) => {
      applyTranslations(e.target.value);
    });
  }

  let notifyTimer = null;
  notification = document.getElementById('notification');
  function notifySubscribe() {
    notification.classList.add("active");
    clearTimeout(notifyTimer);
    notifyTimer = setTimeout(() => notification.classList.remove("active"), 3000);
  }

  const account_link = document.querySelector('.to-account-page');
  if (account_link) account_link.addEventListener('click', () => window.location = '/account.html');

  const form = document.getElementById('subform');
  const subscribeInput = document.getElementById('subscribe_input');
  if (form) form.addEventListener('submit', async e => { 
    e.preventDefault(); // Prevent default form submission

    let inputTimer = null;

    if (subscribeInput.value.trim() === '') {
      subscribeInput.classList.add('error');
      clearTimeout(inputTimer);
      inputTimer = setTimeout(() => {subscribeInput.classList.remove("error")}, 5000);
      return;
    }

    const emailError = document.querySelector('.subscribe_error');

    try {
      const response = await fetch('http://localhost:3000/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: subscribeInput.value })
      });

      if (response.ok) {
        notifySubscribe();
        form.reset();
      } else {
        // Output server error to console
        const errorData = await response.json();
        console.error("Subscribe error:", errorData.error);
        emailError.textContent = errorData.error || "An error occurred. Please try again.";
        emailError.style.display = 'block';
        subscribeInput.classList.add('error');
        clearTimeout(inputTimer);
        inputTimer = setTimeout(() => {
          subscribeInput.classList.remove("error");
          emailError.style.display = 'none';
        }, 5000);
      }
    } catch (error) {
      // Output network error to console
      console.error("Network error:", error);
      emailError.textContent = "Network error. Please try again.";
      emailError.style.display = 'block';
      subscribeInput.classList.add('error');
      clearTimeout(inputTimer);
      inputTimer = setTimeout(() => {
        subscribeInput.classList.remove("error");
        emailError.style.display = 'none';
      }, 5000);
    }
  });

  // Enhanced fade-in animation for sections and grid items
  const fadeEls = document.querySelectorAll('.fade-in, .hero, .screens, .subscribe, .plans, .advantages, .footer, .plan, .advantage-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  fadeEls.forEach(el => observer.observe(el));

  // Slider logic
  const slider = document.querySelector('.slider');
  if (slider) {
    const slides = slider.querySelector('.slides');
    const images = slides.querySelectorAll('img');
    const dotsContainer = slider.querySelector('.dots');
    let currentIndex = 0;
    let autoSlideInterval;

    // Create dots
    images.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      dot.addEventListener('click', () => {
        currentIndex = index;
        showSlide(currentIndex);
        resetAutoSlide();
      });
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.dot');

    const showSlide = (index) => {
      slides.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    };

    const startAutoSlide = () => {
      autoSlideInterval = setInterval(() => {
        currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
        showSlide(currentIndex);
      }, 5000);
    };

    const resetAutoSlide = () => {
      clearInterval(autoSlideInterval);
      startAutoSlide();
    };

    // Initial setup
    showSlide(currentIndex);
    startAutoSlide();
  }
});