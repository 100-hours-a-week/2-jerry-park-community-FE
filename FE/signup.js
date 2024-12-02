document.getElementById("signupBtn").onclick = function(event) {
    event.preventDefault();

    // 입력한 값 가져오기
    const email = document.getElementById("email").value;
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const password = document.getElementById("pw").value;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    const confirmPassword = document.getElementById("pwck").value;
    const nickname = document.getElementById("nickname").value;
    const profile_img = document.getElementById("profile_img").files[0];

    // helpertext 가져오기
    const emailHelper = document.getElementById('helperText1');
    const pwHelper = document.getElementById('helperText2');
    const pwckHelper = document.getElementById('helperText3');
    const nicknameHelper = document.getElementById('helperText4');
    const profileImgHelper = document.getElementById('helperText5');

    // Helper Text 초기화
    emailHelper.innerText = "* helper text";
    pwHelper.innerText = "* helper text";
    pwckHelper.innerText = "* helper text";
    nicknameHelper.innerText = "* helper text";
    profileImgHelper.innerText = "* helper text";

    // 유효성 검사
    if (!email) {
        emailHelper.innerText = "* 이메일을 입력해주세요.";
        return false;
    } else if (email.length < 5 || !emailPattern.test(email)) {
        emailHelper.innerText = "* 올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)";
        return false;
    }

    if (!password) {
        pwHelper.innerText = "* 비밀번호를 입력해주세요.";
        return false;
    } else if (!passwordPattern.test(password)) {
        pwHelper.innerText = "* 비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
        return false;
    }

    if (!confirmPassword) {
        pwckHelper.innerText = "* 비밀번호를 한번 더 입력해주세요.";
        return false;
    } else if (password !== confirmPassword) {
        pwckHelper.innerText = "* 비밀번호가 다릅니다.";
        return false;
    }

    if (!nickname) {
        nicknameHelper.innerText = "* 닉네임을 입력해주세요.";
        return false;
    } else if (nickname.length > 10) {
        nicknameHelper.innerText = "* 닉네임은 최대 10자까지 작성 가능합니다.";
        return false;
    } else if (/\s/.test(nickname)) {
        nicknameHelper.innerText = "* 띄어쓰기를 없애주세요.";
        return false;
    }
    if (!profile_img) {
        profileImgHelper.innerText = "* 프로필 사진을 추가해주세요.";
        return false;
    }
    // 유효성 검사 성공 시
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('nickname', nickname);
    if (profile_img) {
        formData.append('profile_img', profile_img);
    }
    sendSignupRequest(formData); // POST 요청 함수 호출

};  

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


