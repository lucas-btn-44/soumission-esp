const R = require('../regles.js');
const A=(a,b,m)=>{ if(a!==b){ console.log('FAIL',m,a,b); process.exitCode=1; } };
// Valeurs en cache du tableur
let t=R.evaluer({type:'tuyauterie',fluide:'g1',PS:25,dim:75}); A(t.ip,true,'t1ip');A(t.dms,false,'t1dms');A(t.categorie.cat,'II','t1cat');
t=R.evaluer({type:'tuyauterie',fluide:'g2',PS:25,dim:75}); A(t.ip,false,'t2ip');A(t.categorie.cat,'I','t2cat');
for (const f of ['g1','g2','vapeur']) { const r=R.evaluer({type:'recipient',fluide:f,PS:50,dim:185,acafr:false}); A(r.ip,true,f);A(r.dms,false,f);A(r.epreuve,'avec épreuve',f);A(r.neo,false,f);A(r.categorie.cat,'IV',f); }
for (const f of ['vapeur','calo']) { const r=R.evaluer({type:'generateur',fluide:f,PS:10,dim:200}); A(r.ip,true,f);A(r.dms,false,f);A(r.epreuve,'avec épreuve',f); }

// Transcription brute des formules du tableur, pour comparaison sur une grille
function sheetRec(f,B5,B6,acafr){const B7=acafr?'O':'N',P=B5*B6,IF=(c,a,b)=>c?a:b,o={};
 if(f==='g1'){o.ip=(B5>0.5&&(B6>1||(B6<=1&&B5>200))&&(B5>=0.5&&P>50));o.dms=((B5>IF(B7==='O',0.5,4)&&B6*B5>10000&&B7==='N')||(o.ip&&B7==='O'));
  o.ep=o.ip?((B5>4&&P>80)?'avec épreuve':'sans épreuve'):'';o.neo=(B5>0.5&&B5<4&&P>50&&o.ip);
  o.cat=(B6<=1&&B5>1000)||(B6>1&&P>1000)?'IV':((B6<=1&&B5>200&&B5<=1000)||(B6>1&&P>200&&P<=1000))?'III':(B6>1&&P>50&&P<=200)?'II':(B6>1&&P>25&&P<=50)?'I':null;}
 else if(f==='g2'){const s=IF(B7==='O',2.5,4);o.ip=(B5>s&&(B6>1||(B6<=1&&B5>1000))&&(B5>=s&&P>200));o.dms=((B5>s&&B6*B5>10000&&B7==='N')||(o.ip&&B7==='O'));
  o.ep=o.ip?(B5>4?'avec épreuve':'sans épreuve'):'';o.neo=false;
  o.cat=((B6<=1&&B5>3000)||(B6>1&&P>3000&&B5>4))?'IV':((B6<=1&&B5>1000&&B5<=3000)||(B6>1&&P>1000&&P<=3000&&B5>0.5)||(B5>0.5&&B5<=4&&P>1000))?'III':(B6>1&&P>200&&P<=1000)?'II':(B6>1&&P>50&&P<=200)?'I':null;}
 else {o.ip=(B5>=0.5&&P>200&&B6>1);o.dms=((B5>IF(B7==='O',2.5,4)&&B6*B5>10000&&B7==='N')||(o.ip&&B7==='O'));
  o.ep=o.ip?(B6>100?'avec épreuve':'sans épreuve'):'';o.neo=(B6<100&&P>200&&o.ip);
  o.cat=((B6<=1&&B5>3000)||(B6>1&&P>3000&&B5>4))?'IV':((B6<=1&&B5>1000&&B5<=3000)||(B6>1&&P>1000&&P<=3000))?'III':(B6>1&&P>200&&P<=1000)?'II':(B6>1&&P>50&&P<=200)?'I':null;}
 return o;}
function sheetTuy(f,B4,B5){const P=B4*B5,o={};
 if(f==='g1'){o.ip=((B4>0.5&&B5>100)||(P>1000&&B5>25));o.dms=((B5>350&&B4>4)||(P>3500&&B5>100&&B4>4));
  const I=(B5>25&&B5<=100&&P<=1000),III=((B5>100&&P>3500)||B5>350),II=(B5>25&&!I&&!III);o.cat=III?'III':II?'II':I?'I':null;}
 else {o.ip=(B4>0.5&&B5>100&&P>3500);o.dms=(B5>250&&P>5000&&B4>4);
  const I=(B5>32&&B5<=100&&P>1000&&P<=3500),II=(B5>100&&B5<=250&&P>3500&&P<=5000),III=(B5>250&&P>5000);o.cat=III?'III':II?'II':I?'I':null;}
 o.ep=o.dms?'sans épreuve':'';return o;}
