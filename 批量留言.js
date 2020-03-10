// ==UserScript==
// @name         Steam batch Leave comments(Steam��������,���ѹ���ű�)
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

var delay = 4; // �����������ʱ����,��λ��
var strNoOperate = "(������)"; //������Ĳ����Եı�ʶ��: �������Ҫ����,�����ڱ�ע�������������Եı�ʶ��

function JSON_processing_parsing_JsObj(jsonText) //JSON����������js����
{
	var JSON_jsObj;
	if (jsonText == "")
		return;

	//console.log("����������:");
	//console.log(jsonText);
	JSON_jsObj = JSON.parse(jsonText);
	console.log("����������:");
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
			console.log("���ñ�עʧ����!");
		} else {
			console.log("�ɹ����ñ�ע��");
		}
	}).fail(function() {
		console.log("�޷����ñ�ע��");
	}).always(function() {
		//console.log("��ǰ������ " + (i + 1) + "��, �ܼ� " + total + " ������.");
	});
}

function countRgbColor(r,g,b) //����RGB������ɫ
{
	var color;
	//var color = '#' + to2string(r) +  'ffff';
	//console.log(color);
	//return color;
	while(true)
	{
		switch(RGBindex)
		{
			case 0: //��
				if(RGBr==0 & RGBg==0 & RGBb==0)
				{
					RGBr = 0xFF; //��
					color = '#' + to2string(RGBr) +  to2string(RGBg)+  to2string(RGBb);
					//console.log("color:" + color);
					return color;
				}
				else
				{
					RGBindex = 1;
					continue; //���¿�ʼ
				}
				break;
			case 1: //��->��
				if(RGBg!=0xFF)
				{
					RGBg+=3; //��->��
					color = '#' + to2string(RGBr) +  to2string(RGBg)+  to2string(RGBb);
					//console.log("color:" + color);
					return color;
				}
				else
				{
					RGBindex = 2;
					continue; //���¿�ʼ
				}
				break;
			case 2: //��->��
				if(RGBr!=0x00)  //��
				{
					RGBr-=3; //��->��
					color = '#' + to2string(RGBr) +  to2string(RGBg)+  to2string(RGBb);
					//console.log("color:" + color);
					return color;
				}
				else
				{
					RGBindex = 3;
					continue; //���¿�ʼ
				}
				break;
			case 3: //��->��(����)
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
					continue; //���¿�ʼ
				}
				break;
			case 4: //��(����)->��(����)
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
					continue; //���¿�ʼ
				}
				break;
			case 5: //��(����)->��
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
					continue; //���¿�ʼ
				}
				break;
			case 6: //��->��
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
				else //����RGB
				{
					RGBindex = 1;
					continue; //���¿�ʼ
				}

				break;
			case 7:
				console.log("end!!!");
				break;
			default:
				console.log("[countRgbColor()-switch(RGBindex):] δ�����쳣!")
				break;
		}
	}
	//�� #FF0000
	//�� #FFFF00
	//�� #00FF00
	//�� #00BFFF #0000FF
	//�� #800080

}
// function setRgb() //����RGB������ɫ
// {
// 	var loginBox = document.getElementById("LoginBaseBox");
// 	loginBox.style.background = countRgbColor(0,0,0);
// }
// var tiSysCallback_runRGB = setInterval(function(){runRGB();}, 22); //[������ʱ��] ÿ��ص����� // 11 16 22 30

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

function loadjscssFile(filePath, filetype) //��̬����һ��js/css�ļ�
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
		document.getElementsByTagName("head")[0].appendChild(fileref); //��Ԫ������µ��ӽڵ㣬��Ϊ���һ���ӽڵ�
	}
}

var bWait = false; //�ȴ���־
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
//��������
var auto = "auto"; //�Զ����
var zhc = "zh-CN"; //���ļ���
var zht = "zh-TW"; //���ķ���
var en = "en"; //Ӣ��
var jp = "ja"; //����

var waitStatus = true; //�ȴ�״̬
var waitStatus_cn = true; //�ȴ�״̬
var returnData;
var returnData_cn;
async function GoogleTranslateRequest(origLanguage, newLanguage, strText) {
	waitStatus = true;

	var _tkk = "439786.2762026697";
	var _tk = tk(strText, _tkk);
	//console.log("_tk:",_tk);

	//��Ҫƴ�ӵ�url����
	var baseURL = "https://translate.google.cn/translate_a/single?";
	var client = "client=" + "webapp";
	var sl = "&sl=" + origLanguage; //�������ԭʼ����      //Ĭ��Ϊauto,���Զ��������
	var tl = "&tl=" + newLanguage; //��Ҫ�����ʲô����    //Ĭ��Ϊzh-CN,��Ĭ�Ϸ���Ϊ����
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
				console.log('����ɹ�!');
				var JSON_jsObj = JSON_processing_parsing_JsObj(response.responseText);
				//����[0][0]����Ϳ���ȡ�÷������ı�,ԭʼ����,ԭʼ���ݵ�ƴ��
				//[2]�Ǽ���������
				//����[5]����ȡ�����ַ���,ԭʼ���ݺ�ԭʼ���ݵĳ���
				//����[8]���Եõ�ԭʼ���Ժͷ�������
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
						retData += JSON_jsObj[0][j][0]; //���ÿһ�䷭��
					}
				}
				returnData = retData; //�洢����
				//console.log('�ȸ跭��:',retData);
				waitStatus = false; //���ȴ�

				//console.log(response);
				//console.log(response.responseText);
				//if(response.responseText.indexOf('[[["') == 0) //�Ƿ���ָ�������ݸ�ʽ
				//{
				//	var retData = response.responseText.slice(4,response.responseText.indexOf('","',4)); //��ȡ�������ı�
				//	returnData = retData; //�洢����
				//	//console.log('�ȸ跭��:',retData);
				//	waitStatus = false; //���ȴ�
				//}
			} else {
				console.log('����ʧ��!');
				//console.log(response);
				//console.log(response.responseText);
			}
		},
		onerror: function(err) {
			console.log('�������!', err);
		}
	});

	while (waitStatus) //ǿ�Ƶȴ��첽����ִ����Ϻ���ִ��
	{
		console.log("wait...");
		await sleep(100); //�ӳ�0.1��
	}
	return returnData;
	// jQuery.ajax({
	// 	url: URL,
	// 	type: "GET",
	// 	dataType: "jsonp", //ָ�����������ص���������
	// 	jsonp: "callback", //Jquery������֤����������
	// 	processData: false,
	// 	success: function (data) {
	// 		//var result = JSON.stringify(data); //json����ת���ַ���
	// 		console.log("GET�ɹ�!",data);
	// 	},
	// 	error: function(XMLHttpRequest, textStatus, errorThrown) {
	// 	alert(XMLHttpRequest.status);
	// 	alert(XMLHttpRequest.readyState);
	// 	alert(textStatus);
	// 	}
	// });



	// jQuery.get(URL,function(response,status,xhr){
	// 	if (response.success === false) {

	// 		console.log("GETʧ����!",response);
	// 	} else {

	// 		console.log("GET�ɹ�!",response);
	// 	}
	// },"json");


	// jQuery.post(URL, {
	// 	comment: newMgs,
	// 	count: 6,
	// 	sessionid: g_sessionID
	// }, function(response) {
	// 	if (response.success === false) {
	// 		console.log("����ʧ����!");
	// 	} else {
	// 		console.log("�ɹ�����������");
	// 	}
	// }).fail(function() {
	// 	console.log("�޷�����������");
	// }).always(function() {
	// 	console.log("��ǰ������ " + (i + 1) + "��, �ܼ� " + total + " ������.");
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
			"&submit=" + encodeURI("��ʼת�� (Ctrl + Enter)"),
		headers: {
			"accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
			"Content-Type": "application/x-www-form-urlencoded", //�ǳ���Ҫ
			"User-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36",
		},
		onload: function(response) {
			if (response.status === 200) {
				console.log('����ɹ�!');
				var findStr = '<label for="response">ת�����: </label><br /><textarea id="response" rows="15" cols="150">';
				var retData = response.responseText.slice(response.responseText.lastIndexOf(findStr) + findStr.length);
				returnData_cn = retData; //�洢����
				//console.log('�ȸ跭��:',retData);
				waitStatus_cn = false; //���ȴ�
			} else {
				console.log('����ʧ��!', response);
				//console.log(response);
				//console.log(response.responseText);
			}
		},
		onerror: function(err) {
			console.log('�������!', err);
		}
	});

	while (waitStatus_cn) //ǿ�Ƶȴ��첽����ִ����Ϻ���ִ��
	{
		console.log("wait...");
		await sleep(100); //�ӳ�0.1��
	}
	return returnData_cn;
}

//------------------------------------------------------------------------------------------------------------------------------------------
(function($) {
	$.fn.ySelect = function(options) {
		var defaultOptions = {
			placeholder: '��ѡ��',
			numDisplayed: 4,
			overflowText: '{n} selected',
			searchText: '����',
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
				inObj.value += ':' + emojiObjArrs[i].getAttribute('data-emoticon') + ':'; //��ӱ���
			}
		}
		console.log("�����޸����!");
	}
}

function dvWidthFix() {
	$("subpage_container").style.width = "calc(100% - 280px)";
}

// function wordCount(data) { //����ͳ��,����ַ����ֽ�������1000�����������ʾ (��������Ӣ������1���ֽ�,����3�ֽ�)
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

// function inBoxShrinkage(type) //���������
// {
// 	var commentText = document.getElementById("comment_textarea");

