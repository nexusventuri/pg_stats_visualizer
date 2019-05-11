import Latinize from './Latinize'
const uuidTypes = ['uuid']
const dateTypes = ["date", "timestamp without time zone", "timestamp with time zone", "time without time zone"]
const intTypes = ["bigint", "smallint", "oid", "integer"]
const floatTypes = ["money", "real","numeric", "double precision"]
const booleanTypes = ['boolean']

const numberRegex = /^[0-9]+$/

export default class HistogramMap {
  constructor() {
    this.histogram = new Map();
  }

  add(key, value) {
    if(typeof key != 'number') {
      raise('The key needs to be a number');
    }

    let inserted = false
    while(!inserted) {
      if(!this.histogram.has(key)) {
        this.histogram.set(key, value);
        inserted = true;
      } else {
        key++
      }
    }
  }

  find(key) {
    return this.histogram.get(key);
  }

  get keys() {
    return [...this.histogram.keys()];
  }

  formatter = (value) => {
    return this.histogram.get(value);
  }

  labelFormatter = (value) => {
    return this.histogram.get(value);
  }

  cumulativePercentage() {
    let percentage = 100.0 / (this.histogram.size - 1);
    let cumulativePercentage = [percentage];
    this.keys.forEach((value, index) => { cumulativePercentage.push(cumulativePercentage[index] + percentage)})
    return cumulativePercentage;
  }

  static fromHistogramBounds(histogramBounds, dataType) {
    let map = new HistogramMap();

    if(dateTypes.indexOf(dataType) >= 0) {
      histogramBounds.forEach(val => map.add(new Date(val).getTime(), val));
    } else if(uuidTypes.indexOf(dataType) >= 0) {
      histogramBounds.forEach(val => map.add(HistogramMap.uuidValueDistance(val), val));
    } else if(intTypes.indexOf(dataType) >= 0) {
      histogramBounds.forEach(val => map.add(parseInt(val), val));
    } else if (floatTypes.indexOf(dataType) >= 0) {
      histogramBounds.forEach(val => map.add(parseFloat(val), val));
    } else if (booleanTypes.indexOf(dataType) >= 0) {
      histogramBounds.forEach(val => map.add(val== 't' ? 1 : 0, val));
    } else {
      HistogramMap.buildMapForStringTypes(map, histogramBounds);
    }
    return map;
  }

  static uuidValueDistance(uuid) {
    return parseInt(`0x${uuid}`);
  }

  static buildMapForStringTypes(map, values) {
    let cleanedValues = HistogramMap.cleanStringsForOrdering(values);

    if(cleanedValues.every(val => val.match(numberRegex))) {
      cleanedValues.forEach((val, index) => map.add(HistogramMap.numberValueDistance(val), values[index]))
    } else {
      let distinctStrings = HistogramMap.removeCommonSubstring(cleanedValues);
      cleanedValues.forEach((val, index) => map.add(HistogramMap.genericStringValueDistance(distinctStrings[index]), values[index]));
    }
  }

  static cleanStringsForOrdering(values) {
    let r = values.map(val => Latinize.convert(val).toLowerCase().replace(/[^a-z0-9]+/g, ''))
    console.log(r)
    return r
  }

  static numberValueDistance(string) {
    let result = 0

    for (let i = 0; i < 9; ++i) {
      let charCode = string.charCodeAt(i) || '0';
      result += parseInt(charCode);
      result *= 10;
    }
    return result;
  }

  static removeCommonSubstring(values) {
    let firstString = values[0];

    let highIndex = 1;
    let substring = firstString.substring(0, highIndex);

    while(values.every(val => val.startsWith(substring)) && highIndex < firstString.length) {
      console.log(highIndex);
      highIndex++;
      substring = firstString.substring(0, highIndex);
    }

    highIndex--;
    return values.map(val => val.substring(highIndex));
  }

  static genericStringValueDistance(string) {
    let result = 0;
    for (let i = 0; i < 9; ++i) {
      let charCode = string.charCodeAt(i) || 0;
      if(charCode >= 97) { // any char between a-z
        result += charCode - 97 + 11;
      } else if(charCode == 0) { // no char available
        result += 0
      } else { // numeric char
        result += charCode - 48 + 1;
      }
      result *= 36;
    }
    return result;
  }
}
