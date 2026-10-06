import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const asset = (name) => `${import.meta.env.BASE_URL}assets/${name}`;

export const MOTION = { letterCompression: 0.91, letterOvershoot: 1.035, lightningLength: 31, lightningHoverLength: 38, cursorGlow: 12, dustIntensity: 0.3 };

const LETTERS = [
  { key: "p", src: asset("p.svg"), x: 0, y: 68.4, w: 292 }, { key: "o", src: asset("o.svg"), x: 278.522, y: 71.2, w: 244 },
  { key: "r", src: asset("r.svg"), x: 513.081, y: 68, w: 246 }, { key: "t", src: asset("t.svg"), x: 726.053, y: 80.376, w: 159 },
  { key: "f", src: asset("f.svg"), x: 852.647, y: 0, w: 207 }, { key: "o1", src: asset("o-1.svg"), x: 1050.67, y: 68.4, w: 305 },
  { key: "l", src: asset("l.svg"), x: 1368.69, y: 14.4, w: 61 }, { key: "i", src: asset("i.svg"), x: 1420.73, y: 52.056, w: 124 },
];
const CONTACTS = [
  { x: 48, y: -219, index: 0, lift: 0 }, { x: 278, y: -216, index: 1, lift: 118 },
  { x: 514, y: -219, index: 2, lift: 106 }, { x: 684, y: -207, index: 3, lift: 124 },
  { x: 833, y: -287, index: 4, lift: 112 }, { x: 1080, y: -219, index: 5, lift: 128 },
  { x: 1276, y: -273, index: 6, lift: 116 },
];

function PortfolioWord() {
  const stageRef = useRef(null), moverRef = useRef(null), letterRefs = useRef([]), tagsRef = useRef(null);
  useLayoutEffect(() => {
    const stage = stageRef.current, mover = moverRef.current;
    if (!stage || !mover) return undefined;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(mover, { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 });
      gsap.set(tagsRef.current, { opacity: 1, y: 0 });
      return undefined;
    }
    let timeline, finished = false, started = false;
    const build = () => {
      timeline?.kill();
      const scale = stage.getBoundingClientRect().width / 1752, px = (value) => value * scale;
      const finalX = 1508.55, finalY = 71.2, letters = letterRefs.current;
      gsap.set(letters, { transformOrigin: "50% 100%", scaleX: 1, scaleY: 1 });
      gsap.set(tagsRef.current, { opacity: 0, y: 16 });
      gsap.set(mover, { x: px(48 - finalX), y: px(-720 - finalY), rotation: -4, scaleX: .97, scaleY: 1.03, transformOrigin: "50% 88%", opacity: 1 });
      const lockFinalState = () => {
        gsap.set(mover, { x: 0, y: 0, rotation: 0, scaleX: 1, scaleY: 1, opacity: 1 });
        gsap.set(letters, { scaleX: 1, scaleY: 1 });
        gsap.set(tagsRef.current, { opacity: 1, y: 0 });
      };
      timeline = gsap.timeline({ paused: true, onComplete: () => { finished = true; lockFinalState(); document.documentElement.dataset.portfolioReady = "true"; dispatchEvent(new CustomEvent("portfolio-intro-complete")); } });
      let previous = { x: 48, y: -720 };
      let impactTime = 0;
      CONTACTS.forEach((contact, index) => {
        const from = index === 0 ? previous : CONTACTS[index - 1];
        const apexX = (from.x + contact.x) / 2, apexY = index === 0 ? from.y : Math.min(from.y, contact.y) - contact.lift, impact = `impact-${index}`;
        if (index === 0) {
          timeline.to(mover, { x: px(contact.x - finalX), y: px(contact.y - finalY), rotation: 0, scaleX: 1.065, scaleY: .935, duration: .4, ease: "power2.in" }, 0);
          impactTime = .4;
        } else {
          const start = impactTime + .075;
          timeline.to(mover, { y: `+=${px(7)}`, scaleX: 1.045, scaleY: .955, duration: .045, ease: "power1.in" }, start)
            .to(mover, { x: px(apexX - finalX), y: px(apexY - finalY), rotation: index % 2 ? -5 : 5, scaleX: .935, scaleY: 1.075, duration: .175 + (index % 3) * .012, ease: "power2.out" }, start + .045)
            .to(mover, { x: px(contact.x - finalX), y: px(contact.y - finalY), rotation: 0, scaleX: 1.065, scaleY: .935, duration: .155 + (index % 2) * .012, ease: "power3.in" }, start + .22);
          impactTime = start + .375 + (index % 2) * .012;
        }
        timeline.addLabel(impact, impactTime)
          .to(mover, { scaleX: .985, scaleY: 1.02, duration: .075, ease: "power1.out" }, impact)
          .to(letters[contact.index], { scaleY: MOTION.letterCompression, scaleX: 1.055, duration: .09, ease: "power2.out" }, impact)
          .to(letters[contact.index], { scaleY: MOTION.letterOvershoot, scaleX: .985, duration: .14, ease: "power2.out" }, `${impact}+=0.09`)
          .to(letters[contact.index], { scaleY: 1, scaleX: 1, duration: .2, ease: "back.out(2.2)" }, `${impact}+=0.23`);
      });
      const finalStart = impactTime + .085;
      timeline.to(mover, { y: `+=${px(8)}`, scaleX: 1.04, scaleY: .96, duration: .05, ease: "power1.in" }, finalStart)
        .to(mover, { x: px(1396 - finalX), y: px(-430 - finalY), rotation: 6, scaleX: .93, scaleY: 1.08, duration: .2, ease: "power2.out" }, finalStart + .05)
        .to(mover, { x: px(18), y: 0, rotation: 10, scaleX: 1.065, scaleY: .935, duration: .19, ease: "power3.in" }, finalStart + .25)
        .to(mover, { x: px(18), y: px(-7), rotation: 10, scaleX: .985, scaleY: 1.02, duration: .08, ease: "power1.out" }, finalStart + .44)
        .to(mover, { x: px(18), y: 0, rotation: 10, scaleX: 1, scaleY: 1, duration: .11, ease: "power1.inOut" }, finalStart + .52)
        .to(mover, { x: 0, y: 0, rotation: 0, duration: .28, ease: "sine.inOut" }, finalStart + .72)
        .set(mover, { x: 0, y: 0, rotation: 0, scaleX: 1, scaleY: 1 }, finalStart + 1)
        .to(tagsRef.current, { opacity: 1, y: 0, duration: .26, ease: "power2.out" }, finalStart + .88);
      if (started) timeline.play(0);
    };
    build();
    const observer = new IntersectionObserver((entries) => {
      if (!started && entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= .999)) {
        started = true;
        observer.disconnect();
        timeline?.play(0);
      }
    }, { threshold: [0, .999, 1] });
    observer.observe(stage);
    const onResize = () => { if (!finished) build(); };
    addEventListener("resize", onResize);
    return () => { timeline?.kill(); observer.disconnect(); removeEventListener("resize", onResize); };
  }, []);
  return <div className="portfolio-stage" ref={stageRef} aria-label="portfolio">
    {LETTERS.map((letter, index) => <img alt="" aria-hidden="true" className="portfolio-letter" data-letter={letter.key} key={letter.key} ref={(node) => { letterRefs.current[index] = node; }} src={letter.src} style={{ left: `${letter.x / 17.52}%`, top: `${letter.y / 4.51}%`, width: `${letter.w / 17.52}%` }} />)}
    <img alt="" aria-hidden="true" className="portfolio-letter portfolio-moving-o" ref={moverRef} src={asset("o-2.svg")}/><HeroTags ref={tagsRef}/>
  </div>;
}
const HeroTags = ({ ref }) => <div className="hero-tags" ref={ref}><span className="tag tag-blue"><span>visual communication</span></span><span className="tag tag-pink"><span>key visuals</span></span><span className="tag tag-green"><span>social media</span></span><span className="hero-year">2026</span></div>;

