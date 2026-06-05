import { useState, useEffect } from "react";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const SERVICES = [
  { icon: "◈", title: "Car Hire",          desc: "Saloons, estates, and people carriers for individuals and small groups — airport runs, meetings, and day trips." },
  { icon: "⬡", title: "Coach Charter",     desc: "Full-size and midi coaches for schools, sports clubs, corporate groups, and large events." },
  { icon: "◉", title: "Boat Charter",      desc: "River and coastal boat hire for leisure trips, corporate functions, and private group outings." },
  { icon: "✦", title: "Event Transport",   desc: "Mixed-fleet coordination across cars, coaches, and boats for weddings, festivals, and large occasions." },
];

const FLEET = [
  { name: "Standard Saloon",   type: "Car",    seats: "3 passengers",  tag: "CAR",    cat: "car"    },
  { name: "Estate Car",        type: "Car",    seats: "4 passengers",  tag: "CAR",    cat: "car"    },
  { name: "People Carrier",    type: "Car",    seats: "6 passengers",  tag: "CAR",    cat: "car"    },
  { name: "Midi Coach",        type: "Coach",  seats: "24 passengers", tag: "COACH",  cat: "coach"  },
  { name: "Full-Size Coach",   type: "Coach",  seats: "53 passengers", tag: "COACH",  cat: "coach"  },
  { name: "River Cruiser",     type: "Boat",   seats: "12 passengers", tag: "BOAT",   cat: "boat"   },
  { name: "Passenger Ferry",   type: "Boat",   seats: "40 passengers", tag: "BOAT",   cat: "boat"   },
];

const FLEET_CATS = ["all", "car", "coach", "boat"];

const STATS = [
  { value: "12K+", label: "Journeys Completed"     },
  { value: "98%",  label: "On-Time Rate"            },
  { value: "200+", label: "Vessels & Vehicles"      },
  { value: "24/7", label: "Support Available"       },
];

