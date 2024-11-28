function PostPage() {
    window.location.href = 'postupload.html';     /*게시물작성페이지로이동*/
}

function goToPostDetail(post_id) {
    window.location.href = `post_detail.html?post_id=${post_id}`;
}

// 게시글의 좋아요, 댓글, 조회수를 1000 이상일 때 '1k', 10000 이상일 때 '10k', 100000 이상일 때 '100k'로 표시하는 함수
    function formatNumber(num) {
        if (num >= 100000) {
            return Math.floor(num / 1000) + "k";  // 100k 이상
        } else if (num >= 10000) {
            return Math.floor(num / 1000) + "k";  // 10k 이상
        } else if (num >= 1000) {
            return Math.floor(num / 1000) + "k";  // 1k 이상
        }
        return num;  // 1000 미만은 그대로 표시
    }

// JSON 데이터를 불러와 게시글 리스트를 동적으로 생성하는 함수
// async function loadPosts() {
//     try {
//         const response = await fetch('posts.json');
//         const posts = await response.json();
        
//         const postList = document.getElementById("postList");
//         posts.forEach(post => {
//             const postbox = document.createElement("div");
//             postbox.className = "postbox";
//             postbox.onclick = () => goToPostDetail(post.postid);

//             postbox.innerHTML = `
//                 <h1>${post.title}</h1>
//                 <div class="like">
//                     <p>좋아요 ${formatNumber(post.likes)}</p>
//                     <p>댓글 ${formatNumber(post.comments)}</p>
//                     <p>조회수 ${formatNumber(post.views)}</p>
//                     <p1>${post.date}</p1>
//                 </div>
//                 <hr>
//                 <div class="author">
//                     <img class="image" src="profile_img.webp"/>
//                     <p>${post.author}</p>
//                 </div>
//             `;
//             postList.appendChild(postbox);
//         });
//     } catch (error) {
//         console.error("게시글 데이터를 불러오는 데 실패했습니다:", error);
//     }
// }

// 페이지 로딩시 게시물리스트 가져오기
async function loadPosts() {
    try {
        // 서버에서 데이터 가져와 get 요청 실행 (게시글 api 주소)
        const offset = 0;
        const limit = 6;

        const response = await fetch(`http://localhost:3000/api/posts?offset=${offset}&limit=${limit}`); 
    // 응답 비정상시 에러 출력
    if (!response.ok) {
        throw new Error(`게시글 읽는 중 에러 발생 : ${response.status}`);
    }
    // 서버 변환 데이터 JSON 으로 변환
    const data = await response.json();
    
    const posts = data.data

    // HTML에서 게시글 목록 표시할 컨테이너 선택
    const postList = document.getElementById("postList");

    // 이전에 표시된 게시글 목록 초기화
    postList.innerHTML = "";

    // forEach는 배열의 각 요소에 대해 한 번 씩 콜백함수 실행
    posts.forEach(post => {   
        // 각 게시글 감싸는 div 요소 생성
        const postbox = document.createElement("div");

        // 생선한 div 요소에 클래스 이름 지정(css 적용 위해) 
        postbox.className = "postbox";
        
        // 클릭시 해당 게시글 상세 페이지로 이동
        postbox.onclick = () => goToPostDetail(post.post_id);

        console.log ('이미지 값 : ', post.profile_img);
        // 게시글 내용을 HTML로 작성
        postbox.innerHTML = `
        <h1>${post.title}</h1> <!-- 게시글 제목 -->
        <div class="like">
            <p>좋아요 ${formatNumber(post.likes)}</p> <!-- 좋아요 수 -->
            <p>조회수 ${formatNumber(post.views)}</p> <!-- 조회수 -->
            <p>작성일: ${new Date(post.created_time).toLocaleDateString()}</p> <!-- 작성일 -->
        </div>
        <hr>
        <div class="author">
            <img class="image" src="http://localhost:3000${post.profile_img}" > <!-- 프로필 이미지 -->
            <p>작성자: ${post.nickname}</p> <!-- 작성자 ID -->
        </div>
    `;
    // alt="profile_img.webp"/
    // 생성한 게시글 요소를 HTML 페이지의 'postList' 영역에 추가
    postList.appendChild(postbox);
    });
    } catch(error) {
        console.error("게시글 데이터 불러오는 데 실패했습니다 : ", error);
    }
}

// localStorage 에서 user_id 가져와서 프로필 이미지 가져오기
async function loadloginProfileImage() {
    const user_id = localStorage.getItem("user_id");

    if (user_id){
        try {
            const response = await fetch(`http://localhost:3000/api/users/${user_id}`);

            if(!response.ok) {
                throw new Error('상단 유저프로필 이미지 불러오는 중 오류');
            }

            // 응답을 user로
            const user = await response.json();

            console.log(user.profile_img);
            // 넣을 곳
            const profile_img = document.getElementById("profile_img");
            profile_img.src = `http://localhost:3000${user.profile_img}`
        
        } catch(err) {
            console.error('상단 유저 프로필 이미지 오류', err);
        }
    } else {
        console.log('로그인 사용자정보 없음');
    }
}


// 페이지 로드 시 게시글 데이터를 불러옵니다
window.onload = function() {
    loadPosts();
    loadloginProfileImage();
};
