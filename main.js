// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  });
});

// Main initialization 
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded, initializing page');
  
  // --- Theme handling (optional) ---------------------------------
  const availableThemes = ['indigo', 'charcoal', 'emerald'];
  const hashTheme = window.location.hash.replace('#', '').toLowerCase();
  const storedTheme = localStorage.getItem('preferredTheme');
  const themeToApply = availableThemes.includes(hashTheme)
    ? hashTheme
    : availableThemes.includes(storedTheme)
      ? storedTheme
      : null;

  if (themeToApply) {
    document.documentElement.setAttribute('data-theme', themeToApply);
  }
  // ----------------------------------------------------------------

  // Initialize background animation (after theme set)
  initAsciiDotsBackground();
  
  // Animate hero title - REMOVED
  const heroTitle = document.querySelector('.hero-title');

  // Initialize terminal animation
  initTerminal();
  
  // Initialize expandable team member cards
  initTeamMemberCards();

  // Wave animation disabled for team section

  // Subtle parallax on hero title following cursor - REMOVED
});

// Terminal animation initialization (simplified to match static image)
function initTerminal() {
  const terminal = document.getElementById('terminal');
  const typedCommand = document.getElementById('typed-command');
  const outputContainer = document.getElementById('terminal-output-container');
  const copyCommand = document.getElementById('copy-command');
  const commandText = 'pip install glossapi';

  const pipMessages = [
    { text: 'Collecting glossapi...', type: 'info', delay: 150 },
    { text: 'Downloading glossapi-1.2.4-py3-none-any.whl (58 kB)', type: 'muted', delay: 200 },
    { text: 'Installing collected packages: glossapi', type: 'info', delay: 1200 },
    { text: 'Successfully installed glossapi-1.2.4', type: 'success', delay: 300 },
  ];

  function addOutputLine(text, type = 'normal') {
    const line = document.createElement('div');
    line.className = `terminal-output-line ${type}`;
    line.textContent = text;
    outputContainer.appendChild(line);
    const terminalContent = document.querySelector('.terminal-content');
    terminalContent.scrollTop = terminalContent.scrollHeight;
  }

  function animateProgressBar() {
    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');
    const progressPercentage = document.getElementById('progress-percentage');
    const progressStats = document.getElementById('progress-stats');
    const progressSpeed = document.getElementById('progress-speed');
    
    if (!progressContainer || !progressBar || !progressPercentage || !progressStats || !progressSpeed) return;

    progressContainer.style.display = 'block';
    
    const totalSize = 58.4;
    let currentSize = 0;
    let progress = 0;
    
    const getRandomSpeed = () => (2.8 + Math.random() * 1.2).toFixed(1);

    const progressInterval = setInterval(() => {
      let increment = (progress < 80) ? Math.random() * 8 + 2 : Math.random() * 1.5 + 0.5;
      progress += increment;
      currentSize = (progress / 100) * totalSize;

      if (progress >= 100) {
        progress = 100;
        currentSize = totalSize;
        clearInterval(progressInterval);
        
        setTimeout(() => {
          progressContainer.style.display = 'none';
          // Continue with the rest of the pip messages after the progress bar
          showRemainingPipMessages();
        }, 400);
      }
      
      progressBar.style.width = `${progress}%`;
      progressPercentage.textContent = `${Math.round(progress)}%`;
      progressStats.textContent = `${currentSize.toFixed(1)}/${totalSize} kB`;
      progressSpeed.textContent = `${getRandomSpeed()} MB/s`;
      
    }, 80);
  }

  function showRemainingPipMessages() {
    let delay = 0;
    // Start from the message after the download (index 2)
    pipMessages.slice(2).forEach(message => {
      setTimeout(() => {
        addOutputLine(message.text, message.type);
      }, delay);
      delay += message.delay;
    });
  }

  function typeWriter(text, element, i = 0) {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      setTimeout(() => typeWriter(text, element, i + 1), 60 + Math.random() * 40);
    } else {
      // Typing finished, start showing output
      setTimeout(startPipInstallation, 500);
    }
  }
  
  function startPipInstallation() {
    // Show first two messages
    addOutputLine(pipMessages[0].text, pipMessages[0].type);
    setTimeout(() => {
      addOutputLine(pipMessages[1].text, pipMessages[1].type);
      // Start progress bar after showing download message
      setTimeout(animateProgressBar, 200);
    }, pipMessages[0].delay);
  }

  if (terminal && typedCommand) {
    setTimeout(() => {
      terminal.classList.add('show');
      outputContainer.innerHTML = '';
      typedCommand.innerHTML = '';

      const cursor = document.createElement('span');
      cursor.className = 'cursor';
      typedCommand.parentNode.insertBefore(cursor, typedCommand.nextSibling);

      setTimeout(() => {
        typeWriter(commandText, typedCommand);
      }, 800);
    }, 500);
  }

  if (copyCommand) {
    copyCommand.addEventListener('click', () => {
      navigator.clipboard.writeText(commandText).then(() => {
        copyCommand.classList.add('copy-success');
        setTimeout(() => copyCommand.classList.remove('copy-success'), 1500);
      }).catch(err => {
        console.error('Failed to copy command:', err);
        copyCommand.classList.add('copy-failed');
        setTimeout(() => copyCommand.classList.remove('copy-failed'), 1500);
      });
    });
  }
}

