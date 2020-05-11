function getUrl(userid, childid, target, targetid=0) {
    switch (target) {
    case "change_password":     return '/accounts/password_change/';
    case "children":            return '/children/';
    case "child_add":           return '/children/add/';
    case "child_edit":          return '/children/' + targetid + '/edit/';
    case "settings":            return '/settings/' + userid + '/';
    case "foods":               return '/foods/';
    case "foods_add":           return '/foods/add/';
    case "foods_edit":          return '/foods/edit/' + targetid + '/';
    case "diapercontents":      return '/diapercontents/';
    case "diapercontents_add":  return '/diapercontents/add/';
    case "diapercontents_edit": return '/diapercontents/edit/' + targetid + '/';
    case "sleepphases_quickadd": return '/' + childid + '/sleep/quickadd/';
    case "sleepphases":         return '/' + childid + '/sleep/';
    case "sleepphases_add":     return '/' + childid + '/sleep/add/';
    case "sleepphases_edit":    return '/' + childid + '/sleep/edit/' + targetid + '/';
    case "sleepphases_delete":  return '/' + childid + '/sleep/delete/' + targetid + '/';
    case "measurements":        return '/' + childid + '/measurements/';
    case "measurements_add":    return '/' + childid + '/measurements/add/';
    case "measurements_edit":   return '/' + childid + '/measurements/edit/' + targetid + '/';
    case "measurements_delete": return '/' + childid + '/measurements/delete/' + targetid + '/';
    case "meals":               return '/' + childid + '/meals/';
    case "meals_add":           return '/' + childid + '/meals/add/';
    case "meals_edit":          return '/' + childid + '/meals/edit/' + targetid + '/';
    case "meals_delete":        return '/' + childid + '/meals/delete/' + targetid + '/';
    case "diapers":             return '/' + childid + '/diapers/';
    case "diapers_add":         return '/' + childid + '/diapers/add/';
    case "diapers_edit":        return '/' + childid + '/diapers/edit/' + targetid + '/';
    case "diapers_delete":      return '/' + childid + '/diapers/delete/' + targetid + '/';
    case "events":              return '/' + childid + '/events/';
    case "events_add":          return '/' + childid + '/events/add/';
    case "events_edit":         return '/' + childid + '/events/edit/' + targetid + '/';
    case "events_delete":       return '/' + childid + '/events/delete/' + targetid + '/';
    case "diary":               return '/' + childid + '/diary/';
    case "diary_add":           return '/' + childid + '/diary/add/';
    case "diary_edit":          return '/' + childid + '/diary/edit/' + targetid + '/';
    case "diary_delete":        return '/' + childid + '/diary/delete/' + targetid + '/';
    case "summary":             return '/' + childid + '/summary/';
    case "plot_summary":        return '/' + childid + '/plot/summary/';
    case "check_data":          return '/' + childid + '/data/check/';
    case "summary_data_graph":  return '/' + childid + '/data/summary/graph/';
    case "summary_data_list":   return '/' + childid + '/data/summary/list/';
    case "histogram_data":      return '/' + childid + '/data/histogram/';
    case "measurement_data":    return '/' + childid + '/data/measurements/';
    case "percentile_data":     return '/' + childid + '/data/percentiles/' + targetid + '/';
    case "child":               return '/' + childid + '/';
    case "index":               return '/index/';

    default:
        console.log("Invalid urls requested: " + target);
        break;
    }
}

export default getUrl;