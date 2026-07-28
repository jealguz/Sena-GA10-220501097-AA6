/**
 * ================================================================
 * InfrTech - Logica Principal de la Aplicacion
 * Plataforma Educativa: Servidores, Virtualizacion, Contenedores & DevOps
 * ================================================================
 * Modulos:
 *   1. Dashboard - Metricas en tiempo real
 *   2. Navegacion - Scroll spy, mobile toggle
 *   3. Comparativa - Vista matriz / tarjetas expandibles
 *   4. Entorno Local - Arbol de directorios interactivo
 *   5. Pipeline CI/CD - Simulacion de despliegue
 *   6. Consola Interactiva - Comandos y logs en vivo
 *   7. Scroll Reveal - Animaciones de entrada
 *   8. Modal - Ventanas de informacion
 * ================================================================
 */

'use strict';

/* ==================== UTILIDADES ==================== */

/**
 * Retorna un numero aleatorio entre min y max (inclusive).
 */
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Retorna un valor flotante aleatorio entre min y max.
 */
function randFloat(min, max) {
  return (Math.random() * (max - min) + min).toFixed(1);
}

/**
 * Retorna timestamp formateado HH:MM:SS.
 */
function timestamp() {
  const d = new Date();
  return d.toTimeString().slice(0, 8);
}

/**
 * Agrega una linea de log al elemento indicado.
 */
function addLogLine(container, text, type = '') {
  const line = document.createElement('div');
  line.className = `log-line ${type}`.trim();
  line.textContent = `[${timestamp()}] ${text}`;
  container.appendChild(line);
  container.scrollTop = container.scrollHeight;
}


/* ==================== 1. DASHBOARD - METRICAS EN TIEMPO REAL ==================== */

