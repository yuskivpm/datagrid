import faker from 'faker';
import {
  defaultFixedRowsColumnWidth,
  defaultHeaderRowHeight,
  defaultRowHeight,
  headers,
} from './const';

const leadingZero = number => (number < 10 ? `0${number}` : number);

const getDateTimeValue = (dateTime, showTime = false) =>
  `${dateTime.getFullYear()}-${leadingZero(1 + dateTime.getMonth())}-${leadingZero(
    dateTime.getDate()
  )}${
    showTime ? ` ${leadingZero(dateTime.getHours())}:${leadingZero(dateTime.getMinutes())}` : ''
  }`;

export const generateFakeData = id => {
  const val = {
    id,
    name: faker.name.findName(), // string
    account: faker.finance.accountName(), // string
    role: headers.role.values[faker.random.number(headers.role.values.length - 1)], // enum
    rank: faker.random.number(100), // number
    isActive: faker.random.boolean(), // boolean
    involved: faker.date.past(3).getTime(), // instant
    participation: faker.random.boolean(), // boolean
    jobTitle: faker.name.jobTitle(), // string
    companyName: faker.company.companyName(), // string
    birthDate: getDateTimeValue(faker.date.past(40, new Date(2002, 1, 1))), // datetime
    hobbies: headers.hobbies.values[faker.random.number(headers.hobbies.values.length - 1)], // enum
    location: { city: faker.address.city(), zipcode: faker.address.zipCode() }, // object
  };
  return val;
};

const MAX_ROW_IN_ITERATION = 100;

export default function serverRequest(
  recordsCount = 1000,
  loadUiConst,
  onFinishFetching,
  fakerSeed,
  localRows = []
) {
  if (fakerSeed && !localRows.length) {
    faker.seed(fakerSeed);
  }
  const curIterationRowCount = Math.min(MAX_ROW_IN_ITERATION, recordsCount);
  const localRecordsCount = recordsCount - curIterationRowCount; // to avoid eslint no-param-reassign
  const rows = localRows.concat(
    [...new Array(curIterationRowCount)].map((_, index) =>
      generateFakeData(1 + index + localRecordsCount)
    )
  );
  if (localRecordsCount) {
    setTimeout(() =>
      serverRequest(localRecordsCount, loadUiConst, onFinishFetching, fakerSeed, rows)
    );
  } else {
    let result = { rows, defaultFixedRowsColumnWidth, defaultHeaderRowHeight, defaultRowHeight };
    if (loadUiConst) {
      result = Object.assign(result, {
        columnOrder: Object.keys(headers).map(columnName => ({ columnName, isVisible: true })),
      });
    }
    onFinishFetching(result);
  }
}
