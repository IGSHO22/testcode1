import * as axios from 'axios';
import * as fs from 'fs';

// API Gatewayの基本URL
const baseUrl = 'http://127.0.0.1:3000/request-detail/admin-store-registration/';

async function downloadCsv(param: string) {
  try {
    // URLに可変パラメータを追加
    const apiUrl = `${baseUrl}/${param}`;
    const response = await axios.get(apiUrl, {
      responseType: 'arraybuffer', // バイナリデータで受け取る
      headers: {
        'Content-Type': 'text/csv',
      },
    });

    // レスポンスデータをBufferに変換してCSVファイルとして保存
    const filePath = `downloaded_data_${param}.csv`;
    const bufferData = Buffer.from(response.data as ArrayBuffer); // 明示的に型変換
    fs.writeFileSync(filePath, bufferData);
    console.log(`CSVファイルが ${filePath} に保存されました。`);
  } catch (error:any ) {
    if(error.response){
      console.log('status:', error.response.status);
    }
    else {
      console.log("Error:",error)
    }
  }
}

// コマンドライン引数からパラメータを取得
const param = process.argv[2];
if (param) {
  downloadCsv(param);
} else {
  console.log("エラー: 数字を入力してください。例: node index.js 2");
}
