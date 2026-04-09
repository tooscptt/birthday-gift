// Configuration
const CONFIG = {
    name: "CITRA", // Silakan ubah nama ini sesuai keinginan
    numPhotos: 20, // Pastikan kamu menyiapkan tepat 20 foto (atau ubah angka ini sesuai jumlah fotomu)
};

// Global Background Animation setup
const cuteBg = document.getElementById('cuteBg');
for(let i=0; i<30; i++) {
    const float = document.createElement('div');
    float.className = 'cute-float ' + (Math.random() > 0.5 ? 'heart' : 'circle');
    
    const size = 10 + Math.random() * 30;
    if(float.classList.contains('heart')) {
        float.innerHTML = '💖';
        float.style.fontSize = size + 'px';
    } else {
        float.style.width = size + 'px';
        float.style.height = size + 'px';
    }
    
    float.style.left = Math.random() * 100 + '%';
    float.style.animationDuration = (5 + Math.random() * 10) + 's';
    float.style.animationDelay = (Math.random() * 5) + 's';
    cuteBg.appendChild(float);
}

// State
let currentScene = 1;
let photos = [];

// Memuat gambar dari folder lokal
for(let i = 1; i <= CONFIG.numPhotos; i++) {
    // Memanggil gambar1.jpg, gambar2.jpg, dst. di dalam folder assets/img/
    photos.push(`assets/img/gambar${i}.jpg`); 
}

function preloadImages() {
    photos.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}
preloadImages();

function switchScene(nextSceneNumber) {
    document.querySelectorAll('.scene').forEach(s => s.classList.remove('active'));
    document.getElementById(`scene${nextSceneNumber}`).classList.add('active');
    currentScene = nextSceneNumber;
    
    if(nextSceneNumber >= 2 && nextSceneNumber <= 5) {
        cuteBg.classList.add('show');
    } else {
        cuteBg.classList.remove('show');
    }

    if(nextSceneNumber === 2) initScene2();
    if(nextSceneNumber === 3) initScene3();
    if(nextSceneNumber === 4) initScene4();
    if(nextSceneNumber === 5) initScene5();
}

const startBtn = document.getElementById('startBtn');
startBtn.addEventListener('click', () => {
    const audio = document.getElementById('bgMusic');
    audio.volume = 0.5;
    audio.play().catch(e => console.log('Audio autoplay prevented'));
    startBtn.style.display = 'none';
    startSequence();
});

// --- Scene 1: Matrix & Countdown Intro ---
const matrixCanvas = document.getElementById('matrixCanvas');
const matrixCtx = matrixCanvas.getContext('2d');
const particleCanvas = document.getElementById('particleCanvas');
const particleCtx = particleCanvas.getContext('2d');

let cw = matrixCanvas.width = particleCanvas.width = window.innerWidth;
let ch = matrixCanvas.height = particleCanvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    cw = matrixCanvas.width = particleCanvas.width = window.innerWidth;
    ch = matrixCanvas.height = particleCanvas.height = window.innerHeight;
});

const characters = "HAPPYBIRTHDAY";
const fontSize = 28;
const columns = cw / fontSize;
const drops = [];
for (let x = 0; x < columns; x++) drops[x] = 1;

function drawMatrix() {
    matrixCtx.fillStyle = "rgba(11, 11, 10, 0.1)";
    matrixCtx.shadowBlur = 0; 
    matrixCtx.fillRect(0, 0, cw, ch);
    
    matrixCtx.fillStyle = "#ff477e"; 
    matrixCtx.font = "bold " + fontSize + "px monospace";
    matrixCtx.shadowColor = '#FF6699';
    matrixCtx.shadowBlur = 10;
    
    for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        matrixCtx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > ch && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    }
}
let matrixInterval;

