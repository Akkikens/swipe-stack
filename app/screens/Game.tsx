
import React, { useMemo, useRef, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Haptics from 'expo-haptics';
import PrimaryButton from '../components/PrimaryButton';
import { track } from '../services/analytics';
import { useGameStore } from '../store/useGameStore';
import { useUIStore } from '../store/useUIStore';
import { loadTuning } from '../services/remoteConfig';
import { showRewarded } from '../services/ads';

export default function Game({ route, navigation }: any){
  const webref = useRef<WebView>(null);
  const setBest = useGameStore(s=>s.setBest);
  const { setShowPaywall } = useUIStore();
  const mode = route?.params?.mode ?? 'endless';

  const html = useMemo(()=> buildHtml(), []);

  useEffect(()=>{ track('run_start', { mode }); },[]);

  function onMessage(e:any){
    let data;
    try{ data = JSON.parse(e.nativeEvent.data) }catch{ return; }
    if (data.type === 'SCORE'){ setBest(data.value); }
    if (data.type === 'PERFECT'){ Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); track('perfect'); }
    if (data.type === 'TRIM'){ Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); track('trim'); }
    if (data.type === 'FAIL'){
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      track('collapse', { height: data.height });
    }
    if (data.type === 'REVIVE_REQUEST'){
      showRewarded().then(ok=>{
        if (ok) webref.current?.postMessage(JSON.stringify({type:'REVIVE'}));
      });
    }
  }

  async function injectTuning(){
    const t = await loadTuning();
    webref.current?.injectJavaScript(`window.__TUNING__ = ${JSON.stringify(t)}; true;`);
  }

  return (
    <SafeAreaView style={styles.wrap}>
      <View style={styles.header}>
        <PrimaryButton title="Back" variant="ghost" onPress={()=> navigation.back()} />
        <Text style={styles.title}>Mode: {mode}</Text>
        <PrimaryButton title="Go Pro" variant="ghost" onPress={()=> setShowPaywall(true)} />
      </View>
      <WebView
        ref={webref}
        originWhitelist={['*']}
        source={{ html }}
        onLoadEnd={injectTuning}
        onMessage={onMessage}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled
        allowFileAccess
        style={styles.web}
      />
    </SafeAreaView>
  );
}

