const dayjs = require("dayjs");

const DateUtility = () => {
  
  const addDate = (val, type, date) => {
    let returnDt = null;
    const myDate = !date ? dayjs() : dayjs(date);
    returnDt = myDate.add(val || 0, "day");
    if (type === "d") returnDt = returnDt.format("YYYYMMDD");
    else if (type) returnDt = returnDt.format(type);
    return returnDt;
  };

  const addWeek = (val, type, date) => {
    let returnDt = null;
    const myDate = !date ? dayjs() : dayjs(date);
    returnDt = myDate.add(val || 0, "week");
    if (type === "d") returnDt = returnDt.format("YYYYMMDD");
    else if (type) returnDt = returnDt.format(type);
    return returnDt;
  };

  const addMonth = (val, type, date) => {
    let returnDt = null;
    const myDate = !date ? dayjs() : dayjs(date);
    returnDt = myDate.add(val || 0, "month");
    if (
      myDate.format("YYYYMMDD") === myDate.endOf("month").format("YYYYMMDD")
    ) {
      returnDt = returnDt.endOf("month");
    }
    if (type === "d") returnDt = returnDt.format("YYYYMMDD");
    else if (type) returnDt = returnDt.format(type);
    return returnDt;
  };

  const addYear = (val, type, date) => {
    let returnDt = null;
    const myDate = !date ? dayjs() : dayjs(date);
    returnDt = myDate.add(val || 0, "year");
    if (type === "d") returnDt = returnDt.format("YYYYMMDD");
    else if (type) returnDt = returnDt.format(type);
    return returnDt;
  };

  const diff = (fromDt, toDt, type) => {
    let returnDt = null;
    if (fromDt && toDt) {
      const myFromDt = fromDt === "today" ? dayjs() : dayjs(fromDt);
      const myToDt = toDt === "today" ? dayjs() : dayjs(toDt);
      let myType = "days";
      switch (type) {
        case "w":
          myType = "weeks";
          break;
        case "m":
          myType = "months";
          break;
        case "y":
          myType = "year";
          break;
        default:
      }
      returnDt = myToDt.diff(myFromDt, myType);
    }
    return returnDt;
  };

  const format = (d, f) => {
    let returnDt = null;
    const myDate = !d ? dayjs() : dayjs(d);
    const myFormat = f || "YYYYMMDD";
    returnDt = myDate.format(myFormat);
    return returnDt;
  };

  const getDate = strDate => {
    const myDate = !strDate ? dayjs() : dayjs(strDate);
    return myDate
      .hour(0)
      .minute(0)
      .second(0);
  };

  const getLastDay = (type, date) => {
    let returnDt = null;
    const myDate = !date || date.length < 4 ? dayjs() : dayjs(date);
    returnDt = myDate.endOf("month");
    if (type === "d") returnDt = returnDt.format("YYYYMMDD");
    else if (type) returnDt = returnDt.format(type);
    return returnDt;
  };

  return {
    addDate,
    addWeek,
    addMonth,
    addYear,
    diff,
    format,
    getDate,
    getLastDay
  };
};

export default DateUtility();
