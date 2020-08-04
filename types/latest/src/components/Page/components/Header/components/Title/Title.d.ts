import * as React from 'react';
import type { AvatarProps } from '../../../../../Avatar';
import type { ThumbnailProps } from '../../../../../Thumbnail';
export interface TitleProps {
    /** Page title, in large type */
    title?: string;
    /** Page subtitle, in regular type*/
    subtitle?: string;
    /** Important and non-interactive status information shown immediately after the title. (stand-alone app use only) */
    titleMetadata?: React.ReactNode;
    /** thumbnail that precedes the title */
    thumbnail?: React.ReactElement<AvatarProps | ThumbnailProps> | React.SFC<React.SVGProps<SVGSVGElement>>;
}
export declare function Title({ title, subtitle, titleMetadata, thumbnail }: TitleProps): JSX.Element;
