import React from 'react';
import { PositionedOverlayProps } from '../../../PositionedOverlay';
export declare enum PopoverCloseSource {
    Click = 0,
    EscapeKeypress = 1,
    FocusOut = 2,
    ScrollOut = 3
}
declare enum TransitionStatus {
    Entering = "entering",
    Entered = "entered",
    Exiting = "exiting",
    Exited = "exited"
}
export interface PopoverOverlayProps {
    children?: React.ReactNode;
    fullWidth?: boolean;
    fullHeight?: boolean;
    fluidContent?: boolean;
    preferredPosition?: PositionedOverlayProps['preferredPosition'];
    preferredAlignment?: PositionedOverlayProps['preferredAlignment'];
    active: boolean;
    id: string;
    activator: HTMLElement;
    preferInputActivator?: PositionedOverlayProps['preferInputActivator'];
    preventAutofocus?: boolean;
    sectioned?: boolean;
    fixed?: boolean;
    onClose(source: PopoverCloseSource): void;
}
interface State {
    transitionStatus: TransitionStatus;
}
export declare class PopoverOverlay extends React.PureComponent<PopoverOverlayProps, State> {
    state: State;
    private contentNode;
    private enteringTimer?;
    private exitingTimer?;
    changeTransitionStatus(transitionStatus: TransitionStatus, cb?: () => void): void;
    componentDidMount(): void;
    componentDidUpdate(oldProps: PopoverOverlayProps): void;
    componentWillUnmount(): void;
    render(): JSX.Element | null;
    private clearTransitionTimeout;
    private focusContent;
    private renderPopover;
    private handleClick;
    private handleScrollOut;
    private handleEscape;
    private handleFocusFirstItem;
    private handleFocusLastItem;
}
export {};
