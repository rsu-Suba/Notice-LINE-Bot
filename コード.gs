//4-23-2023-2:24 --- Update 6-15-2023-19:33


//LINEのアクセストークン
var channel_access_token = '';
//スプレッドシートのID
var spreadsheetid = '';
//スプレッドシートの名前
var sheetnameid = '';
//日付のフォーマットが異なるときに返すメッセージ
var incorrectformat = '';
//コマンドが異なるときに返すメッセージ
var incorrectcommand = '';
//月曜日の時間割
var montime = '';
//火曜日の時間割
var tuetime = '';
//水曜日の時間割
var wedtime = '';
//木曜日の時間割
var thutime = '';
//金曜日の時間割
var fritime = '';
//休日
var holi = '';
//ヘルプコマンドに返すメッセージ
var helptext = '';






var spreadsheet = SpreadsheetApp.openById(spreadsheetid);
var sheet = spreadsheet.getSheetByName(sheetnameid);
var headers = {
   "Content-Type": "application/json; charset=UTF-8",
   "Authorization": "Bearer " + channel_access_token
};

function sendLineMessageFromReplyToken(token, replyText) {
 var url = "https://api.line.me/v2/bot/message/reply";
 var headers = {
   "Content-Type": "application/json; charset=UTF-8",
   "Authorization": "Bearer " + channel_access_token
 };
 var postData = {
   "replyToken": token,
   "messages": [{
     "type": "text",
     "text": replyText
   }]
 };
 var options = {
   "method": "POST",
   "headers": headers,
   "payload": JSON.stringify(postData)
 };
 return UrlFetchApp.fetch(url, options);
}

function sendLineMessageFromUserId(userId, text) {
 var url = "https://api.line.me/v2/bot/message/push";
 var postData = {
   "to": userId,
   "messages": [{
     "type": "text",
     "text": text
   }]
 };
 var options = {
   "method": "POST",
   "headers": headers,
   "payload": JSON.stringify(postData)
 };
 return UrlFetchApp.fetch(url, options);
}

function formatDateForDisplay (date){
  return date.substr(0,4) + "/" +date.substr(4,2)  + "/" + date.substr(6,2);
}

function formatDate (date, format) {
  format = format.replace(/yyyy/g, date.getFullYear());
  format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
  format = format.replace(/dd/g, ('0' + date.getDate()).slice(-2));
  return format;
};

function setDate(date, plan, row) {
  var daytext;
    if (date.length == 1){
      daytext = date;
      date = convdate(date);
  }
  else if (date.length == 8){
    daytext = convdate(date);
  }
  else{
    return incorrectformat;
  }
  setFromRowAndLine(date, row, 0);
  return setPlan(plan, row, date, daytext);
}

function setPlan(plan, row, date, daytext) {
  setFromRowAndLine(plan, row, 1);
  return formatDateForDisplay(String(date)) + ' (' + daytext + ')' + 'に' + plan + 'を登録しました。';
}

function getTodayAndNextDayMessage(count){
  var date = new Date();
  var remindText = getDatePlan(formatDate(date, 'yyyyMMdd'));
  if (count == undefined){
    for(var i = 1; i < 7; i++){
    date.setDate(date.getDate() + 1);
    remindText += '\n\n\n' + getDatePlan(formatDate(date, 'yyyyMMdd'));
  }
  }
  else if (count){
    if (count.length == 1 || count.length == 8){
      if (count.length == 1){
        count = convdate(count);
      }
      var countdate = new Date(count.substr(0,4), count.substr(4,2) - 1, count.substr(6,2));
      countdate -= date;
      if (parseInt(countdate / 86400000) + 2 > 30){
        return '30日以内をしてしてください。';
      }
      for(var i = 1; i < parseInt(countdate / 86400000) + 2; i++){
    date.setDate(date.getDate() + 1);
    remindText += '\n\n\n' + getDatePlan(formatDate(date, 'yyyyMMdd'));
  }
    }
    else{
      remindText = '日付のフォーマットは「20230416」です。';
    }
  }
  return remindText;
}

