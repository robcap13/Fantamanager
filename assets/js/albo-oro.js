// Pagina Albo d'oro — podio, classifica generale e squadre storiche

function totalMedals(t) {
  return t.oro * 3 + t.argento * 2 + t.bronzo * 1 + t.coppe * 2;
}

function renderPodium(teams) {
  const top3 = [...teams]
    .filter((t) => t.oro + t.argento + t.bronzo + t.coppe > 0)
    .sort((a, b) => totalMedals(b) - totalMedals(a))
    .slice(0, 3);

  const container = document.getElementById('podium');
  const ranks = ['gold', 'silver', 'bronze'];
  const rankLabels = ['1° per palmarès', '2° per palmarès', '3° per palmarès'];

  container.innerHTML = '';
  top3.forEach((t, i) => {
    const card = document.createElement('div');
    card.className = `podium-card ${ranks[i] === 'gold' ? '' : ranks[i]}`;
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

function trophyItem(icon, value, title) {
  return `<span class="t-item" title="${title}">${icon} ${value}</span>`;
}

function renderTable(teams, tbodyId) {
  const tbody = document.getElementById(tbodyId);
  tbody.innerHTML = '';

  const sorted = [...teams].sort((a, b) => totalMedals(b) - totalMedals(a));

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
    const data = await loadJSON('albo-oro.json');
    renderPodium(data.attuali);
    renderTable(data.attuali, 'hof-body');
    renderTable(data.storiche, 'former-body');
    initFormerToggle();
  } catch (err) {
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', init);
