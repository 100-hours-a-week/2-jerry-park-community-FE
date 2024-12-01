function thirdFunction() {
    console.log('[세 번째 함수] 내부 실행 중');
    // 콜스택: firstFunction, secondFunction, thirdFunction
    return console.log('[세 번째 함수] 종료');
    // 콜스택: firstFunction, secondFunction
  }
  
  function secondFunction() {
    console.log('[두 번째 함수] 내부 실행 중');
    // 콜스택: firstFunction, secondFunction
    thirdFunction();
    // 콜스택: firstFunction
    console.log('[두 번째 함수] 세번째 함수 실행 완료 직후');
    return console.log('[두 번째 함수] 종료');
  }
  
  function firstFunction() {
    console.log('[첫 번째 함수] 내부 실행 중');
    // 콜스택: firstFunction
    secondFunction();
    // 콜스택: (empty)
    console.log('[첫 번째 함수] 두 번째 함수 실행 완료 직후');
    return console.log('[첫 번째 함수] 종료');
  }
  
  firstFunction();