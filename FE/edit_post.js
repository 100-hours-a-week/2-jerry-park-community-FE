// url에서 post_id 파라미터 가져옴
const urlParams = new URLSearchParams(window.location.search);
const post_id = urlParams.get('post_id');

// 세션에서 user_id 가져오기
const getUserid = async () => {
    try {
        const response = await fetch(`${BE_URL}/api/users/session`, {
            method : 'GET',
            credentials : 'include',
        });
        if (!response.ok) {
            throw new Error('세션 정보 없음');
        }
        const sessionData = await response.json();
        return sessionData.user_id;
    } catch (err) {
        console.error('세션 정보 오류', err);
        throw err;
    }
} 

// 서버에서 게시물 데이터 가져오기
const loadPostData = async (post_id) => {
    try {
        const response = await fetch(`${BE_URL}/api/posts/post?post_id=${post_id}`);

        if (!response.ok) {
            throw new Error('게시물 가져오는 데 실패했습니다.');
        }

        const postData = await response.json();

        document.getElementById('title').value = postData.title;
        document.getElementById('content').value = postData.content;

        // 기존 이미지 파일명 표시, 이미지 있다면
        if (postData.image) {
            const fileName = postData.image.split('/').pop(); // 경로에서 파일명 추출
            document.getElementById('fileNameDisplay').textContent = fileName;
        }
    } catch(error) {
        console.error('게시물 로드 오류 : ', error);
    }
}

// 파일 선택 이벤트 리스너
const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change',() => {
    const selectedFile = fileInput.files[0]; // 첫번쨰 파일
    const fileNameDisplay = document.getElementById('fileNameDisplay');

    if (selectedFile){
        fileNameDisplay.textContent = selectedFile.name; // 새 파일명
    } else {
        fileNameDisplay.textContent = '선택된 파일 없음'; // 초기 메시지
    }
});

// PATCH 요청
const updatePost = async (post_id) => {
    // console.log(post_id);
    const updatedTitle = document.getElementById('title').value.trim();
    const updatedContent = document.getElementById('content').value.trim();

    // 제목, 댓글 비었는지 검사
    if (!updatedTitle || !updatedContent){
        alert('제목과 내용을 모두 입력해주세요.');
        return;
    }

    const response = await fetch(`${BE_URL}/api/posts/post?post_id=${post_id}`, {
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


// 세션에서 user_id 가져와서 프로필 이미지 가져오기 (상단)
const loadloginProfileImage = async () => {
    try {
        const response = await fetch(`${BE_URL}/api/users/session`, {
            method: 'GET',
            credentials: 'include',
        });

        console.log('세션받아오기 response',response);
        if(!response.ok) {
            throw new Error('상단 유저프로필 이미지 불러오는 중 오류');
        }

        // 응답을 user로
        const user = await response.json();
        console.log('json 변환한 user :',user);
        console.log('user.profile_img:',user.profile_img);

        // 넣을 곳
        const profile_img = document.getElementById("profile_imghead");
        profile_img.src = `${BE_URL}${user.profile_img}`;
    
    } catch(err) {
        console.error('상단 유저 프로필 이미지 오류', err);
    }
}

// 페이지 로드 시 데이터 로드 함수 실행
loadPostData(post_id);
loadloginProfileImage();