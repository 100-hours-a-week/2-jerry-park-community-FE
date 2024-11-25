function nextPage(){
    const newPassword = document.querySelector('.passwordInputBox').value;
    const confirmPassword = document.querySelector('.passwordInputBox1').value;

    // localStorage에서 user_id 가져오기
    const user_id = localStorage.getItem('user_id');

    // 비밀번호 확인 일치 (유효성)
    if (newPassword !== confirmPassword) {
        alert('비밀번호 일치 X');
        return;
    }

    // 비밀번호 비웠을시
    if (!newPassword || !confirmPassword){
        alert('비밀번호를 입력해주세요.');
        return;
    }
    
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
            alert(data.message);  // 메시지 출력
            window.location.href = "accountEdit.html";  // 수정 완료 후 페이지 이동
        } else {
            alert('비밀번호 수정에 실패했습니다.');
        }
    })
    .catch(err => {
        console.error('비밀번호 수정 중 오류 발생 : ', err);
        alert('서버 오류가 발생했습니다.');
    });
}