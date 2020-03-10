// ==UserScript==
// @name         Steam batch Leave comments(Steam批量留言,好友管理脚本)
// @description  Leave comments to friends automatically
// @namespace    http://tampermonkey.net/
// @namespace    https://greasyfork.org/
// @icon         http://store.steampowered.com/favicon.ico
// @icon64       http://store.steampowered.com/favicon.ico
// @version      1.2.2
// @updateURL    https://greasyfork.org/zh-CN/scripts/397073
// @author       Miku39
// @supportURL   https://steamcommunity.com/sharedfiles/filedetails/?id=1993903275
// @match        https://steamcommunity.com/*/friends
// @grant        GM_xmlhttpRequest
// @connect      translate.google.cn
// @connect      translate.google.com
// @connect      fanyi.baidu.com
// @connect      fanyi.youdao.com
// @connect      brushes8.com
// @noframes
// @run-at document-idle
// ==/UserScript==

var delay = 4; // 设置你的留言时间间隔,单位秒
var strNoOperate = "(不留言)"; //设置你的不留言的标识符: 如果不需要留言,则需在备注中添加这个不留言的标识符

function JSON_processing_parsing_JsObj(jsonText) //JSON处理并解析到js对象
{
	var JSON_jsObj;
	if (jsonText == "")
		return;

	//console.log("待处理数据:");
	//console.log(jsonText);
	JSON_jsObj = JSON.parse(jsonText);
	console.log("解析后数据:");
	console.log(JSON_jsObj);
	return JSON_jsObj;
}

function setRemarks(profileID, remarkName) {
	var URL = "https://steamcommunity.com/profiles/" + profileID + "/ajaxsetnickname/";
	jQuery.post(URL, {
		nickname: remarkName,
		sessionid: g_sessionID
	}, function(response) {
		if (response.success === false) {
			console.log("设置备注失败了!");
		} else {
			console.log("成功设置备注于");
		}
	}).fail(function() {
		console.log("无法设置备注于");
	}).always(function() {
		//console.log("当前处理了 " + (i + 1) + "个, 总计 " + total + " 个好友.");
	});
}

function countRgbColor(r,g,b) //计算RGB渐变颜色
{
	var color;
	//var color = '#' + to2string(r) +  'ffff';
	//console.log(color);
	//return color;
	while(true)
	{
		switch(RGBindex)
		{
			case 0: //红
				if(RGBr==0 & RGBg==0 & RGBb==0)
				{
					RGBr = 0xFF; //红
					color = '#' + to2string(RGBr) +  to2string(RGBg)+  to2string(RGBb);
					//console.log("color:" + color);
					return color;
				}
				else
				{
					RGBindex = 1;
					continue; //重新开始
				}
				break;
			case 1: //红->黄
				if(RGBg!=0xFF)
				{
					RGBg+=3; //红->黄
					color = '#' + to2string(RGBr) +  to2string(RGBg)+  to2string(RGBb);
					//console.log("color:" + color);
					return color;
				}
				else
				{
					RGBindex = 2;
					continue; //重新开始
				}
				break;
			case 2: //黄->绿
				if(RGBr!=0x00)  //黄
				{
					RGBr-=3; //黄->绿
					color = '#' + to2string(RGBr) +  to2string(RGBg)+  to2string(RGBb);
					//console.log("color:" + color);
					return color;
				}
				else
				{
					RGBindex = 3;
					continue; //重新开始
				}
				break;
			case 3: //绿->蓝(天蓝)
				if(RGBb!=0xFF)
				{
					if(RGBg>0xBF)
					{
						RGBg-=3;
					}
					RGBb+=3;
					color = '#' + to2string(RGBr) +  to2string(RGBg)+  to2string(RGBb);
					//console.log("color:" + color);
					return color;
				}
				else
				{
					RGBindex = 4;
					continue; //重新开始
				}
				break;
			case 4: //蓝(天蓝)->蓝(深蓝)
				if(RGBg!=0x00)
				{
					RGBg-=3;
					color = '#' + to2string(RGBr) +  to2string(RGBg)+  to2string(RGBb);
					//console.log("color:" + color);
					return color;
				}
				else
				{
					RGBindex = 5;
					continue; //重新开始
				}
				break;
			case 5: //蓝(深蓝)->紫
				if(RGBr<0x80 || RGBb>0x80)
				{
					if(RGBr<0x80)
					{
						RGBr +=3;
						color = '#' + to2string(RGBr) +  to2string(RGBg)+  to2string(RGBb);
						//console.log("color:" + color);
						return color;
					}
					else if(RGBb>0x80)
					{
						RGBb -=3;
						color = '#' + to2string(RGBr) +  to2string(RGBg)+  to2string(RGBb);
						//console.log("color:" + color);
						return color;
					}

				}
				else
				{
					RGBindex = 6;
					continue; //重新开始
				}
				break;
			case 6: //紫->红
				if(RGBr!=0xFF || RGBb!=0x00)
				{
					if(RGBr<0xFF)
					{
						RGBr+=3;
						color = '#' + to2string(RGBr) +  to2string(RGBg)+  to2string(RGBb);
						//console.log("color:" + color);
						return color;
					}
					else if(RGBb>0x00)
					{
						RGBb-=3;
						color = '#' + to2string(RGBr) +  to2string(RGBg)+  to2string(RGBb);
						//console.log("color:" + color);
						return color;
					}

				}
				else //继续RGB
				{
					RGBindex = 1;
					continue; //重新开始
				}

				break;
			case 7:
				console.log("end!!!");
				break;
			default:
				console.log("[countRgbColor()-switch(RGBindex):] 未定义异常!")
				break;
		}
	}
	//红 #FF0000
	//黄 #FFFF00
	//绿 #00FF00
	//蓝 #00BFFF #0000FF
	//紫 #800080

}
// function setRgb() //设置RGB渐变颜色
// {
// 	var loginBox = document.getElementById("LoginBaseBox");
// 	loginBox.style.background = countRgbColor(0,0,0);
// }
// var tiSysCallback_runRGB = setInterval(function(){runRGB();}, 22); //[启动定时器] 每秒回调函数 // 11 16 22 30

function addNewStyle(id, newStyle) {
	var styleElement = document.getElementById(id);

	if (!styleElement) {
		styleElement = document.createElement('style');
		styleElement.type = 'text/css';
		styleElement.id = id;
		document.getElementsByTagName('head')[0].appendChild(styleElement);
	}
	styleElement.appendChild(document.createTextNode(newStyle));
}

function addNewScript(id, newScript) {
	var styleElement = document.getElementById(id);

	if (!styleElement) {
		styleElement = document.createElement('script');
		styleElement.type = 'text/javascript';
		styleElement.id = id;
		document.getElementsByTagName('head')[0].appendChild(styleElement);
	}
	styleElement.appendChild(document.createTextNode(newScript));
}

function loadjscssFile(filePath, filetype) //动态加载一个js/css文件
{
	if (filetype == "js") {
		var fileref = document.createElement('script')
		fileref.setAttribute("type", "text/javascript")
		fileref.setAttribute("src", filePath)
	} else if (filetype == "css") {
		var fileref = document.createElement("link")
		fileref.setAttribute("rel", "stylesheet")
		fileref.setAttribute("type", "text/css")
		fileref.setAttribute("href", filePath)
	}

	if (typeof fileref != "undefined") {
		document.getElementsByTagName("head")[0].appendChild(fileref); //向元素添加新的子节点，作为最后一个子节点
	}
}

var bWait = false; //等待标志
//-------------------------------------------------
var b = function(a, b) {
	for (var d = 0; d < b.length - 2; d += 3) {
		var c = b.charAt(d + 2),
			c = "a" <= c ? c.charCodeAt(0) - 87 : Number(c),
			c = "+" == b.charAt(d + 1) ? a >>> c : a << c;
		a = "+" == b.charAt(d) ? a + c & 4294967295 : a ^ c
	}
	return a
}
var tk = function(a, TKK) {
	for (var e = TKK.split("."), h = Number(e[0]) || 0, g = [], d = 0, f = 0; f < a.length; f++) {
		var c = a.charCodeAt(f);
		128 > c ? g[d++] = c : (2048 > c ? g[d++] = c >> 6 | 192 : (55296 == (c & 64512) && f + 1 < a.length && 56320 == (a.charCodeAt(
			f + 1) & 64512) ? (c = 65536 + ((c & 1023) << 10) + (a.charCodeAt(++f) & 1023), g[d++] = c >> 18 | 240, g[d++] =
			c >> 12 & 63 | 128) : g[d++] = c >> 12 | 224, g[d++] = c >> 6 & 63 | 128), g[d++] = c & 63 | 128)
	}
	a = h;
	for (d = 0; d < g.length; d++) a += g[d], a = b(a, "+-a^+6");
	a = b(a, "+-3^+b+-f");
	a ^= Number(e[1]) || 0;
	0 > a && (a = (a & 2147483647) + 2147483648);
	a %= 1E6;
	return a.toString() + "." + (a ^ h)
}

//------------------------------------------------------------------------------------
//翻译语言
var auto = "auto"; //自动检测
var zhc = "zh-CN"; //中文简体
var zht = "zh-TW"; //中文繁体
var en = "en"; //英语
var jp = "ja"; //日语

var waitStatus = true; //等待状态
var waitStatus_cn = true; //等待状态
var returnData;
var returnData_cn;
async function GoogleTranslateRequest(origLanguage, newLanguage, strText) {
	waitStatus = true;

	var _tkk = "439786.2762026697";
	var _tk = tk(strText, _tkk);
	//console.log("_tk:",_tk);

	//需要拼接的url序列
	var baseURL = "https://translate.google.cn/translate_a/single?";
	var client = "client=" + "webapp";
	var sl = "&sl=" + origLanguage; //待翻译的原始语言      //默认为auto,即自动检测语言
	var tl = "&tl=" + newLanguage; //需要翻译成什么语言    //默认为zh-CN,即默认翻译为中文
	var hl = "&hl=" + zhc;
	var dt1 = "&dt=at&";
	var dt2 = "dt=bd&";
	var dt3 = "dt=ex&";
	var dt4 = "dt=ld&";
	var dt5 = "dt=md&";
	var dt6 = "dt=qca&";
	var dt7 = "dt=rw&";
	var dt8 = "dt=rm&";
	var dt9 = "dt=ss&";
	var dt0 = "dt=t&";
	var dt = "dt=gt&"; //del
	var otf = "otf=2&"; //1
	var ssel = "ssel=0&";
	var tsel = "tsel=4&"; //0
	var xid = "xid=1782844&";
	var kc = "kc=1&"; //8 //2
	var Tk = "tk=" + _tk;
	var q = "&q=" + encodeURI(strText);

	var requestURL = baseURL + client + sl + tl + hl + dt1 + dt2 + dt3 + dt4 + dt5 + dt6 + dt7 + dt8 + dt9 + dt0 + dt +
		otf +
		ssel + tsel + xid + kc + Tk + q;

	//console.log("requestURL: ",requestURL);

	GM_xmlhttpRequest({
		method: 'GET',
		url: requestURL,
		headers: {
			'User-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36',
			//'Accept': 'application/atom+xml,application/xml,text/xml',
			//"Content-Type": "application/x-www-form-urlencoded",
		},
		onload: function(response) {
			if (response.status === 200) {
				console.log('请求成功!');
				var JSON_jsObj = JSON_processing_parsing_JsObj(response.responseText);
				//遍历[0][0]数组就可以取得翻译后的文本,原始数据,原始数据的拼音
				//[2]是检查出的语言
				//遍历[5]可以取得两种翻译,原始数据和原始数据的长度
				//遍历[8]可以得到原始语言和翻译语言
				//for (var i = 0; i < JSON_jsObj.length; i++) {
				//	for (var j = 0; j < JSON_jsObj[i].length; j++) {
				//		for (var k = 0; k < JSON_jsObj[i][j].length; k++) {
				//			
				//		}
				//	}
				//}
				var retData = "";
				for (var j = 0; j < JSON_jsObj[0].length; j++) {
					if (JSON_jsObj[0][j][0] != null) {
						retData += JSON_jsObj[0][j][0]; //组合每一句翻译
					}
				}
				returnData = retData; //存储数据
				//console.log('谷歌翻译:',retData);
				waitStatus = false; //不等待

				//console.log(response);
				//console.log(response.responseText);
				//if(response.responseText.indexOf('[[["') == 0) //是否是指定的数据格式
				//{
				//	var retData = response.responseText.slice(4,response.responseText.indexOf('","',4)); //提取翻译后的文本
				//	returnData = retData; //存储数据
				//	//console.log('谷歌翻译:',retData);
				//	waitStatus = false; //不等待
				//}
			} else {
				console.log('请求失败!');
				//console.log(response);
				//console.log(response.responseText);
			}
		},
		onerror: function(err) {
			console.log('请求错误!', err);
		}
	});

	while (waitStatus) //强制等待异步函数执行完毕后再执行
	{
		console.log("wait...");
		await sleep(100); //延迟0.1秒
	}
	return returnData;
	// jQuery.ajax({
	// 	url: URL,
	// 	type: "GET",
	// 	dataType: "jsonp", //指定服务器返回的数据类型
	// 	jsonp: "callback", //Jquery生成验证参数的名称
	// 	processData: false,
	// 	success: function (data) {
	// 		//var result = JSON.stringify(data); //json对象转成字符串
	// 		console.log("GET成功!",data);
	// 	},
	// 	error: function(XMLHttpRequest, textStatus, errorThrown) {
	// 	alert(XMLHttpRequest.status);
	// 	alert(XMLHttpRequest.readyState);
	// 	alert(textStatus);
	// 	}
	// });



	// jQuery.get(URL,function(response,status,xhr){
	// 	if (response.success === false) {

	// 		console.log("GET失败了!",response);
	// 	} else {

	// 		console.log("GET成功!",response);
	// 	}
	// },"json");


	// jQuery.post(URL, {
	// 	comment: newMgs,
	// 	count: 6,
	// 	sessionid: g_sessionID
	// }, function(response) {
	// 	if (response.success === false) {
	// 		console.log("留言失败了!");
	// 	} else {
	// 		console.log("成功发表评论于");
	// 	}
	// }).fail(function() {
	// 	console.log("无法发表评论于");
	// }).always(function() {
	// 	console.log("当前处理了 " + (i + 1) + "个, 总计 " + total + " 个好友.");
	// });
}


async function CNTranslateRequest(newLanguage, strText) {
	waitStatus_cn = true;

	var baseURL = "https://brushes8.com/zhong-wen-jian-ti-fan-ti-zhuan-huan";

	GM_xmlhttpRequest({
		method: 'POST',
		url: baseURL,
		data: "data=" + encodeURI(strText) +
			"&dochineseconversion=" + "1" +
			"&variant=" + newLanguage +
			"&submit=" + encodeURI("开始转换 (Ctrl + Enter)"),
		headers: {
			"accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
			"Content-Type": "application/x-www-form-urlencoded", //非常重要
			"User-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36",
		},
		onload: function(response) {
			if (response.status === 200) {
				console.log('请求成功!');
				var findStr = '<label for="response">转换结果: </label><br /><textarea id="response" rows="15" cols="150">';
				var retData = response.responseText.slice(response.responseText.lastIndexOf(findStr) + findStr.length);
				returnData_cn = retData; //存储数据
				//console.log('谷歌翻译:',retData);
				waitStatus_cn = false; //不等待
			} else {
				console.log('请求失败!', response);
				//console.log(response);
				//console.log(response.responseText);
			}
		},
		onerror: function(err) {
			console.log('请求错误!', err);
		}
	});

	while (waitStatus_cn) //强制等待异步函数执行完毕后再执行
	{
		console.log("wait...");
		await sleep(100); //延迟0.1秒
	}
	return returnData_cn;
}

