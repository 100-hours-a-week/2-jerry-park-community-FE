// 제목, 내용 받아오기
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const compButton = document.getElementById('compb');

// 폼 ID, 삽입할 이미 ID 가져오기
const postForm = document.getElementById('postForm');
const image = document.getElementById('image');

// 입력 상태로 버튼 색상 바꾸기
function updateButtonState() {
    if(titleInput.value.trim() !=='' && contentInput.value.trim()!==''){
        compButton.classList.add('active');
    } else {
        compButton.classList.remove('active');
    }
}

titleInput.addEventListener('input',updateButtonState);
content.addEventListener('input',updateButtonState);

// 세션에서 user_id 가져오기
const getUserid = async () => {
    try {
        const response = await fetch(`http://localhost:3000/api/users/session`, {
            method : 'GET',
            credentials : 'include',
        });
        if (!response.ok) {
            console.error('세션 정보 없음');
        }
        const sessionData = await response.json();
        return sessionData.user_id;
    } catch (err) {
        console.error('세션 정보 오류', err);
    }
} 

const uploadPost = async (event) => {
    event.preventDefault(); // 폼 기본 동작 방지
    // 제목, 내용 안 비었는지 검사
    if (titleInput.value.trim() === '' || contentInput.value.trim()===''){
        alert("*제목, 내용을 모두 작성해주세요");
        return; //함수 종료
    }

    // 세션에서 user_id 가져오기
	const user_id = await getUserid();
    // console.log('작성하려는 user_id :',user_id);
    if(!user_id){
        alert('로그인 후 글 작성해주세요');
        return;
    }
    // FormData 객체 생성
    // FormData는 폼 데이터를 서버로 보낼 때 사용하는 객체. (텍스트와 파일을 한 번에 서버로 전송)
    const formData = new FormData();

    // 제목과 내용을 FromData에 추가
    formData.append('title',titleInput.value); 
    formData.append('content', contentInput.value);
    formData.append('user_id',user_id);

    formData.forEach((value,key)=> {
        console.log(`${key}: ${value}`);
    })

    // 이미지 파일 추가 (선택된 경우만)
    if (image.files.length > 0) {
        formData.append('image', image.files[0]);
    }

    try {
        // 서버에 POST 요청 fetch 로 보내기
        const response = await fetch('http://localhost:3000/api/posts', {
            method : 'POST',
            body: formData,
        });

        //서버 응답 확인
        if (response.ok) {
            console.log('게시글 작성찐성공페이지이동돼야함');
            window.location.href = 'postlist.html';
            alert('게시글 작성 성공');
        } else {
            // 응답 상태 200 아니면 실패로 간주
            const errorData = await response.json();
            console.log('게시글 작성 실패 :', errorData.message);
        }
    }catch (error) {
        console.error('서버와 통신 실패', error);
    }   
}

// 'submit' 이벤트에서 uploadPost 호출
postForm.addEventListener('submit',uploadPost);

// 세션에서 user_id 가져와서 프로필 이미지 가져오기 (상단)
const loadloginProfileImage = async () => {
    try {
        const response = await fetch(`http://localhost:3000/api/users/session`, {
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
        profile_img.src = `http://localhost:3000${user.profile_img}`;
    
    } catch(err) {
        console.error('상단 유저 프로필 이미지 오류', err);
    }
}

// 페이지 로드 시 게시글 데이터를 불러옵니다
window.onload = function() {
    loadloginProfileImage();
};
