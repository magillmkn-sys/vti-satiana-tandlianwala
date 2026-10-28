/**
 * Antigravity AI Academy - 3D Interactive & High Conversion Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initThreeJSBackground();
  initCountdownTimer();
  initHologramTilt();
  initCurriculumAccordion();
  initFaqAccordion();
  initToolsFilter();
  initEnrollmentModal();
  initLiveSocialProof();
  initMobileMenu();
});

/* ==========================================================================
   1. Three.js 3D Interactive Cybernetic Mesh & Particle System
   ========================================================================== */
function initThreeJSBackground() {
  const container = document.getElementById('webgl-container');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 28;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Group for mouse parallax
  const mainGroup = new THREE.Group();
  scene.add(mainGroup);

  // 1. Cyber 3D Torus Wireframe (Holographic core)
  const torusGeometry = new THREE.TorusGeometry(8, 2.2, 16, 100);
  const torusMaterial = new THREE.MeshBasicMaterial({
    color: 0x00f5d4,
    wireframe: true,
    transparent: true,
    opacity: 0.18,
  });
  const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
  mainGroup.add(torusMesh);

  // 2. Inner Icosahedron Node (Center AI Core)
  const icoGeometry = new THREE.IcosahedronGeometry(4, 1);
  const icoMaterial = new THREE.MeshBasicMaterial({
    color: 0xa855f7,
    wireframe: true,
    transparent: true,
    opacity: 0.35,
  });
  const icoMesh = new THREE.Mesh(icoGeometry, icoMaterial);
  mainGroup.add(icoMesh);

  // 3. Floating 3D Cyber Particles (1,500 particles)
  const particleCount = 1500;
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const colorPalette = [
    new THREE.Color(0x00f5d4), // Cyan
    new THREE.Color(0x38bdf8), // Sky Blue
    new THREE.Color(0xa855f7), // Purple
    new THREE.Color(0xffffff)  // White star
  ];

  for (let i = 0; i < particleCount; i++) {
    const x = (Math.random() - 0.5) * 80;
    const y = (Math.random() - 0.5) * 80;
    const z = (Math.random() - 0.5) * 70;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    const chosenColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    colors[i * 3] = chosenColor.r;
    colors[i * 3 + 1] = chosenColor.g;
    colors[i * 3 + 2] = chosenColor.b;
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.22,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
  });

  const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
  mainGroup.add(particleSystem);

  // Mouse Parallax movement
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.001;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.001;
  });

  // Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Smooth lerp mouse tracking
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    mainGroup.rotation.y = targetX * 1.5 + elapsedTime * 0.06;
    mainGroup.rotation.x = targetY * 1.5 + Math.sin(elapsedTime * 0.2) * 0.1;

    // Torus rotations
    torusMesh.rotation.x = elapsedTime * 0.15;
    torusMesh.rotation.y = elapsedTime * 0.12;

    // Icosahedron counter rotation
    icoMesh.rotation.x = -elapsedTime * 0.25;
    icoMesh.rotation.y = -elapsedTime * 0.2;

    // Gentle particle oscillation
    particleSystem.rotation.y = elapsedTime * 0.02;

    renderer.render(scene, camera);
  }

  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
}

/* ==========================================================================
   2. Live Countdown Urgency Timer
   ========================================================================== */
function initCountdownTimer() {
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');

  if (!hoursEl || !minsEl || !secsEl) return;

  // Set target to 12 hours from current load
  let totalSeconds = 12 * 3600 + 45 * 60 + 30;

  setInterval(() => {
    if (totalSeconds <= 0) {
      totalSeconds = 24 * 3600; // Reset
    }
    totalSeconds--;

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(minutes).padStart(2, '0');
    secsEl.textContent = String(seconds).padStart(2, '0');
  }, 1000);
}

/* ==========================================================================
   3. Interactive 3D Card Tilt Effect
   ========================================================================== */
function initHologramTilt() {
  const card = document.getElementById('holoCard');
  if (!card) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = -(y / rect.height) * 16;
    const rotY = (x / rect.width) * 16;

    card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}

/* ==========================================================================
   4. Curriculum Accordion
   ========================================================================== */
