import './style.css';
import logoUrl from './logo.svg';

const app = document.querySelector('#app');
app.innerHTML = `
  <header class="topbar">
    <a class="brand" href="#" aria-label="Dance Sync 首頁"><span class="brand-pulse"></span><span>DANCE<span>SYNC</span></span></a>
    <div class="top-status"><span id="modelDot" class="dot"></span><span id="modelStatus">準備載入姿態模型</span></div>
  </header>
  <main id="main">
    <section class="hero wrap">
      <div class="eyebrow"><span>AI MOTION LAB</span><i></i><span>LOCAL VIDEO ANALYSIS</span></div>
      <h1>看見動作一致性，<br><em>不只是一個分數。</em></h1>
      <p>比較同一段舞蹈中每位舞者的姿態與節奏，快速定位最整齊的落點，以及值得回看的不同步片段。</p>
      <div class="hero-actions">
        <label class="button primary" for="fileInput"><span>匯入舞蹈影片</span><small>MP4 / MOV / WebM</small></label>
        <input id="fileInput" type="file" accept="video/*" hidden />
        <button id="demoBtn" class="button ghost"><span>觀看內建示範</span><small>3 位舞者 · 18 秒</small></button>
      </div>
      <div class="privacy"><span>◉</span> 影片只在目前瀏覽器處理，不主動上傳或保存</div>
    </section>

    <section class="workspace wrap">
      <div class="section-head">
        <div><span class="section-no">01</span><p>ANALYSIS STUDIO</p><h2>同步分析工作台</h2></div>
        <div class="legend"><span><i class="cyan"></i>姿態一致</span><span><i class="amber"></i>需要回看</span></div>
      </div>
      <div class="studio-grid">
        <article class="video-card panel">
          <div class="card-top"><span id="videoName">尚未匯入影片</span><span id="videoMeta">—</span></div>
          <div id="stage" class="stage">
            <video id="video" playsinline muted></video>
            <canvas id="overlay"></canvas>
            <div id="emptyStage" class="empty-stage"><div class="scan-icon"><i></i><i></i><i></i></div><strong>匯入含 2–6 位舞者的影片</strong><span>建議固定鏡位、全身入鏡、人物避免交叉</span></div>
            <div id="scoreHud" class="score-hud hidden"><span>SYNC</span><strong id="hudScore">—</strong></div>
            <div id="progress" class="progress hidden"><span></span><b>逐幀分析中 <i id="progressText">0%</i></b></div>
          </div>
          <div class="controls">
            <button id="playBtn" class="round" disabled aria-label="播放或暫停">▶</button>
            <input id="seek" type="range" min="0" max="1000" value="0" disabled aria-label="影片時間軸" />
            <span id="timeText">0:00 / 0:00</span>
            <button id="mirrorBtn" class="mini" aria-pressed="false">鏡像</button>
          </div>
          <div class="action-row">
            <label>分析取樣<select id="sampleRate"><option value="8">8 FPS · 快速</option><option value="10" selected>10 FPS · 標準</option><option value="12">12 FPS · 細緻</option></select></label>
            <button id="analyzeBtn" class="button primary compact" disabled>開始分析</button>
          </div>
        </article>

        <aside class="summary panel">
          <div class="summary-title"><span>本段摘要</span><b id="modeBadge">等待影片</b></div>
          <div class="hero-score"><div class="score-ring" id="scoreRing"><strong id="totalScore">—</strong><small>整體同步</small></div><p id="scoreText">完成分析後，這裡會顯示片段內的相對一致性。</p></div>
          <div class="metrics">
            <div><span>姿態一致</span><strong id="postureScore">—</strong><small>身體線段角度</small></div>
            <div><span>節奏一致</span><strong id="timingScore">—</strong><small>動作速度變化</small></div>
            <div><span>辨識舞者</span><strong id="dancerCount">—</strong><small>同框有效人數</small></div>
            <div><span>有效覆蓋</span><strong id="coverageScore">—</strong><small>可比較畫面比例</small></div>
          </div>
          <div class="insight" id="insight"><span>COACH NOTE</span><p>先匯入影片或開啟示範，分析建議會出現在這裡。</p></div>
          <button id="exportBtn" class="button export" disabled>匯出分析 JSON <span>↗</span></button>
        </aside>
      </div>
    </section>

    <section class="results wrap">
      <div class="section-head compact-head"><div><span class="section-no">02</span><p>SYNC TIMELINE</p><h2>同步趨勢與回看片段</h2></div></div>
      <article class="chart-card panel">
        <div class="chart-key"><span><i class="cyan"></i>整體同步</span><span><i class="violet"></i>姿態</span><span><i class="green"></i>節奏</span><span class="chart-help">點選圖表可跳至該畫面</span></div>
        <canvas id="chart" height="260"></canvas>
        <div id="moments" class="moments"><div class="placeholder">完成分析後，系統會列出分數較低、適合回看的片段。</div></div>
      </article>
      <div class="pair-grid" id="pairGrid"><article class="pair-placeholder panel">舞者兩兩比較會顯示在這裡</article></div>
    </section>

    <section class="method wrap">
      <div class="method-copy"><span class="section-no">03</span><p>HOW IT WORKS</p><h2>分數怎麼來？</h2><p>每位舞者先以髖部中心與肩線建立自己的座標，再比較軀幹、手臂與腿部線段角度。姿態分數衡量「形狀是否相近」；節奏分數衡量「身體線段轉動速度是否同步」。</p></div>
      <ol>
        <li><b>01</b><div><strong>多人姿態辨識</strong><span>偵測 33 個身體關節點並依畫面左右建立暫時身分。</span></div></li>
        <li><b>02</b><div><strong>個人尺度標準化</strong><span>使用角度而非絕對位置，降低身高與肢段比例差異。</span></div></li>
        <li><b>03</b><div><strong>片段內校準</strong><span>以本片段的最佳與較差狀態映射 0–100；不可直接跨影片排名。</span></div></li>
      </ol>
    </section>

    <section class="limits wrap">
      <strong>使用界線</strong>
      <p>本工具評估同一畫面中的相對一致性，不判定舞蹈是否正確，也不分析音樂節拍。單鏡頭、遮擋、人物交叉與轉身都可能影響結果；適合作為教練回看與教學討論，不是醫療、實驗室或正式競賽評分。</p>
    </section>
  </main>
  <footer class="footer wrap">
    <div class="funding"><img src="${logoUrl}" alt="臺灣運動健康科技學會識別圖形"/><div><small>資助單位</small><strong>臺灣運動健康科技學會</strong></div></div>
    <div class="credits"><span>改作自 Jeremy Park 的 dance_sync 概念與 Apache-2.0 開源專案</span><span>版本更新｜2026 年 11 月</span></div>
  </footer>
`;

