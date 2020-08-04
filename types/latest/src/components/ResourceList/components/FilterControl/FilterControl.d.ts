/// <reference types="react" />
import type { ComplexAction } from '../../../../types';
import { AppliedFilter, Filter } from './types';
export interface FilterControlProps {
    searchValue?: string;
    appliedFilters?: AppliedFilter[];
    additionalAction?: ComplexAction;
    focused?: boolean;
    filters?: Filter[];
    placeholder?: string;
    onSearchBlur?(): void;
    onSearchChange(searchValue: string, id: string): void;
    onFiltersChange?(appliedFilters: AppliedFilter[]): void;
}
/** @deprecated Use <Filters /> instead. */
export declare function FilterControl({ searchValue, appliedFilters, additionalAction, focused, filters, placeholder, onSearchBlur, onSearchChange, onFiltersChange, }: FilterControlProps): JSX.Element;
