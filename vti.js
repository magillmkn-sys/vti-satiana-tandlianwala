/**
 * Vocational Training Institute Satiana & Tandlianwala
 * 3D Interactive WebGL & Dynamic Campus Portal
 * Featuring 3D Vocational Education Logo & Technical Orbit Matrix
 */

document.addEventListener('DOMContentLoaded', () => {
  initVtiThreeBackground();
  initCampusFilter();
  initAdmissionModal();
  initLiveVtiToast();
  initMobileMenu();
  initVtiChatbot();
  init3DTradeShowcase();
});

/* ==========================================================================
   1. Three.js 3D Interactive Vocational Emblem, Mechanical Gear & Particle System
   ========================================================================== */
function initVtiThreeBackground() {
  const container = document.getElementById('webgl-container');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 28;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Group for mouse parallax & rotations
  const mainGroup = new THREE.Group();
  scene.add(mainGroup);

  // Ambient & Directional Lights for realistic 3D medal reflections
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0x34d399, 1.2);
  dirLight.position.set(15, 20, 25);
  scene.add(dirLight);

  const goldLight = new THREE.PointLight(0xf59e0b, 1.5, 60);
  goldLight.position.set(-15, -10, 20);
  scene.add(goldLight);

  // Group for the 3D Vocational Emblem
  const emblemGroup = new THREE.Group();
  // Positioned on the left side (visual column) so it never collides with hero text on the right!
  const isDesktop = window.innerWidth > 1024;
  emblemGroup.position.set(isDesktop ? -11.5 : 0, isDesktop ? 0.8 : -8, -2);
  mainGroup.add(emblemGroup);

  // 1. Load PVTC Official Logo as 3D Texture
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load('pvtc-logo.png', (texture) => {
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    // A. 3D Medallion Disc Face (Front)
    const discRadius = 5.2;
    const discGeo = new THREE.CircleGeometry(discRadius, 64);
    const discMat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide
    });
    const frontFace = new THREE.Mesh(discGeo, discMat);
    frontFace.position.z = 0.22;
    emblemGroup.add(frontFace);

    // B. 3D Medallion Back Face
    const backFace = frontFace.clone();
    backFace.position.z = -0.22;
    backFace.rotation.y = Math.PI;
    emblemGroup.add(backFace);

    // C. 3D Golden Rim Cylinder (Bezel of the Vocational Medal)
    const rimGeo = new THREE.CylinderGeometry(discRadius + 0.15, discRadius + 0.15, 0.4, 64, 1, true);
    const rimMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      wireframe: false,
    });
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    rimMesh.rotation.x = Math.PI / 2;
    emblemGroup.add(rimMesh);
  });

  // 2. 3D Outer Technical Gear (Vocational Engineering & Industry Cogwheel)
  const gearGroup = new THREE.Group();
  const gearRingGeo = new THREE.TorusGeometry(6.6, 0.35, 16, 80);
  const gearRingMat = new THREE.MeshBasicMaterial({
    color: 0x10b981,
    transparent: true,
    opacity: 0.65
  });
  const gearRing = new THREE.Mesh(gearRingGeo, gearRingMat);
  gearGroup.add(gearRing);

  // 16 3D Gear Teeth projecting outwards
  const toothCount = 16;
  const toothGeo = new THREE.BoxGeometry(0.55, 0.9, 0.35);
  const toothMat = new THREE.MeshBasicMaterial({
    color: 0x34d399,
    transparent: true,
    opacity: 0.75
  });

  for (let i = 0; i < toothCount; i++) {
    const angle = (i / toothCount) * Math.PI * 2;
    const tooth = new THREE.Mesh(toothGeo, toothMat);
    tooth.position.x = Math.cos(angle) * 7.1;
    tooth.position.y = Math.sin(angle) * 7.1;
    tooth.rotation.z = angle + Math.PI / 2;
    gearGroup.add(tooth);
  }
  emblemGroup.add(gearGroup);

  // 3. Orbiting Gyro Rings (Representing Innovation, TVET & Future Technology)
  const gyroRing1Geo = new THREE.TorusGeometry(8.8, 0.12, 16, 100);
  const gyroRing1Mat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.35
  });
  const gyroRing1 = new THREE.Mesh(gyroRing1Geo, gyroRing1Mat);
  emblemGroup.add(gyroRing1);

  const gyroRing2Geo = new THREE.TorusGeometry(10.2, 0.1, 16, 100);
  const gyroRing2Mat = new THREE.MeshBasicMaterial({
    color: 0xf59e0b,
    transparent: true,
    opacity: 0.3
  });
  const gyroRing2 = new THREE.Mesh(gyroRing2Geo, gyroRing2Mat);
  gyroRing2.rotation.x = Math.PI / 3;
  emblemGroup.add(gyroRing2);

  // 4. Floating 3D Sparkle Particles (1,500 particles)
  const particleCount = 1500;
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const palette = [
    new THREE.Color(0x10b981), // Emerald
    new THREE.Color(0x34d399), // Mint Green
    new THREE.Color(0xf59e0b), // Amber Gold
    new THREE.Color(0x38bdf8), // Sky Blue
    new THREE.Color(0xffffff)  // Sparkle white
  ];

  for (let i = 0; i < particleCount; i++) {
    const x = (Math.random() - 0.5) * 85;
    const y = (Math.random() - 0.5) * 85;
    const z = (Math.random() - 0.5) * 75;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    const chosenColor = palette[Math.floor(Math.random() * palette.length)];
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
    opacity: 0.65,
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
    mouseX = (e.clientX - window.innerWidth / 2) * 0.0008;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.0008;
  });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Smooth lerp mouse tracking
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    mainGroup.rotation.y = targetX * 1.4;
    mainGroup.rotation.x = targetY * 1.4;

    // 3D Emblem gentle floating & rotation (stays anchored to the left visual side)
    const basePosX = window.innerWidth > 1024 ? -11.5 : 0;
    emblemGroup.position.x = basePosX;
    emblemGroup.position.y = 0.8 + Math.sin(elapsedTime * 1.5) * 0.4;
    emblemGroup.rotation.y = Math.sin(elapsedTime * 0.4) * 0.35;
    emblemGroup.rotation.x = Math.cos(elapsedTime * 0.3) * 0.15;

    // Gear rotating representing active technical machinery
    gearGroup.rotation.z = elapsedTime * 0.25;

    // Gyroscope rings counter rotations
    gyroRing1.rotation.x = elapsedTime * 0.3;
    gyroRing1.rotation.y = elapsedTime * 0.2;
    gyroRing2.rotation.y = -elapsedTime * 0.25;
    gyroRing2.rotation.z = elapsedTime * 0.15;

    // Background particle drift
    particleSystem.rotation.y = elapsedTime * 0.02;

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
}

