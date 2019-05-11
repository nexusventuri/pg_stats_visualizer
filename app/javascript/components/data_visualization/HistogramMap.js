const uuidTypes = ['uuid']
const dateTypes = ["date", "timestamp without time zone", "timestamp with time zone", "time without time zone"]
const intTypes = ["bigint", "smallint", "oid", "integer"]
const floatTypes = ["money", "real","numeric", "double precision"]
const booleanTypes = ['boolean']

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

  keys() {
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
    this.keys().forEach((value, index) => { cumulativePercentage.push(cumulativePercentage[index] + percentage)})
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
      histogramBounds.forEach(val => map.add(HistogramMap.genericStringValueDistance(val), val));
    }
    return map;
  }

  static uuidValueDistance(uuid) {
    return parseInt(`0x${uuid}`);
  }

  static genericStringValueDistance(string) {
    let validChars = string.toLowerCase().replace(/[^a-z0-9]+/g, '');

    let result = 0;
    for (let i = 0; i < 5; ++i) {
      let charCode = validChars.charCodeAt(i) || 0;
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