// ─── STYLES ───────────────────────────────────────────────────────────────────

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Josefin+Sans:wght@200;300;400;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --black:    #050505;
    --b2:       #0b0b0b;
    --b3:       #101010;
    --b4:       #161616;
    --b5:       #1c1c1c;
    --gold:     #c49a0e;
    --gold-l:   #ddb01c;
    --gold-b:   #f0c840;
    --gold-d:   #7a5f08;
    --cream:    #e4ddd0;
    --muted:    #66615e;
    --muted2:   #888280;
    --ph:       rgba(102,97,94,.35);
  }

  html { scroll-behavior: smooth; }
  body { background: var(--black); font-family: 'Cormorant Garamond', Georgia, serif; color: var(--cream); overflow-x: hidden; }

  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: var(--b2); }
  ::-webkit-scrollbar-thumb { background: var(--gold-d); }

  .reveal { opacity: 0; transform: translateY(26px); transition: opacity .72s cubic-bezier(.16,1,.3,1), transform .72s cubic-bezier(.16,1,.3,1); }
  .reveal.in { opacity: 1; transform: none; }
  .d1 { transition-delay: .08s; } .d2 { transition-delay: .17s; } .d3 { transition-delay: .26s; } .d4 { transition-delay: .35s; }

  /* ── NAV ── */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 200;
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.6rem 4rem;
    transition: background .32s, padding .32s, border-color .32s;
    border-bottom: 1px solid transparent;
  }
  .nav.stuck { background: rgba(5,5,5,.95); backdrop-filter: blur(18px); padding: 1rem 4rem; border-color: rgba(196,154,14,.1); }
  .logo {
    font-family: 'Josefin Sans', sans-serif; font-weight: 600; font-size: .78rem;
    letter-spacing: .28em; text-transform: uppercase; color: var(--gold-l);
    display: flex; align-items: center; gap: .75rem; cursor: pointer; user-select: none;
  }
  .logo-mark { width: 20px; height: 20px; border: 1.5px solid var(--gold); transform: rotate(45deg); flex-shrink: 0; position: relative; }
  .logo-mark::after { content:''; position:absolute; inset:4px; background: var(--gold); }
  .nav-links { display: flex; gap: 2.4rem; list-style: none; }
  .nav-links a { font-family:'Josefin Sans',sans-serif; font-weight:300; font-size:.7rem; letter-spacing:.22em; text-transform:uppercase; color:var(--muted2); text-decoration:none; transition:color .2s; }
  .nav-links a:hover { color: var(--gold-l); }
  .nav-actions { display: flex; gap: .7rem; }
  .btn-ghost { font-family:'Josefin Sans',sans-serif; font-size:.68rem; letter-spacing:.2em; text-transform:uppercase; font-weight:300; background:transparent; border:1px solid rgba(196,154,14,.3); color:var(--gold-l); padding:.48rem 1.2rem; cursor:pointer; transition:border-color .2s,color .2s; }
  .btn-ghost:hover { border-color:var(--gold-l); color:var(--gold-b); }
  .btn-gold { font-family:'Josefin Sans',sans-serif; font-size:.68rem; letter-spacing:.2em; text-transform:uppercase; font-weight:400; background:var(--gold); border:none; color:var(--black); padding:.48rem 1.2rem; cursor:pointer; transition:background .2s; position:relative; overflow:hidden; }
  .btn-gold::after { content:''; position:absolute; inset:0; background:rgba(255,255,255,.13); transform:translateX(-110%) skewX(-18deg); transition:transform .35s; }
  .btn-gold:hover { background:var(--gold-b); }
  .btn-gold:hover::after { transform:translateX(120%) skewX(-18deg); }

  /* ── HERO ── */
  .hero { min-height:100vh; position:relative; display:flex; align-items:center; overflow:hidden; }
  .hero-bg {
    position:absolute; inset:0;
    background:
      radial-gradient(ellipse 45% 55% at 75% 40%, rgba(18,10,10,.8) 0%, transparent 60%),
      radial-gradient(ellipse 30% 35% at 90% 10%, rgba(196,154,14,.05) 0%, transparent 50%),
      linear-gradient(168deg, #050505 0%, #0a0808 50%, #050505 100%);
  }
  .hero-grid {
    position:absolute; inset:0;
    background-image: linear-gradient(rgba(196,154,14,.022) 1px,transparent 1px), linear-gradient(90deg,rgba(196,154,14,.022) 1px,transparent 1px);
    background-size: 68px 68px;
    mask-image: radial-gradient(ellipse 70% 70% at 60% 42%, black 5%, transparent 68%);
  }
  .hero-bar { position:absolute; left:0; top:0; bottom:0; width:2px; background:linear-gradient(180deg,transparent 0%,var(--gold) 28%,var(--gold-d) 72%,transparent 100%); opacity:.2; }
  .hero-content { position:relative; z-index:2; padding:0 4rem; margin-top:5.5rem; max-width:820px; }
  .hero-eye { font-family:'Josefin Sans',sans-serif; font-size:.65rem; letter-spacing:.38em; text-transform:uppercase; color:var(--gold); font-weight:300; display:flex; align-items:center; gap:.9rem; margin-bottom:1.8rem; }
  .hero-eye::before { content:''; width:32px; height:1px; background:var(--gold); display:block; }
  .hero-h1 { font-size:clamp(3.2rem,7.2vw,6.4rem); font-weight:300; line-height:1.04; color:var(--cream); margin-bottom:1.6rem; }
  .hero-h1 em { font-style:italic; color:var(--gold-l); font-weight:300; }
  .hero-h1 strong { display:block; font-weight:600; }
  .hero-sub { font-family:'Josefin Sans',sans-serif; font-size:.86rem; font-weight:300; letter-spacing:.05em; line-height:1.82; color:var(--muted); max-width:440px; margin-bottom:2.8rem; }
  .hero-btns { display:flex; align-items:center; gap:1.8rem; }
  .btn-lg { font-family:'Josefin Sans',sans-serif; font-size:.76rem; letter-spacing:.22em; text-transform:uppercase; font-weight:400; background:var(--gold); border:none; color:var(--black); padding:.95rem 2.4rem; cursor:pointer; position:relative; overflow:hidden; transition:background .2s, transform .14s; }
  .btn-lg::after { content:''; position:absolute; inset:0; background:rgba(255,255,255,.12); transform:translateX(-110%) skewX(-18deg); transition:transform .36s; }
  .btn-lg:hover { background:var(--gold-b); transform:translateY(-1px); }
  .btn-lg:hover::after { transform:translateX(120%) skewX(-18deg); }
  .btn-txt { font-family:'Josefin Sans',sans-serif; font-size:.72rem; letter-spacing:.2em; text-transform:uppercase; font-weight:300; background:none; border:none; color:var(--muted2); cursor:pointer; display:flex; align-items:center; gap:.65rem; transition:color .2s; }
  .btn-txt span { width:26px; height:1px; background:currentColor; display:inline-block; transition:width .24s; }
  .btn-txt:hover { color:var(--cream); }
  .btn-txt:hover span { width:40px; }

  /* ── STATS ── */
  .stats { background:var(--b3); border-top:1px solid rgba(196,154,14,.09); border-bottom:1px solid rgba(196,154,14,.09); padding:2rem 4rem; display:grid; grid-template-columns:repeat(4,1fr); gap:2rem; }
  .stat { text-align:center; }
  .stat-v { font-size:2.2rem; font-weight:300; color:var(--gold-l); line-height:1; margin-bottom:.3rem; }
  .stat-l { font-family:'Josefin Sans',sans-serif; font-size:.6rem; letter-spacing:.22em; text-transform:uppercase; color:var(--muted); }

  /* ── SECTION COMMON ── */
  .section { padding:7rem 4rem; }
  .sec-eye { font-family:'Josefin Sans',sans-serif; font-size:.62rem; letter-spacing:.36em; text-transform:uppercase; color:var(--gold); font-weight:300; display:flex; align-items:center; gap:.8rem; margin-bottom:.9rem; }
  .sec-eye::before { content:''; width:22px; height:1px; background:var(--gold); display:block; }
  .sec-h2 { font-size:clamp(2rem,3.8vw,3.2rem); font-weight:300; line-height:1.12; color:var(--cream); margin-bottom:.9rem; }
  .sec-h2 em { font-style:italic; color:var(--gold-l); }

  /* ── SERVICES ── */
  .svc-head { display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:3.2rem; }
  .svc-desc { font-family:'Josefin Sans',sans-serif; font-size:.8rem; font-weight:300; letter-spacing:.04em; line-height:1.8; color:var(--muted); margin-top:.7rem; max-width:400px; }
  .svc-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:rgba(196,154,14,.06); }
  .svc-card { background:var(--b2); padding:2.4rem 1.8rem; position:relative; overflow:hidden; cursor:default; transition:background .26s; }
  .svc-card::after { content:''; position:absolute; bottom:0; left:0; right:0; height:2px; background:linear-gradient(90deg,transparent,var(--gold),transparent); transform:scaleX(0); transition:transform .36s; }
  .svc-card:hover { background:var(--b4); }
  .svc-card:hover::after { transform:scaleX(1); }
  .svc-icon { font-size:1.4rem; color:var(--gold); margin-bottom:1.4rem; display:block; }
  .svc-title { font-size:1.15rem; font-weight:400; color:var(--cream); margin-bottom:.6rem; }
  .svc-text { font-family:'Josefin Sans',sans-serif; font-size:.76rem; font-weight:300; letter-spacing:.04em; line-height:1.8; color:var(--muted); }
  .svc-more { font-family:'Josefin Sans',sans-serif; font-size:.62rem; letter-spacing:.2em; text-transform:uppercase; color:var(--gold); margin-top:1.6rem; display:flex; align-items:center; gap:.35rem; opacity:0; transform:translateY(5px); transition:opacity .26s, transform .26s; }
  .svc-card:hover .svc-more { opacity:1; transform:none; }

  .fleet-cats { display:flex; gap:.5rem; margin-bottom:1.4rem; flex-wrap:wrap; }
  .fleet-cat-btn { font-family:'Josefin Sans',sans-serif; font-size:.62rem; letter-spacing:.2em; text-transform:uppercase; font-weight:300; background:var(--b3); border:1px solid rgba(196,154,14,.14); color:var(--muted2); padding:.38rem .9rem; cursor:pointer; transition:background .2s,border-color .2s,color .2s; }
  .fleet-cat-btn.on { background:var(--b4); border-color:var(--gold); color:var(--gold-l); }
  .fleet-cat-btn:hover:not(.on) { border-color:rgba(196,154,14,.3); color:var(--cream); }

  /* ── FLEET VISUALS ── */
  .vis-wrap { width:320px; height:140px; position:relative; display:flex; align-items:flex-end; justify-content:center; }
  /* car */
  .car-body { position:absolute; bottom:22px; left:10px; right:10px; height:66px; background:linear-gradient(135deg,var(--b5),var(--b3)); border:1px solid rgba(196,154,14,.18); clip-path:polygon(7% 100%,0% 52%,14% 18%,34% 4%,66% 4%,82% 18%,100% 52%,93% 100%); }
  .car-roof { position:absolute; bottom:66px; left:72px; right:72px; height:46px; background:linear-gradient(135deg,var(--b4),var(--b5)); border-top:1px solid rgba(196,154,14,.2); clip-path:polygon(6% 100%,16% 0%,84% 0%,94% 100%); }
  .car-wl,.car-wr { position:absolute; bottom:5px; width:38px; height:38px; border-radius:50%; border:3px solid var(--gold-d); background:var(--black); }
  .car-wl { left:35px; } .car-wr { right:35px; }
  /* coach */
  .coach-body { position:absolute; bottom:22px; left:4px; right:4px; height:68px; background:linear-gradient(135deg,var(--b5),var(--b3)); border:1px solid rgba(196,154,14,.18); border-radius:4px 4px 0 0; }
  .coach-windows { position:absolute; bottom:58px; left:20px; right:20px; display:flex; gap:6px; }
  .coach-win { flex:1; height:18px; background:rgba(196,154,14,.1); border:1px solid rgba(196,154,14,.2); border-radius:1px; }
  .coach-wl,.coach-wr { position:absolute; bottom:4px; width:34px; height:34px; border-radius:50%; border:3px solid var(--gold-d); background:var(--black); }
  .coach-wl { left:28px; } .coach-wr { right:28px; }
  .coach-wm { position:absolute; bottom:4px; left:50%; transform:translateX(-50%); width:34px; height:34px; border-radius:50%; border:3px solid var(--gold-d); background:var(--black); }
  /* boat */
  .boat-hull { position:absolute; bottom:28px; left:16px; right:16px; height:44px; background:linear-gradient(135deg,var(--b5),var(--b3)); border:1px solid rgba(196,154,14,.18); clip-path:polygon(0% 0%,100% 0%,92% 100%,8% 100%); }
  .boat-cabin { position:absolute; bottom:60px; left:60px; right:80px; height:40px; background:linear-gradient(135deg,var(--b4),var(--b5)); border:1px solid rgba(196,154,14,.2); border-radius:2px 2px 0 0; }
  .boat-mast { position:absolute; bottom:98px; left:calc(60px + 10px); width:1px; height:36px; background:rgba(196,154,14,.4); }
  .boat-water { position:absolute; bottom:16px; left:0; right:0; height:14px; background:repeating-linear-gradient(90deg,transparent 0px,transparent 12px,rgba(196,154,14,.08) 12px,rgba(196,154,14,.08) 14px); }
  /* shared glow */
  .vis-glow { position:absolute; bottom:18px; left:50%; transform:translateX(-50%); width:160px; height:14px; background:radial-gradient(ellipse,rgba(196,154,14,.22) 0%,transparent 70%); filter:blur(6px); }

  /* ── FLEET LAYOUT ── */
  .fleet-wrap { display:grid; grid-template-columns:1fr 1fr; gap:4.5rem; align-items:start; }
  .fleet-tabs { display:flex; flex-direction:column; gap:1px; background:rgba(196,154,14,.06); margin-top:.8rem; }
  .fleet-tab { background:var(--b2); padding:1.4rem 1.7rem; cursor:pointer; display:flex; align-items:center; justify-content:space-between; border-left:3px solid transparent; transition:background .2s,border-color .2s; }
  .fleet-tab.on { background:var(--b4); border-left-color:var(--gold); }
  .fleet-tab:hover:not(.on) { background:var(--b3); }
  .ft-name { font-size:1.05rem; font-weight:400; color:var(--cream); }
  .ft-type { font-family:'Josefin Sans',sans-serif; font-size:.63rem; letter-spacing:.14em; text-transform:uppercase; color:var(--muted); margin-top:.18rem; }
  .ft-tag { font-family:'Josefin Sans',sans-serif; font-size:.52rem; letter-spacing:.18em; text-transform:uppercase; background:var(--gold); color:var(--black); padding:.16rem .48rem; }
  .fleet-vis { background:var(--b2); border:1px solid rgba(196,154,14,.09); padding:2.8rem 2rem; display:flex; flex-direction:column; align-items:center; gap:1.8rem; position:relative; overflow:hidden; }
  .fleet-vis::before { content:''; position:absolute; bottom:-36px; left:50%; transform:translateX(-50%); width:220px; height:70px; background:radial-gradient(ellipse,rgba(196,154,14,.1) 0%,transparent 70%); filter:blur(10px); }
  .fleet-info { text-align:center; width:100%; padding:1.3rem 1.6rem; border-top:1px solid rgba(196,154,14,.09); }
  .fi-name { font-size:1.4rem; font-weight:300; color:var(--cream); margin-bottom:.28rem; }
  .fi-detail { font-family:'Josefin Sans',sans-serif; font-size:.65rem; letter-spacing:.18em; text-transform:uppercase; color:var(--muted); }
  .fi-detail b { color:var(--gold-l); margin:0 .4rem; font-weight:400; }

  /* ── BOOKING CTA ── */
  .book-wrap { background:var(--b3); border:1px solid rgba(196,154,14,.1); padding:4rem; display:grid; grid-template-columns:1fr auto; gap:4rem; align-items:center; position:relative; overflow:hidden; }
  .book-wrap::before { content:''; position:absolute; right:-70px; top:-70px; width:200px; height:200px; border:1px solid rgba(196,154,14,.06); border-radius:50%; }
  .book-sub { font-family:'Josefin Sans',sans-serif; font-size:.8rem; font-weight:300; letter-spacing:.05em; line-height:1.8; color:var(--muted); margin-top:.85rem; max-width:420px; }
  .book-form { display:flex; flex-direction:column; gap:.85rem; min-width:280px; }
  .f-lbl { font-family:'Josefin Sans',sans-serif; font-size:.58rem; letter-spacing:.24em; text-transform:uppercase; color:var(--muted); margin-bottom:.28rem; display:block; }
  .f-inp { background:var(--black); border:1px solid rgba(196,154,14,.15); color:var(--cream); font-family:'Josefin Sans',sans-serif; font-size:.78rem; font-weight:300; padding:.65rem .95rem; outline:none; width:100%; transition:border-color .2s; }
  .f-inp:focus { border-color:var(--gold); }
  .f-inp::placeholder { color:var(--ph); }
  .f-inp option { background:var(--b2); }
  .btn-book { font-family:'Josefin Sans',sans-serif; font-size:.72rem; letter-spacing:.2em; text-transform:uppercase; font-weight:400; background:linear-gradient(90deg,var(--gold-l),var(--gold)); border:none; color:var(--black); padding:.85rem; cursor:pointer; margin-top:.35rem; transition:opacity .2s,transform .14s; }
  .btn-book:hover { opacity:.88; transform:translateY(-1px); }

  /* ── FOOTER ── */
  .footer { background:var(--b2); border-top:1px solid rgba(196,154,14,.08); padding:3.8rem 4rem; }
  .foot-grid { display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:2.8rem; margin-bottom:2.5rem; }
  .foot-desc { font-family:'Josefin Sans',sans-serif; font-size:.74rem; font-weight:300; letter-spacing:.04em; line-height:1.8; color:var(--muted); margin-top:.85rem; max-width:230px; }
  .foot-ht { font-family:'Josefin Sans',sans-serif; font-size:.6rem; letter-spacing:.3em; text-transform:uppercase; color:var(--gold); margin-bottom:1.1rem; }
  .foot-ul { list-style:none; display:flex; flex-direction:column; gap:.6rem; }
  .foot-ul a { font-family:'Josefin Sans',sans-serif; font-size:.74rem; font-weight:300; letter-spacing:.04em; color:var(--muted); text-decoration:none; transition:color .2s; }
  .foot-ul a:hover { color:var(--cream); }
  .foot-bot { border-top:1px solid rgba(196,154,14,.06); padding-top:1.6rem; display:flex; justify-content:space-between; align-items:center; }
  .foot-copy { font-family:'Josefin Sans',sans-serif; font-size:.66rem; letter-spacing:.1em; color:var(--muted); }
  .foot-copy span { color:var(--gold); }

  /* ── AUTH SHARED ── */
  .auth-page { min-height:100vh; display:grid; grid-template-columns:1fr 1fr; background:var(--black); }
  .auth-left { position:relative; overflow:hidden; background:linear-gradient(158deg,#060606 0%,#0d0b0b 100%); display:flex; flex-direction:column; justify-content:space-between; padding:2.8rem; }
  .auth-left-grid { position:absolute; inset:0; background-image:linear-gradient(rgba(196,154,14,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(196,154,14,.025) 1px,transparent 1px); background-size:62px 62px; }
  .auth-left-glow { position:absolute; bottom:-80px; left:-50px; width:300px; height:300px; background:radial-gradient(ellipse,rgba(14,8,6,.9) 0%,transparent 65%); border-radius:50%; }
  .auth-left-body { position:relative; z-index:2; margin:auto 0; }
  .auth-left-tag { font-family:'Josefin Sans',sans-serif; font-size:.62rem; letter-spacing:.36em; text-transform:uppercase; color:var(--gold); font-weight:300; display:flex; align-items:center; gap:.75rem; margin-bottom:1.8rem; }
  .auth-left-tag::before { content:''; width:22px; height:1px; background:var(--gold); display:block; }
  .auth-left-h { font-size:clamp(2.2rem,3.8vw,3.3rem); font-weight:300; line-height:1.12; color:var(--cream); margin-bottom:1.1rem; }
  .auth-left-h em { font-style:italic; color:var(--gold-l); }
  .auth-left-p { font-family:'Josefin Sans',sans-serif; font-size:.8rem; font-weight:300; letter-spacing:.05em; line-height:1.8; color:var(--muted); max-width:320px; }
  .auth-mini-stats { position:relative; z-index:2; display:grid; grid-template-columns:1fr 1fr; gap:1px; background:rgba(196,154,14,.07); }
  .ams { background:rgba(5,5,5,.75); padding:1.1rem 1.3rem; }
  .ams-v { font-size:1.5rem; font-weight:300; color:var(--gold-l); line-height:1; margin-bottom:.25rem; }
  .ams-l { font-family:'Josefin Sans',sans-serif; font-size:.58rem; letter-spacing:.2em; text-transform:uppercase; color:var(--muted); }
  .auth-right { display:flex; align-items:center; justify-content:center; padding:2.8rem; background:var(--b2); }
  .auth-box { width:100%; max-width:410px; }
  .auth-title { font-size:2rem; font-weight:300; color:var(--cream); margin-bottom:.45rem; }
  .auth-title em { font-style:italic; color:var(--gold-l); }
  .auth-subtitle { font-family:'Josefin Sans',sans-serif; font-size:.76rem; font-weight:300; letter-spacing:.05em; line-height:1.7; color:var(--muted); margin-bottom:2rem; }
  .auth-back { font-family:'Josefin Sans',sans-serif; font-size:.65rem; letter-spacing:.2em; text-transform:uppercase; font-weight:300; background:none; border:none; color:var(--muted); cursor:pointer; display:flex; align-items:center; gap:.45rem; margin-bottom:2rem; transition:color .2s; }
  .auth-back:hover { color:var(--gold-l); }
  .auth-form { display:flex; flex-direction:column; gap:.92rem; }
  .auth-row { display:grid; grid-template-columns:1fr 1fr; gap:.75rem; }
  .auth-fg { display:flex; flex-direction:column; gap:.3rem; }
  .auth-lbl { font-family:'Josefin Sans',sans-serif; font-size:.58rem; letter-spacing:.24em; text-transform:uppercase; color:var(--muted); }
  .auth-inp { background:var(--black); border:1px solid rgba(196,154,14,.14); color:var(--cream); font-family:'Josefin Sans',sans-serif; font-size:.8rem; font-weight:300; padding:.7rem .95rem; outline:none; width:100%; transition:border-color .2s; }
  .auth-inp:focus { border-color:var(--gold); }
  .auth-inp::placeholder { color:var(--ph); }
  .auth-divider { display:flex; align-items:center; gap:.9rem; margin:.1rem 0; }
  .auth-divider::before,.auth-divider::after { content:''; flex:1; height:1px; background:rgba(196,154,14,.09); }
  .auth-divider-txt { font-family:'Josefin Sans',sans-serif; font-size:.58rem; letter-spacing:.2em; text-transform:uppercase; color:var(--muted); }
  .auth-submit { font-family:'Josefin Sans',sans-serif; font-size:.74rem; letter-spacing:.22em; text-transform:uppercase; font-weight:400; background:var(--gold); border:none; color:var(--black); padding:.88rem; cursor:pointer; margin-top:.28rem; transition:background .2s,transform .14s; position:relative; overflow:hidden; }
  .auth-submit::after { content:''; position:absolute; inset:0; background:rgba(255,255,255,.12); transform:translateX(-110%) skewX(-18deg); transition:transform .36s; }
  .auth-submit:hover { background:var(--gold-b); transform:translateY(-1px); }
  .auth-submit:hover::after { transform:translateX(120%) skewX(-18deg); }
  .auth-foot { font-family:'Josefin Sans',sans-serif; font-size:.72rem; font-weight:300; letter-spacing:.04em; color:var(--muted); text-align:center; margin-top:1.3rem; }
  .auth-foot button { background:none; border:none; color:var(--gold-l); cursor:pointer; font-family:inherit; font-size:inherit; font-weight:400; letter-spacing:inherit; transition:color .2s; }
  .auth-foot button:hover { color:var(--gold-b); }
  .auth-note { font-family:'Josefin Sans',sans-serif; font-size:.68rem; font-weight:300; letter-spacing:.04em; line-height:1.6; color:var(--muted); }
  .info-box { background:var(--b3); border:1px solid rgba(196,154,14,.12); border-left:3px solid var(--gold-d); padding:.95rem 1.1rem; margin-top:.2rem; }
  .info-box p { font-family:'Josefin Sans',sans-serif; font-size:.72rem; font-weight:300; letter-spacing:.04em; line-height:1.7; color:var(--muted); }
  .info-box strong { color:var(--muted2); font-weight:400; }
  .role-tabs { display:grid; grid-template-columns:repeat(3,1fr); gap:.5rem; margin-bottom:1.7rem; }
  .role-btn { padding:.65rem .4rem; border:1px solid rgba(196,154,14,.16); background:var(--b3); cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:.35rem; transition:border-color .2s,background .2s; }
  .role-btn.sel { border-color:var(--gold); background:var(--b4); }
  .role-btn:hover:not(.sel) { border-color:rgba(196,154,14,.3); }
  .role-icon { font-size:1.1rem; }
  .role-lbl { font-family:'Josefin Sans',sans-serif; font-size:.58rem; letter-spacing:.18em; text-transform:uppercase; color:var(--muted); }
  .role-btn.sel .role-lbl { color:var(--gold-l); }
  .step-bar { display:flex; gap:.35rem; margin-bottom:1.7rem; }
  .step-seg { flex:1; height:2px; transition:background .28s; }

  @media(max-width:900px){
    .nav { padding:1.1rem 1.8rem; } .nav.stuck { padding:.85rem 1.8rem; } .nav-links { display:none; }
    .hero-content { padding:0 1.8rem; }
    .stats { grid-template-columns:repeat(2,1fr); padding:1.8rem 2rem; }
    .section { padding:5rem 2rem; }
    .svc-grid { grid-template-columns:1fr 1fr; }
    .fleet-wrap { grid-template-columns:1fr; }
    .fleet-vis-col { display:none; }
    .book-wrap { grid-template-columns:1fr; padding:2.4rem; }
    .foot-grid { grid-template-columns:1fr 1fr; }
    .footer { padding:2.4rem 1.8rem; }
    .auth-page { grid-template-columns:1fr; }
    .auth-left { display:none; }
    .auth-right { padding:1.8rem; }
  }
`;

// ─── HOOKS ────────────────────────────────────────────────────────────────────

function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in"); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// ─── AUTH LEFT PANEL ─────────────────────────────────────────────────────────

function AuthLeft({ heading, sub }) {
  return (
    <div className="auth-left">
      <div className="auth-left-grid" />
      <div className="auth-left-glow" />
      <div className="logo" style={{ position: "relative", zIndex: 2 }}>
        <div className="logo-mark" />
        VCS
      </div>
      <div className="auth-left-body">
        <div className="auth-left-tag">Vehicle Charter Service</div>
        <h2 className="auth-left-h" dangerouslySetInnerHTML={{ __html: heading }} />
        <p className="auth-left-p">{sub}</p>
      </div>
      <div className="auth-mini-stats">
        {[{ v:"12K+",l:"Journeys"},{v:"98%",l:"On-Time"},{v:"200+",l:"Fleet"},{v:"24/7",l:"Support"}].map((s)=>(
          <div className="ams" key={s.l}><div className="ams-v">{s.v}</div><div className="ams-l">{s.l}</div></div>
        ))}
      </div>
    </div>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────

function LoginPage({ onNavigate }) {
  const [role, setRole] = useState("customer");

  const roles = [
    { id: "customer", icon: "👤", label: "Customer" },
    { id: "driver",   icon: "🚗", label: "Driver"   },
    { id: "admin",    icon: "⚙️",  label: "Admin"   },
  ];

  return (
    <div className="auth-page">
      <AuthLeft
        heading="Welcome<br/><em>Back.</em>"
        sub="Sign in to manage your bookings or access the operations portal."
      />
      <div className="auth-right">
        <div className="auth-box">
          <button className="auth-back" onClick={() => onNavigate("home")}>← Back to Home</button>
          <h1 className="auth-title">Sign <em>In</em></h1>
          <p className="auth-subtitle">Select your account type to continue.</p>

          <div className="role-tabs">
            {roles.map((r) => (
              <button key={r.id} className={`role-btn${role === r.id ? " sel" : ""}`} onClick={() => setRole(r.id)}>
                <span className="role-icon">{r.icon}</span>
                <span className="role-lbl">{r.label}</span>
              </button>
            ))}
          </div>

          <div className="auth-form">
            <div className="auth-fg">
              <label className="auth-lbl">Email Address</label>
              <input className="auth-inp" type="email" placeholder="you@example.com" />
            </div>
            <div className="auth-fg">
              <label className="auth-lbl">Password</label>
              <input className="auth-inp" type="password" placeholder="••••••••" />
            </div>

            {role === "driver" && (
              <div className="auth-fg">
                <label className="auth-lbl">Driver ID</label>
                <input className="auth-inp" type="text" placeholder="e.g. VCS-DR-0042" />
              </div>
            )}
            {role === "admin" && (
              <div className="auth-fg">
                <label className="auth-lbl">Admin PIN</label>
                <input className="auth-inp" type="password" placeholder="4-digit PIN" />
                <p className="auth-note" style={{ marginTop: ".35rem" }}>Admin PINs are issued by your system administrator.</p>
              </div>
            )}

            <div style={{ display:"flex", justifyContent:"flex-end" }}>
              <button style={{ background:"none", border:"none", fontFamily:"'Josefin Sans',sans-serif", fontSize:".68rem", letterSpacing:".15em", color:"var(--gold-d)", cursor:"pointer" }}>
                Forgot password?
              </button>
            </div>

            <button className="auth-submit">Sign In</button>
          </div>

          {role === "customer" && (
            <p className="auth-foot">
              No account? <button onClick={() => onNavigate("register")}>Register here</button>
            </p>
          )}
          {role !== "customer" && (
            <p className="auth-foot" style={{ marginTop: "1.1rem" }}>
              {role === "driver"
                ? "Driver accounts are created by management. Contact your coordinator."
                : "Admin access is restricted to authorised personnel only."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── REGISTER PAGE ────────────────────────────────────────────────────────────

function RegisterPage({ onNavigate }) {
  const [step, setStep] = useState(1);

  return (
    <div className="auth-page">
      <AuthLeft
        heading="Create Your<br/><em>Account.</em>"
        sub="Register as a customer to book vehicles, track journeys, and manage your travel history."
      />
      <div className="auth-right">
        <div className="auth-box">
          <button className="auth-back" onClick={() => onNavigate("login")}>← Back to Sign In</button>
          <h1 className="auth-title">
            {step === 1 ? <>Customer <em>Registration</em></> : <>Almost <em>Done</em></>}
          </h1>
          <p className="auth-subtitle">
            {step === 1
              ? "Fill in your details to create a customer account."
              : "A few more details to complete your registration."}
          </p>

          {/* Step progress */}
          <div className="step-bar">
            {[1, 2].map((s) => (
              <div key={s} className="step-seg" style={{ background: s <= step ? "var(--gold)" : "rgba(196,154,14,.14)" }} />
            ))}
          </div>

          {step === 1 ? (
            <div className="auth-form">
              <div className="auth-row">
                <div className="auth-fg">
                  <label className="auth-lbl">First Name</label>
                  <input className="auth-inp" type="text" placeholder="John" />
                </div>
                <div className="auth-fg">
                  <label className="auth-lbl">Last Name</label>
                  <input className="auth-inp" type="text" placeholder="Smith" />
                </div>
              </div>
              <div className="auth-fg">
                <label className="auth-lbl">Email Address</label>
                <input className="auth-inp" type="email" placeholder="you@example.com" />
              </div>
              <div className="auth-fg">
                <label className="auth-lbl">Phone Number</label>
                <input className="auth-inp" type="tel" placeholder="+44 7700 000000" />
              </div>
              <div className="auth-divider"><span className="auth-divider-txt">Security</span></div>
              <div className="auth-fg">
                <label className="auth-lbl">Password</label>
                <input className="auth-inp" type="password" placeholder="Min. 8 characters" />
              </div>
              <div className="auth-fg">
                <label className="auth-lbl">Confirm Password</label>
                <input className="auth-inp" type="password" placeholder="Repeat password" />
              </div>
              <button className="auth-submit" onClick={() => setStep(2)}>Continue →</button>
            </div>
          ) : (
            <div className="auth-form">
              <div className="auth-fg">
                <label className="auth-lbl">Address Line 1</label>
                <input className="auth-inp" type="text" placeholder="Street and house number" />
              </div>
              <div className="auth-fg">
                <label className="auth-lbl">City</label>
                <input className="auth-inp" type="text" placeholder="London" />
              </div>
              <div className="auth-row">
                <div className="auth-fg">
                  <label className="auth-lbl">Postcode</label>
                  <input className="auth-inp" type="text" placeholder="SW1A 1AA" />
                </div>
                <div className="auth-fg">
                  <label className="auth-lbl">Country</label>
                  <input className="auth-inp" type="text" defaultValue="United Kingdom" />
                </div>
              </div>
              <div className="auth-fg">
                <label className="auth-lbl">Company <span style={{ color:"var(--muted)", fontWeight:300 }}>(optional)</span></label>
                <input className="auth-inp" type="text" placeholder="Organisation name" />
              </div>
              <div className="info-box">
                <p>
                  This form creates a <strong>customer account</strong>.
                  Driver and admin accounts are created internally by management and cannot be self-registered.
                </p>
              </div>
              <div style={{ display:"flex", alignItems:"flex-start", gap:".65rem" }}>
                <input type="checkbox" id="tos" style={{ accentColor:"var(--gold)", width:"13px", height:"13px", marginTop:".15rem", flexShrink:0 }} />
                <label htmlFor="tos" style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:".7rem", letterSpacing:".04em", color:"var(--muted)", lineHeight:1.55, cursor:"pointer" }}>
                  I agree to the <span style={{ color:"var(--gold-l)" }}>Terms of Service</span> and <span style={{ color:"var(--gold-l)" }}>Privacy Policy</span>
                </label>
              </div>
              <div style={{ display:"flex", gap:".65rem" }}>
                <button onClick={() => setStep(1)} style={{ flexShrink:0, fontFamily:"'Josefin Sans',sans-serif", fontSize:".7rem", letterSpacing:".18em", textTransform:"uppercase", background:"none", border:"1px solid rgba(196,154,14,.22)", color:"var(--muted)", padding:".88rem 1.1rem", cursor:"pointer" }}>
                  ← Back
                </button>
                <button className="auth-submit" style={{ flex:1 }}>Create Account</button>
              </div>
            </div>
          )}

          <p className="auth-foot">
            Already have an account? <button onClick={() => onNavigate("login")}>Sign in</button>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── FLEET VISUAL ─────────────────────────────────────────────────────────────

function FleetVisual({ vehicle }) {
  if (!vehicle) return null;
  const cat = vehicle.cat;
  return (
    <div className="vis-wrap">
      {cat === "car" && (
        <>
          <div className="car-body" />
          <div className="car-roof" />
          <div className="car-wl" />
          <div className="car-wr" />
        </>
      )}
      {cat === "coach" && (
        <>
          <div className="coach-body" />
          <div className="coach-windows">
            {[...Array(6)].map((_, i) => <div className="coach-win" key={i} />)}
          </div>
          <div className="coach-wl" />
          <div className="coach-wm" />
          <div className="coach-wr" />
        </>
      )}
      {cat === "boat" && (
        <>
          <div className="boat-water" />
          <div className="boat-hull" />
          <div className="boat-cabin" />
          <div className="boat-mast" />
        </>
      )}
      <div className="vis-glow" />
    </div>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────

function LandingPage({ onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeFleet, setActiveFleet] = useState(0);
  const [fleetCat, setFleetCat] = useState("all");
  useReveal();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      {/* NAV */}
      <nav className={`nav${scrolled ? " stuck" : ""}`}>
        <div className="logo"><div className="logo-mark" />Vehicle Charter Service</div>
        <ul className="nav-links">
          {["Services","Fleet","About","Contact"].map((l) => (
            <li key={l}><a href={`#${l.toLowerCase()}`}>{l}</a></li>
          ))}
        </ul>
        <div className="nav-actions">
          <button className="btn-ghost" onClick={() => onNavigate("login")}>Sign In</button>
          <button className="btn-gold"  onClick={() => onNavigate("register")}>Register</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-bar" />
        <div className="hero-content">
          <div className="hero-eye">Vehicle Charter Service</div>
          <h1 className="hero-h1">
            Cars, Coaches,
            <strong><em>&amp; Boats</em> for hire.</strong>
          </h1>
          <p className="hero-sub">
            Charter a car for a business trip, a coach for your group, or a boat for a day on the water. Professional drivers and crew, straightforward booking.
          </p>
          <div className="hero-btns">
            <button className="btn-lg" onClick={() => onNavigate("register")}>Book a Vehicle</button>
            <button className="btn-txt"><span />View Our Fleet</button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="stats">
        {STATS.map((s, i) => (
          <div className={`stat reveal d${i+1}`} key={s.label}>
            <div className="stat-v">{s.value}</div>
            <div className="stat-l">{s.label}</div>
          </div>
        ))}
      </div>

      {/* SERVICES */}
      <section className="section" id="services" style={{ background:"var(--black)" }}>
        <div className="svc-head reveal">
          <div>
            <div className="sec-eye">What We Offer</div>
            <h2 className="sec-h2">Charter Services<br /><em>by Land &amp; Water</em></h2>
            <p className="svc-desc">Whether you need a car, a coach, or a boat — we have the right vehicle and crew for the job.</p>
          </div>
        </div>
        <div className="svc-grid">
          {SERVICES.map((s, i) => (
            <div className={`svc-card reveal d${i+1}`} key={s.title}>
              <span className="svc-icon">{s.icon}</span>
              <div className="svc-title">{s.title}</div>
              <p className="svc-text">{s.desc}</p>
              <div className="svc-more">Learn more →</div>
            </div>
          ))}
        </div>
      </section>

      {/* FLEET */}
      <section className="section" id="fleet" style={{ background:"var(--b2)" }}>
        <div className="fleet-wrap">
          <div>
            <div className="sec-eye reveal">Our Fleet</div>
            <h2 className="sec-h2 reveal d1">Cars, Coaches<br /><em>&amp; Boats</em></h2>
            <div className="fleet-cats reveal d2">
              {FLEET_CATS.map((c) => (
                <button
                  key={c}
                  className={`fleet-cat-btn${fleetCat === c ? " on" : ""}`}
                  onClick={() => { setFleetCat(c); setActiveFleet(0); }}
                >
                  {c === "all" ? "All" : c === "car" ? "🚗 Cars" : c === "coach" ? "🚌 Coaches" : "⛵ Boats"}
                </button>
              ))}
            </div>
            <div className="fleet-tabs reveal d3">
              {FLEET.filter(v => fleetCat === "all" || v.cat === fleetCat).map((v, i) => (
                <div key={v.name} className={`fleet-tab${activeFleet === i ? " on" : ""}`} onClick={() => setActiveFleet(i)}>
                  <div>
                    <div className="ft-name">{v.name}</div>
                    <div className="ft-type">{v.type} · {v.seats}</div>
                  </div>
                  <div className="ft-tag">{v.tag}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="fleet-vis-col">
            <div className="fleet-vis reveal d2">
              <FleetVisual vehicle={FLEET.filter(v => fleetCat === "all" || v.cat === fleetCat)[activeFleet] || FLEET[0]} />
              <div className="fleet-info">
                <div className="fi-name">{(FLEET.filter(v => fleetCat === "all" || v.cat === fleetCat)[activeFleet] || FLEET[0]).name}</div>
                <div className="fi-detail">
                  {(FLEET.filter(v => fleetCat === "all" || v.cat === fleetCat)[activeFleet] || FLEET[0]).type}
                  <b>·</b>
                  {(FLEET.filter(v => fleetCat === "all" || v.cat === fleetCat)[activeFleet] || FLEET[0]).seats}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BOOKING CTA */}
      <section className="section" id="contact" style={{ background:"var(--black)" }}>
        <div className="book-wrap reveal">
          <div>
            <div className="sec-eye">Make a Booking</div>
            <h2 className="sec-h2">Ready to<br /><em>Get Moving?</em></h2>
            <p className="book-sub">Fill in the quick form to request a vehicle. Our team will confirm availability and get back to you promptly.</p>
          </div>
          <div className="book-form">
            <div><label className="f-lbl">Pickup Location</label><input className="f-inp" placeholder="Enter address or postcode" /></div>
            <div><label className="f-lbl">Date &amp; Time</label><input className="f-inp" type="datetime-local" /></div>
            <div>
              <label className="f-lbl">Vehicle Type</label>
              <select className="f-inp" style={{ cursor:"pointer" }}>
                <option value="">Select a vehicle type</option>
                {FLEET.map((v) => <option key={v.name}>{v.name} — {v.seats}</option>)}
              </select>
            </div>
            <button className="btn-book" onClick={() => onNavigate("register")}>Request a Quote</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="foot-grid">
          <div>
            <div className="logo"><div className="logo-mark" />Vehicle Charter Service</div>
            <p className="foot-desc">A professional vehicle charter operator serving individuals, businesses, and groups across the region.</p>
          </div>
          {[
            { t:"Services", ls:["Corporate Charter","Event Transport","Airport Transfers","Long-Distance Hire"] },
            { t:"Company",  ls:["About Us","Our Fleet","Careers","News"] },
            { t:"Contact",  ls:["0800 000 0000","info@vcs.co.uk","Mon–Sun 24hr","Live Chat"] },
          ].map((col) => (
            <div key={col.t}>
              <div className="foot-ht">{col.t}</div>
              <ul className="foot-ul">{col.ls.map((l) => <li key={l}><a href="#">{l}</a></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="foot-bot">
          <div className="foot-copy">© 2026 <span>Vehicle Charter Service</span>. All rights reserved.</div>
          <div className="foot-copy">Privacy · Terms</div>
        </div>
      </footer>
    </>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState("home");

  const navigate = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <>
      <style>{CSS}</style>
      {page === "home"     && <LandingPage  onNavigate={navigate} />}
      {page === "login"    && <LoginPage    onNavigate={navigate} />}
      {page === "register" && <RegisterPage onNavigate={navigate} />}
    </>
  );
}