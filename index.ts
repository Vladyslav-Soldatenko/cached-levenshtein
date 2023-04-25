import Cache from 'timed-cache';
import { distance as fastDistance } from "fastest-levenshtein";

const cache = new Cache();
export const distance = (word1:string, word2:string):number =>{
    const cachedVal = cache.get(`${word1}--${word2}`);

    if(cachedVal!==undefined){
        
        return cachedVal as number
    }
    
    const compotedDistance = fastDistance(word1,word2);
    cache.put(`${word1}--${word2}`,compotedDistance);

    return compotedDistance
}