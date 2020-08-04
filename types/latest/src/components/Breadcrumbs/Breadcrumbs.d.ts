import React from 'react';
import type { CallbackAction, LinkAction } from '../../types';
import { FeaturesContext } from '../../utilities/features';
export interface BreadcrumbsProps {
    /** Collection of breadcrumbs */
    breadcrumbs: (CallbackAction | LinkAction)[];
}
export declare class Breadcrumbs extends React.PureComponent<BreadcrumbsProps, never> {
    static contextType: React.Context<import("../../utilities/features").Features | undefined>;
    context: React.ContextType<typeof FeaturesContext>;
    render(): JSX.Element | null;
}
