// Pagina Albo d'oro — calcola il palmarès a partire dallo storico stagione per stagione

let DATA = null;

function computeStandings() {
  const teams = {};
  Object.entries(DATA.squadre).forEach(([id, info]) => {
    teams[id] = { id, nome: info.nome, manager: info.manager, attiva: info.attiva, oro: 0, argento: 0, bronzo: 0, coppe: 0 };
  });

  DATA.stagioni.forEach((s) => {
    if (s.primo && teams[s.primo]) teams[s.primo].oro++;
    if (s.secondo && teams[s.secondo]) teams[s.secondo].argento++;
    if (s.terzo && teams[s.terzo]) teams[s.terzo].bronzo++;
    (s.coppe || []).forEach((tid) => {
      if (teams[tid]) teams[tid].coppe++;
    });
  });

  return teams;
}

// Ordina prima per ori, a parità per argenti, poi bronzi, infine coppe
function compareByPalmares(a, b) {
  if (b.oro !== a.oro) return b.oro - a.oro;
  if (b.argento !== a.argento) return b.argento - a.argento;
  if (b.bronzo !== a.bronzo) return b.bronzo - a.bronzo;
  return b.coppe - a.coppe;
}

function trophyItem(icon, value, title) {
  return `<span class="t-item" title="${title}">${icon} ${value}</span>`;
}

function renderPodium(teamsArr) {
  const top3 = [...teamsArr]
    .filter((t) => t.oro + t.argento + t.bronzo + t.coppe > 0)
    .sort(compareByPalmares)
    .slice(0, 3);

  const container = document.getElementById('podium');
  const ranks = ['', 'silver', 'bronze'];
  const rankLabels = ['1° per palmarès', '2° per palmarès', '3° per palmarès'];

  container.innerHTML = '';
  top3.forEach((t, i) => {
    const card = document.createElement('div');
    card.className = `podium-card ${ranks[i]}`;
    card.innerHTML = `
      <span class="rank">${rankLabels[i]}</span>
      <h3>${t.nome}</h3>
      <span class="manager">${t.manager}</span>
      <div class="trophy-row">
        ${trophyItem('🥇', t.oro, 'Vittorie')}
        ${trophyItem('🥈', t.argento, 'Secondi posti')}
        ${trophyItem('🥉', t.bronzo, 'Terzi posti')}
        ${trophyItem('🏆', t.coppe, 'Coppe')}
      </div>
    `;
    container.appendChild(card);
  });
}

function renderStandingsTable(teamsArr, tbodyId) {
  const tbody = document.getElementById(tbodyId);
  tbody.innerHTML = '';
  const sorted = [...teamsArr].sort(compareByPalmares);

  sorted.forEach((t) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="name">${t.nome}</td>
      <td class="manager-col">${t.manager}</td>
      <td class="medal-cell">${t.oro || '—'}</td>
      <td class="medal-cell">${t.argento || '—'}</td>
      <td class="medal-cell">${t.bronzo || '—'}</td>
      <td class="medal-cell">${t.coppe || '—'}</td>
    `;
    tbody.appendChild(tr);
  });
}

function nomeSquadra(id) {
  if (!id) return '<em style="opacity:0.7">da definire</em>';
  return DATA.squadre[id] ? DATA.squadre[id].nome : id;
}

function renderSeasonHistory() {
  const tbody = document.getElementById('season-history-body');
  tbody.innerHTML = '';

  // Le stagioni più recenti in cima
  const stagioni = [...DATA.stagioni].reverse();

  stagioni.forEach((s) => {
    const tr = document.createElement('tr');
    if (s.provvisoria) tr.classList.add('season-provisional');
    const coppeLabel = (s.coppe || []).length ? s.coppe.map(nomeSquadra).join(' · ') : '<em style="opacity:0.7">da definire</em>';
    const label = s.provvisoria ? `${s.label} <span class="prov-badge" title="Anno e/o piazzamenti da confermare">provvisorio</span>` : s.label;
    tr.innerHTML = `
      <td class="name">${label}</td>
      <td>🥇 ${nomeSquadra(s.primo)}</td>
      <td>🥈 ${nomeSquadra(s.secondo)}</td>
      <td>🥉 ${nomeSquadra(s.terzo)}</td>
      <td>🏆 ${coppeLabel}</td>
    `;
    tbody.appendChild(tr);
  });
}

function initFormerToggle() {
  const btn = document.getElementById('former-toggle');
  const section = document.getElementById('former-section');
  btn.addEventListener('click', () => {
    const open = section.classList.toggle('open');
    btn.textContent = open
      ? 'Nascondi le squadre non più in lega'
      : 'Mostra le squadre non più in lega';
  });
}

async function init() {
  try {
    DATA = await loadJSON('albo-oro.json');
    const teams = computeStandings();
    const teamsArr = Object.values(teams);
    const attuali = teamsArr.filter((t) => t.attiva);
    const storiche = teamsArr.filter((t) => !t.attiva);

    renderPodium(attuali);
    renderStandingsTable(attuali, 'hof-body');
    renderStandingsTable(storiche, 'former-body');
    renderSeasonHistory();
    initFormerToggle();
  } catch (err) {
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', init);
