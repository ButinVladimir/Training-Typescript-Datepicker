import { Formatter } from "../formatter";
import { IDatepickerWindow, DatepickerWindow } from "../datepicker-window";


export interface IDatepicker {
    day: number;
    month: number;
    year: number;

    changeDate(): void;
};

class Datepicker implements IDatepicker {
    constructor(private _element: HTMLElement,
                private _year: number,
                private _month: number,
                private _day: number,
                private _formatter: Formatter,
                private _datepickerWindow: IDatepickerWindow) {
        this._month--;

        this._element.addEventListener("datepicker.show", (e: CustomEvent) => {
            e.stopPropagation();

            this._datepickerWindow.show(
                this,
                this._element.offsetLeft + window.scrollX + "px",
                this._element.offsetTop + this._element.clientHeight + 4 + window.scrollY + "px"
            );
        });
    }

    public get day(): number {
        return this._day;
    }

    public get month(): number {
        return this._month;
    }

    public get year(): number {
        return this._year;
    }

    public changeDate(): void {
        this._year = this._datepickerWindow.year;
        this._month = this._datepickerWindow.month;
        this._day = this._datepickerWindow.day;

        let changeDateEvent = new CustomEvent("datepicker.change", {detail: this._formatter(this._year, this._month + 1, this._day)});
        this._element.dispatchEvent(changeDateEvent);
        this._datepickerWindow.hide();
    }
}

let datepickerWindow: IDatepickerWindow | null = null;

export default function(element: HTMLElement, year: number, month: number, day: number, formatter: Formatter): IDatepicker {
    datepickerWindow = datepickerWindow || new DatepickerWindow();

    return new Datepicker(element, year, month, day, formatter, datepickerWindow);
};
