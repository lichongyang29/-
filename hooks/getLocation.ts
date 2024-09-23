import * as Location from 'expo-location';

let getLocation = async (timeout = 2000) => {
  return new Promise((resolve, reject) => {
    let timer = setTimeout(() => {
      reject(new Error('实时位置请求超时'));
    }, timeout);

    Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    })
      .then((pos: any) => {
        clearTimeout(timer);
        resolve(pos);
      })
      .catch((err: any) => {
        clearTimeout(timer);
        reject(err);
      });
  });
};
export default getLocation;
