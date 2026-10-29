"""Assemble index.html (site autonome) à partir de page.html et regles.js.
Usage : python3 build.py [chemin_fragment_artifact]"""
import sys, pathlib
d = pathlib.Path(__file__).parent
page = (d / 'page.html').read_text(encoding='utf-8')
regles = (d / 'regles.js').read_text(encoding='utf-8')
frag = page.replace('/*REGLES*/', regles)
head = '<!doctype html>\n<html lang="fr">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<style>body{margin:0}[hidden]{display:none!important}</style>\n'
title_end = frag.index('<style>')
std = head + frag[:title_end] + frag[title_end:frag.index('</style>') + 8] + '\n</head>\n<body>\n' + frag[frag.index('</style>') + 8:] + '\n</body>\n</html>\n'
(d / 'index.html').write_text(std, encoding='utf-8')
if len(sys.argv) > 1:
    pathlib.Path(sys.argv[1]).write_text(frag, encoding='utf-8')
