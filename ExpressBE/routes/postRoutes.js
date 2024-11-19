// express 객체
const express = require('express');
const router = express.Router();

// 게시글 업로드 요청 처리하는 담당 컨트롤러 가져오기
const postController = require('../controllers/postController');

router.post('/', postController.createPost);
// POST 요청 들어올 시 실행되는 라우터 정의
// postController의 createPost 함수를 호출 (POST시)

module.exports = router;
// 이 라우터 모듈 내보냄