class Particle {
    constructor(tx, ty) {
        this.tx = tx;
        this.ty = ty;
        this.x = Math.random() * cw;
        this.y = Math.random() * ch;
        this.color = "#ff477e";
        this.size = Math.random() * 2 + 1.5;
    }
    update() {
        let dx = this.tx - this.x;
        let dy = this.ty - this.y;
        if(Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
            this.x = this.tx;
            this.y = this.ty;
        } else {
            this.x += dx * 0.15;
            this.y += dy * 0.15;
        }
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

let particles = [];
function createParticlesFromText(text) {
    const tCanvas = document.createElement('canvas');
    const tCtx = tCanvas.getContext('2d');
    tCanvas.width = cw;
    tCanvas.height = ch;
    tCtx.fillStyle = "white";
    let finalFontSize = text.length > 5 ? Math.min(cw/(text.length*0.6), 150) : Math.min(cw/3, 200);
    tCtx.font = `bold ${finalFontSize}px 'Fredoka One', cursive`;
    tCtx.textAlign = "center";
    tCtx.textBaseline = "middle";
    tCtx.fillText(text, cw / 2, ch / 2);
    
    const imgData = tCtx.getImageData(0, 0, cw, ch).data;
    const step = 6; 
    let newTargets = [];
    
    for(let y = 0; y < ch; y += step) {
        for(let x = 0; x < cw; x += step) {
            const index = (y * cw + x) * 4;
            if(imgData[index + 3] > 128) {
                newTargets.push({x, y});
            }
        }
    }
    
    newTargets.sort(() => Math.random() - 0.5);
    
    particles.forEach(p => {
        p.x += (Math.random() - 0.5) * 800;
        p.y += (Math.random() - 0.5) * 800;
    });

    const newParticles = [];
    for(let i=0; i<newTargets.length; i++) {
        let t = newTargets[i];
        if(i < particles.length) {
            let p = particles[i];
            p.tx = t.x;
            p.ty = t.y;
            newParticles.push(p);
        } else {
            newParticles.push(new Particle(t.x, t.y));
        }
    }
    particles = newParticles;
}

function drawParticles() {
    particleCtx.clearRect(0, 0, cw, ch);
    particleCtx.shadowColor = '#ff477e';
    particleCtx.shadowBlur = 15;
    particles.forEach(p => {
        p.update();
        p.draw(particleCtx);
    });
}

function startSequence() {
    matrixInterval = setInterval(drawMatrix, 50);
    
    let animReq;
    function loopParticles() {
        drawParticles();
        animReq = requestAnimationFrame(loopParticles);
    }
    loopParticles();
    
    // Split HAPPY and BIRTHDAY
    const seq = ["3", "2", "1", "HAPPY", "BIRTHDAY", CONFIG.name];
    let idx = 0;
    
    function showNextText() {
        if(idx < seq.length) {
            createParticlesFromText(seq[idx]);
            let duration = seq[idx].length > 3 ? 2500 : 1500;
            idx++;
            setTimeout(showNextText, duration);
        } else {
            setTimeout(() => {
                clearInterval(matrixInterval);
                cancelAnimationFrame(animReq);
                switchScene(2);
            }, 2000);
        }
    }
    showNextText();
}

// --- Scene 2: Flower Growing Animation (CSS Version) ---
function initScene2() {
    // 1. Tunggu efek transisi layar selesai (1.5 detik), baru animasinya di-play
    setTimeout(() => {
        document.getElementById('scene2').classList.add('play-anim');
    }, 1500); 

    // 2. Memberikan waktu untuk animasi bunga berjalan,
    // lalu pindah otomatis ke scene 3. (Waktunya ditambah jadi 13.5 detik).
    setTimeout(() => {
        switchScene(3);
    }, 13500); 
}

// --- Scene 3: Scattered Desk ---
function initScene3() {
    const container = document.getElementById('deskContainer');
    container.innerHTML = '';
    const slice = photos.slice(8, 14); 
    
    slice.forEach((src, idx) => {
        setTimeout(() => {
            const div = document.createElement('div');
            div.className = 'desk-photo photo-item';
            
            div.style.left = (20 + Math.random() * 50) + '%';
            div.style.top = (20 + Math.random() * 40) + '%';
            
            const img = document.createElement('img');
            img.src = src;
            div.appendChild(img);
            container.appendChild(div);
            
            requestAnimationFrame(() => {
                div.style.transform = `scale(1) rotate(${-25 + Math.random()*50}deg)`;
            });
        }, idx * 600); 
    });
    
    setTimeout(() => switchScene(4), 6000);
}

// --- Scene 4: Interactive Cute Book ---
function initScene4() {
    const book = document.getElementById('book');
    book.innerHTML = '';
    const numPages = Math.min(6, Math.floor(photos.length / 2));
    let currentPage = 0;
    let zIndex = numPages;
    
    for(let i = 0; i < numPages; i++) {
        const page = document.createElement('div');
        page.className = 'book-page';
        page.style.zIndex = zIndex--;
        
        const front = document.createElement('div');
        front.className = 'page-front';
        
        const back = document.createElement('div');
        back.className = 'page-back';

        if(i === 0) {
            page.classList.add('cover-front');
            front.innerHTML = `
                <h2 style="color:#fff; font-size:3rem; font-family:'Fredoka One', cursive; text-align:center; text-shadow: 2px 2px 0 var(--primary-color);">Our<br>Memories<br>💖</h2>
            `;
            back.innerHTML = `<div class="page-decoration"></div><img src="${photos[(i*2)]}"><div class="page-number">2</div>`;
        } else if (i === numPages - 1) {
            page.classList.add('cover-back');
            front.innerHTML = `<img src="${photos[(i*2)-1]}"><div class="page-number">${i*2 + 1}</div>`;
            back.innerHTML = `
                <div class="page-decoration">The End 🎉</div>
                <button id="finishBookBtn" style="margin-top:30px; padding:15px 30px; font-family:'Fredoka One',cursive; font-size:1.2rem; background:#fff; color:var(--primary-color); border:2px solid var(--primary-color); border-radius:50px; cursor:pointer; box-shadow:0 5px 15px rgba(255,112,150,0.4);">
                    See Surprise 🎁
                </button>
            `;
        } else {
            front.innerHTML = `<img src="${photos[(i*2)-1]}"><div class="page-number">${i*2 + 1}</div>`;
            back.innerHTML = `<img src="${photos[i*2]}"><div class="page-number">${i*2 + 2}</div>`;
        }
        
        page.appendChild(front);
        page.appendChild(back);
        
        page.addEventListener('click', function() {
            if(this.classList.contains('flipped')) {
                this.classList.remove('flipped');
                this.style.zIndex = numPages - i;
            } else {
                this.classList.add('flipped');
                setTimeout(() => {
                    this.style.zIndex = i;
                }, 750); 
            }
        });
        
        book.appendChild(page);
    }
    
    setTimeout(() => {
        const btn = document.getElementById('finishBookBtn');
        if(btn) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); 
                switchScene(5);
            });
        }
    }, 1000);
}

