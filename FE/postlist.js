let offset = 0; // 현재 데이터의 시작점
const limit = 6; // 한 번에 불러올 데이터 개수
let isLoading = false; // 중복 로딩 방지
let hasMoreData = true; // 서버에서 추가 데이터 있는지

// 페이지 로딩시 게시물리스트 가져오기
const loadPosts = async () => {
    try {
        if (isLoading) return; // 로딩 중이면 중단
        isLoading = true;

        // 서버에서 데이터 가져와 get 요청 실행 (게시글 api 주소)
        const response = await fetch(`${BE_URL}/api/posts?offset=${offset}&limit=${limit}`, {
            method : 'GET',
            credentials: 'include',
        }); 
        // 응답 비정상시 에러 출력
        if (!response.ok) {
            throw new Error(`게시글 읽는 중 에러 발생 : ${response.status}`);
        }
        // 서버 변환 데이터 JSON 으로 변환
        const data = await response.json();
        const posts = data.data

        // HTML에서 게시글 목록 표시할 컨테이너 선택
        const postList = document.getElementById("postList");

        // forEach는 배열의 각 요소에 대해 한 번 씩 콜백함수 실행
        posts.forEach(post => {   
            // 각 게시글 감싸는 div 요소 생성
            const postbox = document.createElement("div");
            // 생선한 div 요소에 클래스 이름 지정(css 적용 위해) 
            postbox.className = "postbox";
            // 클릭시 해당 게시글 상세 페이지로 이동
            postbox.onclick = () => goToPostDetail(post.post_id);

            // 제목 추가 - textContent 사용
            const titleElement = document.createElement("h1");
            titleElement.textContent = post.title;

            // 좋아요/댓글수/조회수와 작성일 등 나머지 내용은 innerHTML로 추가
            const likeElement = document.createElement("div");
            likeElement.className = "like";
            likeElement.innerHTML = `
                <div class="su1"> 
                    <p>좋아요 ${formatNumber(post.likes)}</p>
                    <p>댓글수 ${formatNumber(post.comment_count)}</p>
                    <p>조회수 ${formatNumber(post.views)}</p>
                </div>
                <p>${formatDate(post.created_time)}</p>
            `;

            // 작성자 및 프로필 이미지 추가
            const authorElement = document.createElement("div");
            authorElement.className = "author";
            authorElement.innerHTML = `
                <img class="image" src="${BE_URL}${post.profile_img}" > <!-- 프로필 이미지 -->
                <p>작성자: ${post.nickname}</p>
            `;

            // 게시글 내용을 HTML로 작성
        //     postbox.innerHTML = `
        //     <h1>${post.title}</h1> <!-- 게시글 제목 -->
        //     <div class="like">
        //         <div class = "su1"> 
        //         <p>좋아요 ${formatNumber(post.likes)}</p> <!-- 좋아요 수 -->
        //         <p>댓글수 ${formatNumber(post.comment_count)}</p> <!-- 댓글수 -->
        //         <p>조회수 ${formatNumber(post.views)}</p> <!-- 조회수 -->
        //         </div>
        //         <p>${formatDate(post.created_time)}</p> <!-- 작성일 -->
        //     </div>
        //     <hr class ="posthr">
        //     <div class="author">
        //         <img class="image" src="${BE_URL}${post.profile_img}" > <!-- 프로필 이미지 -->
        //         <p>작성자: ${post.nickname}</p> <!-- 작성자 ID -->
        //     </div>
        // `;
            // 생성한 요소들을 postbox에 추가
            postbox.appendChild(titleElement);
            postbox.appendChild(likeElement);
            postbox.appendChild(authorElement);

            // postbox를 postList에 추가
            postList.appendChild(postbox);
            // 생성한 게시글 요소를 HTML 페이지의 'postList' 영역에 추가
            postList.appendChild(postbox);
        });

        // console.log('offset', offset);
        offset += limit; // offset 증가
        isLoading = false;
    } catch(error) {
        console.error("게시글 데이터 불러오는 데 실패했습니다 : ", error);
        isLoading = false;
    }
}

// 스크롤 이벤트 핸들러
const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    // 스크롤이 끝에 도달하면 데이터를 추가로 로드
    if (scrollTop + clientHeight >= scrollHeight - 100) {
        loadPosts();
    }
}
const PostPage = () => {
    window.location.href = 'postupload.html';     /*게시물작성페이지로이동*/
}

const goToPostDetail = (post_id) => {
    window.location.href = `post_detail.html?post_id=${post_id}`;
}

// 게시글의 좋아요, 댓글, 조회수를 1000 이상일 때 '1k', 10000 이상일 때 '10k', 100000 이상일 때 '100k'로 표시하는 함수
const formatNumber = (num) => {
    if (num >= 100000) {
        return Math.floor(num / 1000) + "k";  // 100k 이상
    } else if (num >= 10000) {
        return Math.floor(num / 1000) + "k";  // 10k 이상
    } else if (num >= 1000) {
        return Math.floor(num / 1000) + "k";  // 1k 이상
    }
    return num;  // 1000 미만은 그대로 표시
}

// 날짜 포맷 함수
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};


// 세션에서 user_id 가져와서 프로필 이미지 가져오기 (상단)
const loadloginProfileImage = async () => {
    try {
        const response = await fetch(`${BE_URL}/api/users/session`, {
            method: 'GET',
            credentials: 'include',
        });

        // console.log('세션받아오기 response',response);
        if(!response.ok) {
            throw new Error('상단 유저프로필 이미지 불러오는 중 오류');
        }

        // 응답을 user로
        const user = await response.json();
        console.log('json 변환한 user :',user);
        console.log('user.profile_img:',user.profile_img);

        // 넣을 곳
        const profile_img = document.getElementById("profile_img");
        profile_img.src = `${BE_URL}${user.profile_img}`;
    
    } catch(err) {
        console.error('상단 유저 프로필 이미지 오류', err);
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
    const profileImg = document.getElementById("profile_img");

    if (!dropdownMenu.contains(event.target) && event.target !== profileImg) {
        dropdownMenu.classList.remove("show");
    }
});

// 프로필 이미지를 클릭하면 드롭다운 메뉴 표시
document.getElementById("profile_img").addEventListener("click", toggleDropdown);

// 페이지 로드 시 게시글 데이터를 불러옵니다
window.onload = function() {
    loadPosts();
    loadloginProfileImage();
    window.addEventListener("scroll", handleScroll); // 스크롤 이벤트 추가
};