//------------------------------------------------------------------------------------------------------------------------------------------
(function($) {
	$.fn.ySelect = function(options) {
		var defaultOptions = {
			placeholder: '请选择',
			numDisplayed: 4,
			overflowText: '{n} selected',
			searchText: '搜索',
			showSearch: true
		}
		if (typeof options == 'string') {
			var settings = options;
		} else {
			var settings = $.extend(true, {}, defaultOptions, options);
		}

		function ySelect(select, settings) {
			this.$select = $(select);
			this.settings = settings;
			this.create();
		}
		ySelect.prototype = {
			create: function() {
				var multiple = this.$select.is('[multiple]') ? ' multiple' : '';
				this.$select.wrap('<div class="fs-wrap' + multiple + '"></div>');
				this.$select.before('<div class="fs-label-wrap"><div class="fs-label">' + this.settings.placeholder +
					'</div><span class="fs-arrow"></span></div>');
				this.$select.before('<div class="fs-dropdown hidden"><div class="fs-options"></div></div>');
				this.$select.addClass('hidden');
				this.$wrap = this.$select.closest('.fs-wrap');
				this.reload();
			},
			reload: function() {
				if (this.settings.showSearch) {
					var search = '<div class="fs-search"><input type="search" placeholder="' + this.settings.searchText +
						'" /><span class="fs-selectAll"><i class="fa fa-check-square-o"></i></span></div>';
					this.$wrap.find('.fs-dropdown').prepend(search);
				}
				var choices = this.buildOptions(this.$select);
				this.$wrap.find('.fs-options').html(choices);
				this.reloadDropdownLabel();
			},
			destroy: function() {
				this.$wrap.find('.fs-label-wrap').remove();
				this.$wrap.find('.fs-dropdown').remove();
				this.$select.unwrap().removeClass('hidden');
			},
			buildOptions: function($element) {
				var $this = this;
				var choices = '';
				$element.children().each(function(i, el) {
					var $el = $(el);
					if ('optgroup' == $el.prop('nodeName').toLowerCase()) {
						choices += '<div class="fs-optgroup">';
						choices += '<div class="fs-optgroup-label">' + $el.prop('label') + '</div>';
						choices += $this.buildOptions($el);
						choices += '</div>';
					} else {
						var selected = $el.is('[selected]') ? ' selected' : '';
						choices += '<div class="fs-option' + selected + '" data-value="' + $el.prop('value') +
							'"><span class="fs-checkbox"><i></i></span><div class="fs-option-label">' + $el.html() + '</div></div>';
					}
				});
				return choices;
			},
			reloadDropdownLabel: function() {
				var settings = this.settings;
				var labelText = [];
				this.$wrap.find('.fs-option.selected').each(function(i, el) {
					labelText.push($(el).find('.fs-option-label').text());
				});
				if (labelText.length < 1) {
					labelText = settings.placeholder;
				} else if (labelText.length > settings.numDisplayed) {
					labelText = settings.overflowText.replace('{n}', labelText.length);
				} else {
					labelText = labelText.join(', ');
				}
				this.$wrap.find('.fs-label').html(labelText);
				this.$select.change();
			},
			setwrap: function() {
				return "123";
			},
		}
		return this.each(function() {
			var data = $(this).data('ySelect');
			if (!data) {
				data = new ySelect(this, settings);
				$(this).data('ySelect', data);
			}
			if (typeof settings == 'string') {
				data[settings]();
			}
		});
	}
	window.ySelect = {
		'active': null,
		'idx': -1
	};

	function setIndexes($wrap) {
		$wrap.find('.fs-option:not(.hidden)').each(function(i, el) {
			$(el).attr('data-index', i);
			$wrap.find('.fs-option').removeClass('hl');
		});
		$wrap.find('.fs-search input').focus();
		window.ySelect.idx = -1;
	}

	function setScroll($wrap) {
		var $container = $wrap.find('.fs-options');
		var $selected = $wrap.find('.fs-option.hl');
		var itemMin = $selected.offset().top + $container.scrollTop();
		var itemMax = itemMin + $selected.outerHeight();
		var containerMin = $container.offset().top + $container.scrollTop();
		var containerMax = containerMin + $container.outerHeight();
		if (itemMax > containerMax) {
			var to = $container.scrollTop() + itemMax - containerMax;
			$container.scrollTop(to);
		} else if (itemMin < containerMin) {
			var to = $container.scrollTop() - containerMin - itemMin;
			$container.scrollTop(to);
		}
	}
	$(document).on('click', '.fs-selectAll', function() {
		$(this).parent().next().find('.fs-option.selected').click();
		$(this).parent().next().find('.fs-option').click();
		$(this).addClass('selected');
	});
	$(document).on('click', '.fs-selectAll.selected', function() {
		$(this).parent().next().find('.fs-option.selected').click();
		$(this).removeClass('selected');
	});
	$(document).on('click', '.fs-option', function() {
		var $wrap = $(this).closest('.fs-wrap');
		if ($wrap.hasClass('multiple')) {
			var selected = [];
			$(this).toggleClass('selected');
			$wrap.find('.fs-option.selected').each(function(i, el) {
				selected.push($(el).attr('data-value'));
			});
		} else {
			var selected = $(this).attr('data-value');
			$wrap.find('.fs-option').removeClass('selected');
			$(this).addClass('selected');
			$wrap.find('.fs-dropdown').hide();
		}
		$wrap.find('select').val(selected);
		$wrap.find('select').ySelect('reloadDropdownLabel');
		$wrap.find('select').ySelect('setwrap');
	});
	$(document).on('keyup', '.fs-search input', function(e) {
		if (40 == e.which) {
			$(this).blur();
			return;
		}
		var $wrap = $(this).closest('.fs-wrap');
		var keywords = $(this).val();
		$wrap.find('.fs-option, .fs-optgroup-label').removeClass('hidden');
		if ('' != keywords) {
			$wrap.find('.fs-option').each(function() {
				var regex = new RegExp(keywords, 'gi');
				if (null === $(this).find('.fs-option-label').text().match(regex)) {
					$(this).addClass('hidden');
				}
			});
			$wrap.find('.fs-optgroup-label').each(function() {
				var num_visible = $(this).closest('.fs-optgroup').find('.fs-option:not(.hidden)').length;
				if (num_visible < 1) {
					$(this).addClass('hidden');
				}
			});
		}
		setIndexes($wrap);
	});
	$(document).on('click', function(e) {
		var $el = $(e.target);
		var $wrap = $el.closest('.fs-wrap');
		if (0 < $wrap.length) {
			if ($el.hasClass('fs-label') || $el.hasClass('fs-arrow')) {
				window.ySelect.active = $wrap;
				var is_hidden = $wrap.find('.fs-dropdown').hasClass('hidden');
				$('.fs-dropdown').addClass('hidden');
				if (is_hidden) {
					$wrap.find('.fs-dropdown').removeClass('hidden');
				} else {
					$wrap.find('.fs-dropdown').addClass('hidden');
				}
				setIndexes($wrap);
			}
		} else {
			$('.fs-dropdown').addClass('hidden');
			window.ySelect.active = null;
		}
	});
	$(document).on('keydown', function(e) {
		var $wrap = window.ySelect.active;
		if (null === $wrap) {
			return;
		} else if (38 == e.which) {
			e.preventDefault();
			$wrap.find('.fs-option').removeClass('hl');
			if (window.ySelect.idx > 0) {
				window.ySelect.idx--;
				$wrap.find('.fs-option[data-index=' + window.ySelect.idx + ']').addClass('hl');
				setScroll($wrap);
			} else {
				window.ySelect.idx = -1;
				$wrap.find('.fs-search input').focus();
			}
		} else if (40 == e.which) {
			e.preventDefault();
			var last_index = $wrap.find('.fs-option:last').attr('data-index');
			if (window.ySelect.idx < parseInt(last_index)) {
				window.ySelect.idx++;
				$wrap.find('.fs-option').removeClass('hl');
				$wrap.find('.fs-option[data-index=' + window.ySelect.idx + ']').addClass('hl');
				setScroll($wrap);
			}
		} else if (32 == e.which || 13 == e.which) {
			$wrap.find('.fs-option.hl').click();
		} else if (27 == e.which) {
			$('.fs-dropdown').addClass('hidden');
			window.ySelect.active = null;
		}
	});
	$.fn.ySelectedValues = function(splitString) {
		var result = "";
		var $selects = this.find("option:selected");
		for (var i = 0; i < $selects.length; i++) {
			result += $selects[i].value + ((i == $selects.length - 1) ? "" : splitString);
		}
		return result;
	}
	$.fn.ySelectedTexts = function(splitString) {
		var result = "";
		var $selects = this.find("option:selected");
		for (var i = 0; i < $selects.length; i++) {
			result += $selects[i].text + ((i == $selects.length - 1) ? "" : splitString);
		}
		return result;
	}
})(jQuery);

//------------------------------------------------------------------------------------------------------------------------------------------

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function emojiFix() {
	var emojiObjArrs = document.getElementsByClassName("emoticon_option");
	if (emojiObjArrs.length > 0) {
		for (let i in emojiObjArrs) {
			emojiObjArrs[i].onclick = function() {
				let inObj = document.getElementById('comment_textarea');
				inObj.value += ':' + emojiObjArrs[i].getAttribute('data-emoticon') + ':'; //添加表情
			}
		}
		console.log("表情修复完毕!");
	}
}

function dvWidthFix() {
	$("subpage_container").style.width = "calc(100% - 280px)";
}

// function wordCount(data) { //字数统计,如果字符中字节数大于1000则输入框变红提示 (经过测试英文数字1个字节,中文3字节)
// 	var intLength = 0;
// 	for (var i = 0; i < data.length; i++) {
// 		if ((data.charCodeAt(i) < 0) || (data.charCodeAt(i) > 255))
// 			intLength = intLength + 3;
// 		else
// 			intLength = intLength + 1;
// 	}
// 	return intLength;

// 	// var pattern = /[a-zA-Z0-9_\u0392-\u03c9]+|[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af]+/g;
// 	// var m = data.match(pattern);
// 	// var count = 0;
// 	// if (m == null) {
// 	// 	return count;
// 	// }
// 	// for (var i = 0; i < m.length; i++) {
// 	// 	if (m[i].charCodeAt(0) >= 0x4E00) {
// 	// 		count += m[i].length;
// 	// 	} else {
// 	// 		count += 1;
// 	// 	}
// 	// }
// 	// return count;
// }

//var comment_textareaHeight = 0;

// function inBoxShrinkage(type) //输入框收缩
// {
// 	var commentText = document.getElementById("comment_textarea");

// 	if (type == true) //收缩
// 	{
// 		commentText.removeEventListener('propertychange', change, false);
// 		commentText.removeEventListener('input', change, false);
// 		commentText.removeEventListener('focus', change, false);
// 		commentText.scrollTop = 0; //定位到最上方
// 		document.body.scrollTop = 0;
// 		commentText.style.height = "28px";
// 	} else if (type == false) //展开
// 	{
// 		autoTextarea(commentText); // 调用
// 		commentText.style.height = comment_textareaHeight + 'px';
// 	}
// }

// var change;
// var autoTextarea = function(elem, extra, maxHeight) {
// 	extra = extra || 0;
// 	var isFirefox = !!document.getBoxObjectFor || 'mozInnerScreenX' in window,
// 		isOpera = !!window.opera && !!window.opera.toString().indexOf('Opera'),
// 		addEvent = function(type, callback) {
// 			elem.addEventListener ?
// 				elem.addEventListener(type, callback, false) :
// 				elem.attachEvent('on' + type, callback);
// 		},
// 		getStyle = elem.currentStyle ? function(name) {
// 			var val = elem.currentStyle[name];

// 			if (name === 'height' && val.search(/px/i) !== 1) {
// 				var rect = elem.getBoundingClientRect();
// 				return rect.bottom - rect.top -
// 					parseFloat(getStyle('paddingTop')) -
// 					parseFloat(getStyle('paddingBottom')) + 'px';
// 			};

// 			return val;
// 		} : function(name) {
// 			return getComputedStyle(elem, null)[name];
// 		},
// 		minHeight = parseFloat(getStyle('height'));

// 	elem.style.resize = 'none';

// 	change = function() {
// 		var scrollTop, height,
// 			padding = 0,
// 			style = elem.style;
// 		var obj = document.getElementById("strInBytes");
// 		var commentText = document.getElementById("comment_textarea");
// 		var numText = wordCount(commentText.value);
// 		obj.innerHTML = "当前字符字节数: <span id='strInBytes_Text'>" + numText + "</span>/999";
// 		//console.log(numText);

// 		if (wordCount(commentText.value) >= 1000) {
// 			document.getElementById("strInBytes_Text").style.color = "#FF0000";
// 			commentText.style.background = "#7b3863";
// 			jQuery("#log_head, #log_body").html("");
// 			jQuery("#log_head").html("<br><b style='color:#2CD8D6;'>字数超标啦! 请保持在1000字符以下. " + "当前字数:" + numText + "<b>");
// 		} else {
// 			document.getElementById("strInBytes_Text").style.color = "#32CD32";
// 			commentText.style.background = "#1b2838";
// 			jQuery("#log_head, #log_body").html("");
// 		}

// 		if (elem._length === elem.value.length) return;
// 		elem._length = elem.value.length;

// 		if (!isFirefox && !isOpera) {
// 			padding = parseInt(getStyle('paddingTop')) + parseInt(getStyle('paddingBottom'));
// 		};
// 		scrollTop = document.body.scrollTop || document.documentElement.scrollTop; //定位到最后

// 		elem.style.height = minHeight + 'px';
// 		if (elem.scrollHeight > minHeight) {
// 			if (maxHeight && elem.scrollHeight > maxHeight) {
// 				height = maxHeight - padding;
// 				style.overflowY = 'auto';
// 			} else {
// 				height = elem.scrollHeight - padding;
// 				style.overflowY = 'hidden';
// 			};
// 			style.height = height + extra + 'px';

// 			comment_textareaHeight = height + extra;

// 			scrollTop += parseInt(style.height) - elem.currHeight;
// 			document.body.scrollTop = scrollTop;
// 			document.documentElement.scrollTop = scrollTop;
// 			elem.currHeight = parseInt(style.height);
// 		};
// 	};

// 	addEvent('propertychange', change);
// 	addEvent('input', change);
// 	addEvent('focus', change);
// 	change();
// };


