// function nextPage() {
// window.location.href = "post_detail.html"; //이동할 페이지
// }   

// url에서 post_id 파라미터 가져옴
const urlParams = new URLSearchParams(window.location.search);
const post_id = urlParams.get('post_id');

// 서버에서 게시물 데이터 가져오기
async function loadPostData(post_id) {
    try {
        const response = await fetch(`http://localhost:3000/api/posts/post?post_id=${post_id}`);

        if (!response.ok) {
            throw new Error('게시물 가져오는 데 실패했습니다.');
        }

        const postData = await response.json();

        document.getElementById('title').value = postData.title;
        document.getElementById('content').value = postData.content;
    } catch(error) {
        console.error('게시물 로드 오류 : ', error);
    }
}

async function updatePost(post_id){
    console.log(post_id); //!!!!!!!!!언디파인 뜸
    const updatedTitle = document.getElementById('title').value.trim();
    const updatedContent = document.getElementById('content').value.trim();

    // 제목, 댓글 비었는지 검사
    if (!updatedTitle || !updatedContent){
        alert('제목과 내용을 모두 입력해주세요.');
        return;
    }

    const response = await fetch(`http://localhost:3000/api/posts/post?post_id=${post_id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title: updatedTitle,
            content: updatedContent,
        }),
    });

    const data = await response.json();

    if(data.success) {
        alert('게시글 수정 완료!');
        window.location.href = `post_detail.html?post_id=${post_id}`;
    } else {
        alert('게시글 수정 중 오류 발생');
    }
}


// localStorage 에서 user_id 가져와서 프로필 이미지 가져오기
async function loadloginProfileImage() {
    const user_id = localStorage.getItem("user_id");

    if (user_id) {
        try {
            const response = await fetch(`http://localhost:3000/api/users/${user_id}`);

            if(!response.ok) {
                throw new Error('상단 유저프로필 이미지 불러오는 중 오류');
            }

            // 응답을 user로    
            const user = await response.json();

            console.log(user.profile_img);
            // 넣을 곳
            const profile_img = document.getElementById("profile_imghead");
            profile_img.src = `http://localhost:3000${user.profile_img}`
        
        } catch(err) {
            console.error('상단 유저 프로필 이미지 오류', err);
        }
    } else {
        console.log('로그인 사용자정보 없음');
    }
}

// 페이지 로드 시 데이터 로드 함수 실행
loadPostData(post_id);
loadloginProfileImage();