const $ = (s) => document.querySelector(s);
const video = $('#video');
const overlay = $('#overlay');
const octx = overlay.getContext('2d');
const chart = $('#chart');
const cctx = chart.getContext('2d');
const COLORS = ['#24e5bd','#45a9ff','#ffca61','#b891ff','#ff779a','#6ee06e'];
const CONNECTIONS = [[11,12],[11,13],[13,15],[12,14],[14,16],[11,23],[12,24],[23,24],[23,25],[25,27],[27,31],[24,26],[26,28],[28,32]];
const SEGMENTS = [[23,11],[24,12],[11,13],[13,15],[12,14],[14,16],[23,25],[25,27],[24,26],[26,28],[11,12],[23,24]];
let landmarker = null;
let frames = [];
let analysis = null;
let busy = false;
let demoMode = false;
let mirrored = false;

function setModelStatus(text, ready=false) { $('#modelStatus').textContent = text; $('#modelDot').classList.toggle('ready', ready); }
function clamp(v,a=0,b=1){ return Math.max(a,Math.min(b,v)); }
function mean(v){ const a=v.filter(Number.isFinite); return a.length ? a.reduce((s,n)=>s+n,0)/a.length : NaN; }
function percentile(values,p){ const a=values.filter(Number.isFinite).sort((x,y)=>x-y); if(!a.length)return NaN; const i=(a.length-1)*p,lo=Math.floor(i),hi=Math.ceil(i); return a[lo]+(a[hi]-a[lo])*(i-lo); }
function fmtTime(s){ return `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`; }
function once(el,event){ return new Promise(resolve=>el.addEventListener(event,resolve,{once:true})); }

