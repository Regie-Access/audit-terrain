// Audit terrain Régie Access — maquette cliquable (étape 2).
// Les données restent en mémoire : rien n'est envoyé sur Internet.
"use strict";

const etat = { audits: [] };
const $app = document.getElementById("app");
let compteur = 1;
const nouvelId = () => "i" + (compteur++);

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const slug = s => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "");
const defPartie = cle => PARTIES.find(p => p.cle === cle);
const trouverAudit = id => etat.audits.find(a => a.id === id);
const PRIORITES = { "": "Priorité ?", "immédiat": "Immédiat", "amont": "À préparer en amont", "structurant": "Structurant" };

// ---------- Données d'exemple pour la maquette ----------
function auditExemple() {
  const a = creerAudit();
  Object.assign(a.ident, { titre: "Audit exemple", evenement: "Festival exemple", edition: "2026", lieu: "Ville exemple", date_evaluation: new Date().toISOString().slice(0, 10), auditeurs: "Denis LEROY" });
  ajouterPartie(a, "B:stationnement", "Parking P1");
  const p = ajouterPartie(a, "F:plateforme", "Scène principale");
  p.obs = "Plateforme de 6 m sur 4 m, rampe côté jardin.";
  p.defauts = [{ t: "Pas de chasse-roues sur la rampe", p: "immédiat" }];
  p.amelio = "Ajouter des chasse-roues des deux côtés de la rampe.";
  return a;
}
function creerAudit() {
  const a = { id: nouvelId(), ident: { titre: "", evenement: "", edition: "", dates_festival: "", lieu: "", date_evaluation: "", auditeurs: "", contact_nom: "", contact_fonction: "", contact_service: "", contact_coordonnees: "", personnes: "", site_web: "", page_accessibilite: "", gestionnaire_lieu: "", commanditaire: "", type_site: "" }, parties: [] };
  etat.audits.push(a);
  return a;
}
function ajouterPartie(audit, cle, instance) {
  const p = { id: nouvelId(), cle, instance: instance || "", rappel: null, nonVisite: false, obs: "", defauts: [{ t: "", p: "" }], amelio: "", remarques: "", rubriques: {}, rep: {}, photos: [] };
  audit.parties.push(p);
  return p;
}
function nomPartie(p) {
  const d = defPartie(p.cle);
  return d.libre ? (p.instance || "Partie libre") : d.nom + (p.instance ? " — " + p.instance : "");
}
function statut(p) {
  const rempli = p.obs || p.amelio || p.remarques || p.photos.length || p.defauts.some(d => d.t) || Object.keys(p.rep).length || p.nonVisite;
  if (!rempli) return ["Vide", "p-vide"];
  return p.termine ? ["Terminée", "p-ok"] : ["Commencée", "p-cours"];
}

