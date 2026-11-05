import './style.css';
import associationLogoUrl from './logo.svg';
import marshallThinkLogoUrl from './marshall-think-logo.png';

const app = document.querySelector('#app');
app.innerHTML = `
  <header class="topbar">
    <a class="brand" href="#" aria-label="Marshall Think Martial Sync 首頁"><img src="${marshallThinkLogoUrl}" alt="Marshall Think Martial Sync" /></a>
    <div class="top-status"><span id="modelDot" class="dot"></span><span id="modelStatus">準備載入姿態模型</span></div>
  </header>
  <main id="main">
    <section class="hero wrap">
      <div class="eyebrow"><span>AI MOTION LAB</span><i></i><span>LOCAL VIDEO ANALYSIS</span></div>
      <h1>看見動作一致性，<br><em>不只是一個分數。</em></h1>
      <p>針對空手道型／團體型與跆拳道品勢／團體品勢，比較技術形狀、動作到位、定勢停止與隊形效果，讓教練快速定位值得回看的不同步片段。</p>
      <div class="hero-actions">
        <label class="button primary" for="fileInput"><span>匯入套路影片</span><small>MP4 / MOV / WebM · 最長 60 秒</small></label>
        <input id="fileInput" type="file" accept="video/*" hidden />
        <button id="demoBtn" class="button ghost"><span>觀看內建示範</span><small>3 位舞者 · 18 秒</small></button>
      </div>
      <div class="privacy"><span>◉</span> 影片只在目前瀏覽器處理，不主動上傳或保存</div>
      <div class="discipline-picker" aria-label="選擇分析項目">
        <button class="discipline active" data-profile="karate-team"><small>空手道</small><strong>團體型</strong><span>到位 × 定勢 × 隊形</span></button>
        <button class="discipline" data-profile="karate-solo"><small>空手道</small><strong>型</strong><span>節奏 × 定勢控制</span></button>
        <button class="discipline" data-profile="taekwondo-team"><small>跆拳道</small><strong>團體品勢</strong><span>踢擊 × 落地 × 到位</span></button>
        <button class="discipline" data-profile="taekwondo-solo"><small>跆拳道</small><strong>品勢</strong><span>節奏 × 落地控制</span></button>
      </div>
      <p id="profileHelp" class="profile-help"><b>團體型：</b>整齊度優先：到位時間差 50%、技術形狀 20%、定勢停止 20%、移位一致 10%。事件會標示相對前排選手的最大快慢拍差。</p>
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
            <div class="timeline-wrap">
              <input id="seek" type="range" min="0" max="1000" value="0" disabled aria-label="影片時間軸" />
              <div id="eventRail" class="event-rail" aria-label="分析事件點"></div>
            </div>
            <span id="timeText">0:00 / 0:00</span>
            <label class="speed-control">回放<select id="playbackRate" aria-label="慢速回放速度"><option value="0.5">1/2×</option><option value="0.25">1/4×</option><option value="0.125">1/8×</option><option value="0.0625">1/16×</option></select></label>
            <button id="mirrorBtn" class="mini" aria-pressed="false">鏡像</button>
          </div>
          <div id="eventNow" class="event-now hidden"><b>EVENT</b><span></span></div>
          <div class="action-row">
            <div class="analysis-settings">
              <label>分析取樣<select id="sampleRate"><option value="8">8 FPS · 快速</option><option value="10" selected>10 FPS · 標準</option><option value="12">12 FPS · 細緻</option></select></label>
              <label>顯著慢拍<select id="lagThreshold"><option value="200">200 ms · 嚴格</option><option value="300" selected>300 ms · 建議</option><option value="400">400 ms · 寬鬆</option><option value="500">500 ms · 明顯</option></select></label>
              <small>超過門檻才建立事件；人物旁會顯示動作結束前 0.5 秒倒數。</small>
            </div>
            <button id="analyzeBtn" class="button primary compact" disabled>開始分析</button>
          </div>
        </article>

        <aside class="summary panel">
          <div class="summary-title"><span>本段摘要</span><b id="modeBadge">等待影片</b></div>
          <div class="hero-score"><div class="score-ring" id="scoreRing"><strong id="totalScore">—</strong><small id="scoreLabel">整體同步</small></div><p id="scoreText">完成分析後，這裡會顯示片段內的相對一致性。</p></div>
          <div class="metrics">
            <div><span>姿態一致</span><strong id="postureScore">—</strong><small>身體線段角度</small></div>
            <div><span>到位同步</span><strong id="timingScore">—</strong><small>動作速度與落點</small></div>
            <div><span>定勢停止</span><strong id="stopScore">—</strong><small>完成瞬間穩定度</small></div>
            <div><span>隊形穩定</span><strong id="formationScore">—</strong><small>相對站位變化</small></div>
            <div><span>辨識選手</span><strong id="dancerCount">—</strong><small>同框有效人數</small></div>
            <div><span>有效覆蓋</span><strong id="coverageScore">—</strong><small>可比較畫面比例</small></div>
          </div>
          <div class="insight" id="insight"><span>COACH NOTE</span><p>先匯入影片或開啟示範，分析建議會出現在這裡。</p></div>
          <div id="coachFeedback" class="coach-feedback"><div><b>教練回饋</b><span>完成分析後產生可直接對學員說明的重點。</span></div></div>
          <button id="exportBtn" class="button export" disabled>匯出分析 JSON <span>↗</span></button>
        </aside>
      </div>
    </section>

    <section class="results wrap">
      <div class="section-head compact-head"><div><span class="section-no">02</span><p>SYNC TIMELINE</p><h2>同步趨勢與回看片段</h2></div></div>
      <article class="chart-card panel">
        <div class="chart-key"><span><i class="cyan"></i>整體同步</span><span><i class="violet"></i>技術形狀</span><span><i class="green"></i>到位同步</span><span class="chart-help">點選圖表可跳至該畫面</span></div>
        <canvas id="chart" height="260"></canvas>
        <div id="reviewSummary" class="review-summary"><b>自動 Review</b><span>完成分析後，系統會依嚴重度整理優先檢視事件。</span></div>
        <div id="moments" class="moments"><div class="placeholder">完成分析後，系統會列出分數較低、適合回看的片段。</div></div>
      </article>
      <div class="pair-grid" id="pairGrid"><article class="pair-placeholder panel">舞者兩兩比較會顯示在這裡</article></div>
    </section>

    <section class="method wrap">
      <div class="method-copy"><span class="section-no">03</span><p>HOW IT WORKS</p><h2>專項同步怎麼評？</h2><p>每位選手先以髖部中心與肩線建立自己的座標，再比較軀幹、手臂、腿部線段角度與移動速度。團體項目另外偵測共同到位、停止穩定度與相對站位；各專項使用不同權重。</p></div>
      <ol>
        <li><b>01</b><div><strong>多人姿態辨識</strong><span>偵測 33 個身體關節點並依畫面左右建立暫時身分。</span></div></li>
        <li><b>02</b><div><strong>個人尺度標準化</strong><span>使用角度而非絕對位置，降低身高與肢段比例差異。</span></div></li>
        <li><b>03</b><div><strong>到位與定勢偵測</strong><span>從快速動作轉為低速定勢時，檢查三人停止時間差與停止後晃動。</span></div></li>
        <li><b>04</b><div><strong>片段內校準</strong><span>以本片段的最佳與較差狀態映射 0–100；不可直接跨影片排名或視為裁判分數。</span></div></li>
      </ol>
    </section>

    <section class="limits wrap">
      <strong>使用界線</strong>
      <p>本工具評估同一畫面中的影像相對一致性，不判定型／品勢技術是否符合官方規則。事件的毫秒差由取樣影格估算，解析度受 8／10／12 FPS、遮擋、轉身及追蹤換人影響；單格約為 125／100／83 ms，因此 50 ms 不宜視為可靠可量測差異。「前排」依事件影格中較接近鏡頭的選手判定。單鏡頭無法可靠量測拳腳力量、呼吸、視線、氣合或真實三維角度。本工具供教練回看，不是正式裁判或實驗室計時。</p>
    </section>
  </main>
  <footer class="footer wrap">
    <div class="copyright-owner"><img src="${associationLogoUrl}" alt="臺灣運動健康科技學會識別圖形"/><i></i><div><strong>© 2026 臺灣運動健康科技學會</strong><span>ALL RIGHTS RESERVED.</span><small>更新日期：2026 年 11 月</small></div></div>
    <div class="credits"><span>Marshall Think · Martial Sync</span><span>改作自 Jeremy Park 的 dance_sync 概念與 Apache-2.0 開源專案</span></div>
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
const MAX_VIDEO_SECONDS = 60;
const SEEK_TIMEOUT_MS = 8000;
const PROFILES = {
  'karate-team': {sport:'空手道',event:'團體型',team:true,weights:{posture:.20,timing:.50,stop:.20,formation:.10},help:'整齊度優先：到位時間差 50%、技術形狀 20%、定勢停止 20%、移位一致 10%。事件會標示相對前排選手的最大快慢拍差。'},
  'karate-solo': {sport:'空手道',event:'型',team:false,weights:{timing:.55,stop:.45},help:'單人模式評估動作節奏輪廓與定勢控制；無標準示範時不判定招式正確性。若要做同步比較，請將參考表演與學員同框。'},
  'taekwondo-team': {sport:'跆拳道',event:'團體品勢',team:true,weights:{posture:.30,timing:.30,stop:.25,formation:.15},help:'建議全身與落地腳完整入鏡。評分權重為到位同步 30%、技術形狀 30%、定勢／落地 25%、移位一致 15%。'},
  'taekwondo-solo': {sport:'跆拳道',event:'品勢',team:false,weights:{timing:.50,stop:.50},help:'單人模式著重節奏、踢擊回收後的停止與落地控制；未提供標準示範時不判定品勢技術正確性。'}
};
let landmarker = null;
let frames = [];
let analysis = null;
let busy = false;
let demoMode = false;
let mirrored = false;
let profileKey = 'karate-team';
let lastDetectionTimestamp = 0;
let playbackRaf = 0;

function setModelStatus(text, ready=false) { $('#modelStatus').textContent = text; $('#modelDot').classList.toggle('ready', ready); }
function clamp(v,a=0,b=1){ return Math.max(a,Math.min(b,v)); }
function mean(v){ const a=(v||[]).filter(Number.isFinite); return a.length ? a.reduce((s,n)=>s+n,0)/a.length : NaN; }
function percentile(values,p){ const a=values.filter(Number.isFinite).sort((x,y)=>x-y); if(!a.length)return NaN; const i=(a.length-1)*p,lo=Math.floor(i),hi=Math.ceil(i); return a[lo]+(a[hi]-a[lo])*(i-lo); }
function fmtTime(s){ return `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`; }
function once(el,event){ return new Promise(resolve=>el.addEventListener(event,resolve,{once:true})); }
function videoDurationIsValid(){ return Number.isFinite(video.duration)&&video.duration>0&&video.duration<=MAX_VIDEO_SECONDS+.05; }
function seekVideo(target){
  const safeTarget=clamp(target,0,Math.max(0,video.duration-.01));
  if(video.readyState>=2&&Math.abs(video.currentTime-safeTarget)<.002)return Promise.resolve();
  return new Promise((resolve,reject)=>{
    let timer;
    const cleanup=()=>{clearTimeout(timer);video.removeEventListener('seeked',done);video.removeEventListener('error',failed);};
    const done=()=>{cleanup();resolve();};
    const failed=()=>{cleanup();reject(new Error('影片影格讀取失敗'));};
    video.addEventListener('seeked',done,{once:true});
    video.addEventListener('error',failed,{once:true});
    timer=setTimeout(()=>{cleanup();reject(new Error(`讀取 ${safeTarget.toFixed(2)} 秒影格逾時`));},SEEK_TIMEOUT_MS);
    video.currentTime=safeTarget;
  });
}

async function loadModel(){
  try {
    setModelStatus('下載多人姿態模型中');
    const {FilesetResolver,PoseLandmarker}=await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/+esm');
    const vision=await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/wasm');
    landmarker=await PoseLandmarker.createFromOptions(vision,{baseOptions:{modelAssetPath:'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/latest/pose_landmarker_full.task',delegate:'GPU'},runningMode:'VIDEO',numPoses:6,minPoseDetectionConfidence:.45,minPosePresenceConfidence:.45,minTrackingConfidence:.45});
    setModelStatus('多人姿態模型已就緒',true);
    if(video.src&&videoDurationIsValid()) $('#analyzeBtn').disabled=false;
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

function centerOf(lm){ return {x:mean([lm[11].x,lm[12].x,lm[23].x,lm[24].x]),y:mean([lm[11].y,lm[12].y,lm[23].y,lm[24].y])}; }
function std(values){ const a=values.filter(Number.isFinite),m=mean(a); return a.length?Math.sqrt(mean(a.map(v=>(v-m)**2))):NaN; }
function weighted(values,weights){ let sum=0,total=0;Object.entries(weights).forEach(([key,w])=>{if(Number.isFinite(values[key])){sum+=values[key]*w;total+=w;}});return total?sum/total:NaN; }
function lagThresholdMs(){ return +$('#lagThreshold')?.value||300; }
function estimateEventTiming(enriched,event,maxPeople){
  const window=enriched.filter(f=>f.t>=Math.max(0,event.at-1)&&f.t<=event.at+1),intervals=window.slice(1).map((f,i)=>f.t-window[i].t).filter(v=>v>0),dt=percentile(intervals,.5)||.1,resolutionMs=Math.round(dt*1000);
  const eventFrame=enriched.reduce((a,b)=>Math.abs(b.t-event.at)<Math.abs(a.t-event.at)?b:a),front=eventFrame.people.map((lm,p)=>({athlete:p+1,y:centerOf(lm).y})).filter(x=>Number.isFinite(x.y)).sort((a,b)=>b.y-a.y)[0];
  const referenceAthlete=front?.athlete||1,reference=window.map(f=>f.motion[referenceAthlete-1]),maxLag=Math.max(1,Math.round(.5/dt)),comparisons=[];
  for(let p=0;p<maxPeople;p++){
    if(p===referenceAthlete-1)continue;const candidate=window.map(f=>f.motion[p]),refMean=mean(reference),candMean=mean(candidate),refSd=std(reference)||1,candSd=std(candidate)||1;let best=null;
    for(let lag=-maxLag;lag<=maxLag;lag++){const errors=[];for(let i=0;i<reference.length;i++){const j=i+lag;if(j>=0&&j<candidate.length&&Number.isFinite(reference[i])&&Number.isFinite(candidate[j]))errors.push(((reference[i]-refMean)/refSd-(candidate[j]-candMean)/candSd)**2);}if(errors.length>=5){const error=mean(errors);if(!best||error<best.error)best={lag,error};}}
    if(best)comparisons.push({athlete:p+1,signedMs:Math.round(best.lag*dt*1000)});
  }
  const compared=comparisons.sort((a,b)=>Math.abs(b.signedMs)-Math.abs(a.signedMs))[0];if(!compared)return null;
  const stopCandidates=window.filter(f=>Math.abs(f.t-event.at)<=.6&&Number.isFinite(f.motion[referenceAthlete-1]));
  const referenceStopTime=(stopCandidates.sort((a,b)=>a.motion[referenceAthlete-1]-b.motion[referenceAthlete-1])[0]||eventFrame).t;
  const stopTimes=[{athlete:referenceAthlete,time:referenceStopTime},...comparisons.map(c=>({athlete:c.athlete,time:referenceStopTime+c.signedMs/1000}))].sort((a,b)=>a.athlete-b.athlete);
  return {referenceAthlete,athlete:compared.athlete,signedMs:compared.signedMs,differenceMs:Math.abs(compared.signedMs),direction:compared.signedMs>=0?'慢':'快',resolutionMs,referenceStopTime,stopTimes,method:'event motion cross-correlation ±500ms',comparisons};
}

function calculate(rawFrames){
  const profile=PROFILES[profileKey];
  const selected=profile.team?rawFrames:rawFrames.map(f=>({...f,people:f.people.slice(0,1)}));
  const maxPeople=Math.max(0,...selected.map(f=>f.people.length));
  const pairs=[]; for(let a=0;a<maxPeople;a++)for(let b=a+1;b<maxPeople;b++)pairs.push([a,b]);
  const enriched=selected.map((f,idx)=>{
    const feat=f.people.map(features);
    const speed=feat.map((v,p)=>idx&&selected[idx-1].people[p]?v.map((x,i)=>angleDelta(x,features(selected[idx-1].people[p])[i])/(f.t-selected[idx-1].t||.1)):null);
    const centers=f.people.map(centerOf);
    const centerSpeed=centers.map((c,p)=>idx&&selected[idx-1].people[p]?Math.hypot(c.x-centerOf(selected[idx-1].people[p]).x,c.y-centerOf(selected[idx-1].people[p]).y)/(f.t-selected[idx-1].t||.1):NaN);
    const motion=speed.map(v=>mean(v));
    const diffs=pairs.map(([a,b])=>feat[a]&&feat[b]?postureDifference(feat[a],feat[b]):NaN);
    const speedDiffs=pairs.map(([a,b])=>speed[a]&&speed[b]?mean(speed[a].map((x,i)=>Math.abs(x-speed[b][i]))):NaN);
    const formationDiffs=pairs.map(([a,b])=>Number.isFinite(centerSpeed[a])&&Number.isFinite(centerSpeed[b])?Math.abs(centerSpeed[a]-centerSpeed[b]):NaN);
    return {...f,feat,speed,motion,groupMotion:mean(motion),postureDiff:mean(diffs),timingDiff:mean(speedDiffs),stopDiff:profile.team?std(motion):mean(motion),formationDiff:mean(formationDiffs),pairDiffs:diffs};
  });
  const pBest=percentile(enriched.map(f=>f.postureDiff),.1),pBad=percentile(enriched.map(f=>f.postureDiff),.8);
  const tBest=percentile(enriched.map(f=>f.timingDiff),.1),tBad=percentile(enriched.map(f=>f.timingDiff),.8);
  const motionLow=percentile(enriched.map(f=>f.groupMotion),.35);
  const stopFrames=enriched.filter(f=>f.groupMotion<=motionLow);
  const sBest=percentile(stopFrames.map(f=>f.stopDiff),.1),sBad=percentile(stopFrames.map(f=>f.stopDiff),.8);
  const fBest=percentile(enriched.map(f=>f.formationDiff),.1),fBad=percentile(enriched.map(f=>f.formationDiff),.8);
  const score=(v,best,bad)=>Number.isFinite(v)&&bad>best?100*clamp(1-(v-best)/(bad-best)):NaN;
  const soloMotionHigh=percentile(enriched.map(f=>f.groupMotion),.8)||1;
  enriched.forEach(f=>{f.posture=profile.team?score(f.postureDiff,pBest,pBad):NaN;f.timing=profile.team?score(f.timingDiff,tBest,tBad):100*clamp(Math.abs(f.groupMotion-motionLow)/(soloMotionHigh-motionLow||1));f.stop=f.groupMotion<=motionLow?score(f.stopDiff,sBest,sBad):NaN;f.formation=profile.team?score(f.formationDiff,fBest,fBad):NaN;f.score=weighted(f,profile.weights);});
  const smooth=(key,i)=>mean(enriched.slice(Math.max(0,i-2),Math.min(enriched.length,i+3)).map(f=>f[key]));
  enriched.forEach((f,i)=>{f.postureSmooth=smooth('posture',i);f.timingSmooth=smooth('timing',i);f.stopSmooth=smooth('stop',i);f.formationSmooth=smooth('formation',i);f.scoreSmooth=weighted({posture:f.postureSmooth,timing:f.timingSmooth,stop:f.stopSmooth,formation:f.formationSmooth},profile.weights);});
  const pairStats=pairs.map((pair,pi)=>({pair,score:mean(enriched.map(f=>Number.isFinite(f.pairDiffs[pi])?score(f.pairDiffs[pi],pBest,pBad):NaN))}));
  const valid=enriched.filter(f=>Number.isFinite(f.score));
  const low=[]; let active=null;
  valid.forEach(f=>{ if(f.scoreSmooth<50||f.timingSmooth<45){ if(!active)active={start:f.t,end:f.t,min:f}; active.end=f.t;if(f.scoreSmooth<active.min.scoreSmooth)active.min=f; } else if(active){if(active.end-active.start>.35)low.push(active);active=null;} }); if(active)low.push(active);
  const componentNames={posture:'技術形狀',timing:'到位慢拍',stop:'定勢停止',formation:'移位一致'};
  const thresholdMs=lagThresholdMs();
  const candidates=low.map(m=>{const ranked=[['posture',m.min.postureSmooth],['timing',m.min.timingSmooth],['stop',m.min.stopSmooth],['formation',m.min.formationSmooth]].filter(x=>Number.isFinite(x[1])).sort((a,b)=>a[1]-b[1]);const issue=ranked[0]?.[0]||'timing',minimum=Math.round(m.min.scoreSmooth),base={start:m.start,end:m.end,at:m.min.t,replayStart:Math.max(0,m.start-.6),score:minimum,issue,label:componentNames[issue]};const timing=profile.team?estimateEventTiming(enriched,base,maxPeople):null;return {...base,timing};});
  const events=candidates.filter(e=>!profile.team||(e.timing&&e.timing.differenceMs>=thresholdMs)).map((e,i)=>{const over=e.timing?.differenceMs-thresholdMs;return {...e,id:i+1,severity:profile.team?(over>=200?'嚴重':over>=100?'明顯':'需複查'):(e.score<20?'嚴重':e.score<35?'明顯':'需複查')};});
  return {frames:enriched,maxPeople,pairs,pairStats,posture:mean(valid.map(f=>f.postureSmooth)),timing:mean(valid.map(f=>f.timingSmooth)),stop:mean(valid.map(f=>f.stopSmooth)),formation:mean(valid.map(f=>f.formationSmooth)),score:mean(valid.map(f=>f.scoreSmooth)),coverage:selected.length?valid.length/selected.length*100:0,low,events,profileKey,settings:{lagThresholdMs:thresholdMs,countdownWindowMs:500},anchors:{pBest,pBad,tBest,tBad,sBest,sBad,fBest,fBad,motionLow}};
}

function resizeCanvas(canvas){ const r=canvas.getBoundingClientRect(),d=devicePixelRatio||1;canvas.width=Math.max(1,Math.round(r.width*d));canvas.height=Math.max(1,Math.round(r.height*d));return {w:r.width,h:r.height,d}; }
function countdownEventAt(t){return analysis?.events?.find(e=>{const stops=e.timing?.stopTimes;if(!stops?.length)return false;return t>=Math.min(...stops.map(s=>s.time))-.5&&t<=Math.max(...stops.map(s=>s.time))+.15;});}
function drawPoses(people,t=null){
  const {w,h,d}=resizeCanvas(overlay);octx.setTransform(d,0,0,d,0,0);octx.clearRect(0,0,w,h);octx.lineCap='round';
  const event=Number.isFinite(t)?countdownEventAt(t):null;
  people.forEach((lm,p)=>{octx.strokeStyle=COLORS[p];octx.fillStyle='#f7fffd';octx.lineWidth=3;CONNECTIONS.forEach(([a,b])=>{if((lm[a]?.visibility??0)>.35&&(lm[b]?.visibility??0)>.35){octx.beginPath();octx.moveTo(lm[a].x*w,lm[a].y*h);octx.lineTo(lm[b].x*w,lm[b].y*h);octx.stroke();}});new Set(CONNECTIONS.flat()).forEach(i=>{if((lm[i]?.visibility??0)>.35){octx.beginPath();octx.arc(lm[i].x*w,lm[i].y*h,3.4,0,7);octx.fill();}});const x=poseCenter(lm)*w,y=Math.max(18,Math.min(lm[11].y,lm[12].y)*h-18);octx.fillStyle=COLORS[p];octx.font='700 12px Inter, sans-serif';octx.fillText(`D${p+1}`,x-9,y);
    const stop=event?.timing?.stopTimes?.find(s=>s.athlete===p+1);if(!stop)return;const show=t>=stop.time-.5&&t<=stop.time+.15;if(!show)return;const remaining=clamp(stop.time-t,0,.5),comparison=event.timing.comparisons.find(c=>c.athlete===p+1),late=(comparison?.signedMs||0)>=analysis.settings.lagThresholdMs,bx=clamp(x+12,4,w-82),by=clamp(y-17,4,h-42);octx.fillStyle=late?'rgba(91,18,26,.94)':'rgba(5,28,23,.94)';octx.strokeStyle=late?'#ff6876':'#26e2b8';octx.lineWidth=1.5;octx.beginPath();octx.roundRect(bx,by,78,38,8);octx.fill();octx.stroke();octx.fillStyle=late?'#ff9aa3':'#78f5d7';octx.font='700 9px Inter, sans-serif';octx.fillText(`D${p+1}${late?' 慢拍':''}`,bx+8,by+13);octx.fillStyle='#fff';octx.font='800 16px Inter, sans-serif';octx.fillText(`${remaining.toFixed(2)} s`,bx+8,by+31);
  });
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
function timingText(event){const t=event?.timing;return t?`D${t.athlete} 相對前排 D${t.referenceAthlete} ${t.direction}約 ${t.differenceMs} ms`:'此事件無法穩定估算選手時間差';}
function renderResults(){
  if(!analysis)return; const n=v=>Number.isFinite(v)?`${Math.round(v)}`:'—',profile=PROFILES[analysis.profileKey];
  $('#totalScore').textContent=n(analysis.score);$('#postureScore').textContent=n(analysis.posture);$('#timingScore').textContent=n(analysis.timing);$('#stopScore').textContent=n(analysis.stop);$('#formationScore').textContent=n(analysis.formation);$('#dancerCount').textContent=analysis.maxPeople;$('#coverageScore').textContent=`${Math.round(analysis.coverage)}%`;$('#scoreRing').style.setProperty('--score',`${analysis.score||0}%`);$('#scoreLabel').textContent=profile.team?'整體同步':'節奏控制';$('#modeBadge').textContent=demoMode?`${profile.event}示範`:`${profile.event}分析`;
  const label=analysis.score>=75?'整體一致性較高':analysis.score>=55?'整體同步中等':'建議優先回看';$('#scoreText').textContent=`${label}。這是本影片片段內校準的相對分數，不適合與其他影片直接比較。`;
  const components=[['技術形狀',analysis.posture,'posture'],['到位節奏',analysis.timing,'timing'],['定勢停止',analysis.stop,'stop'],['移位一致',analysis.formation,'formation']].filter(x=>Number.isFinite(x[1])).sort((a,b)=>a[1]-b[1]);
  const focus=components[0]?.[0]||'節奏控制';$('#insight p').textContent=analysis.low.length?`共找到 ${analysis.low.length} 段低同步區間；本段主要差異來自${focus}，可先由第一個標記開始回看。`:'目前沒有連續低於門檻的區間，仍可用趨勢圖檢查個別落點。';
  const advice={
    posture:profile.sport==='空手道'?'三人的立姿深度、手技終末角度與軀幹方向要同時定住。':'統一抬膝高度、踢擊伸展角度，以及回收後的軀幹方向。',
    timing:'把動作拆成「預備—發力—到位」三拍，先統一最後到位點，再逐步加速。',
    stop:profile.sport==='空手道'?'到位後維持 0.3–0.5 秒，檢查是否有人提早鬆開或仍在晃動。':'踢擊回收與落地後維持穩定，避免有人二次踏步或上身持續修正。',
    formation:'先在地面標示起步腳與落點；移位距離不同時，也要讓啟動與停止時間一致。'
  };
  const feedback=components.slice(0,2).map((c,i)=>`<li><b>${i?'第二重點':'優先修正'}｜${c[0]} ${Math.round(c[1])}</b><span>${advice[c[2]]}</span></li>`).join('');
  const caveat=profile.team?`目前有效辨識 ${analysis.maxPeople} 人；${analysis.maxPeople<3?'未達團體項目建議 3 人，分數僅供測試。':'可用低分片段逐一口頭回饋。'}`:'單人分數只描述本片節奏與停止控制，不代表型／品勢技術得分。';
  $('#coachFeedback').innerHTML=`<div><b>${profile.sport}${profile.event}教練回饋</b><span>${caveat}</span></div><ul>${feedback}</ul>`;
  $('#pairGrid').innerHTML=analysis.pairStats.length?analysis.pairStats.map((p,i)=>`<article class="pair-card panel"><div><span style="--c:${COLORS[p.pair[0]]}">D${p.pair[0]+1}</span><i>×</i><span style="--c:${COLORS[p.pair[1]]}">D${p.pair[1]+1}</span></div><strong>${n(p.score)}</strong><small>姿態相似度</small><b style="width:${clamp(p.score||0,0,100)}%"></b></article>`).join(''):'<article class="pair-placeholder panel">至少需要 2 位可辨識舞者</article>';
  const severe=analysis.events.filter(e=>e.severity==='嚴重').length,mainIssue=analysis.events.reduce((acc,e)=>(acc[e.label]=(acc[e.label]||0)+1,acc),{}),topIssue=Object.entries(mainIssue).sort((a,b)=>b[1]-a[1])[0]?.[0],maxLag=analysis.events.filter(e=>e.timing).sort((a,b)=>b.timing.differenceMs-a.timing.differenceMs)[0];
  $('#reviewSummary').innerHTML=`<b>整齊度 Review｜門檻 ${analysis.settings.lagThresholdMs} ms｜${analysis.events.length} 個事件${severe?` · ${severe} 個嚴重`:''}</b><span>${analysis.events.length?`本片最常見問題為${topIssue}。${maxLag?`最大時間差：${timingText(maxLag)}。`:''}點擊事件會從前 0.6 秒慢速回放，人物旁顯示各自到位前的 0.5 秒倒數。`:`沒有超過 ${analysis.settings.lagThresholdMs} ms 的顯著慢拍事件，可降低慢拍門檻或從趨勢圖抽查。`}</span>`;
  $('#moments').innerHTML=analysis.events.length?analysis.events.slice(0,8).map(e=>`<button class="severity-${e.severity}" data-event="${e.id-1}"><b>E${String(e.id).padStart(2,'0')}</b><span><strong>${fmtTime(e.start)}–${fmtTime(e.end)} · ${e.label}</strong><em>${timingText(e)}</em><small>${e.severity}｜最低同步 ${e.score} · 慢速回放</small></span><i>▶</i></button>`).join(''):'<div class="placeholder">沒有偵測到連續低同步片段。</div>';
  $('#moments').querySelectorAll('button').forEach(b=>b.onclick=()=>replayEvent(analysis.events[+b.dataset.event]));renderEventRail();drawChart();$('#exportBtn').disabled=false;
}
function frameAt(t){return analysis?.frames?.reduce((a,b)=>Math.abs(b.t-t)<Math.abs(a.t-t)?b:a);}
function renderFrameAt(t){const f=frameAt(t);if(!f)return;drawPoses(f.people,t);$('#hudScore').textContent=Math.round(f.scoreSmooth||0);const event=countdownEventAt(t)||analysis.events?.find(e=>t>=e.start&&t<=e.end);$('#eventNow').classList.toggle('hidden',!event);if(event)$('#eventNow span').textContent=`E${String(event.id).padStart(2,'0')} · ${event.severity} · ${event.label} · ${timingText(event)}`;document.querySelectorAll('.event-marker').forEach((m,i)=>m.classList.toggle('current',event?.id===i+1));}
function jumpTo(t){const max=demoMode?18:video.duration||analysis?.frames?.at(-1)?.t||0,tSafe=clamp(t,0,max);if(!demoMode)video.currentTime=tSafe;$('#seek').value=max?tSafe/max*1000:0;demoMode?drawDemoAt(tSafe):renderFrameAt(tSafe);}
function replayEvent(event){if(!event)return;video.pause();jumpTo(event.replayStart);if(!demoMode)video.play().catch(()=>{});}
function renderEventRail(){const max=demoMode?18:video.duration||analysis?.frames?.at(-1)?.t||1;$('#eventRail').innerHTML=(analysis.events||[]).map(e=>`<button class="event-marker severity-${e.severity}" style="left:${clamp(e.at/max)*100}%" data-event="${e.id-1}" title="E${String(e.id).padStart(2,'0')} ${e.severity}｜${e.label}｜${timingText(e)}｜${fmtTime(e.at)}" aria-label="事件 ${e.id}，${e.severity}，${e.label}，${timingText(e)}，${fmtTime(e.at)}"></button>`).join('');$('#eventRail').querySelectorAll('button').forEach(b=>b.onclick=()=>replayEvent(analysis.events[+b.dataset.event]));}
function playbackLoop(){if(video.paused||video.ended){playbackRaf=0;return;}renderFrameAt(video.currentTime);playbackRaf=requestAnimationFrame(playbackLoop);}

function demoPose(cx,phase,variance=0){
  const p=Array.from({length:33},()=>({x:cx,y:.5,z:0,visibility:1}));const sway=Math.sin(phase)*.065,up=Math.sin(phase*2)*.025;const hand=Math.sin(phase)*.11+variance;
  Object.assign(p[0],{x:cx+sway*.25,y:.20+up});Object.assign(p[11],{x:cx-.045+sway,y:.34+up});Object.assign(p[12],{x:cx+.045+sway,y:.34+up});Object.assign(p[13],{x:cx-.10+sway-hand,y:.44-up});Object.assign(p[14],{x:cx+.10+sway+hand,y:.44-up});Object.assign(p[15],{x:cx-.15+sway-hand*1.4,y:.31-up*2});Object.assign(p[16],{x:cx+.15+sway+hand*1.4,y:.31-up*2});Object.assign(p[23],{x:cx-.035,y:.57+up});Object.assign(p[24],{x:cx+.035,y:.57+up});Object.assign(p[25],{x:cx-.06-sway*.35,y:.75-up});Object.assign(p[26],{x:cx+.06-sway*.35,y:.75-up});Object.assign(p[27],{x:cx-.09-sway*.55,y:.94});Object.assign(p[28],{x:cx+.09-sway*.55,y:.94});p[31]={...p[27]};p[32]={...p[28]};return p;
}
function makeDemo(){const out=[];for(let t=0;t<=18;t+=.1){let drift=t>6&&t<9?.65:0;let miss=t>13&&t<15?.55:0;out.push({t,people:[demoPose(.22,t*2.2),demoPose(.50,t*2.2+drift),demoPose(.78,t*2.2+miss,t>13&&t<15?.045:0)]});}return out;}
function drawDemoAt(t){const f=frameAt(t);if(f){drawPoses(f.people,t);$('#hudScore').textContent=Math.round(f.scoreSmooth||0);const event=countdownEventAt(t)||analysis.events?.find(e=>t>=e.start&&t<=e.end);$('#eventNow').classList.toggle('hidden',!event);if(event)$('#eventNow span').textContent=`E${String(event.id).padStart(2,'0')} · ${event.severity} · ${event.label} · ${timingText(event)}`;} }

async function analyzeVideo(){
  if(busy)return;if(demoMode){frames=makeDemo();analysis=calculate(frames);renderResults();$('#scoreHud').classList.remove('hidden');drawDemoAt(0);return;}if(!landmarker||!video.duration)return;
  if(!videoDurationIsValid()){setModelStatus(`影片須為 ${MAX_VIDEO_SECONDS} 秒以內`);return;}
  busy=true;video.pause();frames=[];$('#analyzeBtn').disabled=true;$('#progress').classList.remove('hidden');setModelStatus('逐幀分析中');const fps=+$('#sampleRate').value,step=1/fps,old=video.currentTime,total=Math.ceil(video.duration*fps),runBase=Math.max(performance.now(),lastDetectionTimestamp+1000);
  try{let index=0;for(let t=0;t<video.duration;t+=step,index++){await seekVideo(t);const timestamp=runBase+index*step*1000;const result=landmarker.detectForVideo(video,timestamp);lastDetectionTimestamp=timestamp;frames.push({t,people:assignPeople(result.landmarks||[])});const pct=Math.min(100,Math.round((index+1)/total*100));$('#progress span').style.width=`${pct}%`;$('#progressText').textContent=`${pct}% · ${index+1}/${total}`;if(frames.length%6===0)await new Promise(r=>setTimeout(r,0));}analysis=calculate(frames);renderResults();$('#scoreHud').classList.remove('hidden');jumpTo(0);setModelStatus(`分析完成 · ${frames.length} 個取樣影格`,true);}catch(e){console.error(e);setModelStatus(`分析中斷：${e.message||'無法讀取影片影格'}`);}finally{video.currentTime=Math.min(old,video.duration||0);$('#progress').classList.add('hidden');$('#analyzeBtn').disabled=!videoDurationIsValid();busy=false;}
}

$('#fileInput').onchange=e=>{const f=e.target.files?.[0];if(!f)return;demoMode=false;analysis=null;frames=[];video.src=URL.createObjectURL(f);video.load();$('#emptyStage').classList.add('hidden');video.classList.add('visible');$('#videoName').textContent=f.name;$('#videoMeta').textContent=`${(f.size/1048576).toFixed(1)} MB`;$('#modeBadge').textContent='影片已載入';$('#playBtn').disabled=false;$('#seek').disabled=false;$('#analyzeBtn').disabled=!landmarker;$('#analyzeBtn').textContent=`開始${PROFILES[profileKey].event}分析`;$('#scoreHud').classList.add('hidden');$('#eventNow').classList.add('hidden');$('#eventRail').innerHTML='';octx.clearRect(0,0,overlay.width,overlay.height);};
video.onloadedmetadata=()=>{const valid=videoDurationIsValid();$('#videoMeta').textContent+=` · ${fmtTime(video.duration)}${valid?' · 可分析':' · 超過 60 秒'}`;$('#timeText').textContent=`0:00 / ${fmtTime(video.duration)}`;$('#analyzeBtn').disabled=!landmarker||!valid;$('#modeBadge').textContent=valid?'影片已載入':'影片過長';setModelStatus(valid?'影片可分析，最長支援 60 秒':`影片長度 ${fmtTime(video.duration)}，請裁切至 1:00 以內`,valid&&!!landmarker);};
video.ontimeupdate=()=>{if(!video.duration)return;$('#seek').value=video.currentTime/video.duration*1000;$('#timeText').textContent=`${fmtTime(video.currentTime)} / ${fmtTime(video.duration)}`;};
video.onplay=()=>{$('#playBtn').textContent='Ⅱ';cancelAnimationFrame(playbackRaf);playbackRaf=requestAnimationFrame(playbackLoop);};video.onpause=()=>{$('#playBtn').textContent='▶';cancelAnimationFrame(playbackRaf);playbackRaf=0;if(analysis&&!busy)renderFrameAt(video.currentTime);};
$('#playBtn').onclick=()=>video.paused?video.play():video.pause();$('#seek').oninput=e=>{if(!demoMode)jumpTo(video.duration*e.target.value/1000);};
$('#playbackRate').onchange=e=>{video.playbackRate=+e.target.value;};video.playbackRate=+$('#playbackRate').value;
$('#mirrorBtn').onclick=()=>{mirrored=!mirrored;$('#mirrorBtn').setAttribute('aria-pressed',mirrored);video.classList.toggle('mirrored',mirrored);overlay.classList.toggle('mirrored',mirrored);};
$('#demoBtn').onclick=()=>{demoMode=true;video.removeAttribute('src');video.load();$('#emptyStage').classList.remove('hidden');$('#emptyStage').innerHTML='<div class="demo-people"><i></i><i></i><i></i></div><strong>內建三人套路同步示範</strong><span>含兩段刻意加入的節奏與姿態差異</span>';$('#videoName').textContent='內建示範 · 模擬骨架資料';$('#videoMeta').textContent='18 秒';$('#modeBadge').textContent='示範資料';$('#analyzeBtn').disabled=false;$('#analyzeBtn').textContent='分析示範';$('#playBtn').disabled=true;$('#seek').disabled=false;$('#seek').value=0;frames=makeDemo();analysis=calculate(frames);renderResults();$('#scoreHud').classList.remove('hidden');drawDemoAt(0);};
$('#seek').addEventListener('input',e=>{if(demoMode){const t=18*e.target.value/1000;$('#timeText').textContent=`${fmtTime(t)} / 0:18`;drawDemoAt(t);}});
$('#analyzeBtn').onclick=analyzeVideo;
$('#lagThreshold').onchange=()=>{if(frames.length){analysis=calculate(frames);renderResults();jumpTo(demoMode?18*$('#seek').value/1000:video.currentTime||0);}};
$('#exportBtn').onclick=()=>{if(!analysis)return;const profile=PROFILES[analysis.profileKey];const payload={tool:'Dance Sync 武術套路同步分析',producer:'臺灣運動健康科技學會',updated:'2026-11',discipline:{sport:profile.sport,event:profile.event,profile:analysis.profileKey},mode:demoMode?'simulated-demo':'local-video',settings:analysis.settings,method:'clip-relative 2D pose, arrival, stop and formation-motion agreement',limits:['relative visual agreement, not official judging or technique correctness','clip-relative scores cannot be compared across videos','single-camera 2D pose; occlusion and crossings can swap identities','timing resolution is limited by selected sampling FPS','no force, breathing, gaze, kiai or audio analysis'],summary:{athletes:analysis.maxPeople,overall:analysis.score,posture:analysis.posture,timing:analysis.timing,stop:analysis.stop,formation:analysis.formation,coverage:analysis.coverage},events:analysis.events,pairs:analysis.pairStats,series:analysis.frames.map(f=>({t:f.t,overall:f.scoreSmooth,posture:f.postureSmooth,timing:f.timingSmooth,stop:f.stopSmooth,formation:f.formationSmooth,people:f.people.length}))};const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));a.download=`martial-sync-${analysis.profileKey}-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);};
chart.onclick=e=>{if(!analysis?.frames.length)return;const r=chart.getBoundingClientRect(),pct=clamp((e.clientX-r.left-34)/(r.width-48));jumpTo(pct*analysis.frames.at(-1).t);if(demoMode){$('#seek').value=pct*1000;}else{$('#seek').value=pct*1000;}};
window.addEventListener('resize',()=>{drawChart();if(analysis?.frames.length)jumpTo(demoMode?18*$('#seek').value/1000:video.currentTime||0);});
document.querySelectorAll('.discipline').forEach(button=>button.onclick=()=>{profileKey=button.dataset.profile;document.querySelectorAll('.discipline').forEach(b=>b.classList.toggle('active',b===button));const profile=PROFILES[profileKey];$('#profileHelp').innerHTML=`<b>${profile.event}：</b>${profile.help}`;$('#analyzeBtn').textContent=demoMode?'分析示範':`開始${profile.event}分析`;if(frames.length){analysis=calculate(frames);renderResults();if(analysis.frames.length)jumpTo(analysis.frames[0].t);}});
drawChart();loadModel();