function convday(sdate,mode){
  var sday;
  if (mode == 0){
    //Lang to Num
    if (sdate == '月'){
      sday = 1;
    }
    else if (sdate == '火'){
      sday = 2;
    }
    else if (sdate == '水'){
      sday = 3;
    }
    else if (sdate == '木'){
      sday = 4;
    }
    else if (sdate == '金'){
      sday = 5;
    }
    else if (sdate == '土'){
      sday = 6;
    }
    else if (sdate == '日'){
      sday = 0;
    }
  }
  else if (mode == 1){
    //Num to Lang
        if (sdate == 1){
      sday = '月';
    }
    else if (sdate == 2){
      sday = '火';
    }
    else if (sdate == 3){
      sday = '水';
    }
    else if (sdate == 4){
      sday = '木';
    }
    else if (sdate == 5){
      sday = '金';
    }
    else if (sdate == 6){
      sday = '土';
    }
    else if (sdate == 0){
      sday = '日';
    }
  }
  return sday;
}

function convdate(date){
  var mode;
  var setday;
  if (date.length == 1){
    mode = 0;
  }
  else if (date.length == 8){
    mode = 1;
  }
  else{
    setday = incorrectformat;
  }
    //day to date
  if (mode == 0){
  var nowdate = new Date();
  var nowdatenum = Number(7 - nowdate.getDay())
  if (nowdatenum == 7){
    nowdatenum = 0;
  }
  else if (nowdatenum > 7){
    return 'Something Went Wrong?';
  }
  nowdatenum = Number(convday(date,0)) +  nowdatenum;
  if (nowdatenum > 7){
    nowdatenum -= 7;
  }
  if (date.getHours() >= 0 && date.getHours() < 15){
    nowdatenum = 0;
  }
  nowdate.setDate(nowdate.getDate() + nowdatenum);
  setday = formatDate(nowdate, 'yyyyMMdd');
  }
  //date to day
  else if (mode == 1){
    setday = convday(new Date(date.substr(0,4), date.substr(4,2) - 1, date.substr(6,2)).getDay(),1);
    }
  return setday;
}

function getDatePlan(date) {
  var selectday;
  var remindText;
if (date == undefined){
date = new Date();
selectday = convday(date.getDay(),1);
date = formatDate(date, 'yyyyMMdd');
}
else if (date){
  if (date.length == 8){
    selectday = convdate(date);
  }
  else if (date.length == 1){
    selectday = date;
    date = convdate(date);
  }
}
  var day = formatDateForDisplay(String(date));
  remindText = day + ' (' + selectday + ')';
  var plans = searchPlans(date);
  for(var i = 0; i < plans.length; i++) {
  remindText += '\n' + getFromRowAndLine('webhook', plans[i]);
  }
  return remindText;
}

function timesche(selectday){
  var cachetext;
var remindText = '今日は';
if (selectday == undefined){
var date = new Date();
var dayweek = date.getDay();
cachetext = convday(dayweek,1);
if (date.getHours() > 14 && date.getHours() < 24){
  dayweek += 1;
  if (dayweek == 7){
    dayweek = 0;
  }
  cachetext = convday(dayweek,1);
  remindText = '明日は';
}
if (dayweek == 0 || dayweek == 6){
    dayweek = 0;
  }
}
else if (selectday){
  cachetext = selectday;
  if (selectday.length == 8){
  datetext = selectday;
  selectday = convdate(selectday);
}
else if (selectday.length == 1){
  datetext = convdate(selectday);
}
  remindText = 'その日は';
  dayweek = convday(selectday,0);
  if (dayweek == 0 || dayweek == 6){
    dayweek = 0;
  }
}
if (dayweek == 1){
  //monday
  remindText += montime;
}
else if (dayweek == 2){
  //tueday
  remindText += tuetime;
}
else if (dayweek == 3){
  //wedday
  remindText += wedtime;
}
else if (dayweek == 4){
  //thuday
  remindText += thutime;
}
else if (dayweek == 5){
  //friday
  remindText += fritime;
}
else if (dayweek == 0){
//holiday
remindText += holi;
}
remindText += '\n\n\n' + getDatePlan(cachetext);
  return remindText;
}