const DashboardMetrics = (() => {
  // Estado interno de las metricas simuladas
  const state = {
    cpu: 0,
    ram: 0,
    network: 0,
    disk: 47,
    services: {
      apache: { running: true, port: 80 },
      mysql: { running: true, port: 3306 },
      postgres: { running: false, port: 5432 },
      nginx: { running: true, port: 80 },
      tomcat: { running: true, port: 8080 },
    },
  };

  // Elementos del DOM
  const els = {};

  /**
   * Inicializa referencias y arranca el loop de actualizacion.
   */
  function init() {
    els.cpuValue = document.getElementById('cpuValue');
    els.cpuBar = document.getElementById('cpuBar');
    els.ramValue = document.getElementById('ramValue');
    els.ramBar = document.getElementById('ramBar');
    els.networkValue = document.getElementById('networkValue');
    els.networkBar = document.getElementById('networkBar');
    els.diskValue = document.getElementById('diskValue');
    els.diskBar = document.getElementById('diskBar');

    // Valores iniciales
    state.cpu = rand(20, 45);
    state.ram = rand(35, 55);
    state.network = rand(10, 60);

    updateDisplay();
    // Actualizar cada 2 segundos
    setInterval(updateMetrics, 2000);
    // Actualizar puertos cada 5 segundos
    setInterval(updatePorts, 5000);
  }

  /**
   * Simula fluctuaciones en las metricas y actualiza la UI.
   */
  function updateMetrics() {
    // CPU fluctua con picos
    state.cpu = clamp(state.cpu + rand(-12, 12), 8, 95);

    // RAM fluctua suavemente
    state.ram = clamp(state.ram + rand(-5, 5), 25, 88);

    // Red fluctua mucho
    state.network = clamp(state.network + rand(-20, 20), 5, 120);

    // Disco crece muy lentamente
    state.disk = clamp(state.disk + (Math.random() > 0.7 ? 1 : 0), 40, 85);

    updateDisplay();
  }

  /**
   * Aplica los valores del estado al DOM.
   */
  function updateDisplay() {
    // CPU
    els.cpuValue.textContent = `${state.cpu}%`;
    els.cpuBar.style.width = `${state.cpu}%`;

    // RAM
    const ramGB = ((state.ram / 100) * 16).toFixed(1);
    els.ramValue.textContent = `${state.ram}%`;
    els.ramBar.style.width = `${state.ram}%`;
    els.ramValue.closest('.metric-card')
      .querySelectorAll('.detail-label')[0].textContent = `Usado: ${ramGB} GB`;

    // Red
    els.networkValue.textContent = `${state.network} Mbps`;
    els.networkBar.style.width = `${Math.min(state.network, 100)}%`;
    const rx = (state.network * 0.6).toFixed(1);
    const tx = (state.network * 0.4).toFixed(1);
    els.networkValue.closest('.metric-card')
      .querySelectorAll('.detail-label')[0].textContent = `Entrada: ${rx} MB/s`;
    els.networkValue.closest('.metric-card')
      .querySelectorAll('.detail-label')[1].textContent = `Salida: ${tx} MB/s`;

    // Disco
    const diskGB = Math.round((state.disk / 100) * 512);
    els.diskValue.textContent = `${state.disk}%`;
    els.diskBar.style.width = `${state.disk}%`;
    els.diskValue.closest('.metric-card')
      .querySelectorAll('.detail-label')[0].textContent = `Usado: ${diskGB} GB`;

    // Colorear barras segun umbral
    colorBar(els.cpuBar, state.cpu);
    colorBar(els.ramBar, state.ram);
    colorBar(els.diskBar, state.disk);
  }

  /**
   * Cambia el color de una barra de progreso segun el porcentaje.
   */
  function colorBar(bar, pct) {
    if (pct > 80) {
      bar.style.background = 'linear-gradient(90deg, #ef4444, #f87171)';
    } else if (pct > 60) {
      bar.style.background = 'linear-gradient(90deg, #f59e0b, #fbbf24)';
    } else {
      bar.style.background = '';
    }
  }

  /**
   * Simula cambios aleatorios en el estado de puertos.
   */
  function updatePorts() {
    const portChips = document.querySelectorAll('.port-chip');
    portChips.forEach(chip => {
      if (Math.random() > 0.92) {
        const dot = chip.querySelector('.port-status-dot');
        dot.classList.toggle('active');
        dot.classList.toggle('inactive');
      }
    });
  }

  /**
   * Limita un valor entre min y max.
   */
  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  return { init };
})();


/* ==================== 2. NAVEGACION ==================== */

const Navigation = (() => {
  const els = {};

  function init() {
    els.navbar = document.getElementById('navbar');
    els.toggle = document.getElementById('navToggle');
    els.links = document.getElementById('navLinks');
    els.navLinks = document.querySelectorAll('.nav-link');

    // Scroll del navbar
    window.addEventListener('scroll', onScroll);
    // Hamburger
    els.toggle.addEventListener('click', toggleMobile);
    // Links de navegacion
    els.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        setActive(link);
        closeMobile();
      });
    });

    onScroll();
  }

  function onScroll() {
    const scrollY = window.scrollY;
    // Efecto de sombra en scroll
    els.navbar.classList.toggle('scrolled', scrollY > 50);

    // Scroll spy: detectar seccion visible
    const sections = document.querySelectorAll('.section, .hero');
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    els.navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.dataset.section === current) {
        link.classList.add('active');
      }
    });
  }

  function setActive(activeLink) {
    els.navLinks.forEach(l => l.classList.remove('active'));
    activeLink.classList.add('active');
  }

  function toggleMobile() {
    els.toggle.classList.toggle('active');
    els.links.classList.toggle('open');
  }

  function closeMobile() {
    els.toggle.classList.remove('active');
    els.links.classList.remove('open');
  }

  return { init };
})();


/* ==================== 3. COMPARATIVA VIRTUALIZACION ==================== */

