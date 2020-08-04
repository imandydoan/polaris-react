import React from 'react';
import { ComplexAction, AppBridgeAction } from '../../../../types';
export interface FooterProps {
    /** Primary action */
    primaryAction?: AppBridgeAction | ComplexAction;
    /** Collection of secondary actions */
    secondaryActions?: AppBridgeAction[] | ComplexAction[];
    /** The content to display inside modal */
    children?: React.ReactNode;
}
export declare function Footer({ primaryAction, secondaryActions, children, }: FooterProps): JSX.Element;