// ---------- Routage ----------
function aller(h) { location.hash = h; }
window.addEventListener("hashchange", rendre);
function rendre() {
  const h = location.hash.replace(/^#\/?/, "").split("/");
  if (h[0] === "audit" && h[1] === "nouveau") { const a = creerAudit(); return aller(`#/audit/${a.id}/identification`); }
  const a = h[0] === "audit" ? trouverAudit(h[1]) : null;
  if (h[0] === "audit" && !a) return aller("#/");
  if (!a) vueAccueil();
  else if (h[2] === "identification") vueIdentification(a);
  else if (h[2] === "partie") vuePartie(a, a.parties.find(p => p.id === h[3]));
  else if (h[2] === "envoi") vueEnvoi(a);
  else vueSommaire(a);
  window.scrollTo(0, 0);
  $app.focus({ preventScroll: true });
}

// ---------- Écran 1 : accueil ----------
function vueAccueil() {
  document.title = "Audit terrain – Régie Access";
  $app.innerHTML = `
    <h1>Mes audits</h1>
    <a class="btn btn-principal btn-large" href="#/audit/nouveau">+ Nouvel audit</a>
    ${etat.audits.map(a => `
      <div class="carte"><a href="#/audit/${a.id}">
        <div class="ligne"><h3>${esc(a.ident.titre || a.ident.evenement || "Audit sans titre")}</h3><span class="muted">${a.parties.length} partie(s)</span></div>
        <div class="muted">${esc([a.ident.evenement, a.ident.lieu, a.ident.date_evaluation].filter(Boolean).join(" · "))}</div>
      </a></div>`).join("") || `<p class="muted">Aucun audit pour l'instant.</p>`}`;
}

// ---------- Écran 2 : fiche d'identification ----------
const CHAMPS_IDENT = [
  ["titre", "Titre de l'audit"], ["evenement", "Nom de l'événement"], ["lieu", "Lieu"],
  ["date_evaluation", "Date d'évaluation", "date"], ["auditeurs", "Auditeur(s)", "text", "Séparez les noms par une virgule"],
  ["contact_nom", "Contact : nom et prénom"], ["contact_fonction", "Contact : fonction"], ["contact_service", "Contact : service"], ["contact_coordonnees", "Contact : coordonnées"],
  ["personnes", "Personnes rencontrées", "textarea", "Une personne par ligne : nom, fonction, service"]
];
const CHAMPS_IDENT_OPTION = [
  ["edition", "Édition (année)"], ["dates_festival", "Dates de l'événement"], ["site_web", "Site web", "url"], ["page_accessibilite", "Page accessibilité", "url"],
  ["gestionnaire_lieu", "Gestionnaire du lieu"], ["commanditaire", "Commanditaire"]
];
function champ(obj, [k, lib, type = "text", aide]) {
  const id = "f-" + k;
  const input = type === "textarea"
    ? `<textarea id="${id}" data-k="${k}">${esc(obj[k])}</textarea>`
    : `<input id="${id}" type="${type}" data-k="${k}" value="${esc(obj[k])}">`;
  return `<label for="${id}">${lib}</label>${aide ? `<p class="aide">${aide}</p>` : ""}${input}`;
}
function vueIdentification(a) {
  document.title = "Identification – Audit terrain";
  const types = ["", "Plein air", "Parc des expositions", "Salle", "Multisite"];
  $app.innerHTML = `
    <a class="retour" href="#/">← Mes audits</a>
    <h1>Fiche d'identification</h1>
    <form id="ident">
      ${CHAMPS_IDENT.map(c => champ(a.ident, c)).join("")}
      <details><summary>Informations facultatives</summary><div>
        ${CHAMPS_IDENT_OPTION.map(c => champ(a.ident, c)).join("")}
        <label for="f-type_site">Type de site</label>
        <select id="f-type_site" data-k="type_site">${types.map(t => `<option ${a.ident.type_site === t ? "selected" : ""}>${t}</option>`).join("")}</select>
      </div></details>
      <div class="barre-bas"><a class="btn btn-principal" href="#/audit/${a.id}">Continuer vers les parties →</a></div>
    </form>`;
  $app.querySelector("#ident").addEventListener("input", e => { if (e.target.dataset.k) a.ident[e.target.dataset.k] = e.target.value; });
}

// ---------- Écran 3 : sommaire des parties ----------
function vueSommaire(a) {
  document.title = "Parties – Audit terrain";
  const options = PARTIES.map(p => `<option value="${p.cle}">${esc(p.nom)}${p.multi ? " (plusieurs possibles)" : ""}${p.moment === "entretien" ? " — entretien" : ""}</option>`).join("");
  $app.innerHTML = `
    <a class="retour" href="#/">← Mes audits</a>
    <h1>${esc(a.ident.titre || a.ident.evenement || "Audit sans titre")}</h1>
    <p><a class="retour" href="#/audit/${a.id}/identification">Modifier la fiche d'identification</a></p>
    <h2>Ajouter une partie</h2>
    <form id="ajout" class="carte">
      <label for="choix-partie">Partie à traiter</label>
      <select id="choix-partie"><option value="">Choisir dans la liste…</option>${options}</select>
      <div id="zone-instance"></div>
      <button class="btn-principal btn-large" type="submit">Ajouter et ouvrir</button>
    </form>
    <h2>Parties de l'audit</h2>
    ${a.parties.map(p => { const [s, c] = statut(p); return `
      <div class="carte"><a href="#/audit/${a.id}/partie/${p.id}">
        <div class="ligne"><h3>${esc(nomPartie(p))}</h3><span class="pastille ${c}">${s}</span></div>
        <div class="muted">${p.photos.length} photo(s)${p.nonVisite ? " · non visité" : ""}</div>
      </a></div>`; }).join("") || `<p class="muted">Aucune partie pour l'instant.</p>`}
    <div class="barre-bas"><a class="btn btn-principal" href="#/audit/${a.id}/envoi">Envoyer par mail…</a></div>`;
  const sel = $app.querySelector("#choix-partie"), zone = $app.querySelector("#zone-instance");
  sel.addEventListener("change", () => {
    const d = defPartie(sel.value);
    if (!d) return zone.innerHTML = "";
    if (d.libre) zone.innerHTML = `<label for="inst">Nom de la nouvelle partie</label><p class="aide">Écrivez ou dictez avec le micro du clavier.</p><input id="inst" type="text" required>`;
    else if (d.instances) zone.innerHTML = `<label for="inst">Quel espace ?</label><input id="inst" type="text" list="liste-inst" placeholder="Choisir ou écrire"><datalist id="liste-inst">${d.instances.map(i => `<option value="${esc(i)}">`).join("")}</datalist>`;
    else if (d.multi) zone.innerHTML = `<label for="inst">Nom ou repère (ex. Parking P1, Entrée nord)</label><input id="inst" type="text">`;
    else zone.innerHTML = "";
  });
  $app.querySelector("#ajout").addEventListener("submit", e => {
    e.preventDefault();
    const d = defPartie(sel.value); if (!d) return sel.focus();
    if (!d.multi) { const ex = a.parties.find(p => p.cle === d.cle); if (ex) return aller(`#/audit/${a.id}/partie/${ex.id}`); }
    const inst = $app.querySelector("#inst");
    const p = ajouterPartie(a, d.cle, inst ? inst.value.trim() : "");
    aller(`#/audit/${a.id}/partie/${p.id}`);
  });
}

