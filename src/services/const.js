export const defaultFixedRowsColumnWidth = 120;
export const defaultHeaderRowHeight = 90;
export const defaultRowHeight = 70;

// aviable types list = ['number','string','datetime','instant','enum','object','boolean'];

export const headers = {
  // id: {
  //   type: 'number',
  //   displayName: 'id',
  //   colWidth: 150,
  // },
  name: {
    type: 'string',
    displayName: 'Name',
    colWidth: 200,
  },
  role: {
    type: 'enum',
    displayName: 'Role',
    colWidth: 150,
    values: ['mentor', 'student', 'activist'],
  }, // enum
  rank: {
    type: 'number',
    displayName: 'Rank',
    colWidth: 150,
  },
  isActive: {
    type: 'boolean',
    displayName: 'Is active',
    colWidth: 150,
    values: ['no', 'yes'],
  }, // boolean
  involved: {
    type: 'instant',
    displayName: 'Involved',
    colWidth: 200,
  },
  participation: {
    type: 'boolean',
    displayName: 'Participation',
    colWidth: 200,
    values: ['free', 'hired'],
  }, // boolean
  jobTitle: {
    type: 'string',
    displayName: 'Job',
    colWidth: 200,
  },
  companyName: {
    type: 'string',
    displayName: 'Company',
    colWidth: 200,
  },
  account: {
    type: 'string',
    displayName: 'Account',
    colWidth: 200,
  },
  birthDate: {
    type: 'datetime',
    displayName: 'Birth date',
    colWidth: 200,
  },
  hobbies: {
    type: 'enum',
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
    type: 'object',
    displayName: 'Location',
    colWidth: 250,
    values: { city: 'string', zipcode: 'number' },
  }, // object
};
