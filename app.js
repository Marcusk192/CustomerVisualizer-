// Kitchen style planner: a simple, step-by-step way for customers to try layouts, door styles,
// colours and finishes on real kitchen photos, then email their ideas ahead of a design meeting.
// Plain static site (no server). Settings are in config.js. Works on its own or in an iframe (Wix).
(function () {
  const C = window.PLANNER_CONFIG;
  const $ = (s) => document.querySelector(s);
  function h(tag, attrs = {}, ...kids) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k.startsWith('on')) el.addEventListener(k.slice(2).toLowerCase(), v);
      else if (k === 'html') el.innerHTML = v;
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (const c of kids.flat(Infinity)) if (c != null && c !== false) el.append(c instanceof Node ? c : document.createTextNode(String(c)));
    return el;
  }
  const svg = (markup) => { const d = document.createElement('div'); d.innerHTML = markup.trim(); return d.firstChild; };

  // ---------- data from config.js ----------
  const IMG = 'img/';
  const styles = C.styles.map((s) => ({ ...s, colours: s.colours.map(([id, name, hex]) => ({ id, name, hex, image: `${IMG}${s.set}_${id}.jpg`, thumb: `${IMG}${s.set}_${id}-t.jpg` })) }));
  const worktops = C.worktops.map(([id, name, group]) => ({ id, name, group, image: `${IMG}wt_${id}.jpg` }));
  const handles = C.handles.map(([id, name, hex, kind]) => ({ id, name, hex, kind }));
  const layouts = C.layouts.map(([id, name, desc]) => ({ id, name, desc }));
  const sizes = C.sizes.map(([id, name]) => ({ id, name }));
  const appliances = C.appliances.map(([id, label, opts]) => ({ id, label, options: opts.map(([oid, name]) => ({ id: oid, name })) }));
  const storage = C.storage.map(([id, label, desc]) => ({ id, label, desc, corner: id === 'carousel' }));
  const hasCorner = (l) => ['l', 'u', 'island'].includes(l);

  const STEPS = [
    { id: 'layout', title: C.title || 'Choose a layout', lead: C.intro || 'Which shape is closest to your kitchen?' },
    { id: 'doors', title: 'Door style & colour', lead: 'Pick a style you like, then try the colours. These are real kitchens from our ranges.' },
    { id: 'worktop', title: 'Worktop', lead: 'Choose a worktop to go with your doors.' },
    { id: 'handles', title: 'Handles', lead: 'The finishing touch.' },
    { id: 'summary', title: 'Your kitchen style', lead: 'Here is the look you have put together.' },
    { id: 'appliances', title: 'Appliances', lead: 'What would you like in your kitchen?' },
    { id: 'storage', title: 'Storage extras', lead: 'Tick anything you would like. You can change your mind at the meeting.' },
    { id: 'send', title: 'Send us your ideas', lead: 'We will have your ideas ready to look at when we meet.' },
  ];

  // ---------- choices (remembered in the browser) ----------
  const STORE = 'hok-kitchen-planner-v1';
  const defaults = () => ({
    layout: 'l', size: 'medium', style: styles[0].id, colour: styles[0].colours[0].id, worktop: worktops[0].id, handle: handles[0] ? handles[0].id : '',
    ...Object.fromEntries(appliances.map((a) => [a.id, a.options[0].id])), storage: [],
  });
  function clean(c) {
    const d = defaults(); const o = { ...d, ...(c || {}) };
    if (!layouts.some((x) => x.id === o.layout)) o.layout = d.layout;
    if (!sizes.some((x) => x.id === o.size)) o.size = d.size;
    const st = styles.find((x) => x.id === o.style) || styles[0]; o.style = st.id;
    if (!st.colours.some((x) => x.id === o.colour)) o.colour = st.colours[0].id;
    if (!worktops.some((x) => x.id === o.worktop)) o.worktop = d.worktop;
    if (!handles.some((x) => x.id === o.handle)) o.handle = d.handle;
    for (const a of appliances) if (!a.options.some((x) => x.id === o[a.id])) o[a.id] = d[a.id];
    o.storage = Array.isArray(o.storage) ? o.storage.filter((id) => storage.some((x) => x.id === id)) : [];
    return o;
  }
  let choices; try { choices = clean(JSON.parse(localStorage.getItem(STORE) || 'null')); } catch { choices = clean(null); }
  let step = 0; let sent = null;
  const save = () => { try { localStorage.setItem(STORE, JSON.stringify(choices)); } catch { /* storage blocked in some iframes */ } };
  function set(patch) { choices = clean({ ...choices, ...patch }); save(); render(false); }
  const style = () => styles.find((s) => s.id === choices.style);
  const colour = () => style().colours.find((c) => c.id === choices.colour);
  const worktop = () => worktops.find((w) => w.id === choices.worktop);
  const handle = () => handles.find((x) => x.id === choices.handle);

  // ---------- icons ----------
  function layoutIcon(id) {
    const c = '#1f3a34'; const g = '#b08d57'; const room = '<rect x="10" y="10" width="180" height="130" fill="#fff" stroke="#c8ccd0" stroke-width="3"/>';
    const runs = {
      straight: `<rect x="10" y="10" width="180" height="26" fill="${c}"/>`,
      galley: `<rect x="10" y="10" width="180" height="26" fill="${c}"/><rect x="10" y="114" width="180" height="26" fill="${c}"/>`,
      l: `<rect x="10" y="10" width="180" height="26" fill="${c}"/><rect x="10" y="10" width="26" height="130" fill="${c}"/>`,
      u: `<rect x="10" y="10" width="180" height="26" fill="${c}"/><rect x="10" y="10" width="26" height="130" fill="${c}"/><rect x="164" y="10" width="26" height="130" fill="${c}"/>`,
      island: `<rect x="10" y="10" width="180" height="26" fill="${c}"/><rect x="10" y="10" width="26" height="130" fill="${c}"/><rect x="80" y="74" width="80" height="30" fill="${g}"/>`,
    };
    return svg(`<svg viewBox="0 0 200 150">${room}${runs[id] || runs.l}</svg>`);
  }
  function shade(hex, f) {
    const n = parseInt(hex.slice(1), 16); const c = (v) => Math.max(0, Math.min(255, Math.round(v * f))).toString(16).padStart(2, '0');
    return `#${c(n >> 16)}${c((n >> 8) & 255)}${c(n & 255)}`;
  }
  function handleIcon(x) {
    const c = x.hex; const e = shade(c, 0.6);
    const body = x.kind === 'knob' ? `<circle cx="60" cy="45" r="16" fill="${c}" stroke="${e}" stroke-width="2"/>`
      : x.kind === 'cup' ? `<path d="M25 35 q35 40 70 0 z" fill="${c}" stroke="${e}" stroke-width="2"/>`
        : `<rect x="15" y="38" width="90" height="12" rx="6" fill="${c}" stroke="${e}" stroke-width="2"/><rect x="25" y="46" width="8" height="12" fill="${e}"/><rect x="87" y="46" width="8" height="12" fill="${e}"/>`;
    return svg(`<svg viewBox="0 0 120 90"><rect x="5" y="5" width="110" height="80" rx="4" fill="#f4f2ee"/>${body}</svg>`);
  }

  // ---------- photo stage: colour changes cross-fade between photos of the same kitchen ----------
  const preloaded = new Set();
  const preload = (src) => { if (!preloaded.has(src)) { preloaded.add(src); new Image().src = src; } };
  let shownSrc = null;
  function renderStage() {
    const st = style(); const col = colour(); const wt = worktop(); const hd = handle();
    if (col.image !== shownSrc) {
      const [a, b] = document.querySelectorAll('.photo img');
      const front = a.classList.contains('on') ? a : b; const back = front === a ? b : a;
      back.onload = () => { back.classList.add('on'); front.classList.remove('on'); };
      back.src = col.image; shownSrc = col.image;
    }
    const chip = (bg, label, value) => h('div', { class: 'chip' }, h('span', { class: 'sw', style: bg }), h('div', {}, h('small', {}, label), h('b', {}, value)));
    $('.picks').replaceChildren(...[
      chip(`background:${col.hex}`, 'Doors', `${st.name} · ${col.name}`),
      step >= 2 ? chip(`background:url(${wt.image}) center/cover`, 'Worktop', wt.name) : null,
      step >= 3 && hd ? chip(`background:${hd.hex}`, 'Handles', hd.name) : null,
    ].filter(Boolean));
    $('.credit').textContent = `Shown: ${st.desc || st.name} in ${col.name}. Worktop and handles in the photo are examples.`;
    st.colours.forEach((c) => preload(c.image));
  }

  // ---------- panel ----------
  const card = (on, onclick, pic, title, sub) => h('button', { class: `card${on ? ' on' : ''}`, onclick }, pic ? h('div', { class: 'pic' }, pic) : null, h('b', {}, title), sub ? h('small', {}, sub) : null);
  const seg = (label, value, opts, onpick, hint) => h('div', { class: 'seg-wrap' }, label ? h('label', {}, label) : null,
    h('div', { class: 'seg' }, opts.map((o) => h('button', { class: o.id === value ? 'on' : '', onclick: () => onpick(o.id) }, o.name))),
    hint ? h('div', { class: 'hint' }, hint) : null);

  function summaryRows() {
    const c = choices; const st = style();
    const app = appliances.map((a) => { const o = a.options.find((x) => x.id === c[a.id]); return o && !['none', 'no'].includes(o.id) ? (['yes'].includes(o.id) ? a.label : `${a.label}: ${o.name}`) : null; }).filter(Boolean);
    const sto = storage.filter((s) => c.storage.includes(s.id) && (!s.corner || hasCorner(c.layout))).map((s) => s.label);
    return [
      ['Layout', `${layouts.find((l) => l.id === c.layout).name}, ${sizes.find((s) => s.id === c.size).name.toLowerCase()} room`],
      ['Doors', `${st.name} (${st.desc ? st.desc.split(' — ')[0] : ''}), ${colour().name}`],
      ['Worktop', worktop().name],
      ['Handles', handle() ? handle().name : '—'],
      ['Appliances', app.join(', ') || 'None chosen'],
      ['Storage', sto.join(', ') || 'Standard'],
    ];
  }
  const summaryTable = (n = 6) => h('table', { class: 'summary' }, summaryRows().slice(0, n).map(([a, b]) => h('tr', {}, h('td', {}, a), h('td', {}, b))));

  function renderContent() {
    const s = STEPS[step]; const c = choices;
    const head = [h('div', { class: 'stepno' }, `Step ${step + 1} of ${STEPS.length}`), h('h1', {}, s.title), h('p', { class: 'lead' }, s.lead)];
    let body = [];
    if (s.id === 'layout') {
      body = [h('div', { class: 'cards' }, layouts.map((l) => card(c.layout === l.id, () => set({ layout: l.id }), layoutIcon(l.id), l.name, l.desc))),
        h('h2', {}, 'Room size'), seg('', c.size, sizes, (v) => set({ size: v }), 'A rough idea is fine. We measure up later.')];
    }
    if (s.id === 'doors') {
      body = [h('div', { class: 'cards' }, styles.map((st) => card(c.style === st.id, () => set({ style: st.id }), h('img', { src: (st.colours.find((x) => x.id === c.colour) || st.colours[0]).thumb, alt: '', loading: 'lazy' }), st.name, st.desc))),
        h('h2', {}, `Colour — ${colour().name}`),
        h('div', { class: 'swatches' }, style().colours.map((col) => h('button', { class: `sw${c.colour === col.id ? ' on' : ''}`, onclick: () => set({ colour: col.id }) }, h('span', { style: `background:${col.hex}` }), col.name)))];
    }
    if (s.id === 'worktop') body = [h('div', { class: 'cards' }, worktops.map((w) => card(c.worktop === w.id, () => set({ worktop: w.id }), h('img', { src: w.image, alt: '', loading: 'lazy' }), w.name, w.group)))];
    if (s.id === 'handles') body = [h('div', { class: 'cards' }, handles.map((x) => card(c.handle === x.id, () => set({ handle: x.id }), handleIcon(x), x.name)))];
    if (s.id === 'summary') body = [summaryTable(4), h('p', { class: 'muted', style: 'font-size:13px' }, 'Your own kitchen will be designed to fit your room at the meeting. Next, tell us about appliances and storage.')];
    if (s.id === 'appliances') body = appliances.map((a) => seg(a.label, c[a.id], a.options, (v) => set({ [a.id]: v })));
    if (s.id === 'storage') {
      body = [h('div', { class: 'cards one' }, storage.filter((x) => !x.corner || hasCorner(c.layout)).map((x) => {
        const on = c.storage.includes(x.id);
        return h('button', { class: `card row${on ? ' on' : ''}`, onclick: () => set({ storage: on ? c.storage.filter((i) => i !== x.id) : [...c.storage, x.id] }) },
          h('span', { class: 'tick' }, on ? '✓' : ''), h('span', { class: 'grow' }, h('b', {}, x.label), h('small', {}, x.desc)));
      }))];
    }
    if (s.id === 'send') body = sendStep();
    $('#content').replaceChildren(...head, ...body.flat(Infinity).filter(Boolean));
  }

  function sendStep() {
    if (sent) {
      return [h('div', { class: 'thanks' }, h('div', { class: 'ok' }, '✓'), h('h1', {}, 'Thank you!'),
        h('p', {}, 'We have your ideas and will be in touch soon to arrange your design meeting.'),
        C.phone ? h('p', { class: 'muted' }, `Prefer to talk now? Call ${C.phone}`) : null,
        h('button', { class: 'btn', onclick: () => { sent = null; step = 0; render(); } }, 'Start again'))];
    }
    const err = h('div', { class: 'err' });
    const f = (name, label, type = 'text', req = false) => [h('label', { for: `f-${name}` }, label + (req ? ' *' : '')),
      h(type === 'textarea' ? 'textarea' : 'input', { id: `f-${name}`, name, type: type === 'textarea' ? null : type, required: req, autocomplete: { name: 'name', email: 'email', phone: 'tel' }[name] || 'off' })];
    const submit = h('button', { class: 'btn primary', type: 'submit', style: 'width:100%;margin-top:14px' }, 'Send my ideas');
    const form = h('form', { onsubmit: async (e) => {
      e.preventDefault(); err.textContent = '';
      const fd = Object.fromEntries(new FormData(form));
      if (fd._honey) return;
      submit.disabled = true; submit.textContent = 'Sending…';
      const base = new URL('.', location.href).href;
      const payload = {
        _subject: `Kitchen ideas from ${fd.name}`, _template: 'table', _captcha: 'false',
        Name: fd.name, Email: fd.email, Phone: fd.phone || '', Area: fd.area || '', Notes: fd.notes || '',
        ...Object.fromEntries(summaryRows()),
        'Kitchen photo': base + colour().image, 'Worktop sample': base + worktop().image,
      };
      try {
        const r = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(C.enquiryEmail)}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) });
        const data = await r.json().catch(() => ({}));
        if (!r.ok || String(data.success) === 'false') throw new Error(data.message || 'Sorry, that did not send. Please try again or call us.');
        sent = true; renderContent(); renderBar();
        try { window.parent.postMessage({ type: 'kitchen-ideas-sent' }, '*'); } catch { /* not embedded */ }
      } catch (ex) { err.textContent = ex.message || 'Sorry, that did not send. Please try again or call us.'; submit.disabled = false; submit.textContent = 'Send my ideas'; }
    } },
    f('name', 'Your name', 'text', true), f('email', 'Email', 'email', true), f('phone', 'Phone', 'tel'), f('area', 'Town / county'),
    f('notes', 'Anything else? (optional)', 'textarea'),
    h('input', { class: 'hp', name: '_honey', tabindex: '-1', autocomplete: 'off', 'aria-hidden': 'true' }),
    submit, err,
    h('p', { class: 'muted', style: 'font-size:12px' }, 'We only use your details to contact you about your kitchen.'));
    return [summaryTable(), h('h2', {}, 'Your details'), form];
  }

  function renderBar() {
    const back = step > 0 && !sent ? h('button', { class: 'btn', onclick: () => { step -= 1; render(); } }, 'Back') : null;
    const next = step < STEPS.length - 1 ? h('button', { class: `btn ${step === 3 ? 'gold' : 'primary'}`, onclick: () => { step += 1; render(); } }, step === 3 ? 'See my style' : 'Next') : null;
    $('#bar').style.display = sent ? 'none' : '';
    $('#bar').replaceChildren(h('div', { class: 'est' }), ...[back, next].filter(Boolean));
  }

  function render(scrollTop = true) {
    $('#steps').replaceChildren(...STEPS.map((_, i) => h('i', { class: i < step ? 'done' : i === step ? 'on' : '' })));
    renderStage(); renderContent(); renderBar();
    if (scrollTop) { $('#content').scrollTop = 0; if (window.innerWidth <= 820) window.scrollTo(0, 0); }
  }
  render();
})();
