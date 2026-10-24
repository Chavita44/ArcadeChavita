const LOGO="logo.png";
/* Agrega tus juegos aquí. Ejemplo:
{id:"neon-run",name:"Neon Run",genre:"Acción",type:"web",size:"0.8 MB",cover:"",url:"juegos/neon-run/",
 desc:"Descripción del juego.",guide:["Paso 1","Paso 2"],controls:{pc:"WASD + Espacio",pad:"Stick + A",touch:"Toca y desliza"}}
 type: "web" (se juega en el navegador) o "dl" (se descarga). */
const GAMES=[{id:"galaxia",name:"Chavita Galaxia",genre:"Arcade espacial",type:"web",size:"0.3 MB",cover:"juegos/galaxia/img/cover.png",url:"juegos/galaxia/",
desc:"Defiende la galaxia en oleadas infinitas. Derrota enemigos para ganar experiencia, elige mejoras temporales, recoge monedas y compra naves nuevas en la tienda. Cada 25 oleadas aparece un jefe muy difícil.",
guide:["Mueve tu nave con las flechas, WASD, el stick del mando o arrastrando el dedo. Disparas automáticamente.","Los enemigos sueltan experiencia, monedas y potenciadores: rayo láser, disparo disperso, doble disparo y +1 vida.","Cada vez que subes de nivel eliges 1 de 3 mejoras que duran toda la partida.","Cada 25 oleadas llega un jefe: esquiva sus ataques y no dejes de disparar.","Gasta tus monedas en la tienda para comprar naves con más vida y poder."],
controls:{pc:"Flechas o WASD. P para pausa",pad:"Stick o cruceta. Start para pausa",touch:"Arrastra el dedo para mover"}}];
/* Ranking por juego: {"neon-run":{p:[{n:"ANA",v:12500}],d:[{n:"LUIS",v:900}],t:[{n:"ANA",v:5400}]}}  p=puntos, d=dinero, t=segundos */
let RANK={};try{RANK=JSON.parse(localStorage.getItem("chavita_rank"))||{}}catch(e){}
const SOON=[1,2,3].map(i=>({id:"s"+i,name:"Próximamente",genre:"—",type:"",size:"— MB",soon:1,
desc:"Aquí irá la descripción del juego: de qué trata y qué lo hace especial.",
guide:["Cómo empezar la partida.","Controles básicos.","Cómo conseguir más puntos."],
controls:{pc:"Teclado y ratón",pad:"Cruceta y botones",touch:"Toques y gestos"}}));
const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s),T={web:"Web",dl:"Descarga"};
let f="all",cur=0,list=[],m="p",sx=null,drag=0;
$$("[data-l]").forEach(i=>i.src=LOGO);
/* ===== ANUNCIOS (paso 2/2) =====
   client: tu ID de editor de AdSense, ej. "ca-pub-1234567890123456"
   slots: el ID numérico de cada bloque de anuncios que crees en AdSense (Anuncios > Por bloque de anuncios).
   Mientras client o el slot estén vacíos, se ve un espacio de muestra. */
