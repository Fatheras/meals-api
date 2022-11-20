import { Ingredient } from "./";

export class Meal {
    id: number;
    name: string;
    instructions: string;
    tags?: string[];
    thumbUrl: string;
    youtubeUrl: string;
    ingredients: Ingredient[];
}