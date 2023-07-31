type decimalProps = {
    value1: number;
    value2: number;
}
export function addDecimalValues(props: decimalProps) {
    const { value1, value2 } = props;
    let result = value1 + value2;
    console.log(value1 + " + " + value2 + " = " + result + " (decimal)");

    return value1 + " + " + value2 + " = " + result + " (decimal)";
}


type hexadecimalProps = {
    value1: string;
    value2: string;
}
export function addHexadecimalValues(props: hexadecimalProps) {
    const { value1, value2 } = props;
    let decimal1 = parseInt(value1, 16);
    let decimal2 = parseInt(value2, 16);

    let result = (decimal1 + decimal2).toString(16);
    console.log(value1 + " + " + value2 + " = " + result + " (hex)");
    
    return value1 + " + " + value2 + " = " + result + " (hex)";
}