function sheetGen(f,B5,B6){const P=B5*B6,o={};o.ip=f==='calo'?(B5>1&&B6>25):(B5>0.5&&B6>25);
 o.dms=((B5>32&&B6>25)||(B5>=2.5&&B5<=32&&P>6000)||(B5>0.5&&B6>2400));o.ep=o.ip?'avec épreuve':'';return o;}

const PSs=[0.3,0.5,0.6,1,2,2.5,3,4,4.5,10,32,40,100,200,250,1000,1200,3000,3500];
const Vs=[0.2,0.5,1,2,10,24,25,26,50,80,100,101,185,500,1000,2400,2500,10000];
const DNs=[20,25,26,32,40,75,100,101,200,250,251,350,400,800];
const diff={};
const note=(k,ex)=>{diff[k]=diff[k]||{n:0,ex};diff[k].n++;};
for(const f of ['g1','g2','vapeur'])for(const ac of [false,true])for(const p of PSs)for(const v of Vs){
 const a=R.evaluer({type:'recipient',fluide:f,PS:p,dim:v,acafr:ac}),b=sheetRec(f,p,v,ac);
 for(const k of ['ip','dms','neo']) if(a[k]!==b[k]) note(`rec ${f} ${k}`,[p,v,ac,a[k],b[k]]);
 if(a.epreuve!==b.ep) note(`rec ${f} ep`,[p,v,ac,a.epreuve,b.ep]);
 const ca=a.categorie&&a.categorie.cat; if(ca!==b.cat) note(`rec ${f} cat${p<=0.5?' (horsChamp)':''}`,[p,v,ca,b.cat]);}
for(const f of ['g1','g2'])for(const p of PSs)for(const d of DNs){
 const a=R.evaluer({type:'tuyauterie',fluide:f,PS:p,dim:d}),b=sheetTuy(f,p,d);
 for(const k of ['ip','dms']) if(a[k]!==b[k]) note(`tuy ${f} ${k}`,[p,d,a[k],b[k]]);
 if(a.epreuve!==b.ep) note(`tuy ${f} ep`,[p,d,a.epreuve,b.ep]);
 const ca=a.categorie&&a.categorie.cat; if(ca!==b.cat) note(`tuy ${f} cat${p<=0.5?' (horsChamp)':''}`,[p,d,ca,b.cat]);}
for(const f of ['vapeur','calo'])for(const p of PSs)for(const v of Vs){
 const a=R.evaluer({type:'generateur',fluide:f,PS:p,dim:v}),b=sheetGen(f,p,v);
 for(const k of ['ip','dms']) if(a[k]!==b[k]) note(`gen ${f} ${k}`,[p,v,a[k],b[k]]);
 if(a.epreuve!==b.ep) note(`gen ${f} ep`,[p,v,a.epreuve,b.ep]);}
console.log(JSON.stringify(diff,null,0).replace(/\},/g,'},\n'));
console.log(process.exitCode?'cache: ÉCHEC':'cache: OK');

// Périodicités (arrêté du 20/11/2017, art. 15 et 18)
const P=(e)=>{const r=R.evaluer(e);return [r.ipPeriode&&r.ipPeriode.duree, r.rpPeriode&&r.rpPeriode.duree].join('|');};
A(P({type:'recipient',fluide:'g1',PS:50,dim:185}),'4 ans|10 ans','per rec');
A(P({type:'recipient',fluide:'g1',PS:50,dim:185,acafr:true}),'2 ans|10 ans','per acafr');
A(P({type:'recipient',fluide:'g2',PS:50,dim:185,fluideRP:'toxique'}),'4 ans|6 ans','per toxique');
A(P({type:'tuyauterie',fluide:'g1',PS:10,dim:400,fluideRP:'corrosif'}),'Programme de contrôle|3 ans','per tuy');
A(P({type:'generateur',fluide:'vapeur',PS:10,dim:200,fluideRP:'corrosif'}),'2 ans|10 ans','per gen');
A(P({type:'recipient',fluide:'g1',PS:0.3,dim:10}),'|','per non soumis');
console.log(process.exitCode?'périodicités: ÉCHEC':'périodicités: OK');
