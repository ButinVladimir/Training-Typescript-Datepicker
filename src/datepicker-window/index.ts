import { IDatepicker } from "../datepicker";

let template: string = require("./template.html");
require("./style.css");

/**
 * Months names
 */
const MONTHS_NAMES: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export interface IDatepickerWindow {
    day: number;
    month: number;
    year: number;

    show(datepicker: IDatepicker, posX: string, posY: string): void;
    hide(): void;
}

export class DatepickerWindow implements IDatepickerWindow {
    private _currentDatepicker: IDatepicker;

    private _day: number = 0;
    private _month: number = 0;
    private _year: number = 0;

    private _currentDay: number;
    private _currentMonth: number;
    private _currentYear: number;

    private _datepickerWindow: HTMLElement;
    private _prevMonthButton: HTMLElement;
    private _nextMonthButton: HTMLElement;
    private _monthCaption: HTMLElement;
    private _daysContent: HTMLElement;

    constructor() {
        let todayDate = new Date();
        this._currentDay = todayDate.getDate();
        this._currentMonth = todayDate.getMonth();
        this._currentYear = todayDate.getFullYear();
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

    public show(datepicker: IDatepicker, posX: string, posY: string): void {
        if (!this._datepickerWindow) {
            this.renderWindow();
            this.registerHandlers();
        }

        this._currentDatepicker = datepicker;
        this._datepickerWindow.style.display = "block";

        this._datepickerWindow.style.left = posX;
        this._datepickerWindow.style.top = posY;

        this._day = datepicker.day;
        this._month = datepicker.month;
        this._year = datepicker.year;

        this.renderMonthCaption();
        this.renderDaysContent();
    }

    public hide() {
        this._datepickerWindow.style.display = "none";
    }

    private renderWindow() {
        let datepickerWindow = document.createElement("div");
        this._datepickerWindow = datepickerWindow;
        datepickerWindow.classList.add("datepicker-window");
        datepickerWindow.innerHTML = template;

        this._prevMonthButton = <HTMLElement> datepickerWindow.querySelector(".datepicker-prev-month-button");
        this._nextMonthButton = <HTMLElement> datepickerWindow.querySelector(".datepicker-next-month-button");

        this._monthCaption = <HTMLElement> datepickerWindow.querySelector(".datepicker-month-caption");
        this._daysContent = <HTMLElement> datepickerWindow.querySelector(".datepicker-days tbody");

        document.body.appendChild(datepickerWindow);
    }

    private registerHandlers() {
        this._datepickerWindow.addEventListener("click", (e: CustomEvent) => {
            e.stopPropagation();
        });

        document.addEventListener("click", (e: CustomEvent) => {
            e.stopPropagation();

            this.hide();
        });

        this._prevMonthButton.addEventListener("click", (e: CustomEvent) => {
            e.stopPropagation();
            e.preventDefault();

            this.prevMonth();
        });

        this._nextMonthButton.addEventListener("click", (e: CustomEvent) => {
            e.stopPropagation();
            e.preventDefault();

            this.nextMonth();
        });

        this._daysContent.addEventListener("click", (e: CustomEvent) => {
            e.stopPropagation();
            e.preventDefault();

            let day = +(<HTMLElement> e.target).getAttribute("date-day");
            if (day !== 0) {
                this._day = day;

                if (this._currentDatepicker) {
                    this._currentDatepicker.changeDate();
                }
            }
        });
    }

    private prevMonth(): void {
        this._month--;
        if (this._month < 0) {
            this._month = 11;
            this._year--;
        }

        this.renderMonthCaption();
        this.renderDaysContent();
    }

    private nextMonth(): void {
        this._month++;
        if (this._month >= 12) {
            this._month = 0;
            this._year++;
        }

        this.renderMonthCaption();
        this.renderDaysContent();
    }

    private renderMonthCaption(): void {
        this._monthCaption.innerHTML = MONTHS_NAMES[this._month] + " " + this._year;
    }

    private renderDaysContent(): void {
        let row: HTMLTableRowElement = document.createElement("tr"),
            dayOfWeek: number = (new Date(this._year, this._month, 1)).getDay(),
            daysInMonth = (new Date(this._year, this._month + 1, 0)).getDate();

        this._daysContent.innerHTML = "";

        for (let offset: number = 0; offset < dayOfWeek; offset++) {
            row.appendChild(this.renderEmptyDayCell());
        }

        for (let day: number = 1; day <= daysInMonth; day++) {
            row.appendChild(this.renderDayCell(day));
            dayOfWeek++;

            if (dayOfWeek === 7) {
                this._daysContent.appendChild(row);
                row = day === daysInMonth ? row : document.createElement("tr");
                dayOfWeek = 0;
            }
        }

        if (dayOfWeek !== 0) {
            for (let offset: number = dayOfWeek; offset < 7; offset++) {
                row.appendChild(this.renderEmptyDayCell());
            }
            this._daysContent.appendChild(row);
        }
    }

    private renderDayCell(day: number) {
        let cell: HTMLTableDataCellElement = document.createElement("td"),
            link: HTMLAnchorElement = document.createElement("a");

        link.href = "#";
        link.setAttribute("date-day", day.toString());
        link.innerHTML = day.toString();

        if (this._currentDatepicker.year === this._year && this._currentDatepicker.month === this._month && this._currentDatepicker.day === day) {
            link.classList.add("selected");
        }

        if (this._currentYear === this._year && this._currentMonth === this._month && this._currentDay === day) {
            link.classList.add("today");
        }

        cell.appendChild(link);

        return cell;
    }

    private renderEmptyDayCell(): HTMLTableDataCellElement {
        return document.createElement("td");
    }
}
