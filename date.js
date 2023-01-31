exports.getDay = getDay;

function getDay(){
  var today = new Date();
  var currentday = today.getDay();

  var options = {weekday:"long", day:"numeric", month:"long"};
  var day = today.toLocaleDateString("en-US",options);
  return day;
}

exports.getDate = getDate;


function getDate(){
  var today = new Date();
  var currentday = today.getDay();

  var options = {weekday:"long"};
  var day = today.toLocaleDateString("en-US",options);
  return day;
}
