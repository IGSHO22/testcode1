import * as axios from 'axios';
import * as fs from 'fs';

// API Gatewayの基本URL
const baseUrl = 'http://127.0.0.1:3000/request-detail/admin-store-registration/';

async function downloadCsv(param: string | null) {
  try {
    // URLに可変パラメータを追加
    const apiUrl = `${baseUrl}/${param}`;
    const response = await axios.get(apiUrl, {
      responseType: 'arraybuffer', // バイナリデータで受け取る
      headers: {
        'Content-Type': 'text/csv',
      },
    });

    // content-disposition ヘッダーからファイル名を取得
    const contentDisposition = response.headers['content-disposition'];
    let filePath = `downloaded_data_${param}.csv`; // デフォルトのファイル名

    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?([^"]+)"?/); // filename を抽出
      if (match && match[1]) {
        filePath = match[1];
      }
    }

    // レスポンスデータをBufferに変換してCSVファイルとして保存
    const bufferData = Buffer.from(response.data as ArrayBuffer); // 明示的に型変換
    fs.writeFileSync(filePath, bufferData);
    console.log(`CSVファイルが ${filePath} に保存されました。`);
  } catch (error: any) {
    if (error.response) {
      console.log('エラーステータス:', error.response.status); // HTTPステータスコード
      console.log('エラーメッセージ:', error.response.statusText);
    } else if (error.request) {
      console.log('リクエストが送信されましたが、レスポンスがありません。');
      console.log('リクエスト情報:', error.request);
    } else {
      console.log('エラー詳細:', error.message); // その他のエラー情報
    }
  }
}

// コマンドライン引数からパラメータを取得
const param = process.argv[2];
if (param) {
  downloadCsv(param);
} else {
  downloadCsv(null);
}
