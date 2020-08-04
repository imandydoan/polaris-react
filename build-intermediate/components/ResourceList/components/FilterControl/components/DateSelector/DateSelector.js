import React, { useState, useCallback, useRef, memo } from 'react';
import { CalendarMinor } from '@shopify/polaris-icons';
import { DatePicker } from '../../../../../DatePicker';
import { Select } from '../../../../../Select';
import { TextField } from '../../../../../TextField';
import { Icon } from '../../../../../Icon';
import { useI18n } from '../../../../../../utilities/i18n';
import styles from './DateSelector.scss';
const VALID_DATE_REGEX = /^\d{4}-\d{1,2}-\d{1,2}$/;
export var DateFilterOption;
(function (DateFilterOption) {
    DateFilterOption["PastWeek"] = "past_week";
    DateFilterOption["PastMonth"] = "past_month";
    DateFilterOption["PastQuarter"] = "past_quarter";
    DateFilterOption["PastYear"] = "past_year";
    DateFilterOption["ComingWeek"] = "coming_week";
    DateFilterOption["ComingMonth"] = "coming_month";
    DateFilterOption["ComingQuarter"] = "coming_quarter";
    DateFilterOption["ComingYear"] = "coming_year";
    DateFilterOption["OnOrBefore"] = "on_or_before";
    DateFilterOption["OnOrAfter"] = "on_or_after";
})(DateFilterOption || (DateFilterOption = {}));
export const DateSelector = memo(function DateSelector({ filterValue, filterKey, filterMinKey, filterMaxKey, dateOptionType, onFilterValueChange, onFilterKeyChange, }) {
    const now = new Date();
    const i18n = useI18n();
    const initialConsumerFilterKey = useRef(filterKey);
    const [datePickerMonth, setDatePickerMonth] = useState(now.getMonth());
    const [datePickerYear, setDatePickerYear] = useState(now.getFullYear());
    const [selectedDate, setSelectedDate] = useState();
    const [userInputDate, setUserInputDate] = useState();
    const [userInputDateError, setUserInputDateError] = useState();
    const dateTextFieldValue = getDateTextFieldValue();
    const handleDateFieldChange = useCallback((value) => {
        if (value.length === 0) {
            setSelectedDate(undefined);
            onFilterValueChange(undefined);
        }
        if (userInputDateError && isValidDate(value)) {
            setUserInputDateError(undefined);
        }
        setUserInputDate(value);
    }, [onFilterValueChange, userInputDateError]);
    const handleDateChanged = useCallback((date) => {
        if (!date) {
            return;
        }
        onFilterValueChange(stripTimeFromISOString(formatDateForLocalTimezone(date)));
    }, [onFilterValueChange]);
    const handleDateBlur = useCallback(() => {
        if (!dateTextFieldValue || !isValidDate(dateTextFieldValue)) {
            setSelectedDate(undefined);
            setUserInputDateError(i18n.translate('Polaris.ResourceList.DateSelector.dateValueError'));
            onFilterValueChange(undefined);
            return;
        }
        if (!userInputDate) {
            return;
        }
        const formattedDateForTimezone = new Date(formatDateForLocalTimezone(new Date(userInputDate)));
        setSelectedDate(formattedDateForTimezone);
        setDatePickerMonth(formattedDateForTimezone.getMonth());
        setDatePickerYear(formattedDateForTimezone.getFullYear());
        setUserInputDate(undefined);
        setUserInputDateError(undefined);
        handleDateChanged(formattedDateForTimezone);
    }, [
        dateTextFieldValue,
        handleDateChanged,
        i18n,
        onFilterValueChange,
        userInputDate,
    ]);
    const handleDateFilterOptionsChange = useCallback((newOption) => {
        if (!initialConsumerFilterKey.current) {
            return;
        }
        if (newOption === DateFilterOption.OnOrBefore) {
            onFilterKeyChange(filterMaxKey);
            onFilterValueChange(selectedDate
                ? stripTimeFromISOString(formatDateForLocalTimezone(selectedDate))
                : undefined);
            return;
        }
        if (newOption === DateFilterOption.OnOrAfter) {
            onFilterKeyChange(filterMinKey);
            onFilterValueChange(selectedDate
                ? stripTimeFromISOString(formatDateForLocalTimezone(selectedDate))
                : undefined);
            return;
        }
        onFilterKeyChange(initialConsumerFilterKey.current);
        onFilterValueChange(newOption);
    }, [
        filterMaxKey,
        filterMinKey,
        initialConsumerFilterKey,
        onFilterKeyChange,
        onFilterValueChange,
        selectedDate,
    ]);
    const handleDatePickerChange = useCallback(({ end: nextDate }) => {
        const date = new Date(nextDate);
        setSelectedDate(date);
        setUserInputDate(undefined);
        setUserInputDateError(undefined);
        handleDateChanged(date);
    }, [handleDateChanged]);
    const handleDatePickerMonthChange = useCallback((month, year) => {
        setDatePickerMonth(month);
        setDatePickerYear(year);
    }, []);
    const dateFilterOption = getDateFilterOption(filterValue, filterKey, filterMinKey, filterMaxKey);
    const showDatePredicate = dateFilterOption === DateFilterOption.OnOrBefore ||
        dateFilterOption === DateFilterOption.OnOrAfter;
    const datePredicateMarkup = showDatePredicate && (<React.Fragment>
      <div className={styles.DateTextField}>
        <TextField label={i18n.translate('Polaris.ResourceList.DateSelector.dateValueLabel')} placeholder={i18n.translate('Polaris.ResourceList.DateSelector.dateValuePlaceholder')} value={dateTextFieldValue} error={userInputDateError} prefix={<Icon source={CalendarMinor} color="skyDark"/>} autoComplete={false} onChange={handleDateFieldChange} onBlur={handleDateBlur}/>
      </div>
      <div className={styles.DatePicker}>
        <DatePicker selected={selectedDate} month={datePickerMonth} year={datePickerYear} onChange={handleDatePickerChange} onMonthChange={handleDatePickerMonthChange}/>
      </div>
    </React.Fragment>);
    const dateOptionTypes = {
        past: [...getDatePastOptions(), ...getDateComparatorOptions()],
        future: [...getDateFutureOptions(), ...getDateComparatorOptions()],
        full: [
            ...getDatePastOptions(),
            ...getDateFutureOptions(),
            ...getDateComparatorOptions(),
        ],
    };
    return (<React.Fragment>
      <Select label={i18n.translate('Polaris.ResourceList.DateSelector.SelectOptions.dateFilterLabel')} labelHidden options={dateOptionType
        ? dateOptionTypes[dateOptionType]
        : dateOptionTypes.full} placeholder={i18n.translate('Polaris.ResourceList.FilterValueSelector.selectFilterValuePlaceholder')} value={dateFilterOption} onChange={handleDateFilterOptionsChange}/>
      {datePredicateMarkup}
    </React.Fragment>);
    function getDateComparatorOptions() {
        return [
            {
                value: DateFilterOption.OnOrBefore,
                label: i18n.translate('Polaris.ResourceList.DateSelector.SelectOptions.OnOrBefore'),
            },
            {
                value: DateFilterOption.OnOrAfter,
                label: i18n.translate('Polaris.ResourceList.DateSelector.SelectOptions.OnOrAfter'),
            },
        ];
    }
    function getDatePastOptions() {
        return [
            {
                value: DateFilterOption.PastWeek,
                label: i18n.translate('Polaris.ResourceList.DateSelector.SelectOptions.PastWeek'),
            },
            {
                value: DateFilterOption.PastMonth,
                label: i18n.translate('Polaris.ResourceList.DateSelector.SelectOptions.PastMonth'),
            },
            {
                value: DateFilterOption.PastQuarter,
                label: i18n.translate('Polaris.ResourceList.DateSelector.SelectOptions.PastQuarter'),
            },
            {
                value: DateFilterOption.PastYear,
                label: i18n.translate('Polaris.ResourceList.DateSelector.SelectOptions.PastYear'),
            },
        ];
    }
    function getDateFutureOptions() {
        return [
            {
                value: DateFilterOption.ComingWeek,
                label: i18n.translate('Polaris.ResourceList.DateSelector.SelectOptions.ComingWeek'),
            },
            {
                value: DateFilterOption.ComingMonth,
                label: i18n.translate('Polaris.ResourceList.DateSelector.SelectOptions.ComingMonth'),
            },
            {
                value: DateFilterOption.ComingQuarter,
                label: i18n.translate('Polaris.ResourceList.DateSelector.SelectOptions.ComingQuarter'),
            },
            {
                value: DateFilterOption.ComingYear,
                label: i18n.translate('Polaris.ResourceList.DateSelector.SelectOptions.ComingYear'),
            },
        ];
    }
    function getDateTextFieldValue() {
        if (!userInputDate && !selectedDate) {
            return undefined;
        }
        if (userInputDate !== undefined) {
            return userInputDate;
        }
        if (selectedDate) {
            return stripTimeFromISOString(formatDateForLocalTimezone(selectedDate));
        }
    }
});
function isValidDate(date) {
    if (!date) {
        return false;
    }
    return VALID_DATE_REGEX.test(date) && !isNaN(new Date(date).getTime());
}
function getDateFilterOption(filterValue, filterKey, filterMinKey, filterMaxKey) {
    if (filterKey === filterMaxKey) {
        return DateFilterOption.OnOrBefore;
    }
    if (filterKey === filterMinKey) {
        return DateFilterOption.OnOrAfter;
    }
    return filterValue;
}
function stripTimeFromISOString(ISOString) {
    return ISOString.slice(0, 10);
}
function formatDateForLocalTimezone(date) {
    const timezoneOffset = date.getTimezoneOffset();
    const timezoneOffsetMs = timezoneOffset * 60 * 1000;
    const isFringeTimezone = timezoneOffset === -720 || timezoneOffset === 720;
    const formattedDate = new Date();
    if (isFringeTimezone && date.getHours() !== 0) {
        return date.toISOString();
    }
    const newTime = timezoneOffset > -1
        ? date.getTime() + timezoneOffsetMs
        : date.getTime() - timezoneOffsetMs;
    formattedDate.setTime(newTime);
    return formattedDate.toISOString();
}
