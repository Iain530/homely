const isEqual = (d1, d2) => d1.getTime() === d2.getTime();

const DAYS = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];


export const today = () => atMidnight(new Date());

export const atMidnight = (date) => {
    const copy = new Date(date);
    copy.setHours(0, 0, 0, 0);
    return copy;
};

export const isToday = date => isEqual(atMidnight(date), today());

export const isTomorrow = date => isEqual(atMidnight(date), addDays(today(), 1));

export const addDays = (date, days) => {
    const copy = new Date(date);
    copy.setDate(copy.getDate() + days);
    return copy;
};

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return `${DAYS[date.getDay()]} ${date.getDate()}`;
};

export const formatDay = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return DAYS[date.getDay()];
}