async function loadModel(){
  try {
    setModelStatus('下載多人姿態模型中');
    const {FilesetResolver,PoseLandmarker}=await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/+esm');
    const vision=await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/wasm');
    landmarker=await PoseLandmarker.createFromOptions(vision,{baseOptions:{modelAssetPath:'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/latest/pose_landmarker_full.task',delegate:'GPU'},runningMode:'VIDEO',numPoses:6,minPoseDetectionConfidence:.45,minPosePresenceConfidence:.45,minTrackingConfidence:.45});
    setModelStatus('多人姿態模型已就緒',true);
    if(video.src) $('#analyzeBtn').disabled=false;
  } catch(err){ console.error(err); setModelStatus('模型載入失敗，可先使用內建示範'); }
}

function poseCenter(lm){ return mean([lm[23]?.x,lm[24]?.x,lm[11]?.x,lm[12]?.x]); }
function validPose(lm){ return lm && mean([0,11,12,13,14,15,16,23,24,25,26,27,28].map(i=>lm[i]?.visibility??0))>.45; }
function assignPeople(poses){ return poses.filter(validPose).sort((a,b)=>poseCenter(a)-poseCenter(b)).slice(0,6); }
function angle(a,b){ return Math.atan2(b.y-a.y,b.x-a.x); }
function angleDelta(a,b){ let d=Math.abs(a-b); while(d>Math.PI)d=Math.abs(d-Math.PI*2); return d*180/Math.PI; }
function features(lm){
  const hip={x:mean([lm[23].x,lm[24].x]),y:mean([lm[23].y,lm[24].y])};
  const shoulder={x:mean([lm[11].x,lm[12].x]),y:mean([lm[11].y,lm[12].y])};
  const base=angle(hip,shoulder);
  return SEGMENTS.map(([a,b])=>angle(lm[a],lm[b])-base);
}
function postureDifference(a,b){ return mean(a.map((v,i)=>Math.max(0,angleDelta(v,b[i])-4))); }

