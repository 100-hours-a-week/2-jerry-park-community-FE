// 세션에서 user_id 가져오기
const getUserid = async () => {
    try {
        const response = await fetch(`http://localhost:3000/api/users/session`, {
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

const nextPage = async () => {
    const newPassword = document.querySelector('.passwordInputBox').value;
    const confirmPassword = document.querySelector('.passwordInputBox1').value;

    // 비밀번호 비웠을시
    if (!newPassword){
        helperText1.innerText = "* 비밀번호를 입력해주세요";
        return;
    }
    if (!confirmPassword) {
        helperText2.innerText = "* 비밀번호를 한번 더 입력해주세요";
        return;
    }
    // 비밀번호 확인 일치 (유효성)
    if (newPassword !== confirmPassword) {
        helperText1.innerText = "* 비밀번호 확인과 다릅니다.";
        return;
    }
    
    // 비밀번호 유효성 검사
    const passwordok = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    if (!passwordok.test(newPassword)) {
        helperText1.innerText = "* 비밀번호는 8자 이상, 20자 이하, 대문자, 소문자, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다.";
        return;
    }

    // 세션에서 user_id 가져오기
    const user_id = await getUserid();

    fetch(`http://localhost:3000/api/users/${user_id}/password`, {
        method : 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            newPassword: newPassword,
            confirmPassword: confirmPassword, 
        }),
    })
    .then(response => response.json())
    .then(data=> {
        if (data.message) {  // 응답의 message를 확인
            // 수정 성공시 토스트 메시지
            const toast = document.getElementById("toast");
            // 일정 시간 후 토스트 메시지 숨기기
            if (toast) {
                toast.classList.add("show");
                setTimeout(() => {
                    toast.classList.remove("show");}, 2000); // 2초 후 사라짐
            }
        } else {
            alert('비밀번호 수정에 실패했습니다.');
        }
    })
    .catch(err => {
        console.error('비밀번호 수정 중 오류 발생 : ', err);
        alert('서버 오류가 발생했습니다.');
    });
}

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

loadloginProfileImage();