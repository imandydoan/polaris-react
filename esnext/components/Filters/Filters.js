import React, { createRef } from 'react';
import { focusFirstFocusableNode } from '@shopify/javascript-utilities/focus';
import { SearchMinor, ChevronUpMinor, ChevronDownMinor, CancelSmallMinor, } from '@shopify/polaris-icons';
import { classNames } from '../../utilities/css';
import { withAppProvider, } from '../../utilities/with-app-provider';
import { ResourceListContext } from '../../utilities/resource-list';
import { useFeatures } from '../../utilities/features';
import { Button } from '../Button';
import { DisplayText } from '../DisplayText';
import { Collapsible } from '../Collapsible';
import { Scrollable } from '../Scrollable';
import { ScrollLock } from '../ScrollLock';
import { Icon } from '../Icon';
import { TextField } from '../TextField';
import { Tag } from '../Tag';
import { TextStyle } from '../TextStyle';
import { Badge } from '../Badge';
import { Focus } from '../Focus';
import { Sheet } from '../Sheet';
import { Stack } from '../Stack';
import { Key } from '../../types';
import { KeypressListener } from '../KeypressListener';
import { ConnectedFilterControl, } from './components';
import styles from './Filters.scss';
var Suffix;
(function (Suffix) {
    Suffix["Filter"] = "Filter";
    Suffix["Shortcut"] = "Shortcut";
})(Suffix || (Suffix = {}));
class FiltersInner extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            open: false,
            readyForFocus: false,
        };
        this.moreFiltersButtonContainer = createRef();
        this.focusNode = createRef();
        this.closeFilters = () => {
            this.setState({ open: false }, () => {
                if (this.moreFiltersButtonContainer.current) {
                    focusFirstFocusableNode(this.moreFiltersButtonContainer.current, false);
                }
            });
        };
        this.toggleFilters = () => {
            if (this.state.open === true) {
                this.closeFilters();
            }
            else {
                this.openFilters();
            }
        };
        this.setReadyForFocus = (newState) => () => {
            this.setState({ readyForFocus: newState });
        };
    }
    render() {
        const { filters, queryValue, onQueryBlur, onQueryChange, onQueryFocus, focused, onClearAll, appliedFilters, polaris: { intl, mediaQuery: { isNavigationCollapsed }, }, onQueryClear, queryPlaceholder, children, disabled = false, helpText, hideTags, newDesignLanguage, } = this.props;
        const { resourceName } = this.context;
        const { open, readyForFocus } = this.state;
        const backdropMarkup = open ? (<React.Fragment>
        <ScrollLock />
        <div className={styles.Backdrop} onClick={this.closeFilters} testID="Backdrop"/>
      </React.Fragment>) : null;
        const filtersContentMarkup = filters.map((filter, index) => {
            const filterIsOpen = this.state[`${filter.key}${Suffix.Filter}`] === true;
            const icon = filterIsOpen ? ChevronUpMinor : ChevronDownMinor;
            const className = classNames(styles.FilterTriggerContainer, filterIsOpen && styles.open, index === 0 && styles.first, filters.length !== 1 && index === filters.length - 1 && styles.last);
            const appliedFilterContent = this.getAppliedFilterContent(filter.key);
            const appliedFilterBadgeMarkup = appliedFilterContent ? (<div className={styles.AppliedFilterBadgeContainer}>
          <Badge size="small" status="new">
            {appliedFilterContent}
          </Badge>
        </div>) : null;
            const collapsibleID = `${filter.key}Collapsible`;
            const buttonClassName = classNames(styles.FilterTrigger, newDesignLanguage && styles.newDesignLanguage);
            return (<div key={filter.key} className={className}>
          <button onClick={() => this.toggleFilter(filter.key)} className={buttonClassName} id={`${filter.key}ToggleButton`} type="button" aria-controls={collapsibleID} aria-expanded={filterIsOpen}>
            <div className={styles.FilterTriggerLabelContainer}>
              <h2 className={styles.FilterTriggerTitle}>
                <TextStyle variation={this.props.disabled || filter.disabled
                ? 'subdued'
                : undefined}>
                  {filter.label}
                </TextStyle>
              </h2>
              <span className={styles.FilterTriggerIcon}>
                <Icon source={icon} color="inkLightest"/>
              </span>
            </div>
            {appliedFilterBadgeMarkup}
          </button>
          <Collapsible id={collapsibleID} open={filterIsOpen}>
            <div className={styles.FilterNodeContainer}>
              <Focus disabled={!filterIsOpen || !readyForFocus || !open} root={this.focusNode}>
                {this.generateFilterMarkup(filter)}
              </Focus>
            </div>
          </Collapsible>
        </div>);
        });
        const appliedFiltersCount = appliedFilters ? appliedFilters.length : 0;
        const moreFiltersLabel = hideTags && appliedFiltersCount > 0
            ? intl.translate('Polaris.Filters.moreFiltersWithCount', {
                count: appliedFiltersCount,
            })
            : intl.translate('Polaris.Filters.moreFilters');
        const rightActionMarkup = (<div ref={this.moreFiltersButtonContainer}>
        <Button onClick={this.toggleFilters} testID="SheetToggleButton" disabled={disabled}>
          {moreFiltersLabel}
        </Button>
      </div>);
        const filterResourceName = resourceName || {
            singular: intl.translate('Polaris.ResourceList.defaultItemSingular'),
            plural: intl.translate('Polaris.ResourceList.defaultItemPlural'),
        };
        const transformedFilters = this.transformFilters(filters);
        const filtersControlMarkup = (<ConnectedFilterControl rightPopoverableActions={transformedFilters} rightAction={rightActionMarkup} auxiliary={children} disabled={disabled} forceShowMorefiltersButton={filters.length > transformedFilters.length}>
        <TextField placeholder={queryPlaceholder ||
            intl.translate('Polaris.Filters.filter', {
                resourceName: filterResourceName.plural,
            })} onChange={onQueryChange} onBlur={onQueryBlur} onFocus={onQueryFocus} value={queryValue} focused={focused} label={queryPlaceholder ||
            intl.translate('Polaris.Filters.filter', {
                resourceName: filterResourceName.plural,
            })} labelHidden prefix={<span className={styles.SearchIcon}>
              <Icon source={SearchMinor}/>
            </span>} clearButton onClearButtonClick={onQueryClear} disabled={disabled}/>
      </ConnectedFilterControl>);
        const filtersContainerHeaderClassname = classNames(styles.FiltersContainerHeader, newDesignLanguage && styles.newDesignLanguage);
        const filtersDesktopHeaderMarkup = (<div className={filtersContainerHeaderClassname}>
        <DisplayText size="small">{moreFiltersLabel}</DisplayText>
        <Button icon={CancelSmallMinor} plain accessibilityLabel={intl.translate('Polaris.Filters.cancel')} onClick={this.closeFilters}/>
      </div>);
        const filtersMobileHeaderMarkup = (<div className={filtersContainerHeaderClassname}>
        <Button icon={CancelSmallMinor} plain accessibilityLabel={intl.translate('Polaris.Filters.cancel')} onClick={this.closeFilters}/>
        <DisplayText size="small">{moreFiltersLabel}</DisplayText>
        <Button onClick={this.closeFilters} primary>
          {intl.translate('Polaris.Filters.done')}
        </Button>
      </div>);
        const filtersDesktopFooterClassname = classNames(styles.FiltersContainerFooter, newDesignLanguage && styles.newDesignLanguage);
        const filtersDesktopFooterMarkup = (<div className={filtersDesktopFooterClassname}>
        <Button onClick={onClearAll} disabled={!this.hasAppliedFilters()}>
          {intl.translate('Polaris.Filters.clearAllFilters')}
        </Button>
        <Button onClick={this.closeFilters} primary>
          {intl.translate('Polaris.Filters.done')}
        </Button>
      </div>);
        const filtersMobileFooterMarkup = (<div className={styles.FiltersMobileContainerFooter}>
        {this.hasAppliedFilters() ? (<Button onClick={onClearAll} fullWidth>
            {intl.translate('Polaris.Filters.clearAllFilters')}
          </Button>) : (<div className={styles.EmptyFooterState}>
            <TextStyle variation="subdued">
              <p>{intl.translate('Polaris.Filters.noFiltersApplied')}</p>
            </TextStyle>
          </div>)}
      </div>);
        const tagsMarkup = !hideTags && appliedFilters && appliedFilters.length ? (<div className={styles.TagsContainer}>
          {appliedFilters.map((filter) => {
            return (<Tag key={filter.key} onRemove={() => {
                filter.onRemove(filter.key);
            }} disabled={disabled}>
                {filter.label}
              </Tag>);
        })}
        </div>) : null;
        const filtersMobileContainerContentClassName = classNames(styles.FiltersMobileContainerContent, newDesignLanguage && styles.newDesignLanguage);
        const filtersDesktopContainerContentClassName = classNames(styles.FiltersDesktopContainerContent, newDesignLanguage && styles.newDesignLanguage);
        const filtersContainerMarkup = isNavigationCollapsed ? (<Sheet open={open} onClose={this.closeFilters} onEntered={this.setReadyForFocus(true)} onExit={this.setReadyForFocus(false)}>
        {filtersMobileHeaderMarkup}
        <Scrollable className={filtersMobileContainerContentClassName} shadow>
          {filtersContentMarkup}
          {filtersMobileFooterMarkup}
        </Scrollable>
      </Sheet>) : (<Sheet open={open} onClose={this.closeFilters} onEntered={this.setReadyForFocus(true)} onExit={this.setReadyForFocus(false)}>
        <div className={styles.FiltersContainer}>
          {filtersDesktopHeaderMarkup}
          <Scrollable className={filtersDesktopContainerContentClassName} shadow>
            {filtersContentMarkup}
          </Scrollable>
          {filtersDesktopFooterMarkup}
        </div>
      </Sheet>);
        const helpTextMarkup = helpText ? (<div id="FiltersHelpText" className={styles.HelpText}>
        <TextStyle variation="subdued">{helpText}</TextStyle>
      </div>) : null;
        return (<div className={styles.Filters}>
        {filtersControlMarkup}
        {filtersContainerMarkup}
        {tagsMarkup}
        {helpTextMarkup}
        {backdropMarkup}
        <KeypressListener keyCode={Key.Escape} handler={this.closeFilters}/>
      </div>);
    }
    hasAppliedFilters() {
        const { appliedFilters, queryValue } = this.props;
        const filtersApplied = Boolean(appliedFilters && appliedFilters.length > 0);
        const queryApplied = Boolean(queryValue && queryValue !== '');
        return filtersApplied || queryApplied;
    }
    getAppliedFilterContent(key) {
        const { appliedFilters } = this.props;
        if (!appliedFilters) {
            return undefined;
        }
        const filter = appliedFilters.find((filter) => filter.key === key);
        return filter == null ? undefined : filter.label;
    }
    getAppliedFilterRemoveHandler(key) {
        const { appliedFilters } = this.props;
        if (!appliedFilters) {
            return undefined;
        }
        const filter = appliedFilters.find((filter) => filter.key === key);
        return filter == null ? undefined : filter.onRemove;
    }
    openFilters() {
        this.setState({ open: true });
    }
    openFilter(key) {
        this.setState({ [`${key}${Suffix.Filter}`]: true });
    }
    closeFilter(key) {
        this.setState({ [`${key}${Suffix.Filter}`]: false });
    }
    toggleFilter(key) {
        if (this.state[`${key}${Suffix.Filter}`] === true) {
            this.closeFilter(key);
        }
        else {
            this.openFilter(key);
        }
    }
    openFilterShortcut(key) {
        this.setState({ [`${key}${Suffix.Shortcut}`]: true });
    }
    closeFilterShortcut(key) {
        this.setState({ [`${key}${Suffix.Shortcut}`]: false });
    }
    toggleFilterShortcut(key) {
        if (this.state[`${key}${Suffix.Shortcut}`] === true) {
            this.closeFilterShortcut(key);
        }
        else {
            this.openFilterShortcut(key);
        }
    }
    transformFilters(filters) {
        const transformedActions = [];
        getShortcutFilters(filters).forEach((filter) => {
            const { key, label, disabled } = filter;
            transformedActions.push({
                popoverContent: this.generateFilterMarkup(filter),
                popoverOpen: Boolean(this.state[`${key}${Suffix.Shortcut}`]),
                key,
                content: label,
                disabled,
                onAction: () => this.toggleFilterShortcut(key),
            });
        });
        return transformedActions;
    }
    generateFilterMarkup(filter) {
        const intl = this.props.polaris.intl;
        const removeCallback = this.getAppliedFilterRemoveHandler(filter.key);
        const removeHandler = removeCallback == null
            ? undefined
            : () => {
                removeCallback(filter.key);
            };
        return (<div ref={this.focusNode}>
        <Stack vertical spacing="tight">
          {filter.filter}
          <Button plain disabled={removeHandler == null} onClick={removeHandler} accessibilityLabel={intl.translate('Polaris.Filters.clearLabel', {
            filterName: filter.label,
        })}>
            {intl.translate('Polaris.Filters.clear')}
          </Button>
        </Stack>
      </div>);
    }
}
FiltersInner.contextType = ResourceListContext;
function getShortcutFilters(filters) {
    return filters.filter((filter) => filter.shortcut === true);
}
function FiltersInnerWrapper(props) {
    const { newDesignLanguage } = useFeatures();
    return <FiltersInner {...props} newDesignLanguage={newDesignLanguage}/>;
}
export const Filters = withAppProvider()(FiltersInnerWrapper);
