// 이 컨트롤러는 게시물 작성 요청 들어오면 실행된다.

// 모델 가져오기 !
const postModel = require('../models/postmodel');

async function createPost(req, res) {
    // req.body는 클라가 보낸 데이터 본문 가져오는 객체
    const {title, content, user_id} = req.body;
    
    try {
        // createPost 함수 호출, db에 게시글 저장, 게시글 id 반환
        const newPostId = await postModel.createPost({title, content, user_id});

        // DB 삽입 성공여부 (201 성공)
        res.status(201).json({
            message: '게시글 작성 성공',
            post_id : newPostId,
        });
    } catch (err) {
        // (500 오류 interval server error)
        res.status(500).json({
            message : '게시글 작성 중 오류 발생',
            error : err.message,
        });
    }
}

// createPost 모듈 외부로 exports
module.exports = {
    createPost,
};