// --- Scene 5: Heart Finale ---
function initScene5() {
    const bgCanvas = document.getElementById('starryCanvas');
    const bgCtx = bgCanvas.getContext('2d');
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
    
    const stars = [];
    for(let i=0; i<200; i++) {
        stars.push({
            x: Math.random() * bgCanvas.width,
            y: Math.random() * bgCanvas.height,
            s: Math.random() * 2 + 0.5,
            blink: Math.random() * 0.05
        });
    }
    function drawStars() {
        bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
        
        stars.forEach(star => {
            let opacity = Math.abs(Math.sin(Date.now() * star.blink));
            bgCtx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            bgCtx.beginPath();
            bgCtx.arc(star.x, star.y, star.s, 0, Math.PI*2);
            bgCtx.fill();
            star.x += 0.3;
            if(star.x > bgCanvas.width) star.x = 0;
        });
        requestAnimationFrame(drawStars);
    }
    drawStars();
    
    const container = document.getElementById('heartContainer');
    container.innerHTML = '';
    
    const count = Math.min(25, photos.length); 
    for(let i=0; i<count; i++) {
        const t = (i / count) * Math.PI * 2;
        let mx = 16 * Math.pow(Math.sin(t), 3);
        let my = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
        my = -my;
        
        let scale = Math.min(window.innerWidth, window.innerHeight) / 45;
        let finalX = window.innerWidth/2 + (mx * scale);
        let finalY = window.innerHeight/2 + (my * scale) - 40; 
        
        const div = document.createElement('div');
        div.className = 'photo-item heart-photo';
        
        const img = document.createElement('img');
        img.src = photos[i % photos.length];
        div.appendChild(img);
        container.appendChild(div);
        
        setTimeout(() => {
            div.style.left = finalX + 'px';
            div.style.top = finalY + 'px';
            div.style.transform = `translate(-50%, -50%) scale(1) rotate(${-15 + Math.random()*30}deg)`;
            div.style.opacity = 1;
        }, i * 200);
    }
    
    setTimeout(() => {
        document.getElementById('finalMessage').classList.add('show');
    }, count * 200 + 1000);
}