// Handle expandable team member card functionality
function initTeamMemberCards() {
  const teamMembers = document.querySelectorAll('.team-member');
  
  teamMembers.forEach(member => {
    // Add click event to toggle expanded state
    member.addEventListener('click', function(event) {
      // Don't toggle if clicking on the CV link
      if (event.target.classList.contains('team-member-cv')) {
        event.stopPropagation();
        return;
      }
      
      // If this member is already active, collapse it
      if (this.classList.contains('active')) {
        this.classList.remove('active');
      } else {
        // First collapse any currently expanded member
        const currentActive = document.querySelector('.team-member.active');
        if (currentActive) {
          currentActive.classList.remove('active');
        }
        
        // Then expand this member
        this.classList.add('active');
        
        // Smooth scroll to ensure expanded card is visible
        const rect = this.getBoundingClientRect();
        const isPartiallyVisible = (
          rect.top < window.innerHeight &&
          rect.bottom > 0
        );
        
        // If card is partially out of view, scroll to it
        if (!isPartiallyVisible || rect.top < 50) {
          this.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
    
    // Add keyboard accessibility
    member.setAttribute('tabindex', '0');
    member.setAttribute('role', 'button');
    member.setAttribute('aria-expanded', 'false');
    
    member.addEventListener('keydown', function(event) {
      // Expand/collapse on Enter or Space key
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.click();
        this.setAttribute('aria-expanded', this.classList.contains('active').toString());
      }
    });
  });
  
  console.log('Team member expandable cards initialized');
}

// ==============================
// New ASCII Dots Background
// ==============================

function initAsciiDotsBackground() {
  const GRID_SIZE = 80; // finer grid for pronounced fill
  const CHARS = '⠁⠂⠄⠈⠐⠠⡀⢀⠃⠅⠘⠨⠊⠋⠌⠍⠎⠏';

  const container = document.getElementById('background-animation');
  if (!container) {
    console.error('background-animation container not found');
    return;
  }

  // Show background first – hide main content initially
  const app = document.querySelector('.app');
  if (app) {
    app.style.opacity = '0';
  }

  // Initial blur 0 then animate to 12px over time
  container.style.filter = 'blur(0px)';

  // Canvas setup
  const canvas = document.createElement('canvas');
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.zIndex = '1';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.width = container.offsetWidth;
  canvas.height = container.offsetHeight;
  const ctx = canvas.getContext('2d');
  ctx.font = '10px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Determine primary colour from CSS variable
  const rootStyles = getComputedStyle(document.documentElement);
  const primaryHex = rootStyles.getPropertyValue('--primary').trim() || '#F97316';

  // Helper to convert hex->rgb
  const hexToRgb = (hex) => {
    const cleaned = hex.replace('#', '');
    const bigint = parseInt(cleaned, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  };
  const primaryRGB = hexToRgb(primaryHex);

  container.appendChild(canvas);

  // Resize handler
  const handleResize = () => {
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
  };
  window.addEventListener('resize', handleResize);

  // Wave sources
  const waves = [];
  const numWaves = 3;
  for (let i = 0; i < numWaves; i++) {
    waves.push({
      x: GRID_SIZE * (0.25 + Math.random() * 0.5),
      y: GRID_SIZE * (0.25 + Math.random() * 0.5),
      frequency: 0.2 + Math.random() * 0.3,
      amplitude: 0.5 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 0.5,
    });
  }

  const mouse = { x: 0, y: 0 };
  let time = 0;

  const handleMouseMove = (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouse.x = x * 2 - 1;
    mouse.y = y * 2 - 1;
  };
  canvas.addEventListener('mousemove', handleMouseMove);

  const update = (delta) => {
    time += delta * 0.75;

    const newGrid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));

    const mouseX = (mouse.x + 1) * GRID_SIZE / 2;
    const mouseY = (1 - mouse.y) * GRID_SIZE / 2;

    const mouseWave = {
      x: mouseX,
      y: mouseY,
      frequency: 0.3,
      amplitude: 1,
      phase: time * 2,
      speed: 1,
    };

    for (let gy = 0; gy < GRID_SIZE; gy++) {
      for (let gx = 0; gx < GRID_SIZE; gx++) {
        let total = 0;
        [...waves, mouseWave].forEach((wave) => {
          const dx = gx - wave.x;
          const dy = gy - wave.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const falloff = 1 / (1 + dist * 0.1);
          const value = Math.sin(dist * wave.frequency - time * wave.speed + wave.phase) * wave.amplitude * falloff;
          total += value;
        });

        const normalized = (total + 2) / 4; // -2..2 -> 0..1
        if (Math.abs(total) > 0.05) {
          const index = Math.min(CHARS.length - 1, Math.max(0, Math.floor(normalized * (CHARS.length - 1))));
          const opacity = Math.min(0.9, Math.max(0.4, 0.4 + normalized * 0.5));
          newGrid[gy][gx] = { char: CHARS[index], opacity };
        }
      }
    }

    // Clear background
    const bgHex = rootStyles.getPropertyValue('--background').trim() || '#FFFFFF';
    ctx.fillStyle = bgHex;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cellW = canvas.width / GRID_SIZE;
    const cellH = canvas.height / GRID_SIZE;

    for (let gy = 0; gy < GRID_SIZE; gy++) {
      for (let gx = 0; gx < GRID_SIZE; gx++) {
        const cell = newGrid[gy][gx];
        if (cell) {
          ctx.fillStyle = `rgba(${primaryRGB.r}, ${primaryRGB.g}, ${primaryRGB.b}, ${cell.opacity})`;
          ctx.fillText(cell.char, gx * cellW + cellW / 2, gy * cellH + cellH / 2);
        }
      }
    }
  };

  let last = 0;
  const animate = (t) => {
    const delta = Math.min((t - last) / 1000, 0.1);
    last = t;
    update(delta);
    requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);

  // Reveal main content & add blur after delay
  setTimeout(() => {
    if (app) {
      app.style.transition = 'opacity 1.8s ease';
      app.style.opacity = '1';
    }
    // Keep ASCII background sharp; light blur can be applied if desired
    // container.style.transition = 'filter 3s ease';
    // container.style.filter = 'blur(2px)';
  }, 1500);

  // Cleanup on unload (optional)
  window.addEventListener('beforeunload', () => {
    window.removeEventListener('resize', handleResize);
    canvas.removeEventListener('mousemove', handleMouseMove);
  });
}

// ==============================
// Indigo Phase-Distortion Waves for .team-member
// ==============================

function initTeamMemberWaves() {
  const members = document.querySelectorAll('.team-member');
  if (!members.length) return;

  // Fetch theme colours once
  const rootStyles = getComputedStyle(document.documentElement);
  const primaryHex = rootStyles.getPropertyValue('--primary').trim() || '#4636D6';
  const primaryRGB = hexToRgb(primaryHex);

  members.forEach(member => {
    let animationFrameId = null;
    let t = 0;

    const canvas = document.createElement('canvas');
    canvas.className = 'team-wave-canvas';
    Object.assign(canvas.style, {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 0,
      pointerEvents: 'none',
      opacity: 0,
      transition: 'opacity 0.5s ease'
    });
    member.style.position = 'relative';
    member.insertBefore(canvas, member.firstChild);
    
    const ctx = canvas.getContext('2d');

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    window.addEventListener('resize', resize);
    resize();

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const waveCount = 8; // Reduced for performance
      ctx.lineCap = 'round';

      // Horizontal waves
      ctx.strokeStyle = `rgba(${primaryRGB.r}, ${primaryRGB.g}, ${primaryRGB.b}, 0.3)`;
      ctx.lineWidth = 1.5;
      for (let i = 0; i < waveCount; i++) {
        const yCenter = (h / (waveCount + 1)) * (i + 1);
        const amplitude = (h * 0.04) + Math.sin(t * 0.025 + i) * (h * 0.015);
        const frequency = 0.02 + i * 0.002;
        const phase = i * 0.4;
        ctx.beginPath();
        for (let x = 0; x < w; x++) {
          const distortion = Math.sin(x * 0.02 + t * 0.05) * 1.5 + Math.cos(x * 0.01 - t * 0.03) * 2;
          const y = yCenter + amplitude * Math.sin(x * frequency + t + phase + distortion);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      
      t += 0.025;
      animationFrameId = requestAnimationFrame(render);
    };

    member.addEventListener('mouseenter', () => {
      if (!animationFrameId) {
        canvas.style.opacity = '1';
        render();
      }
    });

    member.addEventListener('mouseleave', () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
        canvas.style.opacity = '0';
      }
    });
  });
}

// ---------- Utility ----------
function hexToRgb(hex) {
  const cleaned = hex.replace('#', '');
  const bigint = parseInt(cleaned, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