// ---------- Écran 4 : fiche d'une partie ----------
function vueQuestion(p, q, i) {
  const k = "q" + i, v = p.rep[k];
  if (q.t === "on") return `<div class="q"><div class="q-titre" id="lb-${k}">${esc(q.q)}</div><div class="choix" role="group" aria-labelledby="lb-${k}">
    ${["Oui", "Non", "Non vérifié"].map(o => `<button type="button" class="btn-petit" data-q="${k}" data-v="${o}" aria-pressed="${v === o}">${o}</button>`).join("")}</div></div>`;
  if (q.t === "num") return `<div class="q"><label class="q-titre" for="${k}">${esc(q.q)}</label><div class="num"><input id="${k}" type="number" inputmode="decimal" step="any" data-q="${k}" value="${esc(v)}"><span>${esc(q.u)}</span></div></div>`;
  if (q.t === "texte") return `<div class="q"><label class="q-titre" for="${k}">${esc(q.q)}</label><input id="${k}" type="text" data-q="${k}" value="${esc(v)}"></div>`;
  if (q.t === "liste") return `<fieldset class="q cases" style="border:0;margin:0;padding:10px 0"><legend class="q-titre">${esc(q.q)}</legend>
    ${q.o.map((o, j) => `<label><input type="checkbox" data-q="${k}" data-v="${esc(o)}" ${(v || []).includes(o) ? "checked" : ""}> ${esc(o)}</label>`).join("")}
    <input type="text" data-q="${k}-autre" placeholder="Autres…" value="${esc(p.rep[k + "-autre"])}" aria-label="${esc(q.q)} : autres"></fieldset>`;
  if (q.t === "qual") return `<div class="q"><div class="q-titre">${esc(q.q)}</div><table class="grille"><thead><tr><th scope="col">Critère</th><th scope="col">Très bien</th><th scope="col">Moyen</th><th scope="col">Passable</th></tr></thead><tbody>
    ${q.o.map((c, j) => `<tr><th scope="row" style="font-weight:normal">${esc(c)}</th>${["Très bien", "Moyen", "Passable"].map(n => `<td><input type="radio" name="${k}-${j}" data-q="${k}" data-c="${esc(c)}" data-v="${n}" ${(v || {})[c] === n ? "checked" : ""} aria-label="${esc(c)} : ${n}"></td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  return "";
}
function vuePartie(a, p) {
  if (!p) return aller(`#/audit/${a.id}`);
  const d = defPartie(p.cle), rappel = RAPPELS[p.cle];
  document.title = nomPartie(p) + " – Audit terrain";
  $app.innerHTML = `
    <a class="retour" href="#/audit/${a.id}">← Parties de l'audit</a>
    <h1>${esc(nomPartie(p))}</h1>
    <form id="partie">
      <label class="cases" style="font-weight:normal;display:flex;gap:8px"><input type="checkbox" data-f="nonVisite" ${p.nonVisite ? "checked" : ""}> Non visité / non vérifié</label>
      ${rappel ? `<div class="rappel"><h3>Rappel théorique proposé</h3><p>${esc(rappel)}</p>
        <div class="choix" role="group" aria-label="Inclure ce rappel dans l'audit ?">
          <button type="button" class="btn-petit" data-rappel="true" aria-pressed="${p.rappel === true}">À inclure</button>
          <button type="button" class="btn-petit" data-rappel="false" aria-pressed="${p.rappel === false}">Ne pas inclure</button></div></div>` : ""}
      <p class="aide">Pour dicter : touchez une zone de texte puis le micro du clavier.</p>
      <h2><label for="obs" style="margin:0">Observations et constats</label></h2>
      <textarea id="obs" data-f="obs">${esc(p.obs)}</textarea>
      ${(d.rubriques || []).map((r, i) => `<label for="rub${i}">${esc(r)}</label><textarea id="rub${i}" data-rub="${esc(r)}" style="min-height:70px">${esc(p.rubriques[r])}</textarea>`).join("")}
      <h2 class="titre-defauts">Défauts relevés</h2>
      <p class="aide">Un défaut par ligne. Priorité facultative.</p>
      <div id="defauts">${p.defauts.map((x, i) => `<div class="defaut">
        <input type="text" data-def="${i}" value="${esc(x.t)}" aria-label="Défaut ${i + 1}">
        <select data-prio="${i}" aria-label="Priorité du défaut ${i + 1}">${Object.entries(PRIORITES).map(([v, l]) => `<option value="${v}" ${x.p === v ? "selected" : ""}>${l}</option>`).join("")}</select></div>`).join("")}</div>
      <button type="button" class="btn-petit" id="plus-defaut">+ Ajouter un défaut</button>
      <h2 class="titre-amelio"><label for="amelio" style="margin:0">Améliorations possibles</label></h2>
      <textarea id="amelio" data-f="amelio">${esc(p.amelio)}</textarea>
      <label for="remarques">Remarques pour la rédaction <span class="aide">(facultatif : contexte, exigence, ton)</span></label>
      <textarea id="remarques" data-f="remarques" style="min-height:70px">${esc(p.remarques)}</textarea>
      ${d.questions.length ? `<details><summary>Questionnaire (facultatif) — ${d.questions.length} questions</summary><div>${d.questions.map((q, i) => vueQuestion(p, q, i)).join("")}</div></details>` : ""}
      <h2>Photos</h2>
      <label class="btn btn-principal" for="prise-photo" style="display:inline-block">📷 Prendre ou ajouter une photo</label>
      <input id="prise-photo" type="file" accept="image/*" capture="environment" multiple style="position:absolute;left:-9999px">
      ${p.cle === "A:preparer" ? `<div class="carte"><h3>Garder une trace de la page accessibilité</h3>
        <p class="aide">Le site change souvent après l'événement : joignez une capture d'écran ou un PDF de la page, le jour de la visite.</p>
        <label for="url-page">Adresse de la page</label><input id="url-page" type="url" value="${esc(a.ident.page_accessibilite)}" placeholder="https://…">
        <label class="btn" for="capture-page" style="display:inline-block;margin-top:10px">Joindre la capture ou le PDF</label>
        <input id="capture-page" type="file" accept="image/*,application/pdf" style="position:absolute;left:-9999px"></div>` : ""}
      <div class="photos">${p.photos.map((ph, i) => `<div class="photo">${ph.pdf ? `<div class="carte" style="aspect-ratio:4/3;margin:0">PDF</div>` : `<img src="${ph.url}" alt="${esc(ph.legende || "Photo " + (i + 1))}">`}<div class="nom">${esc(ph.nom)}</div>
        <input type="text" data-leg="${i}" value="${esc(ph.legende)}" placeholder="Légende" aria-label="Légende de la photo ${i + 1}">
        <button type="button" class="btn-petit" data-suppr="${i}">Supprimer</button></div>`).join("")}</div>
      <div class="barre-bas">
        <button type="button" class="btn-principal" id="terminer">${p.termine ? "Rouvrir la partie" : "Marquer comme terminée"}</button>
        <a class="btn" href="#/audit/${a.id}">Retour aux parties</a></div>
    </form>`;
  const f = $app.querySelector("#partie");
  f.addEventListener("input", e => {
    const t = e.target, ds = t.dataset;
    if (ds.f === "nonVisite") p.nonVisite = t.checked;
    else if (ds.f) p[ds.f] = t.value;
    else if (ds.rub) p.rubriques[ds.rub] = t.value;
    else if (ds.def) p.defauts[+ds.def].t = t.value;
    else if (ds.prio) p.defauts[+ds.prio].p = t.value;
    else if (ds.leg) p.photos[+ds.leg].legende = t.value;
    else if (ds.q && t.type === "checkbox") { const l = new Set(p.rep[ds.q] || []); t.checked ? l.add(ds.v) : l.delete(ds.v); l.size ? p.rep[ds.q] = [...l] : delete p.rep[ds.q]; }
    else if (ds.q && t.type === "radio") { p.rep[ds.q] = Object.assign(p.rep[ds.q] || {}, { [ds.c]: ds.v }); }
    else if (ds.q) { t.value ? p.rep[ds.q] = t.value : delete p.rep[ds.q]; }
  });
  f.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.dataset.rappel) { p.rappel = b.dataset.rappel === "true"; f.querySelectorAll("[data-rappel]").forEach(x => x.setAttribute("aria-pressed", x === b)); }
    else if (b.dataset.q) { const on = b.getAttribute("aria-pressed") !== "true"; on ? p.rep[b.dataset.q] = b.dataset.v : delete p.rep[b.dataset.q]; b.parentNode.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", on && x === b)); }
    else if (b.dataset.suppr) { p.photos.splice(+b.dataset.suppr, 1); vuePartie(a, p); }
    else if (b.id === "plus-defaut") { p.defauts.push({ t: "", p: "" }); vuePartie(a, p); const ins = $app.querySelectorAll("[data-def]"); ins[ins.length - 1].focus(); }
    else if (b.id === "terminer") { p.termine = !p.termine; aller(`#/audit/${a.id}`); }
  });
  const cap = f.querySelector("#capture-page");
  if (cap) cap.addEventListener("change", async e => {
    const fi = e.target.files[0]; if (!fi) return;
    const url = f.querySelector("#url-page").value.trim(); if (url) a.ident.page_accessibilite = url;
    const n = p.photos.filter(x => x.page).length + 1, pdf = fi.type === "application/pdf";
    const ph = pdf ? { blob: fi, url: URL.createObjectURL(fi) } : await reduirePhoto(fi, a, p);
    Object.assign(ph, { page: true, pdf, nom: `${codeAudit(a)}_A-preparer-page-accessibilite_${String(n).padStart(2, "0")}.${pdf ? "pdf" : "jpg"}`,
      legende: `Page accessibilité${url ? ", " + url : ""}, consultée le ${new Date().toLocaleDateString("fr-FR")}` });
    p.photos.push(ph); vuePartie(a, p);
  });
  f.querySelector("#prise-photo").addEventListener("change", async e => {
    for (const fichier of e.target.files) p.photos.push(await reduirePhoto(fichier, a, p));
    vuePartie(a, p);
  });
}