// 	if (type == true) //����
// 	{
// 		commentText.removeEventListener('propertychange', change, false);
// 		commentText.removeEventListener('input', change, false);
// 		commentText.removeEventListener('focus', change, false);
// 		commentText.scrollTop = 0; //��λ�����Ϸ�
// 		document.body.scrollTop = 0;
// 		commentText.style.height = "28px";
// 	} else if (type == false) //չ��
// 	{
// 		autoTextarea(commentText); // ����
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
// 		obj.innerHTML = "��ǰ�ַ��ֽ���: <span id='strInBytes_Text'>" + numText + "</span>/999";
// 		//console.log(numText);

// 		if (wordCount(commentText.value) >= 1000) {
// 			document.getElementById("strInBytes_Text").style.color = "#FF0000";
// 			commentText.style.background = "#7b3863";
// 			jQuery("#log_head, #log_body").html("");
// 			jQuery("#log_head").html("<br><b style='color:#2CD8D6;'>����������! �뱣����1000�ַ�����. " + "��ǰ����:" + numText + "<b>");
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
// 		scrollTop = document.body.scrollTop || document.documentElement.scrollTop; //��λ�����

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
		alert("���ڴ򿪵�ҳ����,��Console(����̨)ճ�����д���!");
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
		); /* ѡ����ı� */
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
		); /* ѡ����ı� */

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
						iArr = i; /*��¼�ɽڵ���±�*/\
						console.log('��¼�ɽڵ���±�','iArr',iArr);\
						break;\
					}\
				}\
				if(index == -1)\
				{\
					comment_textareaHeight.push(id + ':0'); /*û���ҵ������µĽڵ�,�����*/\
					iArr = comment_textareaHeight.length - 1 ; /*�����½ڵ���±�*/\
					console.log('û���ҵ������µĽڵ�,�����','comment_textareaHeight',comment_textareaHeight,'iArr',iArr);\
				}\
				var nHeight = parseFloat(comment_textareaHeight[iArr].slice(comment_textareaHeight[iArr].lastIndexOf(':')+1)); /*�����ַ�����ȡ�±�*/\
				if(nHeight==0)/*��һ��,û��ָ������ʽ*/\
				{\
					nHeight = document.getElementById('comment_textarea').scrollHeight + 'px'; /*����ÿ���ڵ�ʹ�õ�ǰ�߶�*/\
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
						obj.innerHTML =  \"��ǰ�ַ��ֽ���: <span id='strInBytes_Text'>\" + numText + '</span>/999';\
						if (wordCount(commentText.value) >= 1000) {\
							document.getElementById('strInBytes_Text').style.color = '#FF0000';\
							commentText.style.background = '#7b3863';\
							jQuery('#log_head, #log_body').html('');\
							jQuery('#log_head').html(\"<br><b style='color:#2CD8D6;'>����������! �뱣����1000�ַ�����. \" + '��ǰ����:' + numText + '<b>');\
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
						scrollTop = document.body.scrollTop || document.documentElement.scrollTop; /*��λ�����*/\
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
							comment_textareaHeight[iIndex] = comment_textareaHeight[iIndex].replace(/:(.*)/,\"$':\");/*ɾ��:�ͺ������е��ַ��������:*/\
							/*console.log('3 comment_textareaHeight[iIndex]',comment_textareaHeight[iIndex]);*/\
							comment_textareaHeight[iIndex] += newStr;/*�洢*/\
							/*console.log('�洢','comment_textareaHeight',comment_textareaHeight);*/\
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
						<textarea class="commentthread_textarea" id="comment_textarea" onfocus="this.focus();this.select();inBoxShrinkage(\'comment_textarea\',false);" onClick="" onblur="inBoxShrinkage(\'comment_textarea\',true);" placeholder="�������" style="overflow: hidden; height: 28px;"></textarea>\
					</div>\
					<div id="strInBytes" style="color: #32CD32;">��ǰ�ַ��ֽ���: <span id="strInBytes_Text">0</span>/999</div>\
					<div id="translationOptions" style="color:#fff;">\
											<span>��ǰ����: \
												<select id="origLanguageSelectBox" style="padding: 4px 12px 4px 8px;font-size:12px;outline:0;border: 1px solid #34DEFF;background-color:transparent;color: #66ccff;">\
													<option name="auto" value="auto" style="color:#fff;background-color: #3E9AC6;">�Զ����</option>\
													<option name="zhc" value="zh-CN" style="color:#fff;background-color: #3E9AC6;">���ļ���</option>\
													<option name="en" value="en" style="color:#fff;background-color: #3E9AC6;">Ӣ��</option>\
													<option name="jp" value="ja" style="color:#fff;background-color: #3E9AC6;">����</option>\
												</select>\
											</span>\
											<span style="margin-left: 5px;">Ŀ������: \
												<select id="selectBoxID" class="selectBox" multiple="multiple">\
													<option value="en">Ӣ��</option>\
													<option value="ja">����</option>\
													<option value="zh-CN">���ļ���</option>\
													<option value="zh-sg">���¼���[zh-sg]</option>\
													<option value="zh-hant">���w����[zh-hant]</option>\
													<option value="zh-hk">���w����(���)[zh-hk]</option>\
													<option value="zh-mo">���w����(����)[zh-mo]</option>\
													<option value="zh-tw">���w����(̨��)[zh-tw]</option>\
												</select>\
											</span>\
											<span style="margin-left: 5px;vertical-align: middle;">\
												<button id="translationText">����</button>\
											</apsn>\
										</div>\
					<div class="commentthread_entry_submitlink" style="">\
						<span class="isName" style="display: block;text-align: left;">\
							<span style="font-size:14px;line-height: 20px;color: #67c1f5 !important;">�Ƿ�Ϊ������ӳƺ� (�������û�б�ע��ʹ��steam����)</span>\
							<input class="nameAddType" id="select_islName_checkbox" name="nameAddType" type="radio" style="vertical-align: middle;margin:2px;">\
						</span>\
						<span class="isSpecialName" style="display: block;text-align: left;">\
							<span style="font-size:14px;line-height: 20px;color: #67c1f5 !important;">�Ƿ�Ϊ������ӳƺ� (������������б�ע��ʹ��,������ӳƺ�)</span>\
							<input class="nameAddType" id="select_isSpecialName_checkbox" name="nameAddType"  type="radio" style="vertical-align: middle;margin:2px;">\
						</span>\
						<div style="text-align: left;margin: 5px 0px;">\
						<span style="margin-left: 5px;vertical-align: middle;">\
							<span style="color: #67c1f5;">��ѡ��Ҫ���õĹ���:</span>\
							<select id="nationalitySelectBox" style="padding: 4px 12px 4px 8px;font-size:12px;outline:0;border: 1px solid #34DEFF;background-color:transparent;color: #66ccff;">\
								<option name="CN" value="CN" style="color:#fff;background-color: #3E9AC6;">��������</option>\
								<option name="EN" value="EN" style="color:#fff;background-color: #3E9AC6;">Ӣ��</option>\
								<option name="JP" value="JP" style="color:#fff;background-color: #3E9AC6;">����</option>\
								<option name="CN-SG" value="CN-SG" style="color:#fff;background-color: #3E9AC6;">���¼���(��������,�¼���)[zh-sg]</option>\
								<option name="CN-HANT" value="CN-HANT" style="color:#fff;background-color: #3E9AC6;">���w����[zh-hant]</option>\
								<option name="CN-HK" value="CN-HK" style="color:#fff;background-color: #3E9AC6;">���w����(���)[zh-hk]</option>\
								<option name="CN-MO" value="CN-MO" style="color:#fff;background-color: #3E9AC6;">���w����(����)[zh-mo]</option>\
								<option name="CN-TW" value="CN-TW" style="color:#fff;background-color: #3E9AC6;">���w����(̨��)[zh-tw]</option>\
							</select>\
							<button id="setNationality">Ϊѡ��ĺ������ù�����ʶ</button>\
						</apsn>\
						<span style="margin-left: 5px;vertical-align: top;">\
							<button id="unsetNationality">Ϊѡ��ĺ���ȡ��������ʶ</button>\
						</apsn>\
						<br />\
						<span style="margin-left: 5px;vertical-align: top;">\
							<button id="NationalityGroup">���������и�������</button>\
						</apsn>\
						<span style="margin-left: 5px;vertical-align: top;">\
							<button id="NationalitySortGroup">�����������������</button>\
						</apsn>\
						<span style="margin-left: 5px;vertical-align: top;">\
							<button id="OfflineTimeGroup">������ʱ������������</button>\
						</apsn>\
						</div>\
						<a class="btn_grey_black btn_small_thin" href="javascript:CCommentThread.FormattingHelpPopup( \'Profile\' );">\
							<span>��ʽ������</span>\
						</a>\
						<span class="emoticon_container">\
							<span class="emoticon_button small" id="emoticonbtn"></span>\
						</span>\
						<span class="btn_green_white_innerfade btn_small" id="comment_submit">\
							<span>�������۸�ѡ��ĺ���</span>\
						</span>\
						<span class="btn_green_white_innerfade btn_small" id="comment_submit_special">\
							<span>���ݹ����������۸�ѡ��ĺ���</span>\
						</span>\
					</div>\
				</div>\
				<div id="log">\
					<span id="log_head"></span>\
					<span id="log_body" style="display:inline-block;width:100%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; /*����������...����*/"></span>\
				</div>'
		);

		jQuery('.selectBox').ySelect({
			placeholder: '����ѡ��Ҫ����Ϊ������',
			searchText: '����~����������~',
			showSearch: true,
			numDisplayed: 4,
			overflowText: '��ѡ�� {n}��',
			isCheck: false
		});

		jQuery("#translationText").click(async function() {
			//��ȡѡ�������
			var selectLanguage = jQuery("#selectBoxID").ySelectedTexts(",");
			var selectLanguageArr = selectLanguage.split(',');
			if (selectLanguageArr.length == 1 && selectLanguageArr[0] == "")
				return;
			console.log("selectLanguageArr", selectLanguageArr);
			//��ȡ���������
			var inString = document.getElementById("comment_textarea").value;
			if (inString == "")
				return;
			console.log("inString", inString);
			//��ȡԭʼ����ѡ��
			var options = document.getElementById('origLanguageSelectBox'); //��ȡѡ�е���Ŀ
			var optionsValue = options[options.selectedIndex].value;
			console.log("optionsValue", optionsValue);
			//����ѡ������Բ����������,Ȼ���������ֵ
			for (let i = 0; i < selectLanguageArr.length; i++) {
				var _id;
				var newStrText;
				switch (selectLanguageArr[i]) {
					case '���ļ���':
						_id = "_zhc";
						newStrText = await GoogleTranslateRequest(optionsValue, zhc, inString);
						console.log("����Ϊ���ļ���:", newStrText);

						if (document.getElementById('comment_textarea_zhc') == null) {
							jQuery("#translationOptions").after(
								'\
									<div class="commentthread_entry_quotebox">\
										<span>' + '����Ϊ���ļ���' +
								'</span>\
										<textarea class="commentthread_textarea" id="comment_textarea' + _id +
								'" onfocus="this.focus();this.select();inBoxShrinkage(\'comment_textarea_zhc\',false);" onClick="" onblur="inBoxShrinkage(\'comment_textarea_zhc\',true);" placeholder="�������(���ļ���)" style="overflow: hidden; height: 28px;"></textarea>\
									</div>'
							);
						}
						document.getElementById('comment_textarea_zhc').value = newStrText;
						change(null, 'comment_textarea_zhc'); //ͳ�Ʒ��������ֳ���
						break;
					case 'Ӣ��':
						_id = "_en";
						newStrText = await GoogleTranslateRequest(optionsValue, en, inString);
						console.log("����ΪӢ��:", newStrText);

						if (document.getElementById('comment_textarea_en') == null) {
							jQuery("#translationOptions").after(
								'\
									<div class="commentthread_entry_quotebox">\
										<span>' + '����ΪӢ��' +
								'</span>\
										<textarea class="commentthread_textarea" id="comment_textarea' + _id +
								'" onfocus="this.focus();this.select();inBoxShrinkage(\'comment_textarea_en\',false);" onClick="" onblur="inBoxShrinkage(\'comment_textarea_en\',true);" placeholder="�������(Ӣ��)" style="overflow: hidden; height: 28px;"></textarea>\
									</div>'
							);
						}
						document.getElementById('comment_textarea_en').value = newStrText;
						change(null, 'comment_textarea_en'); //ͳ�Ʒ��������ֳ���
						break;
					case '����':
						_id = "_jp";
						newStrText = await GoogleTranslateRequest(optionsValue, jp, inString);
						console.log("����Ϊ����:", newStrText);

						if (document.getElementById('comment_textarea_jp') == null) {
							jQuery("#translationOptions").after(
								'\
									<div class="commentthread_entry_quotebox">\
										<span>' + '����Ϊ����' +
								'</span>\
										<textarea class="commentthread_textarea" id="comment_textarea' + _id +
								'" onfocus="this.focus();this.select();inBoxShrinkage(\'comment_textarea_jp\',false);" onClick="" onblur="inBoxShrinkage(\'comment_textarea_jp\',true);" placeholder="�������(����)" style="overflow: hidden; height: 28px;"></textarea>\
									</div>'
							);
						}
						document.getElementById('comment_textarea_jp').value = newStrText;
						change(null, 'comment_textarea_jp'); //ͳ�Ʒ��������ֳ���
						break;
					case "���¼���[zh-sg]":
						_id = "_zh_sg";
						newStrText = await CNTranslateRequest('zh-sg', inString);
						console.log("����Ϊ���¼���[zh-sg]:", newStrText);

						if (document.getElementById('comment_textarea_zh_sg') == null) {
							jQuery("#translationOptions").after(
								'\
									<div class="commentthread_entry_quotebox">\
										<span>' + '����Ϊ���¼���' +
								'</span>\
										<textarea class="commentthread_textarea" id="comment_textarea' + _id +
								'" onfocus="this.focus();this.select();inBoxShrinkage(\'comment_textarea_zh_sg\',false);" onClick="" onblur="inBoxShrinkage(\'comment_textarea_zh_sg\',true);" placeholder="�������(���¼���)" style="overflow: hidden; height: 28px;"></textarea>\
									</div>'
							);
						}
						document.getElementById('comment_textarea_zh_sg').value = newStrText;
						change(null, 'comment_textarea_zh_sg'); //ͳ�Ʒ��������ֳ���
						break;
					case "���w����[zh-hant]":
						_id = "_zh_hant";
						newStrText = await CNTranslateRequest('zh-hant', inString);
						console.log("����Ϊ���w����[zh-hant]:", newStrText);

						if (document.getElementById('comment_textarea_zh_hant') == null) {
							jQuery("#translationOptions").after(
								'\
									<div class="commentthread_entry_quotebox">\
										<span>' + '����Ϊ���w����' +
								'</span>\
										<textarea class="commentthread_textarea" id="comment_textarea' + _id +
								'" onfocus="this.focus();this.select();inBoxShrinkage(\'comment_textarea_zh_hant\',false);" onClick="" onblur="inBoxShrinkage(\'comment_textarea_zh_hant\',true);" placeholder="�������(���w����)" style="overflow: hidden; height: 28px;"></textarea>\
									</div>'
							);
						}
						document.getElementById('comment_textarea_zh_hant').value = newStrText;
						change(null, 'comment_textarea_zh_hant'); //ͳ�Ʒ��������ֳ���
						break;
					case "���w����(���)[zh-hk]":
						_id = "_zh_hk";
						newStrText = await CNTranslateRequest('zh-hk', inString);
						console.log("����Ϊ���w����(���)[zh-hk]:", newStrText);

						if (document.getElementById('comment_textarea_zh_hk') == null) {
							jQuery("#translationOptions").after(
								'\
									<div class="commentthread_entry_quotebox">\
										<span>' + '����Ϊ���w����(���)' +
								'</span>\
										<textarea class="commentthread_textarea" id="comment_textarea' + _id +
								'" onfocus="this.focus();this.select();inBoxShrinkage(\'comment_textarea_zh_hk\',false);" onClick="" onblur="inBoxShrinkage(\'comment_textarea_zh_hk\',true);" placeholder="�������(���w����(���))" style="overflow: hidden; height: 28px;"></textarea>\
									</div>'
							);
						}
						document.getElementById('comment_textarea_zh_hk').value = newStrText;
						change(null, 'comment_textarea_zh_hk'); //ͳ�Ʒ��������ֳ���
						break;
					case "���w����(����)[zh-mo]":
						_id = "_zh_mo";
						newStrText = await CNTranslateRequest('zh-mo', inString);
						console.log("����Ϊ���w����(���)[zh-hk]:", newStrText);

						if (document.getElementById('comment_textarea_zh_mo') == null) {
							jQuery("#translationOptions").after(
								'\
									<div class="commentthread_entry_quotebox">\
										<span>' + '����Ϊ���w����(����)' +
								'</span>\
										<textarea class="commentthread_textarea" id="comment_textarea' + _id +
								'" onfocus="this.focus();this.select();inBoxShrinkage(\'comment_textarea_zh_mo\',false);" onClick="" onblur="inBoxShrinkage(\'comment_textarea_zh_mo\',true);" placeholder="�������(���w����(����))" style="overflow: hidden; height: 28px;"></textarea>\
									</div>'
							);
						}
						document.getElementById('comment_textarea_zh_mo').value = newStrText;
						change(null, 'comment_textarea_zh_mo'); //ͳ�Ʒ��������ֳ���
						break;
					case "���w����(̨��)[zh-tw]":
						_id = "_zh_tw";
						newStrText = await CNTranslateRequest('zh-tw', inString);
						console.log("����Ϊ�w����(̨��)[zh-tw]:", newStrText);

						if (document.getElementById('comment_textarea_zh_tw') == null) {
							jQuery("#translationOptions").after(
								'\
									<div class="commentthread_entry_quotebox">\
										<span>' + '����Ϊ���w����(̨��)' +
								'</span>\
										<textarea class="commentthread_textarea" id="comment_textarea' + _id +
								'" onfocus="this.focus();this.select();inBoxShrinkage(\'comment_textarea_zh_tw\',false);" onClick="" onblur="inBoxShrinkage(\'comment_textarea_zh_tw\',true);" placeholder="�������(���w����(̨��))" style="overflow: hidden; height: 28px;"></textarea>\
									</div>'
							);
						}
						document.getElementById('comment_textarea_zh_tw').value = newStrText;
						change(null, 'comment_textarea_zh_tw'); //ͳ�Ʒ��������ֳ���
						break;
					default:
						break;
				}




			}

		});

		jQuery("#setNationality").click(async function() {
			//��ȡָ���Ĺ�����ʶ
			var options = document.getElementById('nationalitySelectBox'); //��ȡѡ�е���Ŀ
			var optionsValue = options[options.selectedIndex].value;
			console.log("optionsValue", optionsValue);
			var strNationality = '{' + optionsValue + '}'; //��Ϲ�����ʶ
			var strSpecialNationality = '{' + optionsValue + '-N}'; //��ϸ��������ʶ
			//��������ѡ��ĺ���,
			//���Ѿ������˱�ע�ĺ���,��ӹ�����ʶ;
			//��û�����ñ�ע�ĺ���,��Ӹ��������ʶ(�˹�����ʶ��ԭ������ʶ���ܷ����ض����Ե�����,
			//�������ѡ�����û�б�ע����ӳƺ�,�����ޱ�ע����; ���Һ��ѻ��������ʶ; �ڷ�����Ҳ��ԭ������ʶ���в�ͬ)
			//ע��: ������ʶ���ᱻ��Ϊ�ƺ�֮���,ֻ��Ϊ��ʶ; Ϊ�˷���洢����,���Ի�����ڱ�ע��

			var SpecialName = undefined;
			var steamName = undefined;
			var name = undefined;
			var mode = 0;
			const total = jQuery("#search_results .selected").length; //ѡ�����������
			if (total > 0) //ѡ�����������
			{
				jQuery("#log_head, #log_body").html("");
				var jqobj = jQuery("#search_results .selected");

				for (let i = 0; i < jqobj.length; i++) {
					let cur = jqobj.get(i);
					let profileID = cur.getAttribute("data-steamid");
					//--------------------------------------------------------------------
					SpecialName = undefined;
					steamName = undefined;

					if (document.URL.indexOf("/friends") == -1) { //������ڸ�������ҳ��
						//��ȡ��ע
						var SpecialNameobj = document.getElementsByClassName("nickname"); //nickname
						SpecialName = undefined;
						if (SpecialNameobj != "undefined") {
							SpecialName = SpecialNameobj[0].innerText; //��ע
						}
						//��ȡsteam����
						steamName = document.getElementsByClassName("actual_persona_name")[0].innerText; //steam����
						name = steamName;
					} else //��������Ǻ��ѽ���
					{
						//��ȡ����,Ȼ���ж��Ǳ�ע����steam����
						var SpecialNameobj = cur.getElementsByClassName("friend_block_content");
						var nicknameObj = cur.getElementsByClassName("player_nickname_hint");
						SpecialName = undefined;


						if (SpecialNameobj.length > 0) //��ȫ���
						{
							if (nicknameObj.length > 0) //�ڵ�������Ǳ�ע,����������steam����
							{
								console.log("��ȡ�����Ǳ�ע");
								SpecialName = SpecialNameobj[0].innerText.slice(0, SpecialNameobj[0].innerText.indexOf("*")); //��ȡ��ע
								steamName = undefined; //��û������
								if (SpecialName.indexOf('{CN}') != -1 || SpecialName.indexOf('{CN-N}') != -1 ||
									SpecialName.indexOf('{EN}') != -1 || SpecialName.indexOf('{EN-N}') != -1 ||
									SpecialName.indexOf('{JP}') != -1 || SpecialName.indexOf('{JP-N}') != -1 ||
									SpecialName.indexOf('{CN-SG}') != -1 || SpecialName.indexOf('{CN-SG-N}') != -1 ||
									SpecialName.indexOf('{CN-HANT}') != -1 || SpecialName.indexOf('{CN-HANT-N}') != -1 ||
									SpecialName.indexOf('{CN-HK}') != -1 || SpecialName.indexOf('{CN-HK-N}') != -1 ||
									SpecialName.indexOf('{CN-MO}') != -1 || SpecialName.indexOf('{CN-MO-N}') != -1 ||
									SpecialName.indexOf('{CN-TW}') != -1 || SpecialName.indexOf('{CN-TW-N}') != -1
								) //����Ƿ������˹�����ʶ
								{
									if (SpecialName.indexOf('{' + optionsValue + '}') != -1 || SpecialName.indexOf('{' + optionsValue + '-N}') !=
										-1) //�Ƿ�������õĹ�����ʶ��ͬ
									{
										jQuery("#log_body")[0].innerHTML +=
											"<a style='color:#00ffd8;' target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID +
											"\">" + '[' + (i + 1) + '/' + total + '] ������, û�����ñ�ע! ' + profileID + '  ' + SpecialName + "</a><br>";
										continue;
									} else //�������ù�����ʶ
									{
										if (SpecialName.indexOf('-N}') != -1) {
											mode = 1;
										}
										SpecialName = SpecialName.slice(SpecialName.indexOf('}') + 1); //ȥ��������ʶ
									}
								}
								if (mode == 0) {
									name = strNationality + SpecialName; //��ϳ�Ϊ�µ�����  ������ʶ
								} else if (mode == 1) {
									name = strSpecialNationality + SpecialName; //��ϳ�Ϊ�µ�����  ���������ʶ
									mode = 0;
								}


							} else if (nicknameObj.length == 0) {
								console.log("��ȡ������steam����");
								SpecialName = undefined; //��û�б�ע
								steamName = SpecialNameobj[0].innerText.slice(0, SpecialNameobj[0].innerText.indexOf("\n")); //��ȡsteam����
								name = strSpecialNationality + steamName; //��ϳ�Ϊ�µ�����  ���������ʶ
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
									"\">" + '[' + (i + 1) + '/' + total + '] ���ñ�עʧ����! ' + profileID + '  ' + name +
									'&nbsp;&nbsp;&nbsp;&nbsp;' + response.error + "</a><br>";
							} else {
								jQuery("#log_body")[0].innerHTML +=
									'[' + (i + 1) + '/' + total + '] ' +
									"�ɹ����ñ�ע�� <a target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID + "\">" +
									profileID + '  ' + name + "</a>" +
									"<a style='color:#FB7299;' target='_blank' href=\"http://steamcommunity.com/profiles/" +
									profileID + "\">" + "</a><br>";
							}
						}).fail(function() {
							jQuery("#log_body")[0].innerHTML +=
								'[' + (i + 1) + '/' + total + '] ' +
								"<span style='color:#DA2626;'>�޷����ñ�ע�� <a style='color:#DA2626;' target='_blank' href=\"http://steamcommunity.com/profiles/" +
								profileID + "\">" +
								profileID + '  ' + name + "</a></span><br>";
						}).always(function() {
							jQuery("#log_head").html("<br><b>��ǰ������ " + (i + 1) + "��, �ܼ� " + total + " ������.<b>");
						});

					})(i, profileID);
					await sleep(100);
					//console.log(cur)
				}
				window.location.reload(true); //ǿ�ƴӷ��������¼��ص�ǰҳ��
			}

		});

		jQuery("#NationalityGroup").click(async function() {
			//1.�������к���,��Բ�ͬ����������ɫ
			//2.�Ժ��ѽ�������

			var SpecialName = undefined;
			var steamName = undefined;
			var name = undefined;
			var mode = 0;
			const total = jQuery("#search_results .selectable").length; //ѡ�����������
			if (total > 0) //ѡ�����������
			{
				jQuery("#log_head, #log_body").html("");
				var jqobj = jQuery("#search_results .selectable");

				for (let i = 0; i < jqobj.length; i++) {
					let cur = jqobj.get(i);
					let profileID = cur.getAttribute("data-steamid");
					//--------------------------------------------------------------------
					SpecialName = undefined;
					steamName = undefined;

					if (document.URL.indexOf("/friends") == -1) { //������ڸ�������ҳ��
						//��ȡ��ע
						var SpecialNameobj = document.getElementsByClassName("nickname"); //nickname
						SpecialName = undefined;
						if (SpecialNameobj != "undefined") {
							SpecialName = SpecialNameobj[0].innerText; //��ע
						}
						//��ȡsteam����
						steamName = document.getElementsByClassName("actual_persona_name")[0].innerText; //steam����
						name = steamName;
					} else //��������Ǻ��ѽ���
					{
						//��ȡ����,Ȼ���ж��Ǳ�ע����steam����
						var SpecialNameobj = cur.getElementsByClassName("friend_block_content");
						var nicknameObj = cur.getElementsByClassName("player_nickname_hint");
						SpecialName = undefined;

						if (SpecialNameobj.length > 0) //��ȫ���
						{
							if (nicknameObj.length > 0) //�ڵ�������Ǳ�ע,����������steam����
							{
								console.log("��ȡ�����Ǳ�ע");
								SpecialName = SpecialNameobj[0].innerText.slice(0, SpecialNameobj[0].innerText.indexOf("*")); //��ȡ��ע
								steamName = undefined; //��û������
								if (SpecialName.indexOf('{CN}') != -1 ||
									SpecialName.indexOf('{EN}') != -1 ||
									SpecialName.indexOf('{JP}') != -1 ||
									SpecialName.indexOf('{CN-SG}') != -1 ||
									SpecialName.indexOf('{CN-HANT}') != -1 ||
									SpecialName.indexOf('{CN-HK}') != -1 ||
									SpecialName.indexOf('{CN-MO}') != -1 ||
									SpecialName.indexOf('{CN-TW}') != -1
								) //����Ƿ������˹�����ʶ
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
								) //����Ƿ������˹�����ʶ
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
									//�����˱�עû�����ù���
									cur.style.background = "#188038";
								}
							} else if (nicknameObj.length == 0) {
								console.log("��ȡ������steam����");
								steamName = SpecialNameobj[0].innerText.slice(0, SpecialNameobj[0].innerText.indexOf("\n")); //��ȡsteam����
								//jQuery("#log_body")[0].innerHTML +=
								//	"<a style='color:#00ffd8;' target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID +
								//	"\">" + '[' + (i + 1) + '/' + total + '] ������, û�б�ע����ȡ��! ' + profileID + '  ' + steamName + "</a><br>";
								//continue;
							}
						}
					}
					console.log("[Debug] name:", SpecialName);
					//await sleep(1000);
					//console.log(cur)
				}
				//window.location.reload(true); //ǿ�ƴӷ��������¼��ص�ǰҳ��
			}


		});

		jQuery("#unsetNationality").click(async function() {
			//��ȡָ���Ĺ�����ʶ
			var options = document.getElementById('nationalitySelectBox'); //��ȡѡ�е���Ŀ
			var optionsValue = options[options.selectedIndex].value;
			console.log("optionsValue", optionsValue);
			var strNationality = '{' + optionsValue + '}'; //��Ϲ�����ʶ
			var strSpecialNationality = '{' + optionsValue + '-N}'; //��ϸ��������ʶ
			//��������ѡ��ĺ���,
			//���Ѿ������˱�ע�ĺ���,��ӹ�����ʶ;
			//��û�����ñ�ע�ĺ���,��Ӹ��������ʶ(�˹�����ʶ��ԭ������ʶ���ܷ����ض����Ե�����,
			//�������ѡ�����û�б�ע����ӳƺ�,�����ޱ�ע����; ���Һ��ѻ��������ʶ; �ڷ�����Ҳ��ԭ������ʶ���в�ͬ)
			//ע��: ������ʶ���ᱻ��Ϊ�ƺ�֮���,ֻ��Ϊ��ʶ; Ϊ�˷���洢����,���Ի�����ڱ�ע��

			var SpecialName = undefined;
			var steamName = undefined;
			var name = undefined;
			var mode = 0;
			const total = jQuery("#search_results .selected.selectable").length; //ѡ�����������
			if (total > 0) //ѡ�����������
			{
				jQuery("#log_head, #log_body").html("");
				var jqobj = jQuery("#search_results .selected.selectable");

				for (let i = 0; i < jqobj.length; i++) {
					let cur = jqobj.get(i);
					let profileID = cur.getAttribute("data-steamid");
					//--------------------------------------------------------------------
					SpecialName = undefined;
					steamName = undefined;

					if (document.URL.indexOf("/friends") == -1) { //������ڸ�������ҳ��
						//��ȡ��ע
						var SpecialNameobj = document.getElementsByClassName("nickname"); //nickname
						SpecialName = undefined;
						if (SpecialNameobj != "undefined") {
							SpecialName = SpecialNameobj[0].innerText; //��ע
						}
						//��ȡsteam����
						steamName = document.getElementsByClassName("actual_persona_name")[0].innerText; //steam����
						name = steamName;
					} else //��������Ǻ��ѽ���
					{
						//��ȡ����,Ȼ���ж��Ǳ�ע����steam����
						var SpecialNameobj = cur.getElementsByClassName("friend_block_content");
						var nicknameObj = cur.getElementsByClassName("player_nickname_hint");
						SpecialName = undefined;

						if (SpecialNameobj.length > 0) //��ȫ���
						{
							if (nicknameObj.length > 0) //�ڵ�������Ǳ�ע,����������steam����
							{
								console.log("��ȡ�����Ǳ�ע");
								SpecialName = SpecialNameobj[0].innerText.slice(0, SpecialNameobj[0].innerText.indexOf("*")); //��ȡ��ע
								steamName = undefined; //��û������
								if (SpecialName.indexOf('{CN}') != -1 ||
									SpecialName.indexOf('{EN}') != -1 ||
									SpecialName.indexOf('{JP}') != -1 ||
									SpecialName.indexOf('{CN-SG}') != -1 ||
									SpecialName.indexOf('{CN-HANT}') != -1 ||
									SpecialName.indexOf('{CN-HK}') != -1 ||
									SpecialName.indexOf('{CN-MO}') != -1 ||
									SpecialName.indexOf('{CN-TW}') != -1
								) //����Ƿ������˹�����ʶ
								{
									SpecialName = SpecialName.slice(SpecialName.indexOf('}') + 1); //ȥ��������ʶ
									name = SpecialName; //ʹ��ԭ���ı�ע
								} else if (SpecialName.indexOf('{CN-N}') != -1 ||
									SpecialName.indexOf('{EN-N}') != -1 ||
									SpecialName.indexOf('{JP-N}') != -1 ||
									SpecialName.indexOf('{CN-SG-N}') != -1 ||
									SpecialName.indexOf('{CN-HANT-N}') != -1 ||
									SpecialName.indexOf('{CN-HK-N}') != -1 ||
									SpecialName.indexOf('{CN-MO-N}') != -1 ||
									SpecialName.indexOf('{CN-TW-N}') != -1
								) //����Ƿ������˹�����ʶ
								{
									SpecialName = SpecialName.slice(SpecialName.indexOf('}') + 1); //ȥ��������ʶ
									name = ""; //ȥ����ע
								} else {
									jQuery("#log_body")[0].innerHTML +=
										"<a style='color:#00ffd8;' target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID +
										"\">" + '[' + (i + 1) + '/' + total + '] ������, û�����ù�������ȡ��! ' + profileID + '  ' + SpecialName + "</a><br>";
									continue;
								}
							} else if (nicknameObj.length == 0) {
								console.log("��ȡ������steam����");
								steamName = SpecialNameobj[0].innerText.slice(0, SpecialNameobj[0].innerText.indexOf("\n")); //��ȡsteam����
								jQuery("#log_body")[0].innerHTML +=
									"<a style='color:#00ffd8;' target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID +
									"\">" + '[' + (i + 1) + '/' + total + '] ������, û�б�ע����ȡ��! ' + profileID + '  ' + steamName + "</a><br>";
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
									"\">" + '[' + (i + 1) + '/' + total + '] ���ñ�עʧ����! ' + profileID + '  ' + name +
									'&nbsp;&nbsp;&nbsp;&nbsp;' + response.error + "</a><br>";
							} else {
								jQuery("#log_body")[0].innerHTML +=
									'[' + (i + 1) + '/' + total + '] ' +
									"�ɹ����ñ�ע�� <a target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID + "\">" +
									profileID + '  ' + name + "</a>" +
									"<a style='color:#FB7299;' target='_blank' href=\"http://steamcommunity.com/profiles/" +
									profileID + "\">" + "</a><br>";
							}
						}).fail(function() {
							jQuery("#log_body")[0].innerHTML +=
								'[' + (i + 1) + '/' + total + '] ' +
								"<span style='color:#DA2626;'>�޷����ñ�ע�� <a style='color:#DA2626;' target='_blank' href=\"http://steamcommunity.com/profiles/" +
								profileID + "\">" +
								profileID + '  ' + name + "</a></span><br>";
						}).always(function() {
							jQuery("#log_head").html("<br><b>��ǰ������ " + (i + 1) + "��, �ܼ� " + total + " ������.<b>");
						});

					})(i, profileID);
					await sleep(1000);
					//console.log(cur)
				}
				window.location.reload(true); //ǿ�ƴӷ��������¼��ص�ǰҳ��
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

			const total = jQuery("#search_results .selected.selectable").length; //ѡ�����������
			const msg = jQuery("#comment_textarea").val(); //��ȡ��������
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

					if (document.URL.indexOf("/friends") == -1) { //������ڸ�������ҳ��
						//��ȡ��ע
						var SpecialNameobj = document.getElementsByClassName("nickname"); //nickname
						SpecialName = undefined;
						if (SpecialNameobj != "undefined") {
							SpecialName = SpecialNameobj[0].innerText; //��ע
						}
						//��ȡsteam����
						steamName = document.getElementsByClassName("actual_persona_name")[0].innerText; //steam����
						name = steamName;
					} else //��������Ǻ��ѽ���
					{
						//��ȡ����,Ȼ���ж��Ǳ�ע����steam����
						var SpecialNameobj = cur.getElementsByClassName("friend_block_content");
						var nicknameObj = cur.getElementsByClassName("player_nickname_hint");
						SpecialName = undefined;
						if (SpecialNameobj.length > 0) //��ȫ���
						{
							if (nicknameObj.length > 0) //�ڵ�������Ǳ�ע,����������steam����
							{
								console.log("��ȡ�����Ǳ�ע");
								SpecialName = SpecialNameobj[0].innerText.slice(0, SpecialNameobj[0].innerText.indexOf("*")); //��ȡ��ע
								steamName = undefined; //��û������
								name = SpecialName;
							} else if (nicknameObj.length == 0) {
								console.log("��ȡ������steam����");
								SpecialName = undefined; //��û�б�ע
								steamName = SpecialNameobj[0].innerText.slice(0, SpecialNameobj[0].innerText.indexOf("\n")); //��ȡsteam����
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

					if (mode == 1) { //�Ƿ�Ϊ������ӳƺ� (�������û�б�ע��ʹ��steam����)
						//�ж��Ƿ��б�ע,û����ʹ��steam����
						if (SpecialName != undefined) {
							console.log("Ϊ" + steamName + "��ӳƺ�: " + SpecialName);
							newMgs = SpecialName + msg;
						} else {
							console.log("Ϊ" + steamName + "��ӳƺ�: " + steamName);
							newMgs = steamName + msg;
						}
					} else if (mode == 2) { //�Ƿ�Ϊ������ӳƺ� (��Ϊ�������ñ�עΪ��Ҫ�ĳƺ�,������ӳƺ�)
						//�ж��Ƿ��б�ע,û���򲻲���
						if (SpecialName != undefined) {
							console.log("Ϊ" + steamName + "��ӳƺ�: " + SpecialName);
							newMgs = SpecialName + msg;
						} else {
							newMgs = msg;
						}
					} else if (mode == 0) { //ֱ�ӷ�������
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
								"\">" + '[' + (i + 1) + '/' + total + '] ����������! ' + profileID + '  ' + name + "</a><br>";
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
									"\">" + '[' + (i + 1) + '/' + total + '] ����ʧ����! ' + profileID + '  ' + name +
									'&nbsp;&nbsp;&nbsp;&nbsp;' + response.error + "</a><br>";
							} else {
								jQuery("#log_body")[0].innerHTML +=
									'[' + (i + 1) + '/' + total + '] ' +
									"�ɹ����������� <a target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID + "\">" +
									profileID + '  ' + name + "</a>" +
									"<span> �� </span><a style='color:#FB7299;' target='_blank' href=\"http://steamcommunity.com/profiles/" +
									profileID + "\">" + newMgs + "</a><br>";
							}
						}).fail(function() {
							jQuery("#log_body")[0].innerHTML +=
								'[' + (i + 1) + '/' + total + '] ' +
								"<span style='color:#DA2626;'>�޷����������� <a style='color:#DA2626;' target='_blank' href=\"http://steamcommunity.com/profiles/" +
								profileID + "\">" +
								profileID + '  ' + name + "</a></span><br>";
						}).always(function() {
							jQuery("#log_head").html("<br><b>��ǰ������ " + (i + 1) + "��, �ܼ� " + total + " ������.<b>");
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
				//������������
				var str = "";
				let days = Math.floor(time / (24 * 3600 * 1000))
				//�����Сʱ��
				let leave1 = time % (24 * 3600 * 1000) //����������ʣ��ĺ�����
				let hours = Math.floor(leave1 / (3600 * 1000))
				//������������
				let leave2 = leave1 % (3600 * 1000) //����Сʱ����ʣ��ĺ�����
				let minutes = Math.floor(leave2 / (60 * 1000))
				//�����������
				let leave3 = leave2 % (60 * 1000) //�����������ʣ��ĺ�����
				//let seconds=Math.round(leave3/1000)
				let seconds = leave3 / 1000
				if (days > 0)
					str += days + "��";
				if (hours > 0)
					str += hours + "Сʱ";
				if (minutes > 0)
					str += minutes + "����";
				if (seconds > 0)
					str += seconds + "��";
				//--------------------------------------------------------------------------------
				jQuery("#log_body")[0].innerHTML +=
					"<b>�������! ��ʱ: <span style='color:#35ff8b;'>" + str + "</span></b><br>";
				//});

			} else {
				alert("��ȷ����������һ����Ϣ��ѡ����1���������ѡ�");
			}
		});

		//---------------------------------------------------------------------------------------------------------------
		await jQuery("#comment_submit_special").click(async function() {
			date = new Date();
			startTime = date.getTime();

			const total = jQuery("#search_results .selected.selectable").length; //ѡ�����������
			const msg = jQuery("#comment_textarea").val(); //��ȡ��������
			const msg_CN = jQuery("#comment_textarea_zhc").val(); //��ȡ��������
			const msg_EN = jQuery("#comment_textarea_en").val(); //��ȡ��������
			const msg_JP = jQuery("#comment_textarea_jp").val(); //��ȡ��������
			const msg_CN_SG = jQuery("#comment_textarea_zh_sg").val(); //��ȡ��������
			const msg_CN_HANT = jQuery("#comment_textarea_zh_hant").val(); //��ȡ��������
			const msg_CN_HK = jQuery("#comment_textarea_zh_hk").val(); //��ȡ��������
			const msg_CN_MO = jQuery("#comment_textarea_zh_mo").val(); //��ȡ��������
			const msg_CN_TW = jQuery("#comment_textarea_zh_tw").val(); //��ȡ��������
			var newMgs = "";
			var mode = 0;
			var SpecialName = undefined;
			var steamName = undefined;
			var name = undefined;

			if (total > 0 && msg.length > 0) {
				jQuery("#log_head, #log_body").html("");
				//jQuery(".selected").each(async function(i) {
				//var jqobj = jQuery(".selected");
				//var jqobj = jQuery(".selected[data-steamid]"); //�ų���ѡ��������Ķ���
				var jqobj = jQuery("#search_results .selected.selectable"); //�ų���ѡ��������Ķ���

				for (let i = 0; i < jqobj.length; i++) {
					let cur = jqobj.get(i);

					//--------------------------------------------------------------------
					SpecialName = undefined;
					steamName = undefined;

					if (document.URL.indexOf("/friends") == -1) { //������ڸ�������ҳ��
						//��ȡ��ע
						var SpecialNameobj = document.getElementsByClassName("nickname"); //nickname
						SpecialName = undefined;
						if (SpecialNameobj != "undefined") {
							SpecialName = SpecialNameobj[0].innerText; //��ע
						}
						//��ȡsteam����
						steamName = document.getElementsByClassName("actual_persona_name")[0].innerText; //steam����
						name = steamName;
					} else //��������Ǻ��ѽ���
					{
						//��ȡ����,Ȼ���ж��Ǳ�ע����steam����
						var SpecialNameobj = cur.getElementsByClassName("friend_block_content");
						var nicknameObj = cur.getElementsByClassName("player_nickname_hint");
						SpecialName = undefined;
						if (SpecialNameobj.length > 0) //��ȫ���
						{
							if (nicknameObj.length > 0) //�ڵ�������Ǳ�ע,����������steam����
							{
								console.log("��ȡ�����Ǳ�ע");
								SpecialName = SpecialNameobj[0].innerText.slice(0, SpecialNameobj[0].innerText.indexOf("*")); //��ȡ��ע
								steamName = undefined; //��û������
								name = SpecialName;
							} else if (nicknameObj.length == 0) {
								console.log("��ȡ������steam����");
								SpecialName = undefined; //��û�б�ע
								steamName = SpecialNameobj[0].innerText.slice(0, SpecialNameobj[0].innerText.indexOf("\n")); //��ȡsteam����
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

					if (mode == 1) { //�Ƿ�Ϊ������ӳƺ� (�������û�б�ע��ʹ��steam����)
						//�ж��Ƿ��б�ע,û����ʹ��steam����
						if (SpecialName != undefined) {
							let strNationality = SpecialName.slice(0, SpecialName.indexOf('}') + 1); //��ȡ����
							SpecialName = SpecialName.slice(SpecialName.indexOf('}') + 1); //ȥ��������ʶ

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
							} else //û�����ù�����Ĭ��ʹ��Ӣ��,����,��������,ԭʼ����
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
							console.log("Ϊ" + SpecialName + "��ӳƺ�: " + SpecialName);
							//newMgs = SpecialName + msg;
						} else {
							let strNationality = steamName.slice(0, steamName.indexOf('}') + 1); //��ȡ����
							steamName = steamName.slice(steamName.indexOf('}') + 1); //ȥ��������ʶ

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
							} else //û�����ù�����Ĭ��ʹ��Ӣ��,����,��������,ԭʼ����
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
							console.log("Ϊ" + steamName + "��ӳƺ�: " + steamName);
							//newMgs = steamName + msg;
						}
					} else if (mode == 2) { //�Ƿ�Ϊ������ӳƺ� (��Ϊ�������ñ�עΪ��Ҫ�ĳƺ�,������ӳƺ�)
						//�ж��Ƿ��б�ע,û���򲻲���
						if (SpecialName != undefined) {
							let strNationality = SpecialName.slice(0, SpecialName.indexOf('}') + 1); //��ȡ����
							SpecialName = SpecialName.slice(SpecialName.indexOf('}') + 1); //ȥ��������ʶ

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
							} else //û�����ù�����Ĭ��ʹ��Ӣ��,����,��������,ԭʼ����
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
							console.log("Ϊ" + steamName + "��ӳƺ�: " + SpecialName);
							//newMgs = SpecialName + msg;
						} else {
							let strNationality = steamName.slice(0, steamName.indexOf('}') + 1); //��ȡ����
							steamName = steamName.slice(steamName.indexOf('}') + 1); //ȥ��������ʶ

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
							} else //û�����ù�����Ĭ��ʹ��Ӣ��,����,��������,ԭʼ����
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
					} else if (mode == 0) { //ֱ�ӷ�������
						let strNationality = name.slice(0, name.indexOf('}') + 1); //��ȡ����
						name = name.slice(name.indexOf('}') + 1); //ȥ��������ʶ

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
						} else //û�����ù�����Ĭ��ʹ��Ӣ��,����,��������,ԭʼ����
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
								"\">" + '[' + (i + 1) + '/' + total + '] ����������! ' + profileID + '  ' + name + "</a><br>";
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
									"\">" + '[' + (i + 1) + '/' + total + '] ����ʧ����! ' + profileID + '  ' + name +
									'&nbsp;&nbsp;&nbsp;&nbsp;' + response.error + "</a><br>";
							} else {
								jQuery("#log_body")[0].innerHTML +=
									'[' + (i + 1) + '/' + total + '] ' +
									"�ɹ����������� <a target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID + "\">" +
									profileID + '  ' + name + "</a>" +
									"<span> �� </span><a style='color:#FB7299;' target='_blank' href=\"http://steamcommunity.com/profiles/" +
									profileID + "\">" + newMgs + "</a><br>";
							}
						}).fail(function() {
							jQuery("#log_body")[0].innerHTML +=
								'[' + (i + 1) + '/' + total + '] ' +
								"<span style='color:#DA2626;'>�޷����������� <a style='color:#DA2626;' target='_blank' href=\"http://steamcommunity.com/profiles/" +
								profileID + "\">" +
								profileID + '  ' + name + "</a></span><br>";
						}).always(function() {
							jQuery("#log_head").html("<br><b>��ǰ������ " + (i + 1) + "��, �ܼ� " + total + " ������.<b>");
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
				//������������
				var str = "";
				let days = Math.floor(time / (24 * 3600 * 1000))
				//�����Сʱ��
				let leave1 = time % (24 * 3600 * 1000) //����������ʣ��ĺ�����
				let hours = Math.floor(leave1 / (3600 * 1000))
				//������������
				let leave2 = leave1 % (3600 * 1000) //����Сʱ����ʣ��ĺ�����
				let minutes = Math.floor(leave2 / (60 * 1000))
				//�����������
				let leave3 = leave2 % (60 * 1000) //�����������ʣ��ĺ�����
				//let seconds=Math.round(leave3/1000)
				let seconds = leave3 / 1000
				if (days > 0)
					str += days + "��";
				if (hours > 0)
					str += hours + "Сʱ";
				if (minutes > 0)
					str += minutes + "����";
				if (seconds > 0)
					str += seconds + "��";
				//--------------------------------------------------------------------------------
				jQuery("#log_body")[0].innerHTML +=
					"<b>�������! ��ʱ: <span style='color:#35ff8b;'>" + str + "</span></b><br>";
				//});

			} else {
				alert("��ȷ����������һ����Ϣ��ѡ����1���������ѡ�");
			}
		});

		var GroupMode = 0; //�����־ 0û�з��� 1�ǹ��� 2������ʱ��

		await jQuery("#NationalitySortGroup").click(async function() {
			var SpecialName = undefined;
			var steamName = undefined;
			var name = undefined;
			var mode = 0;
			const total = jQuery("#search_results .selectable").length; //���е���������
			jQuery("#log_head, #log_body").html("");
			var jqobj = jQuery("#search_results .selectable"); //���е�����


			var child_CN, child_EN, child_JP, child_CN_SG, child_CN_HANTd, child_CN_HK, child_CN_MO, child_CN_TW;
			if (GroupMode != 1) {
				var mainFriendObj;
				if (GroupMode == 2) { //�ڵ��Ѿ���ģʽ2�����
					//���ݺʹ���
					if (document.getElementById("search_results1") == null) { //û�б�ģʽ1�����
						mainFriendObj = document.getElementById("search_results0"); //��ȡԭ�ڵ�
						var newCopyObj = mainFriendObj.cloneNode(true);
						var mainFriendObj1 = document.getElementById("search_results"); //��ȡ֮ǰģʽ�Ľڵ�
						mainFriendObj1.style.display = "none"; //֮ǰģʽ�Ľڵ�����
						mainFriendObj1.id = "search_results2"; //֮ǰģʽ�Ľڵ�
						mainFriendObj1.className = "profile_friends search_results2"; //֮ǰģʽ�Ľڵ�
						newCopyObj.style.display = ""; //��¡��ԭ�ڵ�ȡ������(��ʾ)
						newCopyObj.id = "search_results"; //��¡��ԭ�ڵ�
						newCopyObj.className = "profile_friends search_results"; //��¡��ԭ�ڵ�
						mainFriendObj.parentNode.appendChild(newCopyObj); //�����һ���µı��ݽڵ�
					} else { //��ģʽ1�����
						var obj = document.getElementById("search_results1");
						var mainFriendObj1 = document.getElementById("search_results"); //��ȡ֮ǰģʽ�Ľڵ�
						mainFriendObj = document.getElementById("search_results0"); //��ȡԭ�ڵ�
						mainFriendObj1.style.display = "none"; //֮ǰģʽ�Ľڵ�����
						mainFriendObj1.id = "search_results2"; //֮ǰģʽ�Ľڵ�
						mainFriendObj1.className = "profile_friends search_results2"; //֮ǰģʽ�Ľڵ�
						obj.style.display = ""; //ȡ������(��ʾ)
						obj.id = "search_results"; //�ڵ�
						obj.className = "profile_friends search_results"; //�ڵ�
					}

				} else { //�ڵ㻹û�б�����
					//���ݺʹ���
					mainFriendObj = document.getElementById("search_results"); //��ȡԭ�ڵ�
					var newCopyObj = mainFriendObj.cloneNode(true);
					newCopyObj.style.display = "none"; //��¡��ԭ�ڵ�����
					newCopyObj.id = "search_results0"; //��¡��ԭ�ڵ�
					newCopyObj.className = "profile_friends search_results0"; //��¡��ԭ�ڵ�
					mainFriendObj.parentNode.appendChild(newCopyObj); //�����һ���µı��ݽڵ�


				}
				// //���ݺʹ���
				// var mainFriendObj = document.getElementById("search_results"); //��ȡԭ�ڵ�
				// var newCopyObj = mainFriendObj.cloneNode(true);
				// newCopyObj.style.display = "none"; //����
				// mainFriendObj.parentNode.appendChild(newCopyObj); //�����һ���µı��ݽڵ�

				var StateObj = mainFriendObj.getElementsByClassName("state_block");
				for (let i = 0; i < StateObj.length; i++) {
					StateObj[i].style.display = "none"; //����״̬��
				}

				//�����º��ӺͿ�¡����ڵ�
				console.log("��ʼ����...");
				child_CN = document.createElement('div'); //����
				child_CN.id = "Firend_CN";
				child_CN.style.display = "flex";
				child_CN.style.flex = "1 100%";
				child_CN.style.flexFlow = "row wrap";
				child_CN.style.margin = "8px 0px 0px 0px";
				// child_CN.style.justifyContent = "space-start";
				mainFriendObj.appendChild(child_CN);

				child_EN = child_CN.cloneNode(true); //��¡
				child_EN.id = "Firend_EN";
				mainFriendObj.appendChild(child_EN);

				child_JP = child_EN.cloneNode(true); //��¡
				child_JP.id = "Firend_JP";
				mainFriendObj.appendChild(child_JP);

				child_CN_SG = child_EN.cloneNode(true); //��¡
				child_CN_SG.id = "Firend_CN_SG";
				mainFriendObj.appendChild(child_CN_SG);

				child_CN_HANTd = child_EN.cloneNode(true); //��¡
				child_CN_HANTd.id = "Firend_CN_HANTd";
				mainFriendObj.appendChild(child_CN_HANTd);

				child_CN_HK = child_EN.cloneNode(true); //��¡
				child_CN_HK.id = "Firend_CN_HK";
				mainFriendObj.appendChild(child_CN_HK);

				child_CN_MO = child_EN.cloneNode(true); //��¡
				child_CN_MO.id = "Firend_CN_MO";
				mainFriendObj.appendChild(child_CN_MO);

				child_CN_TW = child_EN.cloneNode(true); //��¡
				child_CN_TW.id = "Firend_CN_TW";
				mainFriendObj.appendChild(child_CN_TW);

				//-------------------------------------------------

				var newGroupTitle = StateObj[0].cloneNode(true); //��¡
				newGroupTitle.style.display = ""; //ȥ��������ʽ
				newGroupTitle.innerText = "CN";
				child_CN.appendChild(newGroupTitle);

				newGroupTitle = newGroupTitle.cloneNode(true); //��¡
				newGroupTitle.innerText = "EN";
				child_EN.appendChild(newGroupTitle);

				newGroupTitle = newGroupTitle.cloneNode(true); //��¡
				newGroupTitle.innerText = "JP";
				child_JP.appendChild(newGroupTitle);

				newGroupTitle = newGroupTitle.cloneNode(true); //��¡
				newGroupTitle.innerText = "CN_SG";
				child_CN_SG.appendChild(newGroupTitle);

				newGroupTitle = newGroupTitle.cloneNode(true); //��¡
				newGroupTitle.innerText = "CN_HANTd";
				child_CN_HANTd.appendChild(newGroupTitle);

				newGroupTitle = newGroupTitle.cloneNode(true); //��¡
				newGroupTitle.innerText = "CN_HK";
				child_CN_HK.appendChild(newGroupTitle);

				newGroupTitle = newGroupTitle.cloneNode(true); //��¡
				newGroupTitle.innerText = "CN_MO";
				child_CN_MO.appendChild(newGroupTitle);

				newGroupTitle = newGroupTitle.cloneNode(true); //��¡
				newGroupTitle.innerText = "CN_TW";
				child_CN_TW.appendChild(newGroupTitle);

				//�������нڵ�,���������ӽڵ�
				for (let i = 0; i < jqobj.length; i++) {
					let cur = jqobj.get(i);
					let profileID = cur.getAttribute("data-steamid");
					//--------------------------------------------------------------------
					SpecialName = undefined;
					steamName = undefined;

					if (document.URL.indexOf("/friends") == -1) { //������ڸ�������ҳ��
						//��ȡ��ע
						var SpecialNameobj = document.getElementsByClassName("nickname"); //nickname
						SpecialName = undefined;
						if (SpecialNameobj != "undefined") {
							SpecialName = SpecialNameobj[0].innerText; //��ע
						}
						//��ȡsteam����
						steamName = document.getElementsByClassName("actual_persona_name")[0].innerText; //steam����
						name = steamName;
					} else //��������Ǻ��ѽ���
					{
						//��ȡ����,Ȼ���ж��Ǳ�ע����steam����
						var SpecialNameobj = cur.getElementsByClassName("friend_block_content");
						var nicknameObj = cur.getElementsByClassName("player_nickname_hint");
						SpecialName = undefined;

						if (SpecialNameobj.length > 0) //��ȫ���
						{
							if (nicknameObj.length > 0) //�ڵ�������Ǳ�ע,����������steam����
							{
								//console.log("��ȡ�����Ǳ�ע");
								SpecialName = SpecialNameobj[0].innerText.slice(0, SpecialNameobj[0].innerText.indexOf("*")); //��ȡ��ע
								steamName = undefined; //��û������
								if (SpecialName.indexOf('{CN}') != -1 || SpecialName.indexOf('{CN-N}') != -1) { //����Ƿ������˹�����ʶ
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
									// 	"\">" + '[' + (i + 1) + '/' + total + '] ������, û�����ù�������ȡ��! ' + profileID + '  ' + SpecialName + "</a><br>";
									// continue;
								}
							} else if (nicknameObj.length == 0) {
								//console.log("��ȡ������steam����");
								// steamName = SpecialNameobj[0].innerText.slice(0, SpecialNameobj[0].innerText.indexOf("\n")); //��ȡsteam����
								// jQuery("#log_body")[0].innerHTML +=
								// 	"<a style='color:#00ffd8;' target='_blank' href=\"http://steamcommunity.com/profiles/" + profileID +
								// 	"\">" + '[' + (i + 1) + '/' + total + '] ������, û�б�ע����ȡ��! ' + profileID + '  ' + steamName + "</a><br>";
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
			const total = jQuery("#search_results .selectable.offline").length; //ѡ�����������
			if (total > 0) //ѡ�����������
			{
				jQuery("#log_head, #log_body").html("");
				var jqobj = jQuery("#search_results .selectable.offline"); //ѡ�����ߵĺ���
				var ArrOfflineTime = [];

				if (GroupMode != 2) {
					var mainFriendObj;
					if (GroupMode == 1) { //�ڵ��Ѿ���ģʽ1�����
						//���ݺʹ���
						if (document.getElementById("search_results2") == null) { //û�б�ģʽ2�����
							mainFriendObj = document.getElementById("search_results0"); //��ȡԭ�ڵ�
							var newCopyObj = mainFriendObj.cloneNode(true);
							var mainFriendObj1 = document.getElementById("search_results"); //��ȡ֮ǰģʽ�Ľڵ�
							mainFriendObj1.style.display = "none"; //֮ǰģʽ�Ľڵ�����
							mainFriendObj1.id = "search_results1"; //֮ǰģʽ�Ľڵ�
							mainFriendObj1.className = "profile_friends search_results1"; //֮ǰģʽ�Ľڵ�
							newCopyObj.style.display = ""; //��¡��ԭ�ڵ�ȡ������(��ʾ)
							newCopyObj.id = "search_results"; //��¡��ԭ�ڵ�
							newCopyObj.className = "profile_friends search_results"; //��¡��ԭ�ڵ�
							mainFriendObj.parentNode.appendChild(newCopyObj); //�����һ���µı��ݽڵ�
						} else { //��ģʽ2�����
							var obj = document.getElementById("search_results2");
							var mainFriendObj1 = document.getElementById("search_results"); //��ȡ֮ǰģʽ�Ľڵ�
							mainFriendObj = document.getElementById("search_results0"); //��ȡԭ�ڵ�
							mainFriendObj1.style.display = "none"; //֮ǰģʽ�Ľڵ�����
							mainFriendObj1.id = "search_results1"; //֮ǰģʽ�Ľڵ�
							mainFriendObj1.className = "profile_friends search_results1"; //֮ǰģʽ�Ľڵ�
							obj.style.display = ""; //ȡ������(��ʾ)
							obj.id = "search_results"; //�ڵ�
							obj.className = "profile_friends search_results"; //�ڵ�
						}
					} else { //�ڵ㻹û�б�����
						//���ݺʹ���
						mainFriendObj = document.getElementById("search_results"); //��ȡԭ�ڵ�
						var newCopyObj = mainFriendObj.cloneNode(true);
						newCopyObj.style.display = "none"; //��¡��ԭ�ڵ�����
						newCopyObj.id = "search_results0"; //��¡��ԭ�ڵ�
						newCopyObj.className = "profile_friends search_results0"; //��¡��ԭ�ڵ�
						mainFriendObj.parentNode.appendChild(newCopyObj); //�����һ���µı��ݽڵ�


					}

					var StateObj = mainFriendObj.getElementsByClassName("state_block");
					for (let i = 0; i < StateObj.length; i++) {
						StateObj[i].style.display = "none"; //����״̬��
					}
					//�����º��ӺͿ�¡����ڵ�
					console.log("��ʼ����...");
					child_Offline = document.createElement('div'); //����
					child_Offline.id = "Firend_Offline";
					child_Offline.style.display = "flex";
					child_Offline.style.flex = "1 100%";
					child_Offline.style.flexFlow = "row wrap";
					child_Offline.style.margin = "8px 0px 0px 0px";
					// child_Offline.style.justifyContent = "space-start";
					mainFriendObj.appendChild(child_Offline);

					child_Online = child_Offline.cloneNode(true); //��¡
					child_Online.id = "Firend_Online";
					mainFriendObj.appendChild(child_Online);

					child_InGame = child_Offline.cloneNode(true); //��¡
					child_InGame.id = "Firend_InGame";
					mainFriendObj.appendChild(child_InGame);

					//-------------------------------------------------

					var newGroupTitle = StateObj[0].cloneNode(true); //��¡
					newGroupTitle.style.display = ""; //ȥ��������ʽ
					newGroupTitle.innerText = "Offline";
					child_Offline.appendChild(newGroupTitle);

					newGroupTitle = newGroupTitle.cloneNode(true); //��¡
					newGroupTitle.innerText = "Online";
					child_Online.appendChild(newGroupTitle);

					newGroupTitle = newGroupTitle.cloneNode(true); //��¡
					newGroupTitle.innerText = "InGame";
					child_InGame.appendChild(newGroupTitle);

					for (let i = 0; i < jqobj.length; i++) {
						let cur = jqobj.get(i);
						let profileID = cur.getAttribute("data-steamid");
						//--------------------------------------------------------------------
						SpecialName = undefined;
						steamName = undefined;

						if (document.URL.indexOf("/friends") == -1) { //������ڸ�������ҳ��
							//��ȡ��ע
							var SpecialNameobj = document.getElementsByClassName("nickname"); //nickname
							SpecialName = undefined;
							if (SpecialNameobj != "undefined") {
								SpecialName = SpecialNameobj[0].innerText; //��ע
							}
							//��ȡsteam����
							steamName = document.getElementsByClassName("actual_persona_name")[0].innerText; //steam����
							name = steamName;
						} else //��������Ǻ��ѽ���
						{
							//��ȡ����,Ȼ���ж��Ǳ�ע����steam����
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
							if (OfflineTime.length > 0) //�ҵ���
							{
								strOfflineTime = OfflineTime[0].innerText.slice(5); //ȥ�����ϴ����ߡ��ַ���
								var strOfflineTimeArr = strOfflineTime.split(' ');
								strOfflineTimeArr[strOfflineTimeArr.length - 1] = strOfflineTimeArr[strOfflineTimeArr.length - 1].slice(0,
									-1); //ȥ�����ġ�ǰ���ַ���
								//console.log("strOfflineTime",strOfflineTime,strOfflineTimeArr);
								for (let i = 0; i < strOfflineTimeArr.length; i += 2) {
									if (strOfflineTimeArr[i + 1] == "��")
										nYear = strOfflineTimeArr[i];
									else if (strOfflineTimeArr[i + 1] == "��")
										nMonth = strOfflineTimeArr[i];
									else if (strOfflineTimeArr[i + 1] == "��")
										nDay = strOfflineTimeArr[i];
									else if (strOfflineTimeArr[i + 1] == "Сʱ")
										nHours = strOfflineTimeArr[i];
									else if (strOfflineTimeArr[i + 1] == "����")
										nMinutes = strOfflineTimeArr[i];
									else if (strOfflineTimeArr[i + 1] == "��")
										nSeconds = strOfflineTimeArr[i];
								}
								strData = nYear + '/' + nMonth + '/' + nDay + ' ' + nHours + ':' + nMinutes + ':' + nSeconds;
								//console.info("strData",strData);

								var hzWeek = new Array("��", "һ", "��", "��", "��", "��", "��", "��");

								function cweekday(wday) {
									return hzWeek[wday];
								}

								function calaDay() { //����ʱ���: һ���ǵ�ǰʱ�䣬һ��������ʱ�䣬�Ͷ�תΪ��������������ٻ�ԭʱ��
									var date = new Date();
									ddd = parseInt(nDay); //ת���ֺ�ȡ��Ӧ����
									//ttt = new Date(y, m - 1, d).getTime() + ddd * 24000 * 3600;
									ttt = date.getTime() + ~(ddd * 86400);
									theday = new Date();
									theday.setTime(ttt);
									//document.getElementById("result1").innerHTML = theday.getFullYear() + "��" + (1 + theday.getMonth()) + "��" + theday.getDate() + "��" + "����" + cweekday(theday.getDay());
									return theday.getTime(); //��ȡ��Ӧ��ʱ���
								}

								function calbHMS() { //����ʱ���: һ���ǵ�ǰʱ�䣬һ��������ʱ�䣬�Ͷ�תΪ��������������ٻ�ԭʱ��
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


							//SpecialName = SpecialNameobj[0].innerText.slice(0, SpecialNameobj[0].innerText.indexOf("*")); //��ȡ��ע
							//������������������

							//�������еĺ���,�ҵ����ߵĺ���,�����ַ���,װ��Date���� //6������ָ���ꡢ�¡��ա�Сʱ�����ӡ���(0)  //û�еľ�д0
							//��ȡ������ dateObject.getTime()   ������   Date.parse(datestring)
							// var d=new Date("5/05/11 1:10:0");
							// document.write("�� 1970/01/01 �������У�" + d.getTime() + " ���롣");
							// document.write("�� 1970/01/01 �������У�" + Date.parse("5/05/11 1:10:0") + " ���롣");

							//�洢�ڶ�ά�����һ���Ǻ�������һ���������±�
							//������������������Ȼ��ȡ�±꣬��ָ�������������
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
					}); //��ʱ�������
					//console.log(ArrOfflineTime);

					//������ά���飬Ȼ��ȡ�±꣬��ָ�������������
					for (let i = 0; i < ArrOfflineTime.length; i++) {
						child_Offline.appendChild(jqobj[ArrOfflineTime[i][1]]); //.getElementsByClassName("friend_block_content").parentNode
					}
					//����Ϸ�к����ߵĺ���Ҳ��ӵ�������
					var jqobj1 = jQuery("#search_results .selectable.online"); //ѡ�����ߵĺ���
					var jqobj2 = jQuery("#search_results .selectable.in-game"); //ѡ����Ϸ�еĺ���
					var jqobj3 = jQuery("#search_results .selectable.golden"); //ѡ���ɫ�ĺ���
					for (let i = 0; i < jqobj3.length; i++) {
						var strGame = jqobj3[i].getElementsByClassName("friend_small_text")[0].innerText;
						var game = strGame.replace(/^\s+|\s+$/g, ""); //ȥ�����ߵĿո�
						//console.log("strGame");
						if (game == "") {
							//console.log("����");
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
