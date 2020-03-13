import serverRequest from './serverData';

const delay = (delayTimer = 1000) => new Promise(resolve => setTimeout(resolve, delayTimer));

const fetchData = (rowCount, loadUiConst, onFinishFetching) =>
  delay().then(() => serverRequest(rowCount, loadUiConst, onFinishFetching));

export default fetchData;
