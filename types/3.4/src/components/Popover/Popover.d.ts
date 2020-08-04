import React, { AriaAttributes } from 'react';
import { PopoverCloseSource, Pane, PopoverOverlayProps, Section } from './components';
export { PopoverCloseSource };
export interface PopoverProps {
    /** The content to display inside the popover */
    children?: React.ReactNode;
    /** The preferred direction to open the popover */
    preferredPosition?: PopoverOverlayProps['preferredPosition'];
    /** The preferred alignment of the popover relative to its activator */
    preferredAlignment?: PopoverOverlayProps['preferredAlignment'];
    /** Show or hide the Popover */
    active: boolean;
    /** The element to activate the Popover */
    activator: React.ReactElement;
    /**
     * Use the activator's input element to calculate the Popover position
     * @default true
     */
    preferInputActivator?: PopoverOverlayProps['preferInputActivator'];
    /**
     * The element type to wrap the activator with
     * @default 'div'
     */
    activatorWrapper?: string;
    /** Prevent automatic focus of the first field on activation */
    preventAutofocus?: boolean;
    /** Automatically add wrap content in a section */
    sectioned?: boolean;
    /** Allow popover to stretch to the full width of its activator */
    fullWidth?: boolean;
    /** Allow popover to stretch to fit content vertically */
    fullHeight?: boolean;
    /** Allow popover content to determine the overlay width and height */
    fluidContent?: boolean;
    /** Remains in a fixed position */
    fixed?: boolean;
    /** Used to illustrate the type of popover element */
    ariaHaspopup?: AriaAttributes['aria-haspopup'];
    /** Callback when popover is closed */
    onClose(source: PopoverCloseSource): void;
}
export declare const Popover: React.FunctionComponent<PopoverProps> & {
    Pane: typeof Pane;
    Section: typeof Section;
};