const Comparativa = (() => {
  function init() {
    // Toggle de vistas
    const btns = document.querySelectorAll('.compare-btn');
    const matriz = document.getElementById('matrizView');
    const tarjetas = document.getElementById('tarjetasView');

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (btn.dataset.view === 'matriz') {
          matriz.classList.remove('hidden');
          tarjetas.classList.add('hidden');
        } else {
          matriz.classList.add('hidden');
          tarjetas.classList.remove('hidden');
        }
      });
    });

    // Tarjetas expandibles
    document.querySelectorAll('.arch-card-header').forEach(header => {
      header.addEventListener('click', () => {
        const card = header.closest('.arch-card');
        const targetId = header.dataset.toggle;
        const body = document.getElementById(targetId);

        // Cerrar otras tarjetas
        document.querySelectorAll('.arch-card.expanded').forEach(other => {
          if (other !== card) {
            other.classList.remove('expanded');
          }
        });

        card.classList.toggle('expanded');
      });
    });

    // Animar barras de eficiencia al hacer scroll
    animateEfficiencyBars();
  }

  /**
   * Observa cuando las barras de eficiencia entran en viewport y las anima.
   */
  function animateEfficiencyBars() {
    const bars = document.querySelectorAll('.eff-bar-fill');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const width = entry.target.dataset.width;
          entry.target.style.width = `${width}%`;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    bars.forEach(bar => {
      bar.style.width = '0%';
      observer.observe(bar);
    });
  }

  return { init };
})();


/* ==================== 4. ENTORNO LOCAL - ARBOL DE DIRECTORIOS ==================== */

const FileExplorer = (() => {
  function init() {
    const tree = document.getElementById('explorerTree');
    if (!tree) return;

    // Click en items con hijos para expandir/colapsar
    tree.addEventListener('click', (e) => {
      const item = e.target.closest('.tree-item');
      if (!item) return;

      const id = item.dataset.id;
      if (!id) return;

      const children = tree.querySelector(`.tree-children[data-parent="${id}"]`);
      if (!children) return;

      const toggle = item.querySelector('.tree-toggle');
      children.classList.toggle('collapsed');
      if (toggle) toggle.classList.toggle('collapsed');
    });

    // Expandir todo al inicio
    expandAll();
  }

  function expandAll() {
    document.querySelectorAll('.tree-children').forEach(el => {
      el.style.maxHeight = el.scrollHeight + 500 + 'px';
    });
  }

  return { init };
})();


/* ==================== 5. PIPELINE CI/CD ==================== */

