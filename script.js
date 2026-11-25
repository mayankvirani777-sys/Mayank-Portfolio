(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];

  // Intro loader: quick, decorative and never blocks the page for long.
  const loader = $('#loader'), bar = $('#loaderBar'), percent = $('#loaderPercent');
  let load = 0;
  const loaderTimer = setInterval(() => {
    load = Math.min(100, load + Math.ceil(Math.random()*13));
    bar.style.width = load + '%'; percent.textContent = String(load).padStart(2,'0') + '%';
    if (load >= 100) { clearInterval(loaderTimer); setTimeout(() => loader.classList.add('done'), 220); }
  }, 75);
  window.addEventListener('load', () => { load=100; bar.style.width='100%'; percent.textContent='100%'; setTimeout(()=>loader.classList.add('done'),250); });

  // Navigation and motion preference.
  const menu = $('#menuToggle'), nav = $('#navLinks');
  menu.addEventListener('click', () => { const open=nav.classList.toggle('open'); menu.setAttribute('aria-expanded',String(open)); });
  $$('#navLinks a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}));
  $('#motionToggle').addEventListener('click', e => { document.body.classList.toggle('reduce-motion'); e.currentTarget.textContent=document.body.classList.contains('reduce-motion')?'○':'✦'; });

  // Scroll progress and reveal transitions.
  const progress=$('#scrollProgress');
  const updateScroll=()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?scrollY/max*100:0)+'%';};
  addEventListener('scroll',updateScroll,{passive:true}); updateScroll();
  if ('IntersectionObserver' in window) {
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.12});
    $$('.reveal').forEach(el=>observer.observe(el));
  } else $$('.reveal').forEach(el=>el.classList.add('visible'));

  // Typed role label.
  const roles=['ARTIFICIAL INTELLIGENCE','WEB DEVELOPMENT','MACHINE LEARNING','CREATIVE TECHNOLOGY'];
  let roleIndex=0, charIndex=0, deleting=false;
  function typeRole(){
    if(document.body.classList.contains('reduce-motion')) { $('#typedRole').textContent=roles[0]; return; }
    const word=roles[roleIndex]; charIndex += deleting ? -1 : 1;
    $('#typedRole').textContent=word.slice(0,charIndex);
    let delay=deleting?38:75;
    if(!deleting && charIndex===word.length){deleting=true;delay=1250;}
    else if(deleting && charIndex===0){deleting=false;roleIndex=(roleIndex+1)%roles.length;delay=350;}
    setTimeout(typeRole,delay);
  }
  setTimeout(typeRole,500);

  // Canvas starfield with pointer parallax.
  const canvas=$('#starfield'), ctx=canvas.getContext('2d');
  let stars=[], pointer={x:0,y:0};
  function resizeCanvas(){
    const dpr=Math.min(devicePixelRatio||1,2);canvas.width=innerWidth*dpr;canvas.height=innerHeight*dpr;
    canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';ctx.setTransform(dpr,0,0,dpr,0,0);
    stars=Array.from({length:Math.min(115,Math.floor(innerWidth/9))},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.35+.25,a:Math.random()*.55+.15,s:Math.random()*.18+.035}));
  }
  function drawStars(){
    ctx.clearRect(0,0,innerWidth,innerHeight);
    for(const p of stars){p.y-=p.s;if(p.y<0)p.y=innerHeight;const x=p.x+pointer.x*p.a*.018;ctx.beginPath();ctx.arc(x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(174,190,255,${p.a})`;ctx.fill();}
    if(!document.body.classList.contains('reduce-motion')) requestAnimationFrame(drawStars);
  }
  addEventListener('resize',resizeCanvas);addEventListener('pointermove',e=>{pointer.x=e.clientX-innerWidth/2;pointer.y=e.clientY-innerHeight/2;},{passive:true});
  resizeCanvas();drawStars();

  // Mouse tilt on the hero orb.
  const core=$('#coreWrap'), stage=$('.hero-stage');
  if(matchMedia('(pointer:fine)').matches) stage.addEventListener('pointermove',e=>{
    if(document.body.classList.contains('reduce-motion'))return;
    const r=stage.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    core.style.transform=`rotateY(${x*18}deg) rotateX(${-y*18}deg)`;
  });
  stage.addEventListener('pointerleave',()=>core.style.transform='');

  // Skill constellation content.
  const skillContent={
    overview:{eyebrow:'SELECT A CONSTELLATION',title:'Growing through practice.',body:'My toolkit is a work in progress. Each skill grows through coursework, experiments, and projects.',tags:['C','Python','HTML','CSS','JavaScript','Arduino','Git & GitHub']},
    programming:{eyebrow:'NODE 01 / PROGRAMMING',title:'Logic into solutions.',body:'Practicing programming fundamentals, problem solving, and structured thinking through small exercises and projects.',tags:['C Programming','Python','Problem Solving']},
    web:{eyebrow:'NODE 02 / WEB',title:'Interfaces with intent.',body:'Building responsive interfaces and experimenting with interactions, animation, layout, and browser-based experiences.',tags:['HTML','CSS','JavaScript','Responsive UI']},
    ai:{eyebrow:'NODE 03 / AI & ML',title:'Exploring intelligent systems.',body:'Learning AI and machine-learning foundations, reinforcement learning concepts, and goal-driven agent systems.',tags:['AI Fundamentals','ML Fundamentals','Reinforcement Learning','AI Agents']},
    hardware:{eyebrow:'NODE 04 / HARDWARE',title:'Code meets the physical world.',body:'Experimenting with microcontrollers, sensors, and connected-device concepts through hands-on prototypes.',tags:['Arduino','Tinkercad','Sensors','IoT']}
  };
  $$('.skill-node').forEach(btn=>btn.addEventListener('click',()=>{
    $$('.skill-node').forEach(n=>n.classList.remove('active'));btn.classList.add('active');
    const d=skillContent[btn.dataset.skill];
    $('#skillDetail').innerHTML=`<p class="mono accent">${d.eyebrow}</p><h3>${d.title}</h3><p>${d.body}</p><div class="skill-tags">${d.tags.map(t=>`<span>${t}</span>`).join('')}</div>`;
  }));

  // Project filters.
  $$('.filter').forEach(btn=>btn.addEventListener('click',()=>{
    $$('.filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
    const filter=btn.dataset.filter;
    $$('.project-card').forEach(card=>card.classList.toggle('hidden',filter!=='all'&&card.dataset.category!==filter));
  }));

  // Terminal: safe allow-list, textContent output (no arbitrary HTML execution).
  const terminalOut=$('#terminalOutput'), terminalInput=$('#terminalCommand');
  const terminalCommands={
    help:'Available commands: about, certificates, skills, projects, education, contact, socials, clear, date',
    about:'Mayank Virani — Computer Science Engineering student exploring AI/ML, web development, and practical technology projects.',
    skills:'Programming: C, Python. Web: HTML, CSS, JavaScript. AI/ML: foundations and concepts. Hardware: Arduino, Tinkercad. Tools: Git & GitHub.',
    projects:'Smart Irrigation System · Sci-Fi Animated Login · Gesture Detector project exposure · Reinforcement Learning exploration · AI Agents exploration.',
    education:'B.Tech in Computer Science Engineering — Unitedworld Institute of Technology, Karnavati University. First-year student.',
    certificates:'4 certificates: Power BI Workshop (GDG On Campus), Badminton National Championship 2024, Academics Top Performer 2023, Best Harmonium Player 2022.',
    contact:'Email: mayankvirani777@gmail.com | LinkedIn: linkedin.com/in/mayank-virani-6b8809317',
    socials:'LinkedIn: linkedin.com/in/mayank-virani-6b8809317 | Instagram: @mayank_virani_777',
    date:()=>new Date().toLocaleDateString()
  };
  function addTerminalLine(text,cls=''){const p=document.createElement('p');p.textContent=text;if(cls)p.className=cls;terminalOut.appendChild(p);terminalOut.scrollTop=terminalOut.scrollHeight;}
  $('#terminalForm').addEventListener('submit',e=>{
    e.preventDefault();const cmd=terminalInput.value.trim().toLowerCase();if(!cmd)return;
    addTerminalLine('mayank@mv:~$ '+cmd,'command-line');terminalInput.value='';
    if(cmd==='clear'){terminalOut.replaceChildren();return;}
    const result=terminalCommands[cmd];addTerminalLine(typeof result==='function'?result():result||`Command not found: ${cmd}. Type "help" for available commands.`);
  });
  $('#clearTerminal').addEventListener('click',()=>terminalOut.replaceChildren());

  // MK AI: scripted portfolio FAQ. No external API or data transmission.
  const aiPanel=$('#aiPanel'), aiMessages=$('#aiMessages');
  const openAI=()=>{aiPanel.classList.add('open');aiPanel.setAttribute('aria-hidden','false');$('#aiQuestion').focus();};
  const closeAI=()=>{aiPanel.classList.remove('open');aiPanel.setAttribute('aria-hidden','true');};
  $('#aiLauncher').addEventListener('click',()=>aiPanel.classList.contains('open')?closeAI():openAI());
  $('#aiClose').addEventListener('click',closeAI);
  function addChat(text,who){const div=document.createElement('div');div.className='ai-message '+who;div.textContent=text;aiMessages.appendChild(div);aiMessages.scrollTop=aiMessages.scrollHeight;}
  function mkReply(question){
    const q=question.toLowerCase();
    if(/hello|hi\b|hey/.test(q))return 'Hello! I can introduce Mayank, explain his projects and skills, or help you find his contact details.';
    if(/about|who|mayank/.test(q))return 'Mayank Virani is a Computer Science Engineering student at UIT, Karnavati University. He is exploring AI, machine learning, web development, and hands-on technology projects.';
    if(/project|work|built/.test(q))return 'His portfolio features a Smart Irrigation System concept, a Sci-Fi Animated Login webpage, experience with a Gesture Detectors in Vehicles project, and explorations in Reinforcement Learning and AI Agents.';
    if(/skill|technology|tech|program/.test(q))return 'He is learning C, Python, HTML, CSS, JavaScript, AI/ML fundamentals, Arduino, Tinkercad, and Git/GitHub. His toolkit is still growing.';
    if(/education|college|university|study/.test(q))return 'He is pursuing a B.Tech in Computer Science Engineering at Unitedworld Institute of Technology, Karnavati University.';
    if(/contact|email|reach|linkedin/.test(q))return 'You can reach Mayank at mayankvirani777@gmail.com or connect on LinkedIn: linkedin.com/in/mayank-virani-6b8809317.';
    if(/certificate|award|achievement|badminton|harmonium/.test(q))return 'Mayank has certificates for a Power BI workshop, Badminton National Championship participation (2024), Academics Top Performer (2023) and Best Harmonium Player (2022). See the Credential Archive section.';
    if(/resume|cv/.test(q))return 'Use the Download resume button near the top of the page to get the PDF resume.';
    return 'I can help with Mayank’s background, education, skills, projects, resume, and contact details. Try asking: “What projects has Mayank explored?”';
  }
  $('#aiForm').addEventListener('submit',e=>{
    e.preventDefault();const input=$('#aiQuestion'),q=input.value.trim();if(!q)return;
    addChat(q,'user');input.value='';setTimeout(()=>addChat(mkReply(q),'bot'),220);
  });
  $$('.ai-suggestions button').forEach(b=>b.addEventListener('click',()=>{const q=b.dataset.prompt;addChat(q,'user');setTimeout(()=>addChat(mkReply(q),'bot'),180);}));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAI();});

  // Contact form prepares an email; it does not claim to send it.
  $('#contactForm').addEventListener('submit',e=>{
    e.preventDefault();const data=new FormData(e.currentTarget);
    const subject=encodeURIComponent('Portfolio enquiry from '+data.get('name'));
    const body=encodeURIComponent(`Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`);
    $('#formNote').textContent='Opening your email application…';
    window.location.href=`mailto:mayankvirani777@gmail.com?subject=${subject}&body=${body}`;
  });
  // Luxury theme switcher.
  const themes=['luxury','midnight','minimal'];let themeIndex=0;
  $('#themeToggle').addEventListener('click',()=>{themeIndex=(themeIndex+1)%themes.length;document.body.dataset.theme=themes[themeIndex];$('#themeToggle').innerHTML='◐ <span>'+themes[themeIndex].toUpperCase()+'</span>';});

  // Optional synthesized interface sound; audio starts only after an explicit opt-in.
  let soundEnabled=false,audioCtx=null;
  function uiTone(freq=520){if(!soundEnabled)return;try{audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.type='sine';osc.frequency.value=freq;gain.gain.setValueAtTime(.035,audioCtx.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+.11);osc.connect(gain);gain.connect(audioCtx.destination);osc.start();osc.stop(audioCtx.currentTime+.12);}catch(e){}}
  $('#soundToggle').addEventListener('click',()=>{soundEnabled=!soundEnabled;$('#soundToggle').innerHTML='♫ <span>SOUND '+(soundEnabled?'ON':'OFF')+'</span>';if(soundEnabled)uiTone(660);});
  document.addEventListener('click',e=>{if(e.target.closest('button,a'))uiTone(460);});

  // Desktop magnetic cursor with gentle attraction to interactive elements.
  const cursor=document.createElement('div');cursor.className='magnetic-cursor';document.body.appendChild(cursor);
  if(matchMedia('(pointer:fine)').matches){let mx=0,my=0;addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;cursor.style.left=mx+'px';cursor.style.top=my+'px';cursor.classList.add('active');const target=e.target.closest('a,button');if(target){const r=target.getBoundingClientRect();const dx=(mx-(r.left+r.width/2))*.08,dy=(my-(r.top+r.height/2))*.08;if(target.classList.contains('magnetic'))target.style.transform=`translate(${dx}px,${dy}px)`;}else $$('.magnetic').forEach(el=>el.style.transform='');},{passive:true});document.addEventListener('pointerleave',()=>cursor.classList.remove('active'));}

  // Rotating case-study disclosures.
  $$('.case-toggle').forEach(btn=>btn.addEventListener('click',()=>{const detail=btn.nextElementSibling,open=btn.getAttribute('aria-expanded')!=='true';btn.setAttribute('aria-expanded',String(open));detail.hidden=!open;btn.querySelector('span').textContent=open?'－':'＋';}));


  // ===== Orbit lab =====
  const worlds=[
    {id:'code',ring:1,label:'CODE',icon:'⌘',angle:20,eyebrow:'PLANET 01 / CODE',title:'Where logic becomes things.',body:'C and Python for fundamentals, problem solving and structured thinking, practiced through small programs and projects.',tags:['C','Python','Problem Solving','Git & GitHub'],energy:78},
    {id:'ai',ring:1,label:'AI / ML',icon:'✳',angle:200,eyebrow:'PLANET 02 / INTELLIGENCE',title:'Teaching machines to decide.',body:'Exploring reinforcement learning, agents that perceive, plan and act, and the basics of machine learning.',tags:['Reinforcement Learning','AI Agents','ML Basics'],energy:70},
    {id:'web',ring:2,label:'WEB',icon:'⌁',angle:70,eyebrow:'PLANET 03 / WEB',title:'Interfaces with intent.',body:'Responsive, animated experiences in HTML, CSS and JavaScript, like the Sci-Fi login and this very portfolio.',tags:['HTML','CSS','JavaScript'],energy:74},
    {id:'build',ring:2,label:'BUILD',icon:'▣',angle:250,eyebrow:'PLANET 04 / BUILD',title:'Prototypes in the physical world.',body:'Arduino and sensor experiments: a smart irrigation concept and exposure to a gesture-detector project for vehicles.',tags:['Arduino','Sensors','IoT'],energy:62},
    {id:'sport',ring:3,label:'SPORT',icon:'🏸',angle:120,eyebrow:'PLANET 05 / SPORT',title:'Discipline on the court.',body:'Participated in the Badminton National Championship, held 15–18 January 2024 at Indira Gandhi Indoor Stadium, New Delhi.',tags:['Badminton','National Level','Sportsmanship'],energy:88,cert:'sport'},
    {id:'music',ring:3,label:'MUSIC',icon:'♪',angle:235,eyebrow:'PLANET 06 / MUSIC',title:'Rhythm outside the screen.',body:'Recognised as Best Harmonium Player by Swaranjali Cultural Society (June 2022) for a mesmerizing performance.',tags:['Harmonium','Performance','Swaranjali'],energy:84,cert:'music'},
    {id:'learn',ring:3,label:'LEARN',icon:'✦',angle:340,eyebrow:'PLANET 07 / LEARNING',title:'Top performer, still a student.',body:'Academics Top Performer at Shree Swaminarayan Gurukul (2023), and hands-on Power BI workshop on data analytics and dashboards.',tags:['Academics','Power BI','Data Viz'],energy:90,cert:'academic'}
  ];
  const ostage=$('#orbitStage'),ocore=$('#orbitCore'),line=$('#orbitLine');
  const radii={1:.27,2:.40,3:.5},speeds={1:.018,2:-.012,3:.008};
  worlds.forEach(w=>{const b=document.createElement('button');b.className='world r'+w.ring;b.dataset.id=w.id;b.innerHTML=`<span>${w.icon}</span><small>${w.label}</small>`;b.setAttribute('aria-label',w.label);ostage.appendChild(b);w.el=b;});
  let activeWorld=null,paused=false,lastT=performance.now();
  function place(){const r=ostage.getBoundingClientRect(),s=Math.min(r.width,r.height);
    worlds.forEach(w=>{const rad=radii[w.ring]*s*.94,a=w.angle*Math.PI/180;w.x=r.width/2+Math.cos(a)*rad*1.0;w.y=r.height/2+Math.sin(a)*rad*.62*1.0;
      w.el.style.left=w.x+'px';w.el.style.top=w.y+'px';w.el.style.zIndex=Math.sin(a)>0?4:2;w.el.style.setProperty('--depth',(.82+.18*(Math.sin(a)+1)/2).toFixed(2));});
    if(activeWorld){line.setAttribute('x2',activeWorld.x);line.setAttribute('y2',activeWorld.y);line.setAttribute('x1',r.width/2);line.setAttribute('y1',r.height/2);}}
  function tick(t){const dt=Math.min(50,t-lastT);lastT=t;
    if(!paused&&!document.body.classList.contains('reduce-motion'))worlds.forEach(w=>w.angle=(w.angle+speeds[w.ring]*dt)%360);
    place();requestAnimationFrame(tick);}
  ostage.addEventListener('pointerenter',()=>paused=true);ostage.addEventListener('pointerleave',()=>paused=false);
  const dots=$('#opDots');dots.innerHTML=worlds.map(w=>`<i data-id="${w.id}" title="${w.label}"></i>`).join('');
  function selectWorld(w){activeWorld=w;worlds.forEach(x=>x.el.classList.toggle('active',x===w));
    $$('#opDots i').forEach(d=>d.classList.toggle('on',d.dataset.id===w.id));
    ostage.classList.add('linked');$('#opEyebrow').textContent=w.eyebrow;$('#opTitle').textContent=w.title;$('#opBody').textContent=w.body;
    $('#opTags').innerHTML=w.tags.map(t=>`<span>${t}</span>`).join('');$('#opMeter').style.width=w.energy+'%';
    const l=$('#opLink');if(w.cert){l.hidden=false;l.dataset.cert=w.cert;}else l.hidden=true;
    const p=$('#orbitPanel');p.classList.remove('swap');void p.offsetWidth;p.classList.add('swap');uiTone(520+w.ring*90);}
  worlds.forEach(w=>w.el.addEventListener('click',()=>selectWorld(w)));
  $$('#opDots i').forEach(d=>d.addEventListener('click',()=>selectWorld(worlds.find(w=>w.id===d.dataset.id))));
  ocore.addEventListener('click',()=>{activeWorld=null;ostage.classList.remove('linked');worlds.forEach(x=>x.el.classList.remove('active'));$$('#opDots i').forEach(d=>d.classList.remove('on'));$('#opEyebrow').textContent='ORBIT / HOME BASE';$('#opTitle').textContent='Mayank Virani';$('#opBody').textContent='Select a planet to see what I explore there. Six worlds, one curious mind.';$('#opTags').innerHTML='<span>Code</span><span>AI</span><span>Music</span><span>Sport</span>';$('#opMeter').style.width='100%';$('#opLink').hidden=true;});
  ostage.addEventListener('pointermove',e=>{if(!matchMedia('(pointer:fine)').matches)return;const r=ostage.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;ostage.style.setProperty('--px',(x*14)+'px');ostage.style.setProperty('--py',(y*14)+'px');});
  requestAnimationFrame(tick);
  selectWorld(worlds[4]);

  // ===== Certificates =====
  const certs=[
    {src:'assets/certificates/power-bi-workshop.jpg',title:'Microsoft Power BI Workshop',org:'Google Developer Groups On Campus · Karnavati University',cat:'tech',date:'WORKSHOP',tag:'TECH'},
    {src:'assets/certificates/badminton-national.jpg',title:'Badminton National Championship',org:'Badminton Association of India',cat:'sport',date:'JAN 2024',tag:'SPORT'},
    {src:'assets/certificates/academic-top-performer.jpg',title:'Academics Top Performer',org:'Shree Swaminarayan Gurukul International School',cat:'academic',date:'SEP 2023',tag:'ACADEMICS'},
    {src:'assets/certificates/best-harmonium-player.jpg',title:'Best Harmonium Player',org:'Swaranjali Cultural Society',cat:'music',date:'JUN 2022',tag:'MUSIC'}
  ];
  const grid=$('#certGrid');
  certs.forEach((c,i)=>{const card=document.createElement('button');card.type='button';card.className='cert-card reveal';card.dataset.cat=c.cat;card.dataset.i=i;
    card.innerHTML=`<div class="cert-img"><img src="${c.src}" alt="${c.title} certificate" loading="lazy"><span class="cert-shine"></span></div><div class="cert-info"><div class="mono cert-top"><span>${c.tag}</span><span>${c.date}</span></div><h3>${c.title}</h3><p>${c.org}</p><span class="mono cert-open">VIEW CERTIFICATE ↗</span></div>`;
    grid.appendChild(card);
    if('IntersectionObserver' in window){const o=new IntersectionObserver(en=>en.forEach(x=>{if(x.isIntersecting){card.classList.add('visible');o.disconnect();}}),{threshold:.1});o.observe(card);}else card.classList.add('visible');
    card.addEventListener('pointermove',e=>{if(!matchMedia('(pointer:fine)').matches)return;const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;card.style.setProperty('--rx',((.5-y)*8)+'deg');card.style.setProperty('--ry',((x-.5)*10)+'deg');card.style.setProperty('--mx',x*100+'%');card.style.setProperty('--my',y*100+'%');});
    card.addEventListener('pointerleave',()=>{card.style.setProperty('--rx','0deg');card.style.setProperty('--ry','0deg');});
    card.addEventListener('click',()=>openLb(i));});
  function setCertFilter(f){$$('.cert-filter').forEach(b=>b.classList.toggle('active',b.dataset.cf===f));$$('.cert-card').forEach(c=>c.classList.toggle('hidden',f!=='all'&&c.dataset.cat!==f));}
  $$('.cert-filter').forEach(b=>b.addEventListener('click',()=>setCertFilter(b.dataset.cf)));
  $('#opLink').addEventListener('click',e=>{e.preventDefault();setCertFilter($('#opLink').dataset.cert);$('#certificates').scrollIntoView({behavior:'smooth'});});
  const lb=$('#lightbox');let lbIndex=0;
  const visibleIdx=()=>$$('.cert-card:not(.hidden)').map(c=>+c.dataset.i);
  function showLb(i){const c=certs[i];lbIndex=i;$('#lbImg').src=c.src;$('#lbImg').alt=c.title+' certificate';$('#lbTitle').textContent=c.title;$('#lbMeta').textContent=c.org+' · '+c.date;}
  function openLb(i){showLb(i);lb.hidden=false;document.body.style.overflow='hidden';}
  function closeLb(){lb.hidden=true;document.body.style.overflow='';}
  function stepLb(d){const v=visibleIdx();if(!v.length)return;const p=v.indexOf(lbIndex);showLb(v[(p+d+v.length)%v.length]);}
  $('#lbClose').addEventListener('click',closeLb);$('#lbPrev').addEventListener('click',()=>stepLb(-1));$('#lbNext').addEventListener('click',()=>stepLb(1));
  lb.addEventListener('click',e=>{if(e.target===lb)closeLb();});
  document.addEventListener('keydown',e=>{if(lb.hidden)return;if(e.key==='Escape')closeLb();if(e.key==='ArrowLeft')stepLb(-1);if(e.key==='ArrowRight')stepLb(1);});

  // Public GitHub repository integration. Gracefully falls back when offline or rate-limited.
  const repoGrid=$('#repoGrid'),githubNote=$('#githubNote');
  fetch('https://api.github.com/users/mayankvirani777-sys/repos?sort=updated&per_page=6',{headers:{'Accept':'application/vnd.github+json'}})
    .then(r=>{if(!r.ok)throw new Error('GitHub API unavailable');return r.json();})
    .then(repos=>{if(!repos.length){repoGrid.innerHTML='<p class="mono">No public repositories are currently listed on this profile.</p>';return;}repoGrid.replaceChildren();repos.forEach(repo=>{const card=document.createElement('article');card.className='repo-card';const title=document.createElement('h4');title.textContent=repo.name;const desc=document.createElement('p');desc.textContent=repo.description||'Public repository · description not provided.';const meta=document.createElement('div');meta.className='repo-meta';meta.textContent=(repo.language||'CODE')+'  ·  ★ '+repo.stargazers_count+'  · ⑂ '+repo.forks_count;const link=document.createElement('a');link.href=repo.html_url;link.target='_blank';link.rel='noreferrer';link.textContent='VIEW REPOSITORY ↗';card.append(title,desc,meta,link);repoGrid.append(card);});githubNote.textContent='LIVE PUBLIC DATA · LAST UPDATED '+new Date().toLocaleTimeString();})
    .catch(()=>{repoGrid.innerHTML='<p class="mono">Live repository feed is unavailable in this preview. Visit the GitHub profile directly to explore public work.</p>';githubNote.textContent='OFFLINE FALLBACK · PROFILE LINK REMAINS AVAILABLE';});

  $('#year').textContent=new Date().getFullYear();
})();