function calculate(rawFrames){
  const maxPeople=Math.max(0,...rawFrames.map(f=>f.people.length));
  const pairs=[]; for(let a=0;a<maxPeople;a++)for(let b=a+1;b<maxPeople;b++)pairs.push([a,b]);
  const enriched=rawFrames.map((f,idx)=>{
    const feat=f.people.map(features);
    const speed=feat.map((v,p)=>idx&&rawFrames[idx-1].people[p]?v.map((x,i)=>angleDelta(x,features(rawFrames[idx-1].people[p])[i])/(f.t-rawFrames[idx-1].t||.1)):null);
    const diffs=pairs.map(([a,b])=>feat[a]&&feat[b]?postureDifference(feat[a],feat[b]):NaN);
    const speedDiffs=pairs.map(([a,b])=>speed[a]&&speed[b]?mean(speed[a].map((x,i)=>Math.abs(x-speed[b][i]))):NaN);
    return {...f,feat,speed,postureDiff:mean(diffs),timingDiff:mean(speedDiffs),pairDiffs:diffs};
  });
  const pBest=percentile(enriched.map(f=>f.postureDiff),.1),pBad=percentile(enriched.map(f=>f.postureDiff),.8);
  const tBest=percentile(enriched.map(f=>f.timingDiff),.1),tBad=percentile(enriched.map(f=>f.timingDiff),.8);
  const score=(v,best,bad)=>Number.isFinite(v)&&bad>best?100*clamp(1-(v-best)/(bad-best)):NaN;
  enriched.forEach(f=>{f.posture=score(f.postureDiff,pBest,pBad);f.timing=score(f.timingDiff,tBest,tBad);f.score=mean([f.posture,f.timing]);});
  const smooth=(key,i)=>mean(enriched.slice(Math.max(0,i-2),Math.min(enriched.length,i+3)).map(f=>f[key]));
  enriched.forEach((f,i)=>{f.postureSmooth=smooth('posture',i);f.timingSmooth=smooth('timing',i);f.scoreSmooth=mean([f.postureSmooth,f.timingSmooth]);});
  const pairStats=pairs.map((pair,pi)=>({pair,score:mean(enriched.map(f=>Number.isFinite(f.pairDiffs[pi])?score(f.pairDiffs[pi],pBest,pBad):NaN))}));
  const valid=enriched.filter(f=>Number.isFinite(f.score));
  const low=[]; let active=null;
  valid.forEach(f=>{ if(f.scoreSmooth<48){ if(!active)active={start:f.t,end:f.t,min:f}; active.end=f.t;if(f.scoreSmooth<active.min.scoreSmooth)active.min=f; } else if(active){if(active.end-active.start>.35)low.push(active);active=null;} }); if(active)low.push(active);
  return {frames:enriched,maxPeople,pairs,pairStats,posture:mean(valid.map(f=>f.postureSmooth)),timing:mean(valid.map(f=>f.timingSmooth)),score:mean(valid.map(f=>f.scoreSmooth)),coverage:rawFrames.length?valid.length/rawFrames.length*100:0,low,anchors:{pBest,pBad,tBest,tBad}};
}