const Pipeline = (() => {
  const state = {
    running: false,
    currentStage: 0,
    timer: null,
  };

  const stages = [
    { name: 'Desarrollo Local', duration: 1500, logs: [
      { msg: 'Detectando cambios en el repositorio local...', type: 'info' },
      { msg: 'git add . => Archivos staged (12 archivos)', type: 'success' },
      { msg: 'git commit -m "feat: implementar modulo de autenticacion"', type: 'success' },
      { msg: 'git push origin main => Push exitoso', type: 'success' },
    ]},
    { name: 'GitHub / GitLab', duration: 1200, logs: [
      { msg: 'Recibiendo push en rama main...', type: 'info' },
      { msg: 'Webhook disparado → CI Server', type: 'info' },
      { msg: 'Pull request #47 creado y aprobado', type: 'success' },
      { msg: 'Merge en main completado', type: 'success' },
    ]},
    { name: 'CI/CD Server', duration: 1800, logs: [
      { msg: 'GitHub Actions: Workflow disparado', type: 'info' },
      { msg: 'Checkout del codigo fuente...', type: 'info' },
      { msg: 'Configurando entorno Node.js v20 LTS', type: 'info' },
      { msg: 'npm ci => Dependencias instaladas (1,247 paquetes)', type: 'success' },
    ]},
    { name: 'Build & Test', duration: 2000, logs: [
      { msg: 'Ejecutando linter (ESLint)...', type: 'info' },
      { msg: 'Linter: 0 errores, 0 warnings', type: 'success' },
      { msg: 'Ejecutando unit tests (Jest)...', type: 'info' },
      { msg: 'Tests: 142/142 pasaron (100%)', type: 'success' },
      { msg: 'Ejecutando build de produccion...', type: 'info' },
      { msg: 'Build completado: dist/ (2.4 MB)', type: 'success' },
    ]},
    { name: 'Cloud Deploy', duration: 1500, logs: [
      { msg: 'Desplegando en Netlify...', type: 'info' },
      { msg: 'Subiendo archivos de build...', type: 'info' },
      { msg: 'Despliegue completado exitosamente', type: 'success' },
      { msg: 'URL: https://mi-app-infratech.netlify.app', type: 'neon' },
      { msg: 'SSL/HTTPS habilitado automaticamente', type: 'success' },
      { msg: 'CDN global activo en 28 edge locations', type: 'success' },
    ]},
  ];

  function init() {
    const runBtn = document.getElementById('runPipeline');
    const resetBtn = document.getElementById('resetPipeline');
    const logEl = document.getElementById('pipelineLog');

    runBtn.addEventListener('click', () => {
      if (!state.running) startPipeline();
    });

    resetBtn.addEventListener('click', resetPipeline);
  }

  function startPipeline() {
    state.running = true;
    state.currentStage = 0;
    document.getElementById('runPipeline').disabled = true;

    const logEl = document.getElementById('pipelineLog');
    logEl.innerHTML = '';
    addLogLine(logEl, '=== INICIANDO PIPELINE DE DESPLIEGUE ===', 'info');
    addLogLine(logEl, `Branch: main | Commit: ${generateHash()}`, 'dim');

    processStage();
  }

  function processStage() {
    if (state.currentStage >= stages.length) {
      finishPipeline();
      return;
    }

    const stage = stages[state.currentStage];
    const stageEls = document.querySelectorAll('.pipeline-stage');
    const connectors = document.querySelectorAll('.stage-connector');

    // Activar nodo actual
    const currentNode = stageEls[state.currentStage].querySelector('.stage-node');
    currentNode.classList.add('active');

    // Activar conector anterior
    if (state.currentStage > 0) {
      connectors[state.currentStage - 1].classList.add('active');
    }

    const logEl = document.getElementById('pipelineLog');
    addLogLine(logEl, `--- Etapa ${state.currentStage + 1}: ${stage.name} ---`, 'info');

    // Simular logs de la etapa con retraso escalonado
    let delay = 0;
    stage.logs.forEach((log, i) => {
      setTimeout(() => {
        addLogLine(logEl, log.msg, log.type);
      }, delay);
      delay += stage.duration / stage.logs.length;
    });

    // Avanzar a la siguiente etapa
    setTimeout(() => {
      currentNode.classList.remove('active');
      currentNode.classList.add('completed');
      state.currentStage++;
      processStage();
    }, stage.duration + 200);
  }

  function finishPipeline() {
    state.running = false;
    document.getElementById('runPipeline').disabled = false;

    const logEl = document.getElementById('pipelineLog');
    addLogLine(logEl, '', '');
    addLogLine(logEl, '=== PIPELINE COMPLETADO EXITOSAMENTE ===', 'success');
    addLogLine(logEl, `Duracion total: ~${(stages.reduce((a, s) => a + s.duration, 0) / 1000).toFixed(1)}s`, 'dim');
  }

  function resetPipeline() {
    state.running = false;
    state.currentStage = 0;
    document.getElementById('runPipeline').disabled = false;

    document.querySelectorAll('.stage-node').forEach(n => {
      n.classList.remove('active', 'completed');
    });
    document.querySelectorAll('.stage-connector').forEach(c => {
      c.classList.remove('active');
    });
    document.getElementById('pipelineLog').innerHTML = '';
  }

  function generateHash() {
    return Math.random().toString(16).slice(2, 9);
  }

  return { init };
})();


