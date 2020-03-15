export const defaultFixedRowsColumnWidth = 120;
export const defaultHeaderRowHeight = 90;
export const defaultRowHeight = 70;

export const types = {
  NUMBER: 'number',
  STRING: 'string',
  DATETIME: 'datetime',
  INSTANT: 'instant',
  ENUM: 'enum',
  OBJECT: 'object',
  BOOLEAN: 'boolean',
};

export const typesList = [
  types.NUMBER,
  types.STRING,
  types.DATETIME,
  types.INSTANT,
  types.ENUM,
  types.OBJECT,
  types.BOOLEAN,
];

export const headers = {
  name: {
    type: types.STRING,
    displayName: 'Name',
    colWidth: 200,
  },
  role: {
    type: types.ENUM,
    displayName: 'Role',
    colWidth: 150,
    values: ['mentor', 'student', 'activist'],
  }, // enum
  rank: {
    type: types.NUMBER,
    displayName: 'Rank',
    colWidth: 150,
  },
  isActive: {
    type: types.BOOLEAN,
    displayName: 'Is active',
    colWidth: 150,
    values: ['no', 'yes'],
  }, // boolean
  involved: {
    type: types.INSTANT,
    displayName: 'Involved',
    colWidth: 200,
  },
  participation: {
    type: types.BOOLEAN,
    displayName: 'Participation',
    colWidth: 200,
    values: ['free', 'hired'],
  }, // boolean
  jobTitle: {
    type: types.STRING,
    displayName: 'Job',
    colWidth: 200,
  },
  companyName: {
    type: types.STRING,
    displayName: 'Company',
    colWidth: 200,
  },
  account: {
    type: types.STRING,
    displayName: 'Account',
    colWidth: 200,
  },
  birthDate: {
    type: types.DATETIME,
    displayName: 'Birth date',
    colWidth: 200,
  },
  hobbies: {
    type: types.ENUM,
    displayName: 'Hobbies',
    colWidth: 200,
    values: [
      'fishing',
      'football',
      'tourism',
      'hunting',
      'theater',
      'calligraphy',
      'modding',
      'dance',
      'baking',
      'catering',
    ],
  }, // enum
  location: {
    type: types.OBJECT,
    displayName: 'Location',
    colWidth: 250,
    values: { city: types.STRING, zipcode: types.NUMBER },
  }, // object
};
