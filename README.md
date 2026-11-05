# Dance Sync 多人舞蹈同步分析

資助單位：臺灣運動健康科技學會  
版本更新：2026 年 11 月

這是一個瀏覽器端的多人舞蹈動作同步分析 WebApp。匯入影片後，系統使用 MediaPipe Pose Landmarker 偵測 2–6 位舞者，以身體線段角度比較姿態形狀，並以角度變化速度比較動作節奏。影片不會由本程式主動上傳或保存。

## 功能

- 最長 60 秒的本機影片匯入與瀏覽器端逐幀分析
- 多人 2D 骨架疊圖與暫時身分標記
- 整體、姿態與節奏同步分數
- 舞者兩兩姿態比較
- 同步趨勢圖與低同步片段回看
- 分析後連續外骨骼回放與 1/2、1/4、1/8、1/16 倍慢速播放
- 時間軸事件點、嚴重度分類與自動 Review 重點清單
- 團體型以到位時間差／整齊度為最高權重，事件標示相對前排選手的最大快慢拍差（ms）
- JSON 分析資料匯出
- 內建三人模擬示範，不需影片即可操作介面
- 手機、平板與桌面響應式版面

## 本機開發

```bash
pnpm install
pnpm dev
```

正式建置：

```bash
pnpm build
pnpm preview
```

## Firebase Hosting

`firebase.json` 已設定發布 `dist/`。部署前須先確認目前 Firebase CLI 登入的是 **SKYFU218 對應帳號**，並確認要使用的 Firebase project 與 Hosting site，之後才執行：

```bash
pnpm build
firebase use <PROJECT_ID>
firebase deploy --only hosting:<SITE_ID>
```

請勿直接猜測 project ID 或 site ID，以免覆蓋既有網站。

## 方法與限制

本工具的分數是「同一片段內的相對一致性」，不是舞蹈正確性。系統會使用片段內較佳及較差的姿態／節奏差異映射 0–100，因此不同影片的分數不可直接比較。它不讀取音訊或音樂節拍；單鏡頭、遮擋、人物交叉、轉身與未完整入鏡都會影響結果。

本工具適合教練回看與教學討論，不是醫療診斷、實驗室量測或正式競賽評分。

影片長度上限為 60 秒。系統會先驗證影片長度，逐幀讀取時包含逾時保護；分析時間會依影片長度、取樣 FPS、同框人數與裝置效能而異。

團體型的整體分數權重為到位時間差 50%、技術形狀 20%、定勢停止 20%、移位一致 10%。事件時間差以人物動作速度由高轉低的到位時刻估算，前排選手依事件影格中較接近鏡頭的位置辨識；毫秒值受取樣 FPS、遮擋、轉身及暫時身分交換影響，是影片回看提示而非實驗室計時結果。

## 開源來源與授權

本作品參考 Jeremy Park 的 [`vision-demos/dance_sync`](https://github.com/jeremyipark/vision-demos/tree/main/dance_sync) 概念與方法說明，重新實作為純前端 WebApp。原專案採 Apache License 2.0，詳見 [LICENSE](./LICENSE) 與 [NOTICE](./NOTICE)。