async function Main() {
	if (document.URL.lastIndexOf("/friends") == -1 || document.URL.indexOf("https://steamcommunity.com") == -1) {
		alert("请在打开的页面上,在Console(控制台)粘贴运行代码!");
		open("https://steamcommunity.com/my/friends");
	} else {
		var date;
		var startTime = 0,
			endTime = 0;

		if (delay < 0) delay = 0;

		loadjscssFile("https://cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.min.css", "css");
		addNewStyle('styles_js',
			'::selection {color:#000;background: #35d5ff;}\
				#translationText,#setNationality,#unsetNationality,#NationalityGroup,#NationalitySortGroup,#OfflineTimeGroup {font-family: "Motiva Sans", Sans-serif;font-weight: 300;\
				padding: 2px 5px;border:0;outline:0;border-radius: 2px;color: #67c1f5 !important;background: rgba(0, 0, 0, 0.5 );}\
				.persona.offline, a.persona.offline, .persona.offline.a {color:#ccc;}\
				.persona, a.persona, .persona a, .friend_status_offline, .friend_status_offline div, .friend_status_offline a {color:#ccc;}\
				.player_nickname_hint {color:#ccc;}\
				#translationText:hover,#setNationality:hover,#unsetNationality:hover,#NationalityGroup:hover,#NationalitySortGroup:hover,#OfflineTimeGroup:hover {background-color: #0a6aa1;color: #fff !important;cursor: pointer;}'
		); /* 选择的文本 */
		addNewStyle('styles1_js',
			'.fs-wrap {\
									position: relative;\
									display: inline-block;\
									vertical-align: bottom;\
									width: 200px;\
									margin: 3px;\
									font-size: 12px;\
									line-height: 1\
								}\
								.fs-label-wrap {\
									position: relative;\
									border: 1px solid #34DEFF;\
									cursor: default;\
									color: #66ccff;\
									border-radius: 4px;\
									box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075)\
								}\
								.fs-label-wrap,\
								.fs-dropdown {\
									-webkit-user-select: none;\
									-moz-user-select: none;\
									-ms-user-select: none;\
									user-select: none\
								}\
								.fs-label-wrap .fs-label {\
									padding: 4px 22px 4px 8px;\
									text-overflow: ellipsis;\
									white-space: nowrap;\
									overflow: hidden;\
									cursor: pointer\
								}\
								.fs-arrow {\
									width: 0;\
									height: 0;\
									border-left: 4px solid transparent;\
									border-right: 4px solid transparent;\
									border-top: 6px solid #fff;\
									position: absolute;\
									top: 0;\
									right: 4px;\
									bottom: 0;\
									margin: auto;\
									cursor: pointer\
								}\
								.fs-dropdown {\
									position: absolute;\
									background-color: #3E9AC6;\
									border: 1px solid #000;\
									width: 100%;\
									z-index: 1000;\
									border-radius: 4px\
								}\
								.fs-dropdown .fs-options {\
									max-height: 200px;\
									overflow: auto\
								}\
								\
								.fs-search input {\
									width: 90%;\
									padding: 2px 4px;\
									border: 0\
									outline: 0;\
								}\
								.fs-selectAll {\
									float: right;\
									cursor: pointer;\
									margin-top: 4px;\
									height: auto\
								}\
								.fs-selectAll.selected {\
									float: right;\
									cursor: pointer;\
									margin-top: 4px;\
									height: auto;\
									color: green\
								}\
								.fs-selectAll:hover {\
									background-color: #35d5ff\
								}\
								.fs-option,\
								.fs-search,\
								.fs-optgroup-label {\
									padding: 6px 8px;\
									border-bottom: 1px solid #eee;\
									cursor: default\
								}\
								.fs-option {cursor: pointer}\
								.fs-option.hl {\
									background-color: #f5f5f5\
								}\
								.fs-wrap.multiple .fs-option {\
									position: relative;\
									padding-left: 30px\
								}\
								.fs-wrap.multiple .fs-checkbox {\
									position: absolute;\
									display: block;\
									width: 30px;\
									top: 0;\
									left: 0;\
									bottom: 0\
								}\
								.fs-wrap.multiple .fs-option .fs-checkbox i {\
									position: absolute;\
									margin: auto;\
									left: 0;\
									right: 0;\
									top: 0;\
									bottom: 0;\
									width: 14px;\
									height: 14px;\
									border: 1px solid #aeaeae;\
									border-radius: 4px;\
									background-color: #fff\
								}\
								.fs-wrap.multiple .fs-option.selected .fs-checkbox i {\
									background-color: #11a911;\
									border-color: transparent;\
									background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAGCAYAAAD+Bd/7AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNXG14zYAAABMSURBVAiZfc0xDkAAFIPhd2Kr1WRjcAExuIgzGUTIZ/AkImjSofnbNBAfHvzAHjOKNzhiQ42IDFXCDivaaxAJd0xYshT3QqBxqnxeHvhunpu23xnmAAAAAElFTkSuQmCC);\
									background-repeat: no-repeat;\
									background-position: center\
								}\
								.fs-wrap .fs-option:hover {\
									background: #48E3FF;\
									border-radius: 4px;\
									margin-left: 2px;\
									margin-right: 2px\
								}\
								.fs-optgroup-label {font-weight: 700}\
								.hidden {display: none}\
								.fs-options::-webkit-scrollbar {width: 6px}\
								.fs-options::-webkit-scrollbar-track {\
									-webkit-border-radius: 2em;\
									-moz-border-radius: 2em;\
									border-radius: 2em;\
									-webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, .2);\
									background: rgba(0, 0, 0, .1)}\
								.fs-options::-webkit-scrollbar-thumb {\
									-webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, .2);\
									background: rgba(0, 0, 0, .2);\
									-webkit-border-radius: 2em;\
									-moz-border-radius: 2em;\
									border-radius: 2em\
								}'
		); /* 选择的文本 */

		addNewScript('styles_Script',
			"\
				function wordCount(data) {\
					var intLength = 0;\
					for (var i = 0; i < data.length; i++) {\
						if ((data.charCodeAt(i) < 0) || (data.charCodeAt(i) > 255))\
							intLength = intLength + 3;\
						else\
							intLength = intLength + 1;\
					}\
					return intLength;\
				}\
				var comment_textareaHeight = [];\
				function inBoxShrinkage(id,type){\
				var index = -1;\
				var iArr;\
				for(let i=0;i<comment_textareaHeight.length;i++)\
				{\
					index = comment_textareaHeight[i].indexOf(id);\
					if(index != -1)\
					{\
						iArr = i; /*记录旧节点的下标*/\
						console.log('记录旧节点的下标','iArr',iArr);\
						break;\
					}\
				}\
				if(index == -1)\
				{\
					comment_textareaHeight.push(id + ':0'); /*没有找到则是新的节点,就添加*/\
					iArr = comment_textareaHeight.length - 1 ; /*设置新节点的下标*/\
					console.log('没有找到则是新的节点,就添加','comment_textareaHeight',comment_textareaHeight,'iArr',iArr);\
				}\
				var nHeight = parseFloat(comment_textareaHeight[iArr].slice(comment_textareaHeight[iArr].lastIndexOf(':')+1)); /*裁切字符串获取下标*/\
				if(nHeight==0)/*第一次,没有指定的样式*/\
				{\
					nHeight = document.getElementById('comment_textarea').scrollHeight + 'px'; /*对于每个节点使用当前高度*/\
				}\
				/*console.log(parseFloat(comment_textareaHeight[iArr].slice(comment_textareaHeight[iArr].lastIndexOf(':')+1)),'nHeight',nHeight);*/\
				var commentText = document.getElementById(id);if (type == true){commentText.removeEventListener('propertychange', change, false);\
				commentText.removeEventListener('input', change, false);commentText.removeEventListener('focus', change, false);\
				commentText.scrollTop = 0;document.body.scrollTop = 0;commentText.style.height = '28px';} else if (type == false){autoTextarea(commentText);\
				commentText.style.height = nHeight + 'px';}\
				}\
				var change;\
				var autoTextarea = function(elem, extra, maxHeight) {\
					extra = extra || 0;\
					var isFirefox = !!document.getBoxObjectFor || 'mozInnerScreenX' in window,\
						isOpera = !!window.opera && !!window.opera.toString().indexOf('Opera'),\
						addEvent = function(type, callback) {\
							elem.addEventListener ?\
								elem.addEventListener(type, callback, false) :\
								elem.attachEvent('on' + type, callback);\
						},\
						getStyle = elem.currentStyle ? function(name) {\
							var val = elem.currentStyle[name];\
							if (name === 'height' && val.search(/px/i) !== 1) {\
								var rect = elem.getBoundingClientRect();\
								return rect.bottom - rect.top -\
									parseFloat(getStyle('paddingTop')) -\
									parseFloat(getStyle('paddingBottom')) + 'px';\
							};\
							return val;\
						} : function(name) {\
							return getComputedStyle(elem, null)[name];\
						},\
						minHeight = parseFloat(getStyle('height'));\
					elem.style.resize = 'none';\
					change = function(e,id) {\
						var scrollTop, height,\
							padding = 0,\
							style = elem.style;\
						var obj = document.getElementById('strInBytes');\
						console.log(id);\
						if(id == undefined || id == null)\
							var commentText = document.getElementById(window.event.target.id);\
						else\
							var commentText = document.getElementById(id);\
						var numText = wordCount(commentText.value);\
						obj.innerHTML =  \"当前字符字节数: <span id='strInBytes_Text'>\" + numText + '</span>/999';\
						if (wordCount(commentText.value) >= 1000) {\
							document.getElementById('strInBytes_Text').style.color = '#FF0000';\
							commentText.style.background = '#7b3863';\
							jQuery('#log_head, #log_body').html('');\
							jQuery('#log_head').html(\"<br><b style='color:#2CD8D6;'>字数超标啦! 请保持在1000字符以下. \" + '当前字数:' + numText + '<b>');\
						} else {\
							document.getElementById('strInBytes_Text').style.color = '#32CD32';\
							commentText.style.background = '#1b2838';\
							jQuery('#log_head, #log_body').html('');\
						}\
						if (elem._length === elem.value.length) return;\
						elem._length = elem.value.length;\
						if (!isFirefox && !isOpera) {\
							padding = parseInt(getStyle('paddingTop')) + parseInt(getStyle('paddingBottom'));\
						};\
						scrollTop = document.body.scrollTop || document.documentElement.scrollTop; /*定位到最后*/\
						elem.style.height = minHeight + 'px';\
						if (elem.scrollHeight > minHeight) {\
							if (maxHeight && elem.scrollHeight > maxHeight) {\
								height = maxHeight - padding;\
								style.overflowY = 'auto';\
							} else {\
								height = elem.scrollHeight - padding;\
								style.overflowY = 'hidden';\
							};\
							style.height = height + extra + 'px';\
							var nHeight1 = height + extra;\
							var newStr = nHeight1.toString();\
							/*console.log('nHeight1',nHeight1,'newStr',newStr);*/\
							/*https://blog.csdn.net/weixin_34281477/article/details/93702604*/\
							/*https://www.cnblogs.com/cblogs/p/9293522.html*/\
							/*https://www.w3school.com.cn/tiy/t.asp?f=jseg_replace_1*/\
							var iIndex;\
							for(let i=0;i<comment_textareaHeight.length;i++)\
							{\
								if(id == undefined || id == null)\
								{\
									if(comment_textareaHeight[i].indexOf(window.event.target.id)==0)\
									{\
										iIndex = i;\
										break;\
									}\
								}\
								else\
								{\
									if(comment_textareaHeight[i].indexOf(id)==0)\
									{\
										iIndex = i;\
										break;\
									}\
								}\
							}\
							/*console.log(window.event.target.id,comment_textareaHeight,'iIndex',iIndex);*/\
							/*console.log('2 comment_textareaHeight[iIndex]',comment_textareaHeight[iIndex]);*/\
							comment_textareaHeight[iIndex] = comment_textareaHeight[iIndex].replace(/:(.*)/,\"$':\");/*删除:和后面所有的字符串并添加:*/\
							/*console.log('3 comment_textareaHeight[iIndex]',comment_textareaHeight[iIndex]);*/\
							comment_textareaHeight[iIndex] += newStr;/*存储*/\
							/*console.log('存储','comment_textareaHeight',comment_textareaHeight);*/\
							scrollTop += parseInt(style.height) - elem.currHeight;\
							/*document.body.scrollTop = scrollTop;*/\
							/*document.documentElement.scrollTop = scrollTop;*/\
							elem.currHeight = parseInt(style.height);\
						};\
					};\
					addEvent('propertychange', change);\
					addEvent('input', change);\
					addEvent('focus', change);\
					change();\
					};\
				"
		);

		dvWidthFix();
		ToggleManageFriends();

		jQuery("#manage_friends").after(
			'<div class="commentthread_entry">\
					<div class="commentthread_entry_quotebox">\
						<textarea class="commentthread_textarea" id="comment_textarea" onfocus="this.focus();this.select();inBoxShrinkage(\'comment_textarea\',false);" onClick="" onblur="inBoxShrinkage(\'comment_textarea\',true);" placeholder="添加留言" style="overflow: hidden; height: 28px;"></textarea>\
					</div>\
					<div id="strInBytes" style="color: #32CD32;">当前字符字节数: <span id="strInBytes_Text">0</span>/999</div>\
					<div id="translationOptions" style="color:#fff;">\
											<span>当前语言: \
												<select id="origLanguageSelectBox" style="padding: 4px 12px 4px 8px;font-size:12px;outline:0;border: 1px solid #34DEFF;background-color:transparent;color: #66ccff;">\
													<option name="auto" value="auto" style="color:#fff;background-color: #3E9AC6;">自动检测</option>\
													<option name="zhc" value="zh-CN" style="color:#fff;background-color: #3E9AC6;">中文简体</option>\
													<option name="en" value="en" style="color:#fff;background-color: #3E9AC6;">英语</option>\
													<option name="jp" value="ja" style="color:#fff;background-color: #3E9AC6;">日语</option>\
												</select>\
											</span>\
											<span style="margin-left: 5px;">目标语言: \
												<select id="selectBoxID" class="selectBox" multiple="multiple">\
													<option value="en">英语</option>\
													<option value="ja">日语</option>\
													<option value="zh-CN">中文简体</option>\
													<option value="zh-sg">马新简体[zh-sg]</option>\
													<option value="zh-hant">繁體中文[zh-hant]</option>\
													<option value="zh-hk">繁體中文(香港)[zh-hk]</option>\
													<option value="zh-mo">繁體中文(澳门)[zh-mo]</option>\
													<option value="zh-tw">繁體中文(台湾)[zh-tw]</option>\
												</select>\
											</span>\
											<span style="margin-left: 5px;vertical-align: middle;">\
												<button id="translationText">翻译</button>\
											</apsn>\
										</div>\
					<div class="commentthread_entry_submitlink" style="">\
						<span class="isName" style="display: block;text-align: left;">\
							<span style="font-size:14px;line-height: 20px;color: #67c1f5 !important;">是否为好友添加称呼 (如果好友没有备注则使用steam名称)</span>\
							<input class="nameAddType" id="select_islName_checkbox" name="nameAddType" type="radio" style="vertical-align: middle;margin:2px;">\
						</span>\
						<span class="isSpecialName" style="display: block;text-align: left;">\
							<span style="font-size:14px;line-height: 20px;color: #67c1f5 !important;">是否为好友添加称呼 (如果好友设置有备注则使用,否则不添加称呼)</span>\
							<input class="nameAddType" id="select_isSpecialName_checkbox" name="nameAddType"  type="radio" style="vertical-align: middle;margin:2px;">\
						</span>\
						<div style="text-align: left;margin: 5px 0px;">\
						<span style="margin-left: 5px;vertical-align: middle;">\
							<span style="color: #67c1f5;">请选择要设置的国籍:</span>\
							<select id="nationalitySelectBox" style="padding: 4px 12px 4px 8px;font-size:12px;outline:0;border: 1px solid #34DEFF;background-color:transparent;color: #66ccff;">\
								<option name="CN" value="CN" style="color:#fff;background-color: #3E9AC6;">简体中文</option>\
								<option name="EN" value="EN" style="color:#fff;background-color: #3E9AC6;">英语</option>\
								<option name="JP" value="JP" style="color:#fff;background-color: #3E9AC6;">日语</option>\
								<option name="CN-SG" value="CN-SG" style="color:#fff;background-color: #3E9AC6;">马新简体(马来西亚,新加坡)[zh-sg]</option>\
								<option name="CN-HANT" value="CN-HANT" style="color:#fff;background-color: #3E9AC6;">繁體中文[zh-hant]</option>\
								<option name="CN-HK" value="CN-HK" style="color:#fff;background-color: #3E9AC6;">繁體中文(香港)[zh-hk]</option>\
								<option name="CN-MO" value="CN-MO" style="color:#fff;background-color: #3E9AC6;">繁體中文(澳门)[zh-mo]</option>\
								<option name="CN-TW" value="CN-TW" style="color:#fff;background-color: #3E9AC6;">繁體中文(台湾)[zh-tw]</option>\
							</select>\
							<button id="setNationality">为选择的好友设置国籍标识</button>\
						</apsn>\
						<span style="margin-left: 5px;vertical-align: top;">\
							<button id="unsetNationality">为选择的好友取消国籍标识</button>\
						</apsn>\
						<br />\
						<span style="margin-left: 5px;vertical-align: top;">\
							<button id="NationalityGroup">按国籍进行高亮分组</button>\
						</apsn>\
						<span style="margin-left: 5px;vertical-align: top;">\
							<button id="NationalitySortGroup">按国籍进行排序分组</button>\
						</apsn>\
						<span style="margin-left: 5px;vertical-align: top;">\
							<button id="OfflineTimeGroup">按在线时间进行排序分组</button>\
						</apsn>\
						</div>\
						<a class="btn_grey_black btn_small_thin" href="javascript:CCommentThread.FormattingHelpPopup( \'Profile\' );">\
							<span>格式化帮助</span>\
						</a>\
						<span class="emoticon_container">\
							<span class="emoticon_button small" id="emoticonbtn"></span>\
						</span>\
						<span class="btn_green_white_innerfade btn_small" id="comment_submit">\
							<span>发送评论给选择的好友</span>\
						</span>\
						<span class="btn_green_white_innerfade btn_small" id="comment_submit_special">\
							<span>根据国籍发送评论给选择的好友</span>\
						</span>\
					</div>\
				</div>\
				<div id="log">\
					<span id="log_head"></span>\
					<span id="log_body" style="display:inline-block;width:100%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; /*超出部分用...代替*/"></span>\
				</div>'
		);

		jQuery('.selectBox').ySelect({
			placeholder: '请先选择要翻译为的语言',
			searchText: '搜索~发现新世界~',
			showSearch: true,
			numDisplayed: 4,
			overflowText: '已选中 {n}项',
			isCheck: false
		});

		jQuery("#translationText").click(async function() {
			//获取选择的语言
			var selectLanguage = jQuery("#selectBoxID").ySelectedTexts(",");
			var selectLanguageArr = selectLanguage.split(',');
			if (selectLanguageArr.length == 1 && selectLanguageArr[0] == "")
				return;
			console.log("selectLanguageArr", selectLanguageArr);
			//获取输入的内容
			var inString = document.getElementById("comment_textarea").value;
			if (inString == "")
				return;
			console.log("inString", inString);
			//获取原始语言选项
			var options = document.getElementById('origLanguageSelectBox'); //获取选中的项目
			var optionsValue = options[options.selectedIndex].value;
			console.log("optionsValue", optionsValue);
			//遍历选择的语言并创建输入框,然后翻译后设置值
			for (let i = 0; i < selectLanguageArr.length; i++) {
				var _id;
				var newStrText;
				switch (selectLanguageArr[i]) {
					case '中文简体':
						_id = "_zhc";
						newStrText = await GoogleTranslateRequest(optionsValue, zhc, inString);
						console.log("翻译为中文简体:", newStrText);

						if (document.getElementById('comment_textarea_zhc') == null) {
							jQuery("#translationOptions").after(
								'\
									<div class="commentthread_entry_quotebox">\
										<span>' + '翻译为中文简体' +
								'</span>\
										<textarea class="commentthread_textarea" id="comment_textarea' + _id +
								'" onfocus="this.focus();this.select();inBoxShrinkage(\'comment_textarea_zhc\',false);" onClick="" onblur="inBoxShrinkage(\'comment_textarea_zhc\',true);" placeholder="添加留言(中文简体)" style="overflow: hidden; height: 28px;"></textarea>\
									</div>'
							);
						}
						document.getElementById('comment_textarea_zhc').value = newStrText;
						change(null, 'comment_textarea_zhc'); //统计翻译后的文字长度
						break;
					case '英语':
						_id = "_en";
						newStrText = await GoogleTranslateRequest(optionsValue, en, inString);
						console.log("翻译为英语:", newStrText);

						if (document.getElementById('comment_textarea_en') == null) {
							jQuery("#translationOptions").after(
								'\
									<div class="commentthread_entry_quotebox">\
										<span>' + '翻译为英语' +
								'</span>\
										<textarea class="commentthread_textarea" id="comment_textarea' + _id +
								'" onfocus="this.focus();this.select();inBoxShrinkage(\'comment_textarea_en\',false);" onClick="" onblur="inBoxShrinkage(\'comment_textarea_en\',true);" placeholder="添加留言(英语)" style="overflow: hidden; height: 28px;"></textarea>\
									</div>'
							);
						}
						document.getElementById('comment_textarea_en').value = newStrText;
						change(null, 'comment_textarea_en'); //统计翻译后的文字长度
						break;
					case '日语':
						_id = "_jp";
						newStrText = await GoogleTranslateRequest(optionsValue, jp, inString);
						console.log("翻译为日语:", newStrText);

						if (document.getElementById('comment_textarea_jp') == null) {
							jQuery("#translationOptions").after(
								'\
									<div class="commentthread_entry_quotebox">\
										<span>' + '翻译为日语' +
								'</span>\
										<textarea class="commentthread_textarea" id="comment_textarea' + _id +
								'" onfocus="this.focus();this.select();inBoxShrinkage(\'comment_textarea_jp\',false);" onClick="" onblur="inBoxShrinkage(\'comment_textarea_jp\',true);" placeholder="添加留言(日语)" style="overflow: hidden; height: 28px;"></textarea>\
									</div>'
							);
						}
						document.getElementById('comment_textarea_jp').value = newStrText;
						change(null, 'comment_textarea_jp'); //统计翻译后的文字长度
						break;
					case "马新简体[zh-sg]":
						_id = "_zh_sg";
						newStrText = await CNTranslateRequest('zh-sg', inString);
						console.log("翻译为马新简体[zh-sg]:", newStrText);

						if (document.getElementById('comment_textarea_zh_sg') == null) {
							jQuery("#translationOptions").after(
								'\
									<div class="commentthread_entry_quotebox">\
										<span>' + '翻译为马新简体' +
								'</span>\
										<textarea class="commentthread_textarea" id="comment_textarea' + _id +
								'" onfocus="this.focus();this.select();inBoxShrinkage(\'comment_textarea_zh_sg\',false);" onClick="" onblur="inBoxShrinkage(\'comment_textarea_zh_sg\',true);" placeholder="添加留言(马新简体)" style="overflow: hidden; height: 28px;"></textarea>\
									</div>'
							);
						}
						document.getElementById('comment_textarea_zh_sg').value = newStrText;
						change(null, 'comment_textarea_zh_sg'); //统计翻译后的文字长度
						break;
					case "繁體中文[zh-hant]":
						_id = "_zh_hant";
						newStrText = await CNTranslateRequest('zh-hant', inString);
						console.log("翻译为繁體中文[zh-hant]:", newStrText);

						if (document.getElementById('comment_textarea_zh_hant') == null) {
							jQuery("#translationOptions").after(
								'\
									<div class="commentthread_entry_quotebox">\
										<span>' + '翻译为繁體中文' +
								'</span>\
										<textarea class="commentthread_textarea" id="comment_textarea' + _id +
								'" onfocus="this.focus();this.select();inBoxShrinkage(\'comment_textarea_zh_hant\',false);" onClick="" onblur="inBoxShrinkage(\'comment_textarea_zh_hant\',true);" placeholder="添加留言(繁體中文)" style="overflow: hidden; height: 28px;"></textarea>\
									</div>'
							);
						}
						document.getElementById('comment_textarea_zh_hant').value = newStrText;
						change(null, 'comment_textarea_zh_hant'); //统计翻译后的文字长度
						break;
					case "繁體中文(香港)[zh-hk]":
						_id = "_zh_hk";
						newStrText = await CNTranslateRequest('zh-hk', inString);
						console.log("翻译为繁體中文(香港)[zh-hk]:", newStrText);

						if (document.getElementById('comment_textarea_zh_hk') == null) {
							jQuery("#translationOptions").after(
								'\
									<div class="commentthread_entry_quotebox">\
										<span>' + '翻译为繁體中文(香港)' +
								'</span>\
										<textarea class="commentthread_textarea" id="comment_textarea' + _id +
								'" onfocus="this.focus();this.select();inBoxShrinkage(\'comment_textarea_zh_hk\',false);" onClick="" onblur="inBoxShrinkage(\'comment_textarea_zh_hk\',true);" placeholder="添加留言(繁體中文(香港))" style="overflow: hidden; height: 28px;"></textarea>\
									</div>'
							);
						}
						document.getElementById('comment_textarea_zh_hk').value = newStrText;
						change(null, 'comment_textarea_zh_hk'); //统计翻译后的文字长度
						break;
					case "繁體中文(澳门)[zh-mo]":
						_id = "_zh_mo";
						newStrText = await CNTranslateRequest('zh-mo', inString);
						console.log("翻译为繁體中文(香港)[zh-hk]:", newStrText);

						if (document.getElementById('comment_textarea_zh_mo') == null) {
							jQuery("#translationOptions").after(
								'\
									<div class="commentthread_entry_quotebox">\
										<span>' + '翻译为繁體中文(澳门)' +
								'</span>\
										<textarea class="commentthread_textarea" id="comment_textarea' + _id +
								'" onfocus="this.focus();this.select();inBoxShrinkage(\'comment_textarea_zh_mo\',false);" onClick="" onblur="inBoxShrinkage(\'comment_textarea_zh_mo\',true);" placeholder="添加留言(繁體中文(澳门))" style="overflow: hidden; height: 28px;"></textarea>\
									</div>'
							);
						}
						document.getElementById('comment_textarea_zh_mo').value = newStrText;
						change(null, 'comment_textarea_zh_mo'); //统计翻译后的文字长度
						break;
					case "繁體中文(台湾)[zh-tw]":
						_id = "_zh_tw";
						newStrText = await CNTranslateRequest('zh-tw', inString);
						console.log("翻译为體中文(台湾)[zh-tw]:", newStrText);

						if (document.getElementById('comment_textarea_zh_tw') == null) {
							jQuery("#translationOptions").after(
								'\
									<div class="commentthread_entry_quotebox">\
										<span>' + '翻译为繁體中文(台湾)' +
								'</span>\
										<textarea class="commentthread_textarea" id="comment_textarea' + _id +
								'" onfocus="this.focus();this.select();inBoxShrinkage(\'comment_textarea_zh_tw\',false);" onClick="" onblur="inBoxShrinkage(\'comment_textarea_zh_tw\',true);" placeholder="添加留言(繁體中文(台湾))" style="overflow: hidden; height: 28px;"></textarea>\
									</div>'
							);
						}
						document.getElementById('comment_textarea_zh_tw').value = newStrText;
						change(null, 'comment_textarea_zh_tw'); //统计翻译后的文字长度
						break;
					default:
						break;
				}




			}

		});

		jQuery("#setNationality").click(async function() {
			//获取指定的国籍标识
			var options = document.getElementById('nationalitySelectBox'); //获取选中的项目
			var optionsValue = options[options.selectedIndex].value;
			console.log("optionsValue", optionsValue);
			var strNationality = '{' + optionsValue + '}'; //组合国籍标识
			var strSpecialNationality = '{' + optionsValue + '-N}'; //组合格外国籍标识
			//遍历所有选择的好友,
			//对已经设置了备注的好友,添加国籍标识;
			//对没有设置备注的好友,添加格外国籍标识(此国籍标识与原国籍标识都能发送特定语言的留言,
			//但是如果选择的是没有备注不添加称呼,则当做无备注处理; 并且好友会有特殊标识; 在分组中也与原国籍标识会有不同)
			//注意: 国籍标识不会被作为称呼之类的,只作为标识; 为了方便存储数据,所以会添加在备注里

			var SpecialName = undefined;
			var steamName = undefined;
			var name = undefined;
			var mode = 0;
			const total = jQuery("#search_results .selected").length; //选择的朋友总数
			if (total > 0) //选择的朋友总数
			{
				jQuery("#log_head, #log_body").html("");
				var jqobj = jQuery("#search_results .selected");

				for (let i = 0; i < jqobj.length; i++) {
					let cur = jqobj.get(i);
					let profileID = cur.getAttribute("data-steamid");
					//--------------------------------------------------------------------
					SpecialName = undefined;
					steamName = undefined;

					if (document.URL.indexOf("/friends") == -1) { //如果是在个人资料页面
						//获取备注
						var SpecialNameobj = document.getElementsByClassName("nickname"); //nickname
						SpecialName = undefined;
						if (SpecialNameobj != "undefined") {
							SpecialName = SpecialNameobj[0].innerText; //备注
						}
						//获取steam名称
						steamName = document.getElementsByClassName("actual_persona_name")[0].innerText; //steam名称
						name = steamName;
					} else //否则如果是好友界面
					{
						//获取名称,然后判断是备注还是steam名称
						var SpecialNameobj = cur.getElementsByClassName("friend_block_content");
						var nicknameObj = cur.getElementsByClassName("player_nickname_hint");
						SpecialName = undefined;


						if (SpecialNameobj.length > 0) //安全检查
						{
							if (nicknameObj.length > 0) //节点存在则是备注,不存在则是steam名称
							{
								console.log("获取到的是备注");
								SpecialName = SpecialNameobj[0].innerText.slice(0, SpecialNameobj[0].innerText.indexOf("*")); //提取备注
								steamName = undefined; //就没有名称
								if (SpecialName.indexOf('{CN}') != -1 || SpecialName.indexOf('{CN-N}') != -1 ||
									SpecialName.indexOf('{EN}') != -1 || SpecialName.indexOf('{EN-N}') != -1 ||
									SpecialName.indexOf('{JP}') != -1 || SpecialName.indexOf('{JP-N}') != -1 ||
									SpecialName.indexOf('{CN-SG}') != -1 || SpecialName.indexOf('{CN-SG-N}') != -1 ||
									SpecialName.indexOf('{CN-HANT}') != -1 || SpecialName.indexOf('{CN-HANT-N}') != -1 ||
									SpecialName.indexOf('{CN-HK}') != -1 || SpecialName.indexOf('{CN-HK-N}') != -1 ||
									SpecialName.indexOf('{CN-MO}') != -1 || SpecialName.indexOf('{CN-MO-N}') != -1 ||
									SpecialName.indexOf('{CN-TW}') != -1 || SpecialName.indexOf('{CN-TW-N}') != -1
								) //检查是否设置了国籍标识
								{
									if (SpecialName.indexOf('{' + optionsValue + '}') != -1 || SpecialName.indexOf('{' + optionsValue + '-N}') !=
										-1) //是否与待设置的国籍标识相同
									{
										jQuery("#log_body")[0].innerHTML +=
											"<a style='color:#00ffd8;' target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID +
											"\">" + '[' + (i + 1) + '/' + total + '] 已跳过, 没有设置备注! ' + profileID + '  ' + SpecialName + "</a><br>";
										continue;
									} else //重新设置国籍标识
									{
										if (SpecialName.indexOf('-N}') != -1) {
											mode = 1;
										}
										SpecialName = SpecialName.slice(SpecialName.indexOf('}') + 1); //去掉国籍标识
									}
								}
								if (mode == 0) {
									name = strNationality + SpecialName; //组合成为新的名称  国籍标识
								} else if (mode == 1) {
									name = strSpecialNationality + SpecialName; //组合成为新的名称  格外国籍标识
									mode = 0;
								}


							} else if (nicknameObj.length == 0) {
								console.log("获取到的是steam名称");
								SpecialName = undefined; //就没有备注
								steamName = SpecialNameobj[0].innerText.slice(0, SpecialNameobj[0].innerText.indexOf("\n")); //提取steam名称
								name = strSpecialNationality + steamName; //组合成为新的名称  格外国籍标识
							}
						}
					}
					console.log("[Debug] name:", name);

					(function(i, profileID) {
						var URL = "https://steamcommunity.com/profiles/" + profileID + "/ajaxsetnickname/";

						jQuery.post(URL, {
							nickname: name,
							sessionid: g_sessionID
						}, function(response) {
							if (response.success === false) {
								jQuery("#log_body")[0].innerHTML +=
									"<a style='color:#ff2c85;' target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID +
									"\">" + '[' + (i + 1) + '/' + total + '] 设置备注失败了! ' + profileID + '  ' + name +
									'&nbsp;&nbsp;&nbsp;&nbsp;' + response.error + "</a><br>";
							} else {
								jQuery("#log_body")[0].innerHTML +=
									'[' + (i + 1) + '/' + total + '] ' +
									"成功设置备注于 <a target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID + "\">" +
									profileID + '  ' + name + "</a>" +
									"<a style='color:#FB7299;' target='_blank' href=\"http://steamcommunity.com/profiles/" +
									profileID + "\">" + "</a><br>";
							}
						}).fail(function() {
							jQuery("#log_body")[0].innerHTML +=
								'[' + (i + 1) + '/' + total + '] ' +
								"<span style='color:#DA2626;'>无法设置备注于 <a style='color:#DA2626;' target='_blank' href=\"http://steamcommunity.com/profiles/" +
								profileID + "\">" +
								profileID + '  ' + name + "</a></span><br>";
						}).always(function() {
							jQuery("#log_head").html("<br><b>当前处理了 " + (i + 1) + "个, 总计 " + total + " 个好友.<b>");
						});

					})(i, profileID);
					await sleep(100);
					//console.log(cur)
				}
				window.location.reload(true); //强制从服务器重新加载当前页面
			}

		});

		jQuery("#NationalityGroup").click(async function() {
			//1.遍历所有好友,针对不同国籍进行上色
			//2.对好友进行排序

			var SpecialName = undefined;
			var steamName = undefined;
			var name = undefined;
			var mode = 0;
			const total = jQuery("#search_results .selectable").length; //选择的朋友总数
			if (total > 0) //选择的朋友总数
			{
				jQuery("#log_head, #log_body").html("");
				var jqobj = jQuery("#search_results .selectable");

				for (let i = 0; i < jqobj.length; i++) {
					let cur = jqobj.get(i);
					let profileID = cur.getAttribute("data-steamid");
					//--------------------------------------------------------------------
					SpecialName = undefined;
					steamName = undefined;

					if (document.URL.indexOf("/friends") == -1) { //如果是在个人资料页面
						//获取备注
						var SpecialNameobj = document.getElementsByClassName("nickname"); //nickname
						SpecialName = undefined;
						if (SpecialNameobj != "undefined") {
							SpecialName = SpecialNameobj[0].innerText; //备注
						}
						//获取steam名称
						steamName = document.getElementsByClassName("actual_persona_name")[0].innerText; //steam名称
						name = steamName;
					} else //否则如果是好友界面
					{
						//获取名称,然后判断是备注还是steam名称
						var SpecialNameobj = cur.getElementsByClassName("friend_block_content");
						var nicknameObj = cur.getElementsByClassName("player_nickname_hint");
						SpecialName = undefined;

						if (SpecialNameobj.length > 0) //安全检查
						{
							if (nicknameObj.length > 0) //节点存在则是备注,不存在则是steam名称
							{
								console.log("获取到的是备注");
								SpecialName = SpecialNameobj[0].innerText.slice(0, SpecialNameobj[0].innerText.indexOf("*")); //提取备注
								steamName = undefined; //就没有名称
								if (SpecialName.indexOf('{CN}') != -1 ||
									SpecialName.indexOf('{EN}') != -1 ||
									SpecialName.indexOf('{JP}') != -1 ||
									SpecialName.indexOf('{CN-SG}') != -1 ||
									SpecialName.indexOf('{CN-HANT}') != -1 ||
									SpecialName.indexOf('{CN-HK}') != -1 ||
									SpecialName.indexOf('{CN-MO}') != -1 ||
									SpecialName.indexOf('{CN-TW}') != -1
								) //检查是否设置了国籍标识
								{
									if (SpecialName.indexOf('{CN}') != -1) {
										cur.style.background = "#66cc";
									} else if (SpecialName.indexOf('{EN}') != -1) {
										cur.style.background = "#0C7FB2";
									} else if (SpecialName.indexOf('{JP}') != -1) {
										cur.style.background = "#008080";
									} else if (SpecialName.indexOf('{CN-SG}') != -1) {
										cur.style.background = "#808000";
									} else if (SpecialName.indexOf('{CN-HANT}') != -1) {
										cur.style.background = "#ae7844";
									} else if (SpecialName.indexOf('{CN-HK}') != -1) {
										cur.style.background = "#649115";
									} else if (SpecialName.indexOf('{CN-MO}') != -1) {
										cur.style.background = "#0f965b";
									} else if (SpecialName.indexOf('{CN-TW}') != -1) {
										cur.style.background = "#173eac";
									}
								} else if (SpecialName.indexOf('{CN-N}') != -1 ||
									SpecialName.indexOf('{EN-N}') != -1 ||
									SpecialName.indexOf('{JP-N}') != -1 ||
									SpecialName.indexOf('{CN-SG-N}') != -1 ||
									SpecialName.indexOf('{CN-HANT-N}') != -1 ||
									SpecialName.indexOf('{CN-HK-N}') != -1 ||
									SpecialName.indexOf('{CN-MO-N}') != -1 ||
									SpecialName.indexOf('{CN-TW-N}') != -1
								) //检查是否设置了国籍标识
								{
									if (SpecialName.indexOf('{CN-N}') != -1) {
										cur.style.background = "#66cc";
										cur.style.borderColor = "#FF00FF";
									} else if (SpecialName.indexOf('{EN-N}') != -1) {
										cur.style.background = "#0C7FB2";
										cur.style.borderColor = "#FF00FF";
									} else if (SpecialName.indexOf('{JP-N}') != -1) {
										cur.style.background = "#008080";
										cur.style.borderColor = "#FF00FF";
									} else if (SpecialName.indexOf('{CN-SG-N}') != -1) {
										cur.style.background = "#808000";
										cur.style.borderColor = "#FF00FF";
									} else if (SpecialName.indexOf('{CN-HANT-N}') != -1) {
										cur.style.background = "#ae7844";
										cur.style.borderColor = "#FF00FF";
									} else if (SpecialName.indexOf('{CN-HK-N}') != -1) {
										cur.style.background = "#649115";
										cur.style.borderColor = "#FF00FF";
									} else if (SpecialName.indexOf('{CN-MO-N}') != -1) {
										cur.style.background = "#0f965b";
										cur.style.borderColor = "#FF00FF";
									} else if (SpecialName.indexOf('{CN-TW-N}') != -1) {
										cur.style.background = "#173eac";
										cur.style.borderColor = "#FF00FF";
									}
								} else {
									//设置了备注没有设置国籍
									cur.style.background = "#188038";
								}
							} else if (nicknameObj.length == 0) {
								console.log("获取到的是steam名称");
								steamName = SpecialNameobj[0].innerText.slice(0, SpecialNameobj[0].innerText.indexOf("\n")); //提取steam名称
								//jQuery("#log_body")[0].innerHTML +=
								//	"<a style='color:#00ffd8;' target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID +
								//	"\">" + '[' + (i + 1) + '/' + total + '] 已跳过, 没有备注不能取消! ' + profileID + '  ' + steamName + "</a><br>";
								//continue;
							}
						}
					}
					console.log("[Debug] name:", SpecialName);
					//await sleep(1000);
					//console.log(cur)
				}
				//window.location.reload(true); //强制从服务器重新加载当前页面
			}


		});

		jQuery("#unsetNationality").click(async function() {
			//获取指定的国籍标识
			var options = document.getElementById('nationalitySelectBox'); //获取选中的项目
			var optionsValue = options[options.selectedIndex].value;
			console.log("optionsValue", optionsValue);
			var strNationality = '{' + optionsValue + '}'; //组合国籍标识
			var strSpecialNationality = '{' + optionsValue + '-N}'; //组合格外国籍标识
			//遍历所有选择的好友,
			//对已经设置了备注的好友,添加国籍标识;
			//对没有设置备注的好友,添加格外国籍标识(此国籍标识与原国籍标识都能发送特定语言的留言,
			//但是如果选择的是没有备注不添加称呼,则当做无备注处理; 并且好友会有特殊标识; 在分组中也与原国籍标识会有不同)
			//注意: 国籍标识不会被作为称呼之类的,只作为标识; 为了方便存储数据,所以会添加在备注里

			var SpecialName = undefined;
			var steamName = undefined;
			var name = undefined;
			var mode = 0;
			const total = jQuery("#search_results .selected.selectable").length; //选择的朋友总数
			if (total > 0) //选择的朋友总数
			{
				jQuery("#log_head, #log_body").html("");
				var jqobj = jQuery("#search_results .selected.selectable");

				for (let i = 0; i < jqobj.length; i++) {
					let cur = jqobj.get(i);
					let profileID = cur.getAttribute("data-steamid");
					//--------------------------------------------------------------------
					SpecialName = undefined;
					steamName = undefined;

					if (document.URL.indexOf("/friends") == -1) { //如果是在个人资料页面
						//获取备注
						var SpecialNameobj = document.getElementsByClassName("nickname"); //nickname
						SpecialName = undefined;
						if (SpecialNameobj != "undefined") {
							SpecialName = SpecialNameobj[0].innerText; //备注
						}
						//获取steam名称
						steamName = document.getElementsByClassName("actual_persona_name")[0].innerText; //steam名称
						name = steamName;
					} else //否则如果是好友界面
					{
						//获取名称,然后判断是备注还是steam名称
						var SpecialNameobj = cur.getElementsByClassName("friend_block_content");
						var nicknameObj = cur.getElementsByClassName("player_nickname_hint");
						SpecialName = undefined;

						if (SpecialNameobj.length > 0) //安全检查
						{
							if (nicknameObj.length > 0) //节点存在则是备注,不存在则是steam名称
							{
								console.log("获取到的是备注");
								SpecialName = SpecialNameobj[0].innerText.slice(0, SpecialNameobj[0].innerText.indexOf("*")); //提取备注
								steamName = undefined; //就没有名称
								if (SpecialName.indexOf('{CN}') != -1 ||
									SpecialName.indexOf('{EN}') != -1 ||
									SpecialName.indexOf('{JP}') != -1 ||
									SpecialName.indexOf('{CN-SG}') != -1 ||
									SpecialName.indexOf('{CN-HANT}') != -1 ||
									SpecialName.indexOf('{CN-HK}') != -1 ||
									SpecialName.indexOf('{CN-MO}') != -1 ||
									SpecialName.indexOf('{CN-TW}') != -1
								) //检查是否设置了国籍标识
								{
									SpecialName = SpecialName.slice(SpecialName.indexOf('}') + 1); //去掉国籍标识
									name = SpecialName; //使用原来的备注
								} else if (SpecialName.indexOf('{CN-N}') != -1 ||
									SpecialName.indexOf('{EN-N}') != -1 ||
									SpecialName.indexOf('{JP-N}') != -1 ||
									SpecialName.indexOf('{CN-SG-N}') != -1 ||
									SpecialName.indexOf('{CN-HANT-N}') != -1 ||
									SpecialName.indexOf('{CN-HK-N}') != -1 ||
									SpecialName.indexOf('{CN-MO-N}') != -1 ||
									SpecialName.indexOf('{CN-TW-N}') != -1
								) //检查是否设置了国籍标识
								{
									SpecialName = SpecialName.slice(SpecialName.indexOf('}') + 1); //去掉国籍标识
									name = ""; //去掉备注
								} else {
									jQuery("#log_body")[0].innerHTML +=
										"<a style='color:#00ffd8;' target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID +
										"\">" + '[' + (i + 1) + '/' + total + '] 已跳过, 没有设置国籍不能取消! ' + profileID + '  ' + SpecialName + "</a><br>";
									continue;
								}
							} else if (nicknameObj.length == 0) {
								console.log("获取到的是steam名称");
								steamName = SpecialNameobj[0].innerText.slice(0, SpecialNameobj[0].innerText.indexOf("\n")); //提取steam名称
								jQuery("#log_body")[0].innerHTML +=
									"<a style='color:#00ffd8;' target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID +
									"\">" + '[' + (i + 1) + '/' + total + '] 已跳过, 没有备注不能取消! ' + profileID + '  ' + steamName + "</a><br>";
								continue;
							}
						}
					}
					console.log("[Debug] name:", name);
					(function(i, profileID) {
						var URL = "https://steamcommunity.com/profiles/" + profileID + "/ajaxsetnickname/";

						jQuery.post(URL, {
							nickname: name,
							sessionid: g_sessionID
						}, function(response) {
							if (response.success === false) {
								jQuery("#log_body")[0].innerHTML +=
									"<a style='color:#ff2c85;' target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID +
									"\">" + '[' + (i + 1) + '/' + total + '] 设置备注失败了! ' + profileID + '  ' + name +
									'&nbsp;&nbsp;&nbsp;&nbsp;' + response.error + "</a><br>";
							} else {
								jQuery("#log_body")[0].innerHTML +=
									'[' + (i + 1) + '/' + total + '] ' +
									"成功设置备注于 <a target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID + "\">" +
									profileID + '  ' + name + "</a>" +
									"<a style='color:#FB7299;' target='_blank' href=\"http://steamcommunity.com/profiles/" +
									profileID + "\">" + "</a><br>";
							}
						}).fail(function() {
							jQuery("#log_body")[0].innerHTML +=
								'[' + (i + 1) + '/' + total + '] ' +
								"<span style='color:#DA2626;'>无法设置备注于 <a style='color:#DA2626;' target='_blank' href=\"http://steamcommunity.com/profiles/" +
								profileID + "\">" +
								profileID + '  ' + name + "</a></span><br>";
						}).always(function() {
							jQuery("#log_head").html("<br><b>当前处理了 " + (i + 1) + "个, 总计 " + total + " 个好友.<b>");
						});

					})(i, profileID);
					await sleep(1000);
					//console.log(cur)
				}
				window.location.reload(true); //强制从服务器重新加载当前页面
			}

		});

		setTimeout(async function() {
			document.getElementById("emoticonbtn").click();
			await sleep(1100);
			await emojiFix();
			document.getElementById("emoticonbtn").click();
		}, 0);

		new CEmoticonPopup($J('#emoticonbtn'), $J('#commentthread_Profile_0_textarea'));


		//---------------------------------------------------------------------------------------------------------------
		await jQuery("#comment_submit").click(async function() {
			date = new Date();
			startTime = date.getTime();

			const total = jQuery("#search_results .selected.selectable").length; //选择的朋友总数
			const msg = jQuery("#comment_textarea").val(); //获取评论内容
			var newMgs = "";
			var mode = 0;
			var SpecialName = undefined;
			var steamName = undefined;
			var name = undefined;

			if (total > 0 && msg.length > 0) {
				jQuery("#log_head, #log_body").html("");
				//jQuery(".selected").each(async function(i) {
				var jqobj = jQuery("#search_results .selected.selectable");

				for (let i = 0; i < jqobj.length; i++) {
					let cur = jqobj.get(i);

					//--------------------------------------------------------------------
					SpecialName = undefined;
					steamName = undefined;

					if (document.URL.indexOf("/friends") == -1) { //如果是在个人资料页面
						//获取备注
						var SpecialNameobj = document.getElementsByClassName("nickname"); //nickname
						SpecialName = undefined;
						if (SpecialNameobj != "undefined") {
							SpecialName = SpecialNameobj[0].innerText; //备注
						}
						//获取steam名称
						steamName = document.getElementsByClassName("actual_persona_name")[0].innerText; //steam名称
						name = steamName;
					} else //否则如果是好友界面
					{
						//获取名称,然后判断是备注还是steam名称
						var SpecialNameobj = cur.getElementsByClassName("friend_block_content");
						var nicknameObj = cur.getElementsByClassName("player_nickname_hint");
						SpecialName = undefined;
						if (SpecialNameobj.length > 0) //安全检查
						{
							if (nicknameObj.length > 0) //节点存在则是备注,不存在则是steam名称
							{
								console.log("获取到的是备注");
								SpecialName = SpecialNameobj[0].innerText.slice(0, SpecialNameobj[0].innerText.indexOf("*")); //提取备注
								steamName = undefined; //就没有名称
								name = SpecialName;
							} else if (nicknameObj.length == 0) {
								console.log("获取到的是steam名称");
								SpecialName = undefined; //就没有备注
								steamName = SpecialNameobj[0].innerText.slice(0, SpecialNameobj[0].innerText.indexOf("\n")); //提取steam名称
								name = steamName;
							}
						}
					}
					//--------------------------------------------------------------------
					if ($("select_islName_checkbox").checked == true) {
						mode = 1;
					}
					if ($("select_isSpecialName_checkbox").checked == true) {
						mode = 2;
					}

					if (mode == 1) { //是否为好友添加称呼 (如果好友没有备注则使用steam名称)
						//判断是否有备注,没有则使用steam名称
						if (SpecialName != undefined) {
							console.log("为" + steamName + "添加称呼: " + SpecialName);
							newMgs = SpecialName + msg;
						} else {
							console.log("为" + steamName + "添加称呼: " + steamName);
							newMgs = steamName + msg;
						}
					} else if (mode == 2) { //是否为好友添加称呼 (请为好友设置备注为需要的称呼,否则不添加称呼)
						//判断是否有备注,没有则不操作
						if (SpecialName != undefined) {
							console.log("为" + steamName + "添加称呼: " + SpecialName);
							newMgs = SpecialName + msg;
						} else {
							newMgs = msg;
						}
					} else if (mode == 0) { //直接发送内容
						newMgs = msg;
					}
					console.log("[Debug] mode:", mode);
					console.log("[Debug] SpecialName:", SpecialName, "steamName:", steamName);
					console.log("[Debug] newMgs:", newMgs, "msg:", msg);
					//--------------------------------------------------------------------
					let profileID = cur.getAttribute("data-steamid");

					if (SpecialName != undefined) {
						if (SpecialName.indexOf(strNoOperate) != -1) {
							jQuery("#log_body")[0].innerHTML +=
								"<a style='color:#00ffd8;' target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID +
								"\">" + '[' + (i + 1) + '/' + total + '] 已跳过留言! ' + profileID + '  ' + name + "</a><br>";
							continue;
						}
					}

					(function(i, profileID) {
						//setTimeout(function() {

						jQuery.post("//steamcommunity.com/comment/Profile/post/" + profileID + "/-1/", {
							comment: newMgs,
							count: 6,
							sessionid: g_sessionID
						}, function(response) {
							if (response.success === false) {
								jQuery("#log_body")[0].innerHTML +=
									"<a style='color:#ff2c85;' target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID +
									"\">" + '[' + (i + 1) + '/' + total + '] 留言失败了! ' + profileID + '  ' + name +
									'&nbsp;&nbsp;&nbsp;&nbsp;' + response.error + "</a><br>";
							} else {
								jQuery("#log_body")[0].innerHTML +=
									'[' + (i + 1) + '/' + total + '] ' +
									"成功发表评论于 <a target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID + "\">" +
									profileID + '  ' + name + "</a>" +
									"<span> → </span><a style='color:#FB7299;' target='_blank' href=\"http://steamcommunity.com/profiles/" +
									profileID + "\">" + newMgs + "</a><br>";
							}
						}).fail(function() {
							jQuery("#log_body")[0].innerHTML +=
								'[' + (i + 1) + '/' + total + '] ' +
								"<span style='color:#DA2626;'>无法发表评论于 <a style='color:#DA2626;' target='_blank' href=\"http://steamcommunity.com/profiles/" +
								profileID + "\">" +
								profileID + '  ' + name + "</a></span><br>";
						}).always(function() {
							jQuery("#log_head").html("<br><b>当前处理了 " + (i + 1) + "个, 总计 " + total + " 个好友.<b>");
						});


						//}, i * 6000);

					})(i, profileID);
					await sleep(delay * 1000)
					//console.log(cur)
				}


				date = new Date();
				endTime = date.getTime();
				let time = endTime - startTime;
				//console.log("time",time,endTime,startTime);
				//--------------------------------------------------------------------------------
				//计算出相差天数
				var str = "";
				let days = Math.floor(time / (24 * 3600 * 1000))
				//计算出小时数
				let leave1 = time % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
				let hours = Math.floor(leave1 / (3600 * 1000))
				//计算相差分钟数
				let leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
				let minutes = Math.floor(leave2 / (60 * 1000))
				//计算相差秒数
				let leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
				//let seconds=Math.round(leave3/1000)
				let seconds = leave3 / 1000
				if (days > 0)
					str += days + "天";
				if (hours > 0)
					str += hours + "小时";
				if (minutes > 0)
					str += minutes + "分钟";
				if (seconds > 0)
					str += seconds + "秒";
				//--------------------------------------------------------------------------------
				jQuery("#log_body")[0].innerHTML +=
					"<b>留言完毕! 用时: <span style='color:#35ff8b;'>" + str + "</span></b><br>";
				//});

			} else {
				alert("请确保您输入了一条消息并选择了1个或更多好友。");
			}
		});

		//---------------------------------------------------------------------------------------------------------------
		await jQuery("#comment_submit_special").click(async function() {
			date = new Date();
			startTime = date.getTime();

			const total = jQuery("#search_results .selected.selectable").length; //选择的朋友总数
			const msg = jQuery("#comment_textarea").val(); //获取评论内容
			const msg_CN = jQuery("#comment_textarea_zhc").val(); //获取评论内容
			const msg_EN = jQuery("#comment_textarea_en").val(); //获取评论内容
			const msg_JP = jQuery("#comment_textarea_jp").val(); //获取评论内容
			const msg_CN_SG = jQuery("#comment_textarea_zh_sg").val(); //获取评论内容
			const msg_CN_HANT = jQuery("#comment_textarea_zh_hant").val(); //获取评论内容
			const msg_CN_HK = jQuery("#comment_textarea_zh_hk").val(); //获取评论内容
			const msg_CN_MO = jQuery("#comment_textarea_zh_mo").val(); //获取评论内容
			const msg_CN_TW = jQuery("#comment_textarea_zh_tw").val(); //获取评论内容
			var newMgs = "";
			var mode = 0;
			var SpecialName = undefined;
			var steamName = undefined;
			var name = undefined;

			if (total > 0 && msg.length > 0) {
				jQuery("#log_head, #log_body").html("");
				//jQuery(".selected").each(async function(i) {
				//var jqobj = jQuery(".selected");
				//var jqobj = jQuery(".selected[data-steamid]"); //排除掉选择的其他的东西
				var jqobj = jQuery("#search_results .selected.selectable"); //排除掉选择的其他的东西

				for (let i = 0; i < jqobj.length; i++) {
					let cur = jqobj.get(i);

					//--------------------------------------------------------------------
					SpecialName = undefined;
					steamName = undefined;

					if (document.URL.indexOf("/friends") == -1) { //如果是在个人资料页面
						//获取备注
						var SpecialNameobj = document.getElementsByClassName("nickname"); //nickname
						SpecialName = undefined;
						if (SpecialNameobj != "undefined") {
							SpecialName = SpecialNameobj[0].innerText; //备注
						}
						//获取steam名称
						steamName = document.getElementsByClassName("actual_persona_name")[0].innerText; //steam名称
						name = steamName;
					} else //否则如果是好友界面
					{
						//获取名称,然后判断是备注还是steam名称
						var SpecialNameobj = cur.getElementsByClassName("friend_block_content");
						var nicknameObj = cur.getElementsByClassName("player_nickname_hint");
						SpecialName = undefined;
						if (SpecialNameobj.length > 0) //安全检查
						{
							if (nicknameObj.length > 0) //节点存在则是备注,不存在则是steam名称
							{
								console.log("获取到的是备注");
								SpecialName = SpecialNameobj[0].innerText.slice(0, SpecialNameobj[0].innerText.indexOf("*")); //提取备注
								steamName = undefined; //就没有名称
								name = SpecialName;
							} else if (nicknameObj.length == 0) {
								console.log("获取到的是steam名称");
								SpecialName = undefined; //就没有备注
								steamName = SpecialNameobj[0].innerText.slice(0, SpecialNameobj[0].innerText.indexOf("\n")); //提取steam名称
								name = steamName;
							}
						}
					}
					//--------------------------------------------------------------------
					if ($("select_islName_checkbox").checked == true) {
						mode = 1;
					}
					if ($("select_isSpecialName_checkbox").checked == true) {
						mode = 2;
					}

					var getVA = function(steamName, SpecialName) {
						return steamName == undefined ? steamName : SpecialName;
					};

					console.log("DBG 0", steamName, SpecialName, name);

					if (mode == 1) { //是否为好友添加称呼 (如果好友没有备注则使用steam名称)
						//判断是否有备注,没有则使用steam名称
						if (SpecialName != undefined) {
							let strNationality = SpecialName.slice(0, SpecialName.indexOf('}') + 1); //提取国籍
							SpecialName = SpecialName.slice(SpecialName.indexOf('}') + 1); //去掉国籍标识

							if (strNationality == "{CN}" || strNationality == "{CN-N}") {
								newMgs = SpecialName + msg_CN;
							} else if (strNationality == "{EN}" || strNationality == "{EN-N}") {
								newMgs = SpecialName + msg_EN;
							} else if (strNationality == "{JP}" || strNationality == "{JP-N}") {
								newMgs = SpecialName + msg_JP;
							} else if (strNationality == "{CN-SG}" || strNationality == "{CN-SG-N}") {
								newMgs = SpecialName + msg_CN_SG;
							} else if (strNationality == "{CN-HANT}" || strNationality == "{CN-HANT-N}") {
								newMgs = SpecialName + msg_CN_HANT;
							} else if (strNationality == "{CN-HK}" || strNationality == "{CN-HK-N}") {
								newMgs = SpecialName + msg_CN_HK;
							} else if (strNationality == "{CN-MO}" || strNationality == "{CN-MO-N}") {
								newMgs = SpecialName + msg_CN_MO;
							} else if (strNationality == "{CN-TW}" || strNationality == "{CN-TW-N}") {
								newMgs = SpecialName + msg_CN_TW;
							} else //没有设置国籍则默认使用英文,日语,简体中文,原始语言
							{
								if (msg_EN != undefined && msg_EN != "")
									newMgs = SpecialName + msg_EN;
								else if (msg_JP != undefined && msg_JP != "")
									newMgs = SpecialName + msg_JP;
								else if (msg_CN != undefined && msg_CN != "")
									newMgs = SpecialName + msg_CN;
								else
									newMgs = SpecialName + msg;
							}
							console.log("DBG 1", steamName, SpecialName, name, strNationality);
							console.log("为" + SpecialName + "添加称呼: " + SpecialName);
							//newMgs = SpecialName + msg;
						} else {
							let strNationality = steamName.slice(0, steamName.indexOf('}') + 1); //提取国籍
							steamName = steamName.slice(steamName.indexOf('}') + 1); //去掉国籍标识

							if (strNationality == "{CN}" || strNationality == "{CN-N}") {
								newMgs = steamName + msg_CN;
							} else if (strNationality == "{EN}" || strNationality == "{EN-N}") {
								newMgs = steamName + msg_EN;
							} else if (strNationality == "{JP}" || strNationality == "{JP-N}") {
								newMgs = steamName + msg_JP;
							} else if (strNationality == "{CN-SG}" || strNationality == "{CN-SG-N}") {
								newMgs = steamName + msg_CN_SG;
							} else if (strNationality == "{CN-HANT}" || strNationality == "{CN-HANT-N}") {
								newMgs = steamName + msg_CN_HANT;
							} else if (strNationality == "{CN-HK}" || strNationality == "{CN-HK-N}") {
								newMgs = steamName + msg_CN_HK;
							} else if (strNationality == "{CN-MO}" || strNationality == "{CN-MO-N}") {
								newMgs = steamName + msg_CN_MO;
							} else if (strNationality == "{CN-TW}" || strNationality == "{CN-TW-N}") {
								newMgs = steamName + msg_CN_TW;
							} else //没有设置国籍则默认使用英文,日语,简体中文,原始语言
							{
								if (msg_EN != undefined && msg_EN != "")
									newMgs = steamName + msg_EN;
								else if (msg_JP != undefined && msg_JP != "")
									newMgs = steamName + msg_JP;
								else if (msg_CN != undefined && msg_CN != "")
									newMgs = steamName + msg_CN;
								else
									newMgs = steamName + msg;
							}
							console.log("DBG 2", steamName, SpecialName, name, strNationality);
							console.log("为" + steamName + "添加称呼: " + steamName);
							//newMgs = steamName + msg;
						}
					} else if (mode == 2) { //是否为好友添加称呼 (请为好友设置备注为需要的称呼,否则不添加称呼)
						//判断是否有备注,没有则不操作
						if (SpecialName != undefined) {
							let strNationality = SpecialName.slice(0, SpecialName.indexOf('}') + 1); //提取国籍
							SpecialName = SpecialName.slice(SpecialName.indexOf('}') + 1); //去掉国籍标识

							if (strNationality == "{CN}" || strNationality == "{CN-N}") {
								newMgs = SpecialName + msg_CN;
							} else if (strNationality == "{EN}" || strNationality == "{EN-N}") {
								newMgs = SpecialName + msg_EN;
							} else if (strNationality == "{JP}" || strNationality == "{JP-N}") {
								newMgs = SpecialName + msg_JP;
							} else if (strNationality == "{CN-SG}" || strNationality == "{CN-SG-N}") {
								newMgs = SpecialName + msg_CN_SG;
							} else if (strNationality == "{CN-HANT}" || strNationality == "{CN-HANT-N}") {
								newMgs = SpecialName + msg_CN_HANT;
							} else if (strNationality == "{CN-HK}" || strNationality == "{CN-HK-N}") {
								newMgs = SpecialName + msg_CN_HK;
							} else if (strNationality == "{CN-MO}" || strNationality == "{CN-MO-N}") {
								newMgs = SpecialName + msg_CN_MO;
							} else if (strNationality == "{CN-TW}" || strNationality == "{CN-TW-N}") {
								newMgs = SpecialName + msg_CN_TW;
							} else //没有设置国籍则默认使用英文,日语,简体中文,原始语言
							{
								if (msg_EN != undefined && msg_EN != "")
									newMgs = SpecialName + msg_EN;
								else if (msg_JP != undefined && msg_JP != "")
									newMgs = SpecialName + msg_JP;
								else if (msg_CN != undefined && msg_CN != "")
									newMgs = SpecialName + msg_CN;
								else
									newMgs = SpecialName + msg;
							}
							console.log("DBG 3", steamName, SpecialName, name, strNationality);
							console.log("为" + steamName + "添加称呼: " + SpecialName);
							//newMgs = SpecialName + msg;
						} else {
							let strNationality = steamName.slice(0, steamName.indexOf('}') + 1); //提取国籍
							steamName = steamName.slice(steamName.indexOf('}') + 1); //去掉国籍标识

							if (strNationality == "{CN}" || strNationality == "{CN-N}") {
								newMgs = msg_CN;
							} else if (strNationality == "{EN}" || strNationality == "{EN-N}") {
								newMgs = msg_EN;
							} else if (strNationality == "{JP}" || strNationality == "{JP-N}") {
								newMgs = msg_JP;
							} else if (strNationality == "{CN-SG}" || strNationality == "{CN-SG-N}") {
								newMgs = msg_CN_SG;
							} else if (strNationality == "{CN-HANT}" || strNationality == "{CN-HANT-N}") {
								newMgs = msg_CN_HANT;
							} else if (strNationality == "{CN-HK}" || strNationality == "{CN-HK-N}") {
								newMgs = msg_CN_HK;
							} else if (strNationality == "{CN-MO}" || strNationality == "{CN-MO-N}") {
								newMgs = msg_CN_MO;
							} else if (strNationality == "{CN-TW}" || strNationality == "{CN-TW-N}") {
								newMgs = msg_CN_TW;
							} else //没有设置国籍则默认使用英文,日语,简体中文,原始语言
							{
								if (msg_EN != undefined && msg_EN != "")
									newMgs = msg_EN;
								else if (msg_JP != undefined && msg_JP != "")
									newMgs = msg_JP;
								else if (msg_CN != undefined && msg_CN != "")
									newMgs = msg_CN;
								else
									newMgs = msg;
							}
							console.log("DBG 4", steamName, SpecialName, name, strNationality);
							//newMgs = msg;
						}
					} else if (mode == 0) { //直接发送内容
						let strNationality = name.slice(0, name.indexOf('}') + 1); //提取国籍
						name = name.slice(name.indexOf('}') + 1); //去掉国籍标识

						if (strNationality == "{CN}" || strNationality == "{CN-N}") {
							newMgs = msg_CN;
						} else if (strNationality == "{EN}" || strNationality == "{EN-N}") {
							newMgs = msg_EN;
						} else if (strNationality == "{JP}" || strNationality == "{JP-N}") {
							newMgs = msg_JP;
						} else if (strNationality == "{CN-SG}" || strNationality == "{CN-SG-N}") {
							newMgs = msg_CN_SG;
						} else if (strNationality == "{CN-HANT}" || strNationality == "{CN-HANT-N}") {
							newMgs = msg_CN_HANT;
						} else if (strNationality == "{CN-HK}" || strNationality == "{CN-HK-N}") {
							newMgs = msg_CN_HK;
						} else if (strNationality == "{CN-MO}" || strNationality == "{CN-MO-N}") {
							newMgs = msg_CN_MO;
						} else if (strNationality == "{CN-TW}" || strNationality == "{CN-TW-N}") {
							newMgs = msg_CN_TW;
						} else //没有设置国籍则默认使用英文,日语,简体中文,原始语言
						{
							if (msg_EN != undefined && msg_EN != "")
								newMgs = msg_EN;
							else if (msg_JP != undefined && msg_JP != "")
								newMgs = msg_JP;
							else if (msg_CN != undefined && msg_CN != "")
								newMgs = msg_CN;
							else
								newMgs = msg;
						}
						console.log("DBG 5", steamName, SpecialName, name, strNationality);
						//ewMgs = msg;
					}
					console.log("[Debug] mode:", mode);
					console.log("[Debug] SpecialName:", SpecialName, "steamName:", steamName);
					console.log("[Debug] newMgs:", newMgs, "msg:", msg);
					//--------------------------------------------------------------------
					let profileID = cur.getAttribute("data-steamid");

					if (SpecialName != undefined) {
						if (SpecialName.indexOf(strNoOperate) != -1) {
							jQuery("#log_body")[0].innerHTML +=
								"<a style='color:#00ffd8;' target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID +
								"\">" + '[' + (i + 1) + '/' + total + '] 已跳过留言! ' + profileID + '  ' + name + "</a><br>";
							continue;
						}
					}

					(function(i, profileID) {
						//setTimeout(function() {

						jQuery.post("//steamcommunity.com/comment/Profile/post/" + profileID + "/-1/", {
							comment: newMgs,
							count: 6,
							sessionid: g_sessionID
						}, function(response) {
							if (response.success === false) {
								jQuery("#log_body")[0].innerHTML +=
									"<a style='color:#ff2c85;' target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID +
									"\">" + '[' + (i + 1) + '/' + total + '] 留言失败了! ' + profileID + '  ' + name +
									'&nbsp;&nbsp;&nbsp;&nbsp;' + response.error + "</a><br>";
							} else {
								jQuery("#log_body")[0].innerHTML +=
									'[' + (i + 1) + '/' + total + '] ' +
									"成功发表评论于 <a target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID + "\">" +
									profileID + '  ' + name + "</a>" +
									"<span> → </span><a style='color:#FB7299;' target='_blank' href=\"http://steamcommunity.com/profiles/" +
									profileID + "\">" + newMgs + "</a><br>";
							}
						}).fail(function() {
							jQuery("#log_body")[0].innerHTML +=
								'[' + (i + 1) + '/' + total + '] ' +
								"<span style='color:#DA2626;'>无法发表评论于 <a style='color:#DA2626;' target='_blank' href=\"http://steamcommunity.com/profiles/" +
								profileID + "\">" +
								profileID + '  ' + name + "</a></span><br>";
						}).always(function() {
							jQuery("#log_head").html("<br><b>当前处理了 " + (i + 1) + "个, 总计 " + total + " 个好友.<b>");
						});


						//}, i * 6000);

					})(i, profileID);
					await sleep(delay * 1000)
					//console.log(cur)
				}


				date = new Date();
				endTime = date.getTime();
				let time = endTime - startTime;
				//console.log("time",time,endTime,startTime);
				//--------------------------------------------------------------------------------
				//计算出相差天数
				var str = "";
				let days = Math.floor(time / (24 * 3600 * 1000))
				//计算出小时数
				let leave1 = time % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
				let hours = Math.floor(leave1 / (3600 * 1000))
				//计算相差分钟数
				let leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
				let minutes = Math.floor(leave2 / (60 * 1000))
				//计算相差秒数
				let leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
				//let seconds=Math.round(leave3/1000)
				let seconds = leave3 / 1000
				if (days > 0)
					str += days + "天";
				if (hours > 0)
					str += hours + "小时";
				if (minutes > 0)
					str += minutes + "分钟";
				if (seconds > 0)
					str += seconds + "秒";
				//--------------------------------------------------------------------------------
				jQuery("#log_body")[0].innerHTML +=
					"<b>留言完毕! 用时: <span style='color:#35ff8b;'>" + str + "</span></b><br>";
				//});

			} else {
				alert("请确保您输入了一条消息并选择了1个或更多好友。");
			}
		});

		var GroupMode = 0; //分组标志 0没有分组 1是国籍 2是离线时间

		await jQuery("#NationalitySortGroup").click(async function() {
			var SpecialName = undefined;
			var steamName = undefined;
			var name = undefined;
			var mode = 0;
			const total = jQuery("#search_results .selectable").length; //所有的朋友总数
			jQuery("#log_head, #log_body").html("");
			var jqobj = jQuery("#search_results .selectable"); //所有的朋友


			var child_CN, child_EN, child_JP, child_CN_SG, child_CN_HANTd, child_CN_HK, child_CN_MO, child_CN_TW;
			if (GroupMode != 1) {
				var mainFriendObj;
				if (GroupMode == 2) { //节点已经被模式2处理过
					//备份和处理
					if (document.getElementById("search_results1") == null) { //没有被模式1处理过
						mainFriendObj = document.getElementById("search_results0"); //获取原节点
						var newCopyObj = mainFriendObj.cloneNode(true);
						var mainFriendObj1 = document.getElementById("search_results"); //获取之前模式的节点
						mainFriendObj1.style.display = "none"; //之前模式的节点隐藏
						mainFriendObj1.id = "search_results2"; //之前模式的节点
						mainFriendObj1.className = "profile_friends search_results2"; //之前模式的节点
						newCopyObj.style.display = ""; //克隆的原节点取消隐藏(显示)
						newCopyObj.id = "search_results"; //克隆的原节点
						newCopyObj.className = "profile_friends search_results"; //克隆的原节点
						mainFriendObj.parentNode.appendChild(newCopyObj); //再添加一个新的备份节点
					} else { //被模式1处理过
						var obj = document.getElementById("search_results1");
						var mainFriendObj1 = document.getElementById("search_results"); //获取之前模式的节点
						mainFriendObj = document.getElementById("search_results0"); //获取原节点
						mainFriendObj1.style.display = "none"; //之前模式的节点隐藏
						mainFriendObj1.id = "search_results2"; //之前模式的节点
						mainFriendObj1.className = "profile_friends search_results2"; //之前模式的节点
						obj.style.display = ""; //取消隐藏(显示)
						obj.id = "search_results"; //节点
						obj.className = "profile_friends search_results"; //节点
					}

				} else { //节点还没有被动过
					//备份和处理
					mainFriendObj = document.getElementById("search_results"); //获取原节点
					var newCopyObj = mainFriendObj.cloneNode(true);
					newCopyObj.style.display = "none"; //克隆的原节点隐藏
					newCopyObj.id = "search_results0"; //克隆的原节点
					newCopyObj.className = "profile_friends search_results0"; //克隆的原节点
					mainFriendObj.parentNode.appendChild(newCopyObj); //再添加一个新的备份节点


				}
				// //备份和处理
				// var mainFriendObj = document.getElementById("search_results"); //获取原节点
				// var newCopyObj = mainFriendObj.cloneNode(true);
				// newCopyObj.style.display = "none"; //隐藏
				// mainFriendObj.parentNode.appendChild(newCopyObj); //再添加一个新的备份节点

				var StateObj = mainFriendObj.getElementsByClassName("state_block");
				for (let i = 0; i < StateObj.length; i++) {
					StateObj[i].style.display = "none"; //隐藏状态条
				}

				//创建新盒子和克隆分组节点
				console.log("开始分组...");
				child_CN = document.createElement('div'); //创建
				child_CN.id = "Firend_CN";
				child_CN.style.display = "flex";
				child_CN.style.flex = "1 100%";
				child_CN.style.flexFlow = "row wrap";
				child_CN.style.margin = "8px 0px 0px 0px";
				// child_CN.style.justifyContent = "space-start";
				mainFriendObj.appendChild(child_CN);

				child_EN = child_CN.cloneNode(true); //克隆
				child_EN.id = "Firend_EN";
				mainFriendObj.appendChild(child_EN);

				child_JP = child_EN.cloneNode(true); //克隆
				child_JP.id = "Firend_JP";
				mainFriendObj.appendChild(child_JP);

				child_CN_SG = child_EN.cloneNode(true); //克隆
				child_CN_SG.id = "Firend_CN_SG";
				mainFriendObj.appendChild(child_CN_SG);

				child_CN_HANTd = child_EN.cloneNode(true); //克隆
				child_CN_HANTd.id = "Firend_CN_HANTd";
				mainFriendObj.appendChild(child_CN_HANTd);

				child_CN_HK = child_EN.cloneNode(true); //克隆
				child_CN_HK.id = "Firend_CN_HK";
				mainFriendObj.appendChild(child_CN_HK);

				child_CN_MO = child_EN.cloneNode(true); //克隆
				child_CN_MO.id = "Firend_CN_MO";
				mainFriendObj.appendChild(child_CN_MO);

				child_CN_TW = child_EN.cloneNode(true); //克隆
				child_CN_TW.id = "Firend_CN_TW";
				mainFriendObj.appendChild(child_CN_TW);

				//-------------------------------------------------

				var newGroupTitle = StateObj[0].cloneNode(true); //克隆
				newGroupTitle.style.display = ""; //去除隐藏样式
				newGroupTitle.innerText = "CN";
				child_CN.appendChild(newGroupTitle);

				newGroupTitle = newGroupTitle.cloneNode(true); //克隆
				newGroupTitle.innerText = "EN";
				child_EN.appendChild(newGroupTitle);

				newGroupTitle = newGroupTitle.cloneNode(true); //克隆
				newGroupTitle.innerText = "JP";
				child_JP.appendChild(newGroupTitle);

				newGroupTitle = newGroupTitle.cloneNode(true); //克隆
				newGroupTitle.innerText = "CN_SG";
				child_CN_SG.appendChild(newGroupTitle);

				newGroupTitle = newGroupTitle.cloneNode(true); //克隆
				newGroupTitle.innerText = "CN_HANTd";
				child_CN_HANTd.appendChild(newGroupTitle);

				newGroupTitle = newGroupTitle.cloneNode(true); //克隆
				newGroupTitle.innerText = "CN_HK";
				child_CN_HK.appendChild(newGroupTitle);

				newGroupTitle = newGroupTitle.cloneNode(true); //克隆
				newGroupTitle.innerText = "CN_MO";
				child_CN_MO.appendChild(newGroupTitle);

				newGroupTitle = newGroupTitle.cloneNode(true); //克隆
				newGroupTitle.innerText = "CN_TW";
				child_CN_TW.appendChild(newGroupTitle);

				//遍历所有节点,向盒子里添加节点
				for (let i = 0; i < jqobj.length; i++) {
					let cur = jqobj.get(i);
					let profileID = cur.getAttribute("data-steamid");
					//--------------------------------------------------------------------
					SpecialName = undefined;
					steamName = undefined;

					if (document.URL.indexOf("/friends") == -1) { //如果是在个人资料页面
						//获取备注
						var SpecialNameobj = document.getElementsByClassName("nickname"); //nickname
						SpecialName = undefined;
						if (SpecialNameobj != "undefined") {
							SpecialName = SpecialNameobj[0].innerText; //备注
						}
						//获取steam名称
						steamName = document.getElementsByClassName("actual_persona_name")[0].innerText; //steam名称
						name = steamName;
					} else //否则如果是好友界面
					{
						//获取名称,然后判断是备注还是steam名称
						var SpecialNameobj = cur.getElementsByClassName("friend_block_content");
						var nicknameObj = cur.getElementsByClassName("player_nickname_hint");
						SpecialName = undefined;

						if (SpecialNameobj.length > 0) //安全检查
						{
							if (nicknameObj.length > 0) //节点存在则是备注,不存在则是steam名称
							{
								//console.log("获取到的是备注");
								SpecialName = SpecialNameobj[0].innerText.slice(0, SpecialNameobj[0].innerText.indexOf("*")); //提取备注
								steamName = undefined; //就没有名称
								if (SpecialName.indexOf('{CN}') != -1 || SpecialName.indexOf('{CN-N}') != -1) { //检查是否设置了国籍标识
									child_CN.appendChild(SpecialNameobj[0].parentNode);
								} else if (SpecialName.indexOf('{EN}') != -1 || SpecialName.indexOf('{EN-N}') != -1) {
									child_EN.appendChild(SpecialNameobj[0].parentNode);
								} else if (SpecialName.indexOf('{JP}') != -1 || SpecialName.indexOf('{JP-N}') != -1) {
									child_JP.appendChild(SpecialNameobj[0].parentNode);
								} else if (SpecialName.indexOf('{CN-SG}') != -1 || SpecialName.indexOf('{CN-SG-N}') != -1) {
									child_CN_SG.appendChild(SpecialNameobj[0].parentNode);
								} else if (SpecialName.indexOf('{CN-HANT}') != -1 || SpecialName.indexOf('{CN-HANT-N}') != -1) {
									child_CN_HANT.appendChild(SpecialNameobj[0].parentNode);
								} else if (SpecialName.indexOf('{CN-HK}') != -1 || SpecialName.indexOf('{CN-HK-N}') != -1) {
									child_CN_HK.appendChild(SpecialNameobj[0].parentNode);
								} else if (SpecialName.indexOf('{CN-MO}') != -1 || SpecialName.indexOf('{CN-MO-N}') != -1) {
									child_CN_MO.appendChild(SpecialNameobj[0].parentNode);
								} else if (SpecialName.indexOf('{CN-TW}') != -1 || SpecialName.indexOf('{CN-TW-N}') != -1) {
									child_CN_TW.appendChild(SpecialNameobj[0].parentNode);
								} else {
									// jQuery("#log_body")[0].innerHTML +=
									// 	"<a style='color:#00ffd8;' target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID +
									// 	"\">" + '[' + (i + 1) + '/' + total + '] 已跳过, 没有设置国籍不能取消! ' + profileID + '  ' + SpecialName + "</a><br>";
									// continue;
								}
							} else if (nicknameObj.length == 0) {
								//console.log("获取到的是steam名称");
								// steamName = SpecialNameobj[0].innerText.slice(0, SpecialNameobj[0].innerText.indexOf("\n")); //提取steam名称
								// jQuery("#log_body")[0].innerHTML +=
								// 	"<a style='color:#00ffd8;' target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID +
								// 	"\">" + '[' + (i + 1) + '/' + total + '] 已跳过, 没有备注不能取消! ' + profileID + '  ' + steamName + "</a><br>";
								// continue;
							}
						}
					}
					//console.log("[Debug] name:", name);
				}
				GroupMode = 1;
			}

		});

		await jQuery("#OfflineTimeGroup").click(async function() {
			var SpecialName = undefined;
			var steamName = undefined;
			var name = undefined;
			var mode = 0;
			const total = jQuery("#search_results .selectable.offline").length; //选择的朋友总数
			if (total > 0) //选择的朋友总数
			{
				jQuery("#log_head, #log_body").html("");
				var jqobj = jQuery("#search_results .selectable.offline"); //选择离线的好友
				var ArrOfflineTime = [];

				if (GroupMode != 2) {
					var mainFriendObj;
					if (GroupMode == 1) { //节点已经被模式1处理过
						//备份和处理
						if (document.getElementById("search_results2") == null) { //没有被模式2处理过
							mainFriendObj = document.getElementById("search_results0"); //获取原节点
							var newCopyObj = mainFriendObj.cloneNode(true);
							var mainFriendObj1 = document.getElementById("search_results"); //获取之前模式的节点
							mainFriendObj1.style.display = "none"; //之前模式的节点隐藏
							mainFriendObj1.id = "search_results1"; //之前模式的节点
							mainFriendObj1.className = "profile_friends search_results1"; //之前模式的节点
							newCopyObj.style.display = ""; //克隆的原节点取消隐藏(显示)
							newCopyObj.id = "search_results"; //克隆的原节点
							newCopyObj.className = "profile_friends search_results"; //克隆的原节点
							mainFriendObj.parentNode.appendChild(newCopyObj); //再添加一个新的备份节点
						} else { //被模式2处理过
							var obj = document.getElementById("search_results2");
							var mainFriendObj1 = document.getElementById("search_results"); //获取之前模式的节点
							mainFriendObj = document.getElementById("search_results0"); //获取原节点
							mainFriendObj1.style.display = "none"; //之前模式的节点隐藏
							mainFriendObj1.id = "search_results1"; //之前模式的节点
							mainFriendObj1.className = "profile_friends search_results1"; //之前模式的节点
							obj.style.display = ""; //取消隐藏(显示)
							obj.id = "search_results"; //节点
							obj.className = "profile_friends search_results"; //节点
						}
					} else { //节点还没有被动过
						//备份和处理
						mainFriendObj = document.getElementById("search_results"); //获取原节点
						var newCopyObj = mainFriendObj.cloneNode(true);
						newCopyObj.style.display = "none"; //克隆的原节点隐藏
						newCopyObj.id = "search_results0"; //克隆的原节点
						newCopyObj.className = "profile_friends search_results0"; //克隆的原节点
						mainFriendObj.parentNode.appendChild(newCopyObj); //再添加一个新的备份节点


					}

					var StateObj = mainFriendObj.getElementsByClassName("state_block");
					for (let i = 0; i < StateObj.length; i++) {
						StateObj[i].style.display = "none"; //隐藏状态条
					}
					//创建新盒子和克隆分组节点
					console.log("开始分组...");
					child_Offline = document.createElement('div'); //创建
					child_Offline.id = "Firend_Offline";
					child_Offline.style.display = "flex";
					child_Offline.style.flex = "1 100%";
					child_Offline.style.flexFlow = "row wrap";
					child_Offline.style.margin = "8px 0px 0px 0px";
					// child_Offline.style.justifyContent = "space-start";
					mainFriendObj.appendChild(child_Offline);

					child_Online = child_Offline.cloneNode(true); //克隆
					child_Online.id = "Firend_Online";
					mainFriendObj.appendChild(child_Online);

					child_InGame = child_Offline.cloneNode(true); //克隆
					child_InGame.id = "Firend_InGame";
					mainFriendObj.appendChild(child_InGame);

					//-------------------------------------------------

					var newGroupTitle = StateObj[0].cloneNode(true); //克隆
					newGroupTitle.style.display = ""; //去除隐藏样式
					newGroupTitle.innerText = "Offline";
					child_Offline.appendChild(newGroupTitle);

					newGroupTitle = newGroupTitle.cloneNode(true); //克隆
					newGroupTitle.innerText = "Online";
					child_Online.appendChild(newGroupTitle);

					newGroupTitle = newGroupTitle.cloneNode(true); //克隆
					newGroupTitle.innerText = "InGame";
					child_InGame.appendChild(newGroupTitle);

					for (let i = 0; i < jqobj.length; i++) {
						let cur = jqobj.get(i);
						let profileID = cur.getAttribute("data-steamid");
						//--------------------------------------------------------------------
						SpecialName = undefined;
						steamName = undefined;

						if (document.URL.indexOf("/friends") == -1) { //如果是在个人资料页面
							//获取备注
							var SpecialNameobj = document.getElementsByClassName("nickname"); //nickname
							SpecialName = undefined;
							if (SpecialNameobj != "undefined") {
								SpecialName = SpecialNameobj[0].innerText; //备注
							}
							//获取steam名称
							steamName = document.getElementsByClassName("actual_persona_name")[0].innerText; //steam名称
							name = steamName;
						} else //否则如果是好友界面
						{
							//获取名称,然后判断是备注还是steam名称
							var SpecialNameobj = cur.getElementsByClassName("friend_block_content");
							var nicknameObj = cur.getElementsByClassName("player_nickname_hint");
							SpecialName = undefined;

							var OfflineTime = SpecialNameobj[0].getElementsByClassName("friend_last_online_text");
							var strOfflineTime = "";

							var nYear = "0",
								nMonth = "0",
								nDay = "0",
								nHours = "0",
								nMinutes = "0",
								nSeconds = "0";
							var strData = "";
							if (OfflineTime.length > 0) //找到了
							{
								strOfflineTime = OfflineTime[0].innerText.slice(5); //去掉‘上次在线’字符串
								var strOfflineTimeArr = strOfflineTime.split(' ');
								strOfflineTimeArr[strOfflineTimeArr.length - 1] = strOfflineTimeArr[strOfflineTimeArr.length - 1].slice(0,
									-1); //去掉最后的‘前’字符串
								//console.log("strOfflineTime",strOfflineTime,strOfflineTimeArr);
								for (let i = 0; i < strOfflineTimeArr.length; i += 2) {
									if (strOfflineTimeArr[i + 1] == "年")
										nYear = strOfflineTimeArr[i];
									else if (strOfflineTimeArr[i + 1] == "月")
										nMonth = strOfflineTimeArr[i];
									else if (strOfflineTimeArr[i + 1] == "天")
										nDay = strOfflineTimeArr[i];
									else if (strOfflineTimeArr[i + 1] == "小时")
										nHours = strOfflineTimeArr[i];
									else if (strOfflineTimeArr[i + 1] == "分钟")
										nMinutes = strOfflineTimeArr[i];
									else if (strOfflineTimeArr[i + 1] == "秒")
										nSeconds = strOfflineTimeArr[i];
								}
								strData = nYear + '/' + nMonth + '/' + nDay + ' ' + nHours + ':' + nMinutes + ':' + nSeconds;
								//console.info("strData",strData);

								var hzWeek = new Array("日", "一", "二", "三", "四", "五", "六", "日");

								function cweekday(wday) {
									return hzWeek[wday];
								}

								function calaDay() { //计算时间差: 一个是当前时间，一个是相差的时间，就都转为秒数进行相减，再还原时间
									var date = new Date();
									ddd = parseInt(nDay); //转数字后取对应负数
									//ttt = new Date(y, m - 1, d).getTime() + ddd * 24000 * 3600;
									ttt = date.getTime() + ~(ddd * 86400);
									theday = new Date();
									theday.setTime(ttt);
									//document.getElementById("result1").innerHTML = theday.getFullYear() + "年" + (1 + theday.getMonth()) + "月" + theday.getDate() + "日" + "星期" + cweekday(theday.getDay());
									return theday.getTime(); //获取对应的时间戳
								}

								function calbHMS() { //计算时间差: 一个是当前时间，一个是相差的时间，就都转为秒数进行相减，再还原时间
									var date = new Date();
									var date1 = new Date();
									var s = nHours * 3600 + nMinutes * 60 + nSeconds;
									// y2 = date.getYear();
									// m2 = date.getMonth();
									// d2 = date.getDay();
									date1.setTime(date.getTime() + ~s);
									// y3 = document.getElementById("SY3").value;
									// m3 = document.getElementById("SM3").value;
									// d3 = document.getElementById("SD3").value;
									// day2 = new Date(y2, m2 - 1, d2);
									// day3 = new Date(y3, m3 - 1, d3);
									//document.getElementById("result2").innerHTML = (day3 - day2) / 86400000;
									return date1.getTime();
								}

								var nS = 0;
								if (nDay > 0) {
									nS = calaDay()
									//console.log("calaDay(nDay):",nS);
								} else {
									nS = calbHMS()
									//console.log("calbHMS()",nS);
								}
								ArrOfflineTime.push([nS, i]);
							}


							//SpecialName = SpecialNameobj[0].innerText.slice(0, SpecialNameobj[0].innerText.indexOf("*")); //提取备注
							//创建离线区和在线区

							//遍历所有的好友,找到离线的好友,解析字符串,装入Date对象 //6个数字指定年、月、日、小时、分钟、秒(0)  //没有的就写0
							//获取毫秒数 dateObject.getTime()   或者用   Date.parse(datestring)
							// var d=new Date("5/05/11 1:10:0");
							// document.write("从 1970/01/01 至今已有：" + d.getTime() + " 毫秒。");
							// document.write("从 1970/01/01 至今已有：" + Date.parse("5/05/11 1:10:0") + " 毫秒。");

							//存储在二维数组里，一个是毫秒数，一个是数组下标
							//对秒数进行升序排序，然后取下标，对指定好友依次添加
						}
						//console.log("[Debug] name:", name);
					} //for

					//console.log(ArrOfflineTime);
					ArrOfflineTime.sort(function(a, b) {
						if (a[0] > b[0])
							return 1;
						if (a[0] < b[0])
							return -1;
						return 0;
					}); //对时间戳排序
					//console.log(ArrOfflineTime);

					//遍历二维数组，然后取下标，对指定好友依次添加
					for (let i = 0; i < ArrOfflineTime.length; i++) {
						child_Offline.appendChild(jqobj[ArrOfflineTime[i][1]]); //.getElementsByClassName("friend_block_content").parentNode
					}
					//将游戏中和在线的好友也添加到分组里
					var jqobj1 = jQuery("#search_results .selectable.online"); //选择在线的好友
					var jqobj2 = jQuery("#search_results .selectable.in-game"); //选择游戏中的好友
					var jqobj3 = jQuery("#search_results .selectable.golden"); //选择金色的好友
					for (let i = 0; i < jqobj3.length; i++) {
						var strGame = jqobj3[i].getElementsByClassName("friend_small_text")[0].innerText;
						var game = strGame.replace(/^\s+|\s+$/g, ""); //去除两边的空格
						//console.log("strGame");
						if (game == "") {
							//console.log("在线");
							child_Online.appendChild(jqobj3[i]);
						} else {
							//console.log(game);
							child_InGame.appendChild(jqobj3[i]);
						}
					}
					for (let i = 0; i < jqobj1.length; i++) {
						child_Online.appendChild(jqobj1[i]);
					}
					for (let i = 0; i < jqobj2.length; i++) {
						child_InGame.appendChild(jqobj2[i]);
					}
					GroupMode = 2;
				}
			}
		});

	}

}

Main();
