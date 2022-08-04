import _ from "lodash";

export class Utilities {
    static toSentenceCase(sentence: string) {
        return sentence[0].toUpperCase() + sentence.slice(1).toLowerCase();
    }

    static capitalize(sentence: string) {
        const words = sentence.split("_");
        return words.map((word: string) => `${_.capitalize(word)}`).join(" ");
    }
}
