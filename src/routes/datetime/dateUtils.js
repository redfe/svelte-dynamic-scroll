// @ts-check
import {
	format,
	addYears,
	addMonths,
	addDays,
	addHours,
	addMinutes,
	addSeconds,
	addMilliseconds,
	getYear,
	setYear,
	startOfYear,
	startOfMonth,
	startOfDay,
	startOfHour,
	startOfMinute,
	startOfSecond
} from 'date-fns';

/**
 * @typedef {import('./types.d.ts').DateOptions} DateOptions
 */

/**
 * @param {Date} date
 * @param {() => string} formatFunc
 * @returns {string}
 */
const formatIfValid = (date, formatFunc) => {
	if (isInvalidDate(date)) {
		return '';
	}
	return formatFunc();
};

/**
 * @type {DateOptions}
 */
const by10000Year = {
	label: 'by 10000 years',
	format: (date) => formatIfValid(date, () => format(date, 'G y')),
	increment: (date, inc) => addYears(date, inc * 10000),
	startOf: (date) => byYear.startOf(setYear(date, Math.floor(getYear(date) / 10000) * 10000))
};

/**
 * @type {DateOptions}
 */
const by1000Year = {
	label: 'by 1000 years',
	format: (date) => formatIfValid(date, () => format(date, 'G y')),
	increment: (date, inc) => addYears(date, inc * 1000),
	startOf: (date) => byYear.startOf(setYear(date, Math.floor(getYear(date) / 1000) * 1000))
};

/**
 * @type {DateOptions}
 */
const by100Year = {
	label: 'by 100 years',
	format: (date) => formatIfValid(date, () => format(date, 'G y')),
	increment: (date, inc) => addYears(date, inc * 100),
	startOf: (date) => byYear.startOf(setYear(date, Math.floor(getYear(date) / 100) * 100))
};

/**
 * @type {DateOptions}
 */
const by10Year = {
	label: 'by 10 years',
	format: (date) => formatIfValid(date, () => format(date, 'G y')),
	increment: (date, inc) => addYears(date, inc * 10),
	startOf: (date) => byYear.startOf(setYear(date, Math.floor(getYear(date) / 10) * 10))
};

/**
 * @type {DateOptions}
 */
const byYear = {
	label: 'by year',
	format: (date) => formatIfValid(date, () => format(date, 'G y')),
	increment: addYears,
	startOf: (date) => startOfYear(date)
};

/**
 * @type {DateOptions}
 */
const byMonth = {
	label: 'by month',
	format: (date) => formatIfValid(date, () => format(date, 'G y-MM')),
	increment: addMonths,
	startOf: (date) => startOfMonth(date)
};

/**
 * @type {DateOptions}
 */
const byDay = {
	label: 'by day',
	format: (date) => formatIfValid(date, () => format(date, 'G y-MM-dd')),
	increment: addDays,
	startOf: (date) => startOfDay(date)
};

/**
 * @type {DateOptions}
 */
const byHour = {
	label: 'by hour',
	format: (date) => formatIfValid(date, () => format(date, 'G y-MM-dd HH')),
	increment: addHours,
	startOf: (date) => startOfHour(date)
};

/**
 * @type {DateOptions}
 */
const byMinute = {
	label: 'by minute',
	format: (date) => formatIfValid(date, () => format(date, 'G y-MM-d HH:mm')),
	increment: addMinutes,
	startOf: (date) => startOfMinute(date)
};

/**
 * @type {DateOptions}
 */
const bySecond = {
	label: 'by second',
	format: (date) => formatIfValid(date, () => format(date, 'G y-MM-d HH:mm:ss')),
	increment: addSeconds,
	startOf: (date) => startOfSecond(date)
};

/**
 * @type {DateOptions}
 */
const byMillisecond = {
	label: 'by millisecond',
	format: (date) => formatIfValid(date, () => format(date, 'G y-MM-d HH:mm:ss.SSS')),
	increment: addMilliseconds,
	startOf: (date) => date
};

/**
 * @param {Date} date
 * @returns {boolean}
 */
const isInvalidDate = (date) => {
	return date.toString() === 'Invalid Date';
};

/**
 * @type {(Date) => string}
 * @returns {string}
 */
export const formatDate = (date) => {
	if (isInvalidDate(date)) {
		return '';
	}
	return date.toISOString();
};

/**
 *
 * @param {string} formatted
 * @returns {Date}
 */
export const parseDate = (formatted) => {
	return new Date(formatted);
};

// 紀元前 271821 年 4 月 20 日
// 小さい範囲から大きい範囲に変更したときに Invalid Date になるのを予防するため 20000 年足しておく。
const min = new Date(-271821 + 20000, 3, 20, 23, 59, 59);

// 紀元 275760 年 9 月 13 日
const max = new Date(275760, 8, 13, 0, 0, 0);

/**
 * @param {Date} date
 * @returns {boolean}
 */
export const isOverPrevious = (date) => {
	if (isInvalidDate(date)) {
		return true;
	}
	return date < min;
};

/**
 * @param {Date} date
 * @returns {boolean}
 */
export const isOverNext = (date) => {
	if (isInvalidDate(date)) {
		return true;
	}
	return max < date;
};

export const types = [
	by10000Year,
	by1000Year,
	by100Year,
	by10Year,
	byYear,
	byMonth,
	byDay,
	byHour,
	byMinute,
	bySecond,
	byMillisecond
];
