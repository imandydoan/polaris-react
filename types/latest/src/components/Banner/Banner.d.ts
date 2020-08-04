import React from 'react';
import { FeaturesContext } from '../../utilities/features';
import type { Action, DisableableAction, LoadableAction, IconProps } from '../../types';
export declare type BannerStatus = 'success' | 'info' | 'warning' | 'critical';
interface State {
    showFocus: boolean;
}
export interface BannerProps {
    /** Title content for the banner. */
    title?: string;
    /** Icon to display in the banner. Use only major, duotone icons */
    icon?: IconProps['source'];
    /** Sets the status of the banner. */
    status?: BannerStatus;
    /** The child elements to render in the banner. */
    children?: React.ReactNode;
    /** Action for banner */
    action?: DisableableAction & LoadableAction;
    /** Action | Displays a secondary action */
    secondaryAction?: Action;
    /** Callback when banner is dismissed */
    onDismiss?(): void;
    /** Disables screen reader announcements when changing the content of the banner */
    stopAnnouncements?: boolean;
}
export declare class Banner extends React.PureComponent<BannerProps, State> {
    static contextType: React.Context<import("../../utilities/features").Features | undefined>;
    context: React.ContextType<typeof FeaturesContext>;
    state: State;
    private wrapper;
    focus(): void;
    render(): JSX.Element;
}
export {};
