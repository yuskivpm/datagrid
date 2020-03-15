// import it
const typesList = ['number','string','datetime','instant','enum','object','boolean'];
const DEFAULT_COLUMN_WIDTH=200;

const convertToObject=text=>{
  try {
    return JSON.parse(text);
  } catch (error) {
    return undefined;
  }
}

const assertError=(assert,msg,columnName,err)=>{
  if(!assert){
    err.push(`Error in column [${columnName}]: ${msg}`);
  }
};

const onSave=headeAsText=>{
  const parsedHeader=convertToObject(headeAsText);
  if(!parsedHeader){
    return {error:'Fail parsing header JSON'};
  }
  const err=[];
  const newHeader=Object.keys(parsedHeader).map(columnName=>{
    const curColumn=parsedHeader[columnName];
    if(!curColumn.displayName){
      curColumn.displayName=columnName;
    }
    if(!curColumn.displayName){
      curColumn.colWidth=DEFAULT_COLUMN_WIDTH;
    }
    assertError(curColumn.type,'"type" key not found',columnName,err);
    assertError(
      typesList.includes(curColumn.type),
      `Unknown "type" value ("${curColumn.type}"). Aviable types: [${typesList.join(', ')}]`,
      columnName,
      err
    );
    assertError(
      curColumn.type!=='boolean'||(curColumn.values&&curColumn.values.length===2),
      '"boolean" type must contain array with 2 strings in "values" key',
      columnName,
      err
    );
    assertError(
      curColumn.type!=='enum'||(curColumn.values&&curColumn.values.length>=2),
      '"enum" type must contain array with more than 3 strings in "values" key',
      columnName,
      err
    );
    if(!curColumn.faker||typeof curColumn.faker!=='string'){
    const fakerFunc=curColumn.faker.split('.');
    let fakerPoint=faker;
    assertError(
      fakerFunc.every(funcPart=>(fakerPoint=fakerPoint[funcPart])),
      'faker does not contain such function (${curColumn.faker})',
      columnName,
      err
    );
    }else{
      assertError(false,'"faker" key must contain string with function name',columnName,err);
    }
  });
}