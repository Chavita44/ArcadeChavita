const NAME="Chavita Galaxia",SK="chavita_galaxia",W=360,H=640,cv=document.getElementById("c"),g=cv.getContext("2d");
g.imageSmoothingEnabled=false;
/* ANUNCIOS CON RECOMPENSA: pon live:true SOLO cuando Google apruebe H5 Games Ads.
   Para probar el flujo sin Google, abre el juego con #probar-anuncios al final de la URL. */
const AD={live:false,client:"ca-pub-8924562486081992"},SIM=location.hash=="#probar-anuncios";
const SH=[["Nova",0,200,1,3,3],["Cometa",500,225,1.35,3.8,4],["Titán",1500,250,1.7,4.6,4],["Sombra",4000,275,2.1,5.5,5],["Espectro",10000,300,2.6,6.5,6]]; // nombre,precio,velocidad,daño,disparos/s,vidas
const UP=[["Daño +20%","dmg",.2],["Cadencia +15%","rate",.15],["Velocidad +12%","spd",.12],["Bala veloz +15%","bspd",.15],["Imán de monedas","mag",35],["XP +15%","xp",.15],["Escudo de 1 golpe","shield",1],["+1 vida","life",1]];
const PK=["laser","spread","dbl"],PI=[3,5,8],PN=["RAYO","DISPERSO","DOBLE"];
const IM={},N=[...Array(16)].map((_,i)=>"e"+i).concat(["boss","s0","s1","s2","s3","s4","kit","coin","bg","font","btn","btn_s","btn_d","ui_pause","hp_full","hp_empty","en_full","en_empty","bb0","bb1","bb2","bb3","bb4"],[...Array(18)].map((_,i)=>"i"+i));
let S;try{S=JSON.parse(localStorage.getItem(SK))}catch(e){}
S=Object.assign({coins:0,own:[0],sel:0,nick:"",best:{p:0,m:0,t:0}},S||{});
const save=()=>{try{localStorage.setItem(SK,JSON.stringify(S))}catch(e){}};
const R=(a,b)=>a+Math.random()*(b-a),cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const BAD=["puta","puto","mierda","verga","pene","culo","cabron","pendejo","chinga","zorra","nazi","sexo","porno","vagina","idiota","estupido"];
const clean=s=>s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[0431@$5]/g,c=>({0:"o",4:"a",3:"e",1:"i","@":"a","$":"s",5:"s"}[c])).replace(/[^a-z]/g,"");
const okNick=s=>/^[A-Za-z0-9ÁÉÍÓÚÑáéíóúñ_-]{3,12}$/.test(s)&&!BAD.some(b=>clean(s).includes(b));
function askNick(){let n=prompt("Tu apodo se verá en el ranking mundial. Usa de 3 a 12 letras o números, sin espacios, y no pongas tu nombre real ni datos personales:",S.nick||"");if(n==null)return;n=n.trim().slice(0,12);if(!okNick(n)){alert("Ese apodo no es válido. Usa de 3 a 12 letras o números, sin espacios ni groserías.");return}S.nick=n;save()}
let AC,mute=false;
function sfx(f,d=.08,ty="square",v=.04){if(mute)return;try{AC=AC||new AudioContext();const o=AC.createOscillator(),a=AC.createGain(),t=AC.currentTime;o.type=ty;o.frequency.value=f;a.gain.setValueAtTime(v,t);a.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(a);a.connect(AC.destination);o.start();o.stop(t+d)}catch(e){}}
/* Anuncios con recompensa (Ad Placement API de H5 Games Ads) */
function initAds(){if(!AD.live||localStorage.getItem("chavita_cookies")!=="all")return;const s=document.createElement("script");s.async=1;s.crossOrigin="anonymous";s.src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client="+AD.client;s.setAttribute("data-tag-for-child-directed-treatment","1");document.head.appendChild(s);window.adsbygoogle=window.adsbygoogle||[];window.adBreak=window.adConfig=o=>adsbygoogle.push(o);adConfig({preloadAdBreaks:"on",sound:"on"})}
initAds();
const canAd=()=>SIM||(AD.live&&!!window.adBreak);
function reward(name,ok){if(SIM){toast("Anuncio de prueba…");setTimeout(ok,2500);return}if(!canAd())return;adBreak({type:"reward",name,beforeReward:s=>s(),adViewed:ok,adDismissed(){},adBreakDone(){}})}
let sc="menu",sel=0,btns=[],run=null,B={m:0,l:0,x:0},msg="",mt=0,ch=[],paused=false,ptr=null,last=0;
const stars=[...Array(50)].map(()=>[R(0,W),R(0,H),R(.3,1)]);
const go=s=>{sc=s;sel=0},toast=m=>{msg=m;mt=2.5};
const spr=(im,x,y,m)=>{if(!im||!im.naturalWidth)return;const s=m/Math.max(im.naturalWidth,im.naturalHeight),w=im.naturalWidth*s,h=im.naturalHeight*s;g.drawImage(im,Math.round(x-w/2),Math.round(y-h/2),Math.round(w),Math.round(h))};
const bgd=()=>{g.drawImage(IM.bg,0,0,W,H);g.fillStyle="#fff9";for(const s of stars)g.fillRect(s[0],s[1],s[2]>.6?2:1,s[2]>.6?2:1)};
/* ---------- partida ---------- */
function start(){if(!S.nick)askNick();const s=SH[S.sel];run={t:0,pts:0,coins:0,xp:0,lv:1,need:100,wave:0,lives:Math.min(12,s[5]*(B.l?2:1)),inv:0,s,x:W/2,y:H-90,ft:0,bn:0,wt:.8,up:{dmg:1,rate:1,spd:1,bspd:1,mag:35,xp:1,shield:0},pu:{laser:0,spread:0,dbl:0},E:[],b:[],eb:[],dr:[],co:[]};paused=false;go("play")}
function mk(id,tx,ty,x,y){const s=IM["e"+id],r=30/Math.max(s.naturalWidth||1,s.naturalHeight||1),hp=Math.ceil(1+id*.5+run.wave*.12);return{id,s,x,y,tx,ty,hp,mh:hp,w:(s.naturalWidth||30)*r,h:(s.naturalHeight||30)*r,pa:id%5,cd:R(1,3),t:0,xp:5+id*3,tier:id}}
function spawn(n){const r=run;r.bn=1.6;if(n%25==0){const k=n/25,h=400+300*k,s=IM.boss;r.E.push({boss:1,k,s,x:W/2,y:-70,ty:90,hp:h,mh:h,w:110,h:110*(s.naturalHeight||1)/(s.naturalWidth||1),cd:2,t:0,xp:200*k,tier:15});return}
const tier=Math.min(15,Math.floor((n-1)/2)),c=Math.min(6+Math.floor(n/2),24);
for(let i=0;i<c;i++){const id=Math.max(0,tier-Math.floor(R(0,Math.min(4,tier+1)))),cx=50+(i%6)*52,cy=45+Math.floor(i/6)*38;r.E.push(mk(id,cx,cy,cx,-30-Math.floor(i/6)*30))}}
const shoot=(x,y,a,s,r=3)=>run.eb.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,r});
function atk(e,s){const r=run,a=Math.atan2(r.y-e.y,r.x-e.x);switch(e.pa){case 0:shoot(e.x,e.y,Math.PI/2,s);break;case 1:shoot(e.x,e.y,a,s);break;case 2:for(let i=-1;i<2;i++)shoot(e.x,e.y,Math.PI/2+i*.35,s);break;case 3:e.dv=1;break;case 4:for(let i=0;i<8;i++)shoot(e.x,e.y,i*Math.PI/4,s*.8)}}
function bossAtk(e){const r=run,k=e.k,s=130+k*8,f=e.hp/e.mh,a=Math.atan2(r.y-e.y,r.x-e.x);e.cd=Math.max(.6,1.5-k*.1);e.ph=f>.66?0:f>.33?1:2;
if(e.ph==0){for(let i=-1;i<2;i++)shoot(e.x,e.y+20,a+i*.18,s);if(Math.random()<.5)for(let i=-2;i<3;i++)shoot(e.x,e.y+20,Math.PI/2+i*.3,s*.9)}
else{e.rot=(e.rot||0)+(e.ph==1?.2:.3);const n=e.ph==1?12:16;for(let i=0;i<n;i++)shoot(e.x,e.y,e.rot+i*2*Math.PI/n,s*.8);if(e.ph==1)for(let i=-1;i<2;i++)shoot(e.x,e.y+20,a+i*.25,s*1.1);else{for(let i=-3;i<4;i++)shoot(e.x,e.y+20,Math.PI/2+i*.22,s);if(Math.random()<.4){r.E.push(mk(2,e.x-40,150,e.x-40,e.y),mk(2,e.x+40,150,e.x+40,e.y))}}}}
function fire(){const r=run,d=r.s[3]*r.up.dmg,v=-480*r.up.bspd,L=r.pu.laser>0,a=r.pu.spread>0?[-.36,-.18,0,.18,.36]:[0],xs=r.pu.dbl>0?[-7,7]:[0];
for(const an of a)for(const o of xs)r.b.push({x:r.x+o,y:r.y-18,vx:Math.sin(an)*-v,vy:Math.cos(an)*v,d:L?d*1.4:d,w:L?5:4,h:L?26:10,p:L,hit:[]});sfx(L?700:520,.05)}
function gain(x){const r=run;r.xp+=x*r.up.xp*(B.x?2:1);while(r.xp>=r.need&&sc=="play"){r.xp-=r.need;r.lv++;r.need=Math.round(r.need*1.25);ch=[...UP].sort(()=>Math.random()-.5).slice(0,3);sfx(880,.2,"triangle",.06);go("lvl")}}
function kill(e){const r=run;r.E.splice(r.E.indexOf(e),1);r.pts+=Math.round(e.xp*10);gain(e.xp);sfx(e.boss?90:180,.18,"sawtooth",.05);
const m=B.m?2:1,n=e.boss?10:(Math.random()<.6?1:0);for(let i=0;i<n;i++)r.co.push({x:e.x+R(-12,12),y:e.y,v:(1+Math.floor(e.tier/3))*m*(e.boss?5:1)});
const d=e.boss?3:(Math.random()<.08?1:0);for(let i=0;i<d;i++)r.dr.push({x:e.x+R(-20,20),y:e.y,k:Math.random()<.2?3:Math.floor(R(0,3))})}
function hurt(){const r=run;if(r.inv>0)return;if(r.up.shield>0){r.up.shield--;r.inv=1;sfx(200,.1);return}r.lives--;r.inv=1.6;r.eb=[];sfx(120,.25,"sawtooth",.06);if(r.lives<=0)end()}
function rec(){let Z;try{Z=JSON.parse(localStorage.getItem("chavita_rank"))||{}}catch(e){Z={}}const q=Z.galaxia=Z.galaxia||{p:[],d:[],t:[]},n=S.nick||"JUGADOR",r=run;[["p",r.pts],["d",r.coins],["t",Math.floor(r.t)]].forEach(([k,v])=>{if(v>0){q[k].push({n,v});q[k].sort((a,b)=>b.v-a.v);q[k]=q[k].slice(0,10)}});try{localStorage.setItem("chavita_rank",JSON.stringify(Z))}catch(e){}
if(RK.url&&r.pts>0){fetch(RK.url+"/rest/v1/scores",{method:"POST",headers:{...RKH,"Content-Type":"application/json",Prefer:"return=minimal"},body:JSON.stringify({game:"galaxia",nick:n,p:r.pts,d:r.coins,t:Math.floor(r.t)})}).catch(()=>{});for(const k in WR)delete WR[k]}}
function end(){const r=run;rec();S.coins+=r.coins;S.best.p=Math.max(S.best.p,r.pts);S.best.m=Math.max(S.best.m,r.coins);S.best.t=Math.max(S.best.t,Math.floor(r.t));save();B={m:0,l:0,x:0};go("over")}
const apply=u=>{if(u[1]=="life")run.lives=Math.min(9,run.lives+1);else run.up[u[1]]+=u[2]},pick=u=>{apply(u);go("play")};
function pad(){return[...(navigator.getGamepads?navigator.getGamepads():[])].find(Boolean)}
function upd(dt){const r=run;r.t+=dt;r.inv=Math.max(0,r.inv-dt);r.bn=Math.max(0,r.bn-dt);for(const k of PK)r.pu[k]=Math.max(0,r.pu[k]-dt);
let dx=(K.ArrowRight||K.KeyD?1:0)-(K.ArrowLeft||K.KeyA?1:0),dy=(K.ArrowDown||K.KeyS?1:0)-(K.ArrowUp||K.KeyW?1:0);const p=pad(),b=i=>p&&p.buttons[i]&&p.buttons[i].pressed;
if(p){if(Math.abs(p.axes[0])>.2)dx=p.axes[0];if(Math.abs(p.axes[1])>.2)dy=p.axes[1];if(b(14))dx=-1;if(b(15))dx=1;if(b(12))dy=-1;if(b(13))dy=1}
const sp=r.s[2]*r.up.spd;if(dx||dy){r.x+=dx*sp*dt;r.y+=dy*sp*dt;ptr=null}else if(ptr){const mx=sp*dt*2.2;r.x+=cl(ptr[0]-r.x,-mx,mx);r.y+=cl(ptr[1]-50-r.y,-mx,mx)}
r.x=cl(r.x,20,W-20);r.y=cl(r.y,H*.35,H-30);r.ft-=dt;if(r.ft<=0){r.ft=1/(r.s[4]*r.up.rate);fire()}
if(!r.E.length){r.wt-=dt;if(r.wt<=0){r.wave++;spawn(r.wave);r.wt=1.4}}
const n=r.wave,spd=Math.min(220,110+n*2.5);
for(const e of r.E){e.t+=dt;if(e.boss){e.x=W/2+Math.sin(e.t*.7)*90;e.y+=(e.ty-e.y)*Math.min(1,dt*2);e.cd-=dt;if(e.cd<=0)bossAtk(e);continue}
if(e.dv){e.y+=190*dt;e.x+=Math.sin(e.t*6)*110*dt;if(e.y>H+30){e.y=-30;e.dv=0}}else{e.x+=(e.tx+Math.sin(r.t*.8)*22-e.x)*Math.min(1,dt*3);e.y+=(e.ty-e.y)*Math.min(1,dt*2);e.cd-=dt;if(e.cd<=0&&e.y>10){e.cd=R(2,4.5)/(1+n*.03);atk(e,spd)}}}
r.b=r.b.filter(q=>{q.x+=q.vx*dt;q.y+=q.vy*dt;return q.y>-40&&q.y<H+40&&q.x>-20&&q.x<W+20});
for(const q of r.b)for(const e of r.E.slice()){if(q.dead||q.hit.includes(e))continue;if(Math.abs(q.x-e.x)<e.w/2+q.w/2&&Math.abs(q.y-e.y)<e.h/2+q.h/2){e.hp-=q.d;if(q.p)q.hit.push(e);else q.dead=1;if(e.hp<=0&&r.E.includes(e))kill(e)}}
r.b=r.b.filter(q=>!q.dead);
r.eb=r.eb.filter(q=>{q.x+=q.vx*dt;q.y+=q.vy*dt;if(Math.hypot(q.x-r.x,q.y-r.y)<q.r+9){hurt();return false}return q.y>-20&&q.y<H+20&&q.x>-20&&q.x<W+20});
if(sc!="play")return;for(const e of r.E)if(Math.abs(e.x-r.x)<e.w/2+10&&Math.abs(e.y-r.y)<e.h/2+8)hurt();
r.co=r.co.filter(c=>{c.y+=90*dt;const d=Math.hypot(r.x-c.x,r.y-c.y);if(d<r.up.mag){c.x+=(r.x-c.x)/d*220*dt;c.y+=(r.y-c.y)/d*220*dt}if(d<16){r.coins+=c.v;sfx(1200,.05,"triangle",.03);return false}return c.y<H+20});
r.dr=r.dr.filter(c=>{c.y+=70*dt;if(Math.hypot(r.x-c.x,r.y-c.y)<20){if(c.k==3)r.lives=Math.min(9,r.lives+1);else r.pu[PK[c.k]]=10;sfx(900,.15,"triangle",.05);return false}return c.y<H+20})}
/* ---------- fuente, botones y dibujo ---------- */
const TC={};
function fa(c){const f=IM.font;if(TC[c])return TC[c];const o=document.createElement("canvas");o.width=f.naturalWidth||1;o.height=f.naturalHeight||1;const x=o.getContext("2d");x.drawImage(f,0,0);x.globalCompositeOperation="source-in";x.fillStyle=c;x.fillRect(0,0,o.width,o.height);if(f.naturalWidth)TC[c]=o;return o}
const gl=c=>FNT.g[c]||FNT.g[" "],tw=(s,k)=>[...s].reduce((a,c)=>a+(gl(c)[1]+FNT.sp)*k,0)-FNT.sp*k;
function T(s,x,y,k=2,c="#DAD7CD",al="center"){s=String(s).toUpperCase();let X=al=="center"?x-tw(s,k)/2:al=="right"?x-tw(s,k):x;const a=fa(c),Y=y-FNT.base*k;for(const ch of s){const q=gl(ch);g.drawImage(a,q[0],0,q[1],FNT.h,Math.round(X),Math.round(Y),q[1]*k,FNT.h*k);X+=(q[1]+FNT.sp)*k}}
function btn(x,y,w,h,txt,fn,dis){btns.push({x,y,w,h,fn});const s=btns.length-1==sel,im=IM[dis?"btn_d":s?"btn_s":"btn"],ih=im.naturalHeight,iw=im.naturalWidth,cp=Math.round(8*h/ih);
g.drawImage(im,0,0,8,ih,x,y,cp,h);g.drawImage(im,8,0,iw-16,ih,x+cp,y,w-2*cp,h);g.drawImage(im,iw-8,0,8,ih,x+w-cp,y,cp,h);
let k=h<34?2:3;txt=String(txt);while(k>1&&tw(txt.toUpperCase(),k)>w-2*cp-6)k--;T(txt,x+w/2,y+h/2+FNT.c*k/2,k,dis?"#aaa":"#000")}
const bar=(f,e,x,y,w,v)=>{if(!f.naturalWidth)return;const h=w*f.naturalHeight/f.naturalWidth;g.drawImage(e,x,y,w,h);if(v>0)g.drawImage(f,0,0,Math.max(1,Math.round(f.naturalWidth*v)),f.naturalHeight,x,y,w*v,h)};
function drawPlay(){const r=run;bgd();for(const c of r.co)spr(IM.coin,c.x,c.y,14);for(const c of r.dr)spr(c.k==3?IM.kit:IM["i"+PI[c.k]],c.x,c.y,22);
for(const e of r.E){spr(e.s,e.x,e.y,e.boss?110:30);if(e.hp<e.mh&&!e.boss){g.fillStyle="#f44";g.fillRect(e.x-10,e.y-e.h/2-4,20*e.hp/e.mh,2)}}
for(const q of r.b){g.fillStyle=q.p?"#7f7":"#9ff";g.fillRect(q.x-q.w/2,q.y-q.h/2,q.w,q.h)}
g.fillStyle="#ff6b6b";for(const q of r.eb)g.fillRect(q.x-q.r,q.y-q.r,q.r*2,q.r*2);
if(r.inv<=0||Math.floor(r.t*12)%2)spr(IM["s"+S.sel],r.x,r.y,44);if(r.up.shield){g.strokeStyle="#7fe";g.beginPath();g.arc(r.x,r.y,26,0,7);g.stroke()}
T("PTS "+r.pts,8,20,2,"#DAD7CD","left");T(""+r.coins,W-26,20,2,"#f5c542","right");spr(IM.coin,W-14,12,16);
g.fillStyle="#fff3";g.fillRect(8,36,W-16,5);g.fillStyle="#6bd16b";g.fillRect(8,36,(W-16)*r.xp/r.need,5);T("NV "+r.lv,8,60,2,"#DAD7CD","left");T("OLEADA "+r.wave,W-8,60,2,"#DAD7CD","right");
r.mx=Math.max(r.mx||r.lives,r.lives);bar(IM.hp_full,IM.hp_empty,6,H-34,140,r.lives/r.mx);T("X"+r.lives,152,H-14,2,"#fff","left");
let n=0;PK.forEach((k,i)=>{if(r.pu[k]>0){const y=H-34-n*26;spr(IM["i"+PI[i]],W-132,y+8,22);bar(IM.en_full,IM.en_empty,W-116,y,110,r.pu[k]/10);n++}});
if(r.up.shield)T("ESCUDO",W/2,H-46,1,"#7fe");
const bo=r.E.find(e=>e.boss);if(bo){const f=bo.hp/bo.mh,im=IM["bb"+(f>.78?0:f>.38?1:f>.1?2:3)],h=im.naturalWidth?240*im.naturalHeight/im.naturalWidth:20;if(im.naturalWidth)g.drawImage(im,(W-240)/2,70,240,h);g.fillStyle="#f44";g.fillRect(60,70+h+2,240*f,2)}
if(r.bn>0)T(r.wave%25==0?"¡JEFE!":"OLEADA "+r.wave,W/2,H/2-60,4);
if(sc=="play"&&!paused){btns.push({x:W/2-14,y:4,w:28,h:28,fn:()=>paused=true});g.drawImage(IM.ui_pause,W/2-14,4,28,28)}
if(paused){g.fillStyle="#000a";g.fillRect(0,0,W,H);T("PAUSA",W/2,200,5);btn(60,250,240,38,"SEGUIR",()=>paused=false);btn(60,296,240,38,"MENÚ",()=>{end();go("menu")})}}
function drawMenu(){bgd();const nm=NAME.split(" ");T(nm[0],W/2,92,5);T(nm[1]||"",W/2,134,5);T("MONEDAS "+S.coins,W/2,170,2,"#f5c542");spr(IM["s"+S.sel],W/2,225,56);
btn(60,262,240,34,"JUGAR",start);btn(60,302,240,34,"TIENDA",()=>go("shop"));btn(60,342,240,34,"RANKING",()=>go("rank"));btn(60,382,240,34,"APODO "+(S.nick||"-"),askNick);
if(canAd()){let y=424;[["m","dinero"],["l","vida"],["x","XP"]].forEach(([k,m2])=>{btn(60,y,240,28,B[k]?"x2 "+m2+" ACTIVO":"Ver anuncio x2 "+m2,()=>{if(!B[k])reward("x2"+k,()=>{B[k]=1;toast("¡Activado!")})});y+=32})}
btn(60,H-86,240,30,"VOLVER AL ARCADE",()=>{location.href="../../"});T("RECORD "+S.best.p+" PTS",W/2,H-34,1,"#9fa89c");T("P PAUSA  M SONIDO",W/2,H-20,1,"#9fa89c")}
function drawShop(){bgd();T("TIENDA",W/2,40,4);T("MONEDAS "+S.coins,W/2,66,2,"#f5c542");
SH.forEach((s,i)=>{const y=76+i*90,own=S.own.includes(i);g.fillStyle="#141f18cc";g.fillRect(10,y,W-20,82);spr(IM["s"+i],48,y+41,56);T(s[0],96,y+22,2,"#DAD7CD","left");T("VEL "+s[2]+" DAÑO "+s[3]+" CAD "+s[4]+" VIDAS "+s[5],96,y+38,1,"#9fa89c","left");
btn(96,y+46,246,30,own?(S.sel==i?"USANDO":"ELEGIR"):"COMPRAR "+s[1],()=>{if(own)S.sel=i;else if(S.coins>=s[1]){S.coins-=s[1];S.own.push(i);S.sel=i;sfx(900,.2,"triangle")}else toast("Te faltan monedas");save()},!own&&S.coins<s[1])});
btn(60,H-46,240,34,"VOLVER",()=>go("menu"))}
function drawOver(){bgd();const r=run;T("FIN DEL JUEGO",W/2,110,3,"#f66");T("PUNTOS "+r.pts,W/2,170);T("OLEADA "+r.wave,W/2,196);T("TIEMPO "+Math.floor(r.t)+" S",W/2,222);T("MONEDAS +"+r.coins,W/2,248,2,"#f5c542");T("NIVEL "+r.lv,W/2,274);
btn(60,320,240,36,"OTRA VEZ",start);btn(60,362,240,36,"RANKING",()=>go("rank"));btn(60,404,240,36,"MENÚ",()=>go("menu"))}
function drawLvl(){drawPlay();g.fillStyle="#000b";g.fillRect(0,0,W,H);T("¡NIVEL "+run.lv+"!",W/2,120,4,"#6bd16b");T("ELIGE UNA MEJORA",W/2,150,2);ch.forEach((u,i)=>btn(30,180+i*56,300,46,u[0],()=>pick(u)));
if(canAd())btn(30,360,300,46,"Ver anuncio: las 3 mejoras",()=>reward("lv3",()=>{ch.forEach(apply);go("play")}))}
let rm="p";const fv=(k,v)=>k=="t"?Math.floor(v/60)+":"+String(v%60).padStart(2,"0"):k=="d"?"$"+v:String(v);
let rs=RK.url?"w":"l";const WR={};
function wload(k){const c=WR[k];if(c&&Date.now()-c.t<30000)return;WR[k]={t:Date.now(),rows:c?c.rows:null};fetch(RK.url+"/rest/v1/scores?game=eq.galaxia&select=nick,"+k+"&order="+k+".desc&limit=10",{headers:RKH}).then(r=>r.json()).then(d=>{WR[k]={t:Date.now(),rows:Array.isArray(d)?d.map(x=>({n:x.nick,v:x[k]})):[]}}).catch(()=>{WR[k]={t:Date.now(),rows:[]}})}
function drawRank(){bgd();T("RANKING",W/2,44,4);let rows;
if(rs=="w"){wload(rm);rows=(WR[rm]||{}).rows}else{let L={};try{L=(JSON.parse(localStorage.getItem("chavita_rank"))||{}).galaxia||{}}catch(e){}rows=L[rm]||[]}
[["p","PUNTOS"],["d","DINERO"],["t","TIEMPO"]].forEach(([k,l],i)=>{btn(10+i*116,62,112,28,l,()=>rm=k);if(rm==k){g.fillStyle="#DAD7CD";g.fillRect(10+i*116,92,112,3)}});
if(RK.url){btn(10,100,172,26,"MUNDIAL",()=>rs="w");btn(188,100,162,26,"MI DISPOSITIVO",()=>rs="l");g.fillStyle="#DAD7CD";g.fillRect(rs=="w"?10:188,128,rs=="w"?172:162,3)}
for(let i=0;i<10;i++){const y=172+i*36,x=rows&&rows[i];g.fillStyle=i<3?"#3A5A40cc":"#141f18cc";g.fillRect(10,y-20,W-20,30);T(i+1,34,y,2,"#DAD7CD","right");T(x?x.n:rows?"SIN REGISTRO":"CARGANDO...",44,y,2,x?"#DAD7CD":"#667","left");if(x)T(fv(rm,Number(x.v)||0),W-18,y,2,"#f5c542","right")}
T(rs=="w"?"RANKING MUNDIAL":"RECORDS DE ESTE DISPOSITIVO",W/2,H-60,1,"#9fa89c");btn(60,H-46,240,34,"VOLVER",()=>go("menu"))}
/* ---------- entrada y bucle ---------- */
const K={};let pp={};
const nav=c=>{if((sc=="play"&&!paused)||!btns.length)return;if(c=="ArrowUp")sel=Math.max(0,sel-1);if(c=="ArrowDown")sel=Math.min(btns.length-1,sel+1);if(c=="Enter"||c=="Space"){const b=btns[sel];b&&b.fn()}};
addEventListener("keydown",e=>{K[e.code]=1;if(/Arrow|Space/.test(e.code))e.preventDefault();if((e.code=="KeyP"||e.code=="Escape")&&sc=="play")paused=!paused;if(e.code=="KeyM")mute=!mute;nav(e.code)});
addEventListener("keyup",e=>K[e.code]=0);
const pt=e=>{const q=cv.getBoundingClientRect();return[(e.clientX-q.left)*W/q.width,(e.clientY-q.top)*H/q.height]};
cv.addEventListener("pointerdown",e=>{const[x,y]=pt(e),b=btns.find(b=>x>=b.x&&x<=b.x+b.w&&y>=b.y&&y<=b.y+b.h);if(b){b.fn();return}if(sc=="play"){paused=false;ptr=[x,y]}});
cv.addEventListener("pointermove",e=>{if(ptr&&(e.buttons||e.pointerType=="touch"))ptr=pt(e)});addEventListener("pointerup",()=>ptr=null);
function padNav(){const p=pad();if(!p)return;const b=i=>p.buttons[i]&&p.buttons[i].pressed,s={u:b(12)||p.axes[1]<-.6,d:b(13)||p.axes[1]>.6,a:b(0),st:b(9)};
for(const k in s)if(s[k]&&!pp[k]){if(sc=="play"&&!paused){if(k=="st")paused=true}else if(sc=="play"&&k=="st")paused=false;else if(k=="u")sel=Math.max(0,sel-1);else if(k=="d")sel=Math.min(btns.length-1,sel+1);else{const q=btns[sel];q&&q.fn()}}pp=s}
const fit=()=>{const s=Math.min(innerWidth/W,innerHeight/H);cv.style.width=W*s+"px";cv.style.height=H*s+"px"};addEventListener("resize",fit);fit();
function loop(t){const dt=Math.min(.05,(t-last)/1000||0);last=t;btns.length=0;padNav();for(const s of stars)s[1]=(s[1]+s[2]*60*dt)%H;
if(sc=="play"&&!paused)upd(dt);
if(sc=="menu")drawMenu();else if(sc=="shop")drawShop();else if(sc=="over")drawOver();else if(sc=="lvl")drawLvl();else if(sc=="rank")drawRank();else drawPlay();
if(mt>0){mt-=dt;T(msg,W/2,H-70,8,"#fff")}requestAnimationFrame(loop)}
Promise.all(N.map(n=>new Promise(r=>{const i=new Image();i.onload=i.onerror=r;i.src="img/"+n+".png";IM[n]=i}))).then(()=>requestAnimationFrame(loop));
