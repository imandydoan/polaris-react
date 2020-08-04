import React from 'react';
import debounce from 'lodash/debounce';
import { EnableSelectionMinor } from '@shopify/polaris-icons';
import { classNames } from '../../utilities/css';
import { Button } from '../Button';
import { EventListener } from '../EventListener';
import { Sticky } from '../Sticky';
import { Spinner } from '../Spinner';
import { withAppProvider, } from '../../utilities/with-app-provider';
import { ResourceListContext, SELECT_ALL_ITEMS, } from '../../utilities/resource-list';
import { Select } from '../Select';
import { EmptySearchResult } from '../EmptySearchResult';
import { ResourceItem } from '../ResourceItem';
import { BulkActions, CheckableButton, 
// eslint-disable-next-line import/no-deprecated
FilterControl, } from './components';
import styles from './ResourceList.scss';
const SMALL_SCREEN_WIDTH = 458;
const SMALL_SPINNER_HEIGHT = 28;
const LARGE_SPINNER_HEIGHT = 45;
class ResourceListInner extends React.Component {
    constructor(props) {
        super(props);
        this.listRef = React.createRef();
        this.handleResize = debounce(() => {
            const { selectedItems } = this.props;
            const { selectMode, smallScreen } = this.state;
            const newSmallScreen = isSmallScreen();
            if (selectedItems &&
                selectedItems.length === 0 &&
                selectMode &&
                !newSmallScreen) {
                this.handleSelectMode(false);
            }
            if (smallScreen !== newSmallScreen) {
                this.setState({ smallScreen: newSmallScreen });
            }
        }, 50, { leading: true, trailing: true, maxWait: 50 });
        this.setLoadingPosition = () => {
            if (this.listRef.current != null) {
                if (typeof window === 'undefined') {
                    return;
                }
                const overlay = this.listRef.current.getBoundingClientRect();
                const viewportHeight = Math.max(document.documentElement ? document.documentElement.clientHeight : 0, window.innerHeight || 0);
                const overflow = viewportHeight - overlay.height;
                const spinnerHeight = this.props.items.length === 1
                    ? SMALL_SPINNER_HEIGHT
                    : LARGE_SPINNER_HEIGHT;
                const spinnerPosition = overflow > 0
                    ? (overlay.height - spinnerHeight) / 2
                    : (viewportHeight - overlay.top - spinnerHeight) / 2;
                this.setState({ loadingPosition: spinnerPosition });
            }
        };
        this.handleSelectAllItemsInStore = () => {
            const { onSelectionChange, selectedItems, items, idForItem = defaultIdForItem, } = this.props;
            const newlySelectedItems = selectedItems === SELECT_ALL_ITEMS
                ? getAllItemsOnPage(items, idForItem)
                : SELECT_ALL_ITEMS;
            if (onSelectionChange) {
                onSelectionChange(newlySelectedItems);
            }
        };
        this.renderItem = (item, index) => {
            const { renderItem, idForItem = defaultIdForItem } = this.props;
            const id = idForItem(item, index);
            return (<li key={id} className={styles.ItemWrapper}>
        {renderItem(item, id, index)}
      </li>);
        };
        this.handleMultiSelectionChange = (lastSelected, currentSelected, resolveItemId) => {
            const min = Math.min(lastSelected, currentSelected);
            const max = Math.max(lastSelected, currentSelected);
            return this.props.items.slice(min, max + 1).map(resolveItemId);
        };
        this.handleCheckableButtonRegistration = (key, button) => {
            this.setState(({ checkableButtons }) => {
                return {
                    checkableButtons: new Map(checkableButtons).set(key, button),
                };
            });
        };
        this.handleSelectionChange = (selected, id, sortOrder, shiftKey) => {
            const { onSelectionChange, selectedItems, items, idForItem = defaultIdForItem, resolveItemId, } = this.props;
            const { lastSelected } = this.state;
            if (selectedItems == null || onSelectionChange == null) {
                return;
            }
            let newlySelectedItems = selectedItems === SELECT_ALL_ITEMS
                ? getAllItemsOnPage(items, idForItem)
                : [...selectedItems];
            if (sortOrder !== undefined) {
                this.setState({ lastSelected: sortOrder });
            }
            let selectedIds = [id];
            if (shiftKey &&
                lastSelected != null &&
                sortOrder !== undefined &&
                resolveItemId) {
                selectedIds = this.handleMultiSelectionChange(lastSelected, sortOrder, resolveItemId);
            }
            newlySelectedItems = [...new Set([...newlySelectedItems, ...selectedIds])];
            if (!selected) {
                for (const selectedId of selectedIds) {
                    newlySelectedItems.splice(newlySelectedItems.indexOf(selectedId), 1);
                }
            }
            if (newlySelectedItems.length === 0 && !isSmallScreen()) {
                this.handleSelectMode(false);
            }
            else if (newlySelectedItems.length > 0) {
                this.handleSelectMode(true);
            }
            if (onSelectionChange) {
                onSelectionChange(newlySelectedItems);
            }
        };
        this.handleSelectMode = (selectMode) => {
            const { onSelectionChange } = this.props;
            this.setState({ selectMode });
            if (!selectMode && onSelectionChange) {
                onSelectionChange([]);
            }
        };
        this.handleToggleAll = () => {
            const { onSelectionChange, selectedItems, items, idForItem = defaultIdForItem, } = this.props;
            const { checkableButtons } = this.state;
            let newlySelectedItems = [];
            if ((Array.isArray(selectedItems) && selectedItems.length === items.length) ||
                selectedItems === SELECT_ALL_ITEMS) {
                newlySelectedItems = [];
            }
            else {
                newlySelectedItems = items.map((item, index) => {
                    const id = idForItem(item, index);
                    return id;
                });
            }
            if (newlySelectedItems.length === 0 && !isSmallScreen()) {
                this.handleSelectMode(false);
            }
            else if (newlySelectedItems.length > 0) {
                this.handleSelectMode(true);
            }
            let checkbox;
            if (isSmallScreen()) {
                checkbox = checkableButtons.get('bulkSm');
            }
            else if (newlySelectedItems.length === 0) {
                checkbox = checkableButtons.get('plain');
            }
            else {
                checkbox = checkableButtons.get('bulkLg');
            }
            if (onSelectionChange) {
                onSelectionChange(newlySelectedItems);
            }
            // setTimeout ensures execution after the Transition on BulkActions
            setTimeout(() => {
                checkbox && checkbox.focus();
            }, 0);
        };
        const { selectedItems, polaris: { intl }, } = props;
        this.defaultResourceName = {
            singular: intl.translate('Polaris.ResourceList.defaultItemSingular'),
            plural: intl.translate('Polaris.ResourceList.defaultItemPlural'),
        };
        // eslint-disable-next-line react/state-in-constructor
        this.state = {
            selectMode: Boolean(selectedItems && selectedItems.length > 0),
            loadingPosition: 0,
            lastSelected: null,
            smallScreen: isSmallScreen(),
            checkableButtons: new Map(),
        };
    }
    selectable() {
        const { promotedBulkActions, bulkActions, selectable } = this.props;
        return Boolean((promotedBulkActions && promotedBulkActions.length > 0) ||
            (bulkActions && bulkActions.length > 0) ||
            selectable);
    }
    bulkSelectState() {
        const { selectedItems, items } = this.props;
        let selectState = 'indeterminate';
        if (!selectedItems ||
            (Array.isArray(selectedItems) && selectedItems.length === 0)) {
            selectState = false;
        }
        else if (selectedItems === SELECT_ALL_ITEMS ||
            (Array.isArray(selectedItems) && selectedItems.length === items.length)) {
            selectState = true;
        }
        return selectState;
    }
    headerTitle() {
        const { resourceName = this.defaultResourceName, items, polaris: { intl }, loading, totalItemsCount, } = this.props;
        const itemsCount = items.length;
        const resource = !loading &&
            ((!totalItemsCount && itemsCount === 1) || totalItemsCount === 1)
            ? resourceName.singular
            : resourceName.plural;
        if (loading) {
            return intl.translate('Polaris.ResourceList.loading', { resource });
        }
        else if (totalItemsCount) {
            return intl.translate('Polaris.ResourceList.showingTotalCount', {
                itemsCount,
                totalItemsCount,
                resource,
            });
        }
        else {
            return intl.translate('Polaris.ResourceList.showing', {
                itemsCount,
                resource,
            });
        }
    }
    bulkActionsLabel() {
        const { selectedItems = [], items, polaris: { intl }, } = this.props;
        const selectedItemsCount = selectedItems === SELECT_ALL_ITEMS
            ? `${items.length}+`
            : selectedItems.length;
        return intl.translate('Polaris.ResourceList.selected', {
            selectedItemsCount,
        });
    }
    bulkActionsAccessibilityLabel() {
        const { resourceName = this.defaultResourceName, selectedItems = [], items, polaris: { intl }, } = this.props;
        const selectedItemsCount = selectedItems.length;
        const totalItemsCount = items.length;
        const allSelected = selectedItemsCount === totalItemsCount;
        if (totalItemsCount === 1 && allSelected) {
            return intl.translate('Polaris.ResourceList.a11yCheckboxDeselectAllSingle', { resourceNameSingular: resourceName.singular });
        }
        else if (totalItemsCount === 1) {
            return intl.translate('Polaris.ResourceList.a11yCheckboxSelectAllSingle', {
                resourceNameSingular: resourceName.singular,
            });
        }
        else if (allSelected) {
            return intl.translate('Polaris.ResourceList.a11yCheckboxDeselectAllMultiple', {
                itemsLength: items.length,
                resourceNamePlural: resourceName.plural,
            });
        }
        else {
            return intl.translate('Polaris.ResourceList.a11yCheckboxSelectAllMultiple', {
                itemsLength: items.length,
                resourceNamePlural: resourceName.plural,
            });
        }
    }
    paginatedSelectAllText() {
        const { hasMoreItems, selectedItems, items, resourceName = this.defaultResourceName, polaris: { intl }, } = this.props;
        if (!this.selectable() || !hasMoreItems) {
            return;
        }
        if (selectedItems === SELECT_ALL_ITEMS) {
            return intl.translate('Polaris.ResourceList.allItemsSelected', {
                itemsLength: items.length,
                resourceNamePlural: resourceName.plural,
            });
        }
    }
    paginatedSelectAllAction() {
        const { hasMoreItems, selectedItems, items, resourceName = this.defaultResourceName, polaris: { intl }, } = this.props;
        if (!this.selectable() || !hasMoreItems) {
            return;
        }
        const actionText = selectedItems === SELECT_ALL_ITEMS
            ? intl.translate('Polaris.Common.undo')
            : intl.translate('Polaris.ResourceList.selectAllItems', {
                itemsLength: items.length,
                resourceNamePlural: resourceName.plural,
            });
        return {
            content: actionText,
            onAction: this.handleSelectAllItemsInStore,
        };
    }
    emptySearchResultText() {
        const { polaris: { intl }, resourceName = this.defaultResourceName, } = this.props;
        return {
            title: intl.translate('Polaris.ResourceList.emptySearchResultTitle', {
                resourceNamePlural: resourceName.plural,
            }),
            description: intl.translate('Polaris.ResourceList.emptySearchResultDescription'),
        };
    }
    // eslint-disable-next-line @typescript-eslint/member-ordering
    componentDidMount() {
        this.forceUpdate();
        if (this.props.loading) {
            this.setLoadingPosition();
        }
    }
    // eslint-disable-next-line @typescript-eslint/member-ordering
    componentDidUpdate({ loading: prevLoading, items: prevItems, selectedItems: prevSelectedItems, }) {
        const { selectedItems, loading } = this.props;
        if (this.listRef.current &&
            this.itemsExist() &&
            !this.itemsExist(prevItems)) {
            this.forceUpdate();
        }
        if (loading && !prevLoading) {
            this.setLoadingPosition();
        }
        if (selectedItems && selectedItems.length > 0 && !this.state.selectMode) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({ selectMode: true });
            return;
        }
        if (prevSelectedItems &&
            prevSelectedItems.length > 0 &&
            (!selectedItems || selectedItems.length === 0) &&
            !isSmallScreen()) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({ selectMode: false });
        }
    }
    // eslint-disable-next-line @typescript-eslint/member-ordering
    render() {
        const { items, promotedBulkActions, bulkActions, filterControl, emptyState, emptySearchState, loading, showHeader = false, sortOptions, sortValue, alternateTool, selectedItems, resourceName = this.defaultResourceName, onSortChange, polaris: { intl }, } = this.props;
        const { selectMode, loadingPosition, smallScreen } = this.state;
        const filterControlMarkup = filterControl ? (<div className={styles.FiltersWrapper}>{filterControl}</div>) : null;
        const bulkActionsMarkup = this.selectable() ? (<div className={styles.BulkActionsWrapper}>
        <BulkActions label={this.bulkActionsLabel()} accessibilityLabel={this.bulkActionsAccessibilityLabel()} selected={this.bulkSelectState()} onToggleAll={this.handleToggleAll} selectMode={selectMode} onSelectModeToggle={this.handleSelectMode} promotedActions={promotedBulkActions} paginatedSelectAllAction={this.paginatedSelectAllAction()} paginatedSelectAllText={this.paginatedSelectAllText()} actions={bulkActions} disabled={loading} smallScreen={smallScreen}/>
      </div>) : null;
        const sortingSelectMarkup = sortOptions && sortOptions.length > 0 && !alternateTool ? (<div className={styles.SortWrapper}>
          <Select label={intl.translate('Polaris.ResourceList.sortingLabel')} labelInline={!smallScreen} labelHidden={smallScreen} options={sortOptions} onChange={onSortChange} value={sortValue} disabled={selectMode}/>
        </div>) : null;
        const alternateToolMarkup = alternateTool && !sortingSelectMarkup ? (<div className={styles.AlternateToolWrapper}>{alternateTool}</div>) : null;
        const headerTitleMarkup = (<div className={styles.HeaderTitleWrapper} testID="headerTitleWrapper">
        {this.headerTitle()}
      </div>);
        const selectButtonMarkup = this.selectable() ? (<div className={styles.SelectButtonWrapper}>
        <Button disabled={selectMode} icon={EnableSelectionMinor} onClick={this.handleSelectMode.bind(this, true)}>
          {intl.translate('Polaris.ResourceList.selectButtonText')}
        </Button>
      </div>) : null;
        const checkableButtonMarkup = this.selectable() ? (<div className={styles.CheckableButtonWrapper}>
        <CheckableButton accessibilityLabel={this.bulkActionsAccessibilityLabel()} label={this.headerTitle()} onToggleAll={this.handleToggleAll} plain disabled={loading}/>
      </div>) : null;
        const needsHeader = this.selectable() ||
            (sortOptions && sortOptions.length > 0) ||
            alternateTool;
        const headerWrapperOverlay = loading ? (<div className={styles['HeaderWrapper-overlay']}/>) : null;
        const showEmptyState = emptyState && !this.itemsExist() && !loading;
        const showEmptySearchState = !showEmptyState && filterControl && !this.itemsExist() && !loading;
        const headerMarkup = !showEmptySearchState &&
            !showEmptyState &&
            (showHeader || needsHeader) &&
            this.listRef.current ? (<div className={styles.HeaderOuterWrapper}>
          <Sticky boundingElement={this.listRef.current}>
            {(isSticky) => {
            const headerClassName = classNames(styles.HeaderWrapper, sortOptions &&
                sortOptions.length > 0 &&
                !alternateTool &&
                styles['HeaderWrapper-hasSort'], alternateTool && styles['HeaderWrapper-hasAlternateTool'], this.selectable() && styles['HeaderWrapper-hasSelect'], loading && styles['HeaderWrapper-disabled'], this.selectable() &&
                selectMode &&
                styles['HeaderWrapper-inSelectMode'], isSticky && styles['HeaderWrapper-isSticky']);
            return (<div className={headerClassName} testID="ResourceList-Header">
                  <EventListener event="resize" handler={this.handleResize}/>
                  {headerWrapperOverlay}
                  <div className={styles.HeaderContentWrapper}>
                    {headerTitleMarkup}
                    {checkableButtonMarkup}
                    {alternateToolMarkup}
                    {sortingSelectMarkup}
                    {selectButtonMarkup}
                  </div>
                  {bulkActionsMarkup}
                </div>);
        }}
          </Sticky>
        </div>) : null;
        const emptySearchStateMarkup = showEmptySearchState
            ? emptySearchState || (<div className={styles.EmptySearchResultWrapper}>
            <EmptySearchResult {...this.emptySearchResultText()} withIllustration/>
          </div>)
            : null;
        const emptyStateMarkup = showEmptyState ? emptyState : null;
        const defaultTopPadding = 8;
        const topPadding = loadingPosition > 0 ? loadingPosition : defaultTopPadding;
        const spinnerStyle = { paddingTop: `${topPadding}px` };
        const spinnerSize = items.length < 2 ? 'small' : 'large';
        const loadingOverlay = loading ? (<React.Fragment>
        <div className={styles.SpinnerContainer} style={spinnerStyle}>
          <Spinner size={spinnerSize} accessibilityLabel="Items are loading"/>
        </div>
        <div className={styles.LoadingOverlay}/>
      </React.Fragment>) : null;
        const className = classNames(styles.ItemWrapper, loading && styles['ItemWrapper-isLoading']);
        const loadingWithoutItemsMarkup = loading && !this.itemsExist() ? (<div className={className} tabIndex={-1}>
          {loadingOverlay}
        </div>) : null;
        const resourceListClassName = classNames(styles.ResourceList, loading && styles.disabledPointerEvents, selectMode && styles.disableTextSelection);
        const listMarkup = this.itemsExist() && !emptySearchStateMarkup && !emptyStateMarkup ? (<ul className={resourceListClassName} ref={this.listRef} aria-live="polite" aria-busy={loading}>
          {loadingOverlay}
          {items.map(this.renderItem)}
        </ul>) : null;
        const context = {
            selectable: this.selectable(),
            selectedItems,
            selectMode,
            resourceName,
            loading,
            onSelectionChange: this.handleSelectionChange,
            registerCheckableButtons: this.handleCheckableButtonRegistration,
        };
        return (<ResourceListContext.Provider value={context}>
        <div className={styles.ResourceListWrapper}>
          {filterControlMarkup}
          {headerMarkup}
          {listMarkup}
          {emptySearchStateMarkup}
          {emptyStateMarkup}
          {loadingWithoutItemsMarkup}
        </div>
      </ResourceListContext.Provider>);
    }
    itemsExist(items) {
        return (items || this.props.items).length > 0;
    }
}
ResourceListInner.Item = ResourceItem;
// eslint-disable-next-line import/no-deprecated
ResourceListInner.FilterControl = FilterControl;
function getAllItemsOnPage(items, idForItem) {
    return items.map((item, index) => {
        return idForItem(item, index);
    });
}
function defaultIdForItem(item, index) {
    return Object.prototype.hasOwnProperty.call(item, 'id')
        ? item.id
        : index.toString();
}
function isSmallScreen() {
    return typeof window === 'undefined'
        ? false
        : window.innerWidth < SMALL_SCREEN_WIDTH;
}
export const ResourceList = withAppProvider()(ResourceListInner);