function resizeCanvas(canvas){ const r=canvas.getBoundingClientRect(),d=devicePixelRatio||1;canvas.width=Math.max(1,Math.round(r.width*d));canvas.height=Math.max(1,Math.round(r.height*d));return {w:r.width,h:r.height,d}; }
function drawPoses(people){
  const {w,h,d}=resizeCanvas(overlay);octx.setTransform(d,0,0,d,0,0);octx.clearRect(0,0,w,h);octx.lineCap='round';
  people.forEach((lm,p)=>{octx.strokeStyle=COLORS[p];octx.fillStyle='#f7fffd';octx.lineWidth=3;CONNECTIONS.forEach(([a,b])=>{if((lm[a]?.visibility??0)>.35&&(lm[b]?.visibility??0)>.35){octx.beginPath();octx.moveTo(lm[a].x*w,lm[a].y*h);octx.lineTo(lm[b].x*w,lm[b].y*h);octx.stroke();}});new Set(CONNECTIONS.flat()).forEach(i=>{if((lm[i]?.visibility??0)>.35){octx.beginPath();octx.arc(lm[i].x*w,lm[i].y*h,3.4,0,7);octx.fill();}});const x=poseCenter(lm)*w;octx.fillStyle=COLORS[p];octx.font='700 12px Inter, sans-serif';octx.fillText(`D${p+1}`,x-9,Math.max(18,Math.min(lm[11].y,lm[12].y)*h-18));});
}
function drawChart(){
  const {w,h,d}=resizeCanvas(chart);cctx.setTransform(d,0,0,d,0,0);cctx.clearRect(0,0,w,h);const pad={l:34,r:14,t:18,b:28};
  cctx.font='11px Inter,sans-serif';cctx.fillStyle='#748d86';cctx.textAlign='right';[0,25,50,75,100].forEach(v=>{const y=pad.t+(100-v)/100*(h-pad.t-pad.b);cctx.strokeStyle=v===50?'#355249':'#172a25';cctx.setLineDash(v===50?[5,5]:[]);cctx.beginPath();cctx.moveTo(pad.l,y);cctx.lineTo(w-pad.r,y);cctx.stroke();cctx.fillText(v,pad.l-8,y+4);});cctx.setLineDash([]);
  if(!analysis?.frames.length){cctx.textAlign='center';cctx.fillStyle='#748d86';cctx.fillText('分析完成後顯示同步趨勢',w/2,h/2);return;}
  const maxT=analysis.frames.at(-1).t||1;
  analysis.low.forEach(m=>{cctx.fillStyle='rgba(255,187,86,.09)';cctx.fillRect(pad.l+m.start/maxT*(w-pad.l-pad.r),pad.t,(m.end-m.start)/maxT*(w-pad.l-pad.r),h-pad.t-pad.b);});
  const line=(key,color,width)=>{cctx.beginPath();analysis.frames.forEach((f,i)=>{const x=pad.l+f.t/maxT*(w-pad.l-pad.r),y=pad.t+(100-(f[key]??50))/100*(h-pad.t-pad.b);i?cctx.lineTo(x,y):cctx.moveTo(x,y);});cctx.strokeStyle=color;cctx.lineWidth=width;cctx.stroke();};line('scoreSmooth','#31e4c0',3);line('postureSmooth','#ae8dff',1.5);line('timingSmooth','#72de7e',1.5);
  cctx.fillStyle='#748d86';cctx.textAlign='center';for(let i=0;i<=4;i++){const t=maxT*i/4;cctx.fillText(fmtTime(t),pad.l+(w-pad.l-pad.r)*i/4,h-7);}
}
function renderResults(){
  if(!analysis)return; const n=v=>Number.isFinite(v)?`${Math.round(v)}`:'—';
  $('#totalScore').textContent=n(analysis.score);$('#postureScore').textContent=n(analysis.posture);$('#timingScore').textContent=n(analysis.timing);$('#dancerCount').textContent=analysis.maxPeople;$('#coverageScore').textContent=`${Math.round(analysis.coverage)}%`;$('#scoreRing').style.setProperty('--score',`${analysis.score||0}%`);$('#modeBadge').textContent=demoMode?'示範資料':'本機分析';
  const label=analysis.score>=75?'整體一致性較高':analysis.score>=55?'整體同步中等':'建議優先回看';$('#scoreText').textContent=`${label}。這是本影片片段內校準的相對分數，不適合與其他影片直接比較。`;
  const focus=analysis.posture<analysis.timing?'動作形狀差異':'節奏落差';$('#insight p').textContent=analysis.low.length?`共找到 ${analysis.low.length} 段低同步區間；本段主要差異來自${focus}，可先由第一個標記開始回看。`:'目前沒有連續低於門檻的區間，仍可用趨勢圖檢查個別落點。';
  $('#pairGrid').innerHTML=analysis.pairStats.length?analysis.pairStats.map((p,i)=>`<article class="pair-card panel"><div><span style="--c:${COLORS[p.pair[0]]}">D${p.pair[0]+1}</span><i>×</i><span style="--c:${COLORS[p.pair[1]]}">D${p.pair[1]+1}</span></div><strong>${n(p.score)}</strong><small>姿態相似度</small><b style="width:${clamp(p.score||0,0,100)}%"></b></article>`).join(''):'<article class="pair-placeholder panel">至少需要 2 位可辨識舞者</article>';
  $('#moments').innerHTML=analysis.low.length?analysis.low.slice(0,6).map((m,i)=>`<button data-time="${m.min.t}"><b>${String(i+1).padStart(2,'0')}</b><span><strong>${fmtTime(m.start)}–${fmtTime(m.end)}</strong><small>最低同步 ${Math.round(m.min.scoreSmooth)} · 點擊回看</small></span><i>↗</i></button>`).join(''):'<div class="placeholder">沒有偵測到連續低同步片段。</div>';
  $('#moments').querySelectorAll('button').forEach(b=>b.onclick=()=>jumpTo(+b.dataset.time));drawChart();$('#exportBtn').disabled=false;
}
function jumpTo(t){video.currentTime=t;if(demoMode)drawDemoAt(t);else{const f=analysis.frames.reduce((a,b)=>Math.abs(b.t-t)<Math.abs(a.t-t)?b:a);drawPoses(f.people);$('#hudScore').textContent=Math.round(f.scoreSmooth||0);} }