function initCurriculumAccordion() {
  const items = document.querySelectorAll('.curriculum-accordion .accordion-item');

  items.forEach(item => {
    const header = item.querySelector('.accordion-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items for a clean accordion experience
      items.forEach(el => el.classList.remove('active'));

      // If clicked item wasn't active, activate it
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   5. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const qBtn = item.querySelector('.faq-q');
    if (!qBtn) return;

    qBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(el => el.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   6. Tools Arsenal Filter
   ========================================================================== */
function initToolsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const toolCards = document.querySelectorAll('.tool-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      toolCards.forEach(card => {
        const cat = card.getAttribute('data-cat') || '';
        if (filter === 'all' || cat.includes(filter)) {
          card.style.display = 'block';
          card.style.animation = 'fadeIn 0.35s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   7. Enrollment Registration Modal with Confetti & Direct WhatsApp Redirect
   ========================================================================== */
function initEnrollmentModal() {
  const modal = document.getElementById('enrollModal');
  const modalClose = document.getElementById('modalClose');
  const openBtns = document.querySelectorAll('.open-modal-btn');
  const planTitle = document.getElementById('modalPlanTitle');
  const planInput = document.getElementById('selectedPlanInput');
  const enrollForm = document.getElementById('enrollmentForm');
  const successState = document.getElementById('successState');
  const directWALink = document.getElementById('directWhatsAppLink');

  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const plan = btn.getAttribute('data-plan') || 'Pro AI Engineer';
      if (planTitle) planTitle.textContent = `کورس رجسٹریشن - ${plan}`;
      if (planInput) planInput.value = plan;

      // Reset states
      if (enrollForm) enrollForm.style.display = 'block';
      if (successState) successState.style.display = 'none';

      modal.classList.add('show');
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('show');
    });
  }

  // Close when clicking background outside modal card
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('show');
    }
  });

  // Form submission
  if (enrollForm) {
    enrollForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('studentName').value.trim();
      const phone = document.getElementById('studentWhatsApp').value.trim();
      const email = document.getElementById('studentEmail').value.trim();
      const exp = document.getElementById('experienceLevel').value;
      const plan = planInput ? planInput.value : 'Pro AI Engineer';

      // Confetti celebration
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      // Generate pre-filled WhatsApp link
      const waText = encodeURIComponent(
        `السلام علیکم! میں نے اینٹی گریویٹی AI اکیڈمی پر داخلہ فارم پر کیا ہے۔\n\nنام: ${name}\nواٹس ایپ: ${phone}\nای میل: ${email}\nمنتخب پلان: ${plan}\nتجربہ: ${exp}\n\nبراہ کرم فیس ادائیگی کا اکاؤنٹ نمبر اور سیٹ کنفرمیشن فراہم کریں۔ شکریہ!`
      );
      const waUrl = `https://wa.me/923000000000?text=${waText}`;

      if (directWALink) {
        directWALink.setAttribute('href', waUrl);
      }

      enrollForm.style.display = 'none';
      if (successState) {
        successState.style.display = 'block';
      }
    });
  }
}

/* ==========================================================================
   8. Live Social Proof Toast Notifications
   ========================================================================== */
function initLiveSocialProof() {
  const toast = document.getElementById('liveToast');
  const userEl = document.getElementById('toastUser');
  const actionEl = document.getElementById('toastAction');

  if (!toast || !userEl || !actionEl) return;

  const socialEvents = [
    { name: "حمزہ طارق (اسلام آباد)", action: "نے ابھی پرو AI انجینئر ماسٹر کلاس میں نشست حاصل کی!" },
    { name: "بلال رشید (لاہور)", action: "نے اینٹی گریویٹی کروم ایکسٹینشنز پیک میں داخلہ لیا!" },
    { name: "عائشہ صدیقی (کراچی)", action: "نے VIP 1-on-1 مینٹورشپ سیشن بک کیا!" },
    { name: "عمران خان (پشاور)", action: "نے ورڈپریس AI پلگ ان ڈویلپمنٹ ماڈیول شروع کیا!" },
    { name: "سعد ملک (فیصل آباد)", action: "نے ابھی 40% ڈسکاؤنٹ پر سیٹ محفوظ کی!" },
    { name: "دانش رضا (ملتان)", action: "نے n8n آٹومیشن فلو کا کورس سلیبس ڈاؤنلوڈ کیا!" }
  ];

  let index = 0;

  function showToast() {
    const current = socialEvents[index];
    userEl.textContent = current.name;
    actionEl.innerHTML = current.action;

    toast.classList.add('active');

    setTimeout(() => {
      toast.classList.remove('active');
    }, 4500);

    index = (index + 1) % socialEvents.length;
  }

  // Initial delay 4s, then repeat every 11 seconds
  setTimeout(() => {
    showToast();
    setInterval(showToast, 11000);
  }, 4000);
}

/* ==========================================================================
   9. Mobile Menu Toggle
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', () => {
    if (navLinks.style.display === 'flex') {
      navLinks.style.display = 'none';
    } else {
      navLinks.style.display = 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '100%';
      navLinks.style.left = '0';
      navLinks.style.right = '0';
      navLinks.style.background = '#090d1f';
      navLinks.style.padding = '1.5rem';
      navLinks.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
      navLinks.style.gap = '1.2rem';
    }
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        navLinks.style.display = 'none';
      }
    });
  });
}
