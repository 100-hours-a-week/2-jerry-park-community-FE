import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 5500; // 프론트엔드 서버 포트

// 현재 작업 디렉토리 설정 (__dirname 대체)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// FE 폴더를 정적 파일 경로로 설정
app.use(express.static('FE'));

// 루트 디렉토리의 config.js 제공
app.use('/config.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'config.js'));
});

// 서버 시작
app.listen(port, () => {
    console.log(`FE 서버 시작 : http://localhost:${port}`);
});
console.log('현재 작업 디렉토리:', process.cwd());