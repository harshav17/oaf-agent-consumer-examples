import { ChatCompletionFunctions } from "openai";

type sudokuProps = {
    solution: string;
}
export function validateSolution(props: sudokuProps) {
    const { solution } = props;
    if (solution.trim() == "") {
        return "no solution provided";
    }

    console.log("solution: " + solution);

    // given solution of style "2,*,*,6,*,5|*,*,6,*,1,2|*,5,1,*,*,3|3,*,4,*,*,6|*,3,5,*,*,1|*,*,2,*,3,4"
    // validate that there are no duplicate digits in any row, column or 2x2 subgrid

    // split into rows
    let rows = solution.split("|");

    // split each row into cells
    let cells = rows.map(row => row.split(","));

    // check that there are no duplicate digits in any row
    for (let row of cells) {
        let digits = row.filter(cell => cell != "*");
        if (digits.length != new Set(digits).size) {
            console.log("duplicate digits in row " + row);
            return "duplicate digits in row " + row;
        }
    }

    // check that there are no duplicate digits in any column
    for (let i = 0; i < cells.length; i++) {
        let digits = cells.map(row => row[i]).filter(cell => cell != "*");
        if (digits.length != new Set(digits).size) {
            console.log("duplicate digits in column " + i);
            return "duplicate digits in column " + i;
        }
    }
    return "";
}

export const functionsForModel: ChatCompletionFunctions[] = [
    {
        name: "validateSolution",
        description: "Validates whether a solution is correct. Solution should be in the pattern 3,*,*,2|1,*,3,*|*,1,*,3|4,*,*,1. You can use this method to validate intermedite solutions as well. Return empty if correcr OR description of what went wrong.",
        parameters: {
            type: "object",
            properties: {
                solution: {
                    type: "string",
                    description: "The solution to validate. For example, 3,*,*,2|1,*,3,*|*,1,*,3|4,*,*,1",
                },
            },
            required: ["solution"],
        },
    },
];