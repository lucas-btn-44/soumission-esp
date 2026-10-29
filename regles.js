/*
 * Règles de soumission des équipements sous pression (ESP)
 * Reprise des formules du tableur « logiciel_soumission_ESP.ods » (MAJ du 26/01/2018),
 * avec trois corrections signalées par « ÉCART » (voir REGLES.md).
 *
 * PS : pression maximale admissible en bar (relatif)
 * V  : volume en litres (récipients, générateurs)
 * DN : diamètre nominal (tuyauteries)
 */
(function (root) {
  'use strict';

  var MODULES = {
    I: 'module A + ceux des catégories supérieures',
    II: 'modules A1, D1, E1 + ceux des catégories supérieures',
    III: 'modules H, B+E, B+C1, B1+F, B1+D + ceux des catégories supérieures',
    IV: 'modules G, H1, B+D, B+F'
  };

  function fmt(n) {
    return Number(n).toLocaleString('fr-FR', { maximumFractionDigits: 2 });
  }

  function categorie(cat, why) {
    return cat ? { cat: cat, modules: MODULES[cat], why: why } : null;
  }

  // ---------------------------------------------------------------- Récipients
  function recipient(fluide, PS, V, acafr) {
    var PSV = PS * V;
    var r = { produit: PSV, produitUnite: 'bar·L', produitNom: 'PS·V', notes: [] };

    if (fluide === 'g1') {
      r.ip = PS > 0.5 && (V > 1 || (V <= 1 && PS > 200)) && PSV > 50;
      r.ipWhy = r.ip
        ? 'PS > 0,5 bar, PS·V > 50 bar·L' + (V <= 1 ? ' et PS > 200 bar (V ≤ 1 L)' : ' et V > 1 L')
        : 'Il faut PS > 0,5 bar, PS·V > 50 bar·L et V > 1 L (ou PS > 200 bar si V ≤ 1 L)';
      r.rp = r.ip;
      if (r.rp) {
        r.epreuve = PS > 4 && PSV > 80 ? 'avec épreuve' : 'sans épreuve';
        if (r.epreuve === 'sans épreuve' && PSV > 50 && PSV <= 80) {
          r.notes.push('RP sans épreuve si l’équipement n’est pas marqué CE, sinon avec épreuve.');
        }
      }
      r.neo = r.ip && PS < 4 && PSV > 50;
    } else if (fluide === 'g2') {
      var s = acafr ? 2.5 : 4;
      r.ip = PS > s && (V > 1 || (V <= 1 && PS > 1000)) && PSV > 200;
      r.ipWhy = r.ip
        ? 'PS > ' + fmt(s) + ' bar' + (acafr ? ' (ACAFR)' : '') + ' et PS·V > 200 bar·L'
        : 'Il faut PS > ' + fmt(s) + ' bar' + (acafr ? ' (ACAFR)' : '') +
          ', PS·V > 200 bar·L et V > 1 L (ou PS > 1 000 bar si V ≤ 1 L)';
      r.rp = r.ip;
      if (r.rp) r.epreuve = PS > 4 ? 'avec épreuve' : 'sans épreuve';
      r.neo = false;
    } else { // vapeur / eau surchauffée
      r.ip = PS >= 0.5 && PSV > 200 && V > 1;
      r.ipWhy = r.ip
        ? 'PS ≥ 0,5 bar, PS·V > 200 bar·L et V > 1 L'
        : 'Il faut PS ≥ 0,5 bar, PS·V > 200 bar·L et V > 1 L';
      r.rp = r.ip;
      if (r.rp) {
        r.epreuve = V > 100 ? 'avec épreuve' : 'sans épreuve';
        if (r.epreuve === 'sans épreuve' && V < 100) {
          r.notes.push('RP sans épreuve si l’équipement n’est pas marqué CE, sinon avec épreuve.');
        }
      }
      r.neo = r.ip && V < 100;
    }

    // DMS / CMS : ACAFR → dès qu'il est soumis à l'arrêté ; sinon PS > 4 bar et PS·V > 10 000 bar·L
    if (acafr) {
      r.dms = r.ip;
      r.dmsWhy = r.ip ? 'Récipient ACAFR soumis à l’arrêté' : 'Récipient ACAFR non soumis à l’arrêté';
    } else {
      r.dms = PS > 4 && PSV > 10000;
      r.dmsWhy = r.dms ? 'PS > 4 bar et PS·V > 10 000 bar·L' : 'Il faut PS > 4 bar et PS·V > 10 000 bar·L';
    }

    // Catégorie DESP (tableaux 1 et 2 de l'annexe II)
    var cat = null;
    if (fluide === 'g1') {
      if ((V <= 1 && PS > 1000) || (V > 1 && PSV > 1000)) cat = 'IV';
      else if ((V <= 1 && PS > 200) || (V > 1 && PSV > 200)) cat = 'III';
      else if (V > 1 && PSV > 50) cat = 'II';
      else if (V > 1 && PSV > 25) cat = 'I';
    } else {
      // g2 et vapeur. ÉCART n°1 : pour la vapeur, le tableur ne classait pas
      // PS ≤ 4 bar avec PS·V > 3 000 bar·L ; on applique la même règle qu'au groupe 2 (cat. III).
      if ((V <= 1 && PS > 3000) || (V > 1 && PSV > 3000 && PS > 4)) cat = 'IV';
      else if ((V <= 1 && PS > 1000) || (V > 1 && PSV > 1000)) cat = 'III';
      else if (V > 1 && PSV > 200) cat = 'II';
      else if (V > 1 && PSV > 50) cat = 'I';
    }
    r.categorie = categorie(cat);
    return r;
  }

  // -------------------------------------------------------------- Tuyauteries
  function tuyauterie(fluide, PS, DN) {
    var P = PS * DN;
    var r = { produit: P, produitUnite: 'bar', produitNom: 'PS·DN', notes: [], neo: false };
    var cat = null;

    if (fluide === 'g1') {
      r.ip = (PS > 0.5 && DN > 100) || (P > 1000 && DN > 25);
      r.ipWhy = r.ip
        ? (PS > 0.5 && DN > 100 ? 'PS > 0,5 bar et DN > 100' : 'PS·DN > 1 000 bar et DN > 25')
        : 'Il faut PS > 0,5 bar et DN > 100, ou PS·DN > 1 000 bar et DN > 25';
      r.dms = PS > 4 && (DN > 350 || (P > 3500 && DN > 100));
      r.dmsWhy = r.dms
        ? 'PS > 4 bar et ' + (DN > 350 ? 'DN > 350' : 'PS·DN > 3 500 bar avec DN > 100')
        : 'Il faut PS > 4 bar et DN > 350, ou PS > 4 bar, PS·DN > 3 500 bar et DN > 100';
      if (DN > 350 || (DN > 100 && P > 3500)) cat = 'III';
      else if (DN > 25 && (DN > 100 || P > 1000)) cat = 'II';
      else if (DN > 25) cat = 'I';
    } else {
      r.ip = PS > 0.5 && DN > 100 && P > 3500;
      r.ipWhy = r.ip ? 'PS > 0,5 bar, DN > 100 et PS·DN > 3 500 bar'
        : 'Il faut PS > 0,5 bar, DN > 100 et PS·DN > 3 500 bar';
      r.dms = PS > 4 && DN > 250 && P > 5000;
      r.dmsWhy = r.dms ? 'PS > 4 bar, DN > 250 et PS·DN > 5 000 bar'
        : 'Il faut PS > 4 bar, DN > 250 et PS·DN > 5 000 bar';
      // ÉCART n°2 : le tableur laissait des trous entre les catégories I et II
      // (ex. DN 200, PS·DN 2 000 n'était dans aucune). On suit les frontières du tableau 7 de la DESP.
      if (DN > 250 && P > 5000) cat = 'III';
      else if (DN > 100 && P > 3500) cat = 'II';
      else if (DN > 32 && P > 1000) cat = 'I';
    }
    r.rp = r.dms;
    if (r.rp) r.epreuve = 'sans épreuve';
    r.categorie = categorie(cat);
    return r;
  }

  // -------------------------------------------------------------- Générateurs
  function generateur(fluide, PS, V) {
    var PSV = PS * V;
    var r = { produit: PSV, produitUnite: 'bar·L', produitNom: 'PS·V', notes: [], neo: false, categorie: null };
    var seuil = fluide === 'calo' ? 1 : 0.5;
    r.ip = PS > seuil && V > 25;
    r.ipWhy = r.ip ? 'PS > ' + fmt(seuil) + ' bar et V > 25 L' : 'Il faut PS > ' + fmt(seuil) + ' bar et V > 25 L';
    r.dms = (PS > 32 && V > 25) || (PS >= 2.5 && PS <= 32 && PSV > 6000) || (PS > 0.5 && V > 2400);
    r.dmsWhy = r.dms
      ? (PS > 32 && V > 25 ? 'PS > 32 bar et V > 25 L'
        : PS >= 2.5 && PS <= 32 && PSV > 6000 ? '2,5 ≤ PS ≤ 32 bar et PS·V > 6 000 bar·L'
        : 'V > 2 400 L')
      : 'Il faut PS > 32 bar et V > 25 L, ou 2,5 ≤ PS ≤ 32 bar et PS·V > 6 000 bar·L, ou V > 2 400 L';
    r.rp = r.ip;
    if (r.rp) r.epreuve = 'avec épreuve';
    r.notes.push('Le tableur ne calcule pas la catégorie DESP des générateurs.');
    return r;
  }

  function evaluer(e) {
    var PS = Number(e.PS), X = Number(e.dim);
    var r;
    if (e.type === 'recipient') r = recipient(e.fluide, PS, X, !!e.acafr);
    else if (e.type === 'tuyauterie') r = tuyauterie(e.fluide, PS, X);
    else r = generateur(e.fluide, PS, X);

    // ÉCART n°3 : hors champ de la DESP (PS ≤ 0,5 bar), aucune catégorie n'est attribuée.
    r.horsChamp = PS <= 0.5;
    if (r.horsChamp) r.categorie = null;
    if (!r.rp) r.epreuve = '';
    return r;
  }

  var api = { evaluer: evaluer, MODULES: MODULES };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ReglesESP = api;
})(typeof self !== 'undefined' ? self : this);