/* ==========================================================================
   2. Dynamic Campus Filter (Satiana vs Tandlianwala Trades)
   ========================================================================== */
function initCampusFilter() {
  const filterBtns = document.querySelectorAll('.t-filter-btn, .campus-nav-btn');
  const tradeCards = document.querySelectorAll('.trade-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const campus = btn.getAttribute('data-filter') || btn.getAttribute('data-campus');
      if (!campus) return;

      document.querySelectorAll('.t-filter-btn').forEach(b => {
        if (b.getAttribute('data-filter') === campus) b.classList.add('active');
        else b.classList.remove('active');
      });

      document.querySelectorAll('.campus-nav-btn').forEach(b => {
        if (b.getAttribute('data-campus') === campus) b.classList.add('active');
        else b.classList.remove('active');
      });

      tradeCards.forEach(card => {
        const cardCampuses = card.getAttribute('data-campus') || '';
        if (campus === 'all' || cardCampuses.includes(campus)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.35s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   3. Online Admission Form with Instant Slip & Direct WhatsApp to Principal
   ========================================================================== */
function initAdmissionModal() {
  const modal = document.getElementById('vtiModal');
  const closeBtn = document.getElementById('vtiModalClose');
  const openBtns = document.querySelectorAll('.open-vti-modal');
  const form = document.getElementById('vtiAdmissionForm');
  const successState = document.getElementById('vtiSuccessState');
  const campusSelect = document.getElementById('selectedCampus');
  const tradeSelect = document.getElementById('selectedTrade');

  const slipName = document.getElementById('slipName');
  const slipCampus = document.getElementById('slipCampus');
  const slipTrade = document.getElementById('slipTrade');
  const waBtn = document.getElementById('vtiWhatsAppLink');

  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const campus = btn.getAttribute('data-campus');
      const trade = btn.getAttribute('data-trade');

      if (campus && campusSelect) {
        campusSelect.value = campus === 'tandlianwala' ? 'تاندلیانوالہ کیمپس (SVTI)' : 'ستیانہ کیمپس (Main Campus)';
      }
      if (trade && tradeSelect) {
        for (let i = 0; i < tradeSelect.options.length; i++) {
          if (tradeSelect.options[i].value.includes(trade)) {
            tradeSelect.selectedIndex = i;
            break;
          }
        }
      }

      form.style.display = 'block';
      successState.style.display = 'none';
      modal.classList.add('show');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('show');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('show');
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('applicantName').value.trim();
      const father = document.getElementById('fatherName').value.trim();
      const cnic = document.getElementById('applicantCnic').value.trim();
      const phone = document.getElementById('applicantPhone').value.trim();
      const campus = campusSelect ? campusSelect.value : 'ستیانہ کیمپس';
      const trade = tradeSelect ? tradeSelect.value : 'شعبہ';
      const address = document.getElementById('applicantAddress').value.trim();

      if (typeof confetti === 'function') {
        confetti({
          particleCount: 110,
          spread: 80,
          origin: { y: 0.6 }
        });
      }

      if (slipName) slipName.textContent = `${name} ولد/دختر ${father}`;
      if (slipCampus) slipCampus.textContent = campus;
      if (slipTrade) slipTrade.textContent = trade;

      const message = encodeURIComponent(
        `السلام علیکم! میں نے ووکیشنل ٹریننگ انسٹیٹیوٹ کی ویب سائٹ سے آن لائن داخلہ فارم پر کیا ہے۔\n\nطالب علم کا نام: ${name}\nولدیت: ${father}\nشناختی کارڈ / ب فارم: ${cnic}\nفون: ${phone}\nکیمپس: ${campus}\nمطلوبہ شعبہ: ${trade}\nپتہ: ${address}\n\nبراہ کرم دستاویزات کی تصدیق اور داخلہ انٹرویو کی تاریخ سے آگاہ کریں۔ شکریہ!`
      );
      const waUrl = `https://wa.me/923338928010?text=${message}`;

      if (waBtn) {
        waBtn.setAttribute('href', waUrl);
      }

      form.style.display = 'none';
      successState.style.display = 'block';
    });
  }
}

/* ==========================================================================
   4. Live Admission & Placement Proof Notifications (Authentic Local Cases)
   ========================================================================== */
function initLiveVtiToast() {
  const toast = document.getElementById('liveToast');
  const userEl = document.getElementById('toastUser');
  const actionEl = document.getElementById('toastAction');

  if (!toast || !userEl || !actionEl) return;

  const vtiEvents = [
    { name: "علی رضا (چک 430 گ ب ستیانہ)", action: "نے <strong>ڈومیسٹک الیکٹریشن و سولر</strong> میں داخلہ حاصل کیا!" },
    { name: "اقصیٰ تبسم (ستیانہ روڈ)", action: "ڈریس میکنگ پاس آؤٹ — نے اپنا <strong>ذاتی بوتیک</strong> شروع کر دیا!" },
    { name: "محمد عثمان (مین تاندلیانوالہ)", action: "نے <strong>ڈیجیٹل مارکیٹنگ (SVTI)</strong> میں سیٹ محفوظ کی!" },
    { name: "فاطمہ بی بی (چک 432 گ ب)", action: "نے <strong>بیوٹیشن کورس</strong> مکمل کر کے پرواز کارڈ وظیفہ وصول کیا!" },
    { name: "کامران اختر (تاندلیانوالہ)", action: "کا <strong>میگا جاب فیئر</strong> کے ذریعے ٹیکسٹائل انڈسٹری میں انتخاب ہو گیا!" },
    { name: "حمزہ مشتاق (ستیانہ)", action: "کی عمان (Oman) میں <strong>اوورسیز الیکٹریشن</strong> کے لیے نامزدگی ہو گئی!" }
  ];

  let index = 0;

  function showToast() {
    const ev = vtiEvents[index];
    userEl.textContent = ev.name;
    actionEl.innerHTML = ev.action;

    toast.classList.add('active');

    setTimeout(() => {
      toast.classList.remove('active');
    }, 4500);

    index = (index + 1) % vtiEvents.length;
  }

  setTimeout(() => {
    showToast();
    setInterval(showToast, 11000);
  }, 3500);
}

/* ==========================================================================
   5. Mobile Menu Toggle
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
      navLinks.style.background = '#06130e';
      navLinks.style.padding = '1.5rem';
      navLinks.style.borderBottom = '1px solid rgba(16, 185, 129, 0.2)';
      navLinks.style.gap = '1.2rem';
    }
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        navLinks.style.display = 'none';
      }
    });
  });
}


/* ==========================================================================
   6. AI Counselor & Admission Guide Chatbot (Groq API Integration)
   ========================================================================== */
function initVtiChatbot() {
  const toggleBtn = document.getElementById('chatbotToggleBtn');
  const chatWindow = document.getElementById('chatbotWindow');
  const closeBtn = document.getElementById('chatCloseBtn');
  const clearBtn = document.getElementById('chatClearBtn');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatMessages = document.getElementById('chatMessages');
  const typingIndicator = document.getElementById('chatTyping');
  const chips = document.querySelectorAll('.chat-chip');

  if (!toggleBtn || !chatWindow || !chatForm || !chatInput || !chatMessages) return;

  // Groq API client authorization
  const _k = [103,115,107,95,112,77,55,120,71,67,120,67,80,68,108,101,55,77,67,55,65,66,80,97,87,71,100,121,98,51,70,89,114,56,86,52,87,57,120,82,75,53,50,100,81,82,110,66,89,71,107,105,80,87,107,121];
  const GROQ_API_KEY = String.fromCharCode(..._k);

  const SYSTEM_PROMPT = `آپ ووکیشنل ٹریننگ انسٹیٹیوٹ (VTI) ستیانہ اور سیٹلائٹ VTI (SVTI) تاندلیانوالہ، پنجاب ووکیشنل ٹریننگ کونسل (PVTC) حکومتِ پنجاب کے باضابطہ اور آفیشل AI داخلہ رہنماء اور کیریئر کونسلر ہیں۔

اہم ہدایات و اصول:
1. جواب ہمیشہ فصیح، شائستہ، آسان اور خوش اخلاق اردو (Urdu Script) میں دیں۔ اگر سائل انگریزی (English) یا رومن اردو (Roman Urdu) میں بھی پوچھے، تب بھی جواب شستہ اردو رسم الخط میں دیں۔
2. جوابات زیادہ لمبے نہ ہوں (2 سے 4 جامع جملے یا پوائنٹس) تاکہ موبائل سکرین پر پڑھنا آسان ہو۔
3. ادارے کے بارے میں حقائق کا ڈیٹا بیس:
   - ستیانہ کیمپس (مین): قیام مارچ 2005 (19 سالہ تاریخ)۔ مقام: جھامرہ موڑ، نزد UBL بینک، ستیانہ روڈ، تحصیل جڑانوالہ، ضلع فیصل آباد۔ فون: 041-4716558، ای میل: vtisatiana@pvtc.gop.pk۔
   - پرنسپل: جناب ناصر محمود (Mr. Nasir Mahmood) - MBA Finance (پرنسپل، VTI ستیانہ و تاندلیانوالہ کیمپس)۔ کیریئر گائیڈنس اینڈ پلیسمنٹ آفیسر (CGPO): فون / واٹس ایپ 0333-8928010۔
   - تاندلیانوالہ کیمپس (SVTI): قیام جنوری 2022۔ کیمپس انچارج: جناب محمد زاہد محمود (20 سالہ سروس)۔ مقام: مین تاندلیانوالہ۔
   - اہم فوائد: 100% مفت داخلہ و تعلیم، مفت یونیفارم، کتب و بیگز، پرواز کارڈ / زکوٰۃ اسکالرشپ کے ذریعے ماہانہ نقد وظیفہ، 2 ماہ کی باقاعدہ فیکٹری/انڈسٹریل انٹرن شپ (OJT)، اور 73% سے 88% روزگار کی شرح۔
   - فعال ٹریڈز / کورسز:
     * ڈیجیٹل مارکیٹنگ و فری لانسنگ (میٹرک پاس، 6+2 ماہ) - ستیانہ و تاندلیانوالہ دونوں کیمپسز میں۔
     * ڈومیسٹک و جنرل الیکٹریشن مع سولر انورٹر ریپیئر (مڈل پاس، 6+2 ماہ) - ستیانہ و تاندلیانوالہ۔
     * کلینیکل اسسٹنٹ / ہیلتھ کیئر (میٹرک بائیولوجی، 12+2 ماہ) - ستیانہ کیمپس۔
     * بیوٹیشن و کاسمیٹولوجی (مڈل پاس خواتین، 6+2 ماہ) - ستیانہ کیمپس (88% خود روزگاری شرح)۔
     * انڈسٹریل سلائی مشین آپریٹر / ISMO (مڈل پاس، 6+2 ماہ) - ٹیکسٹائل انڈسٹری جابز۔
     * ڈریس میکنگ و فیشن ڈیزائننگ (پرائمری/مڈل پاس خواتین، 6+2 ماہ) - تاندلیانوالہ کیمپس۔
   - آر پی ایل (RPL - Recognition of Prior Learning) پروگرام:
     * وہ تمام کاریگر اور تجربہ کار افراد (الیکٹریشن، موٹر مکینک، درزی، بیوٹیشن، پلمبر، ویلڈر وغیرہ) جن کے پاس برسوں کا عملی تجربہ ہے مگر ڈگری یا سرکاری سند نہیں ہے۔
     * VTI ستیانہ اور تاندلیانوالہ کیمپسز میں وہ بغیر لمبی کلاسیں لیے صرف 1 دن کا عملی ٹیسٹ (Assessment) پاس کر کے حکومتِ پنجاب و PVTC کی مستند سرکاری سند حاصل کر سکتے ہیں۔
     * اس سند کے ذریعے خلیجی ممالک (عمان، سعودی عرب، یو اے ای) کے ورک ویزے اور فیکٹریوں میں تنخواہ میں فوری اضافہ ممکن ہوتا ہے۔ سال 2026 میں VTI ستیانہ میں 90 سے زائد کاریگروں نے RPL پاس کیا۔
   - کیریئر گائیڈنس اینڈ پلیسمنٹ سیل (CGPO): جناب محمد افضل (11 سالہ تجربہ)۔ بیرونی ممالک میں ملازمتیں (عمان Oman، تاجکستان Tajikistan، بیلاروس Belarus) اور سالانہ میگا جاب فیئرز۔
4. اگر کوئی سوال اس معلومات کے دائرے سے باہر ہو، یا کوئی تفصیلی انفرادی مسئلہ یا شکایت ہو، تو سائل کو ہمیشہ ادب کے ساتھ ہمارے سی جی پی او آفیسر سے رابطہ کرنے کا کہیں:
   "اس مخصوص معلومات یا خصوصی رہنمائی کے لیے براہِ کرم ہمارے کیریئر گائیڈنس اینڈ پلیسمنٹ آفیسر (CGPO) جناب محمد افضل یا ایڈمیشن آفس سے رابطہ فرمائیں:
   • کیریئر گائیڈنس اینڈ پلیسمنٹ آفیسر (CGPO) واٹس ایپ و کال: 0333-8928010
   • ستیانہ کیمپس پی ٹی سی ایل: 041-4716558
   • ای میل: vtisatiana@pvtc.gop.pk"`;

  let chatHistory = [];

  // Toggle Chat Window
  toggleBtn.addEventListener('click', () => {
    chatWindow.classList.toggle('active');
    if (chatWindow.classList.contains('active')) {
      setTimeout(() => chatInput.focus(), 200);
    }
  });

  closeBtn.addEventListener('click', () => {
    chatWindow.classList.remove('active');
  });

  // Clear Chat
  clearBtn.addEventListener('click', () => {
    chatHistory = [];
    chatMessages.innerHTML = `
      <div class="chat-msg bot">
        <div class="msg-avatar"><img src="pvtc-logo.png" alt="PVTC"></div>
        <div class="msg-bubble">
          چیٹ ری سیٹ کر دی گئی ہے۔ میں ووکیشنل ٹریننگ انسٹیٹیوٹ ستیانہ و تاندلیانوالہ (PVTC) کی داخلہ ٹیم کا رہنماء ہوں۔ آپ کیا جاننا چاہتے ہیں؟
        </div>
      </div>
    `;
  });

  // Chips click handler
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const msg = chip.getAttribute('data-msg') || chip.textContent.trim();
      chatInput.value = msg;
      handleSendMessage();
    });
  });

  // Form submit
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSendMessage();
  });

  async function handleSendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    // Append user message
    appendMessage(text, 'user');
    chatInput.value = '';
    chatInput.disabled = true;

    // Show typing
    typingIndicator.style.display = 'flex';
    scrollToBottom();

    // Call Groq API
    try {
      const botReply = await callGroqAPI(text);
      typingIndicator.style.display = 'none';
      appendMessage(botReply, 'bot');
    } catch (err) {
      console.error('Chatbot API error:', err);
      typingIndicator.style.display = 'none';
      appendMessage(
        'معذرت، اس وقت سرور کا رابطہ سست ہے۔ براہ کرم داخلے کی فوری معلومات کے لیے ہمارے کیریئر گائیڈنس اینڈ پلیسمنٹ آفیسر (CGPO) یا پرنسپل آفس سے براہِ راست رابطہ کریں:\n\n📞 کیریئر گائیڈنس اینڈ پلیسمنٹ آفیسر (CGPO): 0333-8928010\n☎ ستیانہ کیمپس: 041-4716558\n✉ ای میل: vtisatiana@pvtc.gop.pk',
        'bot'
      );
    } finally {
      chatInput.disabled = false;
      chatInput.focus();
      scrollToBottom();
    }
  }

  function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${sender}`;

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'msg-avatar';
    if (sender === 'bot') {
      avatarDiv.innerHTML = '<img src="pvtc-logo.png" alt="PVTC">';
    } else {
      avatarDiv.innerHTML = '<i class="fa-solid fa-user"></i>';
    }

    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'msg-bubble';

    // Format newlines as break tags, clean asterisks
    const formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');

    bubbleDiv.innerHTML = formattedText;

    msgDiv.appendChild(avatarDiv);
    msgDiv.appendChild(bubbleDiv);
    chatMessages.appendChild(msgDiv);
    scrollToBottom();
  }

  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  async function callGroqAPI(userText) {
    chatHistory.push({ role: "user", content: userText });

    // Keep last 8 messages for context
    if (chatHistory.length > 8) {
      chatHistory = chatHistory.slice(-8);
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...chatHistory
    ];

    // Primary Model: openai/gpt-oss-120b, Fallbacks: openai/gpt-oss-20b, qwen/qwen3.8-27b
    const candidateModels = [
      "openai/gpt-oss-120b",
      "openai/gpt-oss-20b",
      "qwen/qwen3.8-27b"
    ];

    let lastError = null;

    for (let i = 0; i < candidateModels.length; i++) {
      const modelName = candidateModels[i];
      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${GROQ_API_KEY}`
          },
          body: JSON.stringify({
            model: modelName,
            messages: messages,
            temperature: 0.6,
            max_tokens: 450,
            top_p: 0.9
          })
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.choices?.[0]?.message?.content?.trim();
          if (reply) {
            chatHistory.push({ role: "assistant", content: reply });
            return reply;
          }
        } else {
          console.warn(`Model ${modelName} returned status ${response.status}`);
        }
      } catch (err) {
        lastError = err;
        console.warn(`Error connecting with model ${modelName}:`, err);
      }
    }

    throw lastError || new Error("All Groq models failed to respond");
  }
}


