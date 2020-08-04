import React from 'react';
import { classNames } from '../../utilities/css';
import { elementChildren } from '../../utilities/components';
import { Item } from './components';
import styles from './ButtonGroup.scss';
export function ButtonGroup({ children, segmented, fullWidth, connectedTop, }) {
    const className = classNames(styles.ButtonGroup, segmented && styles.segmented, fullWidth && styles.fullWidth);
    const contents = elementChildren(children).map((child, index) => (<Item button={child} key={index}/>));
    return (<div className={className} data-buttongroup-segmented={segmented} data-buttongroup-connected-top={connectedTop} data-buttongroup-full-width={fullWidth}>
      {contents}
    </div>);
}
