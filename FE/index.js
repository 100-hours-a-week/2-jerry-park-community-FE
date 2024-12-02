const submitForm = () => {
    var email = document.getElementById("email").value;
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    var password = document.getElementById("password").value;
    var passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    
    var emailHelper = document.getElementById('helperText1');
    var passwordHelper = document.getElementById('helperText2');

    emailHelper.innerText = "* helper text";
    passwordHelper.innerText = "* helper text";

    // 이메일 유효성 검사
    if(!email){
        emailHelper.innerText = "* 이메일을 입력해주세요.";
        return false;
    }else if(email.length<5){
        emailHelper.innerText = ("* 이메일이 너무 짧습니다.");
        return false;
    }else if(!emailPattern.test(email)){ //test() 정규표현식 메서드 매개변수 검사
        emailHelper.innerText = ("* 올바른 이메일 주소 형식을 입력해주세요.");
        return false;
    } 
    
    // 비밀번호 유효성 검사
    if (!password) {
        passwordHelper.innerText = ("* 비밀번호를 입력해주세요");
        return false;
    } else if(!passwordPattern.test(password)){
        passwordHelper.innerText = ("* 비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.");
        return false;
    } 
    fetch('http://localhost:3000/api/users/login',{
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
            // 성공시, user_id 를 localstorage에 저장
            localStorage.setItem('user_id', data.user_id);
            // 로그인 성공 시, postlist.html으로 이동
            window.location.href = "postlist.html";
        } else {
            // 실패 시, 서버에서 받은 메시지를 helper text로 표시
            passwordHelper.innerText = data.message;
        }
    })
    .catch((err) => {
        console.error('로그인 요청 중 오류 발생: '.err);
        alert('로그인 오류 발생');
    });

    // 이벤트 기본 동작 방지 ( 페이지 새로고침 방지 )
    return false;
}

