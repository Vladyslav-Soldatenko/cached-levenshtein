import Benchmark from "benchmark";
import { distance } from ".";
import { distance as fastesLevenshtein } from "fastest-levenshtein";
import fs from "fs";

const suite = new Benchmark.Suite();
const randomstring = (length:number) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const randomstringArr = (stringSize:number, arraySize:number) => {
  let i = 0;
  const arr = [];
  const randomString =  randomstring(stringSize) 

  for (i = 0; i < arraySize; i++) {
    arr.push(randomstring(stringSize));
  }
  return arr;
};

const arrSize = 1000;
if (!fs.existsSync("data.json")) {
  const data = [
    randomstringArr(4, arrSize),
    randomstringArr(8, arrSize),
    randomstringArr(16, arrSize),
    randomstringArr(32, arrSize),
    randomstringArr(64, arrSize),
    randomstringArr(128, arrSize),
    randomstringArr(256, arrSize),
    randomstringArr(512, arrSize),
    randomstringArr(1024, arrSize),
  ];

  fs.writeFileSync("data.json", JSON.stringify(data));
}

const data = JSON.parse(fs.readFileSync("data.json", "utf8"));

// BENCHMARKS
for (let i = 0; i < 9; i++) {
  const datapick = data[i];

  suite.add(`${i} - fastest-levenshtein`, () => {
    for (let j = 0; j < arrSize - 1; j += 2) {
      fastesLevenshtein(datapick[j], datapick[j + 1]);
    }
  })
  .add(`${i} - cached levenshtein`, () => {
    for (let j = 0; j < arrSize - 1; j += 2) {
      distance(datapick[j], datapick[j + 1]);
    }
  });
}

const results = new Map();
suite
// @ts-ignore
  .on("cycle", (event) => {
    console.log(String(event.target));
    if (results.has(event.target.name[0])) {
      results.get(event.target.name[0]).push(event.target.hz);
    } else {
      results.set(event.target.name[0], [event.target.hz]);
    }
  })
  .on("complete", () => {
    console.log(results);
  })
  // run async
  .run({ async: true });
