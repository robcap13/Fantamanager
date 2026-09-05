# Fantamanager 26/27 — sito della lega

Sito statico (HTML/CSS/JS puri, nessun build step) con:

- **Home** (`index.html`) — panoramica della lega
- **Rose** (`rose.html`) — rose delle 10 squadre con stato contrattuale di ogni giocatore
- **Regolamento** (`regolamento.html`) — regolamento completo
- **Albo d'oro** (`albo-oro.html`) — podi e coppe vinte da ogni squadra, storia e squadre non più in lega

I dati di rose e albo d'oro sono in `data/rose.json` e `data/albo-oro.json`: per aggiornarli ogni stagione basta modificare questi due file, senza toccare il codice.

## Come pubblicarlo su GitHub Pages

1. Crea un nuovo repository su GitHub (es. `fantamanager`) e carica tutto il contenuto di questa cartella nella root del repository (mantenendo la struttura di cartelle `assets/` e `data/`).
2. Su GitHub vai in **Settings → Pages**.
3. In **Build and deployment**, seleziona come source: **Deploy from a branch**.
4. Scegli il branch `main` e la cartella `/ (root)`, poi salva.
5. Dopo un paio di minuti il sito sarà visibile su `https://<tuo-utente>.github.io/<nome-repo>/`.

Non serve alcun build step: essendo file statici, ogni modifica pushata su GitHub si riflette automaticamente sul sito pubblicato (di solito entro 1-2 minuti).

## Come aggiornare i dati ogni stagione/sessione di mercato

### Rose (`data/rose.json`)
È un array di squadre. Ogni squadra ha:

```json
{
  "id": "pappone-united",
  "nome": "Pappone United",
  "manager": "Roberto Capasso",
  "giocatori": [
    {
      "ruolo": "Por",
      "nome": "Caprile",
      "squadraSerieA": "CAG",
      "costo": 20,
      "acquisto": "set-25",
      "rinnovi": ["feb-26"],
      "opzione": "",
      "rinnoviFatti": 1,
      "rinnovabile": true,
      "opzionabile": true,
      "stato": "Confermato (rinnovo)"
    }
  ],
  "speso": 992,
  "numGiocatori": 29
}
```

Per una nuova sessione di mercato, il modo più semplice è ripartire dal foglio Google Sheets / Excel che usate già per gestire l'asta ed esportarlo in un formato simile; se preferite, potete anche modificare i singoli giocatori a mano nel JSON.

I campi `rinnovabile` e `opzionabile` sono quelli che pilotano il pallino colorato "Rinnovabile / Solo opzionabile / In scadenza" mostrato sul sito.

### Albo d'oro (`data/albo-oro.json`)
Due liste, `attuali` (squadre in lega) e `storiche` (squadre non più in lega). Ogni squadra ha i conteggi `oro`, `argento`, `bronzo`, `coppe`. Basta incrementare i numeri a fine stagione.

## Sviluppo locale

Non serve installare nulla: apri semplicemente `index.html` in un browser, oppure per evitare eventuali blocchi CORS sul caricamento dei file JSON avvia un piccolo server locale dalla cartella del sito:

```bash
python3 -m http.server 8000
```

e visita `http://localhost:8000`.
