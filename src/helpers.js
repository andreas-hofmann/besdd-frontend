import moment from 'moment';

function secToHours(val) {
  var value = parseFloat(val);
  return (value / 3600).toFixed(1);
}

function secToMinutes(val) {
  var value = parseFloat(val);
  return (value / 60).toFixed(1);
}

function durationSecs(from, to) {
  let ms = parseFloat(moment(to)-moment(from));

  if (isNaN(ms))
    return 0;

  return ms/1000;
}

function padLeading(str, len, pad) {
  let s = String(str);
  while (s.length < len) {
    s = String(pad) + s;
  }
  return s;
}

function durationHours(from, to) {
  let secs = durationSecs(from, to);
  let hours = secToHours(secs);
  let minutes = parseFloat(secToMinutes(secs));

  if (!minutes)
    return "";

  return String(Math.floor(hours)) + ":" + padLeading(Math.floor(minutes % 60), 2, 0);
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