// IFTTTにWebHookをPOSTする
function sendIFTTTWebHook(endpoint, value) {
  var message = {
    "value1":value
  };

  var options = {
    "method":"POST",
    "headers": {
      "Content-Type":"application/json"
    },
    "payload":JSON.stringify(message)
  };
  
  UrlFetchApp.fetch("https://maker.ifttt.com/trigger/" + endpoint + "/with/key/" + "ここにキーを入力", options);
}

// メイン
function main() {
  var sheet_record = SpreadsheetApp.openById('ここにidを入力').getSheetByName('フォームの回答');//記録速報のシート
  var k = String.fromCharCode(10);//改行
  
  var value_name = null;
  var value_competition = null;
  var value_date = null;
  var value_gender = null;
  var value_event = null;
  var value_round1 = null;//予選決勝
  var value_heat = null;
  var value_record = null;
  var value_wind = null;
  var value_round2 = null;//Q,q
  var value_pb = null;
  var value_comment = null;
  
  for(var i = sheet_record.getLastRow()-1; i > 0; --i){
    if(sheet_record.getRange(i, 16).getValue() == "t"){
      if(sheet_record.getRange(i+1, 16).getValue() == "t"){
        break;
      }
      //i+1は"t"が書き込まれてる行の一行下
      var values = sheet_record.getRange(i+1, 1, 1, 16).getValues();
      value_competition = values[0][1];
      value_date = values[0][2];
      value_name = values[0][3];
      value_gender = values[0][4];
      value_event = values[0][5];
      value_round1 = values[0][6];
      value_heat = values[0][7];
      value_record = values[0][8];
      value_wind = values[0][9];
      value_round2 = values[0][10];
      value_pb = values[0][11];
      value_comment = values[0][13];
      sheet_record.getRange(i+1, 16).setValue("t");
      break;
    }
  }
  
  if(value_name != null){
  
    if(value_date != ""){
      var high = Utilities.formatDate(value_date, 'Asia/Tokyo', 'M月d日') + " " + value_competition;
    }else{
      var high = "日付なし";
    }
    
    if(value_round1 == "記録会のため特になし" || value_round1 == "タイムレース決勝"){
      var middle = k + value_name + "が" + value_gender + value_event + "において" + value_heat + " " + value_record + " " + "でした";
    }else if(value_round1 == "決勝"){
      var middle = k + value_name + "が" + value_gender + value_event + value_round1 + "において" + value_heat + " " + value_record + " " + "でした";
    }else{
      var middle = k + value_name + "が" + value_gender + value_event + "において" + value_heat + " " + value_record + " " + value_round2 + "でした";
    }
    
    if(value_wind == "なし" || value_wind == ""){
      if(value_pb == "特になし"){
        var low = k + "";
      }else{
        var low = k + value_pb + "です";
      }
      
    }else{
      if(value_pb == "特になし"){
        var low = k + "風は" + value_wind + "です";
      }else{
        var low = k + "風は" + value_wind + "で" + value_pb + "です";
      }
    }
    
    if(value_comment.length < 50){
      var value = high + middle + low + k + value_comment + k + "旧フォームの回答です";
    }else{
      var value = high + middle + low + "旧フォームの回答です";
    }
    
    Logger.log(value);
    sendIFTTTWebHook("record", value);
  }
  
}
function main2() {
  var sheet_record = SpreadsheetApp.openById('ここにidを入力').getSheetByName('twitter');//記録速報のシート
  var k = String.fromCharCode(10);//改行
  
  var value_name = null;
  var value_competition = null;
  var value_date = null;
  var value_gender = null;
  var value_event = null;
  var value_round1 = null;//予選決勝
  var value_heat = null;
  var value_record = null;
  var value_wind = null;
  var value_round2 = null;//Q,q
  var value_pb = null;
  var value_comment = null;
  var value_dns = null;
  
  var twicol = sheet_record.getRange(2, 14).getValue();
  var namecol = sheet_record.getRange(2, 3, 999).getValues();
  
  for(var i = 0; i < 998; ++i){
    if(twicol == i + 1 && namecol[i] == ""){
      break;
    }
    if(twicol < i + 1 && namecol[i] == ""){
      
      //i+1は"t"が書き込まれてる行の一行下
      var values = sheet_record.getRange(i-twicol+2, 1, 1, 14).getValues();
      value_competition = values[0][0];
      value_date = values[0][1];
      value_name = values[0][2];
      value_gender = values[0][3];
      value_event = values[0][4];
      value_round1 = values[0][5];
      value_heat = values[0][6];
      value_record = values[0][7];
      value_wind = values[0][8];
      value_comment = values[0][10];
      value_dns = values[0][11];
      sheet_record.getRange(2, 14).setValue(twicol+1);
      if(value_record=="0:0'0.0"){
        value_record=value_dns;
      }
      
      break;
      
    }
  }
  
  if(value_name != null){
  
    if(value_date != ""){
      var high = Utilities.formatDate(value_date, 'Asia/Tokyo', 'M月d日') + " " + value_competition;
    }else{
      var high = "日付なし";
    }
    
    if(value_round1 == "記録会のため特になし" || value_round1 == "タイムレース決勝"){
      var middle = k + value_name + "が" + value_gender + value_event + "において" + value_heat + " " + value_record + " " + "でした";
    }else if(value_round1 == "決勝"){
      var middle = k + value_name + "が" + value_gender + value_event + value_round1 + "において" + value_heat + " " + value_record + " " + "でした";
    }else{
      var middle = k + value_name + "が" + value_gender + value_event + "において" + value_heat + " " + value_record + "でした";
    }
    
    if(value_wind == "なし" || value_wind == ""){
        var low = k + "";
    }else{
        var low = k + "風は" + value_wind + "です";
    }
    
    if(value_comment.length < 50){
      var value = high + middle + low + k + value_comment + k + "新フォームの回答です";
    }else{
      var value = high + middle + low + k + "新フォームの回答です";
    }
    
    Logger.log(value);
    sendIFTTTWebHook("record", value);
  }
  
}