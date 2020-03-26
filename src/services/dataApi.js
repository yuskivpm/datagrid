import serverRequest from './serverData';

const delay = (delayTimer = 1000) => new Promise(resolve => setTimeout(resolve, delayTimer));

const fetchData = (rowCount, loadUiConst, onFinishFetching, fakerSeed) =>
  delay().then(() => serverRequest(rowCount, loadUiConst, onFinishFetching, fakerSeed));

export default fetchData;
