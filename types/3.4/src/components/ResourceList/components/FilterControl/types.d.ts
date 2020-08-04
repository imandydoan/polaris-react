import { SelectOption } from '../../../Select';
import { TextFieldProps } from '../../../TextField';
export interface Operator {
    key: string;
    optionLabel: string;
    filterLabel?: string;
}
export interface AppliedFilter {
    key: string;
    value: string;
    label?: string;
}
export declare enum FilterType {
    Select = 0,
    TextField = 1,
    DateSelector = 2
}
export interface FilterBase<FilterKeys = {}> {
    label: string;
    key: keyof FilterKeys | string;
    operatorText?: string | Operator[];
    type: FilterType;
}
export interface FilterSelect<FilterKeys = {}> extends FilterBase<FilterKeys> {
    type: FilterType.Select;
    options: SelectOption[];
}
export interface FilterTextField<FilterKeys = {}> extends FilterBase<FilterKeys> {
    type: FilterType.TextField;
    textFieldType?: TextFieldProps['type'];
}
export interface FilterDateSelector<FilterKeys = {}> extends FilterBase<FilterKeys> {
    type: FilterType.DateSelector;
    minKey: string;
    maxKey: string;
    dateOptionType?: 'past' | 'future' | 'full';
}
export declare type Filter<FilterKeys = {}> = FilterSelect<FilterKeys> | FilterTextField<FilterKeys> | FilterDateSelector<FilterKeys>;
