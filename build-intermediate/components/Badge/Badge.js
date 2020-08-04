import React from 'react';
import { classNames, variationName } from '../../utilities/css';
import { useI18n } from '../../utilities/i18n';
import { VisuallyHidden } from '../VisuallyHidden';
import styles from './Badge.scss';
const PROGRESS_LABELS = {
    incomplete: 'incomplete',
    partiallyComplete: 'partiallyComplete',
    complete: 'complete',
};
const STATUS_LABELS = {
    info: 'info',
    success: 'success',
    warning: 'warning',
    critical: 'critical',
    attention: 'attention',
    new: 'new',
};
const DEFAULT_SIZE = 'medium';
export function Badge({ children, status, progress, size = DEFAULT_SIZE, }) {
    const i18n = useI18n();
    const className = classNames(styles.Badge, status && styles[variationName('status', status)], progress && styles[variationName('progress', progress)], size && size !== DEFAULT_SIZE && styles[variationName('size', size)]);
    let progressMarkup;
    switch (progress) {
        case PROGRESS_LABELS.incomplete:
            progressMarkup = i18n.translate('Polaris.Badge.PROGRESS_LABELS.incomplete');
            break;
        case PROGRESS_LABELS.partiallyComplete:
            progressMarkup = i18n.translate('Polaris.Badge.PROGRESS_LABELS.partiallyComplete');
            break;
        case PROGRESS_LABELS.complete:
            progressMarkup = i18n.translate('Polaris.Badge.PROGRESS_LABELS.complete');
            break;
    }
    const pipMarkup = progress ? (<span className={styles.Pip}>
      <VisuallyHidden>{progressMarkup}</VisuallyHidden>
    </span>) : null;
    let statusMarkup;
    switch (status) {
        case STATUS_LABELS.info:
            statusMarkup = i18n.translate('Polaris.Badge.STATUS_LABELS.info');
            break;
        case STATUS_LABELS.success:
            statusMarkup = i18n.translate('Polaris.Badge.STATUS_LABELS.success');
            break;
        case STATUS_LABELS.warning:
            statusMarkup = i18n.translate('Polaris.Badge.STATUS_LABELS.warning');
            break;
        case STATUS_LABELS.critical:
            statusMarkup = i18n.translate('Polaris.Badge.STATUS_LABELS.critical');
            break;
        case STATUS_LABELS.attention:
            statusMarkup = i18n.translate('Polaris.Badge.STATUS_LABELS.attention');
            break;
        case STATUS_LABELS.new:
            statusMarkup = i18n.translate('Polaris.Badge.STATUS_LABELS.new');
            break;
    }
    const statusLabelMarkup = status ? (<VisuallyHidden>{statusMarkup}</VisuallyHidden>) : null;
    return (<span className={className}>
      {statusLabelMarkup}
      {pipMarkup}
      <span className={styles.Content}>{children}</span>
    </span>);
}