function demoPose(cx,phase,variance=0){
  const p=Array.from({length:33},()=>({x:cx,y:.5,z:0,visibility:1}));const sway=Math.sin(phase)*.065,up=Math.sin(phase*2)*.025;const hand=Math.sin(phase)*.11+variance;
  Object.assign(p[0],{x:cx+sway*.25,y:.20+up});Object.assign(p[11],{x:cx-.045+sway,y:.34+up});Object.assign(p[12],{x:cx+.045+sway,y:.34+up});Object.assign(p[13],{x:cx-.10+sway-hand,y:.44-up});Object.assign(p[14],{x:cx+.10+sway+hand,y:.44-up});Object.assign(p[15],{x:cx-.15+sway-hand*1.4,y:.31-up*2});Object.assign(p[16],{x:cx+.15+sway+hand*1.4,y:.31-up*2});Object.assign(p[23],{x:cx-.035,y:.57+up});Object.assign(p[24],{x:cx+.035,y:.57+up});Object.assign(p[25],{x:cx-.06-sway*.35,y:.75-up});Object.assign(p[26],{x:cx+.06-sway*.35,y:.75-up});Object.assign(p[27],{x:cx-.09-sway*.55,y:.94});Object.assign(p[28],{x:cx+.09-sway*.55,y:.94});p[31]={...p[27]};p[32]={...p[28]};return p;
}
function makeDemo(){const out=[];for(let t=0;t<=18;t+=.1){let drift=t>6&&t<9?.65:0;let miss=t>13&&t<15?.55:0;out.push({t,people:[demoPose(.22,t*2.2),demoPose(.50,t*2.2+drift),demoPose(.78,t*2.2+miss,t>13&&t<15?.045:0)]});}return out;}
function drawDemoAt(t){const f=analysis?.frames.reduce((a,b)=>Math.abs(b.t-t)<Math.abs(a.t-t)?b:a);if(f){drawPoses(f.people);$('#hudScore').textContent=Math.round(f.scoreSmooth||0);} }

async function analyzeVideo(){
  if(busy)return;if(demoMode){frames=makeDemo();analysis=calculate(frames);renderResults();$('#scoreHud').classList.remove('hidden');drawDemoAt(0);return;}if(!landmarker||!video.duration)return;
  busy=true;video.pause();frames=[];$('#analyzeBtn').disabled=true;$('#progress').classList.remove('hidden');setModelStatus('逐幀分析中');const fps=+$('#sampleRate').value,step=1/fps,old=video.currentTime;
  try{for(let t=0;t<video.duration;t+=step){video.currentTime=Math.min(t,video.duration-.02);await once(video,'seeked');const result=landmarker.detectForVideo(video,t*1000+1);frames.push({t,people:assignPeople(result.landmarks||[])});const pct=Math.round(t/video.duration*100);$('#progress span').style.width=`${pct}%`;$('#progressText').textContent=`${pct}%`;if(frames.length%8===0)await new Promise(r=>setTimeout(r,0));}analysis=calculate(frames);renderResults();$('#scoreHud').classList.remove('hidden');jumpTo(0);setModelStatus('分析完成',true);}catch(e){console.error(e);setModelStatus('分析中斷，請改用較短影片');}finally{video.currentTime=old;$('#progress').classList.add('hidden');$('#analyzeBtn').disabled=false;busy=false;}
}

