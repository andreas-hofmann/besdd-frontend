import moment from 'moment';

function secToHours(val) {
  var value = parseFloat(val);
  return (value / 3600).toFixed(1);
}

function durationSecs(from, to) {
  return (moment(to)-moment(from))/1000;
}

function durationHours(from, to) {
  return secToHours(durationSecs(from, to));
}

function localdate(utc) {
  if (utc === null) {
    return "";
  }
  return moment(utc).local().format("YYYY-MM-DD")
}

function localtime(utc) {
  if (utc === null) {
    return "";
  }
  return moment(utc).local().format("HH:mm")
}

function getTimestamp(date, time) {
  if (!date || !time) {
    return "";
  }

  const d = moment(date).format("YYYY-MM-DD");
  const dt = moment( d + " " + time );
  return dt.format("YYYY-MM-DD HH:mm");
}

function allItemsString(itemsArray) {
  let ret = ""
  for (const i in itemsArray) {
    if (i > 0)
      ret += ", ";
    ret += String(itemsArray[i])
  }
  return ret;
}

export { durationSecs, durationHours, localdate, localtime, secToHours, getTimestamp, allItemsString };