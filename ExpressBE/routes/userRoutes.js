const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


// register 경로로 들어온 POST 요청 처리
router.post('/register', userController.registerUser);

// /login 경로로 들어온 post 요청 처리 (로그인 라우트)
router.post('/login', userController.loginUser);

// user_id 통해 회원정보 수정페이지 get
router.get('/:user_id', userController.getUser);

// user_id 통해 회원정보 닉네임 수정 put
router.put('/:user_id', userController.updateUserNickname);

// user_id 통해 비밀번호 변경
router.put('/:user_id/password', userController.updateUserPassword);

// user_id 통해 회원 탈퇴
router.delete('/:user_id', userController.deleteUser);

// 라우터 내보내기
module.exports = router;