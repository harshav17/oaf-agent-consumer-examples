import * as dotenv from "dotenv";
dotenv.config();

import dedent from "dedent";
import { OafOptions, callOaf } from "oaf-agent";
import { ChatCompletionFunctions, ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum, Configuration } from "openai";
import { Writable } from "stream";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

type weatherProps = {
    lat: number;
    lon: number;
}
export async function getCurrentWeather(props: weatherProps) {
    const { lat, lon } = props;
    const URL = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${process.env.OPEN_WEATHER_API_KEY}`
    console.log(URL)
    const res = await fetch(URL)
    const data = await res.json();
    return JSON.stringify({
        temp: data.current.temp,
        feels_like: data.current.feels_like,
        humidity: data.current.humidity,
        wind_speed: data.current.wind_speed,
    });
}

const functionsForModel: ChatCompletionFunctions[] = [
    {
        name: 'getCurrentWeather',
        description: 'Gives the current weather at a location',
        parameters: {
            type: 'object',
            properties: {
                lat: {
                    type: 'number',
                },
                lon: {
                    type: 'number',
                },
            },
            required: ['lat', 'lon'],
        },
    },
]

const finString = "[finished]";

const zero_cot = dedent`
    You are wardrobe assistant. Given the city of the user, you must recommend the user what to wear.

    Respond to all future prompts with ${finString}, once you think you are finished with the story.
`;

async function main() {
    let messages: ChatCompletionRequestMessage[] = [
        {
            role: ChatCompletionRequestMessageRoleEnum.System,
            content: zero_cot,
        },
        {
            role: ChatCompletionRequestMessageRoleEnum.User,
            content: "San Francisco",
        }
    ];
    const stream = new Writable({
        write(chunk, encoding, callback) {
            // print without newline
            process.stdout.write(chunk.toString());
            callback();
        },
    });
    stream.on('error', (err) => {
        console.error(err);
    });

    const funs: Record<string, (...args: any[]) => any> = {
        getCurrentWeather: getCurrentWeather
    };
    
    const oafOptions: OafOptions = {
        finString,
        funcs: funs,
        funcDescs: functionsForModel,
    }
    await callOaf(messages, stream, configuration, oafOptions);
}

main();