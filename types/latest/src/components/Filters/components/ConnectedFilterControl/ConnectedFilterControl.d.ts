import React from 'react';
import { FeaturesContext } from '../../../../utilities/features';
import type { DisableableAction } from '../../../../types';
interface PopoverableAction extends DisableableAction {
    popoverOpen: boolean;
    popoverContent: React.ReactNode;
    key: string;
    content: string;
    onAction(): void;
}
export interface ConnectedFilterControlProps {
    children: React.ReactNode;
    rightPopoverableActions?: PopoverableAction[] | null;
    rightAction?: React.ReactNode;
    auxiliary?: React.ReactNode;
    disabled?: boolean;
    forceShowMorefiltersButton?: boolean;
}
interface ComputedProperty {
    [key: string]: number;
}
interface State {
    availableWidth: number;
    proxyButtonsWidth: ComputedProperty;
}
export declare class ConnectedFilterControl extends React.Component<ConnectedFilterControlProps, State> {
    static contextType: React.Context<import("../../../../utilities/features").Features | undefined>;
    context: React.ContextType<typeof FeaturesContext>;
    state: State;
    private container;
    private proxyButtonContainer;
    private moreFiltersButtonContainer;
    private handleResize;
    componentDidMount(): void;
    render(): JSX.Element;
    private measureProxyButtons;
    private measureAvailableWidth;
    private getActionsToRender;
    private activatorButtonFrom;
    private popoverFrom;
}
export {};
