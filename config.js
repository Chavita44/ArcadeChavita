/* Ranking mundial con Supabase. Si url y key están vacíos, el ranking es solo local (en el dispositivo).
   Son claves PÚBLICAS. Nunca pegues aquí la clave secreta (secret / service_role). */
const RK={url:"https://vjmssmnorshrtigljrvv.supabase.co",key:"sb_publishable_cDy_wCy8sPQvJzJRq2l8ZQ_RfO20xxU"};
/* Las claves antiguas (JWT, empiezan con eyJ) llevan 2 cabeceras; las nuevas (sb_publishable_) solo apikey */
const RKH=RK.key.startsWith("eyJ")?{apikey:RK.key,Authorization:"Bearer "+RK.key}:{apikey:RK.key};
