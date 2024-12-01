function makeBankBook() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('통장 만들었습니다.');
      }, 2000);
    });
  }
  
  function makeCard() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('카드 만들었습니다.');
      }, 3000);
    });
  }
  
  function recommendSong() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('당근송이요.');
      }, 1000);
    });
  }
  
  async function customer1() {
    /**
     * 고객1 : (은행원1에게) 통장 만들어주세요. (동시)
     * 고객1 : (은행원2에게) 카드 만들어주세요. (동시)
     * 고객1 : (은행원3에게) 노래 추천해주세요. (동시)
     * 고객1 : 유튜브 보고 있어야겠다.
     * 은행원3 : 당근송이요.
     * 은행원1 : 통장 만들었습니다.
     * 은행원2 : 카드 만들었습니다.
     */
    const bankBook = makeBankBook();
    const card = makeCard();
    const song = recommendSong();
    console.log('유튜브 보고 있어야겠다.');
  
    console.log(await song);
    console.log(await bankBook);
    console.log(await card);
  }
  
  const afterTaskForCustomer = customer1();
  afterTaskForCustomer
    .then(() => {
      console.log('은행원 1: 뭐? 대포통장이었어?');
    }).then(() => {
      console.log('은행원 2: 뭐? 신분증이 가짜야??');
  }).then(() => {
      console.log('은행원 3: 뭐? 당근송이 싫다고 했어???');
  });
  