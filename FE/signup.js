document.getElementById("signupBtn").disabled = true; // 일단 버튼 비활성화

document.getElementById("email").addEventListener("input", () => {
    validateEmail(); // 이메일 유효성 검사 함수 호출
    validateProfileImage(); // 프로필 이미지 유효성 검사 함수 호출
    toggleSignupButton(); // 버튼 활성화/비활성화 함수 호출
});
document.getElementById("pw").addEventListener("input", () => {
    validatePassword(); // 비밀번호 유효성 검사 함수 호출
    validatePasswordConfirmation(); // 비밀번호 확인 유효성 검사 함수 호출
    validateProfileImage(); // 프로필 이미지 유효성 검사 함수 호출
    toggleSignupButton(); // 버튼 활성화/비활성화 함수 호출
});
document.getElementById("pwck").addEventListener("input", () => {
    validatePasswordConfirmation(); // 비밀번호 확인 유효성 검사 함수 호출
    validateProfileImage(); // 프로필 이미지 유효성 검사 함수 호출
    toggleSignupButton(); // 버튼 활성화/비활성화 함수 호출
});
document.getElementById("nickname").addEventListener("input", () => {
    validateNickname(); // 닉네임 유효성 검사 함수 호출
    validateProfileImage(); // 프로필 이미지 유효성 검사 함수 호출
    toggleSignupButton(); // 버튼 활성화/비활성화 함수 호출
});
document.getElementById("profile_img").addEventListener("change", () => {
    validateProfileImage(); // 프로필 이미지 유효성 검사 함수 호출
    toggleSignupButton(); // 버튼 활성화/비활성화 함수 호출
});

// 이메일 유효성
const validateEmail = () => {
    const email = document.getElementById("email").value; // 이메일 입력 값 가져오기
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const emailHelper = document.getElementById('helperText1'); // 이메일 헬퍼 텍스트 요소

    if (!email) {
        emailHelper.innerText = "* 이메일을 입력해주세요.";
        emailHelper.style.display = "block"; // Helper text 표시
    } else if (!emailPattern.test(email)) {
        emailHelper.innerText = "* 올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)";
        emailHelper.style.display = "block"; // Helper text 표시
    } else { // 유효할 시 helpertext 다시 숨기기
        emailHelper.style.display = "none";
    }
}

// 비밀번호 유효성
const validatePassword = () => {
    const password = document.getElementById("pw").value;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    const pwHelper = document.getElementById('helperText2');

    if (!password) {
        pwHelper.innerText = "* 비밀번호를 입력해주세요.";
        pwHelper.style.display = "block"; // Helper text 표시]
        return false;
    } else if (!passwordPattern.test(password)) {
        pwHelper.innerText = "* 비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
        pwHelper.style.display = "block"; // Helper text 표시
        return false;
    } else { // 유효할 시 helpertext 다시 숨기기
        pwHelper.style.display = "none";
        return true;
    }
}

// 비밀번호 확인 유효성
const validatePasswordConfirmation = () => {
    const password = document.getElementById("pw").value;
    const confirmPassword = document.getElementById("pwck").value;
    const pwckHelper = document.getElementById('helperText3');

    if (!confirmPassword) {
        pwckHelper.innerText = "* 비밀번호를 한번 더 입력해주세요.";
        pwckHelper.style.display = "block"; // Helper text 표시
        return false;
    } else if (password !== confirmPassword) {
        pwckHelper.innerText = "* 비밀번호가 다릅니다.";
        pwckHelper.style.display = "block"; // Helper text 표시
        return false;
    } else { // 유효할 시 helpertext 다시 숨기기
        pwckHelper.style.display = "none";
        return true;
    }
}

// 닉네임 유효성
const validateNickname = () => {
    const nickname = document.getElementById("nickname").value;
    const nicknameHelper = document.getElementById('helperText4');

    if (!nickname) {
        nicknameHelper.innerText = "* 닉네임을 입력해주세요.";
        nicknameHelper.style.display = "block"; // Helper text 표시
        return false;
    } else if (nickname.length > 10) {
        nicknameHelper.innerText = "* 닉네임은 최대 10자까지 작성 가능합니다.";
        nicknameHelper.style.display = "block"; // Helper text 표시
        return false;
    } else if (/\s/.test(nickname)) {
        nicknameHelper.innerText = "* 띄어쓰기를 없애주세요.";
        nicknameHelper.style.display = "block"; // Helper text 표시
        return false;
    } else { // 유효할 시 helpertext 다시 숨기기
        nicknameHelper.style.display = "none";
        return true;
    }
}

// 프로필 이미지 유효성
const validateProfileImage = () => {
    const profile_img = document.getElementById("profile_img").files[0];
    const profileImgHelper = document.getElementById('helperText5');

    if (!profile_img) {
        profileImgHelper.innerText = "* 프로필 사진을 추가해주세요.";
        profileImgHelper.style.display = "block"; // Helper text 표시
        return false;
    } else { // 유효할 시 helpertext 다시 숨기기
        profileImgHelper.style.display = "none";
        return true;
    }
}

// 회원가입 버튼 활성화/비활성화 함수
const toggleSignupButton = () => {
    const isEmailValid = document.getElementById("helperText1").style.display === "none";
    const isPasswordValid = document.getElementById("helperText2").style.display === "none";
    const isPasswordConfirmationValid = document.getElementById("helperText3").style.display === "none";
    const isNicknameValid = document.getElementById("helperText4").style.display === "none";
    const isProfileImageValid = document.getElementById("helperText5").style.display === "none";

    const signupBtn = document.getElementById("signupBtn");

    if (isEmailValid && isPasswordValid && isPasswordConfirmationValid && isNicknameValid && isProfileImageValid) {
        signupBtn.disabled = false;
        signupBtn.classList.add("active");
    } else {
        signupBtn.disabled = true;
        signupBtn.classList.remove("active");
    }
}

// 회원가입 버튼 클릭 시
document.getElementById("signupBtn").addEventListener("click", async (event) => {
    event.preventDefault();

    // 폼 데이터 생성
    const formData = new FormData();
    const email = document.getElementById("email").value;
    const password = document.getElementById("pw").value;
    const nickname = document.getElementById("nickname").value;
    const profile_img = document.getElementById("profile_img").files[0];

    formData.append('email', email);
    formData.append('password', password);
    formData.append('nickname', nickname);
    formData.append('profile_img', profile_img);
    
    await sendSignupRequest(formData); // POST 요청 함수 호출
})

// 회원가입 post 요청
const sendSignupRequest = async (formData) => {
    try {
        // fetch로 post 요청 
        const response = await fetch('http://localhost:3000/api/users/register', {
            method : 'POST',
            body : formData,
        });

        if (response.ok){
            const result = await response.json();
            alert(`회원가입 성공!`);
            window.location.href = "index.html"; // 성공 시 로그인 페이지로 이동
        } else {
            const error = await response.json();
            // 서버 응답에서 오류가 발생한 경우
            alert(`회원가입 실패: ${error.message}`);
        }
    } catch (err) {
        // 네트워크 오류 등 서버에 접근하지 못한 경우
        console.error('회원가입오류',err);
        alert('서버와의 통신 중 오류가 발생했습니다. 다시 시도해주세요.');
    }   
}

// 이미지 미리보기 함수
const previewImage = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader(); // 파일 리더 생성

    reader.onload = function(e) {
        // 파일이 로드되면 이미지 미리보기 업데이트
        document.getElementById('profile_image').src = e.target.result;
    };

    if (file) {
        reader.readAsDataURL(file);  // 파일을 URL로 읽기
    }
}


