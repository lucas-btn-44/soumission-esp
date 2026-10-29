# Soumission des ESP

Site statique qui indique si un équipement sous pression (récipient, tuyauterie, générateur de vapeur) est soumis à l'inspection périodique, à la requalification périodique et à la DMS/CMS selon l'arrêté du 20 novembre 2017.

- `regles.js` : la logique (aucune dépendance), détaillée dans `REGLES.md`
- `page.html` : l'interface ; `python3 build.py` assemble `index.html`, le site complet en un seul fichier
- `tests/regles.test.js` : `node tests/regles.test.js` compare la logique aux formules du tableur d'origine

Seule la réglementation fait foi.