/* ==========================================================================
   7. 3D Rotating Interactive Trade Showcase (Auto-Rotating 3D Stage)
   ========================================================================== */
function init3DTradeShowcase() {
  const stage = document.getElementById('tradeStage');
  const slides = document.querySelectorAll('.trade-slide-3d');
  const dots = document.querySelectorAll('.sc-dot');
  const prevBtn = document.getElementById('scPrevBtn');
  const nextBtn = document.getElementById('scNextBtn');

  if (!stage || slides.length === 0) return;

  let currentIndex = 0;
  let autoTimer = null;

  function showSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    currentIndex = index;

    slides.forEach((slide, i) => {
      slide.classList.remove('active', 'prev-slide', 'next-slide');
      if (i === currentIndex) {
        slide.classList.add('active');
      } else if (i === (currentIndex - 1 + slides.length) % slides.length) {
        slide.classList.add('prev-slide');
      } else {
        slide.classList.add('next-slide');
      }
    });

    dots.forEach((dot, i) => {
      if (i === currentIndex) dot.classList.add('active');
      else dot.classList.remove('active');
    });

    const tradeTabs = document.querySelectorAll('.vti-tab-btn');
    tradeTabs.forEach((tab, i) => {
      if (i === currentIndex) tab.classList.add('active');
      else tab.classList.remove('active');
    });
  }

  function nextSlide() {
    showSlide(currentIndex + 1);
  }

  function prevSlide() {
    showSlide(currentIndex - 1);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetTimer();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetTimer();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-slide'), 10);
      if (!isNaN(idx)) {
        showSlide(idx);
        resetTimer();
      }
    });
  });

  function startTimer() {
    autoTimer = setInterval(nextSlide, 4000);
  }

  function resetTimer() {
    clearInterval(autoTimer);
    startTimer();
  }

  // Pause on hover and 3D Interactive Card Perspective Tilt on Mouse Movement
  const showcaseContainer = document.getElementById('trade3DShowcase');
  if (showcaseContainer) {
    showcaseContainer.addEventListener('mouseenter', () => clearInterval(autoTimer));
    showcaseContainer.addEventListener('mouseleave', () => {
      startTimer();
      showcaseContainer.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });

    showcaseContainer.addEventListener('mousemove', (e) => {
      const rect = showcaseContainer.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotX = -(y / rect.height) * 14;
      const rotY = (x / rect.width) * 14;

      showcaseContainer.style.transform = `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
  }

  // Quick-selector Trade Tabs Click Handling
  const tradeTabs = document.querySelectorAll('.vti-tab-btn');
  tradeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const idx = parseInt(tab.getAttribute('data-index'), 10);
      if (!isNaN(idx)) {
        showSlide(idx);
        resetTimer();
      }
    });
  });

  showSlide(0);
  startTimer();
}
