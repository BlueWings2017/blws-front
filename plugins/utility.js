const dayjs = require("dayjs");

const dateRangeKey = {
  CYC_YEAR: "year",
  CYC_MONTH: "month",
  CYC_DAY: "day",
  CYC_HOUR: "hour"
};

const Utility = () => {
  const getStore = self => {
    const store = self.$store;
    return store;
  };

  const setFormatDate = (value, formatType) => {
    if (value) {
      const date = value === "today" ? dayjs() : dayjs(value);
      return value ? date.format(formatType) : null;
    } else {
      return null;
    }
  };

  const setFormatDecimal = (value, num, defaultVal) => {
    let returnVal = null;
    if (defaultVal && !value) {
      let defaultVal = "0.";
      for (let i = 0; i < num; i++) {
        defaultVal += "0";
      }
      returnVal = defaultVal;
    } else if (value) {
      returnVal = value.toFixed(num);
    }
    return returnVal;
  };

  const setFormatInt = value => {
    return value
      ? String(Math.floor(value)).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      : null;
  };

  const setFormatIntDecimal = (value, num) => {
    let numComma, commaSplit;
    let defaultVal = "0.";
    for (let i = 0; i < num; i++) {
      defaultVal += "0";
    }
    if (value) {
      const vv = setFormatDecimal(value, num);
      commaSplit = vv.split(".");
      numComma = commaSplit[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    return value ? numComma + "." + commaSplit[1] : defaultVal;
  };

  const setFormatNumber = value => {
    return value ? value.toLocaleString("ko-KR") : null;
  };

  const toFixedAndLocaleString = (value, num, locale) =>{
    num = num != null ? num : 2;
    locale = locale != null ? locale : 'ko-KR';
    value = value != null ? parseFloat(value) : 0;

    var val1 = (value.toLocaleString(locale)).split('.')[0];
    var val2 = (value.toFixed(num)).split('.')[1];

    return val1 + '.' + val2;
  };

  const toCamelCase = value => {
    return value
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
  };

  const copyObj = obj => {
    const result = {};
    for (let key in obj) {
      if (typeof obj[key] === "object") {
        result[key] = copyObj(obj[key]);
      } else {
        result[key] = obj[key];
      }
    }
    return result;
  };

  const getKeyByValue = (obj, val) => {
    return Object.keys(obj).find(key => obj[key] === val);
  };

  const getValueByObject = (obj, defaultKey, defaultData, valueKey) => {
    let returnData = "";
    if (obj.length > 0) {
      const list = obj.filter(item => item[defaultKey] === defaultData);
      if (list.length > 0) {
        returnData = list[0][valueKey];
      }
    }
    return returnData;
  };

  const prependZero = (max, val) => {
    let zeroStr = "";
    let strVal = String(val);
    for (let i = 0; i < max - strVal.length; i++) {
      zeroStr += "0";
    }
    return zeroStr + strVal;
  };

  return {
    setFormatDate, // 날짜 타입
    setFormatDecimal, // 소수점 (버림, 반올림, 올림 의 정책이 있다면 수정필요)
    setFormatInt, // 천단위 콤마
    setFormatIntDecimal, // 소수점 포함 천단위 콤마
    setFormatNumber, // 천단위 콤마 & 소수점 (들어오는 값 그대로,, <= 원하는 자릿구 맞추려면 추가해야 함, setFormatDecimal와 함께 사용해도 되기도,,),
    toCamelCase, // 카멜케이스로 변환
    copyObj, // 오브젝트 deep 카피
    getKeyByValue,
    getValueByObject,
    prependZero,
    toFixedAndLocaleString
  };
};

export default Utility();
