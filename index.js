(function(){

	var sel = document.querySelector('.select'),
		createDivFlag = true;
		windowHeight = window.screen.availHeight,
		startYFlag = 0;

	var div,cur,province,city,county,ok,resut,oneNum,twoNum,threeNum,touchFlag,
		touchOn = true,
		touchStop = true,
		tochBegin = true;

	//判断是否能打开
	sel.addEventListener('touchend',function(){

		createDivFlag && createDiv();

	})

	//开始生成盒子
	function createDiv(){

		//判断避免重复生成
		if(!div){
			div = document.createElement('div'),
			cur = document.createElement('div'),
			ok = document.createElement('div'),
			resut = document.createElement('div'),
			province = document.createElement('div'),
			city = document.createElement('div'),
			county = document.createElement('div');

			div.className = 'win';
			cur.className = 'current';
			ok.className = 'ok';
			resut.className = 'resut';
			province.className = 'province';
			city.className = 'city';
			county.className = 'county';

			ok.innerHTML = '完成';
			resut.innerHTML = '取消';

			//赋值translate
			province.style.transform = 'translateY(80px)';
			city.style.transform = 'translateY(80px)';
			county.style.transform = 'translateY(80px)';
			//给三个盒子绑定滑动事件
			touchGo([province,city,county]);
			div.appendChild(cur);
			div.appendChild(ok);
			div.appendChild(resut);
			div.appendChild(province);
			div.appendChild(city);
			div.appendChild(county);
			document.body.appendChild(div);
		}


		//填充数据
		fillIn(province,city,county);

		
		setTimeout(function(){
			div.style.transform = 'translateY(-200px)';
		},0);

		//确认选择
		ok.addEventListener('touchend',function(){

			var one = province.querySelectorAll('span')[oneNum],
				two = city.querySelectorAll('span')[twoNum] || null,
				three = county.querySelectorAll('span')[threeNum] || null,
				selId,
				oneHtml,
				twoHtml,
				threeHtml;

			oneHtml = one.innerHTML || '';
			twoHtml = two ? two.innerHTML : '';
			threeHtml = three ? three.innerHTML : '';

			sel.innerHTML = oneHtml + twoHtml + threeHtml;


			oneNodeValue = one ? one.attributes['data-id'].nodeValue : '';
			twoNodeValue = two ? two.attributes['data-id'].nodeValue : '';
			threeNodeValue = three ? three.attributes['data-id'].nodeValue : '';
			selId = oneNodeValue + twoNodeValue + threeNodeValue + '';

			sel.setAttribute('data-id',selId);

			div.style.transform = 'translateY(0)';

			createDivFlag = true;

		})

		//取消选择
		resut.addEventListener('touchend',function(){

			div.style.transform = 'translateY(0)';

			createDivFlag = true;

		})

		createDivFlag = false;

	}



	//给三级菜单填充内容
	function fillIn(province,city,county){
		var proStart,cityStart;

		//先将内容清空，避免后面累加
		province.innerHTML = '';
		city.innerHTML = '';
		county.innerHTML = '';

		//初始化位置
		for(k in region.p['000000']){
			var span = document.createElement('span');
			span.setAttribute("data-id",k);
			span.innerHTML = region.p['000000'][k];
			province.appendChild(span);
		}

		proStart = province.querySelector('span').attributes['data-id'].nodeValue;

		cityBegin(proStart,city);

		cityStart = city.querySelector('span').attributes['data-id'].nodeValue;

		countyBegin(cityStart,county);

		//初始化时自动先获取一遍初始值
		for(var i = 0; i < arguments.length; i += 1){

			//判断第二次打开，是否需要渲染二三级
			if(arguments[i].querySelector('span')){

				selectCity(arguments[i]);

			}
		}
		
	}

	//二级内容
	function cityBegin(proStart,city){
		var flag = true;

		if(region.c[proStart]){

			for(n in region.c[proStart]){
				var span = document.createElement('span');
				span.setAttribute('data-id',n);
				span.innerHTML = region.c[proStart][n];
				city.appendChild(span);
			}

		}else{
			flag = false;
		}

		return flag;

	}


	//三级内容
	function countyBegin(cityStart,county){
		for(j in region.d[cityStart]){
			var span = document.createElement('span');
			span.setAttribute('data-id',j);
			span.innerHTML = region.d[cityStart][j];
			county.appendChild(span);
		}
	}


	//为三级菜单绑定拓展事件
	function touchGo(objArr){

		for(var i = 0; i < objArr.length; i += 1){

			actionSwiper(objArr[i]);

		}

		//为三级菜单绑定事件
		function actionSwiper(obj){

			var startPosition,movePosition,endPosition,deletaY,transY;
				
			//tochBegin,touchOn,touchStop;三个状态判断
			obj.addEventListener('touchstart',function(event){
				if(touchStop){
					touchStop = false;
					var touch = event.touches[0];
					startPosition = {
						x : touch.pageX,
						y : touch.pageY
					}
					transY = Number(translateXY(obj));
					objHeight = obj.offsetHeight;
					tochBegin = true;
				}

			})


			//80 为两个span的高度，初始化时，距离上方80px
			//200 为自定义select的高度。
			obj.addEventListener('touchmove',function(event){

				if(tochBegin){

					touchOn = true;

					var touch = event.touches[0];

					movePosition = {
						x : touch.pageX,
						y : touch.pageY
					};

					deletaY = movePosition.y - startPosition.y + transY;
					
					//向上划上限
					//deletaY = deletaY > -objHeight - 80 + 200 ? deletaY : -objHeight - 80 + 200;
					deletaY = deletaY > -objHeight + 120 ? deletaY : -objHeight + 120;

					//向下滑下限
					deletaY = deletaY > 80 ? 80 : deletaY;


					obj.style.transform = 'translateY('+ deletaY +'px)';

					//禁止浏览器默认黑色背景出现
					event.preventDefault();


				}

			})

			obj.addEventListener('touchend',function(){

				if(touchOn){

					touchStop = true;

					var touch = event.changedTouches[0];

					endPosition = {
						x : touch.pageX,
						y : touch.pageY
					};

					setTimeout(function(){
						objTouchEnd(obj);
					},100);

				}

			})

			//滑动结束后处理函数
			function objTouchEnd(obj){

				var objTranslateY = parseInt(Number(translateXY(obj))),
					objType = '',
					timer = null;

				if(endPosition.y - startPosition.y > 0){
					objType = 'down';
				}else{
					objType = 'up';
				}

				timer = setInterval(function(){


					if(objType == 'up'){
						if(Number(translateXY(obj)) % 40 != 0){
							objTranslateY -= 1;
						}
					}

					if(objType == 'down'){
						if(Number(translateXY(obj)) % 40 != 0){
							objTranslateY += 1;
						}
					}

					obj.style.transform = 'translateY('+ objTranslateY +'px)';

					if(Number(translateXY(obj)) % 40 == 0){
 
						clearInterval(timer);
						timer = null;

						tochBegin = false;

						//确定选择
						selectCity(obj);

					}


				},20);



			}

		}

	}


	//获取设置选项
	function selectCity(obj){
		//80+80=160   Y为80 的时候是第一个
		var objTranslateY = Number(translateXY(obj)),
			one,
			oneId,
			onText,
			two,
			twoId,
			twoText,
			three,
			threeId,
			threeText,
			twoGoThree;

		if(obj == province){

			oneNum =  Math.abs((objTranslateY + 80 - 160) / 40);

			//获取序号
			one = province.querySelectorAll('span')[oneNum];

			//获取自定义属性值
			oneId = one.attributes['data-id'].nodeValue;

			//清空下一级内容
			city.innerHTML = '';

			//重置下一级translateY
			city.style.transform = 'translateY(80px)';

			//重置第三级translateY
			county.style.transform = 'translateY(80px)';

			//填充下一级内容
			twoGoThree = cityBegin(oneId,city);

			//清空第三项
			county.innerHTML = '';

			//默认第三级默认第二级第一项
			if(twoGoThree){
				countyBegin(city.querySelector('span').attributes['data-id'].nodeValue,county);
			}

		}

		if(obj == city){

			twoNum =  Math.abs((objTranslateY + 80 - 160) / 40);

			//获取序号
			two = city.querySelectorAll('span')[twoNum];

			//获取选中选项自定义属性值
			twoId = two.attributes['data-id'].nodeValue;

			//清空第三项值
			county.innerHTML = '';

			//重置第三项translateY
			county.style.transform = 'translateY(80px)';

			//填充第三项
			if(twoId){
				countyBegin(twoId,county);
			}

		}

		if(obj == county){

			threeNum =  Math.abs((objTranslateY + 80 - 160) / 40);

			//获取序号
			three = county.querySelectorAll('span')[threeNum];

			//获取选中选项自定义属性值
			threeId = three.attributes['data-id'].nodeValue;

		}

	}

	//获取translateY值
	function translateXY(obj){
	    var beeTransform = obj.style.transform.replace(/\s/g,'');
	    beeTransform = beeTransform.replace('translateY','');
	    beeTransform = beeTransform.slice(1,-1);
	    beeTransform = beeTransform.replace('px','');
	    return beeTransform;
	}
	
})()