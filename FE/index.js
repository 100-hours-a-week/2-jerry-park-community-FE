const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailHelper = document.getElementById('helperText1');
const passwordHelper = document.getElementById('helperText2');
const loginButton = document.getElementById('loginbutton1');

const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d!@#$%^&*(),.?":{}|<>~`'\\\-_/+=;]{8,20}$/;

// 유효성 검사 함수
const validateInputs = () => {
    let isEmailValid = false;
    let isPasswordValid = false;

    const email = emailInput.value;
    const password = passwordInput.value;

    // 이메일 유효성 검사
    if(!email){
        emailHelper.innerText = "* 이메일을 입력해주세요.";
        emailHelper.classList.add("visible"); // 헬퍼 텍스트 표시
    }else if(email.length<5){
        emailHelper.innerText = ("* 이메일이 너무 짧습니다.");
        emailHelper.classList.add("visible"); // 헬퍼 텍스트 표시
    }else if(!emailPattern.test(email)){ //test() 정규표현식 메서드 매개변수 검사
        emailHelper.innerText = ("* 올바른 이메일 주소 형식을 입력해주세요.");
        emailHelper.classList.add("visible"); // 헬퍼 텍스트 표시
    } else {
        emailHelper.innerText = ""; // 메시지 초기화
        emailHelper.classList.remove("visible"); // 헬퍼 텍스트 숨김
        isEmailValid = true;
    }
    // 비밀번호 유효성 검사
    if (!password) {
        passwordHelper.innerText = ("* 비밀번호를 입력해주세요");
        passwordHelper.classList.add("visible"); // 헬퍼 텍스트 표시
    } else if(!passwordPattern.test(password)){
        passwordHelper.innerText = ("* 비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.");
        passwordHelper.classList.add("visible");
    } else {
        passwordHelper.innerText = "";
        passwordHelper.classList.remove("visible"); // 헬퍼 텍스트 숨김
        isPasswordValid = true;
    }
    // 버튼 활성화/비활성화
    const isValid = isEmailValid && isPasswordValid;
    loginButton.disabled = !isValid;

    if (isValid) {
        loginButton.classList.add('active'); // 유효한 상태일 때 active 클래스 추가
    } else {
        loginButton.classList.remove('active'); // 유효하지 않은 상태일 때 active 클래스 제거
    }
}

// 실시간 이벤트 등록
emailInput.addEventListener("input", validateInputs);
passwordInput.addEventListener("input", validateInputs);

document.getElementById("loginForm").addEventListener("submit",(event) => {
    event.preventDefault(); // 기본 동작 방지

    const email = emailInput.value;
    const password = passwordInput.value;

    fetch(`${BE_URL}/api/users/login`,{
        method:'POST',
        headers: {
            'Content-Type':'application/json',
        },
        body : JSON.stringify({email,password}),
        credentials: 'include' // 쿠키 전달 허용
    })
        .then(response => response.json())
        .then(data => {
        if (data.message === '로그인 성공') {
            // 로그인 성공 시, postlist.html으로 이동
            window.location.href = "postlist.html";
        } else {
            // 실패 시, 서버에서 받은 메시지를 helper text로 표시
            passwordHelper.innerText = data.message;
            passwordHelper.style.display = "block"; // 헬퍼 텍스트 표시
        }
    })
    .catch((err) => {
        console.error('로그인 요청 중 오류 발생: ',err);
        alert('로그인 오류 발생');
    });

    // // 이벤트 기본 동작 방지 ( 페이지 새로고침 방지 )
    // return false;
})
    