function buildHtml(){
  return `
<!doctype html>
<html>
<head>
  <meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1'>
  <style>
    html, body, canvas { margin:0; padding:0; background:#0B0F17; height:100%; overflow:hidden; }
    #hud { position: absolute; top: 8px; left: 0; right: 0; color: #fff; text-align:center; font-family: -apple-system, system-ui, Helvetica; font-weight: 800; text-shadow: 0 2px 8px rgba(0,0,0,.4) }
    #revive { position:absolute; bottom:16px; left:50%; transform: translateX(-50%); background:#7C3AED; color:#fff; border-radius:14px; padding:12px 16px; font-family:-apple-system; display:none; }
  </style>
</head>
<body>
  <canvas id='c'></canvas>
  <div id="hud">0</div>
  <button id="revive">Revive (watch ad)</button>
<script>
const send = (msg)=> window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify(msg));
let T = { baseSwayDeg:1.6, swayPerLevel:0.3, swayCapDeg:9, perfectShrinkPct:2.5, minBlockWidthPx:28, missTolerancePxStart:8, missTolerancePxEnd:3, perfectSlowMo:0.35, slowMoMinStreak:3, revivePerRun:1 };
if (window.__TUNING__) T = Object.assign(T, window.__TUNING__);

const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
const hud = document.getElementById('hud');
const reviveBtn = document.getElementById('revive');

let W, H, centerX;
function resize(){
  W = window.innerWidth; H = window.innerHeight; canvas.width=W; canvas.height=H; centerX = W/2;
}
window.addEventListener('resize', resize); resize();

// game state
let stack = [];
let current = null;
let baseWidth = Math.min(280, Math.floor(W*0.8));
let platform = { x: centerX - baseWidth/2, y: H - 120, w: baseWidth, h: 16 };
let level = 1;
let running = true;
let score = 0;
let perfectStreak = 0;
let timeScale = 1;
let revivesLeft = T.revivePerRun;

function reset(){
  stack = [];
  baseWidth = Math.min(280, Math.floor(W*0.8));
  platform = { x: centerX - baseWidth/2, y: H - 120, w: baseWidth, h: 16 };
  level = 1; running = true; score = 0; perfectStreak = 0; timeScale=1; revivesLeft = T.revivePerRun;
  spawnBlock();
  hud.textContent = '0';
  reviveBtn.style.display = 'none';
}

function spawnBlock(){
  const w = platform.w;
  current = { x: centerX - w/2, y: 80, w, h: 22, vx: 0, vy: 0, dropping:false, swayPhase: 0 };
}

function drop(){
  if (!current || current.dropping) return;
  current.dropping = true;
  current.vy = 420;
}

canvas.addEventListener('touchstart', onDown, {passive:true});
canvas.addEventListener('touchmove', onMove, {passive:true});
canvas.addEventListener('touchend', onUp, {passive:true});
let startX=0,startY=0, vx=0;
function onDown(e){ const t=e.touches[0]; startX=t.clientX; startY=t.clientY; }
function onMove(e){ const t=e.touches[0]; vx = (t.clientX - startX) * 4; }
function onUp(e){ current.vx = vx; drop(); vx=0; }

reviveBtn.addEventListener('click', ()=>{
  send({type:'REVIVE_REQUEST'});
});

function update(dt){
  if (!current) return;
  // sway platform
  const sway = Math.min(T.swayCapDeg, T.baseSwayDeg + (level-1)*T.swayPerLevel);
  platform.angle = Math.sin(performance.now()*0.001)*sway * Math.PI/180;

  if (!current.dropping){
    current.swayPhase += dt * 0.003;
    current.x = centerX - current.w/2 + Math.sin(current.swayPhase) * 40;
  }else{
    current.x += current.vx * dt/1000;
    current.y += current.vy * dt/1000;
    current.vy += 980 * dt/1000; // gravity
    if (current.y + current.h >= platform.y){
      const left = Math.max(current.x, platform.x);
      const right = Math.min(current.x + current.w, platform.x + platform.w);
      const overlap = right - left;
      const tol = T.missTolerancePxStart - (T.missTolerancePxStart - T.missTolerancePxEnd) * Math.min(1, level/30);
      if (overlap <= 0 || overlap < tol){
        running = false;
        reviveBtn.style.display = revivesLeft>0 ? 'block' : 'none';
        send({type:'FAIL', height: score});
        return;
      }
      const centerOffset = Math.abs((current.x + current.w/2) - (platform.x + platform.w/2));
      if (centerOffset <= 3){
        perfectStreak++;
        platform.w = Math.max(T.minBlockWidthPx, platform.w * (1 - T.perfectShrinkPct/100));
        timeScale = perfectStreak >= T.slowMoMinStreak ? T.perfectSlowMo : 1;
        send({type:'PERFECT'});
      }else if (overlap < current.w){
        perfectStreak = 0; timeScale=1;
        platform.x = left;
        platform.w = overlap;
        send({type:'TRIM'});
      }else{
        perfectStreak = 0; timeScale=1;
      }
      score += Math.round(10 + level*1.2 + Math.max(0, perfectStreak-1)*3);
      hud.textContent = String(score);
      send({type:'SCORE', value: score});
      level++;
      stack.push({x: current.x, y: current.y, w: current.w, h: current.h});
      platform.y -= 24;
      spawnBlock();
    }
  }
}

function draw(){
  ctx.clearRect(0,0,W,H);
  const g = ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#0B0F17');
  g.addColorStop(1,'#111827');
  ctx.fillStyle = g;
  ctx.fillRect(0,0,W,H);

  for (const b of stack){
    ctx.fillStyle = '#1F2937';
    roundRect(b.x, b.y, b.w, b.h, 6);
    ctx.fill();
  }

  ctx.save();
  ctx.translate(platform.x + platform.w/2, platform.y + platform.h/2);
  ctx.rotate(platform.angle||0);
  ctx.fillStyle = '#7C3AED';
  roundRect(-platform.w/2, -platform.h/2, platform.w, platform.h, 8);
  ctx.fill();
  ctx.restore();

  if (current){
    ctx.fillStyle = '#8B5CF6';
    roundRect(current.x, current.y, current.w, current.h, 6);
    ctx.fill();
  }
}

function roundRect(x,y,w,h,r){
  const rr = Math.min(r, w/2, h/2);
  ctx.beginPath();
  ctx.moveTo(x+rr,y);
  ctx.arcTo(x+w,y, x+w,y+h, rr);
  ctx.arcTo(x+w,y+h, x,y+h, rr);
  ctx.arcTo(x,y+h, x,y, rr);
  ctx.arcTo(x,y, x+w,y, rr);
  ctx.closePath();
}

let last = performance.now();
function loop(now){
  const dt = Math.min(32, now-last); last = now;
  if (running){
    update(dt * timeScale);
    draw();
    requestAnimationFrame(loop);
  }else{
    draw();
  }
}
reset();
requestAnimationFrame(loop);

window.addEventListener('message', (e)=>{
  try{
    const m = JSON.parse(e.data);
    if (m.type === 'REVIVE' && !running && revivesLeft>0){
      revivesLeft--;
      running = true;
      timeScale=1;
      reviveBtn.style.display='none';
      requestAnimationFrame(loop);
      send({type:'revive'});
    }
  }catch{}
});
</script>
</body>
</html>
`;
}

const styles = StyleSheet.create({
  wrap:{ flex:1, backgroundColor:'#0B0F17' },
  header:{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:12, paddingVertical: 8 },
  title:{ color:'#fff', fontWeight:'800' },
  web:{ flex:1, backgroundColor:'#0B0F17' }
});
