import React from 'react';
import { LabelledProps } from '../Labelled';
import { Error } from '../../types';
interface StrictOption {
    /** Machine value of the option; this is the value passed to `onChange` */
    value: string;
    /** Human-readable text for the option */
    label: string;
    /** Option will be visible, but not selectable */
    disabled?: boolean;
}
export declare type SelectOption = string | StrictOption;
export interface SelectGroup {
    title: string;
    options: SelectOption[];
}
export interface SelectProps {
    /** List of options or option groups to choose from */
    options?: (SelectOption | SelectGroup)[];
    /** Label for the select */
    label: string;
    /** Adds an action to the label */
    labelAction?: LabelledProps['action'];
    /** Visually hide the label */
    labelHidden?: boolean;
    /** Show the label to the left of the value, inside the control */
    labelInline?: boolean;
    /** Disable input */
    disabled?: boolean;
    /** Additional text to aide in use */
    helpText?: React.ReactNode;
    /** Example text to display as placeholder */
    placeholder?: string;
    /** ID for form input */
    id?: string;
    /** Name for form input */
    name?: string;
    /** Value for form input */
    value?: string;
    /** Display an error state */
    error?: Error | boolean;
    /** Callback when selection is changed */
    onChange?(selected: string, id: string): void;
    /** Callback when select is focussed */
    onFocus?(): void;
    /** Callback when focus is removed */
    onBlur?(): void;
}
export declare function Select({ options: optionsProp, label, labelAction, labelHidden: labelHiddenProp, labelInline, disabled, helpText, placeholder, id: idProp, name, value, error, onChange, onFocus, onBlur, }: SelectProps): JSX.Element;
export {};