// Photos : réduites à 1600 px côté long (taille adaptée au mail et à Word), nommées par partie.
function codeAudit(a) { return (slug(a.ident.evenement || a.ident.titre || "AUDIT").slice(0, 20) + (a.ident.edition || "")).toUpperCase() || "AUDIT"; }
function nomPhoto(a, p, n) {
  const [lettre, cle] = p.cle.split(":");
  return `${codeAudit(a)}_${lettre}-${cle}${p.instance ? "-" + slug(p.instance) : ""}_${String(n).padStart(2, "0")}.jpg`;
}
function reduirePhoto(fichier, a, p) {
  return new Promise(ok => {
    const img = new Image();
    img.onload = () => {
      const r = Math.min(1, 1600 / Math.max(img.width, img.height));
      const c = document.createElement("canvas"); c.width = Math.round(img.width * r); c.height = Math.round(img.height * r);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      c.toBlob(blob => { URL.revokeObjectURL(img.src); ok({ nom: nomPhoto(a, p, p.photos.length + 1), legende: "", blob, url: URL.createObjectURL(blob) }); }, "image/jpeg", 0.8);
    };
    img.src = URL.createObjectURL(fichier);
  });
}

// ---------- Écran 5 : envoi ----------
// Format défini dans format-export.md (partagé avec le rédacteur d'audit).
function exporter(a, parties) {
  const i = a.ident, L = ["---"];
  const y = (k, v) => { if (v) L.push(`${k}: ${JSON.stringify(v)}`); };
  y("titre", i.titre); y("evenement", i.evenement); y("edition", i.edition); y("dates_festival", i.dates_festival); y("lieu", i.lieu); y("date_evaluation", i.date_evaluation);
  const aud = i.auditeurs.split(",").map(s => s.trim()).filter(Boolean);
  if (aud.length) { L.push("auditeurs:"); aud.forEach(x => L.push(`  - ${JSON.stringify(x)}`)); }
  if (i.contact_nom || i.contact_fonction) { L.push("contact:"); [["nom", i.contact_nom], ["fonction", i.contact_fonction], ["service", i.contact_service], ["coordonnees", i.contact_coordonnees]].forEach(([k, v]) => v && L.push(`  ${k}: ${JSON.stringify(v)}`)); }
  const pers = i.personnes.split("\n").map(s => s.trim()).filter(Boolean);
  if (pers.length) { L.push("personnes_rencontrees:"); pers.forEach(x => { const [nom, fonction, service] = x.split(",").map(s => s.trim()); L.push(`  - nom: ${JSON.stringify(nom || "")}`); fonction && L.push(`    fonction: ${JSON.stringify(fonction)}`); service && L.push(`    service: ${JSON.stringify(service)}`); }); }
  y("site_web", i.site_web); y("page_accessibilite", i.page_accessibilite); y("gestionnaire_lieu", i.gestionnaire_lieu); y("commanditaire", i.commanditaire); y("type_site", i.type_site.toLowerCase());
  L.push("---", "");
  for (const p of parties) {
    const d = defPartie(p.cle);
    L.push(`## [${p.cle}] ${d.libre ? (p.instance || "Partie libre") : d.nom}${p.instance && !d.libre ? " — " + p.instance : ""}`, "");
    if (p.rappel !== null) L.push(`Rappel théorique : ${p.rappel ? "à inclure" : "non"}`, "");
    if (p.nonVisite) L.push("> Non visité / non vérifié", "");
    const bloc = (t, txt) => { if (txt && txt.trim()) L.push(`### ${t}`, txt.trim(), ""); };
    bloc("Observation terrain", [p.obs, ...Object.entries(p.rubriques).filter(([, v]) => v).map(([k, v]) => `**${k}** : ${v}`)].filter(Boolean).join("\n\n"));
    const defs = p.defauts.filter(x => x.t.trim());
    if (defs.length) L.push("### Défauts relevés", ...defs.map(x => `- ${x.p ? `[${x.p}] ` : ""}${x.t.trim()}`), "");
    bloc("Améliorations possibles", p.amelio);
    bloc("Remarques pour la rédaction", p.remarques);
    const rep = [];
    d.questions.forEach((q, n) => {
      const v = p.rep["q" + n], autre = p.rep["q" + n + "-autre"];
      if (q.t === "qual" && v) rep.push(`- ${q.q} : ${Object.entries(v).map(([c, x]) => `${c} ${x}`).join(", ")}`);
      else if (q.t === "liste" && (v || autre)) rep.push(`- ${q.q} : ${[...(v || []), autre].filter(Boolean).join(", ")}`);
      else if (v) rep.push(`- ${q.q} : ${v}${q.u ? " " + q.u : ""}`);
    });
    if (rep.length) L.push("### Réponses au questionnaire", ...rep, "");
    if (p.photos.length) L.push("### Photos", ...p.photos.map(ph => `- ${ph.nom}${ph.legende ? " — " + ph.legende : ""}`), "");
  }
  return L.join("\n");
}
function vueEnvoi(a) {
  document.title = "Envoyer – Audit terrain";
  $app.innerHTML = `
    <a class="retour" href="#/audit/${a.id}">← Parties de l'audit</a>
    <h1>Envoyer par mail</h1>
    <form id="envoi">
      <fieldset class="carte cases" style="margin:0"><legend class="q-titre">Parties à envoyer</legend>
        <label><input type="checkbox" id="toutes" checked> <b>Toutes les parties</b></label>
        ${a.parties.map(p => `<label><input type="checkbox" data-p="${p.id}" checked> ${esc(nomPartie(p))} <span class="muted">(${p.photos.length} photo·s)</span></label>`).join("") || `<p class="muted">Aucune partie.</p>`}
      </fieldset>
      <p class="muted" id="poids"></p>
      <div class="barre-bas"><button class="btn-principal" type="submit">Préparer le mail</button></div>
      <details><summary>Aperçu du texte envoyé</summary><div><pre class="apercu" id="apercu"></pre></div></details>
    </form>`;
  const f = $app.querySelector("#envoi");
  const choisies = () => a.parties.filter(p => f.querySelector(`[data-p="${p.id}"]`)?.checked);
  const maj = () => {
    const ps = choisies();
    f.querySelector("#apercu").textContent = exporter(a, ps);
    const mo = ps.reduce((s, p) => s + p.photos.reduce((t, ph) => t + ph.blob.size, 0), 0) / 1048576;
    f.querySelector("#poids").textContent = `${ps.length} partie(s), ${ps.reduce((s, p) => s + p.photos.length, 0)} photo(s), environ ${mo.toFixed(1)} Mo.` + (mo > 20 ? " Attention : au-delà de 20 Mo, le mail risque d'être refusé ; envoyez en plusieurs fois." : "");
  };
  f.addEventListener("change", e => { if (e.target.id === "toutes") f.querySelectorAll("[data-p]").forEach(c => c.checked = e.target.checked); maj(); });
  f.addEventListener("submit", async e => {
    e.preventDefault();
    const ps = choisies(); if (!ps.length) return;
    const nomMd = `${codeAudit(a)}_audit.md`;
    const fichiers = [new File([exporter(a, ps)], nomMd, { type: "text/markdown" }), ...ps.flatMap(p => p.photos.map(ph => new File([ph.blob], ph.nom, { type: ph.pdf ? "application/pdf" : "image/jpeg" })))];
    const titre = `Audit terrain – ${a.ident.evenement || a.ident.titre || ""}`;
    if (navigator.canShare && navigator.canShare({ files: fichiers })) {
      try { await navigator.share({ files: fichiers, title: titre, text: titre }); } catch (err) { /* partage annulé */ }
    } else {
      // Ordinateur sans menu de partage : on télécharge les fichiers à joindre au mail.
      fichiers.forEach((fi, n) => setTimeout(() => { const l = document.createElement("a"); l.href = URL.createObjectURL(fi); l.download = fi.name; l.click(); }, n * 300));
      alert("Les fichiers ont été téléchargés : joignez-les à un nouveau mail.");
    }
  });
  maj();
}

auditExemple();
rendre();