function doPost(e) {
  var webhookData = JSON.parse(e.postData.contents).events[0];
  var message, replyToken, replyText, userId;
  message = webhookData.message.text.split("\n");
  replyToken = webhookData.replyToken;
  userId = webhookData.source.userId;
  var processing = message[0];
  var planDate = message[1];
  var plan = message[2];
  var row = getLastRow();
  
  switch (processing) {
    case 'r':
    case 'R':
      replyText = setDate(planDate, plan, row);
      break;
    case 'n':
    case 'N':
      replyText = cancel(planDate, plan);
      break;
    case 'c':
    case 'C':
      replyText = getTodayAndNextDayMessage(planDate);
      break;
    case 's':
    case 'S':
      replyText = getDatePlan(planDate);
      break;
    case 't':
    case 'T':
      replyText = timesche(planDate);
      break;
    case 'h':
    case 'H':
      replyText = help();
      break;
    case 'e':
    case 'E':
      replyText = exchange(planDate);
      break;
    case 'f':
    case 'F':
      if (planDate > 0){
        replyText = search(planDate);
        replyText += '\n\nFinish';
      }
      else{
        replyText = '1以上の整数を送信してください';
      }
      break;
    default:
      replyText = incorrectcommand;
      break;
  }
  return sendLineMessageFromReplyToken(replyToken, replyText);
}

function exchange(data){
  var text;
  if (data.length == 1){
    text = '次の' + data + '曜日は' + formatDateForDisplay(convdate(data)) + 'です。';
  }
  else if (data.length == 8){
    text = formatDateForDisplay(data) + 'は' + convdate(data) + '曜日です。';
  }
  return text;
}

function help(){
  return helptext;
}

function cancel(date,plan) {
  var daytext;
    if (date.length == 1){
      daytext = date;
      date = convdate(date);
  }
  else if (date.length == 8){
    daytext = convdate(date);
  }
  else{
    return incorrectformat;
  }
 deleteRowOfDateAndPlan(date, plan);
  return formatDateForDisplay(String(date)) + ' (' + daytext + ') ' + 'の' + plan + 'を削除しました。';
}

function searchPlans(date) {
 var data = sheet.getDataRange().getValues();
 var plans = [];
 for (var i = 0; i < data.length; i++) {
   if (data[i][0] == date) {
     plans.push(i + 1);
   }
 }
  return plans;
}

function getFromRowAndLine(sheetName, row) {
 var data = sheet.getDataRange().getValues();
 return data[row - 1][1];
}

function setFromRowAndLine(val, row, line) {
 sheet.getRange(row + 1, line + 1).setValue(val);
}

function getLastRow() {
  return sheet.getLastRow();
}

function deleteRowOfDateAndPlan(date, plan) {
  var lastRow = getLastRow();
  for (var i = 1; i <= lastRow; i++) {
    if (sheet.getRange(i, 1).getValue() == date && sheet.getRange(i, 2).getValue() == plan) {
      sheet.deleteRows(i);
    }
  }
}

function deleteRowOfDate(date) {
  var lastRow = sheet.getDataRange().getLastRow();
  for (var i = 1; i <= lastRow; i++) {
    if (sheet.getRange(i, 1).getValue() == date) {
      sheet.deleteRows(i);
    }
  }
}

var i = 0;
var halfnum = 0;
var rem = 0;
var isPrime = 0;
var result = '';
var cachei = 0;
var isEnd = 0;

function search(num){
  result = '['+num+']\n\n';
halfnum = num / 2;
  isEnd = 0;
  isPrime = 0;
  if (num < 1 || num == undefined){
    return '1以上が送信されなかったため終了します。'
  }
   if (num == 1 || num == 2){
     return num+'は素数';
   }
  for (i = 2;i <= halfnum;i++){
    cachei = i;
    rem = num % cachei;
    if(rem == 0){
      result += cachei;
      isPrime = 1;
      cachenum = num;
      if (isEnd == 0){
      search2(num / cachei);
      }
    }
    else{
      continue;
    }
  }
  if(isPrime == 0){
    result = num + 'は素数';
    return result;
  }
  else if (isPrime == 1){
    return result;
  }
}

function search2(spnum){
halfnum = spnum / 2;
  for (i = 2;i <= spnum;i++){
   if (i > 2 && (i % 2) == 0){
	    continue;
    }
    if (halfnum < i){
      isEnd = 1;
      result += '\n' + spnum;
      break;
    }
    cachei = i;
    rem = spnum % cachei;
    if(rem == 0){
      result += '\n' + cachei;
      search2(spnum / cachei);
      break;
    }
    else{
      continue;
    }
  }
}

//Copyright (c) 2023 rsu-Suba
//This software is released under the MIT License, see LICENSE.
