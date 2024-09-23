import moment from 'moment';
import 'moment/locale/zh-cn'; // 导入中文语言包

export default function getTime(date: Date) {
  moment.locale('zh-cn'); // 设置 Moment.js 的语言环境为中文

  let now = moment();
  let time = moment(date);
  let timeDiff = now.diff(time, 'days');

  if (timeDiff === 0) {
    // 当天 判断是上午还是下午
    if (time.hour() < 12) {
      return moment(date).format('上午 HH:mm');
    } else {
      return moment(date).format('下午 HH:mm');
    }
  } else if (timeDiff === 1) {
    // 昨天
    return moment(date).format('昨天 HH:mm');
  } else if (timeDiff < 7) {
    // 一周内 返回是周几
    return moment(date).format('dddd');
  } else {
    // 超过一周
    return moment(date).format('YYYY-MM-DD');
  }
}
