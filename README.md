# TOKYO SQUAD — GitHub Pages 版設定教學

朋友只要打開網址就能用，**不需要任何帳號**。要做的事只有一次，約 10 分鐘，由你（建立者）完成。

整體是兩塊：**GitHub Pages**（放網頁）＋ **Firebase 即時資料庫**（同步大家的資料，免費方案夠用）。

## 步驟 1：建立 Firebase 即時資料庫

1. 用 Google 帳號登入 https://console.firebase.google.com ，按「建立專案」，名稱隨意（例如 tokyo-squad），Google Analytics 可以關掉。
2. 左邊選單 **建構 (Build) → Realtime Database → 建立資料庫**。
   - 位置選 **新加坡 (asia-southeast1)**，離台灣最近。
   - 安全規則先選「以測試模式啟動」，下一步會改掉。
3. 進入資料庫後點上方 **規則 (Rules)** 分頁，整段換成下面這個後按「發布」：

```json
{
  "rules": {
    "rooms": {
      "$room": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

   這樣別人沒辦法列出所有房間，必須知道房間暗號才讀得到資料。

4. 左上角 ⚙️ **專案設定 → 一般 → 您的應用程式**，按 `</>`（網頁）新增一個 Web 應用程式，名稱隨意，不用勾 Hosting。
5. 畫面會出現一段 `firebaseConfig`，包含 `apiKey`、`authDomain`、`databaseURL`、`projectId`、`appId`。
   - 如果沒有 `databaseURL`，到 Realtime Database 頁面最上方複製網址（長得像 `https://xxx-default-rtdb.asia-southeast1.firebasedatabase.app`）。

## 步驟 2：把設定貼進 index.html

用任何文字編輯器打開 `index.html`，找到最上面的設定區：

```js
const CONFIG={
 firebase:{ apiKey:"", authDomain:"", databaseURL:"", projectId:"", appId:"" },
 room:"tk27-xxxxxxxxxx"
};
```

把步驟 1 的五個值填進去。`room` 已經幫你產生一組隨機暗號，保留即可，**不要改成容易猜的字**。

## 步驟 3：放上 GitHub Pages

1. 到 https://github.com 登入，右上角 **＋ → New repository**，名稱例如 `tokyo-squad`，選 **Public**，建立。
2. 在新倉庫頁面點 **uploading an existing file**，把填好設定的 `index.html` 拖進去，按 **Commit changes**。
3. **Settings → Pages**：Source 選 **Deploy from a branch**，Branch 選 `main`、資料夾 `/ (root)`，按 Save。
4. 等 1～2 分鐘，頁面上方會出現網址：`https://你的帳號.github.io/tokyo-squad/`。把網址傳給朋友就能用。

手機 Safari 可以「分享 → 加入主畫面」，之後像 App 一樣開。

## 注意事項

- **安全性**：知道網址的人都可以進來看和修改，這是為了讓朋友免登入。請只分享給同行的人。
  - 航班區的「訂位代碼」可用來管理訂位，建議不要填，或確認只有同行朋友拿得到網址。
  - 不要在記帳備註或行程裡放護照、信用卡等資料。
- **費用**：Firebase 的免費方案（Spark）對四個人用綽綽有餘。
- **和 Claude 版的差別**：
  - 少了「✨ 估交通」按鈕（需要 Claude），保留「🗺 即時路線」連到 Google 地圖。
  - 資料庫是全新的，Claude 預覽版裡已經輸入的資料不會帶過來。
- **更新網頁**：之後要改版，只要把新的 `index.html` 重新上傳覆蓋，並把設定再填一次（或請 Claude 直接幫你帶好設定）。
- 沒填 Firebase 設定時，網頁會以「本機試玩」模式運作，只有你自己看得到，不會報錯。