/* ==================== 6. CONSOLA INTERACTIVA ==================== */

const Console = (() => {
  // Estado de servicios simulados
  const services = {
    apache: { running: false, port: 80, name: 'Apache HTTP Server' },
    mysql: { running: false, port: 3306, name: 'MySQL 8.0' },
    postgres: { running: false, port: 5432, name: 'PostgreSQL 15' },
    nginx: { running: false, port: 80, name: 'Nginx' },
  };

  const commandHistory = [];
  let historyIndex = -1;

  const commandHandlers = {
    help: cmdHelp,
    start: cmdStart,
    stop: cmdStop,
    status: cmdStatus,
    'docker ps': cmdDockerPs,
    'docker images': cmdDockerImages,
    'docker-compose up': cmdDockerComposeUp,
    'docker-compose down': cmdDockerComposeDown,
    clear: cmdClear,
    whoami: () => printLine('root', 'neon'),
    hostname: () => printLine('infratech-server', 'neon'),
    uname: () => printLine('Linux infratech 5.15.0 #1 SMP x86_64 GNU/Linux', 'neon'),
    date: () => printLine(new Date().toString(), 'info'),
    uptime: () => {
      const hrs = rand(1, 720);
      printLine(` ${hrs}:${rand(10, 59)}:${rand(10, 59)} up ${Math.floor(hrs / 24)} days, ${hrs % 24}h, load average: ${randFloat(0, 2)} ${randFloat(0, 2)} ${randFloat(0, 2)}`, 'info');
    },
    ls: () => {
      printLine('drwxr-xr-x  DevTools/', 'info');
      printLine('drwxr-xr-x  Projects/', 'info');
      printLine('drwxr-xr-x  Docker/', 'info');
      printLine('-rw-r--r--  docker-compose.yml', 'dim');
      printLine('-rw-r--r--  README.md', 'dim');
    },
    pwd: () => printLine('C:\\', 'neon'),
    df: () => {
      printLine('Filesystem      Size  Used  Avail  Use%  Mounted on', 'info');
      printLine('/dev/sda1       512G  241G  271G   47%  /', 'dim');
    },
    free: () => {
      printLine('              total    used    free    shared  buff/cache  available', 'info');
      printLine('Mem:          16G     7.2G    6.1G   256M    2.7G        8.5G', 'dim');
      printLine('Swap:         4.0G    0.5G    3.5G', 'dim');
    },
  };

  function init() {
    const input = document.getElementById('consoleInput');
    const sendBtn = document.getElementById('consoleSend');
    const quickBtns = document.querySelectorAll('.quick-btn');

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') processInput();
      // Historial con flechas
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          input.value = commandHistory[commandHistory.length - 1 - historyIndex];
        }
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex > 0) {
          historyIndex--;
          input.value = commandHistory[commandHistory.length - 1 - historyIndex];
        } else {
          historyIndex = -1;
          input.value = '';
        }
      }
    });

    sendBtn.addEventListener('click', processInput);

    // Botones rapidos
    quickBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        input.value = btn.dataset.cmd;
        processInput();
      });
    });
  }

  function processInput() {
    const input = document.getElementById('consoleInput');
    const raw = input.value.trim();
    if (!raw) return;

    // Guardar en historial
    commandHistory.push(raw);
    historyIndex = -1;

    // Mostrar el comando
    printLine(`root@infratech:~$ ${raw}`, '');

    // Parsear comando y argumentos
    const parts = raw.split(/\s+/);
    const cmd = parts[0];
    const arg = parts.slice(1).join(' ');

    // Buscar handler exacto o por prefijo
    if (commandHandlers[raw]) {
      commandHandlers[raw]();
    } else if (cmd === 'start' && arg) {
      cmdStart(arg);
    } else if (cmd === 'stop' && arg) {
      cmdStop(arg);
    } else {
      printLine(`Comando no encontrado: ${raw}. Escribe 'help' para ver comandos.`, 'error');
    }

    input.value = '';
  }

  function printLine(text, type = '') {
    const output = document.getElementById('consoleOutput');
    addLogLine(output, text, type);
  }

  /* ---- Comandos ---- */

  function cmdHelp() {
    const cmds = [
      ['help', 'Muestra esta ayuda'],
      ['start <servicio>', 'Inicia un servicio (apache, mysql, postgres, nginx)'],
      ['stop <servicio>', 'Detiene un servicio'],
      ['status', 'Muestra el estado de todos los servicios'],
      ['docker ps', 'Lista contenedores en ejecucion'],
      ['docker images', 'Lista imagenes Docker'],
      ['docker-compose up', 'Levanta servicios desde compose'],
      ['docker-compose down', 'Detiene servicios de compose'],
      ['ls', 'Lista directorios'],
      ['pwd', 'Directorio actual'],
      ['df', 'Uso de disco'],
      ['free', 'Uso de memoria'],
      ['uptime', 'Tiempo de actividad'],
      ['whoami', 'Usuario actual'],
      ['hostname', 'Nombre del servidor'],
      ['uname', 'Info del sistema'],
      ['date', 'Fecha y hora actual'],
      ['clear', 'Limpia la consola'],
    ];

    printLine('╔══════════════════════════════════════════════╗', 'info');
    printLine('║       COMANDOS DISPONIBLES                   ║', 'info');
    printLine('╠══════════════════════════════════════════════╣', 'info');
    cmds.forEach(([cmd, desc]) => {
      printLine(`║  ${cmd.padEnd(28)}${desc}`, 'dim');
    });
    printLine('╚══════════════════════════════════════════════╝', 'info');
  }

  function cmdStart(svcName) {
    const svc = services[svcName];
    if (!svc) {
      printLine(`Servicio '${svcName}' no encontrado. Servicios: apache, mysql, postgres, nginx`, 'error');
      return;
    }
    if (svc.running) {
      printLine(`${svc.name} ya esta en ejecucion.`, 'warning');
      return;
    }

    printLine(`Iniciando ${svc.name}...`, 'info');
    printLine(`Verificando configuracion en puerto :${svc.port}...`, 'dim');

    setTimeout(() => {
      printLine(`[OK] Puerto :${svc.port} disponible`, 'success');
    }, 400);

    setTimeout(() => {
      printLine(`[OK] Cargando modulos y dependencias...`, 'success');
    }, 900);

    setTimeout(() => {
      svc.running = true;
      printLine(`[OK] ${svc.name} iniciado correctamente (PID: ${rand(1000, 9999)})`, 'success');
      printLine(`[OK] Escuchando en 0.0.0.0:${svc.port}`, 'success');
    }, 1500);
  }

  function cmdStop(svcName) {
    const svc = services[svcName];
    if (!svc) {
      printLine(`Servicio '${svcName}' no encontrado.`, 'error');
      return;
    }
    if (!svc.running) {
      printLine(`${svc.name} no esta en ejecucion.`, 'warning');
      return;
    }

    printLine(`Deteniendo ${svc.name}...`, 'warning');
    setTimeout(() => {
      svc.running = false;
      printLine(`[OK] ${svc.name} detenido correctamente.`, 'success');
    }, 800);
  }

  function cmdStatus() {
    printLine('╔══════════════════════════════════════════════╗', 'info');
    printLine('║  ESTADO DE SERVICIOS                         ║', 'info');
    printLine('╠══════════════════════════════════════════════╣', 'info');
    Object.entries(services).forEach(([key, svc]) => {
      const status = svc.running ? '● ACTIVO ' : '○ DETENIDO';
      const type = svc.running ? 'success' : 'error';
      printLine(`║  ${svc.name.padEnd(24)} :${svc.port}  ${status}`, type);
    });
    printLine('╚══════════════════════════════════════════════╝', 'info');
  }

  function cmdDockerPs() {
    const running = Object.entries(services).filter(([, s]) => s.running);
    if (running.length === 0) {
      printLine('No hay contenedores en ejecucion.', 'warning');
      printLine('Usa "docker-compose up" para iniciar servicios.', 'dim');
      return;
    }

    printLine('CONTAINER ID  IMAGE              STATUS          PORTS', 'info');
    printLine('─────────────────────────────────────────────────────────', 'dim');
    running.forEach(([key, svc]) => {
      const id = Math.random().toString(16).slice(2, 14);
      printLine(`${id}  ${key}:latest   Up ${rand(1, 48)}h         0.0.0.0:${svc.port}->${svc.port}/tcp`, 'success');
    });
  }

  function cmdDockerImages() {
    printLine('REPOSITORY       TAG       SIZE', 'info');
    printLine('─────────────────────────────────', 'dim');
    printLine('nginx            latest    187MB', 'dim');
    printLine('mysql            8.0       585MB', 'dim');
    printLine('postgres         15        379MB', 'dim');
    printLine('tomcat           10.1      312MB', 'dim');
    printLine('node             20-slim   214MB', 'dim');
  }

  function cmdDockerComposeUp() {
    printLine('Creating network "app_default" with the default driver', 'info');
    setTimeout(() => {
      printLine('Creating volume "app_mysql_data" with default driver', 'info');
    }, 300);

    const svcNames = ['mysql', 'postgres', 'nginx', 'tomcat'];
    svcNames.forEach((name, i) => {
      setTimeout(() => {
        printLine(`Creating app_${name}_1 ... done`, 'success');
        services[name].running = true;
      }, 600 + i * 400);
    });

    setTimeout(() => {
      printLine('', '');
      printLine('[+] Running 4/4', 'success');
      printLine('Container app_mysql_1    Started', 'success');
      printLine('Container app_postgres_1 Started', 'success');
      printLine('Container app_nginx_1    Started', 'success');
      printLine('Container app_tomcat_1   Started', 'success');
    }, 2500);
  }

  function cmdDockerComposeDown() {
    printLine('Stopping services...', 'warning');
    const svcNames = ['tomcat', 'nginx', 'postgres', 'mysql'];
    svcNames.forEach((name, i) => {
      setTimeout(() => {
        printLine(`Stopping app_${name}_1 ... done`, 'success');
        services[name].running = false;
      }, 400 + i * 300);
    });

    setTimeout(() => {
      printLine('[+] Stopped 4 services', 'success');
    }, 1800);
  }

  function cmdClear() {
    document.getElementById('consoleOutput').innerHTML = '';
  }

  return { init };
})();


/* ==================== 7. SCROLL REVEAL ==================== */

const ScrollReveal = (() => {
  function init() {
    // Elementos a animar
    const targets = document.querySelectorAll(
      '.section-header, .metric-card, .arch-card, .pipeline-stage, ' +
      '.compare-matrix, .compare-cards, .efficiency-section, ' +
      '.local-env-container, .console-container, .pipeline-controls'
    );

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal', 'visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(el => {
      el.classList.add('reveal');
      observer.observe(el);
    });
  }

  return { init };
})();


/* ==================== 8. MODAL ==================== */

const Modal = (() => {
  function init() {
    const overlay = document.getElementById('modalOverlay');
    const closeBtn = document.getElementById('modalClose');

    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
  }

  function open(html) {
    const overlay = document.getElementById('modalOverlay');
    const content = document.getElementById('modalContent');
    content.innerHTML = html;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    const overlay = document.getElementById('modalOverlay');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  return { init, open, close };
})();


/* ==================== INICIALIZACION ==================== */

document.addEventListener('DOMContentLoaded', () => {
  Navigation.init();
  DashboardMetrics.init();
  Comparativa.init();
  FileExplorer.init();
  Pipeline.init();
  Console.init();
  ScrollReveal.init();
  Modal.init();
});
