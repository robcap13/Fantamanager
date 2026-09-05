// Utility comuni a tutte le pagine

function initNavToggle() {
  const btn = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!btn || !links) return;
  btn.addEventListener('click', () => {
    links.classList.toggle('open');
  });
}

// Determina il percorso base ai dati JSON in modo che funzioni
// sia in locale sia su GitHub Pages (repo servito da sottocartella)
function dataPath(file) {
  return `data/${file}`;
}

async function loadJSON(file) {
  const res = await fetch(dataPath(file));
  if (!res.ok) throw new Error(`Impossibile caricare ${file}`);
  return res.json();
}

document.addEventListener('DOMContentLoaded', initNavToggle);
