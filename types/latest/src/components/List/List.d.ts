import React from 'react';
import { Item } from './components';
declare type Type = 'bullet' | 'number';
export interface ListProps {
    /**
     * Type of list to display
     * @default 'bullet'
     */
    type?: Type;
    /** List item elements */
    children?: React.ReactNode;
}
export declare class List extends React.PureComponent<ListProps, never> {
    static Item: typeof Item;
    render(): JSX.Element;
}
export {};
