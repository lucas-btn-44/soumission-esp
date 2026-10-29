# Règles de soumission des ESP

Formules extraites du tableur `logiciel_soumission_ESP.ods` (pôle Sud-Ouest, MAJ du 26/01/2018) et reprises dans `regles.js`.
Notations : PS en bar (pression maximale admissible), V en litres, DN sans unité. « IP » = inspection périodique et soumission à l'arrêté du 20 novembre 2017, « RP » = requalification périodique, « DMS / CMS » = déclaration et contrôle de mise en service obligatoires. Seule la réglementation fait foi.

## Récipients

ACAFR (O/N) n'intervient que pour le groupe 2 (seuil PS abaissé à 2,5 bar) et pour la DMS/CMS.

| | Gaz groupe 1 | Gaz groupe 2 | Vapeur / eau surchauffée |
|---|---|---|---|
| IP + arrêté | PS > 0,5 et PS·V > 50 et (V > 1 ou PS > 200) | PS > 4 (2,5 si ACAFR) et PS·V > 200 et (V > 1 ou PS > 1000) | PS ≥ 0,5 et PS·V > 200 et V > 1 |
| DMS / CMS | non ACAFR : PS > 4 et PS·V > 10 000 ; ACAFR : dès qu'il est soumis à l'IP | idem | idem |
| RP | comme l'IP | comme l'IP | comme l'IP |
| Épreuve à la RP | avec si PS > 4 et PS·V > 80, sinon sans (si 50 < PS·V ≤ 80 : sans si non CE, sinon avec) | avec si PS > 4, sinon sans | avec si V > 100, sinon sans (si V < 100 : sans si non CE, sinon avec) |
| Néo-soumis | soumis et PS < 4 | jamais | soumis et V < 100 |

Catégories DESP (V > 1 L sauf mention) :

| Cat. | Groupe 1 | Groupe 2 et vapeur |
|---|---|---|
| I | 25 < PS·V ≤ 50 | 50 < PS·V ≤ 200 |
| II | 50 < PS·V ≤ 200 | 200 < PS·V ≤ 1 000 |
| III | 200 < PS·V ≤ 1 000, ou V ≤ 1 et 200 < PS ≤ 1 000 | 1 000 < PS·V ≤ 3 000, ou PS·V > 1 000 avec PS ≤ 4, ou V ≤ 1 et 1 000 < PS ≤ 3 000 |
| IV | PS·V > 1 000, ou V ≤ 1 et PS > 1 000 | PS·V > 3 000 et PS > 4, ou V ≤ 1 et PS > 3 000 |

## Tuyauteries

Le groupe 2 inclut la vapeur et l'eau surchauffée.

| | Gaz groupe 1 | Gaz groupe 2 (y compris vapeur/ES) |
|---|---|---|
| IP + arrêté | (PS > 0,5 et DN > 100) ou (PS·DN > 1 000 et DN > 25) | PS > 0,5 et DN > 100 et PS·DN > 3 500 |
| DMS / CMS et RP | PS > 4 et (DN > 350 ou (DN > 100 et PS·DN > 3 500)) | PS > 4 et DN > 250 et PS·DN > 5 000 |
| Épreuve à la RP | sans épreuve | sans épreuve |
| Cat. I | 25 < DN ≤ 100 et PS·DN ≤ 1 000 | DN > 32 et PS·DN > 1 000, hors cat. II/III |
| Cat. II | DN > 25, hors cat. I et III | DN > 100 et PS·DN > 3 500, hors cat. III |
| Cat. III | DN > 350, ou DN > 100 et PS·DN > 3 500 | DN > 250 et PS·DN > 5 000 |

## Générateurs de vapeur

| | Vapeur / eau surchauffée | Fluide caloporteur > 120 °C |
|---|---|---|
| IP + arrêté | PS > 0,5 et V > 25 | PS > 1 et V > 25 |
| DMS / CMS | (PS > 32 et V > 25) ou (2,5 ≤ PS ≤ 32 et PS·V > 6 000) ou (PS > 0,5 et V > 2 400) | idem |
| RP | comme l'IP, toujours avec épreuve | idem |

Le tableur ne calcule pas de catégorie DESP pour les générateurs.

## Périodicités maximales (hors plan d'inspection)

Source : arrêté du 20 novembre 2017, art. 15 (IP) et 18 (RP). Elles ne viennent pas du tableur.

| | Inspection périodique | Requalification périodique |
|---|---|---|
| Récipient | 4 ans (première IP sous 3 ans après la mise en service, sauf CMS réalisé) | 10 ans |
| Récipient ACAFR | 2 ans | 10 ans |
| Tuyauterie | fixée par le programme de contrôle de l'exploitant (établi dans l'année suivant la mise en service) | 10 ans |
| Générateur de vapeur | 2 ans | 10 ans |

Pour les récipients et tuyauteries, la RP passe à 6 ans avec un fluide toxique ou corrosif pour les parois, et à 3 ans avec un fluide corrosif de la liste de l'art. 18 I (fluor, fluorure de bore, HF, trichlorure de bore, HCl, HBr, NO₂, phosgène, H₂S) non exempt d'impuretés corrosives.
Avec un plan d'inspection approuvé (art. 13), les intervalles peuvent aller jusqu'à 6 ans (IP) et 12 ans (RP), ou 7 et 14 ans dans les unités à catalyseur.

## Écarts volontaires avec le tableur (validés par Lucas le 29/10/2026)

Un test compare `regles.js` à une transcription brute des formules sur une grille de ~2 500 cas : les seules différences sont les trois ci-dessous.

1. **Récipients vapeur, catégorie.** Le tableur ne classait nulle part un récipient vapeur avec PS ≤ 4 bar et PS·V > 3 000 (ex. PS 0,6 bar, V 10 000 L). On applique la règle du groupe 2 : catégorie III.
2. **Tuyauteries groupe 2, catégories.** Les formules I et II du tableur laissaient des trous (ex. DN 200 et PS·DN 2 000 n'était dans aucune catégorie). On suit les frontières du tableau 7 de la DESP : une catégorie supérieure commence quand les deux seuils (DN et PS·DN) sont dépassés.
3. **PS ≤ 0,5 bar.** L'équipement est hors champ de la DESP : aucune catégorie n'est affichée (le tableur en attribuait une aux récipients et tuyauteries).

## Points à vérifier avec la réglementation

- Le libellé « décret n° 99-1046 » est abrogé ; les catégories sont désormais celles de la directive 2014/68/UE (articles R557-9 du code de l'environnement). Le site affiche « Catégorie DESP ».
- Récipients groupe 1 avec V ≤ 1 L et PS > 200 bar : le tableur exige aussi PS·V > 50 pour l'IP, donc un récipient de 0,2 L à 210 bar n'est pas soumis. Comportement conservé, à confirmer.
- Groupe 1 = gaz dangereux, groupe 2 = autres gaz. Les liquides ne sont pas traités par le tableur, donc pas par le site.
