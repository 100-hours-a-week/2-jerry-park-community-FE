// 로컬에서 user_id 가져오기
const user_id = localStorage.getItem('user_id');

// 닉네임 변경 (회원정보)
const saveNickname = async () => {
    const helperText1 = document.getElementById('helperText1');
    helperText1.innerText = "* helper text";
    // 텍스트 상자에서 nickname 가져옴
    const nickname = document.getElementById('nickname').value;
    console.log('클라에서 수정할 닉넴 : ', nickname);
    console.log('로컬에 저장된 user_id 수정', user_id);

    // 닉네임 입력 공란
    if (!nickname.trim()) {
        helperText1.innerText = "* 닉네임을 입력해주세요.";
        return;
    }
    // 닉네임 11자 이상 작성시
    if (nickname.length > 10) {
        helperText1.innerText = "* 닉네임은 최대 10자 까지 작성 가능합니다.";
        return
    }
    // 유효성 검사 성공시 try문 실행
    try {
        // 닉네임 중복검사 get 요청
        const checkNickname = await fetch(`http://localhost:3000/api/users/nicknamecheck/${nickname}`);
        if (checkNickname.ok){
            // 닉네임 변경 요청
            const response = await fetch(`http://localhost:3000/api/users/${user_id}`, {
                method : 'PUT',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include', // 쿠키 전달 허용
                body: JSON.stringify({ nickname })    
            });
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
            // helperText1.innerText = checkData.message;
        }
    } catch (error) {
        console.error('닉넹미 수정 오류:', error);
    }
}

// 페이지 로드 시 드롭다운 숨기기
document.addEventListener("DOMContentLoaded", () => {
    const dropdownMenu = document.getElementById("dropdownMenu");
    if (dropdownMenu) {
        dropdownMenu.style.display = "none"; // 페이지 로드 시 드롭다운 숨기기
    }
});

// 드롭다운
const toggleDropdown = () => {
    const dropdownMenu = document.getElementById("dropdownMenu");
    dropdownMenu.classList.toggle("hidden"); // 클래스를 토글
    if (dropdownMenu.style.display === "flex") {
    } else {
        dropdownMenu.style.display = "flex";
    }
}

// 페이지의 다른 부분을 클릭하면 드롭다운을 닫도록 이벤트 추가
window.onclick = function(event) {
    if (!event.target.matches('.image1')) {
        const dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.style.display === "block") {
                openDropdown.style.display = "none";
            }
        }
    }
}

// 페이지 로딩시 회원정보 가져오기 (post_id 있으면)
if (user_id) {
    // users 정보 가져오기
    async function loadUserData() {
        console.log('로컬에 저장된 user_id', user_id);
        try {
            const response = await fetch(`http://localhost:3000/api/users/${user_id}`);
            if (!response.ok){
                throw new Error('사용자 정보 불러오기 실패');
            }

            const userData = await response.json();
            document.getElementById('email').innerText = userData.email;
            document.getElementById('nickname').value = userData.nickname;
        } catch(error) {
            console.error('사용자 정보 로드 오류 : ', error);
        }
    }
    loadUserData();
} else {
    console.error('user_id가 없습니다. user_id : ', user_id);
}

// 회원 탈퇴
const deleteAccount = async () => {
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
const confirmDelete = async () => {
    closeModal(); // 모달 닫기
    try {
        const response = await fetch(`http://localhost:3000/api/users/${user_id}`, {
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

// localStorage 에서 user_id 가져와서 프로필 이미지 가져오기
const loadloginProfileImage = async () => {
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
            const profile_img = document.getElementById("profile_imghead");
            const profile_img1 = document.getElementById("profile_img");
            profile_img.src = `http://localhost:3000${user.profile_img}`
            profile_img1.src = `http://localhost:3000${user.profile_img}`
        } catch(err) {
            console.error('상단 유저 프로필 이미지 오류', err);
        }
    } else {
        console.log('로그인 사용자정보 없음');
    }
}

loadloginProfileImage();