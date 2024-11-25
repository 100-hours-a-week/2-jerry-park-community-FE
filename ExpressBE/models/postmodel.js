// jerryDBpool.js 에서 풀 가져오기
const jerrydb = require('../DBpools/jerryDBpool');

// 게시글 새로 작성
async function createPost({title, content, user_id}) {

    // // title, content, user_id가 undefined라면 null로 처리
    // if (title === undefined) title = null;
    // if (content === undefined) content = null;
    // if (user_id === undefined) user_id = null;

    
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

// 게시글 가져오기 sql문
async function getPosts() {
    // posts 테이블에서 내림차순 쿼리문

    // user_id 통해 users에서 nickname 가져오기
    const sql = `
        SELECT posts.*, users.nickname
        FROM posts
        INNER JOIN users ON posts.user_id = users.user_id
        ORDER BY posts.created_time DESC
    `;

    try {
        const [rows] = await jerrydb.execute(sql);
        return rows;
    } catch (err) {
        console.error('게시글 조회 중 에러 발생 ', err.message);
        throw err;    
    }
}

// 게시물 상세 조회
async function getPostById(post_id){
    const sql = `
        SELECT posts.*, users.nickname
        FROM posts
        INNER JOIN users ON posts.user_id = users.user_id
        WHERE posts.post_id = ?
    `;

    try {
        // DB에 쿼리 실행.
        // execute로 쿼리문의 ? 자리에 post_id 삽입
        const [rows] = await jerrydb.execute(sql,[post_id]);
        // 쿼리는 배열형태
        return rows[0];
    } catch (err) {
        console.error('게시글 상세 조회 중 에러 발생', err.message);
        throw err;
    }
}

async function updatePost(post_id, {title, content}) {
    const sql = `
        UPDATE posts
        SET title = ?, content = ?, created_time = NOW()
        WHERE post_id = ?
    `;
    try {
        const [result] = await jerrydb.execute(sql, [title,content,post_id]);

        // 업데이트 된 행 개수 반환하여 성공 여부 판단
        if (result.affectedRows === 0){
            throw new Error('쿼리에서 수정 실패');
        }
        return {success: true};
    } catch (err) {
        console.error('게시글 수정 중 오류 발생 : ', err.message);
        throw err;
    }
}

async function deletePost(post_id) {
    const sql = `
        DELETE FROM posts WHERE post_id = ?
    `;

    try { 
        const[result] = await jerrydb.execute(sql,[post_id]);
        return result;
    } catch(err){
        console.error('게시물 삭제 중 오류 발생 (db)', err.message);
        throw err;
    }
}

// 게시글추가 함수 createPost 내보내기
module.exports = {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
};