function ButterflyCursor() {
  const canvasRef = useRef(null), cursorRef = useRef(null), ghostRef = useRef(null), leftWingRef = useRef(null), rightWingRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current, cursor = cursorRef.current, ghost = ghostRef.current;
    if (!canvas || !cursor || !ghost || !matchMedia("(hover: hover) and (pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const ctx = canvas.getContext("2d"); if (!ctx) return undefined;
    let x = -100, y = -100, previousX = x, previousY = y, visible = false, interactive = false, moving = false, frame = 0, lastTrail = 0, lastGhost = 0, stopTimer = 0, ready = false;
    const particles = [], bolts = [];
    const resize = () => { const dpr = Math.min(devicePixelRatio || 1, 2); canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr; canvas.style.width = `${innerWidth}px`; canvas.style.height = `${innerHeight}px`; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    const isInteractive = (target) => Boolean(target?.closest?.('a,button,[role="button"],[data-cursor="interactive"]')) && !target?.closest?.('[disabled],[aria-disabled="true"]');
    const isText = (target) => Boolean(target?.closest?.('input,textarea,[contenteditable="true"]'));
    const isAbout = () => document.querySelector("#about")?.getBoundingClientRect().top <= innerHeight * .55;
    const setMode = () => cursor.classList.toggle("butterfly-purple", isAbout());
    const addDust = () => { for (let i = 0; i < 2 && particles.length < 68; i += 1) particles.push({ x: x + (Math.random() - .5) * 4, y: y + 8 + Math.random() * 4, vx: (Math.random() - .5) * .12, vy: .08 + Math.random() * .12, born: performance.now(), life: 800 + Math.random() * 400, r: .5 + Math.random() * .45 }); };
    const addBolt = () => {
      if (bolts.length > 9) bolts.shift();
      const dx = x - previousX, dy = y - previousY, distance = Math.hypot(dx, dy) || 1;
      const ux = dx / distance, uy = dy / distance, length = 30 + Math.random() * 18;
      const nx = -uy, ny = ux, points = [];
      for (let i = 0; i <= 6; i += 1) {
        const t = i / 6, jitter = i === 0 || i === 6 ? 0 : (Math.random() - .5) * 6;
        points.push({ x: x - ux * length * t + nx * jitter, y: y - uy * length * t + ny * jitter + 5 });
      }
      const branches = [2, 4].map((index) => { const p = points[index], side = Math.random() > .5 ? 1 : -1, branchLength = 6 + Math.random() * 6; return { from: p, mid: { x: p.x + nx * side * branchLength * .55 - ux * 2, y: p.y + ny * side * branchLength * .55 - uy * 2 }, to: { x: p.x + nx * side * branchLength - ux * 5, y: p.y + ny * side * branchLength - uy * 5 } }; });
      let total = 0; for (let i = 1; i < points.length; i += 1) total += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
      bolts.push({ born: performance.now(), life: 760 + Math.random() * 220, points, branches, total });
    };
    const move = (event) => {
      if (event.pointerType === "touch" || !ready) return;
      previousX = x; previousY = y; x = event.clientX; y = event.clientY; visible = true; moving = true;
      const overText = isText(event.target); interactive = !overText && isInteractive(event.target);
      cursor.classList.toggle("is-interactive", interactive); cursor.classList.toggle("is-moving", true); cursor.classList.toggle("over-text", overText); cursor.style.left = `${x}px`; cursor.style.top = `${y}px`; cursor.style.opacity = overText ? "0" : "1"; setMode();
      clearTimeout(stopTimer); stopTimer = setTimeout(() => { moving = false; cursor.classList.remove("is-moving"); ghost.style.opacity = "0"; }, 105);
      const now = performance.now();
      if (now - lastGhost > 82 && Math.hypot(x - previousX, y - previousY) > 1.2) { ghost.style.left = `${previousX}px`; ghost.style.top = `${previousY}px`; ghost.style.opacity = ".065"; requestAnimationFrame(() => { ghost.style.opacity = "0"; }); lastGhost = now; }
      if (now - lastTrail > (isAbout() ? 105 : 38) && Math.hypot(x - previousX, y - previousY) > 1) { if (isAbout()) addBolt(); else addDust(); lastTrail = now; }
    };
    const leave = () => { visible = false; moving = false; cursor.classList.remove("is-moving", "is-interactive"); cursor.style.opacity = "0"; ghost.style.opacity = "0"; clearTimeout(stopTimer); };
    const enter = (event) => { if (event.pointerType !== "touch" && ready) { x = event.clientX; y = event.clientY; visible = true; cursor.style.left = `${x}px`; cursor.style.top = `${y}px`; cursor.style.opacity = "1"; } };
    const render = (time) => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      particles.forEach((p) => { const age = time - p.born, alpha = Math.max(0, 1 - age / p.life); p.x += p.vx; p.y += p.vy; ctx.globalAlpha = alpha * .55; ctx.fillStyle = "#f36caf"; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); });
      for (let i = particles.length - 1; i >= 0; i -= 1) if (time - particles[i].born >= particles[i].life) particles.splice(i, 1);
      bolts.forEach((b) => {
        const age = time - b.born, lifeProgress = age / b.life, grow = Math.min(1, age / 115), alpha = Math.max(0, 1 - lifeProgress);
        ctx.globalAlpha = alpha * .72; ctx.strokeStyle = "#c862df"; ctx.lineWidth = .9; ctx.shadowColor = "#ff65ca"; ctx.shadowBlur = 3; ctx.setLineDash([Math.max(1, b.total * grow), b.total + 2]);
        ctx.beginPath(); ctx.moveTo(b.points[0].x,b.points[0].y); b.points.slice(1).forEach(p=>ctx.lineTo(p.x,p.y)); ctx.stroke(); ctx.setLineDash([]);
        if (age > 70) { ctx.globalAlpha = alpha * Math.min(1, (age - 70) / 90) * .48; ctx.lineWidth = .65; b.branches.forEach(branch => { ctx.beginPath(); ctx.moveTo(branch.from.x,branch.from.y); ctx.lineTo(branch.mid.x,branch.mid.y); ctx.lineTo(branch.to.x,branch.to.y); ctx.stroke(); }); }
      });
      for (let i = bolts.length - 1; i >= 0; i -= 1) if (time - bolts[i].born >= bolts[i].life) bolts.splice(i, 1);
      if (visible && !cursor.classList.contains("over-text")) cursor.style.opacity = "1";
      ctx.globalAlpha = 1; ctx.shadowBlur = 0; frame = requestAnimationFrame(render);
    };
    const image = new Image(); image.src = asset("butterfly-cursor.png"); image.onload = () => { ready = true; document.documentElement.classList.add("custom-cursor-ready"); cursor.classList.add("is-ready"); };
    resize(); setMode(); frame = requestAnimationFrame(render); addEventListener("resize", resize); addEventListener("scroll", setMode, {passive:true}); addEventListener("pointermove", move); document.addEventListener("pointerleave", leave); document.addEventListener("pointerenter", enter);
    return () => { cancelAnimationFrame(frame); clearTimeout(stopTimer); document.documentElement.classList.remove("custom-cursor-ready"); removeEventListener("resize", resize); removeEventListener("scroll", setMode); removeEventListener("pointermove", move); document.removeEventListener("pointerleave", leave); document.removeEventListener("pointerenter", enter); };
  }, []);
  const layer = (className, ref) => <img ref={ref} className={className} src={asset("butterfly-cursor.png")} alt=""/>;
  return <><canvas className="butterfly-trail" ref={canvasRef} aria-hidden="true"/><div className="butterfly-ghost" ref={ghostRef} aria-hidden="true">{layer("butterfly-wing wing-left")}{layer("butterfly-wing wing-right")}</div><div className="butterfly-cursor" ref={cursorRef} aria-hidden="true">{layer("butterfly-wing wing-left",leftWingRef)}{layer("butterfly-wing wing-right",rightWingRef)}{layer("butterfly-body")}<svg className="butterfly-sparks" viewBox="0 0 40 40"><path d="M3 10l4 2-3 3 5 2M37 10l-4 2 3 3-5 2M34 6l-3 2 2 2"/></svg></div></>;
}

