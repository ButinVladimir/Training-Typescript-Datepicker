import createDatepicker, { IDatepicker } from "./datepicker";
import { Formatter } from "./formatter";
require("script-loader!./custom-event-polyfill.js");


let formatter = (year: number, month: number, day: number): string => {
    return day + "." + month + "." + year;
};

// First input

let input1: HTMLInputElement = <HTMLInputElement> document.querySelector("#target1");
createDatepicker(input1, 2016, 11, 1, formatter);

input1.addEventListener("click", (e: CustomEvent) => {
    e.stopPropagation();

    input1.dispatchEvent(new CustomEvent("datepicker.show"));
});

input1.addEventListener("datepicker.change", (e: CustomEvent) => {
    e.stopPropagation();

    input1.value = e.detail;
});


// Second input

let input2: HTMLInputElement = <HTMLInputElement> document.querySelector("#target2");
createDatepicker(input2, 2016, 10, 1, formatter);

input2.addEventListener("click", (e: CustomEvent) => {
    e.stopPropagation();

    input2.dispatchEvent(new CustomEvent("datepicker.show"));
});

input2.addEventListener("datepicker.change", (e: CustomEvent) => {
    e.stopPropagation();

    input2.value = e.detail;
});
