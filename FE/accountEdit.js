// 세션에서 user_id 가져오기
const getUserid = async () => {
    try {
        const response = await fetch(`${BE_URL}/api/users/session`, {
            method : 'GET',
            credentials : 'include',
        });
        if (!response.ok) {
            alert('로그인 후 이용해주세요 !');
            window.location.href = 'index.html'
            throw new Error('세션 정보 없음');
        }
        const sessionData = await response.json();
        return sessionData.user_id;
    } catch (err) {
        console.error('세션 정보 오류', err);
        throw err;
    }
} 

// 닉네임 변경 (회원정보)
const saveNickname = async () => {
    const helperText1 = document.getElementById('helperText1');
    // 텍스트 상자에서 nickname 가져옴
    const nickname = document.getElementById('nickname').value;
    console.log('클라에서 수정할 닉넴 : ', nickname);
    
    // 세션에서 user_id 가져오기
    const user_id = await getUserid();

    // 닉네임 입력 공란
    if (!nickname.trim()) {
        helperText1.innerText = "* 닉네임을 입력해주세요.";
        helperText1.style.display = "block"; // Helper text 표시
        return;
    }
    // 닉네임 11자 이상 작성시
    if (nickname.length > 10) {
        helperText1.innerText = "* 닉네임은 최대 10자 까지 작성 가능합니다.";
        helperText1.style.display = "block"; // Helper text 표시
        return
    }

    // 유효성 검사 성공시 try문 실행
    try {
        // 닉네임 중복검사 get 요청
        const checkNicknameResponse = await fetch(`${BE_URL}/api/users/nicknamecheck/${nickname}`);
        const checkNicknameData = await checkNicknameResponse.json(); // 응답을 json으로
        if (checkNicknameResponse.ok){
            // 닉네임 변경 요청
            const response = await fetch(`${BE_URL}/api/users/${user_id}`, {
                method : 'PUT',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include', // 쿠키 전달 허용
                body: JSON.stringify({ nickname })    
            });
            // 로그인 안 했을시 (컨트롤러 401)
            if (response.status === 401){
                alert('로그인 후 닉네임 변경해주세요.');
            }

            if (!response.ok) {
                throw new Error('닉네임 수정 실패');
            }
            

            // 수정 성공시 토스트 메시지
            const toast = document.getElementById("toast");
            // 일정 시간 후 토스트 메시지 숨기기
            if (toast) {
                toast.classList.add("show");
                setTimeout(() => {
                    toast.classList.remove("show");}, 2000); // 2초 후 사라짐
            }
        } else {
            // 닉네임 중복시 출력
            console.log('checkNickname: ',checkNicknameData);
            helperText1.innerText = checkNicknameData.message;
            helperText1.style.display = "block"; // Helper text 표시
        }
    } catch (error) {
        console.error('닉넹미 수정 오류:', error);
    }
}

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

// 페이지 로딩시 회원정보 가져오기 (post_id 있으면)
// users 정보 가져오기
async function loadUserData() {
    try {
        // 세션에서 user_id 가져오기
        const user_id = await getUserid();
        const response = await fetch(`${BE_URL}/api/users/${user_id}`, {
            method : 'GET',
            credentials: 'include',
        });

        if (!response.ok){
            throw new Error('사용자 정보 불러오기 실패');
        }
        // 서버로부터 응답 데이터 (GET요청 후)
        const userData = await response.json();

        // 넣을 곳
        document.getElementById('email').innerText = userData.email;
        document.getElementById('nickname').value = userData.nickname;

        // 프로필 이미지 설정
        const profile_img = document.getElementById("profile_imghead");
        const profile_img1 = document.getElementById("profile_img");
        profile_img.src = `${BE_URL}${userData.profile_img}`;
        profile_img1.src = `${BE_URL}${userData.profile_img}`;
        // console.log('userData 값 :',userData);
        // console.log('userData.profile_img 값 : ',userData.profile_img);
    } catch(error) {
        console.error('사용자 정보 로드 오류 : ', error);
    }
}


// 회원 탈퇴
const deleteAccount = async () => {
    // 세션에서 user_id 가져오기
    const user_id = await getUserid();
    if (!user_id) {
        console('사용자 id 없음 (탈퇴)');
        return;
    }
    openModal('delete'); // 탈퇴 모달 열기
    
}

// 모달 여닫는 JS 함수임
const openModal = (type) => {
    if (type === 'delete') {
        document.getElementById('deleteModal').style.display = 'flex';
    }
}
const closeModal = () => {
    document.getElementById('deleteModal').style.display = 'none';
}
// 모달에서 회원탈퇴 확인 버튼 누를 시
const confirmDelete = async () => {
    closeModal(); // 모달 닫기
    try {
        // 세션에서 user_id 가져오기
        const user_id = await getUserid();

        const response = await fetch(`${BE_URL}/api/users/${user_id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json(); // 서버 응답

        if (response.ok) {
            alert('회원 탈퇴 완료');
            localStorage.removeItem('user_id');
            window.location.href = 'index.html';
        } else {
            alert(data.mesage || '회원 탈퇴에 실패했습니다.');
            console.log(data.message);
        }
    } catch(err) {
        console.error('회탈중 오류 발생, ',err);
        alert('서버 오류가 발생했습니다.');
    }
}

loadUserData();