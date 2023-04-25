"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.distance = void 0;
const timed_cache_1 = __importDefault(require("timed-cache"));
const fastest_levenshtein_1 = require("fastest-levenshtein");
const cache = new timed_cache_1.default();
const distance = (word1, word2) => {
    const cachedVal = cache.get(`${word1}--${word2}`);
    if (cachedVal !== undefined) {
        return cachedVal;
    }
    const compotedDistance = (0, fastest_levenshtein_1.distance)(word1, word2);
    cache.put(`${word1}--${word2}`, compotedDistance);
    return compotedDistance;
};
exports.distance = distance;
