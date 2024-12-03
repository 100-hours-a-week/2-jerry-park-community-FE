const express = require('express');
const app = express();
const port = 5500; // 프론트엔드 서버 포트

// FE 폴더를 정적 파일 경로로 설정
app.use(express.static('FE'));

// 서버 실행
app.listen(port, () => {
    console.log(`프론트 서버 시작 : http://localhost:${port}`);
});
console.log('현재 작업 디렉토리:', process.cwd());