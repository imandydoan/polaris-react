import React from 'react';
import { HSBColor, HSBAColor } from '../../utilities/color-types';
interface State {
    pickerSize: number;
}
interface Color extends HSBColor {
    /** Level of transparency */
    alpha?: HSBAColor['alpha'];
}
export interface ColorPickerProps {
    /** ID for the element */
    id?: string;
    /** The currently selected color */
    color: Color;
    /** Allow user to select an alpha value */
    allowAlpha?: boolean;
    /** Callback when color is selected */
    onChange(color: HSBAColor): void;
}
export declare class ColorPicker extends React.PureComponent<ColorPickerProps, State> {
    state: State;
    private colorNode;
    componentDidMount(): void;
    render(): JSX.Element;
    private setColorNode;
    private handleHueChange;
    private handleAlphaChange;
    private handleDraggerMove;
    private handlePickerDrag;
}
export {};
