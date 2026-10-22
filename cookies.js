(function(){var K="chavita_cookies",d=document;
function get(){try{return localStorage.getItem(K)}catch(e){return null}}
function set(v){try{localStorage.setItem(K,v)}catch(e){}}
window.chavitaConsent=get;
function show(prev){if(d.getElementById("ck"))return;var b=d.createElement("div");b.id="ck";b.className="cb";b.setAttribute("role","dialog");b.setAttribute("aria-label","Aviso de cookies");
b.innerHTML='<p>Usamos almacenamiento local para guardar tu progreso y cookies de publicidad de Google AdSense para mostrar anuncios. Los anuncios solo se cargan si los aceptas. Puedes cambiar tu decisión cuando quieras. <a href="aviso-privacidad.html#cookies">Más información</a></p><div class="row"><button class="btn o" data-v="min">Solo necesarias</button><button class="btn" data-v="all">Aceptar todo</button></div>';
b.onclick=function(e){var v=e.target.dataset&&e.target.dataset.v;if(!v)return;set(v);b.remove();if(prev==="all"&&v==="min")location.reload();else if(window.loadAds)loadAds()};d.body.appendChild(b)}
d.addEventListener("click",function(e){if(e.target.closest&&e.target.closest("[data-ck]")){e.preventDefault();var p=get();try{localStorage.removeItem(K)}catch(x){}show(p)}});
if(!get())show()})();
