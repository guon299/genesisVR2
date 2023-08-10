(function($){  // 매개변수(파라미터 Parameter)
    // 즉시표현함수는 제이쿼리 달러 사인기호의 
    // 외부 플러그인(라이브러리)와 충돌을 피하기 위해 사용하는 함수식

    // 객체(Object 오브젝트) 선언 {} : 섹션별 변수 중복을 피할 수 있다.
    // const obj = new Object(); // 객체 생성자 방식
    //       obj = {}  

    const obj = {  // 객체 리터럴 방식 권장
        init(){  // 대표 메서드
            this.header();
            this.section1();
            this.section2();
            this.section3();
        },
        header(){},
        section1(){
            let cnt=0;
            let setId=0;
            const slideContainer = $('#section1 .slide-container')
            const slideWrap = $('#section1 .slide-wrap');
            const slide = $('#section1 .slide');
            const pageBtn = $('#section1 .page-btn');
            const stopBtn = $('#section1 .stop-btn');
            const playBtn = $('#section1 .play-btn');
            let n = ($('#section1 .slide').length)-1;
            const slideView = $('#section1 .slide-view');
            const slideImg = $('#section1 .slide img');
            let mouseDown = null;
            let mouseUp = null;
            let dragStart = null;
            let dragEnd = null;
            let mDown = false;
            let winW = $(window).innerWidth();
            let sizeX = 10;
            console.log(n);

            // 반응형 이미지 슬라이드 함수
            const imgRate = 1.345244351;
            const transRate = 0.1265625;

            slideImg.css({width: imgRate * winW, transform: `translateX(${-(imgRate * winW)*transRate }px)`});

            // 즉각 반응형 함수
            $(window).resize(function(){
                winW = $(window).innerWidth();
                sizeX = 10;
                slideImg.css({width: imgRate * winW, transform: `translateX(${-(imgRate * winW)*transRate }px)`});
            })

            // 터치 스와이프
            // 데스크탑 : 마우스 터치 스와이프 이벤트
            // 드래그 앤 드롭
            slideContainer.on({
                mousedown(e){
                    winW = $(window).innerWidth();
                    mouseDown = e.clientX;
                    dragStart = e.clientX - (slideWrap.offset().left + winW);
                    mDown = true;
                    slideView.css({cursor : 'grabbing'});
                },
                mouseup(e){
                    mouseUp = e.clientX;
                    if(mouseDown-mouseUp > sizeX){
                        clearInterval(setId);
                        if(!slideWrap.is(':animated')){
                            nextCount();
                        }

                    }
                    if(mouseDown-mouseUp < -sizeX){
                        clearInterval(setId);
                        if(!slideWrap.is(':animated')){
                            prevCount();
                        }

                    }
                    mDown = false;
                    slideView.css({cursor : 'grab'})
                }
            });

            $(document).on({
                mouseup(e){
                    if(!mDown) return;
                    mouseUp = e.clientX;
                    if(mouseDown-mouseUp > sizeX){
                        clearInterval(setId);
                        if(!slideWrap.is(':animated')){
                            nextCount();
                        }

                    }
                    if(mouseDown-mouseUp < -sizeX){
                        clearInterval(setId);
                        if(!slideWrap.is(':animated')){
                            prevCount();
                        }

                    }
                    mDown = false;
                    slideView.css({cursor : 'grab'})
                }
            });

            // 테블릿 & 모바일 : 손가락(핑거링) 터치 스와이프 이벤트
            // 드래그 앤 드롭
            slideContainer.on({
                touchstart(e){
                    winW = $(window).innerWidth();
                    mouseDown = e.originalEvent.changedTouches[0].clientX;
                    dragStart = e.originalEvent.changedTouches[0].clientX - (slideWrap.offset().left + winW);
                    mDown = true;
                    slideView.css({cursor : 'grabbing'});
                    console.log(slideWrap.offset().left + winW);
                },
                touchend(e){
                    mouseUp = e.originalEvent.changedTouches[0].clientX;
                    if(mouseDown-mouseUp > sizeX){
                        clearInterval(setId);
                        if(!slideWrap.is(':animated')){
                            nextCount();
                        }

                    }
                    if(mouseDown-mouseUp < -sizeX){
                        clearInterval(setId);
                        if(!slideWrap.is(':animated')){
                            prevCount();
                        }

                    }
                    mDown = false;
                    slideView.css({cursor : 'grab'})
                }
            });

            // 손가락 터치 이벤트
            // 테블릿과 모바일에서만 동작함
            // originalEvent: TouchEvent, type: 'touchstart'
            // 테블릿 모바일 환경에서는 오리지날 터치 이벤트에서 체인지터치의 배열번호를 확인 하고 클라인턴트 X 값을 확인 할 수 있다
        /*  slideContainer.on({
                touchstart(e){
                    console.log(e.clientX);
                    console.log(e.originalEvent.changedTouches[0].clientX);
                },
                touchend(e){
                    console.log(e.originalEvent.changedTouches[0].clientX);
                },
                touchmove(e){
                    console.log(e.originalEvent.changedTouches[0].clientX);
                }
            }) */

            // 1. 메인슬라이드함수
            // 페이드인 / 아웃 효과 애니메이션 슬라이드 구현
            // 모든 슬라이드를 position:absolute; 로 해준다.
            // 맨 위 그리고 아래 포개진 슬라이드 앞뒤 순서를 정한다.
            // z-index: 3 > 2 > 1를 설정한다
            // 페이드 아웃 효과는 opacity:0;를 사용한다. 시간은 0.6 또는 1s 
            // 계속 10개의 슬라이드를 반복적으로 회전하여 순서대로 보여진다.
            mainNextSlide(); // 로딩시 실행
            function mainNextSlide(){ // 앞으로 가는 슬라이드
                slide.css({zIndex:1, opacity:1});
                slide.eq(cnt).css({zIndex:2});
                slide.eq(cnt===0?n:cnt-1).css({zIndex:3}).stop().animate({opacity:0},1000);
                // z-index 3번이 사라지고 2번그림이 올라온다
                console.log(cnt);
                pageEvent();
            }
            function mainPrevSlide(){ // 뒤로가는 슬라이드
                slide.css({zIndex:1, opacity:1});
                slide.eq(cnt===n? 0 : cnt+1).css({zIndex:2});
                slide.eq(cnt).css({zIndex:3}).stop().animate({opacity:0},0).animate({opacity:1},1000);
                // z-index 2번 그림위로 3번 그림이 올라온다
                console.log(cnt);
                pageEvent();
            }

            // 2.1 다음카운트함수
            function nextCount(){
                cnt++;
                if(cnt>n)cnt=0;
                mainNextSlide();
            }
            // 2.2 이전카운트함수
            function prevCount(){
                cnt--;
                if(cnt<0)cnt=n;
                mainPrevSlide();
            }

            // 3. 자동타이머함수(7초 후 7초간격 계속)
            function autoTimer(){
                setId = setInterval(nextCount, 2000);
            }
            autoTimer();

            // 4. 페이지 이벤트 함수
            function pageEvent(){
                pageBtn.removeClass('on');
                pageBtn.eq( cnt>n ? 0 : cnt).addClass('on');
            }

            // 5. 페이지버튼클릭
            pageBtn.each(function(idx){
                $(this).on({
                    click(e){
                        e.preventDefault();
                        cnt=idx;
                        mainNextSlide();
                        mainPrevSlide();
                        clearInterval(setId); // 클릭시 일시중지
                    }
                });
            });

            // 6-1. 스톱 버튼 클릭이벤트
            stopBtn.on({
                click(e){
                    e.preventDefault();
                    stopBtn.addClass('on');
                    playBtn.addClass('on');
                    clearInterval(setId); // 클릭시 일시중지
                }
            })

            // 6-2. 플레이 버튼 클릭이벤트
            playBtn.on({
                click(e){
                    e.preventDefault();
                    stopBtn.removeClass('on');
                    playBtn.removeClass('on');
                    autoTimer(); // 클릭시 재실행 7초후실행
                }
            })

            
        },
        section2(){
            let cnt = 0;
            const slideWrap = $('#section2 .slide-wrap');
            const slide = $('#section2 .slide-wrap .slide');
            const pageBtn = $('#section2 .page-btn');
            const selectBtn = $('#section2 .select-btn');
            const subMenu = $('#section2 .sub-menu');
            const materialIcons = $('#section2 .select-btn .material-icons');
            const slideContainer = $('#section2 .slide-container');
            const slideView = $('#section2 .slide-view');
            const container = $('#section2 .contrainer');
            const topH3 = $('#section2 .slide-wrap .slide h3');
            const topH4 = $('#section2 .slide-wrap .slide h4');
            const heightRate = 0.884545453;
            let n = slide.length;

            let touchStart = null;
            let touchEnd = null;
            let dragStart = null;
            let dragEnd = null;
            let mDown = false;
            let sizeX = 200;
            let offsetL = slideWrap.offset().left;
            let winW = $(window).innerWidth();
            let slideW;

            resizeFn(); // 로딩시
            // 함수는 명령의 묶음
            function resizeFn(){
                winW = $(window).innerWidth(); // 창크기 계속 값을 보여준다
                // 1. 창너비가(window) 1642px 이하에서 패딩 좌측값 0으로 설정
                if(winW<=1642){
                    slideW = (container.innerWidth()-0+20+20)/3;
                    if(winW>1280){// 1280 초과에서는 슬라이드 3개
                        slideW = (container.innerWidth()-0+20+20)/3;
                        // 페이지 버튼 갯수 제어 : 8개인 경우 / 8개인 경우
                        n = slide.length-2;
                        pageBtn.css({display:'none'});
                        for(let i = 0; i < n; i++ ){
                            pageBtn.eq(i).css({display:'block'});
                        }
                        if(cnt>=7){cnt = 7}
                    }
                    else{ // 1280 이하에서는 슬라이드 1개만 노출이 된다
                        slideW = (container.innerWidth()-0+20+20)/1;
                        n = slide.length;
                        pageBtn.css({display:'block'})
                    }
                }
                else{// 이하 winW < 1642
                    slideW = (container.innerWidth()-193+20+20)/3;
                    n = slide.length-2;
                    pageBtn.css({display:'none'});
                    for(let i = 0; i < n; i++ ){
                        pageBtn.eq(i).css({display:'block'});
                    }
                }
                
                slideWrap.css({width: slideW*10});
                slide.css({width: slideW, height: slideW * heightRate});
                topH3.css({fontSize: slideW*0.08});
                topH4.css({fontSize: slideW*0.03});

                mainSlide(); // 슬라이드 너비 전달하기 위해서 호출
            }
            // 가로세로 크기가 1픽셀만 이라도 변경되면 동작 구동이 된다
            // 크기가 변경이 안되면 영원히 그대로 구동이 없다
            $(window).resize(function(){
                resizeFn();
                
            })

            // 7. 터치 스와이프
            // 데스트탑
            slideContainer.on({
                mousedown(e){
                    touchStart = e.clientX;
                    dragStart = e.clientX - (slideWrap.offset().left-offsetL);
                    mDown = true;
                    slideView.css({cursor : 'grabbing'});
                },
                mouseup(e){
                    touchEnd = e.clientX;
                    if(touchStart-touchEnd > sizeX){
                        nextCount ();
                    }
                    if(touchStart-touchEnd < -sizeX){
                        prevCount ();
                    }
                    if((touchStart-touchEnd) >= -sizeX && (touchStart-touchEnd) <= sizeX){
                        mainSlide();
                    }
                    mDown = false;
                    slideView.css({cursor : 'grab'});
                },
                mousemove(e){
                    if(!mDown) return;

                    dragEnd = e.clientX;

                        slideWrap.css({left : dragEnd - dragStart});

                }
            });
            $(document).on({
                mouseup(e){
                    if(!mDown) return; // 마우스 다운상태에서 업이 실행이 안된 상태에서만 실행하라
                    touchEnd = e.clientX;
                    if(touchStart-touchEnd > sizeX){
                        nextCount ();
                    }
                    if(touchStart-touchEnd < -sizeX){
                        prevCount ();
                    }
                    if((touchStart-touchEnd) >= -sizeX && (touchStart-touchEnd) <= sizeX){
                        mainSlide();
                    }
                    mDown = false;
                    slideView.css({cursor : 'grab'});
                }
            })
            //터치스와이프 
            // 테블릿 모바일
            slideContainer.on({
                touchstart(e){
                    touchStart = e.originalEvent.changedTouches[0].clientX;
                    dragStart = e.originalEvent.changedTouches[0].clientX - (slideWrap.offset().left-offsetL);
                    mDown = true;
                    slideView.css({cursor : 'grabbing'});
                },
                touchend(e){
                    touchEnd = e.originalEvent.changedTouches[0].clientX;
                    if(touchStart-touchEnd > sizeX){
                        nextCount ();
                    }
                    if(touchStart-touchEnd < -sizeX){
                        prevCount ();
                    }
                    if((touchStart-touchEnd) >= -sizeX && (touchStart-touchEnd) <= sizeX){
                        mainSlide();
                    }
                    mDown = false;
                    slideView.css({cursor : 'grab'});
                },
                touchmove(e){
                    if(!mDown) return;

                    dragEnd = e.originalEvent.changedTouches[0].clientX;

                        slideWrap.css({left : dragEnd - dragStart});

                }
            });

            mainSlide();
            // 1. 메인 슬라이드 함수
            function mainSlide(){
                slideWrap.stop().animate({left: -slideW * cnt},'easeInOutExpo');
                pageEvent();
            }

            // 2. 페이지 버튼 클릭이벤트
            pageBtn.each(function(idx){
                $(this).on({
                    click(e){
                        e.preventDefault();
                        cnt = idx;
                        mainSlide();
                        pageEvent();
                    }
                })
            })
            
            // 3. 페이지 이벤트 함수
            function pageEvent(){
                pageBtn.removeClass('on');
                pageBtn.eq(cnt).addClass('on');
            }

            // 4. 다음 카운트 함수
            function nextCount (){
                cnt++;
                if(cnt>n-1){cnt=n-1}
                mainSlide();
            }

            // 5. 이전 카운트 함수
            function prevCount (){
                cnt--;
                if(cnt<0){cnt=0}
                mainSlide();
            }
            // 6. 서브버튼 클릭이벤트
            selectBtn.on({
                click(e){
                    e.preventDefault();
                    subMenu.toggleClass('on');
                    materialIcons.toggleClass('on');
                }
            })

        },
        section3(){},
    }
    obj.init();

})(jQuery); // 전달인수(아규먼트 Argument)
