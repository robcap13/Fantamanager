// Pagina Rose — logica di caricamento, filtro e rendering

let TEAMS = [];
let currentTeamId = null;
let currentFilter = 'tutti';
let currentSearch = '';
let currentView = 'semplice'; // 'semplice' | 'dettagliata'

const STATUS_META = {
  rinnovabile: { label: 'Rinnovabile', cls: 'status-rinnovabile' },
  soloOpzione: { label: 'Solo opzionabile', cls: 'status-solo-opzione' },
  scadenza: { label: 'In scadenza', cls: 'status-scadenza' },
};

function statusKey(player) {
  if (player.rinnovabile) return 'rinnovabile';
  if (player.opzionabile) return 'soloOpzione';
  return 'scadenza';
}

function formatCurrency(n) {
  return n.toLocaleString('it-IT');
}

function renderTeamPicker() {
  const picker = document.getElementById('team-picker');
  picker.innerHTML = '';
  TEAMS.forEach((t) => {
    const btn = document.createElement('button');
    btn.className = 'team-chip' + (t.id === currentTeamId ? ' active' : '');
    btn.textContent = t.nome;
    btn.addEventListener('click', () => {
      currentTeamId = t.id;
      currentFilter = 'tutti';
      document.getElementById('player-search').value = '';
      currentSearch = '';
      renderTeamPicker();
      renderTeam();
    });
    picker.appendChild(btn);
  });
}

function renderTeam() {
  const team = TEAMS.find((t) => t.id === currentTeamId);
  if (!team) return;

  document.getElementById('team-name').textContent = team.nome;
  document.getElementById('team-manager').textContent = team.manager;
  document.getElementById('metric-giocatori').textContent = team.numGiocatori;
  document.getElementById('metric-speso').textContent = formatCurrency(team.speso);
  document.getElementById('metric-residuo').textContent = formatCurrency(1000 - team.speso);

  renderFilterCounts(team);
  renderTable(team);
}

function renderFilterCounts(team) {
  const counts = { tutti: team.giocatori.length, rinnovabile: 0, soloOpzione: 0, scadenza: 0 };
  team.giocatori.forEach((p) => {
    counts[statusKey(p)]++;
  });

  document.querySelectorAll('.filter-btn').forEach((btn) => {
    const key = btn.dataset.filter;
    const label = btn.dataset.label;
    btn.textContent = `${label} (${counts[key]})`;
    btn.classList.toggle('active', key === currentFilter);
  });
}

function filteredPlayers(team) {
  let players = team.giocatori;

  if (currentFilter !== 'tutti') {
    players = players.filter((p) => statusKey(p) === currentFilter);
  }

  if (currentSearch.trim()) {
    const q = currentSearch.trim().toLowerCase();
    players = players.filter((p) => p.nome.toLowerCase().includes(q));
  }
  return players;
}

function renderTable(team) {
  const players = filteredPlayers(team);

  const wrap = document.getElementById('roster-table-wrap');
  const empty = document.getElementById('empty-state');
  const theadRow = document.getElementById('roster-head-row');
  const tbody = document.getElementById('roster-body');

  if (players.length === 0) {
    wrap.style.display = 'none';
    empty.style.display = 'block';
    return;
  }
  wrap.style.display = 'block';
  empty.style.display = 'none';

  tbody.innerHTML = '';

  if (currentView === 'semplice') {
    theadRow.innerHTML = `
      <th>Ruolo</th>
      <th>Giocatore</th>
      <th>Squadra Serie A</th>
      <th>Origine</th>
      <th>Prossima sessione</th>
      <th style="text-align:right">Costo (FM)</th>
    `;
    players.forEach((p) => {
      const meta = STATUS_META[statusKey(p)];
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><span class="role-pill">${p.ruolo || '—'}</span></td>
        <td class="player-name">${p.nome}</td>
        <td class="serieA">${p.squadraSerieA || '—'}</td>
        <td>${p.stato}</td>
        <td><span class="status-pill ${meta.cls}">${meta.label}</span></td>
        <td class="cost">${formatCurrency(p.costo)}</td>
      `;
      tbody.appendChild(tr);
    });
  } else {
    // Vista dettagliata — rispecchia il tracciato del file rose originale
    theadRow.innerHTML = `
      <th>Ruolo</th>
      <th>Giocatore</th>
      <th>Serie A</th>
      <th style="text-align:right">Costo</th>
      <th>Acquisto</th>
      <th>Rinn. 1</th>
      <th>Rinn. 2</th>
      <th>Opz.</th>
      <th>Rinn. 3</th>
      <th style="text-align:center">Rinnovi</th>
      <th>Rinnovabile</th>
      <th>Opzionabile</th>
      <th>Stato</th>
    `;
    players.forEach((p) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><span class="role-pill">${p.ruolo || '—'}</span></td>
        <td class="player-name">${p.nome}</td>
        <td class="serieA">${p.squadraSerieA || '—'}</td>
        <td class="cost">${formatCurrency(p.costo)}</td>
        <td class="date-cell">${p.acquisto || '—'}</td>
        <td class="date-cell">${p.rinn1 || '—'}</td>
        <td class="date-cell">${p.rinn2 || '—'}</td>
        <td class="date-cell">${p.opz || '—'}</td>
        <td class="date-cell">${p.rinn3 || '—'}</td>
        <td style="text-align:center">${p.rinnoviFatti}</td>
        <td>${p.rinnovabile ? '<span class="tag-si">SÌ</span>' : '<span class="tag-no">NO</span>'}</td>
        <td>${p.opzionabile ? '<span class="tag-si">SÌ</span>' : '<span class="tag-no">NO</span>'}</td>
        <td class="stato-cell">${p.stato}</td>
      `;
      tbody.appendChild(tr);
    });
  }
}

function initViewToggle() {
  document.querySelectorAll('.view-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      currentView = btn.dataset.view;
      document.querySelectorAll('.view-btn').forEach((b) => b.classList.toggle('active', b === btn));
      const team = TEAMS.find((t) => t.id === currentTeamId);
      renderTable(team);
    });
  });
}

function initFilters() {
  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      currentFilter = btn.dataset.filter;
      renderTeam();
    });
  });

  document.getElementById('player-search').addEventListener('input', (e) => {
    currentSearch = e.target.value;
    const team = TEAMS.find((t) => t.id === currentTeamId);
    renderTable(team);
  });
}

async function init() {
  try {
    TEAMS = await loadJSON('rose.json');
    TEAMS.sort((a, b) => a.nome.localeCompare(b.nome, 'it'));
    currentTeamId = TEAMS[0].id;
    renderTeamPicker();
    initFilters();
    initViewToggle();
    renderTeam();
  } catch (err) {
    document.getElementById('roster-table-wrap').outerHTML =
      '<p class="empty-state">Errore nel caricamento delle rose. Riprova più tardi.</p>';
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', init);
