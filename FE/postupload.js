// 제목, 내용 받아오기
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const submitButton = document.getElementById('submitButton');
const helperText = document.getElementById('helperText');

// 폼 ID, 삽입할 이미지 ID 가져오기
const postForm = document.getElementById('postForm');
const image = document.getElementById('image');


// 초기 상태 설정: 버튼 비활성화, 헬퍼 텍스트 숨김
function initializeState() {
    submitButton.classList.remove('active');
    submitButton.disabled = true;
}

// 입력 상태로 버튼 색상 바꾸기
function updateButtonState() {
    const titleFilled = titleInput.value.trim() !== '';
    const contentFilled = contentInput.value.trim() !== '';
    
    if (titleFilled && contentFilled) {
        submitButton.classList.add('active');
        submitButton.disabled = false;
        helperText.style.display = 'none'; // 유효한 입력 시 헬퍼 텍스트 숨기기
    } else {
        submitButton.classList.remove('active');
        submitButton.disabled = true;
    }
}

// 버튼 클릭 시 비활성화 상태면 헬퍼텍스트 표시
submitButton.addEventListener('click', (event) => {
    console.log('버튼 클릭됨');
    if (submitButton.disabled) {
        event.preventDefault(); // 폼 제출 막기
        helperText.style.display = 'block';
        helperText.innerText = '* 제목, 내용을 모두 작성해주세요';
    }
});

// 입력 이벤트 리스너
titleInput.addEventListener('input',updateButtonState);
contentInput.addEventListener('input',updateButtonState);

// 세션에서 user_id 가져오기
const getUserid = async () => {
    try {
        const response = await fetch(`${BE_URL}/api/users/session`, {
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

// 'submit' 이벤트에서 uploadPost 호출
postForm.addEventListener('submit',async (event) => {
    event.preventDefault(); // 폼 기본 동작 방지

    if (submitButton.disabled) {
        return; // 비활성화된 상태에서 제출 막기
    }

    // 세션에서 user_id 가져오기
	const user_id = await getUserid();
    // console.log('작성하려는 user_id :',user_id);
    if(!user_id){
        alert('로그인 후 글 작성해주세요');
        return;
    }

    // 버튼 비활성화 아니고 세션 확인 후 업로드 POST 요청
    try {
        // FormData 객체 생성
        // FormData는 폼 데이터를 서버로 보낼 때 사용하는 객체. (텍스트와 파일을 한 번에 서버로 전송)
        const formData = new FormData();
        // 제목과 내용, user_id를 FormData에 추가
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

        // 서버에 POST 요청 fetch 로 보내기
        const response = await fetch(`${BE_URL}/api/posts`, {
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
    } catch (err){
        console.error('업로드 중 서버와 통신 실패 ', err);
    }

});

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

// 파일 선택 이벤트 리스너
const fileInput = document.getElementById('image');
const fileNameDisplay = document.getElementById('fileNameDisplay');

fileInput.addEventListener('change',() => {
    const selectedFile = fileInput.files[0]; // 첫번쨰 파일
    if (selectedFile){
        fileNameDisplay.textContent = selectedFile.name; // 새 파일명
    } else {
        fileNameDisplay.textContent = '파일을 선택해주세요.'; // 초기 메시지
    }
});

// 버튼 클릭시 드롭다운
const toggleDropdown = (event) => {
    console.log("toggleDropdown 실행"); // 디버그용 로그
    const dropdownMenu = document.getElementById("dropdownMenu");
    dropdownMenu.classList.toggle("show");
};

// 드롭다운 외부 클릭 시 닫기
document.addEventListener("click", (event) => {
    const dropdownMenu = document.getElementById("dropdownMenu");
    const profileImg = document.getElementById("profile_imghead");

    if (!dropdownMenu.contains(event.target) && event.target !== profileImg) {
        dropdownMenu.classList.remove("show");
    }
});

// 프로필 이미지를 클릭하면 드롭다운 메뉴 표시
document.getElementById("profile_imghead").addEventListener("click", toggleDropdown);

// 초기 상태 업데이트
initializeState();

// 페이지 로드 시 게시글 데이터를 불러옵니다
window.onload = function() {
    loadloginProfileImage();
};
