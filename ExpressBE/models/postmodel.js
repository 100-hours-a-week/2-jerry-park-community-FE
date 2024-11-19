// jerryDBpool.js 에서 풀 가져오기
const jerrydb = require('../DBpools/jerryDBpool');

async function createPost({title, content, user_id}) {
    // 쿼리는 posts 테이블에 삽입
    const sql = `
        INSERT INTO posts (title, content, user_id, likes, views, created_time)
        VALUES (?,?,?,0,0,NOW())
    `;
    // !!!!!!!!!!!!!!!!!!!! likes, views 구현 필요....

    try {
        // DB에 쿼리 실행
        const[result] = await jerrydb.execute(sql, [title,content,user_id]);

        // 삽입된 게시글의 고유 id 반환 (post_id)
        return result.insertId;
    } catch (err) {
        // 오류 콘솔 출력
        console.error('게시글 작성 중 오류 발생 : ', err.message);

        // 호출한 쪽으로 다시 전달
        throw err;
    }
}

// 게시글추가 함수 createPost 내보내기
module.exports = {
    createPost,
};