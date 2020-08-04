/// <reference types="hoist-non-react-statics" />
import React from 'react';
import { DisableableAction, Action, ActionListSection } from '../../../../types';
import { WithAppProviderProps } from '../../../../utilities/with-app-provider';
declare type BulkAction = DisableableAction;
declare type BulkActionListSection = ActionListSection;
export interface BulkActionsProps {
    /** Visually hidden text for screen readers */
    accessibilityLabel?: string;
    /** Whether to render the small screen BulkActions or not */
    smallScreen?: boolean;
    /** Label for the bulk actions */
    label?: string;
    /** State of the bulk actions checkbox */
    selected?: boolean | 'indeterminate';
    /** List is in a selectable state */
    selectMode?: boolean;
    /** Actions that will be given more prominence */
    promotedActions?: BulkAction[];
    /** List of actions */
    actions?: (BulkAction | BulkActionListSection)[];
    /** Text to select all across pages */
    paginatedSelectAllText?: string;
    /** Action for selecting all across pages */
    paginatedSelectAllAction?: Action;
    /** Disables bulk actions */
    disabled?: boolean;
    /** Callback when the select all checkbox is clicked */
    onToggleAll?(): void;
    /** Callback when selectable state of list is changed */
    onSelectModeToggle?(selectMode: boolean): void;
}
interface State {
    smallScreenPopoverVisible: boolean;
    largeScreenPopoverVisible: boolean;
    containerWidth: number;
    measuring: boolean;
}
declare type CombinedProps = BulkActionsProps & WithAppProviderProps;
declare class BulkActionsInner extends React.PureComponent<CombinedProps, State> {
    state: State;
    private containerNode;
    private largeScreenButtonsNode;
    private moreActionsNode;
    private checkableWrapperNode;
    private largeScreenGroupNode;
    private smallScreenGroupNode;
    private promotedActionsWidths;
    private bulkActionsWidth;
    private addedMoreActionsWidthForMeasuring;
    private handleResize;
    private numberOfPromotedActionsToRender;
    private hasActions;
    private actionSections;
    componentDidMount(): void;
    render(): JSX.Element;
    private setLargeScreenButtonsNode;
    private setContainerNode;
    private setMoreActionsNode;
    private setSelectMode;
    private toggleSmallScreenPopover;
    private toggleLargeScreenPopover;
    private handleMeasurement;
    private findLargeScreenGroupNode;
    private findCheckableWrapperNode;
    private findSmallScreenGroupNode;
}
export declare const BulkActions: React.FunctionComponent<BulkActionsProps> & import("hoist-non-react-statics").NonReactStatics<(React.ComponentClass<CombinedProps, any> & typeof BulkActionsInner) | (React.FunctionComponent<CombinedProps> & typeof BulkActionsInner), {}>;
export {};
