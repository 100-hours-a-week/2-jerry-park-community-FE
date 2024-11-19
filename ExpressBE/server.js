// server.js
const express = require('express');
const timeout = require('connect-timeout'); // connect-timeout 모듈
const rateLimit = require('express-rate-limit'); // express-rate-limit 모듈
const itemRoutes = require('./routes/itemRoutes'); // Routes 가져오기 (예전 제리가방)
const postRoutes = require('./routes/postRoutes'); // 게시물 업로드 route 등록
const app = express();
const port = 3000;

// JSON 바디 파싱 미들웨어
app.use(express.json());

// 요청 타임아웃 설정 (예: 5초)
app.use(timeout('5s'));

// 타임아웃 에러 핸들링 미들웨어
app.use((req, res, next) => {
    if (req.timedout) {
        return res.status(503).json({ message: 'Request timed out!' });
    }
    next();
});

// 요청 제한 미들웨어 설정 (1분에 100번 요청만 허용)
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1분 동안
    max: 100, // 1분에 최대 100번 요청 허용
    message: 'Too many requests from this IP, please try again after a minute.',
});

// 모든 요청에 대해 rate limiter 미들웨어 적용
app.use(limiter);

// 라우터 등록
app.use('/api', itemRoutes); // '/api' 경로로 itemRoutes 연결

app.use('/api/posts',postRoutes);
// /api/posts 경로에 postRoutes 연결 (게시물 업로드 라우터)

// 서버 시작
app.listen(port, () => {
    console.log(`서버 시작 : http://localhost:${port}`);
});