$('#fileInput').onchange=e=>{const f=e.target.files?.[0];if(!f)return;demoMode=false;analysis=null;frames=[];video.src=URL.createObjectURL(f);video.load();$('#emptyStage').classList.add('hidden');video.classList.add('visible');$('#videoName').textContent=f.name;$('#videoMeta').textContent=`${(f.size/1048576).toFixed(1)} MB`;$('#modeBadge').textContent='影片已載入';$('#playBtn').disabled=false;$('#seek').disabled=false;$('#analyzeBtn').disabled=!landmarker;$('#scoreHud').classList.add('hidden');octx.clearRect(0,0,overlay.width,overlay.height);};
video.onloadedmetadata=()=>{$('#videoMeta').textContent+=` · ${fmtTime(video.duration)}`;$('#timeText').textContent=`0:00 / ${fmtTime(video.duration)}`;};
video.ontimeupdate=()=>{if(!video.duration)return;$('#seek').value=video.currentTime/video.duration*1000;$('#timeText').textContent=`${fmtTime(video.currentTime)} / ${fmtTime(video.duration)}`;if(analysis&&!busy)jumpTo(video.currentTime);};
video.onplay=()=>{$('#playBtn').textContent='Ⅱ';};video.onpause=()=>{$('#playBtn').textContent='▶';};
$('#playBtn').onclick=()=>video.paused?video.play():video.pause();$('#seek').oninput=e=>{video.currentTime=video.duration*e.target.value/1000;};
$('#mirrorBtn').onclick=()=>{mirrored=!mirrored;$('#mirrorBtn').setAttribute('aria-pressed',mirrored);video.classList.toggle('mirrored',mirrored);overlay.classList.toggle('mirrored',mirrored);};
$('#demoBtn').onclick=()=>{demoMode=true;video.removeAttribute('src');video.load();$('#emptyStage').classList.remove('hidden');$('#emptyStage').innerHTML='<div class="demo-people"><i></i><i></i><i></i></div><strong>內建三人舞蹈示範</strong><span>含兩段刻意加入的節奏與姿態差異</span>';$('#videoName').textContent='內建示範 · 模擬骨架資料';$('#videoMeta').textContent='18 秒';$('#modeBadge').textContent='示範資料';$('#analyzeBtn').disabled=false;$('#analyzeBtn').textContent='分析示範';$('#playBtn').disabled=true;$('#seek').disabled=false;$('#seek').value=0;analysis=calculate(makeDemo());renderResults();$('#scoreHud').classList.remove('hidden');drawDemoAt(0);};
$('#seek').addEventListener('input',e=>{if(demoMode){const t=18*e.target.value/1000;$('#timeText').textContent=`${fmtTime(t)} / 0:18`;drawDemoAt(t);}});
$('#analyzeBtn').onclick=analyzeVideo;
$('#exportBtn').onclick=()=>{if(!analysis)return;const payload={tool:'Dance Sync 多人舞蹈同步分析',producer:'臺灣運動健康科技學會',updated:'2026-11',mode:demoMode?'simulated-demo':'local-video',method:'clip-relative posture and movement-speed agreement',limits:['relative agreement, not choreography correctness','clip-relative scores cannot be compared across videos','single-camera 2D pose','no audio or beat analysis'],summary:{dancers:analysis.maxPeople,overall:analysis.score,posture:analysis.posture,timing:analysis.timing,coverage:analysis.coverage},reviewMoments:analysis.low.map(m=>({start:m.start,end:m.end,lowestTime:m.min.t,lowestScore:m.min.scoreSmooth})),pairs:analysis.pairStats,series:analysis.frames.map(f=>({t:f.t,overall:f.scoreSmooth,posture:f.postureSmooth,timing:f.timingSmooth,people:f.people.length}))};const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));a.download=`dance-sync-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);};
chart.onclick=e=>{if(!analysis?.frames.length)return;const r=chart.getBoundingClientRect(),pct=clamp((e.clientX-r.left-34)/(r.width-48));jumpTo(pct*analysis.frames.at(-1).t);if(demoMode){$('#seek').value=pct*1000;}else{$('#seek').value=pct*1000;}};
window.addEventListener('resize',()=>{drawChart();if(analysis?.frames.length)jumpTo(demoMode?18*$('#seek').value/1000:video.currentTime||0);});
drawChart();loadModel();