const ADS={client:"ca-pub-8924562486081992",slots:{top:"",mid:"",panel:""}};
const adHTML=k=>ADS.client&&ADS.slots[k]?`<ins class="adsbygoogle" style="display:block;width:100%" data-ad-client="${ADS.client}" data-ad-slot="${ADS.slots[k]}" data-ad-format="auto" data-full-width-responsive="true" data-tag-for-child-directed-treatment="1"></ins>`:`<small>Publicidad · espacio ${k}</small>`;
function loadAds(){if(!ADS.client||(window.chavitaConsent&&chavitaConsent())!=="all")return;$$("ins.adsbygoogle:not([data-p])").forEach(i=>{if(i.offsetWidth>0&&(!i.closest("#pn")||$("#pn").classList.contains("open"))){i.dataset.p=1;try{(window.adsbygoogle=window.adsbygoogle||[]).push({})}catch(e){}}})}
function render(){const x=GAMES.filter(g=>f=="all"||g.type==f);list=GAMES.length&&x.length?x:SOON;cur=Math.min(cur,list.length-1);
$("#tr").innerHTML=list.map((g,i)=>`<article class="card" data-i="${i}"><div class="cv${g.cover?" i":""}"><img src="${g.cover||LOGO}" alt="${g.cover?g.name:""}"></div><h3>${g.name}</h3><div class="meta"><span>${g.genre}</span><span>${g.size}</span><span>${T[g.type]||"Pronto"}</span></div><div class="acts">${g.soon?`<button class="btn" disabled>Pronto</button>`:`<a class="btn" href="${g.url||"#"}" ${g.type=="dl"?"download":'target="_blank" rel="noopener"'} draggable="false">${g.type=="dl"?"Descargar":"Jugar"}</a>`}<button class="btn o mi" aria-expanded="false" aria-controls="pn">Más inf.</button></div></article>`).join("");
tog(false);go(cur)}
function go(i){cur=Math.max(0,Math.min(list.length-1,i));$$(".card").forEach((c,k)=>c.classList.toggle("on",k==cur));
const c=$(".card.on");$("#tr").style.transform=`translateX(${$("#st").clientWidth/2-(c.offsetLeft+c.offsetWidth/2)}px)`;
$("#dots").innerHTML=list.map((_,k)=>`<button class="${k==cur?"on":""}" data-d="${k}" aria-label="Juego ${k+1}"></button>`).join("");info()}
function info(){const g=list[cur],k=g.controls||{};$("#pi").innerHTML=`<div><h3>${g.name}</h3><div class="chips"><span class="chip">Peso: ${g.size}</span><span class="chip">${g.genre}</span><span class="chip">${T[g.type]||"Próximamente"}</span></div></div><div><h4>Más información</h4><p>${g.desc}</p></div><div><h4>Mini guía</h4><ol>${g.guide.map(x=>`<li>${x}</li>`).join("")}</ol></div><div><h4>Controles</h4><div class="ctl"><div><b>PC</b>${k.pc||"—"}</div><div><b>Mando</b>${k.pad||"—"}</div><div><b>Móvil</b>${k.touch||"—"}</div></div></div>`}
function tog(v){const p=$("#pn"),o=v??!p.classList.contains("open");p.classList.toggle("open",o);p.inert=!o;
$$(".mi").forEach(b=>{b.setAttribute("aria-expanded",o);b.textContent=o?"Cerrar":"Más inf."});
if(o){loadAds();setTimeout(()=>p.scrollIntoView({behavior:"smooth",block:"nearest"}),250)}}
$("#tr").onclick=e=>{const c=e.target.closest(".card");if(!c)return;if(e.target.closest(".mi"))return tog();if(+c.dataset.i!=cur&&!drag)go(+c.dataset.i)};
const st=$("#st");st.addEventListener("dragstart",e=>e.preventDefault());
st.addEventListener("pointerdown",e=>{sx=e.clientX;drag=0});st.addEventListener("pointercancel",()=>sx=null);
st.addEventListener("pointerup",e=>{if(sx==null)return;const d=e.clientX-sx;sx=null;if(Math.abs(d)>50){drag=1;go(cur+(d<0?1:-1));setTimeout(()=>drag=0)}});
$("#pv").onclick=()=>go(cur-1);$("#nx").onclick=()=>go(cur+1);
$("#dots").onclick=e=>{if(e.target.dataset.d)go(+e.target.dataset.d)};
$("#ft").onclick=e=>{const b=e.target.closest("button");if(!b)return;f=b.dataset.f;cur=0;$$("#ft button").forEach(x=>x.classList.toggle("on",x==b));render()};
addEventListener("resize",()=>go(cur));
addEventListener("keydown",e=>{if(/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;if(e.key=="ArrowLeft")go(cur-1);if(e.key=="ArrowRight")go(cur+1);if(e.key=="Escape")tog(false)});
/* Mando */
let pd={},gp=0;
function toast(t){const e=$("#ts");e.textContent=t;e.classList.add("s");clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove("s"),2200)}
function poll(){if(gp)return;gp=1;(function l(){const p=[...(navigator.getGamepads?navigator.getGamepads():[])].find(Boolean);
if(p){const b=i=>p.buttons[i]&&p.buttons[i].pressed,x=p.axes[0]||0,s={L:b(14)||x<-.6,R:b(15)||x>.6,A:b(0),B:b(1),S:b(9)};
for(const k in s)if(s[k]&&!pd[k]){if(k=="L")go(cur-1);if(k=="R")go(cur+1);if(k=="A")tog();if(k=="B")tog(false);if(k=="S"){const a=$(".card.on .btn:not(.mi)");a&&a.click()}}pd=s}
requestAnimationFrame(l)})()}
addEventListener("gamepadconnected",()=>{toast("Mando conectado");poll()});
/* Ranking */
const FM={p:v=>v.toLocaleString("es-MX"),d:v=>"$"+v.toLocaleString("es-MX"),t:v=>{const h=v/3600|0,n=(v%3600)/60|0;return(h?h+" h ":"")+n+" min "+v%60+" s"}};
$("#rg").innerHTML=(GAMES.length?GAMES:SOON).map(g=>`<option value="${g.id}">${g.soon?"Juego "+g.id.slice(1):g.name}</option>`).join("");
function rank(){const r=[...((RANK[$("#rg").value]||{})[m]||[])].sort((a,b)=>b.v-a.v);
$("#rl").innerHTML=Array.from({length:10},(_,i)=>{const x=r[i];return`<li class="${x?"":"e"}"><b>${i+1}</b><span>${x?x.n:"Sin registro"}</span><span>${x?FM[m](x.v):"—"}</span></li>`}).join("");
$("#rn").textContent=GAMES.length?"Los récords se guardan en este dispositivo.":"Cuando haya juegos, cada uno tendrá su propio top 10."}
$("#rg").onchange=rank;$("#rt").onclick=e=>{const b=e.target.closest("button");if(!b)return;m=b.dataset.m;$$("#rt button").forEach(x=>x.classList.toggle("on",x==b));rank()};
/* Info */
const I={pc:'<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
pad:'<path d="M6 12h4M8 10v4"/><circle cx="15" cy="13" r="1"/><circle cx="18" cy="11" r="1"/><path d="M17.3 5H6.7a4 4 0 0 0-3.9 3.2l-1.6 7.5A3 3 0 0 0 4.1 19c.9 0 1.7-.4 2.2-1.1L8 16h8l1.7 1.9c.5.7 1.3 1.1 2.2 1.1a3 3 0 0 0 2.9-3.3l-1.6-7.5A4 4 0 0 0 17.3 5z"/>',
m:'<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/>',
tr:'<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
dl:'<path d="M12 3v12M7 11l5 5 5-5M4 20h16"/>',q:'<circle cx="12" cy="12" r="10"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01"/>'};
$("#gd").innerHTML=[["pc","PC","Teclado y ratón"],["pad","Mando","Conéctalo y juega al instante"],["m","Móvil","Controles táctiles"],["tr","Ranking","Un top por cada juego"],["dl","Descargas","Juegos más pesados para instalar"],["q","Mini guía","Aprende cada juego en un minuto"]].map(([k,t,d])=>`<div class="tile"><svg viewBox="0 0 24 24" aria-hidden="true">${I[k]}</svg><div><b>${t}</b><span>${d}</span></div></div>`).join("");
render();rank();$$("[data-ad]").forEach(e=>e.innerHTML=adHTML(e.dataset.ad));loadAds();