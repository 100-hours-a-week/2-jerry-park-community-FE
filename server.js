const express = require('express');
const app = express();
const port = 3000;

// GET 요청 처리
app.get('/', (req, res) => {
    res.send('Get 요청 확인');
});

// 서버 시작
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