function Hero() { return <section className="hero-surface"><header className="nav"><a href="#top">Daria Demian</a><nav aria-label="Главная навигация"><a href="#about"><img className="nav-paperclip" src={asset("header-paperclip.svg")} alt=""/>Обо мне</a><a href="#projects"><img className="nav-folder" src={asset("header-folder.svg")} alt=""/>Проекты</a><a href="#contacts"><img className="nav-phone" src={asset("header-phone.svg")} alt=""/>Контакты</a></nav><span>MOSCOW</span></header><div className="designer-mark"><img src={asset("star-3.svg")} alt=""/><span>digital designer</span></div><div className="word-wrap"><PortfolioWord/></div></section>; }
const WorkItem = ({ year, title, children }) => <article className="work-item"><span className="year-pill">{year}</span><h3>{title}</h3><p>{children}</p></article>;
function About() { return <section className="about" id="about"><div className="about-kicker"><img src={asset("section-icon.svg")} alt=""/><strong>01 / обо мне</strong></div><div className="intro-grid"><div className="portrait-card"><div className="portrait-shadow"/><div className="portrait-bg"/><img src={asset("portrait.png")} alt="Дарья Демьян"/></div><div className="intro-copy"><h1><em>Привет!</em> Меня зовут<br/>Дарья, я Digital Designer</h1><p>Работаю с графическим и digital-дизайном — создаю визуальные концепции, рекламные материалы и контент для брендов. Делаю дизайн, который решает конкретные задачи и помогает брендам доносить свои идеи.</p><div className="contacts"><a href={asset("daria-demian-cv.pdf")} download="Daria-Demian-CV.pdf">CV (резюме)</a><span>danydemian@yandex.ru / 89920161211</span></div></div></div><div className="details-grid"><div><h2>Опыт работы · 4+ года</h2><WorkItem year="2025—2026" title="Фонд Владимира Потанина">Графический дизайнер — презентации, иллюстрации, мерч и коммуникации для социальных сетей.</WorkItem><WorkItem year="2024—2025" title="MERIDA">Графический дизайнер — бренд-коммуникации, упаковка, digital-баннеры и визуалы для выставок.</WorkItem><WorkItem year="2020—2023" title="Фриланс">Айдентика, иллюстрации, макеты и мерч для частных клиентов.</WorkItem></div><div className="side-details"><h2>Инструменты</h2><div className="tools"><span>Figma</span><span>Illustrator</span><span>InDesign</span><span>Photoshop</span><span>Blender (basic)</span><span>AI image generation</span></div><h2>Образование</h2><WorkItem year="2020—2024" title="Школа дизайна НИУ ВШЭ">Бакалавриат · Дизайнер-иллюстратор</WorkItem><WorkItem year="2017—2019" title="Уральский колледж строительства, архитектуры и предпринимательства">Дизайнер по отраслям</WorkItem></div></div></section>; }
export function App() { return <main id="top"><ButterflyCursor/><Hero/><About/></main>; }
