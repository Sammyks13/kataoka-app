import { useState, useEffect, createContext, useContext, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area, Legend } from "recharts";


const VIDEO_FORMATS=["DEEP DIVES / UO : MOMENTS","DEEP DIVES / UO : CONCEPTS","DEEP DIVES / UO : ORIGINS","OBJECTS / OBJEKTER","THE EDIT / FORMATET","THE VERDICT / DOMSTOLEN","KATAOKA Sample Walkthrough","KATAOKA Collection Concept","KATAOKA Collection Walkthrough"];

const computeStreak=(ml,nl)=>{
  let streak=0;const d=new Date();
  while(streak<365){
    const ds=d.toLocaleDateString('sv-SE');
    const hasM=ml.some(l=>l.date===ds);
    const hasN=nl.some(l=>l.date===ds);
    if(hasM&&hasN){streak++;d.setDate(d.getDate()-1);}
    else if(streak===0&&ds===todayStr()){d.setDate(d.getDate()-1);}
    else break;
  }
  return streak;
};

// ─── Bible Verses (daily rotation by day-of-year) ────────────────────────────
const VERSES = [
  {ref:"Phil 4:13",      t:"I can do all things through Christ who strengthens me."},
  {ref:"Prov 16:3",      t:"Commit your work to the Lord, and your plans will be established."},
  {ref:"Isa 40:31",      t:"Those who hope in the Lord will renew their strength. They will soar on wings like eagles."},
  {ref:"Josh 1:9",       t:"Be strong and courageous. Do not be afraid — the Lord your God is with you wherever you go."},
  {ref:"Rom 8:28",       t:"In all things God works for the good of those who love him."},
  {ref:"Prov 3:5-6",     t:"Trust in the Lord with all your heart and lean not on your own understanding."},
  {ref:"Jer 29:11",      t:"I know the plans I have for you — plans to prosper you and not to harm you."},
  {ref:"Matt 6:33",      t:"Seek first his kingdom and his righteousness, and all these things will be given to you."},
  {ref:"1 Cor 16:13",    t:"Be on your guard; stand firm in the faith; be courageous; be strong."},
  {ref:"Ps 46:10",       t:"Be still, and know that I am God."},
  {ref:"Rom 12:12",      t:"Be joyful in hope, patient in affliction, faithful in prayer."},
  {ref:"Gal 6:9",        t:"Let us not become weary in doing good, for at the proper time we will reap a harvest."},
  {ref:"2 Tim 1:7",      t:"God has not given us a spirit of fear, but of power, love, and self-discipline."},
  {ref:"Ps 23:1",        t:"The Lord is my shepherd; I shall not want."},
  {ref:"Ps 37:4",        t:"Delight yourself in the Lord, and he will give you the desires of your heart."},
  {ref:"Matt 5:16",      t:"Let your light shine before others, that they may glorify your Father in heaven."},
  {ref:"1 Pet 5:7",      t:"Cast all your anxiety on him because he cares for you."},
  {ref:"Ps 121:1-2",     t:"I lift up my eyes to the mountains — my help comes from the Lord."},
  {ref:"Matt 11:28",     t:"Come to me, all you who are weary and burdened, and I will give you rest."},
  {ref:"Prov 4:23",      t:"Above all else, guard your heart, for everything you do flows from it."},
  {ref:"Lam 3:22-23",    t:"His mercies are new every morning; great is your faithfulness."},
  {ref:"John 16:33",     t:"In this world you will have trouble. But take heart — I have overcome the world."},
  {ref:"Rom 8:31",       t:"If God is for us, who can be against us?"},
  {ref:"Eph 6:10",       t:"Be strong in the Lord and in his mighty power."},
  {ref:"Ps 18:32",       t:"It is God who arms me with strength and keeps my way secure."},
  {ref:"2 Cor 4:17",     t:"Our light and momentary troubles are achieving for us an eternal glory that far outweighs them all."},
  {ref:"Col 3:23",       t:"Whatever you do, work at it with all your heart, as working for the Lord."},
  {ref:"Eph 3:20",       t:"To him who is able to do immeasurably more than all we ask or imagine."},
  {ref:"Ps 27:1",        t:"The Lord is my light and my salvation — whom shall I fear?"},
  {ref:"Isa 41:10",      t:"Do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen and help you."},
  {ref:"2 Tim 4:7",      t:"I have fought the good fight, I have finished the race, I have kept the faith."},
  {ref:"Heb 11:1",       t:"Faith is confidence in what we hope for and assurance about what we do not see."},
  {ref:"Prov 27:17",     t:"As iron sharpens iron, so one person sharpens another."},
  {ref:"James 1:3-4",    t:"The testing of your faith produces perseverance. Perseverance must finish its work so you may be mature."},
  {ref:"Ps 119:105",     t:"Your word is a lamp for my feet, a light on my path."},
  {ref:"Matt 6:34",      t:"Do not worry about tomorrow, for tomorrow will worry about itself."},
  {ref:"Rom 5:3-4",      t:"Suffering produces perseverance; perseverance, character; and character, hope."},
  {ref:"Prov 21:5",      t:"The plans of the diligent lead to profit as surely as haste leads to poverty."},
  {ref:"1 Chr 28:20",    t:"Be strong and courageous, and do the work. Do not be afraid — the Lord God is with you."},
  {ref:"Ps 90:12",       t:"Teach us to number our days, that we may gain a heart of wisdom."},
  {ref:"John 15:5",      t:"I am the vine; you are the branches. If you remain in me, you will bear much fruit."},
  {ref:"Acts 20:24",     t:"I consider my life worth nothing; my only aim is to finish the race the Lord has given me."},
  {ref:"2 Cor 12:9",     t:"My grace is sufficient for you, for my power is made perfect in weakness."},
  {ref:"Heb 12:1",       t:"Let us run with perseverance the race marked out for us."},
  {ref:"Mark 9:23",      t:"Everything is possible for one who believes."},
  {ref:"Prov 22:29",     t:"Do you see someone skilled in their work? They will serve before kings."},
  {ref:"Ps 34:18",       t:"The Lord is close to the brokenhearted and saves those who are crushed in spirit."},
  {ref:"Phil 4:6-7",     t:"Do not be anxious about anything, but present your requests to God."},
  {ref:"Rom 8:37",       t:"In all these things we are more than conquerors through him who loved us."},
  {ref:"Matt 7:7",       t:"Ask and it will be given; seek and you will find; knock and the door will be opened."},
  {ref:"Eccl 9:10",      t:"Whatever your hand finds to do, do it with all your might."},
  {ref:"Phil 1:6",       t:"He who began a good work in you will carry it on to completion."},
  {ref:"Ps 16:8",        t:"I keep my eyes always on the Lord. With him at my right hand, I will not be shaken."},
  {ref:"Dan 10:19",      t:"Do not be afraid. Peace! Be strong now; be strong."},
  {ref:"1 Cor 9:27",     t:"I discipline my body and make it my slave, so I will not be disqualified."},
  {ref:"Prov 6:6",       t:"Go to the ant, you sluggard; consider its ways and be wise!"},
  {ref:"James 4:10",     t:"Humble yourselves before the Lord, and he will lift you up."},
  {ref:"Ps 31:24",       t:"Be strong and take heart, all you who hope in the Lord."},
  {ref:"Neh 8:10",       t:"The joy of the Lord is your strength."},
  {ref:"Prov 13:20",     t:"Walk with the wise and become wise, for a companion of fools suffers harm."},
  {ref:"Ps 37:23",       t:"The Lord makes firm the steps of the one who delights in him."},
];
const getDailyVerse = () => {
  const d = new Date();
  const day = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
  return VERSES[day % VERSES.length];
};

// ─── Weather helpers ──────────────────────────────────────────────────────────
const WCI = c => c===0?"☀️":c<=3?"🌤️":c<=48?"🌫️":c<=67?"🌧️":c<=77?"❄️":c<=82?"🌦️":"⛈️";
const WCD = c => c===0?"Clear":c<=3?"Partly cloudy":c<=48?"Fog":c<=67?"Rain":c<=77?"Snow":c<=82?"Showers":"Storm";
const uvInfo = uv => uv<=2?{c:"#39FF14",l:"Low"}:uv<=5?{c:"#FFD700",l:"Moderate"}:uv<=7?{c:"#FF6B35",l:"High"}:uv<=10?{c:"#FF3B5C",l:"Very High"}:{c:"#FF00FF",l:"Extreme"};
// MET Norway (Yr) symbol_code → emoji + label. Symbol codes look like "partlycloudy_day", "rain", "snow", "heavysnow", "fog", "thunder", "clearsky_night" etc.
const YR_ICON = code => {
  if(!code)return "☀️";
  if(code.includes("thunder"))return "⛈️";
  if(code.includes("sleet"))return "🌨️";
  if(code.includes("snow"))return "❄️";
  if(code.includes("fog"))return "🌫️";
  if(code.includes("rain")||code.includes("showers"))return "🌧️";
  if(code.includes("cloudy")&&!code.includes("partly")&&!code.includes("fair"))return "☁️";
  if(code.includes("partlycloudy")||code.includes("fair"))return code.includes("night")?"🌙":"🌤️";
  if(code.includes("clearsky"))return code.includes("night")?"🌙":"☀️";
  return "🌤️";
};
const YR_LABEL = code => {
  if(!code)return "Clear";
  if(code.includes("thunder"))return "Storm";
  if(code.includes("sleet"))return "Sleet";
  if(code.includes("snow"))return "Snow";
  if(code.includes("fog"))return "Fog";
  if(code.includes("showers"))return "Showers";
  if(code.includes("rain"))return "Rain";
  if(code.includes("cloudy")&&!code.includes("partly")&&!code.includes("fair"))return "Cloudy";
  if(code.includes("partlycloudy")||code.includes("fair"))return "Partly cloudy";
  if(code.includes("clearsky"))return "Clear";
  return "Clear";
};

// ─── Muscle definitions ───────────────────────────────────────────────────────
// Individual major muscles → front/back view. A muscle's rank reflects OVERALL strength:
// the heaviest estimated 1RM across every logged lift that involves it (kw match).
const MUSCLES = [
  // FRONT
  {key:"CHEST",    label:"Chest",      view:"front", kw:["bench","to high fly","dip"],             cat:"hpush"},
  {key:"DELTS_F",  label:"Shoulders",  view:"front", kw:["shoulder press","lat raise","bench"],    cat:"vpush"},
  {key:"BICEPS",   label:"Biceps",     view:"front", kw:["curl","pull up","row","rock climber"],   cat:"curl"},
  {key:"FOREARMS", label:"Forearms",   view:"front", kw:["wrist","curl","pull up","row"],          cat:"forearm"},
  {key:"ABS",      label:"Abs",        view:"front", kw:["crunch","leg raise","clean","zercher"],  cat:"core"},
  {key:"QUADS",    label:"Quads",      view:"front", kw:["zercher","squat","clean"],               cat:"squat"},
  // BACK
  {key:"TRAPS",    label:"Traps",      view:"back",  kw:["clean","row","shrug","shoulder press"],  cat:"hpull"},
  {key:"DELTS_R",  label:"Rear Delts", view:"back",  kw:["reverse fly","row","shoulder press"],   cat:"rearfly"},
  {key:"TRICEPS",  label:"Triceps",    view:"back",  kw:["dip","bench","shoulder press"],          cat:"tricep"},
  {key:"LATS",     label:"Lats",       view:"back",  kw:["pull up","row","rock climber"],          cat:"vpull"},
  {key:"LOWERBACK",label:"Lower Back", view:"back",  kw:["clean","zercher","row"],                 cat:"hinge"},
  {key:"GLUTES",   label:"Glutes",     view:"back",  kw:["zercher","squat","clean"],               cat:"squat"},
  {key:"HAMS",     label:"Hamstrings", view:"back",  kw:["clean","zercher","deadlift"],            cat:"hinge"},
  {key:"CALVES",   label:"Calves",     view:"back",  kw:["calf raise","calf"],                    cat:"generic"},
];

// Muscle contribution weights per exercise — what % of each muscle each exercise stimulates
const EXERCISE_MUSCLE_WEIGHTS=[
  {match:/bench|chest press/i,           w:{CHEST:0.40,DELTS_F:0.20,TRICEPS:0.40}},
  {match:/to high fly|chest fly|pec/i,   w:{CHEST:0.80,DELTS_F:0.20}},
  {match:/dip/i,                         w:{CHEST:0.30,TRICEPS:0.50,DELTS_F:0.20}},
  {match:/pull.?up|chin.?up/i,           w:{LATS:0.50,BICEPS:0.30,DELTS_R:0.10,TRAPS:0.10}},
  {match:/rock.*climber/i,               w:{LATS:0.45,BICEPS:0.35,DELTS_R:0.10,TRAPS:0.10}},
  {match:/row|cable.*pull/i,             w:{LATS:0.35,BICEPS:0.25,DELTS_R:0.25,TRAPS:0.15}},
  {match:/shoulder press|military|push press|^bb shoulder|ohp/i, w:{DELTS_F:0.50,TRICEPS:0.30,TRAPS:0.20}},
  {match:/lat.?raise/i,                  w:{DELTS_F:0.80,TRAPS:0.20}},
  {match:/reverse.*fly|rear.*delt/i,     w:{DELTS_R:0.90,TRAPS:0.10}},
  {match:/zercher|squat(?!.*leg)/i,      w:{QUADS:0.40,GLUTES:0.25,HAMS:0.15,LOWERBACK:0.10,ABS:0.10}},
  {match:/deadlift|rdl/i,                w:{HAMS:0.40,GLUTES:0.30,LOWERBACK:0.20,ABS:0.10}},
  {match:/clean|snatch/i,                w:{QUADS:0.20,GLUTES:0.15,HAMS:0.10,TRAPS:0.20,LATS:0.15,DELTS_F:0.10,ABS:0.10}},
  {match:/curl(?!.*wrist)/i,             w:{BICEPS:0.80,FOREARMS:0.20}},
  {match:/wrist|twister/i,               w:{FOREARMS:1.00}},
  {match:/crunch/i,                      w:{ABS:0.90,LOWERBACK:0.10}},
  {match:/leg raise/i,                   w:{ABS:0.80,QUADS:0.20}},
  {match:/tricep|extension(?!.*leg)/i,   w:{TRICEPS:1.00}},
  {match:/shrug/i,                       w:{TRAPS:1.00}},
  {match:/calf/i,                        w:{CALVES:1.00}},
];

// Universal category thresholds as BW ratio [beg, nov, int, adv, elite]
const CATEGORY_THRESHOLDS={
  hpush:  [0.50,0.75,1.00,1.25,1.50],
  fly:    [0.25,0.40,0.60,0.80,1.00],
  dip:    [0.30,0.50,0.75,1.00,1.35],
  vpull:  [0.10,0.25,0.45,0.70,1.00],
  hpull:  [0.40,0.60,0.85,1.10,1.40],
  vpush:  [0.35,0.55,0.75,1.00,1.25],
  lateraise:[0.10,0.15,0.22,0.30,0.40],
  rearfly:[0.08,0.12,0.18,0.25,0.35],
  squat:  [0.50,0.75,1.00,1.40,1.80],
  hinge:  [0.60,0.90,1.25,1.60,2.00],
  power:  [0.40,0.60,0.80,1.00,1.25],
  curl:   [0.15,0.25,0.35,0.45,0.60],
  tricep: [0.15,0.25,0.35,0.45,0.60],
  core:   [0.20,0.35,0.50,0.70,0.90],
  forearm:[0.10,0.18,0.28,0.40,0.55],
  generic:[0.30,0.50,0.75,1.00,1.25],
};
const CATEGORY_PATTERNS=[
  {match:/bench|chest press/i,           cat:"hpush"},
  {match:/to high fly|chest fly|pec/i,   cat:"fly"},
  {match:/dip/i,                         cat:"dip"},
  {match:/pull.?up|chin.?up|pulldown/i,  cat:"vpull"},
  {match:/rock.*climber/i,               cat:"vpull"},
  {match:/row|cable.*pull/i,             cat:"hpull"},
  {match:/shoulder press|military|push press|bb shoulder|ohp/i, cat:"vpush"},
  {match:/lat.?raise/i,                  cat:"lateraise"},
  {match:/reverse.*fly|rear.*delt/i,     cat:"rearfly"},
  {match:/zercher|squat(?!.*leg)/i,      cat:"squat"},
  {match:/deadlift|rdl/i,               cat:"hinge"},
  {match:/clean|snatch/i,               cat:"power"},
  {match:/curl(?!.*wrist)/i,             cat:"curl"},
  {match:/tricep|extension(?!.*leg)/i,   cat:"tricep"},
  {match:/crunch|leg raise/i,            cat:"core"},
  {match:/wrist|twister/i,              cat:"forearm"},
];

const daysSince = d => d ? Math.floor((Date.now()-new Date(d))/86400000) : null;
const recovColor = d => d===null?"#333":d===0?"#FF3B5C":d===1?"#FF6B35":d===2?"#FFD700":"#39FF14";
const recovLabel = d => d===null?"—":d===0?"Today":d===1?"1d":d===2?"2d":`${d}d`;

// Weighted muscle rank — weighted average of all exercises contributing to this muscle,
// judged against that muscle's appropriate category thresholds (not generic)
const muscleRank = (muscle, prs, bw) => {
  let bestIdx=-1,bestRM=0;
  for(const [k,pr] of Object.entries(prs)){
    const name=k.replace(/_/g," ");
    // Find this exercise's own category (for proper thresholds), via CATEGORY_PATTERNS,
    // and confirm it actually contributes to this muscle via EXERCISE_MUSCLE_WEIGHTS.
    const muscleMatch=EXERCISE_MUSCLE_WEIGHTS.find(({match,w})=>match.test(name)&&w[muscle.key]);
    if(!muscleMatch)continue;
    const catMatch=CATEGORY_PATTERNS.find(({match})=>match.test(name));
    const cat=catMatch?catMatch.cat:muscle.cat;
    const thresh=CATEGORY_THRESHOLDS[cat]||CATEGORY_THRESHOLDS.generic;
    const r=pr.rm/bw;
    const idx=r>=thresh[4]?4:r>=thresh[3]?3:r>=thresh[2]?2:r>=thresh[1]?1:r>=thresh[0]?0:-1;
    // This exercise's tier, judged fairly against its own category — take whichever exercise
    // gives this muscle its best-earned tier (e.g. a strong bench beats a so-so fly).
    if(idx>bestIdx){bestIdx=idx;bestRM=pr.rm;}
  }
  if(bestIdx<0)return bestRM>0?{n:"UNTRAINED",c:"#4B5563",pct:0,rm:Math.round(bestRM)}:null;
  const tier=SL_TIERS[bestIdx];
  return{n:tier.n,c:tier.c,pct:tier.pct,rm:Math.round(bestRM)};
};
const muscleRecovery = (muscle, logs) => {
  for(const log of [...logs].reverse()){
    const names=Object.values(log.exerciseNames||{}).map(n=>n.toLowerCase());
    if(muscle.kw.some(kw=>names.some(n=>n.includes(kw)))) return daysSince(log.date);
  }
  return null;
};
const mergeGoalPRs=(prs,goals)=>{
  const merged={...prs};
  (goals||[]).forEach(g=>{
    if(!g||!g.current||!g.name||g.unit!=="kg")return;
    const key=String(g.name).toLowerCase().replace(/\s+/g,"_");
    if(!merged[key]||merged[key].rm<g.current){
      merged[key]={rm:g.current,weight:g.current,reps:1,fromGoal:true};
    }
  });
  return merged;
};
const getGoalProgress=(goal)=>{
  if(!goal||!goal.name)return null;
  const relevant=workoutLogs.flatMap(log=>{
    const exIds=Object.keys(log.exerciseNames||{}).filter(eid=>{
      const name=(log.exerciseNames[eid]||'').toLowerCase();
      return name.includes(goal.name.toLowerCase());
    });
    return exIds.flatMap(eid=>(log.sets[eid]||[]).filter(s=>s.weight&&s.reps));
  });
  if(!relevant.length)return null;
  const best=relevant.reduce((acc,s)=>{
    const rm=epley(s.weight,s.reps);
    return !acc||rm>acc.rm?{rm,weight:s.weight,reps:s.reps}:acc;
  },null);
  return best?{fromLog:true,actual:best.rm,progress:((best.rm/goal.target)*100).toFixed(0)}:null;
};
const buildMuscleStatus = (prs, bw, logs) =>
  MUSCLES.map(m=>({...m, rank:muscleRank(m,prs,bw), days:muscleRecovery(m,logs)}));

// ─── Storage ──────────────────────────────────────────────────────────────────
const S = {
  async get(k){try{const r=await window.storage.get("k3_"+k);return r?JSON.parse(r.value):null;}catch{return null;}},
  async set(k,v){try{await window.storage.set("k3_"+k,JSON.stringify(v));}catch{}},
};

// ─── Google Health OAuth2 (PKCE) ───────────────────────────────────────────────
const GHEALTH_CLIENT_ID="1096396435654-e21c0p9eqor0nmb62qn6r3g6j7pd4lgu.apps.googleusercontent.com";
const GHEALTH_REDIRECT_URI=typeof window!=="undefined"?window.location.origin:"https://kataoka-app.vercel.app";
const GHEALTH_SCOPES=[
  "https://www.googleapis.com/auth/googlehealth.sleep.readonly",
  "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.readonly",
].join(" ");

// Generate a random PKCE code verifier
const ghealthGenVerifier=()=>{
  const arr=new Uint8Array(64);
  crypto.getRandomValues(arr);
  return btoa(String.fromCharCode(...arr)).replace(/\+/g,"-").replace(/\//g,"_").replace(/=/g,"");
};
// SHA-256 hash + base64url encode the verifier to get the code challenge
const ghealthGenChallenge=async verifier=>{
  const enc=new TextEncoder().encode(verifier);
  const hash=await crypto.subtle.digest("SHA-256",enc);
  const bytes=new Uint8Array(hash);
  let str="";for(const b of bytes)str+=String.fromCharCode(b);
  return btoa(str).replace(/\+/g,"-").replace(/\//g,"_").replace(/=/g,"");
};

// Kick off the OAuth flow — redirects the browser to Google's consent screen
const ghealthConnect=async()=>{
  const verifier=ghealthGenVerifier();
  const challenge=await ghealthGenChallenge(verifier);
  sessionStorage.setItem("ghealth_verifier",verifier);
  const params=new URLSearchParams({
    client_id:GHEALTH_CLIENT_ID,
    redirect_uri:GHEALTH_REDIRECT_URI,
    response_type:"code",
    scope:GHEALTH_SCOPES,
    access_type:"offline",
    prompt:"consent",
    code_challenge:challenge,
    code_challenge_method:"S256",
  });
  window.location.href=`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

// Exchange an auth code (from the redirect callback) for tokens
const ghealthExchangeCode=async code=>{
  const verifier=sessionStorage.getItem("ghealth_verifier");
  if(!verifier)throw new Error("Missing PKCE verifier — restart connection");
  const res=await fetch("/api/ghealth-token",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      grant_type:"authorization_code",
      code,
      code_verifier:verifier,
      redirect_uri:GHEALTH_REDIRECT_URI,
    }),
  });
  if(!res.ok)throw new Error("Token exchange failed: "+(await res.text()));
  const tokens=await res.json();
  sessionStorage.removeItem("ghealth_verifier");
  const stored={
    access_token:tokens.access_token,
    refresh_token:tokens.refresh_token,
    expires_at:Date.now()+(tokens.expires_in*1000),
  };
  await S.set("ghealth_tokens",stored);
  return stored;
};

// Refresh an expired access token using the stored refresh token
const ghealthRefreshToken=async()=>{
  const stored=await S.get("ghealth_tokens");
  if(!stored?.refresh_token)return null;
  const res=await fetch("/api/ghealth-token",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      grant_type:"refresh_token",
      refresh_token:stored.refresh_token,
    }),
  });
  if(!res.ok)return null;
  const tokens=await res.json();
  const updated={
    access_token:tokens.access_token,
    refresh_token:stored.refresh_token, // refresh tokens aren't usually re-issued
    expires_at:Date.now()+(tokens.expires_in*1000),
  };
  await S.set("ghealth_tokens",updated);
  return updated;
};

// Get a valid access token, refreshing if needed. Returns null if not connected.
const ghealthGetValidToken=async()=>{
  let stored=await S.get("ghealth_tokens");
  if(!stored)return null;
  if(Date.now()>stored.expires_at-60000){ // refresh 1 min before expiry
    stored=await ghealthRefreshToken();
  }
  return stored?.access_token||null;
};

const ghealthDisconnect=async()=>{await S.set("ghealth_tokens",null);};

// Fetch sleep data for a given date (YYYY-MM-DD), returns hours slept + bed/wake times, or null
// Fetch sleep data across a date range [startDateStr, endDateStr] inclusive.
// Returns a map of dateStr -> {sleep, bedtime, wakeTime, sleepStages?, minutesAsleep?}
// keyed by the date the sleep *ended* on (wake-up date = morning log date).
const ghealthFetchSleepRange=async(startDateStr,endDateStr)=>{
  const token=await ghealthGetValidToken();
  if(!token)return{};
  // Bump end date by 1 day for exclusive upper bound, use civil_end_time
  const endNext=new Date(endDateStr+'T12:00:00');endNext.setDate(endNext.getDate()+1);
  const endNextStr=endNext.toISOString().split('T')[0];
  const url=`https://health.googleapis.com/v4/users/me/dataTypes/sleep/dataPoints?filter=sleep.interval.civil_end_time >= "${startDateStr}" AND sleep.interval.civil_end_time < "${endNextStr}"&pageSize=25`;
  const res=await fetch(url,{headers:{Authorization:`Bearer ${token}`}});
  if(!res.ok)return{};
  const data=await res.json();
  const out={};
  for(const point of(data?.dataPoints||[])){
    if(!point?.sleep)continue;
    const start=new Date(point.sleep.interval.startTime);
    const end=new Date(point.sleep.interval.endTime);
    const dayKey=end.toLocaleDateString('sv-SE'); // sv-SE gives YYYY-MM-DD in local time
    const hours=Math.round(((end-start)/3600000)*10)/10;
    const stagesArr=point.sleep.summary?.stagesSummary||[];
    const stages={deep:0,rem:0,light:0,awake:0};
    stagesArr.forEach(s=>{
      const mins=parseInt(s.minutes)||0;
      const t=(s.type||"").toUpperCase();
      if(t==="DEEP")stages.deep=mins;
      else if(t==="REM")stages.rem=mins;
      else if(t==="LIGHT")stages.light=mins;
      else if(t==="AWAKE")stages.awake=mins;
    });
    const hasStages=stagesArr.length>0;
    const minutesAsleep=point.sleep.summary?.minutesAsleep?parseInt(point.sleep.summary.minutesAsleep):null;
    if(!out[dayKey]||hours>out[dayKey].sleep){
      out[dayKey]={
        sleep:hours,
        bedtime:start.toTimeString().slice(0,5),
        wakeTime:end.toTimeString().slice(0,5),
        ...(hasStages?{sleepStages:stages}:{}),
        ...(minutesAsleep!=null?{minutesAsleep}:{}),
      };
    }
  }
  return out;
};
const ghealthFetchSleep=async(dateStr)=>{
  const range=await ghealthFetchSleepRange(dateStr,dateStr);
  return range[dateStr]||null;
};

// Fetch resting heart rate across a date range. Returns map of dateStr -> value.
// Correct URL: daily-resting-heart-rate (kebab-case)
// Correct filter field: dailyRestingHeartRate.date (camelCase per docs)
const ghealthFetchRestingHRRange=async(startDateStr,endDateStr)=>{
  const token=await ghealthGetValidToken();
  if(!token)return{};
  const endNext=new Date(endDateStr+'T12:00:00');endNext.setDate(endNext.getDate()+1);
  const endNextStr=endNext.toISOString().split('T')[0];
  const url=`https://health.googleapis.com/v4/users/me/dataTypes/daily-resting-heart-rate/dataPoints?filter=dailyRestingHeartRate.date >= "${startDateStr}" AND dailyRestingHeartRate.date < "${endNextStr}"&pageSize=20`;
  const res=await fetch(url,{headers:{Authorization:`Bearer ${token}`}});
  if(!res.ok)return{};
  const data=await res.json();
  const out={};
  for(const point of(data?.dataPoints||[])){
    const d=point?.dailyRestingHeartRate;
    if(!d)continue;
    // date field is {year, month, day} object in the API response
    const dateObj=d.date;
    if(!dateObj||d.value==null)continue;
    const dateStr=`${dateObj.year}-${String(dateObj.month).padStart(2,'0')}-${String(dateObj.day).padStart(2,'0')}`;
    out[dateStr]=parseFloat(d.value)||d.value;
  }
  return out;
};
const ghealthFetchRestingHR=async(dateStr)=>{
  const range=await ghealthFetchRestingHRRange(dateStr,dateStr);
  return range[dateStr]||null;
};

// Fetch HRV across a date range. Returns map of dateStr -> value.
// Correct URL: daily-heart-rate-variability (kebab-case)
// Correct filter field: dailyHeartRateVariability.date (camelCase per docs)
const ghealthFetchHRVRange=async(startDateStr,endDateStr)=>{
  const token=await ghealthGetValidToken();
  if(!token)return{};
  const endNext=new Date(endDateStr+'T12:00:00');endNext.setDate(endNext.getDate()+1);
  const endNextStr=endNext.toISOString().split('T')[0];
  const url=`https://health.googleapis.com/v4/users/me/dataTypes/daily-heart-rate-variability/dataPoints?filter=dailyHeartRateVariability.date >= "${startDateStr}" AND dailyHeartRateVariability.date < "${endNextStr}"&pageSize=20`;
  const res=await fetch(url,{headers:{Authorization:`Bearer ${token}`}});
  if(!res.ok)return{};
  const data=await res.json();
  const out={};
  for(const point of(data?.dataPoints||[])){
    const d=point?.dailyHeartRateVariability;
    if(!d)continue;
    const dateObj=d.date;
    if(!dateObj||d.value==null)continue;
    const dateStr=`${dateObj.year}-${String(dateObj.month).padStart(2,'0')}-${String(dateObj.day).padStart(2,'0')}`;
    out[dateStr]=parseFloat(d.value)||d.value;
  }
  return out;
};
const ghealthFetchHRV=async(dateStr)=>{
  const range=await ghealthFetchHRVRange(dateStr,dateStr);
  return range[dateStr]||null;
};

// ─── Ranks ────────────────────────────────────────────────────────────────────
const RANKS=[{min:2.5,n:"GRANDMASTER",c:"#FFD700"},{min:2.0,n:"MASTER",c:"#FF6B35"},{min:1.75,n:"DIAMOND",c:"#7DF9FF"},{min:1.5,n:"PLATINUM",c:"#D0D0D0"},{min:1.25,n:"GOLD",c:"#FFD700"},{min:1.0,n:"SILVER",c:"#C0C0C0"},{min:0.75,n:"BRONZE",c:"#CD7F32"},{min:0.5,n:"IRON",c:"#888"},{min:0,n:"ROOKIE",c:"#555"}];

// StrengthLevel.com actual standards (male, kg). {bw→[beg,nov,int,adv,elite]}
const SL={
  bench:{50:[24,38,57,79,103],55:[29,45,64,87,113],60:[34,51,72,96,123],65:[39,57,79,104,132],70:[44,62,85,112,141],75:[49,68,92,119,149],80:[53,74,98,127,157],85:[58,79,105,134,165],90:[62,84,111,141,172],95:[67,89,116,147,180],100:[71,94,122,153,187]},
  squat:{50:[33,52,76,104,136],55:[40,60,86,116,149],60:[47,68,95,127,161],65:[53,76,104,137,173],70:[59,83,113,147,184],75:[66,91,122,157,195],80:[72,98,130,166,205],85:[78,105,138,175,215],90:[83,112,146,184,225],95:[89,118,153,192,234],100:[95,125,160,201,243]},
  deadlift:{50:[44,65,93,125,160],55:[51,74,103,137,174],60:[58,83,114,149,187],65:[66,92,124,160,200],70:[73,100,133,171,212],75:[79,108,142,182,224],80:[86,116,151,192,235],85:[93,123,160,201,245],90:[99,131,168,211,256],95:[105,138,176,220,266],100:[111,145,184,228,275]},
  ohp:{50:[15,25,38,53,71],55:[18,29,42,59,77],60:[21,32,47,64,84],65:[24,36,52,70,90],70:[27,40,56,75,95],75:[30,43,60,80,101],80:[33,47,64,84,106],85:[36,50,68,89,111],90:[39,54,72,93,116],95:[41,57,76,97,121],100:[44,60,79,102,125]},
  // Estimated for power clean (~70% of deadlift standards)
  clean:{50:[31,46,65,88,112],55:[36,52,72,96,122],60:[41,58,80,104,131],65:[46,64,87,112,140],70:[51,70,93,120,148],75:[55,76,99,127,157],80:[60,81,106,134,165],85:[65,86,112,141,172],90:[69,92,118,148,179],95:[74,97,123,154,186],100:[78,102,129,160,193]},
};
// Match exercise name to SL table key
const matchSL=name=>{
  const n=name.toLowerCase();
  if(n.includes('bench'))return SL.bench;
  if(n.includes('squat'))return SL.squat;
  if(n.includes('deadlift')||n.includes(' rdl')||n.includes('rdl ')||n==='rdl')return SL.deadlift;
  if((n.includes('press')&&!n.includes('bench')&&!n.includes('chest'))||n.includes('ohp')||n.includes('military'))return SL.ohp;
  if(n.includes('clean')||n.includes('snatch'))return SL.clean;
  return null;
};
// Interpolate SL thresholds at given bodyweight
const slThresholds=(table,bw)=>{
  const bws=Object.keys(table).map(Number).sort((a,b)=>a-b);
  const bc=Math.max(bws[0],Math.min(bws[bws.length-1],bw));
  let lo=bws[0],hi=bws[bws.length-1];
  for(let i=0;i<bws.length-1;i++){if(bws[i]<=bc&&bws[i+1]>=bc){lo=bws[i];hi=bws[i+1];break;}}
  const t=hi===lo?0:(bc-lo)/(hi-lo);
  return table[lo].map((v,i)=>Math.round(v+t*(table[hi][i]-v)));
};
const SL_TIERS=[
  {n:"BEGINNER",    c:"#9CA3AF", pct:5,  desc:"stronger than ~5% of men your build",  ratio:"1 in 20"},
  {n:"NOVICE",      c:"#60A5FA", pct:25, desc:"stronger than ~25% of men your build", ratio:"1 in 4"},
  {n:"INTERMEDIATE",c:"#34D399", pct:50, desc:"stronger than ~50% of men your build", ratio:"1 in 2"},
  {n:"ADVANCED",    c:"#F59E0B", pct:75, desc:"stronger than ~75% of men your build", ratio:"top 25%"},
  {n:"ELITE",       c:"#FF3B5C", pct:95, desc:"stronger than ~95% of men your build", ratio:"top 5%"},
];
// Age factors from strengthlevel.com age-adjusted tables (ratio vs peak adult 25-40)
const AGE_FACTORS=[[15,0.857],[20,0.980],[25,1.0],[30,1.0],[35,1.0],[40,1.0],[45,0.947],[50,0.885],[55,0.816],[60,0.745],[65,0.674],[70,0.612],[75,0.551],[80,0.490]];
const computeAge=dob=>{if(!dob)return 25;const b=new Date(dob+'T00:00:00'),t=new Date();let a=t.getFullYear()-b.getFullYear();const m=t.getMonth()-b.getMonth();if(m<0||(m===0&&t.getDate()<b.getDate()))a--;return a;};
const ageMultiplier=age=>{const a=Math.max(15,Math.min(80,age));let lo=AGE_FACTORS[0],hi=AGE_FACTORS[AGE_FACTORS.length-1];for(let i=0;i<AGE_FACTORS.length-1;i++){if(AGE_FACTORS[i][0]<=a&&AGE_FACTORS[i+1][0]>=a){lo=AGE_FACTORS[i];hi=AGE_FACTORS[i+1];break;}}const t2=hi[0]===lo[0]?0:(a-lo[0])/(hi[0]-lo[0]);return lo[1]+t2*(hi[1]-lo[1]);};
// Universal rank — works for any exercise via category patterns, falls back to SL for big lifts
const getUniversalRank=(name,rm1,bw,dob=null)=>{
  const age=dob?computeAge(dob):25;
  const af=ageMultiplier(age);
  // Try SL table first (most accurate)
  const table=name?matchSL(name):null;
  if(table){
    const[b,n,i,a,e]=slThresholds(table,bw).map(v=>Math.round(v*af));
    const idx=rm1>=e?4:rm1>=a?3:rm1>=i?2:rm1>=n?1:rm1>=b?0:-1;
    const tier=idx>=0?SL_TIERS[idx]:null;
    return{n:tier?tier.n:"UNTRAINED",c:tier?tier.c:"#4B5563",pct:tier?tier.pct:0,desc:tier?tier.desc:"below beginner standards",ratio:tier?tier.ratio:"",rm:Math.round(rm1),source:"sl",next:[b,n,i,a,e][idx+1]||null};
  }
  // Try category pattern
  if(name){
    const n2=name.toLowerCase();
    for(const{match,cat}of CATEGORY_PATTERNS){
      if(match.test(n2)){
        const[b,nv,i,a,e]=CATEGORY_THRESHOLDS[cat].map(r=>Math.round(r*bw*af));
        const r=rm1/bw/af;
        const thresh=CATEGORY_THRESHOLDS[cat];
        const idx=r>=thresh[4]?4:r>=thresh[3]?3:r>=thresh[2]?2:r>=thresh[1]?1:r>=thresh[0]?0:-1;
        const tier=idx>=0?SL_TIERS[idx]:null;
        return{n:tier?tier.n:"UNTRAINED",c:tier?tier.c:"#4B5563",pct:tier?tier.pct:0,desc:tier?tier.desc:"below beginner standards",ratio:tier?tier.ratio:"",rm:Math.round(rm1),source:"cat",cat,next:[b,nv,i,a,e][idx+1]||null};
      }
    }
  }
  // Generic ratio fallback
  const r=rm1/bw;
  const fallbackTiers=CATEGORY_THRESHOLDS.generic;
  const idx=r>=fallbackTiers[4]?4:r>=fallbackTiers[3]?3:r>=fallbackTiers[2]?2:r>=fallbackTiers[1]?1:r>=fallbackTiers[0]?0:-1;
  const tier=idx>=0?SL_TIERS[idx]:null;
  return{n:tier?tier.n:"UNTRAINED",c:tier?tier.c:"#4B5563",pct:tier?tier.pct:0,desc:tier?tier.desc:"below beginner standards",ratio:tier?tier.ratio:"",rm:Math.round(rm1),source:"ratio"};
};
const getExerciseRank=getUniversalRank;
const getRank = r => RANKS.find(x=>r>=x.min)||RANKS[RANKS.length-1];
const epley   = (w,r) => r===1?w:Math.round(w*(1+r/30));
const POWER   = ["Hang Clean","Zercher","Bench","Pull Up","Shoulder Press","Dips"];
const todayStr = () => new Date().toISOString().split("T")[0];

const DEFAULT_TEMPLATES=[
  {id:"wo1",name:"WO1",subtitle:"Power + Upper",color:"#FF3B5C",exercises:[
    {id:"hc",name:"Hang Clean",sets:3,targetReps:2},{id:"zs",name:"Zercher Squat",sets:2,targetReps:4},
    {id:"bp",name:"Flat Bench Press",sets:3,targetReps:2},{id:"pu",name:"No Thumb Pull Up",sets:3,targetReps:3},
    {id:"rw",name:"Mag Grip Cable Row",sets:3,targetReps:8},{id:"dp",name:"Weighted Dips",sets:3,targetReps:4},
    {id:"fl",name:"Low to High Fly",sets:3,targetReps:12},{id:"cl",name:"Bayesian Curl LEFT",sets:3,targetReps:12},
    {id:"cr",name:"Bayesian Curl RIGHT",sets:3,targetReps:12},{id:"ll",name:"Lat Raise LEFT",sets:2,targetReps:15},
    {id:"lr",name:"Lat Raise RIGHT",sets:2,targetReps:15},{id:"cc",name:"Cable Crunch",sets:2,targetReps:15},
    {id:"lg",name:"Leg Raise",sets:2,targetReps:15},
  ]},
  {id:"wo2",name:"WO2",subtitle:"Cardio + Accessory",color:"#3B82F6",exercises:[
    {id:"sp",name:"BB Shoulder Press",sets:3,targetReps:5},{id:"rc",name:"Rock Climber Pull Up",sets:3,targetReps:5},
    {id:"l2",name:"Lat Raise LEFT",sets:2,targetReps:15},{id:"r2",name:"Lat Raise RIGHT",sets:2,targetReps:15},
    {id:"wc",name:"Wrist Curl",sets:3,targetReps:15},{id:"wt",name:"Wrist Twisters",sets:3,targetReps:20},
    {id:"rf",name:"Reverse Fly",sets:2,targetReps:12},
  ]},
];

// ── AI fetch helper ───────────────────────────────────────────────────────────
const aiPost=async(apiKey,body)=>{
  const resp=await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST",
    headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,...body})
  });
  const data=await resp.json();
  if(data.error)throw new Error(data.error.message);
  return(data.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("");
};

// ─── Context ──────────────────────────────────────────────────────────────────
const Ctx = createContext({});

// ─── Shared components ────────────────────────────────────────────────────────
function GlowBar({pct,color="#39FF14"}){
  return(
    <div style={{background:"#151515",borderRadius:100,height:8,overflow:"hidden"}}>
      <div style={{width:`${Math.max(0,Math.min(100,pct))}%`,height:"100%",borderRadius:100,background:color,boxShadow:`0 0 8px ${color}66`,transition:"width 0.7s ease"}}/>
    </div>
  );
}

function Divider(){
  const {T}=useContext(Ctx);
  return <div style={{borderBottom:`1px solid ${T.div}`,margin:"0 0 16px"}}/>;
}

function BackBtn(){
  const {back,T}=useContext(Ctx);
  return(
    <button onClick={back} style={{background:"none",border:"none",color:T.sub,cursor:"pointer",fontSize:22,padding:"0 12px 0 0",lineHeight:1}}>←</button>
  );
}

function PageHeader({title}){
  const {T}=useContext(Ctx);
  return(
    <div style={{display:"flex",alignItems:"center",marginBottom:28}}>
      <BackBtn/>
      <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:28,textTransform:"uppercase",letterSpacing:"-0.02em"}}>{title}</span>
    </div>
  );
}

function Inp({placeholder,value,onChange,type="text",style:sx}){
  const {T}=useContext(Ctx);
  return(
    <input placeholder={placeholder} value={value} onChange={onChange} type={type}
      style={{background:T.inp,border:"none",borderBottom:"1px solid #333",borderRadius:0,padding:"12px 14px",color:T.text,
        fontFamily:"'Barlow',sans-serif",fontSize:15,outline:"none",flex:1,minWidth:0,...sx}}/>
  );
}

function Btn({label,onClick,ghost,style:sx}){
  const {T}=useContext(Ctx);
  return(
    <button onClick={onClick} style={{width:"100%",background:ghost?"transparent":T.text,color:ghost?T.text:T.bg,
      border:ghost?'1px solid #333':'none',borderRadius:0,padding:"14px",fontFamily:"'Barlow Condensed',sans-serif",
      fontWeight:900,fontSize:14,textTransform:"uppercase",letterSpacing:"0.06em",cursor:"pointer",...sx}}>
      {label}
    </button>
  );
}

// Anatomical strength map — 200px viewBox, lean male proportions, centered at x=100.
function BodyMap({status}){
  const {T,dark}=useContext(Ctx);
  const [sel,setSel]=useState(null);
  const byKey={};status.forEach(m=>{byKey[m.key]=m;});
  const neutral=dark?"#2A2A2A":"#C8C8C8";
  const skin=dark?"#1A1A1A":"#E8E8E8";
  const co=dark?"rgba(255,255,255,0.11)":"rgba(0,0,0,0.19)";
  const colOf=k=>{const m=byKey[k];return m&&m.rank?m.rank.c:neutral;};
  const Mu=({k,d})=>{
    const m=byKey[k];const s=sel===k;
    return <path d={d} fill={colOf(k)} onClick={()=>setSel(s?null:k)}
      stroke={s?"rgba(255,255,255,0.9)":co} strokeWidth={s?1.5:0.5} strokeLinejoin="round"
      style={{cursor:"pointer",filter:m&&m.rank?'drop-shadow(0 0 1px '+m.rank.c+')':"none",transition:"fill .3s"}}/>;
  };
  const selM=sel?byKey[sel]:null;
  const lab={fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:10,letterSpacing:"0.15em",color:T.sub,textAlign:"center"};

  // Single-path arms/legs, lean proportions, 48px margins each side in 200px viewBox
  const baseEll=[[100,24,15,19]]; // head
  const basePaths=[
    // Torso: narrow V-taper, shoulders 74px wide, waist 46px
    "M93,44 C88,44 80,50 70,58 C63,62 61,70 61,84 C60,100 61,118 65,138 C68,156 71,172 72,184 C73,196 74,206 75,216 L94,226 L106,226 L125,216 C126,206 127,196 128,184 C129,172 132,156 135,138 C139,118 140,100 139,84 C139,70 137,62 130,58 C120,50 112,44 107,44 Z",
    // Left arm: ONE continuous shape shoulder to wrist
    "M63,60 C55,62 49,72 48,90 C47,110 47,132 48,156 C48,170 49,182 50,192 C50,198 56,202 62,198 C63,186 63,170 63,154 C63,134 64,112 65,92 C66,76 68,66 72,62 Z",
    // Right arm (mirror)
    "M137,60 C145,62 151,72 152,90 C153,110 153,132 152,156 C152,170 151,182 150,192 C150,198 144,202 138,198 C137,186 137,170 137,154 C137,134 136,112 135,92 C134,76 132,66 128,62 Z",
    // Hands
    "M48,190 C46,196 50,204 56,206 C61,206 63,200 60,196 Z",
    "M152,190 C154,196 150,204 144,206 C139,206 137,200 140,196 Z",
    // Left leg: hip to ankle as ONE shape
    "M93,224 C90,232 88,252 86,278 C85,306 85,334 85,360 C85,380 86,398 87,412 C87,420 83,426 78,426 C74,426 71,420 72,412 C72,396 72,376 73,354 C73,328 72,300 72,274 C71,248 72,234 74,228 Z",
    // Right leg (mirror)
    "M107,224 C110,232 112,252 114,278 C115,306 115,334 115,360 C115,380 114,398 113,412 C113,420 117,426 122,426 C126,426 129,420 128,412 C128,396 128,376 127,354 C127,328 128,300 128,274 C129,248 128,234 126,228 Z",
  ];

  const FRONT=[
    {k:"DELTS_F",d:"M60,62 C52,64 47,72 48,86 C48,94 53,98 60,97 C66,96 70,88 69,78 C68,68 65,62 60,62 Z"},
    {k:"DELTS_F",d:"M140,62 C148,64 153,72 152,86 C152,94 147,98 140,97 C134,96 130,88 131,78 C132,68 135,62 140,62 Z"},
    {k:"CHEST",d:"M73,62 C85,59 94,62 96,70 L96,96 C96,104 85,108 75,104 C66,100 64,90 65,79 C66,69 68,64 73,62 Z"},
    {k:"CHEST",d:"M127,62 C115,59 106,62 104,70 L104,96 C104,104 115,108 125,104 C134,100 136,90 135,79 C134,69 132,64 127,62 Z"},
    {k:"BICEPS",d:"M51,68 C47,78 47,100 51,118 C52,124 60,126 64,120 C66,100 66,80 64,68 C62,64 54,64 51,68 Z"},
    {k:"BICEPS",d:"M149,68 C153,78 153,100 149,118 C148,124 140,126 136,120 C134,100 134,80 136,68 C138,64 146,64 149,68 Z"},
    {k:"FOREARMS",d:"M50,122 C47,140 47,160 50,176 C51,184 58,185 62,178 C63,160 63,140 60,124 C58,118 52,118 50,122 Z"},
    {k:"FOREARMS",d:"M150,122 C153,140 153,160 150,176 C149,184 142,185 138,178 C137,160 137,140 140,124 C142,118 148,118 150,122 Z"},
    {k:"ABS",d:"M93,100 L107,100 C109,116 109,158 106,172 C103,180 97,180 94,172 C91,158 91,116 93,100 Z"},
    {k:"QUADS",d:"M74,232 C69,252 69,290 73,320 C75,330 90,332 92,320 C95,290 95,254 90,236 C86,230 78,230 74,232 Z"},
    {k:"QUADS",d:"M126,232 C131,252 131,290 127,320 C125,330 110,332 108,320 C105,290 105,254 110,236 C114,230 122,230 126,232 Z"},
  ];

  const FRONTL=[
    "M60,64 C56,74 55,86 58,96","M140,64 C144,74 145,86 142,96",
    "M64,68 C62,78 63,90 67,96","M136,68 C138,78 137,90 133,96",
    "M67,68 C77,65 88,66 96,70","M133,68 C123,65 112,66 104,70",
    "M100,62 L100,104",
    "M67,92 C77,100 88,102 96,96","M133,92 C123,100 112,102 104,96",
    "M69,102 L78,107","M69,110 L78,115","M70,118 L79,123",
    "M131,102 L122,107","M131,110 L122,115","M130,118 L121,123",
    "M100,102 L100,174","M93,118 L107,118","M92,134 L108,134","M91,150 L109,150","M92,164 L108,164",
    "M65,104 C63,120 65,138 72,152","M135,104 C137,120 135,138 128,152",
    "M57,76 C55,92 55,110 59,120","M143,76 C145,92 145,110 141,120",
    "M64,96 C66,108 66,118 63,122","M136,96 C134,108 134,118 137,122",
    "M53,126 C51,144 51,162 54,176","M59,128 C61,146 60,164 57,176",
    "M147,126 C149,144 149,162 146,176","M141,128 C139,146 140,164 143,176",
    "M82,236 L82,318","M118,236 L118,318",
    "M75,250 C73,278 74,304 80,320","M125,250 C127,278 126,304 120,320",
    "M92,290 C94,304 92,316 88,324","M108,290 C106,304 108,316 112,324",
    "M91,234 C84,262 79,292 77,318","M109,234 C116,262 121,292 123,318",
    "M79,336 C78,360 78,386 80,410","M121,336 C122,360 122,386 120,410",
  ];

  const BACK=[
    {k:"TRAPS",d:"M100,48 C92,52 82,57 74,62 C82,70 92,72 100,72 C108,72 118,70 126,62 C118,57 108,52 100,48 Z"},
    {k:"TRAPS",d:"M82,72 L118,72 L108,116 L100,122 L92,116 Z"},
    {k:"DELTS_R",d:"M60,62 C52,64 47,72 48,86 C48,94 53,98 60,97 C66,96 70,88 69,78 C68,68 65,62 60,62 Z"},
    {k:"DELTS_R",d:"M140,62 C148,64 153,72 152,86 C152,94 147,98 140,97 C134,96 130,88 131,78 C132,68 135,62 140,62 Z"},
    {k:"TRICEPS",d:"M51,68 C47,78 47,100 51,120 C52,126 60,128 64,122 C66,102 66,82 64,68 C62,64 54,64 51,68 Z"},
    {k:"TRICEPS",d:"M149,68 C153,78 153,100 149,120 C148,126 140,128 136,122 C134,102 134,82 136,68 C138,64 146,64 149,68 Z"},
    {k:"LATS",d:"M74,92 C69,106 68,128 72,148 C75,166 88,178 100,180 L100,108 C93,100 82,94 74,92 Z"},
    {k:"LATS",d:"M126,92 C131,106 132,128 128,148 C125,166 112,178 100,180 L100,108 C107,100 118,94 126,92 Z"},
    {k:"LOWERBACK",d:"M92,148 L108,148 C109,166 109,190 106,204 C103,212 97,212 94,204 C91,190 91,166 92,148 Z"},
    {k:"GLUTES",d:"M75,228 C69,232 68,250 73,268 C78,282 92,284 98,272 C100,258 98,238 90,230 C85,226 79,226 75,228 Z"},
    {k:"GLUTES",d:"M125,228 C131,232 132,250 127,268 C122,282 108,284 102,272 C100,258 102,238 110,230 C115,226 121,226 125,228 Z"},
    {k:"HAMS",d:"M75,274 C71,294 71,326 75,356 C78,368 90,368 92,356 C95,326 95,298 90,278 C86,272 80,272 75,274 Z"},
    {k:"HAMS",d:"M125,274 C129,294 129,326 125,356 C122,368 110,368 108,356 C105,326 105,298 110,278 C114,272 120,272 125,274 Z"},
    {k:"CALVES",d:"M77,360 C73,376 73,400 77,416 C79,424 90,424 92,416 C95,400 94,378 90,362 C87,356 82,354 77,360 Z"},
    {k:"CALVES",d:"M123,360 C127,376 127,400 123,416 C121,424 110,424 108,416 C105,400 106,378 110,362 C113,356 118,354 123,360 Z"},
  ];

  const BACKL=[
    "M100,72 L100,120","M82,60 C90,66 96,68 100,68","M118,60 C110,66 104,68 100,68",
    "M90,76 L100,98","M110,76 L100,98",
    "M92,80 C96,90 98,102 98,112","M108,80 C104,90 102,102 102,112",
    "M60,64 C56,74 55,86 58,96","M140,64 C144,74 145,86 142,96",
    "M75,86 C72,94 71,104 75,112","M125,86 C128,94 129,104 125,112",
    "M80,90 C78,100 80,112 86,116","M120,90 C122,100 120,112 114,116",
    "M56,76 C54,96 54,112 58,122","M64,90 C66,106 66,118 63,124","M54,106 C59,110 64,112 66,112",
    "M144,76 C146,96 146,112 142,122","M136,90 C134,106 134,118 137,124","M146,106 C141,110 136,112 134,112",
    "M77,114 C75,132 76,154 82,174","M86,110 C84,130 85,152 90,172","M94,114 L94,178",
    "M123,114 C125,132 124,154 118,174","M114,110 C116,130 115,152 110,172","M106,114 L106,178",
    "M100,150 L100,208","M96,154 L96,204","M104,154 L104,204",
    "M74,260 C82,272 92,274 98,264","M126,260 C118,272 108,274 102,264",
    "M100,230 L100,266",
    "M82,280 L82,354","M118,280 L118,354",
    "M77,294 C75,320 76,344 81,356","M123,294 C125,320 124,344 119,356",
    "M84,364 L84,412","M116,364 L116,412",
    "M78,368 C76,388 77,404 81,414","M90,368 C92,388 90,404 86,414",
    "M122,368 C124,388 123,404 119,414","M110,368 C108,388 110,404 114,414",
  ];

  const Body=({muscles,lines})=>(
    <svg viewBox="0 0 200 432" style={{width:"49%",height:"auto"}}>
      {baseEll.map((e,i)=><ellipse key={"e"+i} cx={e[0]} cy={e[1]} rx={e[2]} ry={e[3]} fill={skin} stroke={co} strokeWidth="0.5"/>)}
      {basePaths.map((d,i)=><path key={"b"+i} d={d} fill={skin} stroke={co} strokeWidth="0.5"/>)}
      {muscles.map((m,i)=><Mu key={"m"+i} k={m.k} d={m.d}/>)}
      {lines.map((d,i)=><path key={"l"+i} d={d} fill="none" stroke={co} strokeWidth="0.55" strokeLinecap="round" style={{pointerEvents:"none"}}/>)}
    </svg>
  );

  return(
    <div>
      <div style={{display:"flex",gap:6,justifyContent:"center"}}>
        <Body muscles={FRONT} lines={FRONTL}/>
        <Body muscles={BACK} lines={BACKL}/>
      </div>
      <div style={{display:"flex",gap:6,marginTop:2}}>
        <div style={{flex:1,...lab}}>FRONT</div>
        <div style={{flex:1,...lab}}>BACK</div>
      </div>
      <div style={{marginTop:14,minHeight:46}}>
        {selM?(
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",borderLeft:'3px solid '+(selM.rank?selM.rank.c:neutral),paddingLeft:12}}>
            <div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:18,textTransform:"uppercase"}}>{selM.label}</div>
              <div style={{display:"flex",alignItems:"center",gap:6,marginTop:2}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:recovColor(selM.days)}}/>
                <span style={{color:T.sub,fontSize:11}}>{selM.days===null?"Not trained yet":'Trained '+(recovLabel(selM.days).toLowerCase()==="today"?"today":recovLabel(selM.days)+" ago")+(selM.rank?' · best ~'+selM.rank.rm+'kg':"")}</span>
              </div>
            </div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:18,color:selM.rank?selM.rank.c:T.sub}}>{selM.rank?selM.rank.n:"NO PR"}</div>
          </div>
        ):(
          <div style={{textAlign:"center",color:T.sub,fontSize:11,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.05em",paddingTop:12}}>TAP A MUSCLE FOR RANK & RECOVERY</div>
        )}
      </div>
    </div>
  );
}
// ─── TODAY CHECKLIST (live Google Calendar) ───────────────────────────────────
const GCAL_COLORS={"1":"#7986CB","2":"#33B679","3":"#8E24AA","4":"#E67C73","5":"#F6BF26","6":"#F4511E","7":"#039BE5","8":"#616161","9":"#3F51B5","10":"#0B8043","11":"#D50000"};
function TodayChecklist(){
  const {T,apiKey}=useContext(Ctx);
  const [evts,setEvts]=useState(null);
  const [ticked,setTicked]=useState({});
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState(null);
  const [ds,setDs]=useState(todayStr());
  const [calOpen,setCalOpen]=useState(false);
  const H={fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,textTransform:"uppercase",letterSpacing:"-0.02em"};
  const SH={fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,textTransform:"uppercase",letterSpacing:"0.12em"};

  const tickKey=d=>`k3_ticks_${d}`;
  const loadTicks=async d=>{try{const r=await window.storage.get(tickKey(d));return r?JSON.parse(r.value):{};}catch{return{};}};
  const saveTicks=async(d,t)=>{try{await window.storage.set(tickKey(d),JSON.stringify(t));}catch{}};

  const loadForDate=async(dateStr)=>{
    setLoading(true);setErr(null);setEvts(null);
    if(!apiKey){setErr('Add API key in Settings (ME tab)');setLoading(false);return;}
    try{
      const resp=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:2000,
          system:`Extract calendar events and return ONLY a valid JSON array. No markdown, no preamble. Each object: {"id":"...","summary":"...","start":"HH:MM","end":"HH:MM","colorId":"..."}. Exclude events whose summary starts with "YUZU:". Sort by start time ascending.`,
          messages:[{role:"user",content:`Fetch all calendar events for ${dateStr} in Europe/Copenhagen timezone. JSON array only.`}],
          mcp_servers:[{type:"url",url:"https://calendarmcp.googleapis.com/mcp/v1",name:"gcal"}]
        })
      });
      if(!resp.ok)throw new Error('API error');
      const data=await resp.json();
      const txt=(data.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("");
      const clean=txt.replace(/```json|```/g,"").trim();
      const parsed=JSON.parse(clean);
      const t=await loadTicks(dateStr);
      setEvts(parsed);setTicked(t);
    }catch{setErr('tap to retry');}
    setLoading(false);
  };

  useEffect(()=>{loadForDate(ds);},[]);

  const changeDate=async d=>{
    setDs(d);setCalOpen(false);
    await loadForDate(d);
  };

  const toggle=async ev=>{
    const key=ev.summary+'_'+ev.start;
    const next={...ticked,[key]:!ticked[key]};
    setTicked(next);await saveTicks(ds,next);
  };

  const done=evts?evts.filter(e=>ticked[e.summary+'_'+e.start]).length:0;
  const total=evts?evts.length:0;
  const allDone=total>0&&done===total;
  const isToday=ds===todayStr();
  const dateLabel=isToday?"TODAY":new Date(ds+'T12:00:00').toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"});

  return(
    <div style={{marginTop:4}}>
      <Divider/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <div style={{...SH,fontSize:10,color:T.sub}}>{dateLabel}</div>
          <button onClick={()=>setCalOpen(!calOpen)} style={{background:"none",border:"none",color:T.sub,cursor:"pointer",fontSize:11,padding:0,lineHeight:1,userSelect:"none"}}>{calOpen?"▴":"▾"}</button>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {evts&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:10,color:allDone?"#39FF14":T.sub,letterSpacing:"0.04em"}}>{done}/{total}</div>}
          <button onClick={()=>loadForDate(ds)} style={{background:"none",border:"none",color:T.sub,cursor:"pointer",fontSize:11,padding:0,lineHeight:1,userSelect:"none"}}>↻</button>
        </div>
      </div>
      {calOpen&&<div style={{marginBottom:8}}><MiniCalendar value={ds} onChange={changeDate}/></div>}
      {!isToday&&<div style={{...SH,fontSize:8,color:"#FF6B35",letterSpacing:"0.1em",marginBottom:5}}>VIEWING PAST DAY</div>}
      {loading&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,color:T.sub}}>Loading…</div>}
      {err&&<div onClick={()=>loadForDate(ds)} style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,color:"#FF3B5C",cursor:"pointer"}}>{err}</div>}
      {evts&&evts.map(ev=>{
        const t=!!ticked[ev.summary+'_'+ev.start];const col=GCAL_COLORS[ev.colorId]||"#555";
        return(
          <div key={ev.id} onClick={()=>toggle(ev)}
            style={{display:"flex",alignItems:"center",gap:8,paddingBottom:6,marginBottom:6,
              borderBottom:`1px solid ${T.div}`,cursor:"pointer"}}>
            <div style={{width:2,alignSelf:"stretch",borderRadius:1,background:col,flexShrink:0}}/>
            <div style={{flex:1,opacity:t?0.35:1}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,
                textDecoration:t?"line-through":"none",lineHeight:1.2}}>{ev.summary}</div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,color:T.sub,marginTop:1}}>
                {ev.start}{ev.end?" – "+ev.end:""}</div>
            </div>
            <div style={{width:15,height:15,borderRadius:1,border:`1px solid ${t?"#39FF14":T.sub}`,
              background:t?"#39FF14":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              {t&&<span style={{fontSize:9,color:"#000",lineHeight:1}}>✓</span>}
            </div>
          </div>
        );
      })}
      {allDone&&<div style={{textAlign:"center",...SH,fontSize:10,color:"#39FF14",paddingBottom:4}}>ALL DONE ✓</div>}
    </div>
  );
}

// ─── HOME SCREEN ──────────────────────────────────────────────────────────────
function HomeScreen(){
  const {T,dark,setDark,goals,saveGoals,workoutLogs,prs,bw,tab,morningLogs,nightLogs,comingSoon,quotes,go,appNotes,saveAppNotes}=useContext(Ctx);
  const [editGoalId,setEditGoalId]=useState(null);
  const [weather,setWeather]=useState(null);
  const [loc,setLoc]=useState("Aarhus");
  const verse=getDailyVerse();
  const streak=computeStreak(morningLogs,nightLogs);
  const dailyQuote=quotes.length>0?quotes[Math.floor((new Date().getFullYear()*366+Math.floor((new Date()-new Date(new Date().getFullYear(),0,0))/(86400000)))%quotes.length)]:null;

  useEffect(()=>{
    const fetch_=(lat,lon,city)=>{
      setLoc(city||"Your location");
      fetch(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`,{
        headers:{"User-Agent":"KataokaApp/1.0 github.com/Sammyks13/kataoka-app"}
      })
        .then(r=>r.json())
        .then(d=>{
          const ts=d?.properties?.timeseries?.[0];
          if(!ts)return;
          const details=ts.data.instant.details;
          const symbol=ts.data.next_1_hours?.summary?.symbol_code||ts.data.next_6_hours?.summary?.symbol_code||null;
          setWeather({
            temperature_2m:details.air_temperature,
            symbol_code:symbol,
            uv_index:details.ultraviolet_index_clear_sky||0,
          });
        }).catch(()=>{});
    };
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(
        p=>fetch_(p.coords.latitude,p.coords.longitude,""),
        ()=>fetch_(56.1629,10.2039,"Aarhus"),
        {timeout:4000}
      );
    } else fetch_(56.1629,10.2039,"Aarhus");
  },[]);

  
  const H={fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,textTransform:"uppercase",letterSpacing:"-0.02em"};
  const uv=weather?uvInfo(Math.round(weather.uv_index||0)):null;

  return(
    <div style={{padding:"28px 20px 20px"}}>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
        <div>
          <div style={{...H,fontSize:38,lineHeight:1}}>KATAOKA</div>
          <div style={{color:T.sub,fontSize:12,marginTop:4}}>{new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long"})}</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {streak>0&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:13,color:"#FF6B35"}}>🔥{streak}</div>}
          <button onClick={()=>{setDark(d=>{const n=!d;S.set("dark",n);return n;})}}
            style={{background:"none",border:"none",color:T.sub,cursor:"pointer",fontSize:18,padding:2}}>
            {dark?"☀️":"🌙"}
          </button>
        </div>
      </div>

      {/* Low sleep announcement bar */}
      {(()=>{
        const todaySleep=morningLogs.find(l=>l.date===todayStr())?.sleep||0;
        if(!(todaySleep>0&&todaySleep<8))return null;
        const severe=todaySleep<6;
        return(
          <div style={{background:severe?"#FFB800":"#FF3B5C",padding:"4px 12px",marginBottom:8}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:9,color:severe?"#000":"#fff",letterSpacing:"0.06em"}}>
              {severe?"SLEEP UNDER 6HRS, NO WEIGHTS TODAY — BIKE CARDIO ONLY · BE CONSCIOUS OF YOUR MOOD TODAY":"SLEEP UNDER 8HRS, ALL WORKOUTS AT 70% OF MAX WEIGHT AND ALL SETS X2 · BE CONSCIOUS OF YOUR MOOD TODAY"}
            </div>
          </div>
        );
      })()}

      {/* Weather — compact single line */}
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,padding:"8px 12px",background:T.card}}>
        {weather?(
          <>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,lineHeight:1}}>{Math.round(weather.temperature_2m)}°</span>
            <span style={{fontSize:16}}>{YR_ICON(weather.symbol_code)}</span>
            <span style={{color:T.sub,fontSize:11,flex:1}}>{YR_LABEL(weather.symbol_code)} · {loc}</span>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:13,color:uv?.c}}>UV {Math.round(weather.uv_index||0)}</span>
          </>
        ):(
          <span style={{color:"#444",fontSize:11,fontFamily:"'Barlow Condensed',sans-serif"}}>Loading weather…</span>
        )}
      </div>

      {/* Verse — single compact line */}
      <div style={{marginBottom:10}}>
        <span style={{fontFamily:"'Barlow',sans-serif",fontSize:11,color:T.sub,fontStyle:"italic"}}>"{verse.t}" </span>
        <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:10,color:T.sub,letterSpacing:"0.06em"}}>{verse.ref}</span>
      </div>

      {/* Daily quote from vault */}
      {dailyQuote&&(
        <div style={{marginBottom:10,paddingLeft:10,borderLeft:"2px solid #2A2A2A"}}>
          <span style={{fontFamily:"'Barlow',sans-serif",fontSize:11,color:T.sub,fontStyle:"italic"}}>"{dailyQuote.text}" </span>
          {dailyQuote.author&&<span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:10,color:"#444",letterSpacing:"0.06em"}}>— {dailyQuote.author.toUpperCase()}</span>}
        </div>
      )}


      {goals.length>0&&(
        <>
          <Divider/>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div style={{...H,fontSize:10,color:T.sub,letterSpacing:"0.12em"}}>GOALS</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,color:T.sub,cursor:"pointer"}} onClick={()=>tab("me")}>ME →</div>
          </div>
          {goals.map(g=>{
            const pct=Math.min(100,Math.round((g.current/g.target)*100));
            const valColor=pct>=100?"#39FF14":pct>=75?"#7DF9FF":pct>=50?"#FFD700":"#FF6B35";
            return(
              <div key={g.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
                {editGoalId===g.id?(
                  <input autoFocus value={g.name}
                    onChange={e=>saveGoals(goals.map(x=>x.id===g.id?{...x,name:e.target.value}:x))}
                    onBlur={()=>setEditGoalId(null)}
                    onKeyDown={e=>e.key==="Enter"&&setEditGoalId(null)}
                    style={{background:"transparent",border:"none",borderBottom:"1px solid #555",borderRadius:0,padding:"1px 0",color:T.text,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:10,outline:"none",width:100,flexShrink:0}}/>
                ):(
                  <div onClick={()=>setEditGoalId(g.id)} style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:10,letterSpacing:"0.02em",width:100,flexShrink:0,cursor:"pointer",color:"#fff"}}>{g.name}</div>
                )}
                <div style={{flex:1,height:2,background:T.div,overflow:"hidden"}}>
                  <div style={{width:"100%",height:"100%",background:"linear-gradient(to right,#5C0000 0%,#CC0000 18%,#FF6B35 40%,#FFD700 65%,#39FF14 100%)",transform:`translateX(${pct-100}%)`,transition:"transform 0.4s ease"}}/>
                </div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:10,color:"#fff",flexShrink:0}}>{g.current}/{g.target}{g.unit?" "+g.unit:""}</div>
              </div>
            );
          })}
        </>
      )}

      {/* Important Events */}
      {comingSoon&&comingSoon.length>0&&(
        <>
          <Divider/>
          <div style={{...H,fontSize:10,color:T.sub,letterSpacing:"0.12em",marginBottom:8}}>IMPORTANT EVENTS</div>
          {comingSoon.slice(0,6).map(item=>(
            <div key={item.id} style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:10}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:12}}>{item.text}</div>
              {item.date&&<div style={{color:T.sub,fontSize:10,flexShrink:0,marginLeft:8}}>{item.date}</div>}
            </div>
          ))}
        </>
      )}

      {/* Today checklist — live from Google Calendar, actual date computed at runtime */}
      <TodayChecklist/>

      {/* Notes / don't forget */}
      <Divider/>
      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,textTransform:"uppercase",fontSize:10,color:T.sub,letterSpacing:"0.12em",marginBottom:6}}>NOTES / DON'T FORGET</div>
      <textarea value={appNotes} onChange={e=>saveAppNotes(e.target.value)} placeholder="Training notes, reminders, anything..."
        style={{background:T.card,border:"none",borderRadius:0,padding:"12px",color:T.text,fontFamily:"'Barlow',sans-serif",fontSize:14,outline:"none",width:"100%",minHeight:220,resize:"vertical",lineHeight:1.5}}/>
    </div>
  );
}

// ─── WORKOUT HOME ─────────────────────────────────────────────────────────────
function WorkoutHome(){
  const {T,prs,bw,go,workoutLogs,userDOB,saveDOB,saveBw,resetPRs,goals,morningLogs}=useContext(Ctx);
  const [prResetArmed,setPrResetArmed]=useState(false);
  const H={fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,textTransform:"uppercase"};
  const mergedPRs=mergeGoalPRs(prs,goals);
  const muscleStatus=buildMuscleStatus(mergedPRs,bw,workoutLogs);

  // Deload detector: count consecutive workout days with difficulty >= 8
  const sortedWO=[...workoutLogs].filter(l=>l.difficulty>=8).sort((a,b)=>new Date(b.date)-new Date(a.date));
  let deloadStreak=0;
  if(sortedWO.length>0){
    const dates=[...new Set(workoutLogs.sort((a,b)=>new Date(b.date)-new Date(a.date)).map(l=>l.date.slice(0,10)))];
    for(const d of dates){
      const sessionsOnDay=workoutLogs.filter(l=>l.date.slice(0,10)===d);
      const allHard=sessionsOnDay.length>0&&sessionsOnDay.every(l=>(l.difficulty||0)>=8);
      if(allHard)deloadStreak++;
      else break;
    }
  }
  const showDeload=deloadStreak>=7;
  const todayMorningWO=morningLogs.find(l=>l.date===todayStr());
  const sleepHoursWO=todayMorningWO?.sleep||0;
  const sleepWarningWO=todayMorningWO&&sleepHoursWO>0&&sleepHoursWO<6;

  return(
    <div style={{padding:"24px 20px"}}>
      <PageHeader title="WORKOUT"/>
      {showDeload&&(
        <div style={{borderLeft:"3px solid #FF3B5C",paddingLeft:12,marginBottom:20,paddingTop:4,paddingBottom:4}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:11,color:"#FF3B5C",letterSpacing:"0.12em",marginBottom:3}}>{deloadStreak} CONSECUTIVE HARD SESSIONS</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:14}}>Consider a deload week. Every session at 8+.</div>
        </div>
      )}
      {sleepWarningWO&&(
        <div style={{borderLeft:"3px solid #FFB800",paddingLeft:12,marginBottom:20,paddingTop:4,paddingBottom:4}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:11,color:"#FFB800",letterSpacing:"0.12em",marginBottom:3}}>LOW SLEEP: {sleepHoursWO}H</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:14}}>Under 6 hours. Bike cardio only today — no weights.</div>
        </div>
      )}

      {/* Strength map */}
      <div style={{...H,fontSize:11,color:T.sub,letterSpacing:"0.12em",marginBottom:10}}>STRENGTH MAP</div>
      <BodyMap status={muscleStatus}/>

      {/* Profile: BW + DOB — feeds ranking system */}
      <Divider/>
      <div style={{display:"flex",gap:10,marginBottom:4,alignItems:"flex-end"}}>
        <div style={{flex:1}}>
          <div style={{...H,fontSize:9,color:T.sub,letterSpacing:"0.1em",marginBottom:4}}>BODYWEIGHT kg</div>
          <input value={bw} onChange={e=>{const v=parseFloat(e.target.value)||65;saveBw(v);}} type="number"
            style={{background:"transparent",border:"none",borderBottom:"1px solid #333",borderRadius:0,padding:"6px 0",color:T.text,...H,fontSize:20,outline:"none",width:"100%"}}/>
        </div>
        <div style={{flex:1.5}}>
          <div style={{...H,fontSize:9,color:T.sub,letterSpacing:"0.1em",marginBottom:4}}>DATE OF BIRTH</div>
          <input value={userDOB} onChange={e=>saveDOB(e.target.value)} type="date"
            style={{background:"transparent",border:"none",borderBottom:"1px solid #333",borderRadius:0,padding:"6px 0",color:T.text,...H,fontSize:14,outline:"none",width:"100%"}}/>
        </div>
        <div style={{flex:0.8,paddingBottom:8,textAlign:"right"}}>
          <div style={{...H,fontSize:9,color:T.sub,letterSpacing:"0.1em",marginBottom:4}}>AGE</div>
          <div style={{...H,fontSize:20,color:T.text}}>{computeAge(userDOB)}</div>
        </div>
      </div>
      <Divider/>

      {/* Primary actions */}
      <Btn label="Log Workout" onClick={()=>go("workout-log")} style={{marginBottom:10,padding:"18px"}}/>
      <Btn label="Edit Templates" onClick={()=>go("workout-edit-templates")} ghost style={{marginBottom:10,padding:"18px"}}/>
      <Btn label="Strength Rankings" onClick={()=>go("workout-ranks")} ghost style={{marginBottom:10,padding:"18px"}}/>
      <button onClick={async()=>{
        if(!prResetArmed){setPrResetArmed(true);setTimeout(()=>setPrResetArmed(false),3000);}
        else{await resetPRs();setPrResetArmed(false);}
      }} style={{background:"none",border:"none",color:prResetArmed?"#FF3B5C":"#333",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",padding:"6px 0",display:"block",width:"100%",textAlign:"center",marginBottom:4}}>
        {prResetArmed?"TAP AGAIN TO CONFIRM":"RESET PRs"}
      </button>
      <Btn label="Workout History" onClick={()=>go("workout-history")} ghost style={{marginBottom:10,padding:"18px"}}/>
      <Btn label="Progress Tracker" onClick={()=>go("workout-progress")} ghost style={{marginBottom:28,padding:"18px"}}/>

      {Object.keys(mergedPRs).length>0&&(
        <>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,color:T.sub,letterSpacing:"0.12em",marginBottom:14}}>PERSONAL RECORDS</div>
          {Object.entries(mergedPRs).map(([key,pr])=>{
            const exName=key.replace(/_/g," ");
            const rank=getExerciseRank(exName,pr.rm,bw,userDOB);
            const showRankBadge=rank&&rank.source==="sl";
            return(
              <div key={key} onClick={()=>go("workout-exercise",{key,name:exName})}
                style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:12,marginBottom:12,borderBottom:`1px solid ${T.div}`,cursor:"pointer"}}>
                <div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13,textTransform:"uppercase"}}>{key.replace(/_/g," ")}</div>
                  <div style={{color:T.sub,fontSize:11,marginTop:2}}>{pr.weight}kg × {pr.reps} · ~{Math.round(pr.rm)}kg</div>
                </div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:12,color:showRankBadge?rank.c:T.sub}}>{showRankBadge?rank.n:"—"}</div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}


// ─── RANK EXPLAINER ───────────────────────────────────────────────────────────
function RankExplainerScreen(){
  const {T,bw,userDOB,prs,goals}=useContext(Ctx);
  const displayPRs=mergeGoalPRs(prs,goals);
  const H={fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,textTransform:"uppercase"};
  const age=computeAge(userDOB);

  return(
    <div style={{padding:"24px 20px"}}>
      <PageHeader title="STRENGTH RANKS"/>

      {/* Tier key */}
      <div style={{marginBottom:24}}>
        <div style={{...H,fontSize:10,color:T.sub,letterSpacing:"0.12em",marginBottom:12}}>TIER SYSTEM</div>
        {SL_TIERS.map(tier=>(
          <div key={tier.n} style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:10,paddingBottom:10,borderBottom:`1px solid ${T.div}`}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:tier.c,flexShrink:0}}/>
              <div style={{...H,fontSize:15,color:tier.c}}>{tier.n}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,color:T.text}}>{tier.ratio}</div>
              <div style={{color:T.sub,fontSize:10,marginTop:1}}>{tier.desc}</div>
            </div>
          </div>
        ))}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:"#4B5563",flexShrink:0}}/>
            <div style={{...H,fontSize:15,color:"#4B5563"}}>UNTRAINED</div>
          </div>
          <div style={{color:T.sub,fontSize:10}}>below beginner standards</div>
        </div>
      </div>

      {/* All logged exercises with their rank */}
      <div style={{...H,fontSize:10,color:T.sub,letterSpacing:"0.12em",marginBottom:12}}>YOUR EXERCISES · AGE {age} · {bw}kg</div>
      {Object.entries(displayPRs).length===0&&(
        <div style={{color:T.sub,fontSize:12}}>No exercises logged yet. Complete a workout or set goals with kg targets to see your ranks.</div>
      )}
      {Object.entries(displayPRs).map(([key,pr])=>{
        const name=key.replace(/_/g," ");
        const rank=getUniversalRank(name,pr.rm,bw,userDOB);
        return(
          <div key={key} style={{paddingBottom:10,marginBottom:10,borderBottom:`1px solid ${T.div}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
              <div style={{...H,fontSize:14,textTransform:"uppercase"}}>{name}</div>
              <div style={{...H,fontSize:14,color:rank.c}}>{rank.n}</div>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{color:T.sub,fontSize:11}}>{rank.desc}</div>
              <div style={{color:T.sub,fontSize:10,marginLeft:8,flexShrink:0}}>~{Math.round(pr.rm)}kg 1RM</div>
            </div>
            {rank.next&&<div style={{color:"#444",fontSize:10,marginTop:2}}>Next tier: {rank.next}kg</div>}
          </div>
        );
      })}

      <div style={{...H,fontSize:10,color:"#333",letterSpacing:"0.1em",marginTop:16,lineHeight:1.6}}>
        Compound lifts use StrengthLevel.com data (153M+ lifts). Isolation exercises use category-specific bodyweight ratios. All adjusted for age {age}.
      </div>
    </div>
  );
}

// ─── EDIT TEMPLATES ───────────────────────────────────────────────────────────
function EditTemplates(){
  const {T,templates,saveTemplates,go}=useContext(Ctx);
  const [selectedId,setSelectedId]=useState(null);
  const [editExIdx,setEditExIdx]=useState(null);
  const [exBuf,setExBuf]=useState({});
  const [dragIdx,setDragIdx]=useState(null);
  const [dragOverIdx,setDragOverIdx]=useState(null);
  const dragListRef=useRef(null);
  const H={fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,textTransform:"uppercase"};

  const updateTemplate=async updated=>saveTemplates(templates.map(t=>t.id===updated.id?updated:t));
  const deleteTemplate=async id=>saveTemplates(templates.filter(t=>t.id!==id));

  // ── DETAIL VIEW ──
  if(selectedId){
    const tmpl=templates.find(t=>t.id===selectedId);
    if(!tmpl){setSelectedId(null);return null;}

    const saveExEdit=async()=>{
      const origEx=tmpl.exercises[editExIdx];
      const finalFailType="failType" in exBuf?exBuf.failType:(origEx?.failType||null);
      await updateTemplate({...tmpl,exercises:tmpl.exercises.map((ex,i)=>i===editExIdx?{...ex,...exBuf,superset:exBuf.superset||null,failType:finalFailType}:ex)});
      setEditExIdx(null);setExBuf({});
    };
    const deleteEx=async i=>updateTemplate({...tmpl,exercises:tmpl.exercises.filter((_,j)=>j!==i)});
    const addEx=async()=>{
      const newEx={id:String(Date.now()),name:"New Exercise",sets:3,targetReps:0};
      const updated={...tmpl,exercises:[...tmpl.exercises,newEx]};
      await updateTemplate(updated);
      setEditExIdx(tmpl.exercises.length);setExBuf({name:"New Exercise",sets:"3",targetReps:""});
    };

    const handleTouchMove=e=>{
      if(dragIdx===null)return;
      const touch=e.touches[0];
      const rows=dragListRef.current?.querySelectorAll('[data-drag-row]');
      if(!rows)return;
      let best=dragIdx,bestDist=Infinity;
      rows.forEach((row,i)=>{
        const rect=row.getBoundingClientRect();
        const mid=rect.top+rect.height/2;
        const dist=Math.abs(touch.clientY-mid);
        if(dist<bestDist){bestDist=dist;best=i;}
      });
      setDragOverIdx(best);
    };
    const handleTouchEnd=async()=>{
      if(dragIdx!==null&&dragOverIdx!==null&&dragIdx!==dragOverIdx){
        const exs=[...tmpl.exercises];
        const[moved]=exs.splice(dragIdx,1);
        exs.splice(dragOverIdx,0,moved);
        await updateTemplate({...tmpl,exercises:exs});
      }
      setDragIdx(null);setDragOverIdx(null);
    };

    return(
      <div style={{padding:"24px 20px"}}>
        <div style={{display:"flex",alignItems:"center",marginBottom:20}}>
          <button onClick={()=>{setSelectedId(null);setEditExIdx(null);}} style={{background:"none",border:"none",color:T.sub,cursor:"pointer",fontSize:22,padding:"0 12px 0 0",lineHeight:1}}>←</button>
          <div style={{...H,fontSize:26,color:tmpl.color}}>{tmpl.name}</div>
        </div>

        {/* Rename/subtitle row */}
        <div style={{display:"flex",gap:8,marginBottom:20}}>
          <Inp placeholder="Name" value={tmpl.name}
            onChange={e=>saveTemplates(templates.map(t=>t.id===tmpl.id?{...t,name:e.target.value}:t))}
            style={{flex:2}}/>
          <Inp placeholder="Subtitle" value={tmpl.subtitle||""}
            onChange={e=>saveTemplates(templates.map(t=>t.id===tmpl.id?{...t,subtitle:e.target.value}:t))}
            style={{flex:1.5}}/>
        </div>

        {/* Exercise list — draggable */}
        <div ref={dragListRef} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
        {tmpl.exercises.map((ex,i)=>(
          <div key={ex.id||i} data-drag-row="true"
            style={{opacity:dragIdx===i?0.3:1,background:dragOverIdx===i&&dragIdx!==null&&dragIdx!==i?"#1E1E1E":"transparent",
              borderLeft:dragOverIdx===i&&dragIdx!==null&&dragIdx!==i?"2px solid #39FF14":"2px solid transparent",
              transition:"background 0.1s,border-color 0.1s"}}>
            {editExIdx===i?(
              <div style={{background:T.inp,padding:"12px",marginBottom:8}}>
                <Inp placeholder="Exercise name" value={exBuf.name!==undefined?exBuf.name:ex.name}
                  onChange={e=>setExBuf(b=>({...b,name:e.target.value}))}
                  style={{display:"block",width:"100%",marginBottom:8}}/>
                <div style={{display:"flex",gap:8,marginBottom:10}}>
                  <div style={{flex:1}}>
                    <div style={{...H,fontSize:9,color:T.sub,marginBottom:4}}>SETS</div>
                    <Inp placeholder="3" value={exBuf.sets!==undefined?String(exBuf.sets):String(ex.sets)}
                      onChange={e=>setExBuf(b=>({...b,sets:parseInt(e.target.value)||3}))} type="number"/>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{...H,fontSize:9,color:T.sub,marginBottom:4}}>TARGET REPS</div>
                    <Inp placeholder="∞" value={exBuf.targetReps!==undefined?String(exBuf.targetReps):String(ex.targetReps||"")}
                      onChange={e=>setExBuf(b=>({...b,targetReps:parseInt(e.target.value)||0}))} type="number"/>
                  </div>
                </div>
                <div style={{marginBottom:10}}>
                  <div style={{...H,fontSize:9,color:T.sub,marginBottom:4}}>SUPERSET GROUP <span style={{color:"#444",fontWeight:400,textTransform:"none"}}>— same letter = paired</span></div>
                  <Inp placeholder="e.g. A (leave blank for none)" value={exBuf.superset!==undefined?exBuf.superset:(ex.superset||"")}
                    onChange={e=>setExBuf(b=>({...b,superset:e.target.value.toUpperCase().slice(0,1)}))} style={{display:"block",width:"100%"}}/>
                  <div style={{...H,fontSize:9,color:T.sub,marginBottom:6,marginTop:10}}>FAILURE TYPE</div>
                  <div style={{display:"flex",gap:6}}>
                    {[["mf","MECHANICAL","#FF3B5C"],["tf","TECHNICAL","#FF6B35"],["rt","REP TARGET","#3B82F6"]].map(([val,label,col])=>{
                      const current="failType" in exBuf?exBuf.failType:(ex.failType||null);
                      const active=current===val;
                      return(
                        <button key={val} onClick={()=>setExBuf(b=>{
                          const cur="failType" in b?b.failType:(ex.failType||null);
                          return {...b,failType:cur===val?null:val};
                        })}
                          style={{flex:1,padding:"8px 4px",background:active?col:"transparent",border:`1px solid ${active?col:"#333"}`,
                            color:active?"#000":col,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:10,
                            letterSpacing:"0.06em",cursor:"pointer",borderRadius:2}}>
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <Btn label="Save" onClick={saveExEdit} style={{flex:1,padding:"10px"}}/>
                  <Btn label="Cancel" onClick={()=>{setEditExIdx(null);setExBuf({});}} ghost style={{flex:0.6,padding:"10px"}}/>
                </div>
              </div>
            ):(
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                paddingBottom:10,marginBottom:10,borderBottom:`1px solid ${T.div}`}}>
                {/* Drag handle */}
                <div onTouchStart={()=>{setDragIdx(i);setDragOverIdx(i);}}
                  style={{padding:"0 12px 0 0",color:"#444",fontSize:20,cursor:"grab",userSelect:"none",flexShrink:0,lineHeight:1,touchAction:"none"}}>≡</div>
                <div style={{flex:1,cursor:"pointer"}}
                  onClick={()=>{setEditExIdx(i);setExBuf({name:ex.name,sets:ex.sets,targetReps:ex.targetReps,superset:ex.superset||"",failType:ex.failType||null});}}>
                  <div style={{...H,fontSize:16,display:"flex",alignItems:"center",gap:8}}>
                    {ex.name}
                    {ex.superset&&<span style={{background:"#A855F7",color:"#000",fontSize:10,padding:"1px 6px",borderRadius:2,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900}}>{ex.superset}</span>}
                    {ex.failType&&<span style={{background:{mf:"#FF3B5C",tf:"#FF6B35",rt:"#3B82F6"}[ex.failType],color:"#000",fontSize:10,padding:"1px 6px",borderRadius:2,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900}}>{{mf:"MECH",tf:"TECH",rt:"REP"}[ex.failType]}</span>}
                  </div>
                  <div style={{color:T.sub,fontSize:11,marginTop:2}}>{ex.sets} × {ex.targetReps||"∞"}</div>
                </div>
                <div style={{display:"flex",gap:10,alignItems:"center"}}>
                  <span style={{color:T.sub,fontSize:11}}>edit</span>
                  <button onClick={e=>{e.stopPropagation();deleteEx(i);}}
                    style={{background:"none",border:"none",color:"#444",cursor:"pointer",fontSize:18,padding:"0 2px"}}>×</button>
                </div>
              </div>
            )}
          </div>
        ))}
        </div>
        <button onClick={addEx}
          style={{background:"none",border:"none",color:T.sub,cursor:"pointer",...H,fontSize:11,letterSpacing:"0.06em",paddingLeft:0,marginTop:4}}>
          + ADD EXERCISE
        </button>
      </div>
    );
  }

  // ── LIST VIEW ──
  return(
    <div style={{padding:"24px 20px"}}>
      <PageHeader title="Edit Templates"/>
      {templates.length===0&&(
        <div style={{color:T.sub,textAlign:"center",marginTop:60,...H,fontSize:15}}>NO TEMPLATES YET</div>
      )}
      {templates.map(tmpl=>(
        <div key={tmpl.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
          paddingBottom:16,marginBottom:16,borderBottom:`1px solid ${T.div}`}}>
          <div onClick={()=>setSelectedId(tmpl.id)} style={{flex:1,cursor:"pointer"}}>
            <div style={{...H,fontSize:22,color:tmpl.color}}>{tmpl.name}</div>
            <div style={{color:T.sub,fontSize:12,marginTop:2}}>
              {tmpl.subtitle&&tmpl.subtitle+' · '}{tmpl.exercises.length} exercise{tmpl.exercises.length!==1?"s":""}
            </div>
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <button onClick={()=>setSelectedId(tmpl.id)}
              style={{background:"none",border:"1px solid #333",color:T.sub,padding:"5px 12px",cursor:"pointer",...H,fontSize:10}}>
              EDIT
            </button>
            <button onClick={()=>deleteTemplate(tmpl.id)}
              style={{background:"none",border:"none",color:"#444",cursor:"pointer",fontSize:18}}>×</button>
          </div>
        </div>
      ))}
      <Btn label="+ New Template" onClick={()=>go("workout-create",{mode:"template"})} ghost style={{marginTop:8}}/>
    </div>
  );
}

// ─── LOG WORKOUT: choose source ───────────────────────────────────────────────
function LogChoose(){
  const {T,go}=useContext(Ctx);
  const [logDate,setLogDate]=useState(todayStr());
  return(
    <div style={{padding:"24px 20px"}}>
      <PageHeader title="Log Workout"/>
      <MiniCalendar value={logDate} onChange={setLogDate}/>
      <Btn label="Use Template" onClick={()=>go("workout-templates",{date:logDate})} style={{marginBottom:12,padding:"18px"}}/>
      <Btn label="Create New Workout" onClick={()=>go("workout-create",{mode:"oneoff",date:logDate})} ghost style={{padding:"18px"}}/>
    </div>
  );
}

// ─── PICK A TEMPLATE TO LOG ───────────────────────────────────────────────────
function TemplatePick(){
  const {T,templates,go,screenData}=useContext(Ctx);
  const date=screenData?.date||todayStr();
  const H={fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,textTransform:"uppercase"};
  return(
    <div style={{padding:"24px 20px"}}>
      <PageHeader title="Templates"/>
      {templates.length===0&&<div style={{color:T.sub,textAlign:"center",marginTop:50,fontFamily:"'Barlow Condensed',sans-serif",fontSize:16}}>NO TEMPLATES YET</div>}
      {templates.map(tmpl=>(
        <div key={tmpl.id} onClick={()=>go("workout-active",{...tmpl,date})}
          style={{paddingBottom:16,marginBottom:16,borderBottom:`1px solid ${T.div}`,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{...H,fontSize:24,color:tmpl.color}}>{tmpl.name}</div>
            <div style={{color:T.sub,fontSize:12,marginTop:2}}>{tmpl.subtitle} · {tmpl.exercises.length} exercises</div>
          </div>
          <div style={{color:tmpl.color,fontSize:18}}>▶</div>
        </div>
      ))}
      <Btn label="+ Create New Template" onClick={()=>go("workout-create",{mode:"template"})} ghost style={{marginTop:8,padding:"16px"}}/>
    </div>
  );
}

// ─── ACTIVE WORKOUT (log all sets, one Log button) ────────────────────────────
function ActiveWorkout(){
  const {T,dark,screenData:tmpl,back,tab,commitWorkout,workoutLogs,saveLogs}=useContext(Ctx);
  const [logDate,setLogDate]=useState(()=>tmpl?.date||todayStr());
  const [difficulty,setDifficulty]=useState(null);
  const [woNote,setWoNote]=useState("");
  const [sets,setSets]=useState(()=>
    tmpl?tmpl.exercises.reduce((a,ex)=>{a[ex.id]=Array(ex.sets).fill(null).map(()=>({weight:"",reps:String(ex.targetReps||""),rpe:""}));return a;},{}):{}
  );
  const [start]=useState(Date.now());
  if(!tmpl){back();return null;}

  const upd=(eid,si,f,v)=>setSets(p=>({...p,[eid]:p[eid].map((s,i)=>i===si?{...s,[f]:v}:s)}));
  const addSet=eid=>setSets(p=>({...p,[eid]:[...p[eid],{weight:"",reps:"",rpe:""}]}));
  const delSet=(eid,si)=>setSets(p=>({...p,[eid]:p[eid].filter((_,i)=>i!==si)}));

  const log=async()=>{
    const entries=[];
    tmpl.exercises.forEach(ex=>(sets[ex.id]||[]).forEach(s=>{
      if(s.weight&&s.reps)entries.push({name:ex.name,weight:parseFloat(s.weight),reps:parseInt(s.reps)});
    }));
    const exerciseNames=tmpl.exercises.reduce((a,ex)=>{a[ex.id]=ex.name;return a;},{});
    const dateISO=new Date(logDate+'T12:00:00').toISOString();
    await saveLogs([...workoutLogs,{id:Date.now(),date:dateISO,templateId:tmpl.id,templateName:tmpl.name,duration:Math.round((Date.now()-start)/60000),sets,exerciseNames,difficulty,note:woNote}]);
    await commitWorkout(entries);
    tab("workout");
  };

  // For each exercise, find the weight done on each set position last session
  const prevSets=ex=>{
    const prev=[...workoutLogs]
      .sort((a,b)=>new Date(b.date)-new Date(a.date))
      .find(log=>log.exerciseNames&&Object.values(log.exerciseNames).some(n=>n===ex.name)&&log.sets);
    if(!prev)return [];
    const eid=Object.keys(prev.exerciseNames||{}).find(k=>prev.exerciseNames[k]===ex.name);
    if(!eid)return [];
    return (prev.sets[eid]||[]).map(s=>s.weight&&parseFloat(s.weight)>0?Math.round(parseFloat(s.weight)*10)/10:null);
  };

  const FAIL_COLORS={mf:"#FF3B5C",tf:"#FF6B35",rt:"#3B82F6"};
  const FAIL_LABELS={mf:"Mechanical failure",tf:"Technical failure",rt:"Rep target"};
  const failColor=ex=>FAIL_COLORS[ex.failType]||tmpl.color;

  const inp={background:T.inp,border:"none",borderBottom:"1px solid #333",borderRadius:0,padding:"9px 4px",color:T.text,fontFamily:"'Barlow',sans-serif",fontSize:15,outline:"none",textAlign:"center",minWidth:0};
  const totalSets=tmpl.exercises.reduce((n,ex)=>n+(sets[ex.id]||[]).filter(s=>s.weight&&s.reps).length,0);

  // Group consecutive exercises sharing a superset letter into blocks
  const exGroups=[];
  tmpl.exercises.forEach(ex=>{
    const last=exGroups[exGroups.length-1];
    if(ex.superset&&last&&last.superset===ex.superset){last.items.push(ex);}
    else exGroups.push({superset:ex.superset||null,items:[ex]});
  });

  // Which fail types are used in this template (for legend)
  const usedFailTypes=[...new Set(tmpl.exercises.map(ex=>ex.failType).filter(Boolean))];

  return(
    <div style={{padding:"24px 20px"}}>
      <PageHeader title={tmpl.name}/>
      {usedFailTypes.length>0&&(
        <div style={{display:"flex",gap:12,marginBottom:14,paddingLeft:2}}>
          {usedFailTypes.map(ft=>(
            <div key={ft} style={{display:"flex",alignItems:"center",gap:4}}>
              <div style={{width:3,height:14,background:FAIL_COLORS[ft],borderRadius:1,flexShrink:0}}/>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,color:T.sub,letterSpacing:"0.04em"}}>{FAIL_LABELS[ft]}</span>
            </div>
          ))}
        </div>
      )}
      <div style={{display:"flex",gap:8,padding:"0 14px 6px 28px"}}>
        <span style={{flex:1,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:10,color:T.sub,letterSpacing:"0.1em"}}>KG</span>
        <span style={{flex:1,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:10,color:T.sub,letterSpacing:"0.1em"}}>REPS</span>
        <span style={{flex:1,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:10,color:T.sub,letterSpacing:"0.1em"}}>RPE</span>
        <span style={{width:28}}/>
      </div>
      {exGroups.map((group,gi)=>{
        const isSuperset=group.items.length>1;
        const groupContent=group.items.map(ex=>{
          const ps=prevSets(ex);
          const hasPrev=ps.some(v=>v!==null&&v!==undefined);
          return(
          <div key={ex.id} style={{marginBottom:isSuperset?14:20}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:16,textTransform:"uppercase",marginBottom:hasPrev?4:10,borderLeft:isSuperset?"none":`3px solid ${failColor(ex)}`,paddingLeft:isSuperset?0:10}}>
              {ex.name} <span style={{color:T.sub,fontWeight:400,fontSize:12}}>target {ex.sets}×{ex.targetReps||"∞"}</span>
            </div>
            {hasPrev&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:dark?"#3A3A3A":"#BBBBBB",paddingLeft:isSuperset?0:10,marginBottom:10,letterSpacing:"0.04em"}}>last session, per set</div>}
            {(sets[ex.id]||[]).map((set,si)=>{
              const prevW=ps[si];
              return(
              <div key={si} style={{display:"flex",gap:5,marginBottom:8,alignItems:"center"}}>
                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,color:T.sub,width:12,flexShrink:0}}>{si+1}</span>
                <input placeholder={prevW?String(prevW):"–"} value={set.weight} onChange={e=>upd(ex.id,si,"weight",e.target.value)} style={{...inp,flex:1}} type="text" inputMode="decimal"/>
                <input placeholder="–" value={set.reps}  onChange={e=>upd(ex.id,si,"reps",e.target.value)}  style={{...inp,flex:1}} type="number"/>
                <input placeholder="–" value={set.rpe}   onChange={e=>upd(ex.id,si,"rpe",e.target.value)}   style={{...inp,flex:1}} type="number"/>
                <button onClick={()=>delSet(ex.id,si)} style={{background:"none",border:"none",color:T.sub,cursor:"pointer",fontSize:16,width:22,flexShrink:0}}>×</button>
              </div>
              );
            })}
            <button onClick={()=>addSet(ex.id)} style={{background:"none",border:"none",color:T.sub,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,letterSpacing:"0.05em",paddingLeft:isSuperset?0:22}}>+ ADD SET</button>
          </div>
          );
        });
        if(isSuperset)return(
          <div key={gi} style={{marginBottom:20,borderLeft:`3px solid #A855F7`,paddingLeft:10}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:11,color:"#A855F7",letterSpacing:"0.1em",marginBottom:12}}>SUPERSET {group.superset} · ALTERNATE SETS</div>
            {groupContent}
          </div>
        );
        return <div key={gi}>{groupContent}</div>;
      })}
      {/* Session difficulty */}
      <div style={{marginTop:24,paddingTop:16,borderTop:`1px solid ${T.div}`}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:10,textTransform:"uppercase",letterSpacing:"0.12em",color:T.sub,marginBottom:10}}>SESSION DIFFICULTY <span style={{color:"#444",fontWeight:400}}>— how hard was this overall?</span></div>
        <div style={{display:"flex",gap:4,marginBottom:16}}>
          {[1,2,3,4,5,6,7,8,9,10].map(n=>(
            <button key={n} onClick={()=>setDifficulty(difficulty===n?null:n)} style={{flex:1,padding:"8px 0",background:difficulty===n?T.text:"transparent",color:difficulty===n?T.bg:T.sub,border:`1px solid ${difficulty===n?T.text:"#222"}`,borderRadius:0,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:13,cursor:"pointer"}}>
              {n}
            </button>
          ))}
        </div>
        <textarea value={woNote} onChange={e=>setWoNote(e.target.value)} placeholder="Session note — how it felt, what to remember..."
          style={{background:T.inp,border:"none",borderBottom:"1px solid #333",borderRadius:0,padding:"10px 4px",color:T.text,fontFamily:"'Barlow',sans-serif",fontSize:13,outline:"none",width:"100%",minHeight:50,resize:"vertical",lineHeight:1.5}}/>
      </div>
      <Btn label={totalSets?`Log Workout · ${totalSets} sets`:"Log Workout"} onClick={log} style={{marginTop:0,padding:"18px"}}/>
      <div style={{height:8}}/>
    </div>
  );
}

// ─── WORKOUT HISTORY ──────────────────────────────────────────────────────────
function WorkoutHistory(){
  const {T,workoutLogs,saveLogs,go}=useContext(Ctx);
  const [confirm,setConfirm]=useState(null);
  const H={fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,textTransform:"uppercase"};

  // Deduplicate by ID
  const seen=new Set();
  const logs=[...workoutLogs].reverse().filter(l=>{if(seen.has(l.id))return false;seen.add(l.id);return true;});

  const deleteLog=async id=>{
    await saveLogs(workoutLogs.filter(l=>l.id!==id));
    setConfirm(null);
  };

  return(
    <div style={{padding:"24px 20px"}}>
      <PageHeader title="History"/>
      {logs.length===0
        ?<div style={{color:T.sub,textAlign:"center",marginTop:60,...H,fontSize:16}}>NO SESSIONS YET</div>
        :logs.map(log=>{
          const isConfirm=confirm===log.id;
          return(
            <div key={log.id} style={{paddingBottom:14,marginBottom:14,borderBottom:`1px solid ${T.div}`,display:"flex",justifyContent:"space-between",alignItems:"center",gap:12}}>
              <div onClick={()=>go("workout-session",log)} style={{flex:1,cursor:"pointer",minWidth:0}}>
                <div style={{...H,fontSize:20}}>{log.templateName||"ONE-OFF"}</div>
                <div style={{color:T.sub,fontSize:12,marginTop:3}}>
                  {new Date(log.date).toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"})}
                  {log.duration?" · "+log.duration+"min":""}
                </div>
                {log.notes&&(
                  <div style={{color:T.sub,fontSize:11,marginTop:8,fontStyle:"italic",paddingTop:8,borderTop:`1px solid ${T.div}`}}>
                    {log.notes}
                  </div>
                )}
              </div>
              {isConfirm?(
                <div style={{display:"flex",gap:8,flexShrink:0}}>
                  <button onClick={()=>deleteLog(log.id)}
                    style={{background:"#FF3B5C",border:"none",color:"#fff",padding:"6px 12px",cursor:"pointer",...H,fontSize:11}}>
                    DELETE
                  </button>
                  <button onClick={()=>setConfirm(null)}
                    style={{background:"none",border:"1px solid #333",color:T.sub,padding:"6px 10px",cursor:"pointer",...H,fontSize:11}}>
                    CANCEL
                  </button>
                </div>
              ):(
                <button onClick={e=>{e.stopPropagation();setConfirm(log.id);}}
                  style={{background:"none",border:"none",color:"#444",cursor:"pointer",fontSize:18,padding:"0 4px",lineHeight:1,flexShrink:0}}>
                  ×
                </button>
              )}
            </div>
          );
        })
      }
    </div>
  );
}

// ─── WORKOUT SESSION DETAIL ───────────────────────────────────────────────────
function WorkoutSession(){
  const {T,screenData:log,prs,bw}=useContext(Ctx);
  if(!log)return null;
  const H={fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,textTransform:"uppercase"};
  const exercises=log.exerciseNames?Object.entries(log.exerciseNames):[];
  return(
    <div style={{padding:"24px 20px"}}>
      <PageHeader title={log.templateName}/>
      <div style={{color:T.sub,fontSize:12,marginBottom:20}}>
        {new Date(log.date).toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}
        {log.duration?" · "+log.duration+" min":""}
      </div>
      {exercises.map(([eid,name])=>{
        const sets=(log.sets||{})[eid]||[];
        const filled=sets.filter(s=>s.weight&&s.reps);
        const best=filled.reduce((m,s)=>Math.max(m,epley(parseFloat(s.weight),parseInt(s.reps))),0);
        const prKey=name.toLowerCase().replace(/\s+/g,"_");
        const pr=prs[prKey];
        return(
          <div key={eid} style={{marginBottom:22}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:10,borderLeft:"3px solid #FF3B5C",paddingLeft:10}}>
              <div style={{...H,fontSize:16}}>{name}</div>
              {best>0&&<div style={{color:T.sub,fontSize:11}}>~{Math.round(best)}kg 1RM{pr&&pr.rm>0?" · PR "+Math.round(pr.rm)+"kg":""}</div>}
            </div>
            {filled.length===0
              ?<div style={{color:T.sub,fontSize:12,paddingLeft:13}}>No sets logged</div>
              :filled.map((s,i)=>(
                <div key={i} style={{display:"flex",gap:12,paddingLeft:13,marginBottom:5,alignItems:"center"}}>
                  <span style={{...H,fontSize:10,color:T.sub,width:16}}>{i+1}</span>
                  <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:15}}>{s.weight}kg × {s.reps}</span>
                  {s.rpe&&<span style={{color:T.sub,fontSize:11}}>RPE {s.rpe}</span>}
                </div>
              ))
            }
          </div>
        );
      })}
    </div>
  );
}

// ─── PROGRESS TRACKER ────────────────────────────────────────────────────────
function ProgressTracker(){
  const {T,workoutLogs,prs,bw,go,userDOB}=useContext(Ctx);
  const H={fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,textTransform:"uppercase"};

  // Collect all unique exercises ever logged across all sessions
  const exMap={};
  workoutLogs.forEach(log=>{
    if(!log.exerciseNames||!log.sets)return;
    Object.entries(log.exerciseNames).forEach(([eid,name])=>{
      const key=name.toLowerCase().replace(/\s+/g,"_");
      if(!exMap[key]){exMap[key]={name,key,sessions:0};}
      exMap[key].sessions++;
    });
  });
  const exercises=Object.values(exMap).sort((a,b)=>b.sessions-a.sessions);

  return(
    <div style={{padding:"24px 20px"}}>
      <PageHeader title="Progress Tracker"/>
      {exercises.length===0?(
        <div style={{color:T.sub,textAlign:"center",marginTop:60,...H,fontSize:16}}>LOG WORKOUTS TO SEE PROGRESS</div>
      ):(
        <>
          <div style={{...H,fontSize:10,color:T.sub,letterSpacing:"0.12em",marginBottom:14}}>
            {exercises.length} EXERCISES TRACKED
          </div>
          {exercises.map(ex=>{
            const pr=prs[ex.key];
            const rank=pr?getExerciseRank(ex.name,pr.rm,bw,userDOB):null;
            const showRank=rank&&rank.source==="sl";
            return(
              <div key={ex.key} onClick={()=>go("workout-exercise",{key:ex.key,name:ex.name})}
                style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                  paddingBottom:14,marginBottom:14,borderBottom:`1px solid ${T.div}`,cursor:"pointer"}}>
                <div>
                  <div style={{...H,fontSize:18}}>{ex.name}</div>
                  <div style={{color:T.sub,fontSize:11,marginTop:2}}>
                    {ex.sessions} session{ex.sessions!==1?"s":""}{pr?" · best "+Math.round(pr.rm)+"kg est. 1RM":""}
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  {rank&&<span style={{...H,fontSize:12,color:rank.c}}>{rank.n}</span>}
                  <span style={{color:T.sub,fontSize:16}}>›</span>
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

// ─── CREATE TEMPLATE ──────────────────────────────────────────────────────────
function CreateTemplate(){
  const {T,templates,saveTemplates,back,go,screenData}=useContext(Ctx);
  const mode=(screenData&&screenData.mode)||"template"; // "oneoff" | "template"
  const oneoff=mode==="oneoff";
  const [name,setName]=useState("");
  const [sub,setSub]=useState("");
  const [color,setColor]=useState("#FF3B5C");
  const [exs,setExs]=useState([]);
  const [exN,setExN]=useState("");const [exS,setExS]=useState("3");const [exR,setExR]=useState("");const [exSS,setExSS]=useState("");
  const COLS=["#FF3B5C","#3B82F6","#39FF14","#FF6B35","#7DF9FF","#FFD700","#A855F7"];

  const addEx=()=>{if(!exN)return;setExs(p=>[...p,{id:String(Date.now()),name:exN,sets:parseInt(exS)||3,targetReps:parseInt(exR)||0,superset:exSS||null}]);setExN("");setExR("");setExSS("");};
  const build=()=>({id:String(Date.now()),name:name||"Workout",subtitle:sub,color,exercises:exs});
  // template mode
  const saveTemplate=async()=>{if(!name||!exs.length)return;await saveTemplates([...templates,build()]);back();};
  const saveAndLog=async()=>{if(!exs.length)return;const t=build();await saveTemplates([...templates,t]);go("workout-active",t);};
  // one-off mode: NOT saved as a template, only goes to history via ActiveWorkout
  const logOneOff=()=>{if(!exs.length)return;go("workout-active",{...build(),date:screenData?.date||todayStr()});};

  return(
    <div style={{padding:"24px 20px"}}>
      <PageHeader title={oneoff?"New Workout":"New Template"}/>
      {oneoff&&<div style={{color:T.sub,fontSize:12,marginBottom:16,lineHeight:1.5}}>One-off session — saved to your history only, not added to templates.</div>}
      <Inp placeholder="Name (e.g. WO3)" value={name} onChange={e=>setName(e.target.value)} style={{display:"block",width:"100%",marginBottom:10}}/>
      <Inp placeholder="Subtitle (optional)" value={sub} onChange={e=>setSub(e.target.value)} style={{display:"block",width:"100%",marginBottom:16}}/>
      <div style={{display:"flex",gap:10,marginBottom:20}}>
        {COLS.map(c=><div key={c} onClick={()=>setColor(c)} style={{width:24,height:24,borderRadius:"50%",background:c,border:color===c?"2px solid white":"2px solid transparent",cursor:"pointer"}}/>)}
      </div>
      <div style={{display:"flex",gap:8,marginBottom:8}}>
        <Inp placeholder="Exercise name" value={exN} onChange={e=>setExN(e.target.value)} style={{flex:2}}/>
        <Inp placeholder="Sets" value={exS} onChange={e=>setExS(e.target.value)} type="number" style={{flex:0.7,padding:"12px 8px"}}/>
        <Inp placeholder="Reps" value={exR} onChange={e=>setExR(e.target.value)} type="number" style={{flex:0.7,padding:"12px 8px"}}/>
        <Inp placeholder="SS" value={exSS} onChange={e=>setExSS(e.target.value.toUpperCase().slice(0,1))} style={{flex:0.5,padding:"12px 8px",textAlign:"center"}}/>
      </div>
      <div style={{color:T.sub,fontSize:11,marginBottom:8,lineHeight:1.4}}>SS = superset group (e.g. A). Give two exercises the same letter to pair them.</div>
      <Btn label="+ Add Exercise" onClick={addEx} ghost style={{marginBottom:14}}/>
      {exs.map((ex,i)=>(
        <div key={ex.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:10,marginBottom:10,borderBottom:`1px solid ${T.div}`}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,display:"flex",alignItems:"center",gap:8}}>
            {ex.name}
            {ex.superset&&<span style={{background:"#A855F7",color:"#000",fontSize:10,padding:"1px 6px",borderRadius:2,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900}}>{ex.superset}</span>}
          </div>
          <div style={{display:"flex",gap:12,alignItems:"center"}}>
            <span style={{color:T.sub,fontSize:12}}>{ex.sets}×{ex.targetReps||"∞"}</span>
            <button onClick={()=>setExs(p=>p.filter((_,idx)=>idx!==i))} style={{background:"none",border:"none",color:"#FF3B5C",cursor:"pointer",fontSize:18}}>×</button>
          </div>
        </div>
      ))}
      {oneoff?(
        <Btn label="Start Workout" onClick={logOneOff} style={{marginTop:16,padding:"16px"}}/>
      ):(
        <>
          <Btn label="Save & Log Workout" onClick={saveAndLog} style={{marginTop:16,marginBottom:10,padding:"16px"}}/>
          <Btn label="Save Template Only" onClick={saveTemplate} ghost/>
        </>
      )}
    </div>
  );
}

// ─── EXERCISE PROGRESS ────────────────────────────────────────────────────────
function ExerciseProgress(){
  const {T,screenData,workoutLogs,prs,bw,userDOB}=useContext(Ctx);
  if(!screenData)return null;
  const {key,name}=screenData;
  const pr=prs[key];
  const baseKey=key.split("_")[0];

  // Build per-session data: date + avg weight used
  const data=[...workoutLogs].sort((a,b)=>new Date(a.date)-new Date(b.date)).flatMap(log=>{
    if(!log.sets||!log.exerciseNames)return[];
    const eid=Object.keys(log.exerciseNames).find(k=>{
      const n=(log.exerciseNames[k]||"").toLowerCase().replace(/\s+/g,"_");
      return n===key||n.startsWith(baseKey);
    });
    if(!eid)return[];
    const filled=(log.sets[eid]||[]).filter(s=>s.weight&&s.reps);
    if(!filled.length)return[];
    const avg=filled.reduce((s,x)=>s+parseFloat(x.weight),0)/filled.length;
    const maxW=filled.reduce((m,x)=>Math.max(m,parseFloat(x.weight)),0);
    return[{date:new Date(log.date).toLocaleDateString("en-GB",{day:"numeric",month:"short"}),
      "Avg kg":Math.round(avg*10)/10,"Top kg":maxW}];
  });

  const rank=pr?getExerciseRank(name,pr.rm,bw,userDOB):null;
  const H={fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,textTransform:"uppercase"};
  const slSource=rank?.source==="sl";

  // 1RM projection: linear regression on top-kg per session over time
  const projData=data.length>=3?data.map((d,i)=>({i,rm:d["Top kg"]})):null;
  let projDate=null,projWeeksLeft=null;
  if(projData&&pr){
    const n=projData.length;
    const sumX=projData.reduce((s,d)=>s+d.i,0);
    const sumY=projData.reduce((s,d)=>s+d.rm,0);
    const sumXY=projData.reduce((s,d)=>s+d.i*d.rm,0);
    const sumX2=projData.reduce((s,d)=>s+d.i*d.i,0);
    const slope=(n*sumXY-sumX*sumY)/(n*sumX2-sumX*sumX);
    const intercept=(sumY-slope*sumX)/n;
    // Find closest PR key with year-end target
    const yearEndTarget=null; // goals don't link directly to PRs yet
    // Project to next SL tier
    const nextTier=rank?.next;
    if(nextTier&&slope>0){
      const sessionsNeeded=(nextTier-intercept)/slope-projData[projData.length-1].i;
      // Assume ~2 sessions/week
      projWeeksLeft=Math.round(sessionsNeeded/2);
      if(projWeeksLeft>0&&projWeeksLeft<156){
        const d=new Date();d.setDate(d.getDate()+projWeeksLeft*7);
        projDate=d.toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"});
      }
    }
  }
  return(
    <div style={{padding:"24px 20px"}}>
      <PageHeader title={name.toUpperCase()}/>
      {pr&&(
        <div style={{display:"flex",gap:10,marginBottom:24}}>
          <div style={{background:T.card,borderRadius:0,padding:"14px 20px",textAlign:"center",flex:1}}>
            <div style={{...H,fontSize:38,color:"#FFD700",lineHeight:1}}>{Math.round(pr.rm)}</div>
            <div style={{color:"#555",fontSize:10,marginTop:3}}>EST. 1RM kg</div>
          </div>
          <div style={{background:T.card,borderRadius:0,padding:"14px 20px",textAlign:"center",flex:1}}>
            <div style={{...H,fontSize:20,color:rank?.c||"#fff",lineHeight:1.2}}>{rank?.n||"—"}</div>
            <div style={{color:"#555",fontSize:10,marginTop:3}}>{slSource?`AGE ${rank?.age} · SL`:"RATIO"}</div>
          </div>
          <div style={{background:T.card,borderRadius:0,padding:"14px 20px",textAlign:"center",flex:1}}>
            <div style={{...H,fontSize:28,color:"#7DF9FF",lineHeight:1}}>{data.length}</div>
            <div style={{color:"#555",fontSize:10,marginTop:3}}>SESSIONS</div>
          </div>
        </div>
      )}
      {projDate&&(
        <div style={{borderLeft:"3px solid #39FF14",paddingLeft:12,marginBottom:20,paddingTop:4,paddingBottom:4}}>
          <div style={{...H,fontSize:10,color:T.sub,letterSpacing:"0.12em",marginBottom:3}}>NEXT TIER PROJECTION</div>
          <div style={{...H,fontSize:15}}>{rank?.next}kg — ~{projWeeksLeft} weeks at current pace</div>
          <div style={{color:T.sub,fontSize:11,marginTop:2}}>{projDate}</div>
        </div>
      )}
      {/* All sessions — all sets including fails */}
      {workoutLogs.filter(log=>log.exerciseNames&&Object.values(log.exerciseNames).some(n=>n===name)).sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,12).map(log=>{
        const eid=Object.keys(log.exerciseNames||{}).find(k=>log.exerciseNames[k]===name);
        const allSets=(log.sets?.[eid]||[]);
        if(!allSets.length)return null;
        return(
          <div key={log.id} style={{paddingBottom:10,marginBottom:10,borderBottom:`1px solid ${T.div}`}}>
            <div style={{...H,fontSize:10,color:T.sub,marginBottom:5}}>{new Date(log.date).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}</div>
            {allSets.map((set,i)=>{
              const hasBoth=set.weight&&set.reps;
              const fail=set.weight&&!set.reps;
              return(
                <div key={i} style={{display:"flex",gap:10,alignItems:"center",marginBottom:3}}>
                  <span style={{...H,fontSize:9,color:T.sub,width:12}}>{i+1}</span>
                  {hasBoth&&<span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13}}>{set.weight}kg × {set.reps}</span>}
                  {fail&&<span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13,color:"#FF3B5C"}}>{set.weight}kg — FAIL</span>}
                  {!hasBoth&&!fail&&<span style={{color:T.sub,fontSize:11}}>—</span>}
                  {set.rpe&&hasBoth&&<span style={{color:T.sub,fontSize:11}}>RPE {set.rpe}</span>}
                </div>
              );
            })}
          </div>
        );
      })}
      {data.length>1?(
        <div style={{background:T.card,borderRadius:0,padding:"18px 8px 10px"}}>
          <div style={{...H,fontSize:10,color:"#555",paddingLeft:10,marginBottom:8,letterSpacing:"0.1em"}}>AVG WEIGHT / SESSION (kg)</div>
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={data}>
              <XAxis dataKey="date" tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false} width={36}/>
              <Tooltip contentStyle={{background:"#1A1A1A",border:"none",borderRadius:0,color:"#fff",fontSize:12}}/>
              <Line type="monotone" dataKey="Avg kg" stroke="#FF3B5C" strokeWidth={2.5} dot={{fill:"#FF3B5C",r:4}} activeDot={{r:6}}/>
              <Line type="monotone" dataKey="Top kg" stroke="#FFD700" strokeWidth={1.5} dot={false} strokeDasharray="4 3"/>
            </LineChart>
          </ResponsiveContainer>
          <div style={{display:"flex",gap:16,paddingLeft:10,marginTop:4}}>
            <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:14,height:2.5,background:"#FF3B5C",borderRadius:2}}/><span style={{color:"#555",fontSize:10}}>Avg</span></div>
            <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:14,height:1.5,background:"#FFD700",borderRadius:2}}/><span style={{color:"#555",fontSize:10}}>Top set</span></div>
          </div>
        </div>
      ):(
        <div style={{color:T.sub,textAlign:"center",marginTop:50,fontFamily:"'Barlow Condensed',sans-serif",fontSize:15}}>LOG MORE SESSIONS TO SEE PROGRESS</div>
      )}
    </div>
  );
}

// ─── MINI CALENDAR ───────────────────────────────────────────────────────────
function MiniCalendar({value,onChange}){
  const {T}=useContext(Ctx);
  const [open,setOpen]=useState(false);
  const [view,setView]=useState(()=>{const d=new Date(value+'T12:00:00');return{y:d.getFullYear(),m:d.getMonth()};});
  const H={fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,textTransform:"uppercase"};
  const today=todayStr();
  const d=new Date(value+'T12:00:00');
  const dayLabel=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()];
  const display=dayLabel+' · '+d.toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"});
  const dim=new Date(view.y,view.m+1,0).getDate();
  const firstDow=new Date(view.y,view.m,1).getDay();
  const offset=firstDow===0?6:firstDow-1;
  const nav=dt=>{const nd=new Date(view.y,view.m+dt,1);setView({y:nd.getFullYear(),m:nd.getMonth()});};
  const pick=day=>{const ds=view.y+'-'+String(view.m+1).padStart(2,'0')+'-'+String(day).padStart(2,'0');onChange(ds);setOpen(false);};
  const monthLabel=new Date(view.y,view.m,1).toLocaleDateString("en-GB",{month:"long",year:"numeric"});
  return(
    <div style={{marginBottom:14}}>
      <button onClick={()=>setOpen(!open)} style={{width:"100%",background:T.inp,border:"none",borderBottom:"1px solid #333",borderRadius:0,padding:"12px 14px",color:T.text,textAlign:"left",...H,fontSize:15,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span>{display}</span><span style={{color:T.sub,fontSize:18}}>{open?"▴":"▾"}</span>
      </button>
      {open&&(
        <div style={{background:T.inp,border:"1px solid #222",padding:12,userSelect:"none"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <button onClick={()=>nav(-1)} style={{background:"none",border:"none",color:T.sub,cursor:"pointer",...H,fontSize:18,padding:"0 6px"}}>‹</button>
            <div style={{...H,fontSize:12}}>{monthLabel}</div>
            <button onClick={()=>nav(1)} style={{background:"none",border:"none",color:T.sub,cursor:"pointer",...H,fontSize:18,padding:"0 6px"}}>›</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:4}}>
            {["M","T","W","T","F","S","S"].map((d,i)=><div key={i} style={{textAlign:"center",color:"#444",...H,fontSize:9}}>{d}</div>)}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
            {Array(offset).fill(null).map((_,i)=><div key={"e"+i}/>)}
            {Array(dim).fill(null).map((_,i)=>{
              const day=i+1;const ds=view.y+'-'+String(view.m+1).padStart(2,'0')+'-'+String(day).padStart(2,'0');
              const isSel=ds===value;const isTdy=ds===today;
              return(<button key={day} onClick={()=>pick(day)} style={{background:isSel?T.text:"transparent",color:isSel?T.bg:isTdy?"#FF3B5C":T.text,border:isTdy&&!isSel?"1px solid #FF3B5C":"none",borderRadius:0,padding:"6px 0",fontSize:12,cursor:"pointer",...H,textAlign:"center"}}>{day}</button>);
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── BARBER ─────────────────────────────────────────────────────────────────
const DEFAULT_TYPES=[
  {id:"haircut",name:"Haircut",duration:30,price:250,color:"#7DF9FF"},
  {id:"beard",name:"Beard",duration:30,price:150,color:"#FFD700"},
  {id:"beard_haircut",name:"Beard + Haircut",duration:60,price:300,color:"#FF3B5C"},
  {id:"lunch",name:"Lunch",duration:60,price:0,color:"#2A2A2A",isBlock:true},
];

function BarberScreen(){
  const {T,barberDays,saveBarberDays,barberIncome,saveBarberIncome,apiKey}=useContext(Ctx);

  // Rate increase trigger: 2 consecutive complete months at 95%+
  const rateAlert=(()=>{
    const now=new Date();
    const months=[];
    for(let i=1;i<=2;i++){const d=new Date(now.getFullYear(),now.getMonth()-i,1);months.push(d.toISOString().slice(0,7));}
    const monthAvgs=months.map(mo=>{
      const days=barberDays.filter(d=>d.date.startsWith(mo)&&d.pct!==undefined);
      if(!days.length)return null;
      return Math.round(days.reduce((s,d)=>s+(d.pct||0),0)/days.length);
    });
    return monthAvgs.every(a=>a!==null&&a>=95)?monthAvgs:null;
  })();
  const [tab,setTab]=useState("log");
  const [barberAiInsights,setBarberAiInsights]=useState(null);
  const [barberAiLoading,setBarberAiLoading]=useState(false);

  const runBarberAI=async()=>{
    if(!barberDays.length){return;}
    setBarberAiLoading(true);
    try{
      // Build per-day-of-week slot utilisation — focus on first/last slot fill rate
      const DOW=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
      const slotEdges={};
      barberDays.forEach(day=>{
        const sched=day.schedule||[];
        if(!sched.length)return;
        const booked=sched.filter(a=>!a.isBlock&&a.name);
        const wh={start:day.workHrStart||day.dayStart,end:day.workHrEnd||day.dayEnd};
        const dow=new Date(day.date+'T12:00:00').toLocaleDateString('en-US',{weekday:'short'});
        if(!slotEdges[dow])slotEdges[dow]={firstBooked:0,lastBooked:0,total:0,firstSlotTime:wh.start,lastSlotTime:wh.end};
        slotEdges[dow].total++;
        if(booked.length>0){
          const firstSched=sched[0];const lastSched=sched[sched.length-1];
          if(firstSched&&booked.find(a=>a.startTime===firstSched.startTime))slotEdges[dow].firstBooked++;
          if(lastSched&&booked.find(a=>a.startTime===lastSched.startTime))slotEdges[dow].lastBooked++;
        }
      });
      const edgeSummary=Object.entries(slotEdges).map(([d,v])=>({
        day:d,total:v.total,
        firstFillPct:v.total?Math.round(v.firstBooked/v.total*100):0,
        lastFillPct:v.total?Math.round(v.lastBooked/v.total*100):0,
        firstSlotTime:v.firstSlotTime,lastSlotTime:v.lastSlotTime
      }));

      // Booking % by day of week
      const dowBooking={};
      barberDays.forEach(day=>{
        const dow=new Date(day.date+'T12:00:00').toLocaleDateString('en-US',{weekday:'short'});
        if(!dowBooking[dow]){dowBooking[dow]={sum:0,count:0};}
        dowBooking[dow].sum+=(day.pct||0);dowBooking[dow].count++;
      });
      const dowAvg=Object.entries(dowBooking).map(([d,v])=>({day:d,avgPct:Math.round(v.sum/v.count)})).sort((a,b)=>b.avgPct-a.avgPct);

      // Recent trend (last 4 weeks vs previous 4 weeks)
      const sorted=[...barberDays].sort((a,b)=>a.date.localeCompare(b.date));
      const recent=sorted.slice(-8);const prev=sorted.slice(-16,-8);
      const recentAvg=recent.length?Math.round(recent.reduce((s,d)=>s+(d.pct||0),0)/recent.length):null;
      const prevAvg=prev.length?Math.round(prev.reduce((s,d)=>s+(d.pct||0),0)/prev.length):null;

      const payload=JSON.stringify({
        totalSessions:barberDays.length,
        overallAvgPct:Math.round(barberDays.reduce((s,d)=>s+(d.pct||0),0)/barberDays.length),
        recentAvgPct:recentAvg,prevAvgPct:prevAvg,
        dayOfWeekBreakdown:dowAvg,
        slotEdgeAnalysis:edgeSummary,
        rateAlert:rateAlert?{month1:rateAlert[1],month2:rateAlert[0]}:null
      });

      const txt=await aiPost(apiKey,{max_tokens:800,system:"You are a barbershop scheduling analyst. Return ONLY a valid JSON array of 3-5 insights. Each: {type:'extend_earlier'|'extend_later'|'cut_hours'|'warning'|'positive'|'trend', title:'max 5 words', body:'1-2 sentences with exact numbers. For hour extension: say which days, which direction, and WHY based on first/last slot fill rates. Be specific and direct.'}. Priorities: (1) if firstFillPct is 80%+ on any day, recommend starting earlier on that day; (2) if lastFillPct is 80%+ on any day, recommend ending later; (3) if firstFillPct or lastFillPct is <30%, recommend cutting those hours; (4) trend direction; (5) which days are most vs least productive. No markdown, no preamble.",
        messages:[{role:"user",content:"Analyse my barbershop schedule data: "+payload}]
      });
      setBarberAiInsights(JSON.parse(txt.replace(/```json|```/g,"").trim()));
    }catch{setBarberAiInsights([{type:"warning",title:"Analysis failed",body:"Could not reach AI. Try again."}]);}
    setBarberAiLoading(false);
  };

  const [trendPeriod,setTrendPeriod]=useState("day");
  const [trendDay,setTrendDay]=useState("Sat");
  // Appointment types — stored per-session in storage
  const [types,setTypes]=useState(DEFAULT_TYPES);
  const [editTypeId,setEditTypeId]=useState(null);
  const [editBuf,setEditBuf]=useState({});
  useEffect(()=>{window.storage.get('k3_barber_types').then(r=>{if(r)setTypes(JSON.parse(r.value));}).catch(()=>{});},[]); 
  const saveTypes=async t=>{setTypes(t);try{await window.storage.set('k3_barber_types',JSON.stringify(t));}catch{}};
  // Log state
  const DEFAULT_WH={Mon:{s:'10:00',e:'18:00'},Tue:{s:'10:00',e:'18:00'},Wed:{s:'10:00',e:'18:00'},Thu:{s:'10:00',e:'18:00'},Fri:{s:'10:00',e:'18:00'},Sat:{s:'10:00',e:'18:00'},Sun:{s:'10:00',e:'18:00'}};
  const initHours=d=>{const dn=dayOf2(d);return DEFAULT_WH[dn]||{s:'10:00',e:'18:00'};};
  const dayOf2=d=>['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date(d+'T12:00:00').getDay()];
  const [logDate,setLogDate]=useState(todayStr());
  const [workHrStart,setWorkHrStart]=useState(()=>initHours(todayStr()).s);
  const [workHrEnd,setWorkHrEnd]=useState(()=>initHours(todayStr()).e);
  const [dayStart,setDayStart]=useState(10);
  const [dayEnd,setDayEnd]=useState(18);
  const [schedule,setSchedule]=useState([]);
  const [pickerSlot,setPickerSlot]=useState(null);
  const [customName,setCustomName]=useState("");const [customDur,setCustomDur]=useState("30");
  const [confirmDel,setConfirmDel]=useState(null);
  const [pMonth,setPMonth]=useState("");const [pAmount,setPAmount]=useState("");

  const H={fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,textTransform:"uppercase"};
  const DC={Mon:"#A855F7",Tue:"#A855F7",Wed:"#A855F7",Thu:"#7DF9FF",Fri:"#FFD700",Sat:"#FF3B5C",Sun:"#A855F7"};
  const ALL_DAYS=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const dayOf=d=>['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date(d+'T12:00:00').getDay()];
  const pctColor=p=>p>=75?"#39FF14":p>=60?"#FFD700":"#FF3B5C";
  const t2m=t=>{const[h,m]=t.split(':').map(Number);return h*60+m;};
  const m2t=m=>String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');
  const genSlots=(s,e)=>{const r=[];for(let m=s*60;m<e*60;m+=15)r.push(m2t(m));return r;};
  const slots=genSlots(dayStart,dayEnd);
  const occupiedBy=time=>{const t=t2m(time);return schedule.find(a=>{const s=t2m(a.startTime);return t>=s&&t<s+a.duration;});};
  const textCol=bg=>{if(!bg||bg.length<4)return'#fff';const h=bg.replace('#','').padEnd(6,'0');const r=parseInt(h.substr(0,2),16)||0,g=parseInt(h.substr(2,2),16)||0,b=parseInt(h.substr(4,2),16)||0;return(r*0.299+g*0.587+b*0.114)>160?'#000':'#fff';};

  // Slot size = duration of the haircut appointment type
  const haircutType=types.find(t=>t.name.toLowerCase().replace(/\s+/g,'').includes('haircut')&&!t.name.toLowerCase().includes('beard'))||types[0];
  const slotSize=haircutType?haircutType.duration:30;

  // "Lunch" = any appointment whose name contains the word "lunch" (case-insensitive)
  // Lunch contracts total capacity — calendar is closed, not just unbooked
  const isLunch=a=>a.isBlock||a.name.toLowerCase().includes('lunch');
  const isRealAppt=a=>!isLunch(a);

  // Booking stats — based on WORKING HOURS only, lunch shrinks denominator
  const bookedAppts=schedule.filter(isRealAppt);
  const clamp=(t,s,e)=>Math.max(s,Math.min(e,t));
  const workMinIn=(a)=>{const aS=t2m(a.startTime),aE=aS+a.duration,wS=t2m(workHrStart),wE=t2m(workHrEnd);return Math.max(0,clamp(aE,wS,wE)-clamp(aS,wS,wE));};
  const lunchMin=schedule.filter(isLunch).reduce((sum,a)=>sum+workMinIn(a),0);
  const bookedMin=bookedAppts.reduce((sum,a)=>sum+workMinIn(a),0);
  const totalWorkMin=Math.max(0,t2m(workHrEnd)-t2m(workHrStart));
  const availMin=totalWorkMin-lunchMin;
  const availSlots=availMin>0?Math.floor(availMin/slotSize):0;
  const bookedSlots=slotSize>0?Math.round(bookedMin/slotSize):0;
  const bookPct=availSlots>0?Math.round((bookedSlots/availSlots)*100):0;
  const income=bookedAppts.reduce((s,a)=>s+a.price,0);

  const addAppt=type=>{
    if(!pickerSlot)return;
    // Remove any existing appts that overlap
    const ns=t2m(pickerSlot);const ne=ns+type.duration;
    const filtered=schedule.filter(a=>{const s=t2m(a.startTime);return !(ne>s&&ns<s+a.duration);});
    setSchedule([...filtered,{id:Date.now(),startTime:pickerSlot,...type}]);
    setPickerSlot(null);setCustomName("");setCustomDur("30");
  };
  const removeAppt=id=>setSchedule(p=>p.filter(a=>a.id!==id));

  const saveDay=async()=>{
    if(schedule.length===0)return;
    const dn=dayOf(logDate);
    await saveBarberDays([...barberDays,{id:Date.now(),date:logDate,dayName:dn,
      dayStart,dayEnd,workHrStart,workHrEnd,schedule,
      clients:bookedSlots,slots:availSlots,pct:bookPct,income}]);
    setSchedule([]);setPickerSlot(null);
  };

  const deleteDay=async id=>{await saveBarberDays(barberDays.filter(e=>e.id!==id));setConfirmDel(null);};
  const addPaycheck=async()=>{if(!pMonth||!pAmount)return;await saveBarberIncome([...barberIncome,{id:Date.now(),month:pMonth,amount:parseInt(pAmount)}]);setPMonth("");setPAmount("");};

  // Week summary
  const wkStart=(()=>{const d=new Date(todayStr()+'T12:00:00');const dy=d.getDay();d.setDate(d.getDate()-dy+(dy===0?-6:1));return d.toISOString().split('T')[0];})();
  const wkEntries=barberDays.filter(e=>e.date>=wkStart&&e.date<=todayStr());
  const wkClients=wkEntries.reduce((s,e)=>s+e.clients,0);
  const wkSlots=wkEntries.reduce((s,e)=>s+e.slots,0);
  const wkPct=wkSlots>0?Math.round((wkClients/wkSlots)*100):null;

  // Trends
  const trendData=barberDays.filter(e=>e.dayName===trendDay)
    .sort((a,b)=>new Date(a.date)-new Date(b.date))
    .map(e=>({date:new Date(e.date+'T12:00:00').toLocaleDateString("en-GB",{day:"numeric",month:"short"}),"%":e.pct}));
  const tn=trendData.length;
  const tAvg=tn?Math.round(trendData.reduce((s,e)=>s+e["%"],0)/tn):0;
  const tBest=tn?Math.max(...trendData.map(e=>e["%"])):0;
  const tLast=tn?trendData[tn-1]["%"]:0;

  const wkMap={};
  barberDays.forEach(e=>{const d=new Date(e.date+'T12:00:00');const dy=d.getDay();const mon=new Date(d);mon.setDate(d.getDate()-dy+(dy===0?-6:1));const wk=mon.toISOString().split('T')[0];if(!wkMap[wk])wkMap[wk]={c:0,s:0};wkMap[wk].c+=e.clients;wkMap[wk].s+=e.slots;});
  const weeklyChart=Object.entries(wkMap).sort(([a],[b])=>a.localeCompare(b)).map(([wk,v])=>({date:new Date(wk+'T12:00:00').toLocaleDateString("en-GB",{day:"numeric",month:"short"}),"%":v.s>0?Math.round(v.c/v.s*100):0}));

  const moMap={};
  barberDays.forEach(e=>{const[y,m]=e.date.split('-');const key=y+'-'+m;const label=new Date(e.date+'T12:00:00').toLocaleDateString("en-GB",{month:"short",year:"2-digit"});if(!moMap[key])moMap[key]={c:0,s:0,label};moMap[key].c+=e.clients;moMap[key].s+=e.slots;});
  const monthlyChart=Object.entries(moMap).sort(([a],[b])=>a.localeCompare(b)).map(([_,v])=>({date:v.label,"%":v.s>0?Math.round(v.c/v.s*100):0}));

  // Slot heatmap: which time slots are most booked for selected day-of-week
  const slotHeat=(()=>{
    const map={};
    barberDays.filter(e=>e.dayName===trendDay&&e.schedule).forEach(e=>{
      genSlots(e.dayStart||10,e.dayEnd||18).forEach(slot=>{
        if(!map[slot])map[slot]={b:0,total:0};map[slot].total++;
        const occ=e.schedule.find(a=>{const s=t2m(a.startTime);const st=t2m(slot);return st>=s&&st<s+a.duration&&!a.isBlock;});
        if(occ)map[slot].b++;
      });
    });
    return Object.entries(map).sort(([a],[b])=>t2m(a)-t2m(b)).map(([time,v])=>({time,"%":v.total>0?Math.round(v.b/v.total*100):0}));
  })();

  const recentDays=[...barberDays].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,6);
  const incomeData=barberIncome.slice(-6).map(e=>({m:e.month.split(" ")[0],DKK:e.amount}));
  const TT={contentStyle:{background:"#1A1A1A",border:"none",borderRadius:0,color:"#fff",fontSize:11}};
  const tabBtn=(id,l)=>(
    <button key={id} onClick={()=>setTab(id)} style={{flex:1,background:"transparent",border:"none",borderBottom:'2px solid '+(tab===id?T.text:"transparent"),color:tab===id?T.text:T.sub,padding:"10px 0",marginBottom:-1,...H,fontSize:12,cursor:"pointer",letterSpacing:"0.06em"}}>{l}</button>
  );

  return(
    <div style={{padding:"24px 20px"}}>
      <PageHeader title="BARBER"/>
      {rateAlert&&(
        <div style={{borderLeft:"3px solid #39FF14",paddingLeft:12,marginBottom:20,paddingTop:6,paddingBottom:6}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:10,color:"#39FF14",letterSpacing:"0.12em",marginBottom:3}}>2 MONTHS AT {rateAlert[1]}% / {rateAlert[0]}%</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:16}}>Raise price by 50 DKK.</div>
        </div>
      )}

      {/* Week summary */}
      {wkSlots>0&&(
        <div style={{borderLeft:"3px solid #FF3B5C",paddingLeft:12,marginBottom:20}}>
          <div style={{...H,fontSize:10,color:T.sub,letterSpacing:"0.12em",marginBottom:4}}>THIS WEEK</div>
          <div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:8}}>
            <div style={{...H,fontSize:48,lineHeight:1}}>{wkPct}%</div>
            <div style={{color:T.sub,fontSize:12}}>{wkClients} clients · {wkSlots} slots</div>
          </div>
          <GlowBar pct={wkPct} color={pctColor(wkPct)}/>
          <div style={{display:"flex",gap:12,marginTop:8}}>{wkEntries.map(e=><div key={e.id} style={{...H,fontSize:12,color:DC[e.dayName]||T.sub}}>{e.dayName} {e.pct}%</div>)}</div>
        </div>
      )}

      {/* Tabs */}
      <div style={{display:"flex",borderBottom:"1px solid #222",marginBottom:20}}>
        {tabBtn("log","LOG")}{tabBtn("trends","TRENDS")}{tabBtn("settings","TYPES")}
      </div>

      {/* ── LOG TAB ── */}
      {tab==="log"&&(
        <>
          <div style={{...H,fontSize:10,color:T.sub,letterSpacing:"0.12em",marginBottom:10}}>
            SELECT DAY <span style={{color:DC[dayOf(logDate)]||T.text,marginLeft:8}}>{dayOf(logDate)}</span>
          </div>
          <MiniCalendar value={logDate} onChange={d=>{
    setLogDate(d);setSchedule([]);setPickerSlot(null);
    const h=DEFAULT_WH[dayOf2(d)];if(h){setWorkHrStart(h.s);setWorkHrEnd(h.e);}
  }}/>

          {/* Working hours */}
          <div style={{display:'flex',gap:10,marginBottom:14,alignItems:'flex-end'}}>
            <div style={{flex:1}}>
              <div style={{...H,fontSize:9,color:'#FF3B5C',letterSpacing:'0.08em',marginBottom:5}}>WORK START</div>
              <input type='time' value={workHrStart} onChange={e=>setWorkHrStart(e.target.value)}
                style={{background:'transparent',border:'none',borderBottom:'1px solid #333',color:T.text,...H,fontSize:18,padding:'8px 0',width:'100%',outline:'none'}}/>
            </div>
            <div style={{flex:1}}>
              <div style={{...H,fontSize:9,color:'#FF3B5C',letterSpacing:'0.08em',marginBottom:5}}>WORK END</div>
              <input type='time' value={workHrEnd} onChange={e=>setWorkHrEnd(e.target.value)}
                style={{background:'transparent',border:'none',borderBottom:'1px solid #333',color:T.text,...H,fontSize:18,padding:'8px 0',width:'100%',outline:'none'}}/>
            </div>
            <div style={{flex:0.8,paddingBottom:10,textAlign:'center'}}>
              <div style={{...H,fontSize:9,color:T.sub,letterSpacing:'0.08em',marginBottom:5}}>SLOTS ({slotSize}m)</div>
              <div style={{...H,fontSize:18,color:T.sub}}>{Math.max(0,Math.floor((t2m(workHrEnd)-t2m(workHrStart))/slotSize))}</div>
            </div>
          </div>

          {/* Timeline */}
          {dayStart>0&&(
            <button onClick={()=>setDayStart(s=>s-1)} style={{width:"100%",background:"none",border:"1px dashed #222",color:"#444",padding:"6px",...H,fontSize:10,cursor:"pointer",marginBottom:6,letterSpacing:"0.08em"}}>
              ↑ EXPAND EARLIER ({String(dayStart-1).padStart(2,'0')}:00)
            </button>
          )}

          {slots.map(slot=>{
            const occ=occupiedBy(slot);
            if(occ&&occ.startTime!==slot)return null;
            const isOpen=pickerSlot===slot;
            const inWork=t2m(slot)>=t2m(workHrStart)&&t2m(slot)<t2m(workHrEnd);
            // Outside working hours: grey non-interactive placeholder
            if(!occ&&!inWork)return(
              <div key={slot} style={{display:'flex',gap:8,marginBottom:3}}>
                <div style={{width:42,color:'#1C1C1C',fontSize:10,...H,paddingTop:10,flexShrink:0,lineHeight:1}}>{slot}</div>
                <div style={{flex:1,background:'#0D0D0D',minHeight:20,borderLeft:'2px solid #111'}}/>
              </div>
            );
            if(occ){
              const tc=textCol(occ.color||"#333");
              const slotH=Math.max(22,Math.round(occ.duration/15)*22);
              return(
                <div key={slot} style={{display:"flex",gap:8,marginBottom:3}}>
                  <div style={{width:42,color:"#444",fontSize:10,...H,paddingTop:10,flexShrink:0,lineHeight:1}}>{slot}</div>
                  <div style={{flex:1,background:occ.color||"#333",color:tc,padding:"8px 12px",minHeight:slotH,display:"flex",justifyContent:"space-between",alignItems:"flex-start",cursor:"pointer"}} onClick={()=>removeAppt(occ.id)}>
                    <div>
                      <div style={{...H,fontSize:13,color:tc,lineHeight:1}}>{occ.name}</div>
                      <div style={{fontSize:10,color:tc,opacity:0.7,marginTop:3}}>{occ.duration}min{occ.isBlock?"":(occ.price>0?' · '+occ.price+' DKK':"")}  </div>
                    </div>
                    <span style={{fontSize:15,color:tc,opacity:0.6}}>×</span>
                  </div>
                </div>
              );
            }
            return(
              <div key={slot} style={{display:"flex",gap:8,marginBottom:3}}>
                <div style={{width:42,color:"#333",fontSize:10,...H,paddingTop:10,flexShrink:0,lineHeight:1}}>{slot}</div>
                <div onClick={()=>setPickerSlot(isOpen?null:slot)}
                  style={{flex:1,border:'1px dashed '+(isOpen?"#444":"#1E1E1E"),padding:"6px 12px",minHeight:22,cursor:"pointer",background:isOpen?"#111":"transparent"}}>
                  {isOpen&&(
                    <div onClick={e=>e.stopPropagation()}>
                      <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>
                        {types.map(t=>(
                          <button key={t.id} onClick={()=>addAppt(t)}
                            style={{background:t.color,color:textCol(t.color),border:"none",padding:"7px 12px",cursor:"pointer",...H,fontSize:11}}>
                            {t.name} {t.duration}m
                          </button>
                        ))}
                      </div>
                      <div style={{display:"flex",gap:6,alignItems:"center"}}>
                        <input value={customName} onChange={e=>setCustomName(e.target.value)} placeholder="Custom name"
                          style={{background:"#0A0A0A",border:"1px solid #333",borderRadius:0,color:T.text,padding:"6px 10px",fontSize:12,flex:1,outline:"none"}}/>
                        <select value={customDur} onChange={e=>setCustomDur(e.target.value)}
                          style={{background:"#0A0A0A",border:"1px solid #333",color:T.text,padding:"6px",fontSize:11,outline:"none"}}>
                          {["15","30","45","60","90","120"].map(d=><option key={d} value={d} style={{background:T.card}}>{d}m</option>)}
                        </select>
                        <button onClick={()=>{if(customName)addAppt({name:customName,duration:parseInt(customDur),price:0,color:"#A855F7",isBlock:false});}}
                          style={{background:"#A855F7",color:"#fff",border:"none",padding:"6px 12px",cursor:"pointer",...H,fontSize:11}}>+</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {dayEnd<24&&(
            <button onClick={()=>setDayEnd(e=>e+1)} style={{width:"100%",background:"none",border:"1px dashed #222",color:"#444",padding:"6px",...H,fontSize:10,cursor:"pointer",marginTop:6,letterSpacing:"0.08em"}}>
              ↓ EXPAND LATER ({String(dayEnd).padStart(2,'0')}:00)
            </button>
          )}

          {schedule.length>0&&(
            <div style={{marginTop:16,paddingTop:14,borderTop:"1px solid #1A1A1A"}}>
              <div style={{display:"flex",gap:14,marginBottom:12}}>
                <div style={{...H,fontSize:22,color:pctColor(bookPct)}}>{bookPct}%</div>
                <div style={{color:T.sub,fontSize:12,alignSelf:"flex-end",paddingBottom:2}}>{bookedSlots}/{availSlots} slots · {slotSize}min/slot{income>0?' · '+income.toLocaleString()+' DKK':""}</div>
              </div>
              <Btn label="Save Day" onClick={saveDay}/>
            </div>
          )}

          <Divider/>
          <div style={{...H,fontSize:10,color:T.sub,letterSpacing:"0.12em",marginBottom:14}}>RECENT SESSIONS</div>
          {recentDays.length===0
            ?<div style={{color:T.sub,...H,fontSize:13,textAlign:"center",padding:"16px 0"}}>NO SESSIONS YET</div>
            :recentDays.map(e=>{
              const isCf=confirmDel===e.id;
              return(
                <div key={e.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:12,marginBottom:12,borderBottom:'1px solid '+T.div}}>
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:2}}>
                      <span style={{...H,fontSize:16,color:DC[e.dayName]||T.text}}>{e.dayName}</span>
                      <span style={{color:T.sub,fontSize:12}}>{new Date(e.date+'T12:00:00').toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}</span>
                    </div>
                    <div style={{color:T.sub,fontSize:11}}>{e.clients} appts · {e.slots} slots{e.income>0?' · '+e.income.toLocaleString()+' DKK':""}</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{...H,fontSize:20,color:pctColor(e.pct)}}>{e.pct}%</div>
                    {isCf?(
                      <div style={{display:"flex",gap:5}}>
                        <button onClick={()=>deleteDay(e.id)} style={{background:"#FF3B5C",border:"none",color:"#fff",padding:"4px 8px",cursor:"pointer",...H,fontSize:10}}>DEL</button>
                        <button onClick={()=>setConfirmDel(null)} style={{background:"none",border:"1px solid #333",color:T.sub,padding:"4px 8px",cursor:"pointer",...H,fontSize:10}}>×</button>
                      </div>
                    ):(
                      <button onClick={()=>setConfirmDel(e.id)} style={{background:"none",border:"none",color:"#444",cursor:"pointer",fontSize:18,padding:"0 2px"}}>×</button>
                    )}
                  </div>
                </div>
              );
            })
          }
          <Divider/>
          <div style={{...H,fontSize:10,color:T.sub,letterSpacing:"0.12em",marginBottom:12}}>PAYCHECKS</div>
          <div style={{display:"flex",gap:8,marginBottom:8}}>
            <Inp placeholder="June 2026" value={pMonth} onChange={e=>setPMonth(e.target.value)} style={{flex:1.5}}/>
            <Inp placeholder="DKK" value={pAmount} onChange={e=>setPAmount(e.target.value)} type="number"/>
          </div>
          <Btn label="Add Paycheck" onClick={addPaycheck} ghost style={{marginBottom:16}}/>
          {[...barberIncome].reverse().map(e=>(
            <div key={e.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:12,marginBottom:12,borderBottom:'1px solid '+T.div}}>
              <div style={{...H,fontSize:15}}>{e.month}</div>
              <div style={{...H,fontSize:20,color:e.amount>=7000?"#39FF14":e.amount>=5500?"#FFD700":"#fff"}}>{e.amount.toLocaleString()} DKK</div>
            </div>
          ))}
        </>
      )}

      {/* ── TRENDS TAB ── */}
      {tab==="trends"&&(
        <>
          <div style={{display:"flex",borderBottom:"1px solid #222",marginBottom:20}}>
            {[["day","BY DAY"],["week","BY WEEK"],["month","BY MONTH"],["slots","TIME SLOTS"]].map(([id,l])=>(
              <button key={id} onClick={()=>setTrendPeriod(id)} style={{flex:1,background:"transparent",border:"none",borderBottom:'2px solid '+(trendPeriod===id?T.text:"transparent"),color:trendPeriod===id?T.text:T.sub,padding:"10px 0",marginBottom:-1,...H,fontSize:10,cursor:"pointer",letterSpacing:"0.06em"}}>{l}</button>
            ))}
          </div>

          {/* BY DAY — ALL days selectable, no data restriction */}
          {trendPeriod==="day"&&(
            <>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:20}}>
                {ALL_DAYS.map(d=>(
                  <button key={d} onClick={()=>setTrendDay(d)} style={{background:"transparent",border:'1px solid '+(trendDay===d?DC[d]||T.text:"#222"),color:trendDay===d?DC[d]||T.text:T.sub,padding:"6px 14px",...H,fontSize:13,cursor:"pointer"}}>
                    {d}
                  </button>
                ))}
              </div>
              {tn>0?(
                <>
                  <div style={{display:"flex",gap:10,marginBottom:16}}>
                    {[["AVG",tAvg+"%","#7DF9FF"],["BEST",tBest+"%","#39FF14"],["LAST",tLast+"%",pctColor(tLast)],["N",String(tn),"#555"]].map(([l,v,c])=>(
                      <div key={l} style={{flex:1,borderTop:'2px solid '+c,paddingTop:8}}>
                        <div style={{...H,fontSize:9,color:T.sub,letterSpacing:"0.1em",marginBottom:3}}>{l}</div>
                        <div style={{...H,fontSize:22,color:c,lineHeight:1}}>{v}</div>
                      </div>
                    ))}
                  </div>
                  {trendData.length>1&&(
                    <div style={{background:T.card,padding:"16px 8px 8px",marginBottom:14}}>
                      <div style={{...H,fontSize:10,color:"#555",paddingLeft:10,marginBottom:8,letterSpacing:"0.1em"}}>BOOKING % — {trendDay.toUpperCase()}</div>
                      <ResponsiveContainer width="100%" height={170}>
                        <LineChart data={trendData}><XAxis dataKey="date" tick={{fill:"#555",fontSize:9}} axisLine={false} tickLine={false}/><YAxis domain={[0,100]} tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false} width={28}/><Tooltip {...TT}/><Line type="monotone" dataKey="%" stroke={DC[trendDay]||"#FF3B5C"} strokeWidth={2.5} dot={{fill:DC[trendDay]||"#FF3B5C",r:4}} activeDot={{r:6}}/></LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                  {[...barberDays].filter(e=>e.dayName===trendDay).sort((a,b)=>new Date(b.date)-new Date(a.date)).map(e=>(
                    <div key={e.id} style={{display:"flex",justifyContent:"space-between",paddingBottom:10,marginBottom:10,borderBottom:'1px solid '+T.div}}>
                      <span style={{color:T.sub,fontSize:12}}>{new Date(e.date+'T12:00:00').toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}</span>
                      <div style={{display:"flex",gap:12,alignItems:"center"}}>
                        <span style={{color:T.sub,fontSize:12}}>{e.clients} appts</span>
                        {e.income>0&&<span style={{color:"#39FF14",...H,fontSize:12}}>{e.income.toLocaleString()}</span>}
                        <span style={{...H,fontSize:18,color:pctColor(e.pct)}}>{e.pct}%</span>
                      </div>
                    </div>
                  ))}
                </>
              ):(
                <div style={{color:T.sub,...H,fontSize:13,textAlign:"center",padding:"30px 0"}}>NO {trendDay.toUpperCase()} DATA YET</div>
              )}
            </>
          )}

          {/* BY WEEK */}
          {trendPeriod==="week"&&(weeklyChart.length>1?(
            <div style={{background:T.card,padding:"16px 8px 8px",marginBottom:16}}>
              <div style={{...H,fontSize:10,color:"#555",paddingLeft:10,marginBottom:8,letterSpacing:"0.1em"}}>BOOKING % BY WEEK</div>
              <ResponsiveContainer width="100%" height={200}><LineChart data={weeklyChart}><XAxis dataKey="date" tick={{fill:"#555",fontSize:9}} axisLine={false} tickLine={false}/><YAxis domain={[0,100]} tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false} width={28}/><Tooltip {...TT} formatter={v=>[v+'%','Booking']}/><Line type="monotone" dataKey="%" stroke="#FF3B5C" strokeWidth={2.5} dot={{fill:"#FF3B5C",r:4}} activeDot={{r:6}}/></LineChart></ResponsiveContainer>
            </div>
          ):<div style={{color:T.sub,...H,fontSize:13,textAlign:"center",padding:"30px 0"}}>LOG MORE SESSIONS FOR WEEKLY TRENDS</div>)}

          {/* BY MONTH */}
          {trendPeriod==="month"&&(monthlyChart.length>1?(
            <div style={{background:T.card,padding:"16px 8px 8px",marginBottom:16}}>
              <div style={{...H,fontSize:10,color:"#555",paddingLeft:10,marginBottom:8,letterSpacing:"0.1em"}}>BOOKING % BY MONTH</div>
              <ResponsiveContainer width="100%" height={200}><LineChart data={monthlyChart}><XAxis dataKey="date" tick={{fill:"#555",fontSize:9}} axisLine={false} tickLine={false}/><YAxis domain={[0,100]} tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false} width={28}/><Tooltip {...TT} formatter={v=>[v+'%','Booking']}/><Line type="monotone" dataKey="%" stroke="#39FF14" strokeWidth={2.5} dot={{fill:"#39FF14",r:4}} activeDot={{r:6}}/></LineChart></ResponsiveContainer>
            </div>
          ):<div style={{color:T.sub,...H,fontSize:13,textAlign:"center",padding:"30px 0"}}>LOG MORE SESSIONS FOR MONTHLY TRENDS</div>)}

          {/* TIME SLOTS heatmap */}
          {trendPeriod==="slots"&&(
            <>
              <div style={{...H,fontSize:10,color:T.sub,letterSpacing:"0.1em",marginBottom:12}}>WHICH SLOTS BOOK MOST — SELECT DAY</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:20}}>
                {ALL_DAYS.map(d=>(
                  <button key={d} onClick={()=>setTrendDay(d)} style={{background:"transparent",border:'1px solid '+(trendDay===d?DC[d]||T.text:"#222"),color:trendDay===d?DC[d]||T.text:T.sub,padding:"6px 12px",...H,fontSize:12,cursor:"pointer"}}>{d}</button>
                ))}
              </div>
              {slotHeat.length>0?(
                <div style={{background:T.card,padding:"16px 8px 8px"}}>
                  <div style={{...H,fontSize:10,color:"#555",paddingLeft:10,marginBottom:8,letterSpacing:"0.1em"}}>SLOT BOOKING % — {trendDay.toUpperCase()}</div>
                  <ResponsiveContainer width="100%" height={220}><BarChart data={slotHeat}><XAxis dataKey="time" tick={{fill:"#555",fontSize:8}} axisLine={false} tickLine={false} interval={1}/><YAxis domain={[0,100]} tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false} width={28}/><Tooltip {...TT} formatter={v=>[v+'%','Booked']}/><Bar dataKey="%" fill="#FF3B5C" radius={[2,2,0,0]}/></BarChart></ResponsiveContainer>
                </div>
              ):<div style={{color:T.sub,...H,fontSize:13,textAlign:"center",padding:"30px 0"}}>LOG {trendDay.toUpperCase()} SESSIONS WITH SCHEDULE DATA TO SEE SLOT STATS</div>}
            </>
          )}

          {incomeData.length>1&&(<><Divider/><div style={{...H,fontSize:10,color:T.sub,letterSpacing:"0.12em",marginBottom:12}}>MONTHLY INCOME</div><div style={{background:T.card,padding:"16px 8px 8px"}}><ResponsiveContainer width="100%" height={130}><LineChart data={incomeData}><XAxis dataKey="m" tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false}/><YAxis tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false} width={44}/><Tooltip {...TT}/><Line type="monotone" dataKey="DKK" stroke="#39FF14" strokeWidth={2.5} dot={{fill:"#39FF14",r:4}} activeDot={{r:6}}/></LineChart></ResponsiveContainer></div></>)}

          <Divider/>
          <div style={{...H,fontSize:10,color:T.sub,letterSpacing:"0.12em",marginBottom:12}}>AI SCHEDULE ANALYSIS</div>
          <button onClick={runBarberAI} disabled={barberAiLoading} style={{background:"transparent",border:"1px solid #333",borderRadius:0,color:barberAiLoading?T.sub:T.text,padding:"12px 20px",width:"100%",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,letterSpacing:"0.08em",textTransform:"uppercase",cursor:"pointer",marginBottom:barberAiInsights?12:0}}>
            {barberAiLoading?"ANALYSING…":"ANALYSE MY SCHEDULE"}
          </button>
          {barberAiInsights&&(
            <div>
              {barberAiInsights.map((ins,i)=>(
                <div key={i} style={{borderLeft:`3px solid ${ins.type==="extend_earlier"?"#7DF9FF":ins.type==="extend_later"?"#A78BFA":ins.type==="warning"?"#FF3B5C":ins.type==="positive"?"#39FF14":"#FFD700"}`,paddingLeft:12,marginBottom:14,paddingTop:2,paddingBottom:2}}>
                  <div style={{...H,fontSize:12,marginBottom:3}}>{ins.title}</div>
                  <div style={{fontSize:12,color:T.sub,lineHeight:1.6}}>{ins.body}</div>
                </div>
              ))}
              <button onClick={()=>setBarberAiInsights(null)} style={{background:"none",border:"none",color:"#444",...H,fontSize:10,cursor:"pointer",padding:0,letterSpacing:"0.08em",marginTop:4}}>CLEAR</button>
            </div>
          )}
        </>
      )}

      {/* ── TYPES TAB ── */}
      {tab==="settings"&&(
        <>
          <div style={{...H,fontSize:10,color:T.sub,letterSpacing:"0.12em",marginBottom:16}}>APPOINTMENT TYPES</div>
          {types.map((t,i)=>editTypeId===t.id?(
            <div key={t.id} style={{paddingBottom:14,marginBottom:14,borderBottom:'1px solid '+T.div}}>
              <div style={{display:"flex",gap:8,marginBottom:8}}>
                <Inp placeholder="Name" value={editBuf.name||t.name} onChange={e=>setEditBuf(b=>({...b,name:e.target.value}))} style={{flex:2}}/>
                <select value={editBuf.duration||t.duration} onChange={e=>setEditBuf(b=>({...b,duration:parseInt(e.target.value)}))}
                  style={{background:T.inp,border:"none",borderBottom:"1px solid #333",color:T.text,padding:"12px 8px",fontSize:14,flex:0.8,outline:"none"}}>
                  {["15","30","45","60","90","120"].map(d=><option key={d} value={d} style={{background:T.card}}>{d}min</option>)}
                </select>
              </div>
              <div style={{display:"flex",gap:8,marginBottom:10}}>
                <Inp placeholder="Price DKK (0 for blocks)" value={editBuf.price!==undefined?String(editBuf.price):String(t.price)} onChange={e=>setEditBuf(b=>({...b,price:parseInt(e.target.value)||0}))} type="number" style={{flex:1}}/>
                <div style={{display:"flex",gap:4,alignItems:"center"}}>
                  {["#7DF9FF","#FFD700","#FF3B5C","#39FF14","#A855F7","#FF6B35","#2A2A2A"].map(c=>(
                    <button key={c} onClick={()=>setEditBuf(b=>({...b,color:c}))} style={{width:20,height:20,background:c,border:(editBuf.color||t.color)===c?"2px solid #fff":"1px solid #333",cursor:"pointer",flexShrink:0}}/>
                  ))}
                </div>
              </div>
              <div style={{display:"flex",gap:6}}>
                <Btn label="Save" onClick={()=>{const updated=types.map((x,j)=>j===i?{...x,...editBuf}:x);saveTypes(updated);setEditTypeId(null);setEditBuf({});}} style={{flex:1,padding:"10px"}}/>
                <Btn label="Cancel" onClick={()=>{setEditTypeId(null);setEditBuf({});}} ghost style={{flex:0.6,padding:"10px"}}/>
                {!t.isBlock&&<button onClick={()=>{saveTypes(types.filter((_,j)=>j!==i));setEditTypeId(null);}} style={{background:"none",border:"1px solid #FF3B5C",color:"#FF3B5C",padding:"10px 14px",cursor:"pointer",...H,fontSize:11}}>REMOVE</button>}
              </div>
            </div>
          ):(
            <div key={t.id} onClick={()=>{setEditTypeId(t.id);setEditBuf({});}}
              style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:14,marginBottom:14,borderBottom:'1px solid '+T.div,cursor:"pointer"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:12,height:12,background:t.color,flexShrink:0}}/>
                <div style={{...H,fontSize:18}}>{t.name}</div>
              </div>
              <div style={{color:T.sub,fontSize:12}}>{t.duration}min{!t.isBlock&&t.price>0?' · '+t.price+' DKK':t.isBlock?' · BLOCK':""}</div>
            </div>
          ))}
          <Btn label="+ Add Type" onClick={()=>{const newT={id:String(Date.now()),name:"New Type",duration:30,price:250,color:"#A855F7"};saveTypes([...types,newT]);setEditTypeId(newT.id);setEditBuf({});}} ghost style={{marginBottom:10}}/>
          <Btn label="Reset to Defaults" onClick={()=>saveTypes(DEFAULT_TYPES)} ghost/>
        </>
      )}
    </div>
  );
}
// ─── DAILY LOG ───────────────────────────────────────────────────────────────

// ─── AI WEEKLY SUMMARY COMPONENT ─────────────────────────────────────────────
function AiWeeklySummary({weekData,morningLogs,nightLogs,workoutLogs}){
  const {T,apiKey}=useContext(Ctx);
  const [summary,setSummary]=useState(null);
  const [loading,setLoading]=useState(false);
  const H={fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,textTransform:"uppercase"};

  const run=async()=>{
    setLoading(true);
    try{
      const txt=await aiPost(apiKey,{max_tokens:400,system:"You are a blunt personal performance analyst. Given a week of data, write 3-4 sentences about what the numbers actually show — not what the person wants to hear. No encouragement, no padding. Just the data and what it means. Be specific with numbers.",
        messages:[{role:"user",content:"Week data: "+JSON.stringify(weekData)+" Morning logs: "+JSON.stringify(morningLogs.map(l=>({d:l.date,s:l.sleep,e:l.energy,m:l.mood})))+" Night logs: "+JSON.stringify(nightLogs.map(l=>({d:l.date,e:l.energy,m:l.mood,w:l.win,f:l.fail})))+" Workouts: "+JSON.stringify(workoutLogs.map(l=>({d:l.date.slice(0,10),diff:l.difficulty})))}]
      });
      setSummary(txt);
    }catch{setSummary("Could not reach AI. Try again.");}
    setLoading(false);
  };

  return(
    <div style={{marginBottom:24}}>
      <button onClick={run} disabled={loading} style={{background:"transparent",border:"1px solid #333",borderRadius:0,color:loading?T.sub:T.text,padding:"12px 20px",width:"100%",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,letterSpacing:"0.08em",textTransform:"uppercase",cursor:"pointer",marginBottom:summary?12:0}}>
        {loading?"ANALYSING…":"AI WEEKLY SUMMARY"}
      </button>
      {summary&&(
        <div style={{borderLeft:"2px solid #7DF9FF",paddingLeft:12,paddingTop:4,paddingBottom:4}}>
          <div style={{fontSize:13,lineHeight:1.6,color:T.sub}}>{summary}</div>
        </div>
      )}
    </div>
  );
}

function DailyScreen(){
  const {T,morningLogs,nightLogs,saveMorningLogs,saveNightLogs,go,workoutLogs,barberDays,weeklyReviews,saveWeeklyReviews,habits,saveHabits,apiKey}=useContext(Ctx);
  const [view,setView]=useState("home"); // "home"|"log"|"history"

  // Compute current week key for weekly review
  const _now=new Date();
  const _ws=new Date(_now);_ws.setDate(_now.getDate()-((_now.getDay()+6)%7));
  const currentWeekKey=_ws.toLocaleDateString('sv-SE');

  // Load existing weekly review into state when switching to weekly view (must be unconditional hook)
  useEffect(()=>{
    if(view==="weekly"){
      const ex=weeklyReviews.find(r=>r.weekStart===currentWeekKey);
      if(ex){setWkRating(ex.rating||null);setWkWorked(ex.worked||"");setWkDidnt(ex.didnt||"");setWkNote(ex.note||"");setWkSaved(true);}
      else{setWkRating(null);setWkWorked("");setWkDidnt("");setWkNote("");setWkSaved(false);}
    }
  },[view,currentWeekKey]);

  const toggleHabit=async(habitKey)=>{
    const today=todayStr();
    const day=habits[today]||{};
    const updated={...habits,[today]:{...day,[habitKey]:!day[habitKey]}};
    await saveHabits(updated);
  };
  const habitStreak=(key)=>{
    let streak=0;const d=new Date();
    while(streak<365){const ds=d.toLocaleDateString('sv-SE');if(habits[ds]?.[key]){streak++;d.setDate(d.getDate()-1);}else if(ds===todayStr()&&streak===0){d.setDate(d.getDate()-1);}else break;}
    return streak;
  };
  const todayHabits=habits[todayStr()]||{};
  const [flow,setFlow]=useState("morning");
  const [logDate,setLogDate]=useState(todayStr());
  const verse=getDailyVerse();
  const yest=(()=>{const d=new Date();d.setDate(d.getDate()-1);return d.toISOString().split("T")[0];})();

  const [mBedtime,setMBedtime]=useState("22:00");
  const [mWakeTime,setMWakeTime]=useState("06:45");
  const calcSleepHrs=(bed,wake)=>{if(!bed||!wake)return 0;const[bh,bm]=bed.split(":").map(Number);const[wh,wm]=wake.split(":").map(Number);let mins=(wh*60+wm)-(bh*60+bm);if(mins<0)mins+=1440;return Math.round(mins/60*10)/10;};
  const [mSleep,setMSleep]=useState("");const [mEnergy,setMEnergy]=useState("");
  const [lowSleepAlert,setLowSleepAlert]=useState(false);
  const [mMood,setMMood]=useState("");const [mMoodWord,setMMoodWord]=useState("");const [mNotes,setMNotes]=useState("");const [mStretchDone,setMStretchDone]=useState(false);
  const [mHRV,setMHRV]=useState("");const [mHR,setMHR]=useState("");
  const [nEnergy,setNEnergy]=useState("");const [nMood,setNMood]=useState("");const [nMoodWord,setNMoodWord]=useState("");const [nStretchDone,setNStretchDone]=useState(false);
  const [nWin,setNWin]=useState("");const [nFail,setNFail]=useState("");
  const [nMissed,setNMissed]=useState("");const [nGratitude,setNGratitude]=useState("");
  const [wkRating,setWkRating]=useState(null);const [wkWorked,setWkWorked]=useState("");const [wkDidnt,setWkDidnt]=useState("");const [wkNote,setWkNote]=useState("");const [wkSaved,setWkSaved]=useState(false);
  const [editDate,setEditDate]=useState(null);
  const [editBuf,setEditBuf]=useState({});

  const saveMorning=async()=>{
    const calcSleep=calcSleepHrs(mBedtime,mWakeTime);const sleepVal=calcSleep||parseFloat(mSleep)||0;
    const entry={date:logDate,sleep:sleepVal,bedtime:mBedtime,wakeTime:mWakeTime,energy:parseInt(mEnergy)||0,mood:parseInt(mMood)||0,moodWord:mMoodWord,notes:mNotes,verse:verse.ref,hrv:parseInt(mHRV)||null,restingHR:parseInt(mHR)||null,stretchDone:mStretchDone};
    await saveMorningLogs([...morningLogs.filter(l=>l.date!==logDate),entry]);
    setMBedtime("22:00");setMWakeTime("06:45");setMSleep("");setMEnergy("");setMMood("");setMMoodWord("");setMNotes("");setMHRV("");setMHR("");setMStretchDone(false);
    if(sleepVal>0&&sleepVal<8)setLowSleepAlert(true);
  };
  const saveNight=async()=>{
    const entry={date:logDate,energy:parseInt(nEnergy)||0,mood:parseInt(nMood)||0,moodWord:nMoodWord,win:nWin,fail:nFail,missed:nMissed,gratitude:nGratitude,stretchDone:nStretchDone};
    await saveNightLogs([...nightLogs.filter(l=>l.date!==logDate),entry]);
    setNEnergy("");setNMood("");setNMoodWord("");setNWin("");setNFail("");setNMissed("");setNGratitude("");setNStretchDone(false);
  };

  const todayMorning=morningLogs.find(l=>l.date===logDate);
  const todayNight=nightLogs.find(l=>l.date===logDate);
  const H={fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,textTransform:"uppercase"};
  const ta={background:T.inp,border:"none",borderBottom:"1px solid #333",borderRadius:0,padding:"12px 4px",color:T.text,fontFamily:"'Barlow',sans-serif",fontSize:14,outline:"none",width:"100%",minHeight:60,resize:"vertical",lineHeight:1.5};
  const numInp=(v,sv,ph,c)=>(
    <div style={{flex:1}}>
      <div style={{...H,fontSize:10,color:c,letterSpacing:"0.08em",marginBottom:5}}>{ph}</div>
      <input value={v} onChange={e=>sv(e.target.value)} placeholder="—" type="number"
        style={{background:"transparent",border:"none",borderBottom:"1px solid #333",borderRadius:0,padding:"8px 0",color:T.text,...H,fontSize:26,outline:"none",width:"100%",textAlign:"center"}}/>
    </div>
  );

  // ── HOME ──
  if(view==="home") return(
    <div style={{padding:"28px 20px"}}>
      <div style={{...H,fontSize:36,lineHeight:1,marginBottom:4}}>LOG</div>
      <div style={{color:T.sub,fontSize:11,marginBottom:32}}>Morning 07:00 · Night 21:00</div>

      <Btn label="Log Today" onClick={()=>setView("log")} style={{marginBottom:10,padding:"18px"}}/>
      <Btn label="Weekly Review" onClick={()=>setView("weekly")} ghost style={{marginBottom:10,padding:"18px"}}/>
      <Btn label="History" onClick={()=>setView("history")} ghost style={{marginBottom:10,padding:"18px"}}/>
      <Btn label="Health" onClick={()=>go("health")} ghost style={{padding:"18px"}}/>
    </div>
  );

  // ── BACK BUTTON (internal, returns to home) ──
  const InnerBack=()=>(
    <button onClick={()=>setView("home")} style={{background:"none",border:"none",color:T.sub,cursor:"pointer",fontSize:22,padding:"0 12px 0 0",lineHeight:1}}>←</button>
  );

  // ── HISTORY ──
  if(view==="history"){
    const openEdit=(log,type)=>{setEditDate(log.date+":"+type);setEditBuf({...log});};
    const closeEdit=()=>{setEditDate(null);setEditBuf({});};
    const saveMorningEdit=async()=>{
      if(!editBuf.date)return;
      await saveMorningLogs(morningLogs.map(l=>l.date===editBuf.date?{...editBuf}:l));
      closeEdit();
    };
    const saveNightEdit=async()=>{
      if(!editBuf.date)return;
      await saveNightLogs(nightLogs.map(l=>l.date===editBuf.date?{...editBuf}:l));
      closeEdit();
    };
    const numStyle={background:T.inp,border:"none",borderBottom:"1px solid #333",borderRadius:0,padding:"8px 4px",color:T.text,fontFamily:"'Barlow',sans-serif",fontSize:15,outline:"none",width:"100%",textAlign:"center"};
    const txStyle={background:T.inp,border:"none",borderBottom:"1px solid #333",borderRadius:0,padding:"10px 4px",color:T.text,fontFamily:"'Barlow',sans-serif",fontSize:13,outline:"none",width:"100%",minHeight:48,resize:"vertical",lineHeight:1.5};

    return(
    <div style={{padding:"24px 20px"}}>
      <div style={{display:"flex",alignItems:"center",marginBottom:20}}>
        <InnerBack/>
        <span style={{...H,fontSize:28,letterSpacing:"-0.02em"}}>HISTORY</span>
      </div>
      <div style={{display:"flex",borderBottom:"1px solid #222",marginBottom:20}}>
        {[["morning","🌅 MORNING"],["night","🌙 NIGHT"]].map(([f,l])=>(
          <button key={f} onClick={()=>{setFlow(f);closeEdit();}} style={{flex:1,background:"transparent",border:"none",
            borderBottom:'2px solid '+(flow===f?T.text:"transparent"),color:flow===f?T.text:T.sub,
            padding:"10px 0",marginBottom:-1,...H,fontSize:13,cursor:"pointer"}}>
            {l}
          </button>
        ))}
      </div>

      {flow==="morning"&&[...morningLogs].reverse().map(log=>{
        const isEditing=editDate===log.date+":morning";
        return(
          <div key={log.date} style={{paddingBottom:14,marginBottom:14,borderBottom:`1px solid ${T.div}`}}>
            {isEditing?(
              <div>
                <div style={{...H,fontSize:13,color:T.sub,marginBottom:10}}>{log.date}</div>
                <div style={{display:"flex",gap:8,marginBottom:8}}>
                  {[["SLEEP h","sleep"],["ENERGY /10","energy"],["MOOD /10","mood"],["HRV ms","hrv"],["RESTING HR","restingHR"]].map(([l,k])=>(
                    <div key={k} style={{flex:1}}>
                      <div style={{...H,fontSize:8,color:T.sub,marginBottom:3,letterSpacing:"0.08em"}}>{l}</div>
                      <input value={editBuf[k]||""} onChange={e=>setEditBuf(b=>({...b,[k]:parseFloat(e.target.value)||0}))} style={{...numStyle}} type="number"/>
                    </div>
                  ))}
                </div>
                <textarea value={editBuf.notes||""} onChange={e=>setEditBuf(b=>({...b,notes:e.target.value}))} placeholder="Notes..." style={{...txStyle,marginBottom:8}}/>
                <div style={{display:"flex",gap:8}}>
                  <Btn label="Save" onClick={saveMorningEdit} style={{flex:1,padding:"10px"}}/>
                  <Btn label="Cancel" onClick={closeEdit} ghost style={{flex:0.6,padding:"10px"}}/>
                </div>
              </div>
            ):(
              <div onClick={()=>openEdit(log,"morning")} style={{cursor:"pointer"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <div style={{...H,fontSize:16}}>{log.date}</div>
                  <div style={{display:"flex",gap:10,alignItems:"center"}}>
                    {[["😴",log.sleep+"h"],["⚡",log.energy],["🎯",log.mood]].map(([e,v])=>(
                      <span key={e} style={{...H,fontSize:13}}>{e}{v}</span>
                    ))}
                    <span style={{color:T.sub,fontSize:11}}>edit</span>
                  </div>
                </div>
                {log.notes&&<div style={{fontSize:12,color:T.sub}}>{log.notes}</div>}
              </div>
            )}
          </div>
        );
      })}

      {flow==="night"&&[...nightLogs].reverse().map(log=>{
        const isEditing=editDate===log.date+":night";
        return(
          <div key={log.date} style={{paddingBottom:14,marginBottom:14,borderBottom:`1px solid ${T.div}`}}>
            {isEditing?(
              <div>
                <div style={{...H,fontSize:13,color:T.sub,marginBottom:10}}>{log.date}</div>
                <div style={{display:"flex",gap:8,marginBottom:8}}>
                  {[["ENERGY /10","energy"],["MOOD /10","mood"]].map(([l,k])=>(
                    <div key={k} style={{flex:1}}>
                      <div style={{...H,fontSize:8,color:T.sub,marginBottom:3,letterSpacing:"0.08em"}}>{l}</div>
                      <input value={editBuf[k]||""} onChange={e=>setEditBuf(b=>({...b,[k]:parseInt(e.target.value)||0}))} style={{...numStyle}} type="number"/>
                    </div>
                  ))}
                </div>
                {[["Biggest win","win","#39FF14"],["Biggest fail","fail","#FF3B5C"],["Missed blocks","missed",T.sub],["Grateful for","gratitude","#FFD700"]].map(([l,k,c])=>(
                  <div key={k} style={{marginBottom:8}}>
                    <div style={{...H,fontSize:9,color:c,letterSpacing:"0.08em",marginBottom:3}}>{l.toUpperCase()}</div>
                    <textarea value={editBuf[k]||""} onChange={e=>setEditBuf(b=>({...b,[k]:e.target.value}))} style={{...txStyle}}/>
                  </div>
                ))}
                <div style={{display:"flex",gap:8,marginTop:4}}>
                  <Btn label="Save" onClick={saveNightEdit} style={{flex:1,padding:"10px"}}/>
                  <Btn label="Cancel" onClick={closeEdit} ghost style={{flex:0.6,padding:"10px"}}/>
                </div>
              </div>
            ):(
              <div onClick={()=>openEdit(log,"night")} style={{cursor:"pointer"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <div style={{...H,fontSize:16}}>{log.date}</div>
                  <div style={{display:"flex",gap:10,alignItems:"center"}}>
                    <span style={{...H,fontSize:13}}>⚡{log.energy}</span>
                    <span style={{...H,fontSize:13}}>🎯{log.mood}</span>
                    <span style={{color:T.sub,fontSize:11}}>edit</span>
                  </div>
                </div>
                {log.win&&<div style={{fontSize:12,color:"#39FF14",marginBottom:3}}>✓ {log.win}</div>}
                {log.fail&&<div style={{fontSize:12,color:"#FF3B5C",marginBottom:3}}>✗ {log.fail}</div>}
                {log.gratitude&&<div style={{fontSize:12,color:"#FFD700",marginBottom:3}}>🙏 {log.gratitude}</div>}
              </div>
            )}
          </div>
        );
      })}
    </div>
    );
  }

  // ── WEEKLY REVIEW ──
  if(view==="weekly"){
    const now=new Date();
    const weekStart=new Date(now);weekStart.setDate(now.getDate()-((now.getDay()+6)%7));
    const weekDates=Array.from({length:7},(_,i)=>{const d=new Date(weekStart);d.setDate(weekStart.getDate()+i);return d.toLocaleDateString('sv-SE');});
    const wkML=morningLogs.filter(l=>weekDates.includes(l.date));
    const wkNL=nightLogs.filter(l=>weekDates.includes(l.date));
    const wkWO=workoutLogs.filter(l=>weekDates.includes(l.date.slice(0,10)));
    const avgSleep=wkML.length?Math.round(wkML.reduce((s,l)=>s+(l.sleep||0),0)/wkML.length*10)/10:null;
    const moodLogs=wkML.filter(l=>l.mood);
    const avgMood=moodLogs.length?Math.round(moodLogs.reduce((s,l)=>s+l.mood,0)/moodLogs.length*10)/10:null;
    const enLogs=wkML.filter(l=>l.energy);
    const avgEnergy=enLogs.length?Math.round(enLogs.reduce((s,l)=>s+l.energy,0)/enLogs.length*10)/10:null;
    const wkBarber=barberDays.filter(d=>weekDates.includes(d.date));
    const barberPct=wkBarber.length?Math.round(wkBarber.reduce((s,d)=>s+(d.pct||0),0)/wkBarber.length):null;
    const gratitudes=wkNL.filter(l=>l.gratitude).map(l=>l.gratitude);
    const weekKey=weekStart.toLocaleDateString('sv-SE');
    const existing=weeklyReviews.find(r=>r.weekStart===weekKey);

    const saveReview=async()=>{
      const entry={id:weekKey,weekStart:weekKey,rating:wkRating,worked:wkWorked,didnt:wkDidnt,note:wkNote,
        auto:{workouts:wkWO.length,avgSleep,avgMood,avgEnergy,barberPct,gratitudes}};
      await saveWeeklyReviews([...weeklyReviews.filter(r=>r.weekStart!==weekKey),entry]);
      setWkSaved(true);
    };

    const sb=(label,val,color)=>(
      <div style={{flex:1,borderTop:`2px solid ${color}`,paddingTop:8}}>
        <div style={{...H,fontSize:9,color:T.sub,letterSpacing:"0.1em",marginBottom:2}}>{label}</div>
        <div style={{...H,fontSize:20,color,lineHeight:1}}>{val!==null&&val!==undefined?val:"—"}</div>
      </div>
    );
    const prevReviews=[...weeklyReviews].filter(r=>r.weekStart!==weekKey).sort((a,b)=>b.weekStart.localeCompare(a.weekStart));

    return(
      <div style={{padding:"24px 20px"}}>
        <div style={{display:"flex",alignItems:"center",marginBottom:4}}>
          <InnerBack/>
          <div style={{...H,fontSize:28}}>WEEKLY REVIEW</div>
        </div>
        <div style={{color:T.sub,fontSize:11,marginBottom:24,paddingLeft:34}}>
          {weekStart.toLocaleDateString("en-GB",{day:"numeric",month:"short"})} – {new Date(weekDates[6]+'T12:00:00').toLocaleDateString("en-GB",{day:"numeric",month:"short"})}
        </div>

        <div style={{...H,fontSize:10,color:T.sub,letterSpacing:"0.12em",marginBottom:10}}>THIS WEEK — AUTO</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
          {sb("WORKOUTS",wkWO.length,"#FF6B35")}
          {sb("AVG SLEEP",avgSleep?avgSleep+"h":null,"#7DF9FF")}
          {sb("AVG MOOD",avgMood,avgMood>=7?"#39FF14":avgMood>=5?"#FFD700":"#FF3B5C")}
          {sb("AVG ENERGY",avgEnergy,"#D0D0D0")}
          {barberPct!==null&&sb("BARBER %",barberPct+"%","#A78BFA")}
        </div>

        {gratitudes.length>0&&(
          <div style={{marginBottom:20}}>
            <div style={{...H,fontSize:10,color:T.sub,letterSpacing:"0.1em",marginBottom:8}}>GRATEFUL FOR THIS WEEK</div>
            {gratitudes.map((g,i)=>(
              <div key={i} style={{borderLeft:"2px solid #333",paddingLeft:10,marginBottom:8,color:T.sub,fontSize:13,fontStyle:"italic"}}>"{g}"</div>
            ))}
          </div>
        )}

        <Divider/>
        <div style={{...H,fontSize:10,color:T.sub,letterSpacing:"0.12em",marginBottom:10}}>WEEK RATING</div>
        <div style={{display:"flex",gap:4,marginBottom:20}}>
          {[1,2,3,4,5,6,7,8,9,10].map(n=>(
            <button key={n} onClick={()=>setWkRating(n)} style={{flex:1,padding:"9px 0",background:wkRating===n?T.text:"transparent",color:wkRating===n?T.bg:T.sub,border:`1px solid ${wkRating===n?T.text:"#222"}`,borderRadius:0,...H,fontSize:11,cursor:"pointer"}}>{n}</button>
          ))}
        </div>

        {[["WHAT WORKED",wkWorked,setWkWorked,"What went well..."],["WHAT DIDN'T",wkDidnt,setWkDidnt,"What fell short..."],["NOTE FOR NEXT WEEK",wkNote,setWkNote,"One adjustment..."]].map(([l,v,sv,ph])=>(
          <div key={l} style={{marginBottom:14}}>
            <div style={{...H,fontSize:10,color:T.sub,letterSpacing:"0.1em",marginBottom:6}}>{l}</div>
            <textarea value={v} onChange={e=>sv(e.target.value)} placeholder={ph} style={ta}/>
          </div>
        ))}
        <Btn label={wkSaved?"SAVED ✓":"SAVE REVIEW"} onClick={saveReview} style={{marginBottom:12}}/>
        <AiWeeklySummary weekData={{workouts:wkWO.length,avgSleep,avgMood,avgEnergy,barberPct,gratitudes,worked:wkWorked,didnt:wkDidnt,note:wkNote,rating:wkRating}} morningLogs={wkML} nightLogs={wkNL} workoutLogs={wkWO}/>

        {prevReviews.length>0&&(<>
          <Divider/>
          <div style={{...H,fontSize:10,color:T.sub,letterSpacing:"0.12em",marginBottom:14}}>PAST REVIEWS</div>
          {prevReviews.slice(0,6).map(r=>(
            <div key={r.id} style={{marginBottom:16,paddingBottom:16,borderBottom:`1px solid ${T.div}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <div style={{...H,fontSize:14}}>{new Date(r.weekStart+'T12:00:00').toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}</div>
                {r.rating&&<div style={{...H,fontSize:22,color:r.rating>=8?"#39FF14":r.rating>=5?"#FFD700":"#FF3B5C"}}>{r.rating}/10</div>}
              </div>
              {r.auto&&<div style={{display:"flex",gap:8,marginBottom:8}}>
                {[["WO",r.auto.workouts,"#FF6B35"],["SLEEP",r.auto.avgSleep?r.auto.avgSleep+"h":"—","#7DF9FF"],["MOOD",r.auto.avgMood,"#D0D0D0"]].map(([l,v,c])=>(
                  <div key={l} style={{flex:1,borderTop:`1px solid ${c}`,paddingTop:5}}>
                    <div style={{...H,fontSize:8,color:"#444",letterSpacing:"0.1em"}}>{l}</div>
                    <div style={{...H,fontSize:16,color:c}}>{v||"—"}</div>
                  </div>
                ))}
              </div>}
              {r.worked&&<div style={{color:T.sub,fontSize:12,marginBottom:3}}>✓ {r.worked}</div>}
              {r.note&&<div style={{color:"#444",fontSize:11}}>→ {r.note}</div>}
            </div>
          ))}
        </>)}
      </div>
    );
  }
  // ── LOG ──
  return(
    <div style={{padding:"24px 20px"}}>
      {/* Low sleep alert — compact overlay */}
      {lowSleepAlert&&(()=>{
        const lastSleepVal=morningLogs.find(l=>l.date===logDate)?.sleep||0;
        const severe=lastSleepVal>0&&lastSleepVal<6;
        return(
          <div onClick={()=>setLowSleepAlert(false)} style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.85)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:"24px",cursor:"pointer"}}>
            <div style={{background:"#111",border:`1px solid ${severe?"#FFB800":"#FF3B5C"}`,padding:"20px 24px",maxWidth:320,width:"100%"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:10,color:severe?"#FFB800":"#FF3B5C",letterSpacing:"0.2em",marginBottom:10}}>⚠ SLEEP ALERT</div>
              {severe?(
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:17,color:"#fff",lineHeight:1.25,letterSpacing:"0.01em"}}>SLEEP UNDER 6HRS — NO WEIGHTS TODAY. BIKE CARDIO ONLY · BE CONSCIOUS OF YOUR MOOD TODAY</div>
              ):(
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:17,color:"#fff",lineHeight:1.25,letterSpacing:"0.01em"}}>SLEEP UNDER 8HRS — ALL WORKOUTS AT 70% OF MAX WEIGHT AND ALL SETS X2 · BE CONSCIOUS OF YOUR MOOD TODAY</div>
              )}
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,color:"#444",letterSpacing:"0.1em",marginTop:14}}>TAP TO DISMISS</div>
            </div>
          </div>
        );
      })()}
      <div style={{display:"flex",alignItems:"center",marginBottom:16}}>
        <InnerBack/>
        <div style={{flex:1}}>
          <div style={{...H,fontSize:28,letterSpacing:"-0.02em"}}>{logDate===todayStr()?"LOG TODAY":"LOG DAY"}</div>
        </div>
      </div>
      <MiniCalendar value={logDate} onChange={setLogDate}/>
      {/* Morning / Night tab */}
      <div style={{display:"flex",borderBottom:"1px solid #222",marginBottom:24}}>
        {[["morning","🌅 MORNING"],["night","🌙 NIGHT"]].map(([f,l])=>(
          <button key={f} onClick={()=>setFlow(f)} style={{flex:1,background:"transparent",border:"none",
            borderBottom:'2px solid '+(flow===f?T.text:"transparent"),color:flow===f?T.text:T.sub,
            padding:"10px 0",marginBottom:-1,...H,fontSize:13,cursor:"pointer"}}>
            {l}
          </button>
        ))}
      </div>

      {flow==="morning"&&(
        <>

          {todayMorning&&(
            <div style={{borderLeft:"3px solid #39FF14",paddingLeft:12,marginBottom:16,fontSize:12,color:"#39FF14",...H}}>
              ✓ MORNING LOGGED · Sleep {todayMorning.sleep}h · E{todayMorning.energy} M{todayMorning.mood}
            </div>
          )}
          <div style={{marginBottom:16,paddingBottom:16,borderBottom:'1px solid '+T.div}}>
            <div style={{...H,fontSize:10,color:T.sub,letterSpacing:"0.1em",marginBottom:6}}>TODAY'S VERSE</div>
            <div style={{fontSize:13,color:T.sub,fontStyle:"italic",lineHeight:1.6}}>"{verse.t}"</div>
            <div style={{...H,fontSize:11,color:T.text,marginTop:4}}>{verse.ref}</div>
          </div>
          <div style={{display:"flex",gap:10,marginBottom:16}}>
            {/* Sleep: bedtime + wake → auto-calculated */}
            <div style={{background:T.inp,borderBottom:"1px solid #333",padding:"10px 8px",marginBottom:8}}>
              <div style={{...H,fontSize:9,color:"#7DF9FF",letterSpacing:"0.1em",marginBottom:6}}>SLEEP</div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <div style={{flex:1}}>
                  <div style={{...H,fontSize:8,color:T.sub,marginBottom:3}}>BED</div>
                  <input type="time" value={mBedtime} onChange={e=>setMBedtime(e.target.value)}
                    style={{background:"transparent",border:"none",borderBottom:"1px solid #333",padding:"4px 0",color:T.text,...H,fontSize:14,outline:"none",width:"100%"}}/>
                </div>
                <div style={{flex:1}}>
                  <div style={{...H,fontSize:8,color:T.sub,marginBottom:3}}>WAKE</div>
                  <input type="time" value={mWakeTime} onChange={e=>setMWakeTime(e.target.value)}
                    style={{background:"transparent",border:"none",borderBottom:"1px solid #333",padding:"4px 0",color:T.text,...H,fontSize:14,outline:"none",width:"100%"}}/>
                </div>
                <div style={{flexShrink:0,textAlign:"right",paddingTop:12}}>
                  <div style={{...H,fontSize:22,color:"#7DF9FF",lineHeight:1}}>{calcSleepHrs(mBedtime,mWakeTime)||"—"}</div>
                  <div style={{...H,fontSize:8,color:T.sub}}>HRS</div>
                </div>
              </div>
            </div>
            {numInp(mEnergy,setMEnergy,"ENERGY /10","#39FF14")}
            <div style={{display:"flex",gap:10,alignItems:"flex-end"}}>
              {numInp(mMood,setMMood,"MOOD /10","#FF6B35")}
              <div style={{flex:1}}>
                <div style={{...H,fontSize:10,color:T.sub,letterSpacing:"0.1em",marginBottom:6}}>MOOD WORD</div>
                <select value={mMoodWord} onChange={e=>setMMoodWord(e.target.value)} style={{width:"100%",padding:"8px 12px",background:"#1a1a1a",border:`1px solid ${T.div}`,color:T.text,borderRadius:"4px",fontFamily:"inherit",fontSize:13,cursor:"pointer"}}>
                  <option value="">—</option>
                  <option value="energized">Energized</option>
                  <option value="happy">Happy</option>
                  <option value="excited">Excited</option>
                  <option value="motivated">Motivated</option>
                  <option value="content">Content</option>
                  <option value="calm">Calm</option>
                  <option value="focused">Focused</option>
                  <option value="neutral">Neutral</option>
                  <option value="bored">Bored</option>
                  <option value="tired">Tired</option>
                  <option value="stressed">Stressed</option>
                  <option value="anxious">Anxious</option>
                  <option value="overwhelmed">Overwhelmed</option>
                  <option value="frustrated">Frustrated</option>
                  <option value="irritable">Irritable</option>
                  <option value="angry">Angry</option>
                  <option value="sad">Sad</option>
                  <option value="lonely">Lonely</option>
                </select>
              </div>
            </div>
          </div>
          <div style={{marginBottom:16}}>
            <div style={{...H,fontSize:10,color:T.sub,letterSpacing:"0.1em",marginBottom:6}}>NOTES</div>
            <textarea value={mNotes} onChange={e=>setMNotes(e.target.value)} placeholder="Anything on your mind..." style={ta}/>
          </div>
          <div style={{marginBottom:16,paddingTop:12,borderTop:`1px solid ${T.div}`}}>
            <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:13,color:T.text}}>
              <input type="checkbox" checked={mStretchDone} onChange={(e)=>setMStretchDone(e.target.checked)} style={{cursor:"pointer",width:16,height:16}}/>
              <span>Stretches / Mobility done</span>
            </label>
          </div>
          <Btn label="Save Morning Log" onClick={saveMorning}/>
        </>
      )}

      {flow==="night"&&(
        <>
          {todayNight&&(
            <div style={{borderLeft:"3px solid #39FF14",paddingLeft:12,marginBottom:16,fontSize:12,color:"#39FF14",...H}}>
              ✓ NIGHT LOGGED · E{todayNight.energy} M{todayNight.mood}
            </div>
          )}
          <div style={{display:"flex",gap:10,marginBottom:16}}>
            {numInp(nEnergy,setNEnergy,"ENERGY /10","#39FF14")}
            <div style={{flex:1,display:"flex",gap:10,alignItems:"flex-end"}}>
              {numInp(nMood,setNMood,"MOOD /10","#FF6B35")}
              <div style={{flex:1}}>
                <div style={{...H,fontSize:10,color:T.sub,letterSpacing:"0.1em",marginBottom:6}}>MOOD WORD</div>
                <select value={nMoodWord} onChange={e=>setNMoodWord(e.target.value)} style={{width:"100%",padding:"8px 12px",background:"#1a1a1a",border:`1px solid ${T.div}`,color:T.text,borderRadius:"4px",fontFamily:"inherit",fontSize:13,cursor:"pointer"}}>
                  <option value="">—</option>
                  <option value="energized">Energized</option>
                  <option value="happy">Happy</option>
                  <option value="excited">Excited</option>
                  <option value="motivated">Motivated</option>
                  <option value="content">Content</option>
                  <option value="calm">Calm</option>
                  <option value="focused">Focused</option>
                  <option value="neutral">Neutral</option>
                  <option value="bored">Bored</option>
                  <option value="tired">Tired</option>
                  <option value="stressed">Stressed</option>
                  <option value="anxious">Anxious</option>
                  <option value="overwhelmed">Overwhelmed</option>
                  <option value="frustrated">Frustrated</option>
                  <option value="irritable">Irritable</option>
                  <option value="angry">Angry</option>
                  <option value="sad">Sad</option>
                  <option value="lonely">Lonely</option>
                </select>
              </div>
            </div>
          </div>
          {[["BIGGEST WIN",nWin,setNWin,"What went right..."],["BIGGEST FAIL",nFail,setNFail,"Honest assessment..."],["MISSED BLOCKS",nMissed,setNMissed,"What got skipped..."],["GRATEFUL FOR",nGratitude,setNGratitude,"One thing from today..."]].map(([l,v,sv,ph])=>(
            <div key={l} style={{marginBottom:12}}>
              <div style={{...H,fontSize:10,color:T.sub,letterSpacing:"0.1em",marginBottom:6}}>{l}</div>
              <textarea value={v} onChange={e=>sv(e.target.value)} placeholder={ph} style={ta}/>
            </div>
          ))}
          <div style={{marginBottom:16,paddingTop:12,borderTop:`1px solid ${T.div}`}}>
            <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:13,color:T.text}}>
              <input type="checkbox" checked={nStretchDone} onChange={(e)=>setNStretchDone(e.target.checked)} style={{cursor:"pointer",width:16,height:16}}/>
              <span>Stretches / Mobility done</span>
            </label>
          </div>
          <Btn label="Save Night Log" onClick={saveNight}/>
        </>
      )}
    </div>
  );
}


// ─── HEALTH HEALTH ───────────────────────────────────────────────────────────────────
function HealthScreen(){
  const {T,morningLogs,nightLogs,workoutLogs,goals,apiKey,ghealthConnected,ghealthSyncing,ghealthError,ghealthDebug,ghealthSyncToday,ghealthSyncWeek,ghealthDoConnect,ghealthDoDisconnect}=useContext(Ctx);
  const [period,setPeriod]=useState(30);
  const [insights,setInsights]=useState(null);
  const [aiLoading,setAiLoading]=useState(false);
  const [weekSyncResult,setWeekSyncResult]=useState(null);
  const H={fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,textTransform:"uppercase"};

  // Filter + sort logs for period
  const cutoff=new Date();cutoff.setDate(cutoff.getDate()-period);
  const cutStr=cutoff.toISOString().split('T')[0];
  const ml=[...morningLogs].filter(l=>period===9999||l.date>=cutStr).sort((a,b)=>a.date.localeCompare(b.date));
  const nl=[...nightLogs].filter(l=>period===9999||l.date>=cutStr).sort((a,b)=>a.date.localeCompare(b.date));

  // Chart data
  const chartData=ml.map(l=>({
    date:new Date(l.date+'T12:00:00').toLocaleDateString("en-GB",{day:"numeric",month:"short"}),
    sleep:l.sleep, energy:l.energy, mood:l.mood,
    restingHR:l.restingHR||null, hrv:l.hrv||null,
    deep:l.sleepStages?.deep||null, rem:l.sleepStages?.rem||null,
    light:l.sleepStages?.light||null, awake:l.sleepStages?.awake||null,
  }));
  // Subset with at least one RHR/HRV/stage point, for charts that shouldn't render on all-null data
  const rhrData=chartData.filter(d=>d.restingHR!=null);
  const hrvData=chartData.filter(d=>d.hrv!=null);
  const stagesData=chartData.filter(d=>d.deep!=null||d.rem!=null||d.light!=null||d.awake!=null);

  // Linear regression helper
  const linReg=vals=>{
    const n=vals.length; if(n<3)return null;
    const sx=vals.reduce((_,__,i)=>_+i,0);
    const sy=vals.reduce((a,v)=>a+v,0);
    const sxy=vals.reduce((a,v,i)=>a+i*v,0);
    const sx2=vals.reduce((a,_,i)=>a+i*i,0);
    const m=(n*sxy-sx*sy)/(n*sx2-sx*sx||1);
    const b=(sy-m*sx)/n;
    return{m,b,p:x=>Math.max(0,Math.round((m*x+b)*10)/10)};
  };

  // Forecast: extend 5 days
  const sleepVals=ml.map(l=>l.sleep);
  const reg=linReg(sleepVals);
  const forecastData=reg?[...chartData.map((d,i)=>({...d,trend:reg.p(i)})),
    ...[1,2,3,4,5].map(i=>({date:'+'+i+'d',sleep:null,energy:null,mood:null,trend:reg.p(sleepVals.length-1+i)}))]:chartData;
  const trendDir=reg?(reg.m>0.02?"↑ improving":reg.m<-0.02?"↓ declining":"→ stable"):"";

  // Correlation: sleep → next-day mood/energy
  const pairs=ml.map((l,i,a)=>{const nx=a[i+1];return nx?{sleep:l.sleep,mood:nx.mood,energy:nx.energy}:null;}).filter(Boolean);
  // Find optimal threshold: test multiple cutoffs, pick the one with biggest mood gap
  const findThreshold=(pairs,metric)=>{
    const thresholds=[5,5.5,6,6.5,7,7.5,8,8.5];
    let best={t:7,gap:0,lowAvg:0,hiAvg:0,lowN:0,hiN:0};
    thresholds.forEach(t=>{
      const lo=pairs.filter(p=>p.sleep<t); const hi=pairs.filter(p=>p.sleep>=t);
      if(lo.length<2||hi.length<2)return;
      const loAvg=lo.reduce((s,p)=>s+p[metric],0)/lo.length;
      const hiAvg=hi.reduce((s,p)=>s+p[metric],0)/hi.length;
      const gap=Math.abs(hiAvg-loAvg);
      if(gap>best.gap)best={t,gap,lowAvg:loAvg,hiAvg:hiAvg,lowN:lo.length,hiN:hi.length};
    });
    return best;
  };
  const moodThresh=findThreshold(pairs,'mood');
  const enThresh=findThreshold(pairs,'energy');
  const moodLow=moodThresh.gap>0?moodThresh.lowAvg.toFixed(1):null;
  const moodHi=moodThresh.gap>0?moodThresh.hiAvg.toFixed(1):null;
  const enLow=enThresh.gap>0?enThresh.lowAvg.toFixed(1):null;
  const enHi=enThresh.gap>0?enThresh.hiAvg.toFixed(1):null;

  // Avg stats
  const avg=(arr,key)=>arr.length?(arr.reduce((s,l)=>s+(l[key]||0),0)/arr.length).toFixed(1):"—";

  const getInsights=async()=>{
    if(ml.length<5){setInsights([{type:"warning",title:"Not enough data",body:"Log at least 5 mornings before running the analysis."}]);return;}
    setAiLoading(true);setInsights(null);
    try{
      // ── Calendar tick history ────────────────────────────────────────────────
      const tickHistory=[];
      for(let i=0;i<30;i++){
        const d=new Date();d.setDate(d.getDate()-i);
        const ds=d.toLocaleDateString('sv-SE');
        try{const r=await window.storage.get('k3_ticks_'+ds);if(r)tickHistory.push({date:ds,ticks:JSON.parse(r.value)});}catch{}
      }
      // Per-event completion rate
      const evStats={};
      tickHistory.forEach(day=>{Object.entries(day.ticks||{}).forEach(([key,done])=>{
        const name=key.includes('_')?key.slice(0,key.lastIndexOf('_')):key;
        const slot=key.includes('_')?key.slice(key.lastIndexOf('_')+1):'';
        const label=slot?name+' ('+slot+')':name;
        if(!evStats[label])evStats[label]={done:0,total:0};evStats[label].total++;if(done)evStats[label].done++;
      });});
      const calCompletion=Object.entries(evStats).filter(([_,v])=>v.total>=3).map(([name,v])=>({name,pct:Math.round(v.done/v.total*100),n:v.total})).sort((a,b)=>a.pct-b.pct);

      // ── Sleep variance (7-day rolling std dev) ───────────────────────────────
      const sortedMl=[...ml].sort((a,b)=>new Date(a.date)-new Date(b.date));
      const sleepVar=[];
      for(let i=6;i<sortedMl.length;i++){
        const wk=sortedMl.slice(i-6,i+1).map(l=>l.sleep).filter(s=>s>0);
        if(wk.length<5)continue;
        const mean=wk.reduce((s,v)=>s+v,0)/wk.length;
        const std=Math.sqrt(wk.reduce((s,v)=>s+(v-mean)**2,0)/wk.length);
        sleepVar.push({date:sortedMl[i].date,stdDev:Math.round(std*10)/10,avgSleep:Math.round(mean*10)/10,mood:sortedMl[i].mood,energy:sortedMl[i].energy});
      }

      // ── Sleep → next-day calendar completion ─────────────────────────────────
      const sleepVsCompletion=[];
      sortedMl.forEach(log=>{
        const nd=new Date(log.date+'T12:00:00');nd.setDate(nd.getDate()+1);
        const nds=nd.toLocaleDateString('sv-SE');
        const nday=tickHistory.find(d=>d.date===nds);if(!nday)return;
        const tks=Object.values(nday.ticks||{});if(!tks.length)return;
        sleepVsCompletion.push({sleep:log.sleep,nextDayPct:Math.round(tks.filter(Boolean).length/tks.length*100)});
      });

      // ── Workout day vs rest day → calendar completion ────────────────────────
      const woDates=new Set(workoutLogs.map(l=>l.date.slice(0,10)));
      const woPcts=[],restPcts=[];
      tickHistory.forEach(day=>{
        const tks=Object.values(day.ticks||{});if(!tks.length)return;
        const pct=Math.round(tks.filter(Boolean).length/tks.length*100);
        (woDates.has(day.date)?woPcts:restPcts).push(pct);
      });
      const woAvg=woPcts.length?Math.round(woPcts.reduce((s,v)=>s+v,0)/woPcts.length):null;
      const restAvg=restPcts.length?Math.round(restPcts.reduce((s,v)=>s+v,0)/restPcts.length):null;

      // ── Workout difficulty → next-day calendar completion ────────────────────
      const diffVsCompletion=[];
      workoutLogs.filter(l=>l.difficulty).forEach(log=>{
        const nd=new Date(log.date.slice(0,10)+'T12:00:00');nd.setDate(nd.getDate()+1);
        const nds=nd.toLocaleDateString('sv-SE');
        const nday=tickHistory.find(d=>d.date===nds);if(!nday)return;
        const tks=Object.values(nday.ticks||{});if(!tks.length)return;
        diffVsCompletion.push({difficulty:log.difficulty,nextDayPct:Math.round(tks.filter(Boolean).length/tks.length*100)});
      });


      // ── Sleep → session difficulty ───────────────────────────────────────────
      const sleepVsDifficulty=workoutLogs.filter(l=>l.difficulty).map(log=>{
        const logDate=log.date.slice(0,10);
        const mlog=sortedMl.find(m=>m.date===logDate);
        if(!mlog||!mlog.sleep)return null;
        return{sleep:mlog.sleep,difficulty:log.difficulty,date:logDate};
      }).filter(Boolean);

      // ── Sleep → which specific events get skipped (raw pairs, no binary split) ─
      const sleepEventRaw={};
      tickHistory.forEach(day=>{
        const mlog=sortedMl.find(m=>m.date===day.date);
        if(!mlog||!mlog.sleep)return;
        Object.entries(day.ticks||{}).forEach(([key,done])=>{
          const name=key.includes('_')?key.slice(0,key.lastIndexOf('_')):key;
          if(!sleepEventRaw[name])sleepEventRaw[name]=[];
          sleepEventRaw[name].push({s:Math.round(mlog.sleep*2)/2,d:done?1:0}); // round to nearest 0.5h
        });
      });
      // Aggregate per event per sleep-hour bucket so Claude sees the distribution
      const sleepVsEvents=Object.entries(sleepEventRaw)
        .filter(([_,pairs])=>pairs.length>=4)
        .map(([name,pairs])=>{
          const byHour={};
          pairs.forEach(p=>{if(!byHour[p.s])byHour[p.s]={d:0,t:0};byHour[p.s].t++;if(p.d)byHour[p.s].d++;});
          const dist=Object.entries(byHour)
            .sort(([a],[b])=>parseFloat(a)-parseFloat(b))
            .map(([h,v])=>({h:parseFloat(h),pct:Math.round(v.d/v.t*100),n:v.t}));
          return{name,dist,total:pairs.length};
        });

      // ── Sleep → exercise weight & RPE ────────────────────────────────────────
      const exSleepData={};
      workoutLogs.forEach(log=>{
        const logDate=log.date.slice(0,10);
        const mlog=sortedMl.find(m=>m.date===logDate);
        if(!mlog||!mlog.sleep)return;
        Object.entries(log.sets||{}).forEach(([exId,sets])=>{
          const exName=log.exerciseNames?.[exId];if(!exName)return;
          const filled=(sets||[]).filter(s=>s.weight&&s.reps);if(!filled.length)return;
          const avgW=filled.reduce((s,x)=>s+parseFloat(x.weight),0)/filled.length;
          const rpeSet=filled.filter(s=>s.rpe);
          const avgRPE=rpeSet.length?rpeSet.reduce((s,x)=>s+parseFloat(x.rpe),0)/rpeSet.length:null;
          if(!exSleepData[exName])exSleepData[exName]=[];
          exSleepData[exName].push({sleep:mlog.sleep,avgW:Math.round(avgW*10)/10,avgRPE:avgRPE?Math.round(avgRPE*10)/10:null});
        });
      });
      const sleepVsExercise=Object.entries(exSleepData)
        .filter(([_,sess])=>sess.length>=3)
        .map(([name,sess])=>{
          const lo=sess.filter(s=>s.sleep<7),hi=sess.filter(s=>s.sleep>=7);
          if(!lo.length||!hi.length)return null;
          const loW=Math.round(lo.reduce((s,x)=>s+x.avgW,0)/lo.length*10)/10;
          const hiW=Math.round(hi.reduce((s,x)=>s+x.avgW,0)/hi.length*10)/10;
          const loR=lo.filter(s=>s.avgRPE!==null),hiR=hi.filter(s=>s.avgRPE!==null);
          const loRPE=loR.length?Math.round(loR.reduce((s,x)=>s+x.avgRPE,0)/loR.length*10)/10:null;
          const hiRPE=hiR.length?Math.round(hiR.reduce((s,x)=>s+x.avgRPE,0)/hiR.length*10)/10:null;
          return{name,lowSleepAvgW:loW,highSleepAvgW:hiW,weightDiff:Math.round((hiW-loW)*10)/10,lowSleepRPE:loRPE,highSleepRPE:hiRPE,n:sess.length};
        })
        .filter(Boolean)
        .sort((a,b)=>Math.abs(b.weightDiff)-Math.abs(a.weightDiff));

      // ── Mood → session difficulty ─────────────────────────────────────────────
      const moodVsDifficulty=workoutLogs.filter(l=>l.difficulty).map(log=>{
        const logDate=log.date.slice(0,10);
        const mlog=sortedMl.find(m=>m.date===logDate);
        if(!mlog||!mlog.mood)return null;
        return{mood:mlog.mood,difficulty:log.difficulty};
      }).filter(Boolean);

      // ── Mood → general productivity (overall completion %) ────────────────────
      const moodVsProductivity=sortedMl.map(log=>{
        const day=tickHistory.find(d=>d.date===log.date);
        if(!day||!log.mood)return null;
        const tks=Object.values(day.ticks||{});if(!tks.length)return null;
        return{mood:log.mood,pct:Math.round(tks.filter(Boolean).length/tks.length*100)};
      }).filter(Boolean);

      // ── Mood → school/study events ────────────────────────────────────────────
      const SCHOOL_KW=['exam','eksamen','study','iø','ej','erhvervs','økonomi','recall','school','skole','lektier','prep'];
      const moodVsSchool=sortedMl.map(log=>{
        const day=tickHistory.find(d=>d.date===log.date);
        if(!day||!log.mood)return null;
        const schoolTks=Object.entries(day.ticks||{}).filter(([k])=>SCHOOL_KW.some(kw=>k.toLowerCase().includes(kw)));
        if(!schoolTks.length)return null;
        const pct=Math.round(schoolTks.filter(([_,d])=>d).length/schoolTks.length*100);
        return{mood:log.mood,schoolPct:pct,n:schoolTks.length};
      }).filter(Boolean);

      // ── Mood → completion on workout days ─────────────────────────────────────
      const woDatesArr=[...woDates];
      const moodVsWorkoutDayCompletion=sortedMl.map(log=>{
        if(!woDates.has(log.date)||!log.mood)return null;
        const day=tickHistory.find(d=>d.date===log.date);
        if(!day)return null;
        const tks=Object.values(day.ticks||{});if(!tks.length)return null;
        return{mood:log.mood,pct:Math.round(tks.filter(Boolean).length/tks.length*100)};
      }).filter(Boolean);

      // ── Mood → completion on barbershop days (detected by event name) ─────────
      const BARBER_KW=['barber','blend','client','haircut','beard','klip'];
      const moodVsBarberDayCompletion=sortedMl.map(log=>{
        const day=tickHistory.find(d=>d.date===log.date);
        if(!day||!log.mood)return null;
        const isBarberDay=Object.keys(day.ticks||{}).some(k=>BARBER_KW.some(kw=>k.toLowerCase().includes(kw)));
        if(!isBarberDay)return null;
        const tks=Object.values(day.ticks||{});if(!tks.length)return null;
        return{mood:log.mood,pct:Math.round(tks.filter(Boolean).length/tks.length*100)};
      }).filter(Boolean);

      // ── Goal pace analysis ────────────────────────────────────────────────────
      const today=new Date();
      const yearEnd=new Date('2026-12-31');
      const daysLeft=Math.round((yearEnd-today)/(1000*60*60*24));
      const goalPace=(goals||[]).map(g=>({
        name:g.name,current:g.current,target:g.target,unit:g.unit||'',
        pctDone:g.target>0?Math.round(g.current/g.target*100):0,
        daysLeft
      }));
      const payload=JSON.stringify({
        morning:sortedMl.map(l=>({d:l.date,s:l.sleep,e:l.energy,m:l.mood,rhr:l.restingHR||null,hrv:l.hrv||null,deepMin:l.sleepStages?.deep||null,remMin:l.sleepStages?.rem||null,lightMin:l.sleepStages?.light||null,awakeMin:l.sleepStages?.awake||null})),
        night:nl.map(l=>({d:l.date,e:l.energy,m:l.mood,w:l.win,f:l.fail})),
        calendarCompletion:calCompletion,
        sleepVariance:sleepVar,
        sleepVsNextDayCompletion:sleepVsCompletion,
        workoutVsRestDayCompletion:{workoutDayAvg:woAvg,restDayAvg:restAvg,workoutDays:woPcts.length,restDays:restPcts.length},
        difficultyVsNextDayCompletion:diffVsCompletion,
        sleepVsSessionDifficulty:sleepVsDifficulty,
        sleepVsEventCompletion:sleepVsEvents,
        sleepVsExercisePerformance:sleepVsExercise,
        moodVsSessionDifficulty:moodVsDifficulty,
        moodVsGeneralProductivity:moodVsProductivity,
        moodVsSchoolCompletion:moodVsSchool,
        moodVsWorkoutDayCompletion:moodVsWorkoutDayCompletion,
        moodVsBarberDayCompletion:moodVsBarberDayCompletion,
        goalPace:goalPace
      });
      const txt=await aiPost(apiKey,{max_tokens:1800,system:"You are a personal performance analyst. Return ONLY a valid JSON array of 8-10 insights, no duplicates. Each: {type:'correlation'|'trend'|'warning'|'positive'|'calendar'|'workout'|'goal', title:'max 5 words', body:'1-2 sentences, exact numbers only — sleep hours, mood scores, percentages, weights, RPE.'}. Cover in priority order: (1) mood vs session difficulty — does mood score predict how hard the session feels?, (2) mood vs general productivity — at what mood level does overall calendar completion drop?, (3) mood vs school/study event completion specifically — is there a threshold?, (4) mood vs completion on workout days — does mood affect how much gets done after training?, (5) mood vs completion on barbershop days — does mood affect post-work productivity?, (6) sleep vs session difficulty — does low sleep make sessions harder or weaker?, (7) for each event in sleepVsEventCompletion find the actual sleep threshold where completion drops — do not assume 7h for all, name the event and threshold, (8) which exercises show biggest weight drop or RPE increase on low-sleep days, (9) session difficulty → next-day calendar completion, (10) goal pace — look at each goal's pctDone and daysLeft. If any goal is ahead of pace to hit the Dec 31 2026 target early, do NOT just say 'consider raising it' — tell the user they are sandbagging and their target is too soft, then give a specific significantly higher number they should actually be aiming for. (11) resting heart rate trend — is rhr in the morning data trending up or down over the period, and does it correlate with sleep hours or session difficulty the day before? Elevated RHR after hard sessions or low sleep is a recovery signal worth flagging. (12) HRV trend — is hrv declining over time (a sign of accumulated fatigue/overtraining) or stable/rising? Does it dip after specific session types or low-sleep nights? (13) sleep stage composition — is deep sleep or REM minutes trending down even if total sleep hours look fine? Flag if total hours are stable but deep/REM share is shrinking, since that's a hidden recovery problem total hours alone won't show. Be direct, no softening.",
        messages:[{role:"user",content:"Analyze: "+payload}]
      });
      setInsights(JSON.parse(txt.replace(/```json|```/g,"").trim()));
    }catch(e){setInsights([{type:"warning",title:"Analysis failed",body:"Could not reach the AI. Try again."}]);}
    setAiLoading(false);
  };

  const [schedSuggestions,setSchedSuggestions]=useState(null);
  const [schedLoading,setSchedLoading]=useState(false);
  const getSchedule=async()=>{
    setSchedLoading(true);
    try{
      const pairs=ml.map(l=>({date:l.date,sleep:l.sleep,energy:l.energy,mood:l.mood}));
      const txt=await aiPost(apiKey,{max_tokens:500,system:"You are a performance analyst. Based on mood/energy/sleep patterns, give 3 specific schedule suggestions in plain text — e.g. 'Schedule hard cognitive work (study, EJ prep) in the morning on days after 7h+ sleep based on your energy data.' Be specific with numbers from the data. No padding.",
        messages:[{role:"user",content:"Analyse patterns and suggest optimal schedule windows: "+JSON.stringify(pairs)}]
      });
      setSchedSuggestions(txt);
    }catch{setSchedSuggestions("Could not reach AI.");}
    setSchedLoading(false);
  };

  const insightColor={correlation:"#7DF9FF",trend:"#FFD700",warning:"#FF3B5C",positive:"#39FF14",calendar:"#A78BFA",workout:"#FF6B35"};
  const TT={contentStyle:{background:"#1A1A1A",border:"none",borderRadius:0,color:"#fff",fontSize:11}};

  return(
    <div style={{padding:"24px 20px"}}>
      <PageHeader title="HEALTH"/>

      {/* Google Health connect card */}
      <div style={{background:T.card,padding:"14px 16px",marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:ghealthConnected?10:0}}>
          <div>
            <div style={{...H,fontSize:13}}>GOOGLE HEALTH</div>
            <div style={{color:T.sub,fontSize:11,marginTop:2}}>{ghealthConnected?"Connected · Fitbit Charge 6":"Sync sleep, HRV, resting HR automatically"}</div>
          </div>
          {ghealthConnected?(
            <button onClick={ghealthDoDisconnect} style={{background:"transparent",border:`1px solid ${T.div}`,color:T.sub,padding:"7px 12px",borderRadius:2,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,cursor:"pointer"}}>DISCONNECT</button>
          ):(
            <button onClick={ghealthDoConnect} style={{background:"#3B82F6",border:"none",color:"#000",padding:"7px 14px",borderRadius:2,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:11,cursor:"pointer"}}>CONNECT</button>
          )}
        </div>
        {ghealthConnected&&(
          <div style={{display:"flex",gap:8}}>
            <button onClick={ghealthSyncToday} disabled={ghealthSyncing} style={{flex:1,background:"transparent",border:`1px solid ${T.div}`,color:T.text,padding:"9px 0",borderRadius:2,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,letterSpacing:"0.04em",cursor:ghealthSyncing?"default":"pointer",opacity:ghealthSyncing?0.5:1}}>
              {ghealthSyncing?"SYNCING…":"SYNC TODAY"}
            </button>
            <button onClick={async()=>{setWeekSyncResult(null);const r=await ghealthSyncWeek();if(r)setWeekSyncResult(r);}} disabled={ghealthSyncing} style={{flex:1,background:"transparent",border:`1px solid ${T.div}`,color:T.text,padding:"9px 0",borderRadius:2,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,letterSpacing:"0.04em",cursor:ghealthSyncing?"default":"pointer",opacity:ghealthSyncing?0.5:1}}>
              {ghealthSyncing?"SYNCING…":"SYNC THIS WEEK"}
            </button>
          </div>
        )}
        {weekSyncResult&&<div style={{color:"#39FF14",fontSize:11,marginTop:8}}>Filled {weekSyncResult} day{weekSyncResult===1?"":"s"} from the past week</div>}
        {ghealthError&&<div style={{color:"#FF3B5C",fontSize:11,marginTop:8}}>{ghealthError}</div>}
        {ghealthDebug&&<div style={{color:"#555",fontSize:10,marginTop:8,fontFamily:"monospace",wordBreak:"break-all"}}>DEBUG: {JSON.stringify(ghealthDebug)}</div>}
      </div>

      {/* Period selector */}
      <div style={{display:"flex",borderBottom:"1px solid #222",marginBottom:20}}>
        {[[14,"14D"],[30,"30D"],[9999,"ALL"]].map(([p,l])=>(
          <button key={p} onClick={()=>setPeriod(p)} style={{flex:1,background:"transparent",border:"none",
            borderBottom:'2px solid '+(period===p?T.text:"transparent"),color:period===p?T.text:T.sub,
            padding:"10px 0",marginBottom:-1,...H,fontSize:13,cursor:"pointer"}}>{l}</button>
        ))}
      </div>

      {ml.length===0?(
        <div style={{color:T.sub,...H,fontSize:14,textAlign:"center",padding:"40px 0"}}>NO DATA YET — START LOGGING MORNINGS</div>
      ):(
        <>
          {/* Avg stats */}
          <div style={{display:"flex",gap:10,marginBottom:20}}>
            {[["AVG SLEEP",avg(ml,"sleep")+"h","#7DF9FF"],["AVG ENERGY",avg(ml,"energy")+"/10","#39FF14"],["AVG MOOD",avg(ml,"mood")+"/10","#FF6B35"]].map(([l,v,c])=>(
              <div key={l} style={{flex:1,borderTop:'2px solid '+c,paddingTop:10}}>
                <div style={{...H,fontSize:9,color:T.sub,letterSpacing:"0.1em",marginBottom:4}}>{l}</div>
                <div style={{...H,fontSize:22,color:c,lineHeight:1}}>{v}</div>
              </div>
            ))}
          </div>

          {/* Sleep chart with trend + 5d forecast */}
          {forecastData.length>1&&(
            <div style={{background:T.card,padding:"16px 8px 8px",marginBottom:20}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingLeft:10,marginBottom:8}}>
                <div style={{...H,fontSize:10,color:"#555",letterSpacing:"0.1em"}}>SLEEP (h)</div>
                {reg&&<div style={{...H,fontSize:10,color:reg.m>0.02?"#39FF14":reg.m<-0.02?"#FF3B5C":"#555"}}>{trendDir}</div>}
              </div>
              <ResponsiveContainer width="100%" height={190}>
                <LineChart data={forecastData}>
                  <XAxis dataKey="date" tick={{fill:"#555",fontSize:9}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false} width={28}/>
                  <Tooltip {...TT}/>
                  <Line type="monotone" dataKey="sleep" stroke="#7DF9FF" strokeWidth={2.5} dot={{fill:"#7DF9FF",r:3}} activeDot={{r:5}} connectNulls={false}/>
                  {reg&&<Line type="monotone" dataKey="trend" stroke="#7DF9FF" strokeWidth={1.2} dot={false} strokeDasharray="5 3" opacity={0.5}/>}
                </LineChart>
              </ResponsiveContainer>
              <div style={{display:"flex",gap:14,paddingLeft:10,marginTop:4}}>
                <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:12,height:2.5,background:"#7DF9FF"}}/><span style={{color:"#555",fontSize:10}}>Actual</span></div>
                {reg&&<div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:12,height:1.5,background:"#7DF9FF",opacity:0.5}}/><span style={{color:"#555",fontSize:10}}>Trend +5d</span></div>}
              </div>
            </div>
          )}

          {/* Energy + Mood chart */}
          {chartData.length>1&&(
            <div style={{background:T.card,padding:"16px 8px 8px",marginBottom:20}}>
              <div style={{...H,fontSize:10,color:"#555",paddingLeft:10,marginBottom:8,letterSpacing:"0.1em"}}>ENERGY & MOOD /10</div>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={chartData}>
                  <XAxis dataKey="date" tick={{fill:"#555",fontSize:9}} axisLine={false} tickLine={false}/>
                  <YAxis domain={[0,10]} tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false} width={22}/>
                  <Tooltip {...TT}/>
                  <Line type="monotone" dataKey="energy" stroke="#39FF14" strokeWidth={2} dot={false} activeDot={{r:4}}/>
                  <Line type="monotone" dataKey="mood" stroke="#FF6B35" strokeWidth={2} dot={false} activeDot={{r:4}}/>
                </LineChart>
              </ResponsiveContainer>
              <div style={{display:"flex",gap:14,paddingLeft:10,marginTop:4}}>
                <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:12,height:2,background:"#39FF14"}}/><span style={{color:"#555",fontSize:10}}>Energy</span></div>
                <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:12,height:2,background:"#FF6B35"}}/><span style={{color:"#555",fontSize:10}}>Mood</span></div>
              </div>
            </div>
          )}

          {/* Resting Heart Rate chart (from Google Health) */}
          {rhrData.length>=1&&(
            <div style={{background:T.card,padding:"16px 8px 8px",marginBottom:20}}>
              <div style={{...H,fontSize:10,color:"#555",paddingLeft:10,marginBottom:8,letterSpacing:"0.1em"}}>RESTING HEART RATE (bpm)</div>
              <ResponsiveContainer width="100%" height={150}>
                {rhrData.length===1?(
                  <BarChart data={rhrData}>
                    <XAxis dataKey="date" tick={{fill:"#555",fontSize:9}} axisLine={false} tickLine={false}/>
                    <YAxis tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false} width={28} domain={[0,'dataMax+10']}/>
                    <Tooltip {...TT}/>
                    <Bar dataKey="restingHR" fill="#FF3B5C" radius={[2,2,0,0]}/>
                  </BarChart>
                ):(
                  <LineChart data={rhrData}>
                    <XAxis dataKey="date" tick={{fill:"#555",fontSize:9}} axisLine={false} tickLine={false}/>
                    <YAxis tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false} width={28} domain={['dataMin-5','dataMax+5']}/>
                    <Tooltip {...TT}/>
                    <Line type="monotone" dataKey="restingHR" stroke="#FF3B5C" strokeWidth={2.5} dot={{fill:"#FF3B5C",r:3}} activeDot={{r:5}} connectNulls={true}/>
                  </LineChart>
                )}
              </ResponsiveContainer>
              <div style={{color:"#555",fontSize:10,paddingLeft:10,marginTop:6}}>Avg: {(rhrData.reduce((s,d)=>s+(d.restingHR||0),0)/rhrData.length).toFixed(0)} bpm · {rhrData.length} day{rhrData.length===1?"":"s"}</div>
            </div>
          )}

          {/* HRV chart (from Google Health) */}
          {hrvData.length>=1&&(
            <div style={{background:T.card,padding:"16px 8px 8px",marginBottom:20}}>
              <div style={{...H,fontSize:10,color:"#555",paddingLeft:10,marginBottom:8,letterSpacing:"0.1em"}}>HEART RATE VARIABILITY (ms)</div>
              <ResponsiveContainer width="100%" height={150}>
                {hrvData.length===1?(
                  <BarChart data={hrvData}>
                    <XAxis dataKey="date" tick={{fill:"#555",fontSize:9}} axisLine={false} tickLine={false}/>
                    <YAxis tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false} width={28} domain={[0,'dataMax+10']}/>
                    <Tooltip {...TT}/>
                    <Bar dataKey="hrv" fill="#A855F7" radius={[2,2,0,0]}/>
                  </BarChart>
                ):(
                  <LineChart data={hrvData}>
                    <XAxis dataKey="date" tick={{fill:"#555",fontSize:9}} axisLine={false} tickLine={false}/>
                    <YAxis tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false} width={28} domain={['dataMin-5','dataMax+5']}/>
                    <Tooltip {...TT}/>
                    <Line type="monotone" dataKey="hrv" stroke="#A855F7" strokeWidth={2.5} dot={{fill:"#A855F7",r:3}} activeDot={{r:5}} connectNulls={true}/>
                  </LineChart>
                )}
              </ResponsiveContainer>
              <div style={{color:"#555",fontSize:10,paddingLeft:10,marginTop:6}}>Avg: {(hrvData.reduce((s,d)=>s+(d.hrv||0),0)/hrvData.length).toFixed(0)} ms · {hrvData.length} day{hrvData.length===1?"":"s"}</div>
            </div>
          )}

          {/* Sleep Stages stacked area chart (from Google Health) */}
          {stagesData.length>=1&&(
            <div style={{background:T.card,padding:"16px 8px 8px",marginBottom:20}}>
              <div style={{...H,fontSize:10,color:"#555",paddingLeft:10,marginBottom:8,letterSpacing:"0.1em"}}>SLEEP STAGES (min)</div>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={stagesData}>
                  <XAxis dataKey="date" tick={{fill:"#555",fontSize:9}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false} width={28}/>
                  <Tooltip {...TT}/>
                  <Area type="monotone" dataKey="deep" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.7}/>
                  <Area type="monotone" dataKey="rem" stackId="1" stroke="#A855F7" fill="#A855F7" fillOpacity={0.7}/>
                  <Area type="monotone" dataKey="light" stackId="1" stroke="#7DF9FF" fill="#7DF9FF" fillOpacity={0.5}/>
                  <Area type="monotone" dataKey="awake" stackId="1" stroke="#FF6B35" fill="#FF6B35" fillOpacity={0.6}/>
                </AreaChart>
              </ResponsiveContainer>
              <div style={{display:"flex",gap:10,paddingLeft:10,marginTop:6,flexWrap:"wrap"}}>
                <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:10,height:10,background:"#3B82F6"}}/><span style={{color:"#555",fontSize:10}}>Deep</span></div>
                <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:10,height:10,background:"#A855F7"}}/><span style={{color:"#555",fontSize:10}}>REM</span></div>
                <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:10,height:10,background:"#7DF9FF"}}/><span style={{color:"#555",fontSize:10}}>Light</span></div>
                <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:10,height:10,background:"#FF6B35"}}/><span style={{color:"#555",fontSize:10}}>Awake</span></div>
              </div>
            </div>
          )}

          {/* Correlation cards */}
          {pairs.length>=4&&(moodLow||moodHi)&&(
            <>
              <div style={{...H,fontSize:10,color:T.sub,letterSpacing:"0.12em",marginBottom:12}}>SLEEP CORRELATIONS</div>
              <div style={{display:"flex",gap:10,marginBottom:20}}>
                {moodLow&&moodHi&&(
                  <div style={{flex:1,borderTop:'2px solid #7DF9FF',paddingTop:10}}>
                    <div style={{...H,fontSize:9,color:T.sub,letterSpacing:"0.1em",marginBottom:6}}>NEXT-DAY MOOD</div>
                    <div style={{display:"flex",gap:8,alignItems:"baseline"}}>
                      <div><div style={{...H,fontSize:10,color:"#FF3B5C",marginBottom:2}}>&lt;{moodThresh.t}h</div><div style={{...H,fontSize:22,color:"#FF3B5C"}}>{moodLow}</div></div>
                      <div style={{color:T.sub,fontSize:12}}>vs</div>
                      <div><div style={{...H,fontSize:10,color:"#39FF14",marginBottom:2}}>≥{moodThresh.t}h</div><div style={{...H,fontSize:22,color:"#39FF14"}}>{moodHi}</div></div>
                    </div>
                  </div>
                )}
                {enLow&&enHi&&(
                  <div style={{flex:1,borderTop:'2px solid #FFD700',paddingTop:10}}>
                    <div style={{...H,fontSize:9,color:T.sub,letterSpacing:"0.1em",marginBottom:6}}>NEXT-DAY ENERGY</div>
                    <div style={{display:"flex",gap:8,alignItems:"baseline"}}>
                      <div><div style={{...H,fontSize:10,color:"#FF3B5C",marginBottom:2}}>&lt;7h</div><div style={{...H,fontSize:22,color:"#FF3B5C"}}>{enLow}</div></div>
                      <div style={{color:T.sub,fontSize:12}}>vs</div>
                      <div><div style={{...H,fontSize:10,color:"#39FF14",marginBottom:2}}>≥7h</div><div style={{...H,fontSize:22,color:"#39FF14"}}>{enHi}</div></div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* AI Insights */}
          <Divider/>
          <div style={{...H,fontSize:10,color:T.sub,letterSpacing:"0.12em",marginBottom:12}}>AI PATTERN ANALYSIS</div>
          {!insights&&!aiLoading&&(
            <Btn label="Analyze Patterns" onClick={getInsights} ghost style={{marginBottom:4}}/>
          )}
          {aiLoading&&<div style={{color:T.sub,...H,fontSize:12,textAlign:"center",padding:"16px 0"}}>ANALYZING…</div>}
          {insights&&insights.map((ins,i)=>(
            <div key={i} style={{borderLeft:'3px solid '+(insightColor[ins.type]||"#555"),paddingLeft:12,marginBottom:16}}>
              <div style={{...H,fontSize:13,color:insightColor[ins.type]||T.text,marginBottom:4}}>{ins.title}</div>
              <div style={{fontSize:12,color:T.sub,lineHeight:1.6}}>{ins.body}</div>
            </div>
          ))}
          {insights&&<button onClick={()=>setInsights(null)} style={{background:"none",border:"none",color:"#444",...H,fontSize:10,cursor:"pointer",marginTop:4,padding:0,letterSpacing:"0.08em"}}>CLEAR</button>}
          <Divider/>
          <div style={{...H,fontSize:10,color:T.sub,letterSpacing:"0.12em",marginBottom:12}}>SCHEDULE SUGGESTIONS</div>
          {!schedSuggestions&&!schedLoading&&(
            <Btn label="Suggest Optimal Schedule" onClick={getSchedule} ghost style={{marginBottom:4}}/>
          )}
          {schedLoading&&<div style={{color:T.sub,...H,fontSize:12,textAlign:"center",padding:"16px 0"}}>ANALYSING PATTERNS…</div>}
          {schedSuggestions&&(
            <>
              <div style={{borderLeft:"2px solid #FFD700",paddingLeft:12,paddingTop:4,paddingBottom:4,marginBottom:8}}>
                <div style={{fontSize:12,color:T.sub,lineHeight:1.7,whiteSpace:"pre-line"}}>{schedSuggestions}</div>
              </div>
              <button onClick={()=>setSchedSuggestions(null)} style={{background:"none",border:"none",color:"#444",...H,fontSize:10,cursor:"pointer",padding:0,letterSpacing:"0.08em"}}>CLEAR</button>
            </>
          )}
        </>
      )}
    </div>
  );
}

// ─── ADD EVENT HELPER ────────────────────────────────────────────────────────
function AddEvent({saveComingSoon,comingSoon}){
  const {T}=useContext(Ctx);
  const [text,setText]=useState('');const [date,setDate]=useState('');const [open,setOpen]=useState(false);
  const H={fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,textTransform:'uppercase'};
  const add=async()=>{if(!text.trim())return;await saveComingSoon([...comingSoon,{id:String(Date.now()),text:text.trim(),date:date.trim()}]);setText('');setDate('');setOpen(false);};
  if(!open)return <button onClick={()=>setOpen(true)} style={{background:'none',border:'1px solid #222',color:T.sub,padding:'8px 16px',cursor:'pointer',...H,fontSize:10,letterSpacing:'0.08em'}}>+ ADD EVENT</button>;
  return(
    <div>
      <input value={text} onChange={e=>setText(e.target.value)} placeholder='Event name...'
        style={{background:'transparent',border:'none',borderBottom:'1px solid #333',borderRadius:0,padding:'10px 0',color:T.text,...H,fontSize:16,outline:'none',width:'100%',marginBottom:8}}/>
      <input value={date} onChange={e=>setDate(e.target.value)} placeholder='Date or note (e.g. 15 June 2026)...'
        style={{background:'transparent',border:'none',borderBottom:'1px solid #333',borderRadius:0,padding:'8px 0',color:T.text,fontFamily:"'Barlow',sans-serif",fontSize:13,outline:'none',width:'100%',marginBottom:12}}/>
      <div style={{display:'flex',gap:8}}>
        <button onClick={add} style={{flex:1,background:T.text,color:T.bg,border:'none',padding:'12px',...H,fontSize:13,cursor:'pointer'}}>SAVE</button>
        <button onClick={()=>setOpen(false)} style={{flex:0.5,background:'none',border:'1px solid #333',color:T.sub,padding:'12px',...H,fontSize:13,cursor:'pointer'}}>CANCEL</button>
      </div>
    </div>
  );
}


// ─── PHYSIQUE SCREEN ──────────────────────────────────────────────────────────
function PhysiqueScreen(){
  const {T,morningLogs,nightLogs,workoutLogs,bw,saveBw,apiKey}=useContext(Ctx);
  const [physTab,setPhysTab]=useState("log");
  const [phase,setPhase]=useState(()=>{try{const v=localStorage.getItem('k3_phase');return v?JSON.parse(v):{type:'bulk',start:todayStr(),target:75,startWeight:65};}catch{return{type:'bulk',start:todayStr(),target:75,startWeight:65};}});
  const [weighIns,setWeighIns]=useState(()=>{try{const v=localStorage.getItem('k3_weighins');return v?JSON.parse(v):[];}catch{return [];}});
  const [newWeight,setNewWeight]=useState("");
  const [pendingFront,setPendingFront]=useState(null);
  const [pendingBack,setPendingBack]=useState(null);
  const [pendingNote,setPendingNote]=useState("");
  const [aiAnalysis,setAiAnalysis]=useState(null);
  const [aiLoading,setAiLoading]=useState(false);
  const [editPhase,setEditPhase]=useState(false);
  const [targetInput,setTargetInput]=useState(String(phase.target));
  const [startInput,setStartInput]=useState(String(phase.startWeight));
  const [editingEntry,setEditingEntry]=useState(null); // date string of entry being edited
  const [editBuf,setEditBuf]=useState({});
  const [expandedEntry,setExpandedEntry]=useState(null); // date string of expanded grid item
  const H={fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,textTransform:"uppercase"};

  const savePhase=v=>{setPhase(v);localStorage.setItem('k3_phase',JSON.stringify(v));};
  const saveWeighIns=v=>{setWeighIns(v);localStorage.setItem('k3_weighins',JSON.stringify(v));};

  const compressImage=file=>new Promise(resolve=>{
    const reader=new FileReader();
    reader.onload=e=>{
      const img=new Image();
      img.onload=()=>{
        const MAX=800;let w=img.width,h=img.height;
        if(w>MAX||h>MAX){if(w>h){h=Math.round(h*MAX/w);w=MAX;}else{w=Math.round(w*MAX/h);h=MAX;}}
        const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
        canvas.getContext('2d').drawImage(img,0,0,w,h);
        resolve(canvas.toDataURL('image/jpeg',0.65));
      };
      img.src=e.target.result;
    };
    reader.readAsDataURL(file);
  });

  const imgInput=(label,value,setter)=>(
    <label style={{cursor:"pointer",border:`1px solid ${value?"#39FF14":"#222"}`,padding:"6px 10px",display:"flex",alignItems:"center",gap:6,...H,fontSize:10,color:value?"#39FF14":T.sub,letterSpacing:"0.04em",flex:1}}>
      📷 {value?label+" ✓":label}
      <input type="file" accept="image/*" style={{display:"none"}} onChange={async e=>{
        if(e.target.files[0]){const b64=await compressImage(e.target.files[0]);setter(b64);}
      }}/>
    </label>
  );

  const logWeight=async()=>{
    if(!newWeight)return;
    const entry={date:todayStr(),weight:parseFloat(newWeight),front:pendingFront||null,back:pendingBack||null,note:pendingNote||null};
    const updated=[...weighIns.filter(w=>w.date!==todayStr()),entry].sort((a,b)=>a.date.localeCompare(b.date));
    saveWeighIns(updated);setNewWeight("");setPendingFront(null);setPendingBack(null);setPendingNote("");
  };

  const startEdit=(w)=>{setEditingEntry(w.date);setEditBuf({weight:String(w.weight),note:w.note||"",front:w.front||null,back:w.back||null});};
  const saveEdit=()=>{
    const updated=weighIns.map(w=>w.date===editingEntry?{...w,weight:parseFloat(editBuf.weight)||w.weight,note:editBuf.note||null,front:editBuf.front,back:editBuf.back}:w);
    saveWeighIns(updated);setEditingEntry(null);setEditBuf({});
  };

  const latestWeight=weighIns.length?weighIns[weighIns.length-1].weight:phase.startWeight;
  const phaseProgress=phase.type==='bulk'
    ?Math.min(100,Math.round((latestWeight-phase.startWeight)/(phase.target-phase.startWeight)*100))
    :Math.min(100,Math.round((phase.startWeight-latestWeight)/(phase.startWeight-phase.target)*100));
  const progressColor=phaseProgress>=100?"#39FF14":phaseProgress>=60?"#FFD700":"#7DF9FF";

  const getCtx=date=>{
    const morn=morningLogs.find(l=>l.date===date);
    const prev=new Date(date+'T12:00:00');prev.setDate(prev.getDate()-1);
    const prevStr=prev.toLocaleDateString('sv-SE');
    const nigh=nightLogs.find(l=>l.date===prevStr);
    return{sleep:morn?.sleep,energy:morn?.energy,mood:morn?.mood,prevMood:nigh?.mood,prevEnergy:nigh?.energy};
  };

  const runAnalysis=async()=>{
    if(!apiKey){setAiAnalysis("Add your Anthropic API key in ME → Settings to use AI analysis.");return;}
    setAiLoading(true);
    try{
      const recentWeigh=weighIns.slice(-14).map(w=>({d:w.date,kg:w.weight,...getCtx(w.date)}));
      const recentWO=workoutLogs.slice(-10).map(l=>({d:l.date.slice(0,10),diff:l.difficulty}));
      const txt=await aiPost(apiKey,{max_tokens:600,
        system:"You are a physique and performance coach. Analyse the data and give 4-5 blunt, specific observations about: (1) weight trajectory vs phase target, (2) whether sleep/HRV/energy quality is supporting phase goals — look for correlations between bad sleep and stalled weight, (3) training load alignment with phase, (4) mood patterns on heavy training days vs rest days and whether they align with the phase demands, (5) one concrete action to improve. No padding, specific numbers only.",
        messages:[{role:"user",content:"Phase: "+JSON.stringify(phase)+" Current weight: "+latestWeight+"kg. Weigh-ins with daily context: "+JSON.stringify(recentWeigh)+" Workouts: "+JSON.stringify(recentWO)}]
      });
      setAiAnalysis(txt);
    }catch(e){setAiAnalysis("Analysis failed: "+e.message);}
    setAiLoading(false);
  };

  return(
    <div style={{padding:"24px 20px"}}>
      <PageHeader title="PHYSIQUE"/>

      {/* Tab bar */}
      <div style={{display:"flex",borderBottom:`1px solid ${T.div}`,marginBottom:20}}>
        {[["log","LOG"],["history","HISTORY"],["analysis","ANALYSIS"]].map(([id,l])=>(
          <button key={id} onClick={()=>setPhysTab(id)} style={{flex:1,background:"transparent",border:"none",
            borderBottom:`2px solid ${physTab===id?T.text:"transparent"}`,color:physTab===id?T.text:T.sub,
            padding:"10px 0",marginBottom:-1,...H,fontSize:11,cursor:"pointer",letterSpacing:"0.06em"}}>{l}</button>
        ))}
      </div>

      {/* ── LOG TAB ── */}
      {physTab==="log"&&(<>
        {/* Phase tracker */}
        <div style={{marginBottom:24}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{...H,fontSize:10,color:T.sub,letterSpacing:"0.12em"}}>CURRENT PHASE</div>
            <button onClick={()=>setEditPhase(!editPhase)} style={{background:"none",border:"none",color:T.sub,cursor:"pointer",...H,fontSize:10,letterSpacing:"0.06em"}}>EDIT</button>
          </div>
          {editPhase?(
            <div style={{background:T.card,padding:"16px",marginBottom:12}}>
              <div style={{display:"flex",gap:6,marginBottom:12}}>
                {["bulk","cut","maintain"].map(p=>(
                  <button key={p} onClick={()=>savePhase({...phase,type:p})}
                    style={{flex:1,padding:"8px 0",background:phase.type===p?T.text:"transparent",color:phase.type===p?T.bg:T.sub,border:`1px solid ${phase.type===p?T.text:"#222"}`,borderRadius:0,...H,fontSize:11,cursor:"pointer"}}>
                    {p.toUpperCase()}
                  </button>
                ))}
              </div>
              <div style={{display:"flex",gap:8,marginBottom:8}}>
                <div style={{flex:1}}>
                  <div style={{...H,fontSize:9,color:T.sub,marginBottom:3}}>START WEIGHT kg</div>
                  <input value={startInput} onChange={e=>setStartInput(e.target.value)}
                    onBlur={()=>{const n=parseFloat(startInput);if(!isNaN(n))savePhase({...phase,startWeight:n});else setStartInput(String(phase.startWeight));}}
                    type="number" style={{background:T.inp,border:"none",borderBottom:"1px solid #333",borderRadius:0,padding:"8px 4px",color:T.text,...H,fontSize:13,outline:"none",width:"100%"}}/>
                </div>
                <div style={{flex:1}}>
                  <div style={{...H,fontSize:9,color:T.sub,marginBottom:3}}>TARGET kg</div>
                  <input value={targetInput} onChange={e=>setTargetInput(e.target.value)}
                    onBlur={()=>{const n=parseFloat(targetInput);if(!isNaN(n))savePhase({...phase,target:n});else setTargetInput(String(phase.target));}}
                    type="number" style={{background:T.inp,border:"none",borderBottom:"1px solid #333",borderRadius:0,padding:"8px 4px",color:T.text,...H,fontSize:13,outline:"none",width:"100%"}}/>
                </div>
                <div style={{flex:1}}>
                  <div style={{...H,fontSize:9,color:T.sub,marginBottom:3}}>START DATE</div>
                  <input value={phase.start} onChange={e=>savePhase({...phase,start:e.target.value})} type="date"
                    style={{background:T.inp,border:"none",borderBottom:"1px solid #333",borderRadius:0,padding:"8px 4px",color:T.text,...H,fontSize:11,outline:"none",width:"100%"}}/>
                </div>
              </div>
              <button onClick={()=>setEditPhase(false)} style={{background:"none",border:"none",color:T.sub,cursor:"pointer",...H,fontSize:10,letterSpacing:"0.06em"}}>DONE</button>
            </div>
          ):(
            <>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:8}}>
                <div style={{...H,fontSize:28,color:phase.type==="bulk"?"#FFD700":phase.type==="cut"?"#FF3B5C":"#39FF14"}}>{phase.type.toUpperCase()}</div>
                <div style={{...H,fontSize:14,color:T.sub}}>{phase.startWeight}kg → {phase.target}kg</div>
              </div>
              <div style={{...H,fontSize:13,marginBottom:8}}>Currently: {latestWeight}kg · {Math.abs(latestWeight-phase.target).toFixed(1)}kg {latestWeight<phase.target?"to go":"over target"}</div>
              <div style={{height:3,background:T.div,overflow:"hidden",marginBottom:4}}>
                <div style={{width:"100%",height:"100%",background:`linear-gradient(to right,#5C0000,#CC0000,#FFD700,#39FF14)`,transform:`translateX(${phaseProgress-100}%)`,transition:"transform 0.4s ease"}}/>
              </div>
              <div style={{...H,fontSize:10,color:progressColor}}>{phaseProgress}% complete</div>
            </>
          )}
        </div>

        {/* Position reminder */}
        <div style={{borderLeft:"2px solid #333",paddingLeft:10,marginBottom:20}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,color:"#444",letterSpacing:"0.08em",lineHeight:1.5}}>
            HEEL / TOES AT EDGE OF BATH · PHONE IN SKINCARE BOX · TAKE PHOTO POST MORNING TOILET
          </div>
        </div>

        {/* Daily weigh-in */}
        <div style={{marginBottom:24}}>
          <div style={{...H,fontSize:10,color:T.sub,letterSpacing:"0.12em",marginBottom:10}}>MORNING WEIGH-IN</div>
          <div style={{display:"flex",gap:8,marginBottom:12}}>
            <input value={newWeight} onChange={e=>setNewWeight(e.target.value)} placeholder="kg" type="number" step="0.1"
              style={{flex:1,background:T.inp,border:"none",borderBottom:"1px solid #333",borderRadius:0,padding:"12px 8px",color:T.text,...H,fontSize:18,outline:"none"}}/>
            <button onClick={logWeight} style={{padding:"0 20px",background:T.text,color:T.bg,border:"none",borderRadius:0,...H,fontSize:12,cursor:"pointer"}}>LOG</button>
          </div>
          <div style={{display:"flex",gap:8,marginBottom:10}}>
            {imgInput("FRONT",pendingFront,setPendingFront)}
            {imgInput("BACK",pendingBack,setPendingBack)}
          </div>
          {(pendingFront||pendingBack)&&(
            <div style={{display:"flex",gap:8,marginBottom:10}}>
              {pendingFront&&(
                <div style={{flex:1,position:"relative"}}>
                  <img src={pendingFront} style={{width:"100%",aspectRatio:"3/4",objectFit:"cover",display:"block"}}/>
                  <button onClick={()=>setPendingFront(null)} style={{position:"absolute",top:4,right:4,background:"rgba(0,0,0,0.7)",border:"none",color:"#fff",cursor:"pointer",fontSize:16,width:24,height:24,borderRadius:"50%"}}>×</button>
                  <div style={{...H,fontSize:9,color:T.sub,marginTop:4,textAlign:"center"}}>FRONT</div>
                </div>
              )}
              {pendingBack&&(
                <div style={{flex:1,position:"relative"}}>
                  <img src={pendingBack} style={{width:"100%",aspectRatio:"3/4",objectFit:"cover",display:"block"}}/>
                  <button onClick={()=>setPendingBack(null)} style={{position:"absolute",top:4,right:4,background:"rgba(0,0,0,0.7)",border:"none",color:"#fff",cursor:"pointer",fontSize:16,width:24,height:24,borderRadius:"50%"}}>×</button>
                  <div style={{...H,fontSize:9,color:T.sub,marginTop:4,textAlign:"center"}}>BACK</div>
                </div>
              )}
            </div>
          )}
          <textarea value={pendingNote} onChange={e=>setPendingNote(e.target.value)} placeholder="Notes (optional)..."
            style={{width:"100%",background:T.inp,border:"none",borderBottom:"1px solid #333",borderRadius:0,padding:"10px 8px",color:T.text,fontFamily:"'Barlow',sans-serif",fontSize:13,outline:"none",minHeight:70,resize:"vertical",lineHeight:1.5}}/>
        </div>

        {/* Recent entries — editable */}
        {weighIns.length>0&&(
          <div>
            <div style={{...H,fontSize:10,color:T.sub,letterSpacing:"0.12em",marginBottom:10}}>RECENT</div>
            {[...weighIns].reverse().slice(0,5).map(w=>(
              <div key={w.date}>
                {editingEntry===w.date?(
                  <div style={{background:T.card,padding:14,marginBottom:12}}>
                    <div style={{...H,fontSize:12,marginBottom:10}}>{w.date}</div>
                    <div style={{display:"flex",gap:8,marginBottom:10,alignItems:"center"}}>
                      <input value={editBuf.weight} onChange={e=>setEditBuf(b=>({...b,weight:e.target.value}))} type="number" step="0.1"
                        style={{flex:1,background:T.inp,border:"none",borderBottom:"1px solid #333",padding:"8px 4px",color:T.text,...H,fontSize:16,outline:"none"}}/>
                      <span style={{color:T.sub,fontSize:12,...H}}>KG</span>
                    </div>
                    <div style={{display:"flex",gap:8,marginBottom:10}}>
                      <label style={{cursor:"pointer",border:`1px solid ${editBuf.front?"#39FF14":"#222"}`,padding:"6px 10px",...H,fontSize:10,color:editBuf.front?"#39FF14":T.sub,flex:1}}>
                        📷 {editBuf.front?"FRONT ✓":"FRONT"}
                        <input type="file" accept="image/*" style={{display:"none"}} onChange={async e=>{
                          if(e.target.files[0]){const b64=await compressImage(e.target.files[0]);setEditBuf(b=>({...b,front:b64}));}
                        }}/>
                      </label>
                      <label style={{cursor:"pointer",border:`1px solid ${editBuf.back?"#39FF14":"#222"}`,padding:"6px 10px",...H,fontSize:10,color:editBuf.back?"#39FF14":T.sub,flex:1}}>
                        📷 {editBuf.back?"BACK ✓":"BACK"}
                        <input type="file" accept="image/*" style={{display:"none"}} onChange={async e=>{
                          if(e.target.files[0]){const b64=await compressImage(e.target.files[0]);setEditBuf(b=>({...b,back:b64}));}
                        }}/>
                      </label>
                    </div>
                    <textarea value={editBuf.note} onChange={e=>setEditBuf(b=>({...b,note:e.target.value}))} placeholder="Notes..."
                      style={{width:"100%",background:T.inp,border:"none",borderBottom:"1px solid #333",padding:"8px",color:T.text,fontFamily:"'Barlow',sans-serif",fontSize:13,outline:"none",minHeight:60,resize:"vertical",marginBottom:10,lineHeight:1.5}}/>
                    <div style={{display:"flex",gap:8}}>
                      <button onClick={saveEdit} style={{flex:1,padding:"8px",background:T.text,color:T.bg,border:"none",...H,fontSize:11,cursor:"pointer"}}>SAVE</button>
                      <button onClick={()=>{setEditingEntry(null);setEditBuf({});}} style={{flex:1,padding:"8px",background:"transparent",color:T.sub,border:`1px solid ${T.div}`,...H,fontSize:11,cursor:"pointer"}}>CANCEL</button>
                    </div>
                  </div>
                ):(
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:8,marginBottom:8,borderBottom:`1px solid ${T.div}`}}>
                    <div>
                      <div style={{color:T.sub,fontSize:12}}>{w.date}</div>
                      {w.note&&<div style={{color:"#444",fontSize:11,marginTop:2,fontStyle:"italic"}}>{w.note}</div>}
                    </div>
                    <div style={{display:"flex",gap:10,alignItems:"center"}}>
                      {(w.front||w.back)&&<span style={{fontSize:10,color:"#444"}}>📷 {[w.front?"F":null,w.back?"B":null].filter(Boolean).join("+")}</span>}
                      <div style={{...H,fontSize:16}}>{w.weight}kg</div>
                      <button onClick={()=>startEdit(w)} style={{background:"none",border:"none",color:T.sub,cursor:"pointer",...H,fontSize:10,letterSpacing:"0.04em"}}>EDIT</button>
                      <button onClick={()=>saveWeighIns(weighIns.filter(x=>x.date!==w.date))} style={{background:"none",border:"none",color:"#333",cursor:"pointer",fontSize:14}}>×</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </>)}

      {/* ── HISTORY TAB ── */}
      {physTab==="history"&&(<>
        {weighIns.length===0&&(
          <div style={{color:T.sub,fontSize:12,paddingTop:20,textAlign:"center"}}>No weigh-ins logged yet.</div>
        )}

        {/* 3-column grid */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6}}>
          {[...weighIns].reverse().map(w=>{
            const isExpanded=expandedEntry===w.date;
            return(
              <div key={w.date} style={{gridColumn:isExpanded?"span 3":"span 1"}}>
                {isExpanded?(
                  // Expanded view
                  <div style={{background:T.card,padding:12,marginBottom:6}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                      <div style={{...H,fontSize:13}}>{w.date}</div>
                      <div style={{display:"flex",gap:8,alignItems:"center"}}>
                        <div style={{...H,fontSize:18}}>{w.weight}kg</div>
                        <button onClick={()=>setExpandedEntry(null)} style={{background:"none",border:"none",color:T.sub,cursor:"pointer",fontSize:18,lineHeight:1}}>×</button>
                      </div>
                    </div>
                    {(w.front||w.back)&&(
                      <div style={{display:"flex",gap:8,marginBottom:8}}>
                        {w.front&&(
                          <div style={{flex:1}}>
                            <img src={w.front} style={{width:"100%",display:"block"}}/>
                            <div style={{...H,fontSize:9,color:T.sub,marginTop:4,textAlign:"center"}}>FRONT</div>
                          </div>
                        )}
                        {w.back&&(
                          <div style={{flex:1}}>
                            <img src={w.back} style={{width:"100%",display:"block"}}/>
                            <div style={{...H,fontSize:9,color:T.sub,marginTop:4,textAlign:"center"}}>BACK</div>
                          </div>
                        )}
                      </div>
                    )}
                    {w.note&&<div style={{color:T.sub,fontSize:12,fontStyle:"italic",marginBottom:8}}>{w.note}</div>}
                    {(()=>{const ctx=getCtx(w.date);return ctx.sleep||ctx.energy||ctx.mood?(
                      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                        {ctx.sleep&&<span style={{color:"#444",fontSize:11}}>😴 {ctx.sleep}h</span>}
                        {ctx.energy&&<span style={{color:"#444",fontSize:11}}>⚡ {ctx.energy}/10</span>}
                        {ctx.mood&&<span style={{color:"#444",fontSize:11}}>🎯 {ctx.mood}/10</span>}
                      </div>
                    ):null;})()}
                    <div style={{display:"flex",gap:8,marginTop:10}}>
                      <button onClick={()=>{setPhysTab("log");startEdit(w);setExpandedEntry(null);}} style={{flex:1,padding:"8px",background:"transparent",color:T.sub,border:`1px solid ${T.div}`,...H,fontSize:10,cursor:"pointer"}}>EDIT</button>
                      <button onClick={()=>{saveWeighIns(weighIns.filter(x=>x.date!==w.date));setExpandedEntry(null);}} style={{flex:1,padding:"8px",background:"transparent",color:"#FF3B5C",border:`1px solid #FF3B5C`,...H,fontSize:10,cursor:"pointer"}}>DELETE</button>
                    </div>
                  </div>
                ):(
                  // Grid cell — tap to expand
                  <div onClick={()=>setExpandedEntry(w.date)} style={{cursor:"pointer",background:T.card}}>
                    {(w.front||w.back)?(
                      <img src={w.front||w.back} style={{width:"100%",aspectRatio:"3/4",objectFit:"cover",display:"block"}}/>
                    ):(
                      <div style={{width:"100%",aspectRatio:"3/4",background:T.div,display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <span style={{...H,fontSize:14}}>{w.weight}kg</span>
                      </div>
                    )}
                    <div style={{padding:"4px 6px"}}>
                      <div style={{...H,fontSize:11}}>{w.weight}kg</div>
                      <div style={{color:T.sub,fontSize:9}}>{w.date.slice(5)}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </>)}

      {/* ── ANALYSIS TAB ── */}
      {physTab==="analysis"&&(<>
        <button onClick={runAnalysis} disabled={aiLoading}
          style={{background:"transparent",border:"1px solid #333",borderRadius:0,color:aiLoading?T.sub:T.text,padding:"12px 20px",width:"100%",...H,fontSize:12,letterSpacing:"0.08em",cursor:"pointer",marginBottom:aiAnalysis?12:0}}>
          {aiLoading?"ANALYSING…":"ANALYSE PROGRESS"}
        </button>
        {aiAnalysis&&(
          <div style={{borderLeft:"2px solid #7DF9FF",paddingLeft:12,paddingTop:4,paddingBottom:4,marginTop:12}}>
            <div style={{fontSize:13,color:T.sub,lineHeight:1.7,whiteSpace:"pre-line"}}>{aiAnalysis}</div>
            <button onClick={()=>setAiAnalysis(null)} style={{background:"none",border:"none",color:"#444",...H,fontSize:10,cursor:"pointer",padding:0,marginTop:8,letterSpacing:"0.08em"}}>CLEAR</button>
          </div>
        )}
        {!apiKey&&<div style={{color:"#FF3B5C",fontSize:11,marginTop:8,fontFamily:"'Barlow Condensed',sans-serif"}}>Add API key in ME → Settings to use AI analysis.</div>}
      </>)}
    </div>
  );
}

// ─── GOALS ────────────────────────────────────────────────────────────────────
// ─── QUOTE VAULT SCREEN ───────────────────────────────────────────────────────
function QuoteVaultScreen(){
  const {T,quotes,saveQuotes,apiKey}=useContext(Ctx);
  const [text,setText]=useState("");const [author,setAuthor]=useState("");
  const [loading,setLoading]=useState(false);const [aiQuotes,setAiQuotes]=useState([]);
  const H={fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,textTransform:"uppercase"};

  const getSuggestions=async(q)=>{
    setLoading(true);
    try{
      const txt=await aiPost(apiKey,{max_tokens:600,system:"Suggest quotes matching the vibe and idea of a given quote. Return ONLY a JSON array of 2-3 objects: [{text,author}]. No markdown. Pull from any tradition — philosophy, religion, fashion, sport, literature, business. Match the energy precisely.",
        messages:[{role:"user",content:"Give me 2-3 quotes that match this vibe: '"+q.text+"' by "+q.author}]
      });
      setAiQuotes(JSON.parse(txt.replace(/```json|```/g,"").trim()));
    }catch{}
    setLoading(false);
  };

  const addQuote=async(q,src='user')=>{
    const entry={id:String(Date.now()+Math.random()),text:q.text,author:q.author||"",source:src,addedDate:todayStr()};
    await saveQuotes([...quotes,entry]);
    if(src==='user'){setText("");setAuthor("");getSuggestions(entry);}
    else setAiQuotes(prev=>prev.filter(aq=>aq.text!==q.text));
  };

  const del=async id=>saveQuotes(quotes.filter(q=>q.id!==id));

  return(
    <div style={{padding:"24px 20px"}}>
      <PageHeader title="QUOTE VAULT"/>
      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,textTransform:"uppercase",fontSize:10,color:T.sub,letterSpacing:"0.12em",marginBottom:10}}>ADD A QUOTE</div>
      <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="The quote..."
        style={{background:T.inp,border:"none",borderBottom:"1px solid #333",borderRadius:0,padding:"10px 4px",color:T.text,fontFamily:"'Barlow',sans-serif",fontSize:14,outline:"none",width:"100%",minHeight:60,resize:"vertical",marginBottom:8,lineHeight:1.5}}/>
      <Inp placeholder="Author / Source" value={author} onChange={e=>setAuthor(e.target.value)} style={{marginBottom:12}}/>
      <Btn label="Add + Get Suggestions" onClick={()=>{if(text.trim())addQuote({text:text.trim(),author:author.trim()});}} style={{marginBottom:24}}/>
      {loading&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,textTransform:"uppercase",fontSize:11,color:T.sub,marginBottom:16}}>FINDING MATCHES…</div>}
      {aiQuotes.length>0&&(
        <div style={{marginBottom:24}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,textTransform:"uppercase",fontSize:10,color:T.sub,letterSpacing:"0.12em",marginBottom:12}}>SUGGESTED — TAP TO ADD</div>
          {aiQuotes.map((q,i)=>(
            <div key={i} onClick={()=>addQuote(q,'ai')} style={{background:T.inp,padding:"12px 14px",marginBottom:8,cursor:"pointer",borderLeft:"2px solid #333"}}>
              <div style={{fontStyle:"italic",fontSize:13,lineHeight:1.5,marginBottom:4}}>"{q.text}"</div>
              {q.author&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:10,color:T.sub}}>— {q.author.toUpperCase()}</div>}
            </div>
          ))}
        </div>
      )}
      <Divider/>
      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,textTransform:"uppercase",fontSize:10,color:T.sub,letterSpacing:"0.12em",marginBottom:14}}>VAULT — {quotes.length} QUOTES</div>
      {quotes.length===0&&<div style={{color:T.sub,fontSize:12}}>No quotes yet. Add one above.</div>}
      {[...quotes].reverse().map(q=>(
        <div key={q.id} style={{display:"flex",gap:10,alignItems:"flex-start",paddingBottom:14,marginBottom:14,borderBottom:`1px solid ${T.div}`}}>
          <div style={{flex:1}}>
            <div style={{fontStyle:"italic",fontSize:13,lineHeight:1.5,marginBottom:4}}>"{q.text}"</div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              {q.author&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:10,color:T.sub}}>— {q.author.toUpperCase()}</div>}
              {q.source==='ai'&&<div style={{fontSize:9,color:"#333",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>✦ AI</div>}
            </div>
          </div>
          <button onClick={()=>del(q.id)} style={{background:"none",border:"none",color:"#444",cursor:"pointer",fontSize:16,flexShrink:0}}>×</button>
        </div>
      ))}
    </div>
  );
}

// ─── SOME TRACKER SCREEN ──────────────────────────────────────────────────────
function SoMeScreen(){
  const {T,soMeVideos,saveSoMeVideos,soMeFollowers,saveSoMeFollowers}=useContext(Ctx);
  const [tab,setTab]=useState("videos");
  const H={fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,textTransform:"uppercase"};
  const TT={contentStyle:{background:"#1A1A1A",border:"none",borderRadius:0,color:"#fff",fontSize:11}};
  const [vDate,setVDate]=useState(todayStr());const [vPlatform,setVPlatform]=useState("tiktok");
  const [vFormat,setVFormat]=useState("");const [vCustomFormat,setVCustomFormat]=useState("");
  const [vLang,setVLang]=useState("EN");const [vPct,setVPct]=useState("");const [vTitle,setVTitle]=useState("");
  const [fDate,setFDate]=useState(todayStr());const [fTTen,setFTTen]=useState("");const [fTTdk,setFTTdk]=useState("");const [fIG,setFIG]=useState("");

  const addVideo=async()=>{
    if(!vFormat&&!vCustomFormat)return;
    await saveSoMeVideos([...soMeVideos,{id:String(Date.now()),date:vDate,platform:vPlatform,format:vCustomFormat||vFormat,language:vLang,completionPct:parseInt(vPct)||0,title:vTitle}]);
    setVFormat("");setVCustomFormat("");setVPct("");setVTitle("");
  };
  const addFollowers=async()=>{
    if(!fTTen&&!fTTdk&&!fIG)return;
    await saveSoMeFollowers([...soMeFollowers,{id:String(Date.now()),date:fDate,tiktokEN:parseInt(fTTen)||0,tiktokDK:parseInt(fTTdk)||0,reels:parseInt(fIG)||0}]);
    setFTTen("");setFTTdk("");setFIG("");
  };

  const fSorted=[...soMeFollowers].sort((a,b)=>a.date.localeCompare(b.date));
  const totalVideos=soMeVideos.length;
  const vidsPct=soMeVideos.filter(v=>v.completionPct>0);
  const avgPct=vidsPct.length?Math.round(vidsPct.reduce((s,v)=>s+v.completionPct,0)/vidsPct.length):0;
  const byFormat=VIDEO_FORMATS.concat([...new Set(soMeVideos.map(v=>v.format).filter(f=>!VIDEO_FORMATS.includes(f)))]).map(f=>({format:f,count:soMeVideos.filter(v=>v.format===f).length})).filter(x=>x.count>0).sort((a,b)=>b.count-a.count);

  return(
    <div style={{padding:"24px 20px"}}>
      <PageHeader title="SOCIAL MEDIA"/>
      <div style={{display:"flex",borderBottom:"1px solid #222",marginBottom:20}}>
        {[["videos","VIDEOS"],["followers","FOLLOWERS"],["trends","TRENDS"]].map(([id,l])=>(
          <button key={id} onClick={()=>setTab(id)} style={{flex:1,background:"transparent",border:"none",borderBottom:`2px solid ${tab===id?T.text:"transparent"}`,color:tab===id?T.text:T.sub,padding:"10px 0",marginBottom:-1,...H,fontSize:11,cursor:"pointer",letterSpacing:"0.06em"}}>{l}</button>
        ))}
      </div>

      {tab==="videos"&&(<>
        <div style={{...H,fontSize:10,color:T.sub,letterSpacing:"0.12em",marginBottom:12}}>LOG A VIDEO</div>
        <div style={{display:"flex",gap:8,marginBottom:8}}>
          <div style={{flex:1}}>
            <div style={{...H,fontSize:9,color:T.sub,marginBottom:4}}>PLATFORM</div>
            <div style={{display:"flex",gap:5}}>
              {["tiktok","reels"].map(p=>(
                <button key={p} onClick={()=>setVPlatform(p)} style={{flex:1,padding:"8px 0",background:vPlatform===p?T.text:"transparent",color:vPlatform===p?T.bg:T.sub,border:`1px solid ${vPlatform===p?T.text:"#222"}`,borderRadius:0,...H,fontSize:10,cursor:"pointer"}}>{p.toUpperCase()}</button>
              ))}
            </div>
          </div>
          <div style={{flex:1}}>
            <div style={{...H,fontSize:9,color:T.sub,marginBottom:4}}>LANGUAGE</div>
            <div style={{display:"flex",gap:5}}>
              {["EN","DK"].map(l=>(
                <button key={l} onClick={()=>setVLang(l)} style={{flex:1,padding:"8px 0",background:vLang===l?T.text:"transparent",color:vLang===l?T.bg:T.sub,border:`1px solid ${vLang===l?T.text:"#222"}`,borderRadius:0,...H,fontSize:11,cursor:"pointer"}}>{l}</button>
              ))}
            </div>
          </div>
        </div>
        <div style={{...H,fontSize:9,color:T.sub,marginBottom:6,marginTop:4}}>FORMAT</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:8}}>
          {VIDEO_FORMATS.map(f=>(
            <button key={f} onClick={()=>{setVFormat(f);setVCustomFormat("");}} style={{padding:"5px 10px",background:vFormat===f&&!vCustomFormat?T.text:"transparent",color:vFormat===f&&!vCustomFormat?T.bg:T.sub,border:`1px solid ${vFormat===f&&!vCustomFormat?T.text:"#222"}`,borderRadius:0,...H,fontSize:9,cursor:"pointer"}}>{f}</button>
          ))}
        </div>
        <Inp placeholder="Custom format..." value={vCustomFormat} onChange={e=>{setVCustomFormat(e.target.value);if(e.target.value)setVFormat("");}} style={{marginBottom:8}}/>
        <div style={{display:"flex",gap:8,marginBottom:8}}>
          <Inp placeholder="Completion % vs script" value={vPct} onChange={e=>setVPct(e.target.value)} type="number" style={{flex:1}}/>
          <Inp placeholder="Title (optional)" value={vTitle} onChange={e=>setVTitle(e.target.value)} style={{flex:2}}/>
        </div>
        <Inp placeholder="Date" value={vDate} onChange={e=>setVDate(e.target.value)} type="date" style={{marginBottom:10}}/>
        <Btn label="Log Video" onClick={addVideo} ghost style={{marginBottom:24}}/>
        <Divider/>
        <div style={{...H,fontSize:10,color:T.sub,letterSpacing:"0.12em",marginBottom:14}}>{totalVideos} VIDEOS · AVG {avgPct}% COMPLETION</div>
        {[...soMeVideos].reverse().map(v=>(
          <div key={v.id} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",paddingBottom:12,marginBottom:12,borderBottom:`1px solid ${T.div}`}}>
            <div style={{flex:1}}>
              <div style={{...H,fontSize:13,marginBottom:2}}>{v.format}</div>
              <div style={{color:T.sub,fontSize:11}}>{v.platform.toUpperCase()} · {v.language} · {v.date}</div>
              {v.title&&<div style={{color:T.sub,fontSize:11,marginTop:2}}>{v.title}</div>}
            </div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
              <div style={{...H,fontSize:20,color:v.completionPct>=80?"#39FF14":v.completionPct>=50?"#FFD700":"#FF3B5C"}}>{v.completionPct}%</div>
              <button onClick={()=>saveSoMeVideos(soMeVideos.filter(x=>x.id!==v.id))} style={{background:"none",border:"none",color:"#444",cursor:"pointer",fontSize:14}}>×</button>
            </div>
          </div>
        ))}
      </>)}

      {tab==="followers"&&(<>
        <div style={{...H,fontSize:10,color:T.sub,letterSpacing:"0.12em",marginBottom:12}}>LOG FOLLOWER COUNT</div>
        <div style={{display:"flex",gap:8,marginBottom:8}}>
          <Inp placeholder="TikTok EN" value={fTTen} onChange={e=>setFTTen(e.target.value)} type="number" style={{flex:1}}/>
          <Inp placeholder="TikTok DK" value={fTTdk} onChange={e=>setFTTdk(e.target.value)} type="number" style={{flex:1}}/>
          <Inp placeholder="Instagram" value={fIG} onChange={e=>setFIG(e.target.value)} type="number" style={{flex:1}}/>
        </div>
        <Inp placeholder="Date" value={fDate} onChange={e=>setFDate(e.target.value)} type="date" style={{marginBottom:10}}/>
        <Btn label="Log Count" onClick={addFollowers} ghost style={{marginBottom:24}}/>
        {fSorted.length>1&&(
          <div style={{background:T.card,padding:"16px 8px 8px",marginBottom:16}}>
            <div style={{...H,fontSize:10,color:"#555",paddingLeft:10,marginBottom:8,letterSpacing:"0.1em"}}>FOLLOWER GROWTH</div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={fSorted}><XAxis dataKey="date" tick={{fill:"#555",fontSize:9}} axisLine={false} tickLine={false}/><YAxis tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false} width={42}/><Tooltip {...TT}/><Line type="monotone" dataKey="tiktokEN" stroke="#FF3B5C" strokeWidth={2} dot={false} name="TikTok EN"/><Line type="monotone" dataKey="tiktokDK" stroke="#FF6B35" strokeWidth={2} dot={false} name="TikTok DK"/><Line type="monotone" dataKey="reels" stroke="#A78BFA" strokeWidth={2} dot={false} name="Instagram"/></LineChart>
            </ResponsiveContainer>
          </div>
        )}
        <Divider/>
        {[...soMeFollowers].reverse().map(f=>(
          <div key={f.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:10,marginBottom:10,borderBottom:`1px solid ${T.div}`}}>
            <div style={{color:T.sub,fontSize:12}}>{f.date}</div>
            <div style={{display:"flex",gap:14,alignItems:"center"}}>
              <div style={{...H,fontSize:14,color:"#FF3B5C"}}>TT EN {(f.tiktokEN||f.tiktok||0).toLocaleString()}</div>
              <div style={{...H,fontSize:14,color:"#FF6B35"}}>TT DK {(f.tiktokDK||0).toLocaleString()}</div>
              <div style={{...H,fontSize:14,color:"#A78BFA"}}>IG {(f.reels||0).toLocaleString()}</div>
              <button onClick={()=>saveSoMeFollowers(soMeFollowers.filter(x=>x.id!==f.id))} style={{background:"none",border:"none",color:"#444",cursor:"pointer",fontSize:14}}>×</button>
            </div>
          </div>
        ))}
      </>)}

      {tab==="trends"&&(<>
        <div style={{...H,fontSize:10,color:T.sub,letterSpacing:"0.12em",marginBottom:12}}>BY FORMAT</div>
        {byFormat.map(({format,count})=>(
          <div key={format} style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:10,marginBottom:10,borderBottom:`1px solid ${T.div}`}}>
            <div style={{...H,fontSize:13}}>{format}</div>
            <div style={{...H,fontSize:20,color:"#7DF9FF"}}>{count}</div>
          </div>
        ))}
        {byFormat.length===0&&<div style={{color:T.sub,fontSize:12}}>Log videos to see trends.</div>}
        {vidsPct.length>2&&(<>
          <Divider/>
          <div style={{...H,fontSize:10,color:T.sub,letterSpacing:"0.12em",marginBottom:8}}>COMPLETION % OVER TIME</div>
          <div style={{background:T.card,padding:"16px 8px 8px"}}>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={[...soMeVideos].filter(v=>v.completionPct>0).sort((a,b)=>a.date.localeCompare(b.date)).map(v=>({date:v.date,pct:v.completionPct}))}>
                <XAxis dataKey="date" tick={{fill:"#555",fontSize:9}} axisLine={false} tickLine={false}/><YAxis domain={[0,100]} tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false} width={28}/><Tooltip {...TT}/><Line type="monotone" dataKey="pct" stroke="#39FF14" strokeWidth={2} dot={false}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>)}
      </>)}
    </div>
  );
}

// ─── FINANCIALS SCREEN ────────────────────────────────────────────────────────
function FinancialsScreen(){
  const {T,financeMonths,saveFinanceMonths}=useContext(Ctx);
  const [tab,setTab]=useState("overview");
  const [selMonth,setSelMonth]=useState(()=>new Date().toISOString().slice(0,7));
  const H={fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,textTransform:"uppercase"};
  const TT={contentStyle:{background:"#1A1A1A",border:"none",borderRadius:0,color:"#fff",fontSize:11}};

  const curData=financeMonths[selMonth]||{target:0,income:[],expenses:[]};
  const totalIn=curData.income.reduce((s,e)=>s+e.amount,0);
  const totalEx=curData.expenses.reduce((s,e)=>s+e.amount,0);
  const net=totalIn-totalEx;
  const pctOfTarget=curData.target>0?Math.min(100,Math.round(totalIn/curData.target*100)):0;
  const pctColor=p=>p>=100?"#39FF14":p>=75?"#FFD700":"#FF3B5C";

  // Month nav
  const navMonth=dir=>{const[y,m]=selMonth.split('-').map(Number);const d=new Date(y,m-1+dir,1);setSelMonth(d.toISOString().slice(0,7));};
  const monthLabel=k=>{const[y,m]=k.split('-').map(Number);return new Date(y,m-1,1).toLocaleDateString("en-GB",{month:"long",year:"numeric"});};

  const [newLabel,setNewLabel]=useState("");const [newAmt,setNewAmt]=useState("");const [newCat,setNewCat]=useState("Barbershop");
  const [exLabel,setExLabel]=useState("");const [exAmt,setExAmt]=useState("");const [exCat,setExCat]=useState("Personal");

  const save=async(update)=>{
    const updated={...financeMonths,[selMonth]:{...curData,...update}};
    await saveFinanceMonths(updated);
  };
  const addIncome=async()=>{
    if(!newLabel||!newAmt)return;
    await save({income:[...curData.income,{id:String(Date.now()),label:newLabel,amount:parseFloat(newAmt)||0,category:newCat}]});
    setNewLabel("");setNewAmt("");
  };
  const addExpense=async()=>{
    if(!exLabel||!exAmt)return;
    await save({expenses:[...curData.expenses,{id:String(Date.now()),label:exLabel,amount:parseFloat(exAmt)||0,category:exCat}]});
    setExLabel("");setExAmt("");
  };

  // Savings runway: sum of all months' net income (running balance)
  const allMonths=Object.keys(financeMonths).sort();
  const runningBalance=allMonths.reduce((bal,mo)=>{
    const d=financeMonths[mo];
    const inc=(d.income||[]).reduce((s,e)=>s+e.amount,0);
    const ex=(d.expenses||[]).reduce((s,e)=>s+e.amount,0);
    return bal+(inc-ex);
  },0);

  // Last 6 months chart data
  const chartData=Array.from({length:6},(_,i)=>{
    const d=new Date();d.setMonth(d.getMonth()-5+i);
    const mo=d.toISOString().slice(0,7);
    const md=financeMonths[mo]||{income:[],expenses:[]};
    return{month:d.toLocaleDateString("en-GB",{month:"short"}),income:md.income.reduce((s,e)=>s+e.amount,0),expenses:md.expenses.reduce((s,e)=>s+e.amount,0)};
  });

  const IN_CATS=["Barbershop","SU","Other"];
  const EX_CATS=["Brand","Personal","Fixed","Transport","Other"];

  return(
    <div style={{padding:"24px 20px"}}>
      <PageHeader title="FINANCIALS"/>
      <div style={{display:"flex",borderBottom:"1px solid #222",marginBottom:20}}>
        {[["overview","OVERVIEW"],["log","LOG"],["savings","SAVINGS"]].map(([id,l])=>(
          <button key={id} onClick={()=>setTab(id)} style={{flex:1,background:"transparent",border:"none",borderBottom:`2px solid ${tab===id?T.text:"transparent"}`,color:tab===id?T.text:T.sub,padding:"10px 0",marginBottom:-1,...H,fontSize:11,cursor:"pointer",letterSpacing:"0.06em"}}>{l}</button>
        ))}
      </div>

      {tab==="overview"&&(<>
        {/* Month nav */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <button onClick={()=>navMonth(-1)} style={{background:"none",border:"none",color:T.sub,cursor:"pointer",fontSize:20,padding:0}}>‹</button>
          <div style={{...H,fontSize:16}}>{monthLabel(selMonth)}</div>
          <button onClick={()=>navMonth(1)} style={{background:"none",border:"none",color:T.sub,cursor:"pointer",fontSize:20,padding:0}}>›</button>
        </div>
        {/* Stats */}
        <div style={{display:"flex",gap:10,marginBottom:16}}>
          {[["INCOME",totalIn.toLocaleString()+" kr","#39FF14"],["EXPENSES",totalEx.toLocaleString()+" kr","#FF3B5C"],["NET",net.toLocaleString()+" kr",net>=0?"#39FF14":"#FF3B5C"]].map(([l,v,c])=>(
            <div key={l} style={{flex:1,borderTop:`2px solid ${c}`,paddingTop:8}}>
              <div style={{...H,fontSize:9,color:T.sub,letterSpacing:"0.1em",marginBottom:2}}>{l}</div>
              <div style={{...H,fontSize:18,color:c,lineHeight:1}}>{v}</div>
            </div>
          ))}
        </div>
        {/* Target */}
        <div style={{marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <div style={{...H,fontSize:10,color:T.sub,letterSpacing:"0.1em"}}>MONTHLY TARGET</div>
            <input value={curData.target||""} onChange={e=>save({target:parseFloat(e.target.value)||0})} placeholder="0" type="number"
              style={{background:"transparent",border:"none",borderBottom:"1px solid #333",borderRadius:0,padding:"2px 4px",color:T.text,...H,fontSize:13,outline:"none",width:100,textAlign:"right"}}/>
          </div>
          {curData.target>0&&<GlowBar pct={pctOfTarget} color={pctColor(pctOfTarget)}/>}
        </div>
        {/* Chart */}
        {chartData.some(d=>d.income>0)&&(
          <div style={{background:T.card,padding:"16px 8px 8px",marginBottom:16}}>
            <div style={{...H,fontSize:10,color:"#555",paddingLeft:10,marginBottom:8,letterSpacing:"0.1em"}}>INCOME VS EXPENSES</div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={chartData}>
                <XAxis dataKey="month" tick={{fill:"#555",fontSize:9}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:"#555",fontSize:9}} axisLine={false} tickLine={false} width={36}/>
                <Tooltip {...TT}/>
                <Bar dataKey="income" fill="#39FF14" name="Income"/>
                <Bar dataKey="expenses" fill="#FF3B5C" name="Expenses"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        {/* Entries list */}
        {curData.income.length>0&&(<>
          <div style={{...H,fontSize:10,color:T.sub,letterSpacing:"0.1em",marginBottom:8}}>INCOME</div>
          {curData.income.map(e=>(
            <div key={e.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:10,marginBottom:10,borderBottom:`1px solid ${T.div}`}}>
              <div>
                <div style={{...H,fontSize:14}}>{e.label}</div>
                <div style={{color:T.sub,fontSize:11}}>{e.category}</div>
              </div>
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                <div style={{...H,fontSize:16,color:"#39FF14"}}>{e.amount.toLocaleString()} kr</div>
                <button onClick={()=>save({income:curData.income.filter(x=>x.id!==e.id)})} style={{background:"none",border:"none",color:"#444",cursor:"pointer",fontSize:14}}>×</button>
              </div>
            </div>
          ))}
        </>)}
        {curData.expenses.length>0&&(<>
          <div style={{...H,fontSize:10,color:T.sub,letterSpacing:"0.1em",marginBottom:8,marginTop:8}}>EXPENSES</div>
          {curData.expenses.map(e=>(
            <div key={e.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:10,marginBottom:10,borderBottom:`1px solid ${T.div}`}}>
              <div>
                <div style={{...H,fontSize:14}}>{e.label}</div>
                <div style={{color:T.sub,fontSize:11}}>{e.category}</div>
              </div>
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                <div style={{...H,fontSize:16,color:"#FF3B5C"}}>{e.amount.toLocaleString()} kr</div>
                <button onClick={()=>save({expenses:curData.expenses.filter(x=>x.id!==e.id)})} style={{background:"none",border:"none",color:"#444",cursor:"pointer",fontSize:14}}>×</button>
              </div>
            </div>
          ))}
        </>)}
      </>)}

      {tab==="log"&&(<>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <button onClick={()=>navMonth(-1)} style={{background:"none",border:"none",color:T.sub,cursor:"pointer",fontSize:20,padding:0}}>‹</button>
          <div style={{...H,fontSize:16}}>{monthLabel(selMonth)}</div>
          <button onClick={()=>navMonth(1)} style={{background:"none",border:"none",color:T.sub,cursor:"pointer",fontSize:20,padding:0}}>›</button>
        </div>
        <div style={{...H,fontSize:10,color:"#39FF14",letterSpacing:"0.12em",marginBottom:10}}>ADD INCOME</div>
        <div style={{display:"flex",gap:8,marginBottom:8}}>
          <Inp placeholder="Source" value={newLabel} onChange={e=>setNewLabel(e.target.value)} style={{flex:2}}/>
          <Inp placeholder="DKK" value={newAmt} onChange={e=>setNewAmt(e.target.value)} type="number" style={{flex:1}}/>
        </div>
        <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
          {IN_CATS.map(c=><button key={c} onClick={()=>setNewCat(c)} style={{padding:"6px 12px",background:newCat===c?T.text:"transparent",color:newCat===c?T.bg:T.sub,border:`1px solid ${newCat===c?T.text:"#222"}`,borderRadius:0,...H,fontSize:10,cursor:"pointer"}}>{c}</button>)}
        </div>
        <Btn label="Add Income" onClick={addIncome} ghost style={{marginBottom:24}}/>
        <div style={{...H,fontSize:10,color:"#FF3B5C",letterSpacing:"0.12em",marginBottom:10}}>ADD EXPENSE</div>
        <div style={{display:"flex",gap:8,marginBottom:8}}>
          <Inp placeholder="Description" value={exLabel} onChange={e=>setExLabel(e.target.value)} style={{flex:2}}/>
          <Inp placeholder="DKK" value={exAmt} onChange={e=>setExAmt(e.target.value)} type="number" style={{flex:1}}/>
        </div>
        <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
          {EX_CATS.map(c=><button key={c} onClick={()=>setExCat(c)} style={{padding:"6px 12px",background:exCat===c?T.text:"transparent",color:exCat===c?T.bg:T.sub,border:`1px solid ${exCat===c?T.text:"#222"}`,borderRadius:0,...H,fontSize:10,cursor:"pointer"}}>{c}</button>)}
        </div>
        <Btn label="Add Expense" onClick={addExpense} ghost/>
      </>)}

      {tab==="savings"&&(<>
        <div style={{borderTop:"2px solid #39FF14",paddingTop:12,marginBottom:24}}>
          <div style={{...H,fontSize:10,color:T.sub,letterSpacing:"0.1em",marginBottom:4}}>RUNNING BALANCE</div>
          <div style={{...H,fontSize:42,color:runningBalance>=0?"#39FF14":"#FF3B5C",lineHeight:1}}>{runningBalance.toLocaleString()} kr</div>
          <div style={{color:T.sub,fontSize:11,marginTop:4}}>Cumulative net across all logged months</div>
        </div>
        <div style={{...H,fontSize:10,color:T.sub,letterSpacing:"0.12em",marginBottom:14}}>MONTH BY MONTH</div>
        {allMonths.length===0&&<div style={{color:T.sub,fontSize:12}}>Log income and expenses to see savings history.</div>}
        {[...allMonths].reverse().map(mo=>{
          const md=financeMonths[mo];
          const inc=(md.income||[]).reduce((s,e)=>s+e.amount,0);
          const ex=(md.expenses||[]).reduce((s,e)=>s+e.amount,0);
          const n=inc-ex;
          return(
            <div key={mo} style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:12,marginBottom:12,borderBottom:`1px solid ${T.div}`}}>
              <div style={{...H,fontSize:14}}>{monthLabel(mo)}</div>
              <div style={{display:"flex",gap:14,alignItems:"center"}}>
                <div style={{...H,fontSize:13,color:"#39FF14"}}>{inc.toLocaleString()}</div>
                <div style={{...H,fontSize:13,color:"#FF3B5C"}}>-{ex.toLocaleString()}</div>
                <div style={{...H,fontSize:16,color:n>=0?"#39FF14":"#FF3B5C"}}>{n>=0?"+":""}{n.toLocaleString()}</div>
              </div>
            </div>
          );
        })}
      </>)}
    </div>
  );
}

// ─── ME SCREEN ────────────────────────────────────────────────────────────────
function MeScreen(){
  const {T,userName,saveUserName,userDOB,bw,morningLogs,nightLogs,workoutLogs,barberDays,prs,weeklyReviews,soMeVideos,soMeFollowers,goals,go,apiKey,saveApiKey}=useContext(Ctx);
  const H={fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,textTransform:"uppercase"};
  const [editingName,setEditingName]=useState(false);
  const [nameInput,setNameInput]=useState(userName);
  const [showApiInput,setShowApiInput]=useState(false);
  const [apiInput,setApiInput]=useState(apiKey||"");
  const age=computeAge(userDOB);
  const streak=computeStreak(morningLogs,nightLogs);
  const RANK_IDX={"UNTRAINED":0,"BEGINNER":1,"NOVICE":2,"INTERMEDIATE":3,"ADVANCED":4,"ELITE":5};
  const rankedPRs=Object.entries(prs).map(([key,pr])=>{const name=key.replace(/_/g," ");const r=getExerciseRank(name,pr.rm,bw,userDOB);return r&&r.source==="sl"?RANK_IDX[r.n]??null:null;}).filter(x=>x!==null);
  const avgRankIdx=rankedPRs.length?Math.round(rankedPRs.reduce((s,v)=>s+v,0)/rankedPRs.length):null;
  const RANK_LABELS=["UNTRAINED","BEGINNER","NOVICE","INTERMEDIATE","ADVANCED","ELITE"];
  const RANK_COLORS=["#4B5563","#9CA3AF","#60A5FA","#34D399","#F59E0B","#FF3B5C"];
  const latestFollowers=soMeFollowers.length?[...soMeFollowers].sort((a,b)=>b.date.localeCompare(a.date))[0]:null;

  const NavRow=({label,sub,onPress,color})=>(
    <div onClick={onPress} style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:18,marginBottom:18,borderBottom:`1px solid ${T.div}`,cursor:"pointer"}}>
      <div>
        <div style={{...H,fontSize:20,color:color||T.text}}>{label}</div>
        {sub&&<div style={{color:T.sub,fontSize:11,marginTop:2}}>{sub}</div>}
      </div>
      <div style={{color:T.sub,fontSize:18}}>›</div>
    </div>
  );

  return(
    <div style={{padding:"24px 20px"}}>
      <div style={{display:"flex",gap:16,alignItems:"center",marginBottom:24}}>
        <div style={{width:64,height:64,borderRadius:"50%",background:T.inp,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:"1px solid #333"}}>
          <div style={{...H,fontSize:22,color:T.sub}}>{userName.slice(0,2)}</div>
        </div>
        <div style={{flex:1}}>
          {editingName?(
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <input value={nameInput} onChange={e=>setNameInput(e.target.value)} autoFocus
                style={{background:"transparent",border:"none",borderBottom:"1px solid #fff",borderRadius:0,padding:"4px 0",color:T.text,...H,fontSize:24,outline:"none",width:"100%"}}/>
              <button onClick={async()=>{await saveUserName(nameInput.trim()||"SAMMY");setEditingName(false);}} style={{background:"none",border:"none",color:"#39FF14",cursor:"pointer",...H,fontSize:12}}>SAVE</button>
            </div>
          ):(
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{...H,fontSize:28,lineHeight:1}}>{userName}</div>
              <button onClick={()=>{setNameInput(userName);setEditingName(true);}} style={{background:"none",border:"none",color:T.sub,cursor:"pointer",fontSize:14}}>✎</button>
            </div>
          )}
          <div style={{color:T.sub,fontSize:12,marginTop:3}}>Age {age}</div>
        </div>
      </div>

      <div style={{display:"flex",gap:10,marginBottom:24}}>
        <div style={{flex:1,borderTop:"2px solid #FF6B35",paddingTop:8}}>
          <div style={{...H,fontSize:9,color:T.sub,letterSpacing:"0.1em",marginBottom:2}}>STREAK</div>
          <div style={{...H,fontSize:22,color:"#FF6B35"}}>{streak}d</div>
        </div>
        <div style={{flex:1,borderTop:"2px solid #D0D0D0",paddingTop:8}}>
          <div style={{...H,fontSize:9,color:T.sub,letterSpacing:"0.1em",marginBottom:2}}>WEIGHT</div>
          <div style={{...H,fontSize:22}}>{bw}kg</div>
        </div>
        {avgRankIdx!==null&&(
          <div style={{flex:1.5,borderTop:`2px solid ${RANK_COLORS[avgRankIdx]}`,paddingTop:8}}>
            <div style={{...H,fontSize:9,color:T.sub,letterSpacing:"0.1em",marginBottom:2}}>AVG RANK</div>
            <div style={{...H,fontSize:16,color:RANK_COLORS[avgRankIdx],lineHeight:1.1}}>{RANK_LABELS[avgRankIdx]}</div>
          </div>
        )}
      </div>

      <Divider/>
      <NavRow label="PHYSIQUE" sub="Phase tracker · weigh-ins · AI analysis" onPress={()=>go("physique")} color="#FF6B35"/>
      <NavRow label="GOALS" sub={goals.length+" active goals"} onPress={()=>go("goals")} color="#FFD700"/>
      <NavRow label="FINANCIALS" sub="Income · expenses · savings" onPress={()=>go("financials")} color="#39FF14"/>
      <NavRow label="SOCIAL MEDIA" sub={soMeVideos.length+" videos"+(latestFollowers?" · TT EN "+(latestFollowers.tiktokEN||latestFollowers.tiktok||0).toLocaleString()+" · TT DK "+(latestFollowers.tiktokDK||0).toLocaleString()+" · IG "+(latestFollowers.reels||0).toLocaleString():"")} onPress={()=>go("some")} color="#A78BFA"/>
      <NavRow label="QUOTE VAULT" sub="Quotes that shape the mentality" onPress={()=>go("quotes")} color="#7DF9FF"/>
      <Divider/>

      {/* API Key settings */}
      <div style={{marginBottom:20}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div style={{...H,fontSize:10,color:T.sub,letterSpacing:"0.12em"}}>CLAUDE API KEY</div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            {apiKey&&<div style={{...H,fontSize:10,color:"#39FF14"}}>✓ SET</div>}
            <button onClick={()=>setShowApiInput(!showApiInput)} style={{background:"none",border:"none",color:T.sub,cursor:"pointer",...H,fontSize:10,letterSpacing:"0.06em"}}>{showApiInput?"HIDE":"EDIT"}</button>
          </div>
        </div>
        {showApiInput&&(
          <div style={{display:"flex",gap:8}}>
            <input value={apiInput} onChange={e=>setApiInput(e.target.value)} placeholder="sk-ant-..." type="password"
              style={{flex:1,background:T.inp,border:"none",borderBottom:"1px solid #333",borderRadius:0,padding:"10px 8px",color:T.text,fontFamily:"'Barlow',sans-serif",fontSize:12,outline:"none"}}/>
            <button onClick={async()=>{await saveApiKey(apiInput.trim());setShowApiInput(false);}}
              style={{padding:"0 16px",background:T.text,color:T.bg,border:"none",borderRadius:0,...H,fontSize:11,cursor:"pointer"}}>SAVE</button>
          </div>
        )}
        {!apiKey&&<div style={{color:"#FF3B5C",fontSize:10,marginTop:4,fontFamily:"'Barlow Condensed',sans-serif"}}>Required for all AI analysis features. Get yours at console.anthropic.com</div>}
      </div>

      <Divider/>
      <div style={{...H,fontSize:10,color:T.sub,letterSpacing:"0.12em",marginBottom:14}}>APP STATS</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
        {[["MORNING LOGS",morningLogs.length,"#7DF9FF"],["NIGHT LOGS",nightLogs.length,"#D0D0D0"],["WORKOUTS",workoutLogs.length,"#FF6B35"],["BARBER SESSIONS",barberDays.length,"#A78BFA"],["WEEKLY REVIEWS",weeklyReviews.length,"#FFD700"]].map(([l,v,c])=>(
          <div key={l} style={{width:"calc(50% - 5px)",borderTop:`2px solid ${c}`,paddingTop:8,marginBottom:8}}>
            <div style={{...H,fontSize:9,color:T.sub,letterSpacing:"0.08em",marginBottom:2}}>{l}</div>
            <div style={{...H,fontSize:26,color:c}}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GoalsScreen(){
  const {T,goals,saveGoals,comingSoon,saveComingSoon}=useContext(Ctx);
  const [adding,setAdding]=useState(false);
  const [name,setName]=useState("");const [target,setTarget]=useState("");const [unit,setUnit]=useState("");
  const [updating,setUpdating]=useState(null);const [newVal,setNewVal]=useState("");
  const [editField,setEditField]=useState(null); // {id, field}

  const add=async()=>{if(!name||!target)return;await saveGoals([...goals,{id:String(Date.now()),name,target:parseFloat(target),unit,current:0}]);setName("");setTarget("");setUnit("");setAdding(false);};
  const upd=async id=>{await saveGoals(goals.map(g=>g.id===id?{...g,current:parseFloat(newVal)||g.current}:g));setUpdating(null);setNewVal("");};
  const del=async id=>saveGoals(goals.filter(g=>g.id!==id));
  const H={fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,textTransform:"uppercase"};
  const inpSt={background:"transparent",border:"none",borderBottom:"1px solid #555",borderRadius:0,padding:"2px 0",color:"#fff",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,outline:"none"};

  return(
    <div style={{padding:"24px 20px"}}>
      <PageHeader title="GOALS"/>
      {goals.map(g=>{
        const pct=Math.min(100,Math.round((g.current/g.target)*100));
        const c=pct>=100?"#39FF14":pct>=75?"#FFD700":"#FF6B35";
        const isEditName=editField?.id===g.id&&editField?.field==="name";
        const isEditTarget=editField?.id===g.id&&editField?.field==="target";
        return(
          <div key={g.id} style={{paddingBottom:14,marginBottom:14,borderBottom:`1px solid ${T.div}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
              {isEditName?(
                <input autoFocus value={g.name} style={{...inpSt,fontSize:15,width:"70%"}}
                  onChange={e=>saveGoals(goals.map(x=>x.id===g.id?{...x,name:e.target.value}:x))}
                  onBlur={()=>setEditField(null)} onKeyDown={e=>e.key==="Enter"&&setEditField(null)}/>
              ):(
                <div onClick={()=>setEditField({id:g.id,field:"name"})} style={{...H,fontSize:15,color:"#fff",cursor:"pointer"}}>{g.name}</div>
              )}
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{...H,fontSize:22,color:c,lineHeight:1}}>{pct}%</div>
                <button onClick={()=>del(g.id)} style={{background:"none",border:"none",color:"#444",cursor:"pointer",fontSize:16}}>×</button>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
              <div style={{color:"#888",fontSize:12}}>{g.current.toLocaleString()} /</div>
              {isEditTarget?(
                <input autoFocus value={String(g.target)} style={{...inpSt,fontSize:12,width:60}}
                  onChange={e=>saveGoals(goals.map(x=>x.id===g.id?{...x,target:parseFloat(e.target.value)||x.target}:x))}
                  onBlur={()=>setEditField(null)} onKeyDown={e=>e.key==="Enter"&&setEditField(null)} type="number"/>
              ):(
                <div onClick={()=>setEditField({id:g.id,field:"target"})} style={{color:"#888",fontSize:12,cursor:"pointer",borderBottom:"1px dotted #444"}}>{g.target.toLocaleString()} {g.unit}</div>
              )}
            </div>
            <div style={{height:2,background:T.div,overflow:"hidden",marginBottom:8}}>
              <div style={{width:"100%",height:"100%",background:"linear-gradient(to right,#5C0000 0%,#CC0000 18%,#FF6B35 40%,#FFD700 65%,#39FF14 100%)",transform:`translateX(${pct-100}%)`,transition:"transform 0.4s ease"}}/>
            </div>
            {updating===g.id?(
              <div style={{display:"flex",gap:8,marginTop:8}}>
                <Inp placeholder={`Current ${g.unit}`} value={newVal} onChange={e=>setNewVal(e.target.value)} type="number"/>
                <Btn label="Save" onClick={()=>upd(g.id)} style={{width:"auto",padding:"8px 16px"}}/>
                <button onClick={()=>setUpdating(null)} style={{background:"none",border:"none",color:T.sub,cursor:"pointer",fontSize:16}}>✕</button>
              </div>
            ):(
              <button onClick={()=>{setUpdating(g.id);setNewVal(String(g.current));}}
                style={{background:"none",border:"1px solid #333",borderRadius:0,padding:"5px 12px",color:"#888",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:10,textTransform:"uppercase",cursor:"pointer",letterSpacing:"0.08em"}}>
                UPDATE PROGRESS
              </button>
            )}
          </div>
        );
      })}
      {adding?(
        <div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:18,textTransform:"uppercase",marginBottom:14}}>New Goal</div>
          <Inp placeholder="Goal name" value={name} onChange={e=>setName(e.target.value)} style={{display:"block",width:"100%",marginBottom:8}}/>
          <div style={{display:"flex",gap:8,marginBottom:14}}>
            <Inp placeholder="Target" value={target} onChange={e=>setTarget(e.target.value)} type="number"/>
            <Inp placeholder="Unit (kg, DKK...)" value={unit} onChange={e=>setUnit(e.target.value)}/>
          </div>
          <div style={{display:"flex",gap:8}}>
            <Btn label="Add Goal" onClick={add} style={{flex:1}}/>
            <Btn label="Cancel" onClick={()=>setAdding(false)} ghost style={{flex:0.5}}/>
          </div>
        </div>
      ):(
        <Btn label="+ Add Goal" onClick={()=>setAdding(true)}/>
      )}

      {/* IMPORTANT EVENTS */}
      <Divider/>
      <div style={{...H,fontSize:11,color:T.sub,letterSpacing:"0.12em",marginBottom:14}}>IMPORTANT EVENTS</div>
      {(comingSoon||[]).map(item=>(
        <div key={item.id} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",paddingBottom:14,marginBottom:14,borderBottom:'1px solid '+T.div}}>
          <div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:18,lineHeight:1.2}}>{item.text}</div>
            {item.date&&<div style={{color:T.sub,fontSize:12,marginTop:3}}>{item.date}</div>}
          </div>
          <button onClick={()=>saveComingSoon(comingSoon.filter(x=>x.id!==item.id))}
            style={{background:"none",border:"none",color:"#444",cursor:"pointer",fontSize:18,padding:"0 2px"}}>×</button>
        </div>
      ))}
      <AddEvent saveComingSoon={saveComingSoon} comingSoon={comingSoon}/>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function KataokaApp(){
  const [dark,setDark]=useState(true);
  const [screen,setScreen]=useState("home");
  const [history,setHistory]=useState(["home"]);
  const [screenData,setScreenData]=useState(null);
  const [activeTab,setActiveTab]=useState("home");
  const [templates,setTemplates]=useState(DEFAULT_TEMPLATES);
  const [workoutLogs,setWorkoutLogs]=useState([]);
  const [prs,setPrs]=useState({});
  const [barberWeeks,setBarberWeeks]=useState([]);
  const [barberIncome,setBarberIncome]=useState([]);
  const [barberDays,setBarberDays]=useState([]);
  const [morningLogs,setMorningLogs]=useState([]);
  const [nightLogs,setNightLogs]=useState([]);
  const [goals,setGoals]=useState([]);
  const [comingSoon,setComingSoon]=useState([]);
  const [bw,setBw]=useState(65);
  const [userDOB,setUserDOB]=useState("2007-06-13");
  const [prAlert,setPrAlert]=useState(null);
  const [userName,setUserName]=useState("SAMMY");
  const [quotes,setQuotes]=useState([]);
  const [weeklyReviews,setWeeklyReviews]=useState([]);
  const [soMeVideos,setSoMeVideos]=useState([]);
  const [soMeFollowers,setSoMeFollowers]=useState([]);
  const [habits,setHabits]=useState({});
  const [hrvLogs,setHrvLogs]=useState([]);
  const [financeMonths,setFinanceMonths]=useState({});
  const [appNotes,setAppNotes]=useState("");
  const [apiKey,setApiKey]=useState("");
  const [ghealthConnected,setGhealthConnected]=useState(false);
  const [ghealthSyncing,setGhealthSyncing]=useState(false);
  const [ghealthError,setGhealthError]=useState(null);
  const [ghealthDebug,setGhealthDebug]=useState(null);

  useEffect(()=>{
    const load=async()=>{
      const [t,wl,pr,bwks,bi,ml,nl,g,bwt,dp,bd,cs,dob,un,qt,wr,sv,sf,hb,hrv,fm,an,ak]=await Promise.all([
        S.get("templates"),S.get("workout_logs"),S.get("prs"),
        S.get("barber_weeks"),S.get("barber_income"),
        S.get("morning_logs"),S.get("night_logs"),
        S.get("goals"),S.get("bodyweight"),S.get("dark"),S.get("barber_days"),S.get("coming_soon"),S.get("user_dob"),S.get("user_name"),S.get("quotes"),S.get("weekly_reviews"),S.get("some_videos"),S.get("some_followers"),S.get("habits"),S.get("hrv_logs"),S.get("finance_months"),S.get("app_notes"),S.get("api_key"),
      ]);
      if(t?.length)setTemplates(t);
      if(wl)setWorkoutLogs(wl);if(pr)setPrs(pr);
      if(bwks)setBarberWeeks(bwks);if(bi)setBarberIncome(bi);if(bd)setBarberDays(bd);
      if(ml)setMorningLogs(ml);if(nl)setNightLogs(nl);
      if(g)setGoals(g);if(bwt)setBw(bwt);if(dp!==null)setDark(dp);if(cs)setComingSoon(cs);if(dob)setUserDOB(dob);if(un)setUserName(un);if(qt)setQuotes(qt);if(wr)setWeeklyReviews(wr);if(sv)setSoMeVideos(sv);if(sf)setSoMeFollowers(sf);if(hb)setHabits(hb);if(hrv)setHrvLogs(hrv);if(fm)setFinanceMonths(fm);if(an)setAppNotes(an);if(ak)setApiKey(ak);
    };
    load();
    const link=document.createElement("link");
    link.href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;800;900&family=Barlow:wght@300;400;500&display=swap";
    link.rel="stylesheet";document.head.appendChild(link);

    // Check if we're connected already
    S.get("ghealth_tokens").then(t=>{if(t?.refresh_token)setGhealthConnected(true);});

    // Handle OAuth redirect callback (Google sends ?code=... back to this URL)
    const urlParams=new URLSearchParams(window.location.search);
    const code=urlParams.get("code");
    const oauthError=urlParams.get("error");
    if(oauthError){
      setGhealthError("Connection cancelled or denied");
      window.history.replaceState({},"",window.location.pathname);
    } else if(code){
      ghealthExchangeCode(code).then(()=>{
        setGhealthConnected(true);
        setGhealthError(null);
        window.history.replaceState({},"",window.location.pathname);
      }).catch(e=>{
        setGhealthError("Connection failed: "+e.message);
        window.history.replaceState({},"",window.location.pathname);
      });
    }
  },[]);

  const T={
    bg:dark?"#0A0A0A":"#F8F8F8",
    text:dark?"#FFFFFF":"#000000",
    sub:dark?"#666":"#999",
    inp:dark?"#141414":"#EBEBEB",
    div:dark?"#1A1A1A":"#E0E0E0",
    bg2:dark?"#0D0D0D":"#FFF",
    card:dark?"#111111":"#EDEDED",
  };

  const go=(s,data=null)=>{setScreen(s);setScreenData(data);setHistory(h=>[...h,s]);};
  const back=()=>setHistory(h=>{const n=h.slice(0,-1);setScreen(n[n.length-1]||"home");return n;});
  const tab=t=>{setActiveTab(t);setScreen(t);setHistory([t]);setScreenData(null);};

  const saveTemplates=async v=>{setTemplates(v);await S.set("templates",v);};
  const saveLogs=async v=>{setWorkoutLogs(v);await S.set("workout_logs",v);};
  const saveBarberWeeks=async v=>{setBarberWeeks(v);await S.set("barber_weeks",v);};
  const saveBarberIncome=async v=>{setBarberIncome(v);await S.set("barber_income",v);};
  const saveBarberDays=async v=>{setBarberDays(v);await S.set("barber_days",v);};
  const saveMorningLogs=async v=>{setMorningLogs(v);await S.set("morning_logs",v);};
  // Sync a single date's Fitbit data into that day's morning log. Returns true if any data was found.
  const ghealthSyncDate=async(dateStr,currentLogs)=>{
    const [sleep,rhr,hrv]=await Promise.all([
      ghealthFetchSleep(dateStr),
      ghealthFetchRestingHR(dateStr),
      ghealthFetchHRV(dateStr),
    ]);
    setGhealthDebug({date:dateStr,sleep:sleep?{hours:sleep.sleep,bedtime:sleep.bedtime}:"null",rhr:rhr??null,hrv:hrv??null});
    if(!sleep&&rhr==null&&hrv==null)return{found:false,log:null};
    const existing=currentLogs.find(l=>l.date===dateStr)||{date:dateStr};
    const merged={
      ...existing,
      ...(sleep?{
        sleep:sleep.sleep,bedtime:sleep.bedtime,wakeTime:sleep.wakeTime,
        ...(sleep.sleepStages?{sleepStages:sleep.sleepStages}:{}),
        ...(sleep.minutesAsleep!=null?{minutesAsleep:sleep.minutesAsleep}:{}),
      }:{}),
      ...(rhr!=null?{restingHR:rhr}:{}),
      ...(hrv!=null?{hrv:hrv}:{}),
    };
    return{found:true,log:merged};
  };

  const ghealthSyncToday=async()=>{
    setGhealthSyncing(true);setGhealthError(null);
    try{
      const dateStr=todayStr();
      const{found,log}=await ghealthSyncDate(dateStr,morningLogs);
      if(!found){
        setGhealthError("No data found for today yet — your Charge 6 may not have synced");
        setGhealthSyncing(false);
        return false;
      }
      await saveMorningLogs([...morningLogs.filter(l=>l.date!==dateStr),log]);
      setGhealthSyncing(false);
      return true;
    }catch(e){
      setGhealthError("Sync failed: "+e.message);
      setGhealthSyncing(false);
      return false;
    }
  };

  // Sync the last 7 days at once — built for a Sunday catch-up, fills in any day
  // you forgot to log manually using whatever Fitbit/Google Health has recorded.
  const ghealthSyncWeek=async()=>{
    setGhealthSyncing(true);setGhealthError(null);
    try{
      const today=new Date();
      const dates=[];
      for(let i=0;i<7;i++){
        const d=new Date(today);
        d.setDate(d.getDate()-i);
        dates.push(d.toISOString().split("T")[0]);
      }
      let workingLogs=[...morningLogs];
      let daysFound=0;
      for(const dateStr of dates){
        const{found,log}=await ghealthSyncDate(dateStr,workingLogs);
        if(found){
          workingLogs=[...workingLogs.filter(l=>l.date!==dateStr),log];
          daysFound++;
        }
      }
      if(daysFound===0){
        setGhealthError("No data found for the past week — check your Charge 6 has synced recently");
        setGhealthSyncing(false);
        return false;
      }
      await saveMorningLogs(workingLogs);
      setGhealthSyncing(false);
      setGhealthError(null);
      return daysFound;
    }catch(e){
      setGhealthError("Week sync failed: "+e.message);
      setGhealthSyncing(false);
      return false;
    }
  };
  const ghealthDoConnect=()=>ghealthConnect();
  const ghealthDoDisconnect=async()=>{await ghealthDisconnect();setGhealthConnected(false);};
  const saveNightLogs=async v=>{setNightLogs(v);await S.set("night_logs",v);};
  const saveGoals=async v=>{setGoals(v);await S.set("goals",v);};
  const saveComingSoon=async v=>{setComingSoon(v);await S.set("coming_soon",v);};
  const saveDOB=async v=>{setUserDOB(v);await S.set("user_dob",v);};
  const saveBw=async v=>{setBw(v);await S.set("bodyweight",v);};
  const saveUserName=async v=>{setUserName(v);await S.set("user_name",v);};
  const saveQuotes=async v=>{setQuotes(v);await S.set("quotes",v);};
  const saveWeeklyReviews=async v=>{setWeeklyReviews(v);await S.set("weekly_reviews",v);};
  const saveSoMeVideos=async v=>{setSoMeVideos(v);await S.set("some_videos",v);};
  const saveSoMeFollowers=async v=>{setSoMeFollowers(v);await S.set("some_followers",v);};
  const saveHabits=async v=>{setHabits(v);await S.set("habits",v);};
  const saveHrvLogs=async v=>{setHrvLogs(v);await S.set("hrv_logs",v);};
  const saveFinanceMonths=async v=>{setFinanceMonths(v);await S.set("finance_months",v);};
  const saveAppNotes=async v=>{setAppNotes(v);await S.set("app_notes",v);};
  const saveApiKey=async v=>{setApiKey(v);await S.set("api_key",v);};

  const checkPR=async(name,weight,reps)=>{
    const rm=epley(weight,reps);
    const key=name.toLowerCase().replace(/\s+/g,"_");
    const cur=prs[key];
    if(!cur||rm>cur.rm){
      const np={...prs,[key]:{rm,weight,reps,date:new Date().toISOString()}};
      setPrs(np);await S.set("prs",np);
      const isPow=POWER.some(l=>name.toLowerCase().includes(l.split(" ")[0].toLowerCase()));
      setPrAlert({exercise:name,weight,reps,rm,rank:isPow?getRank(rm/bw):null});
      setTimeout(()=>setPrAlert(null),4500);
    }
  };

  // Commit a whole workout's sets at once: update PRs in one pass, surface one celebration.
  const commitWorkout=async(entries)=>{
    const best={};
    for(const e of entries){
      if(!e.weight||!e.reps)continue;
      const rm=epley(e.weight,e.reps);
      const k=e.name.toLowerCase().replace(/\s+/g,"_");
      if(!best[k]||rm>best[k].rm)best[k]={name:e.name,weight:e.weight,reps:e.reps,rm};
    }
    // Derive which exercise keys actually exist across all logged sessions
    const loggedKeys=new Set();
    workoutLogs.forEach(log=>{
      Object.entries(log.exerciseNames||{}).forEach(([eid,name])=>{
        const filled=(log.sets?.[eid]||[]).filter(s=>s.weight&&s.reps);
        if(filled.length)loggedKeys.add(name.toLowerCase().replace(/\s+/g,"_"));
      });
    });
    // Strip any PR key that has no logged data (e.g. after log deletion)
    const np=Object.fromEntries(Object.entries(prs).filter(([k])=>loggedKeys.has(k)));
    const newPRs=[];
    for(const [k,v] of Object.entries(best)){
      if(!np[k]||v.rm>np[k].rm){
        np[k]={rm:v.rm,weight:v.weight,reps:v.reps,date:new Date().toISOString()};
        const isPow=POWER.some(l=>v.name.toLowerCase().includes(l.split(" ")[0].toLowerCase()));
        newPRs.push({exercise:v.name,weight:v.weight,reps:v.reps,rm:v.rm,rank:isPow?getRank(v.rm/bw):null});
      }
    }
    setPrs(np);await S.set("prs",np);
    if(newPRs.length){
      newPRs.sort((a,b)=>b.rm-a.rm);
      setPrAlert({...newPRs[0],extra:newPRs.length-1});
      setTimeout(()=>setPrAlert(null),4500);
    }
  };

  const resetAllData=async()=>{setWorkoutLogs([]);await S.set("workout_logs",[]);setPrs({});await S.set("prs",{});};
  const resetPRs=async()=>{setPrs({});await S.set("prs",{});};

  const ctx={T,dark,setDark,screen,screenData,go,back,tab,activeTab,
    templates,saveTemplates,workoutLogs,saveLogs,prs,checkPR,commitWorkout,resetAllData,resetPRs,
    barberWeeks,saveBarberWeeks,barberIncome,saveBarberIncome,barberDays,saveBarberDays,
    morningLogs,saveMorningLogs,nightLogs,saveNightLogs,goals,saveGoals,comingSoon,saveComingSoon,userDOB,saveDOB,bw,saveBw,userName,saveUserName,quotes,saveQuotes,weeklyReviews,saveWeeklyReviews,soMeVideos,saveSoMeVideos,soMeFollowers,saveSoMeFollowers,habits,saveHabits,hrvLogs,saveHrvLogs,financeMonths,saveFinanceMonths,appNotes,saveAppNotes,apiKey,saveApiKey,
    ghealthConnected,ghealthSyncing,ghealthError,ghealthDebug,ghealthSyncToday,ghealthSyncWeek,ghealthDoConnect,ghealthDoDisconnect};

  const SCREENS={home:HomeScreen,workout:WorkoutHome,"workout-log":LogChoose,"workout-edit-templates":EditTemplates,"workout-ranks":RankExplainerScreen,"workout-templates":TemplatePick,"workout-active":ActiveWorkout,"workout-history":WorkoutHistory,"workout-session":WorkoutSession,"workout-progress":ProgressTracker,"workout-create":CreateTemplate,"workout-exercise":ExerciseProgress,barber:BarberScreen,daily:DailyScreen,health:HealthScreen,goals:GoalsScreen,me:MeScreen,quotes:QuoteVaultScreen,some:SoMeScreen,financials:FinancialsScreen,physique:PhysiqueScreen};
  const Screen=SCREENS[screen]||HomeScreen;

  const TABS=[{id:"home",icon:"⌂",label:"HOME"},{id:"workout",icon:"🏋️",label:"TRAIN"},{id:"barber",icon:"✂️",label:"BARBER"},{id:"daily",icon:"📋",label:"LOG"},{id:"me",icon:"◉",label:"ME"}];

  return(
    <Ctx.Provider value={ctx}>
      <div style={{fontFamily:"'Barlow',sans-serif",background:T.bg,color:T.text,minHeight:"100vh",maxWidth:430,margin:"0 auto",position:"relative"}}>
        <style>{`*{box-sizing:border-box;margin:0;padding:0;} input,textarea{font-family:'Barlow',sans-serif!important;color:inherit;} textarea{resize:vertical;} ::-webkit-scrollbar{width:0;}`}</style>
        <div style={{height:"calc(100vh - 66px)",overflowY:"auto",overflowX:"hidden"}}>
          <Screen/>
        </div>
        {/* Bottom nav */}
        <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:dark?"rgba(10,10,10,0.97)":"rgba(248,248,248,0.97)",backdropFilter:"blur(16px)",borderTop:`1px solid ${T.div}`,display:"flex",zIndex:200}}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>tab(t.id)} style={{flex:1,padding:"9px 4px 12px",background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
              <span style={{fontSize:17}}>{t.icon}</span>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:9,letterSpacing:"0.04em",color:activeTab===t.id?T.text:T.sub}}>{t.label}</span>
              {activeTab===t.id&&<div style={{width:3,height:3,borderRadius:"50%",background:T.text,marginTop:1}}/>}
            </button>
          ))}
        </div>
        {/* PR overlay */}
        {prAlert&&(
          <div onClick={()=>setPrAlert(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.95)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",padding:32}}>
            <div style={{fontSize:64,marginBottom:12}}>🏆</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:52,color:"#FFD700",lineHeight:1}}>NEW PR</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:15,color:"#666",marginTop:8,textTransform:"uppercase",letterSpacing:"0.1em"}}>{prAlert.exercise}</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:72,color:"#fff",lineHeight:1,margin:"18px 0 4px"}}>
              {prAlert.weight}<span style={{fontSize:30,color:"#444"}}>kg</span>
            </div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,color:"#555"}}>×{prAlert.reps} · ~{Math.round(prAlert.rm)}kg 1RM</div>
            {prAlert.rank&&(
              <div style={{marginTop:20,background:T.card,borderRadius:0,padding:"16px 36px",textAlign:"center",border:`2px solid ${prAlert.rank.c}`}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:34,color:prAlert.rank.c}}>{prAlert.rank.n}</div>
                <div style={{color:"#444",fontSize:10,marginTop:3,letterSpacing:"0.1em"}}>STRENGTH RANK</div>
              </div>
            )}
            {prAlert.extra>0&&<div style={{marginTop:16,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:14,color:"#39FF14",letterSpacing:"0.05em"}}>+{prAlert.extra} MORE PR{prAlert.extra>1?"S":""} THIS SESSION</div>}
            <div style={{color:"#333",fontSize:11,marginTop:24,fontFamily:"'Barlow Condensed',sans-serif"}}>TAP TO DISMISS</div>
          </div>
        )}
      </div>
    </Ctx.Provider>
  );
}
