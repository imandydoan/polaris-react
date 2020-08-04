import { __rest } from "tslib";
import React, { useContext } from 'react';
import { HorizontalDotsMinor } from '@shopify/polaris-icons';
import { createUniqueIDFactory } from '@shopify/javascript-utilities/other';
import isEqual from 'lodash/isEqual';
import { classNames, variationName } from '../../utilities/css';
import { useI18n } from '../../utilities/i18n';
import { useFeatures } from '../../utilities/features';
import { ActionList } from '../ActionList';
import { Popover } from '../Popover';
import { UnstyledLink } from '../UnstyledLink';
import { ButtonGroup } from '../ButtonGroup';
import { Checkbox } from '../Checkbox';
import { Button, buttonsFrom } from '../Button';
import { ResourceListContext, SELECT_ALL_ITEMS, } from '../../utilities/resource-list';
import styles from './ResourceItem.scss';
const getUniqueCheckboxID = createUniqueIDFactory('ResourceListItemCheckbox');
const getUniqueOverlayID = createUniqueIDFactory('ResourceListItemOverlay');
class BaseResourceItem extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            actionsMenuVisible: false,
            focused: false,
            focusedInner: false,
            selected: isSelected(this.props.id, this.props.context.selectedItems),
        };
        this.node = null;
        this.checkboxId = getUniqueCheckboxID();
        this.overlayId = getUniqueOverlayID();
        this.buttonOverlay = React.createRef();
        this.setNode = (node) => {
            this.node = node;
        };
        this.handleFocus = (event) => {
            if (event.target === this.buttonOverlay.current ||
                (this.node &&
                    event.target === this.node.querySelector(`#${this.overlayId}`))) {
                this.setState({ focused: true, focusedInner: false });
            }
            else if (this.node && this.node.contains(event.target)) {
                this.setState({ focused: true, focusedInner: true });
            }
        };
        this.handleBlur = ({ relatedTarget }) => {
            if (this.node &&
                relatedTarget instanceof Element &&
                this.node.contains(relatedTarget)) {
                return;
            }
            this.setState({ focused: false, focusedInner: false });
        };
        this.handleMouseOut = () => {
            this.state.focused && this.setState({ focused: false, focusedInner: false });
        };
        this.handleLargerSelectionArea = (event) => {
            stopPropagation(event);
            this.handleSelection(!this.state.selected, event.nativeEvent.shiftKey);
        };
        this.handleSelection = (value, shiftKey) => {
            const { id, sortOrder, context: { onSelectionChange }, } = this.props;
            if (id == null || onSelectionChange == null) {
                return;
            }
            this.setState({ focused: value, focusedInner: value });
            onSelectionChange(value, id, sortOrder, shiftKey);
        };
        this.handleClick = (event) => {
            stopPropagation(event);
            const { id, onClick, url, context: { selectMode }, } = this.props;
            const { ctrlKey, metaKey } = event.nativeEvent;
            const anchor = this.node && this.node.querySelector('a');
            if (selectMode) {
                this.handleLargerSelectionArea(event);
                return;
            }
            if (anchor === event.target) {
                return;
            }
            if (onClick) {
                onClick(id);
            }
            if (url && (ctrlKey || metaKey)) {
                window.open(url, '_blank');
                return;
            }
            if (url && anchor) {
                anchor.click();
            }
        };
        // This fires onClick when there is a URL on the item
        this.handleKeyUp = (event) => {
            const { onClick = noop, context: { selectMode }, } = this.props;
            const { key } = event;
            if (key === 'Enter' && this.props.url && !selectMode) {
                onClick();
            }
        };
        this.handleActionsClick = () => {
            this.setState(({ actionsMenuVisible }) => ({
                actionsMenuVisible: !actionsMenuVisible,
            }));
        };
        this.handleCloseRequest = () => {
            this.setState({ actionsMenuVisible: false });
        };
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        const selected = isSelected(nextProps.id, nextProps.context.selectedItems);
        if (prevState.selected === selected) {
            return null;
        }
        return { selected };
    }
    shouldComponentUpdate(nextProps, nextState) {
        const { children: nextChildren } = nextProps, _a = nextProps.context, { selectedItems: nextSelectedItems } = _a, restNextContext = __rest(_a, ["selectedItems"]), restNextProps = __rest(nextProps, ["children", "context"]);
        const _b = this.props, { children } = _b, _c = _b.context, { selectedItems } = _c, restContext = __rest(_c, ["selectedItems"]), restProps = __rest(_b, ["children", "context"]);
        const nextSelectMode = nextProps.context.selectMode;
        return (!isEqual(this.state, nextState) ||
            this.props.context.selectMode !== nextSelectMode ||
            (!nextProps.context.selectMode &&
                (!isEqual(restProps, restNextProps) ||
                    !isEqual(restContext, restNextContext))));
    }
    render() {
        const { children, url, external, media, shortcutActions, ariaControls, ariaExpanded, persistActions = false, accessibilityLabel, name, context: { selectable, selectMode, loading, resourceName }, i18n, features: { newDesignLanguage }, verticalAlignment, } = this.props;
        const { actionsMenuVisible, focused, focusedInner, selected } = this.state;
        let ownedMarkup = null;
        let handleMarkup = null;
        const mediaMarkup = media ? (<div className={styles.Media} testID="Media">
        {media}
      </div>) : null;
        if (selectable) {
            const checkboxAccessibilityLabel = name || accessibilityLabel || i18n.translate('Polaris.Common.checkbox');
            handleMarkup = (<div className={styles.Handle} onClick={this.handleLargerSelectionArea} testID="LargerSelectionArea">
          <div onClick={stopPropagation} className={styles.CheckboxWrapper}>
            <div onChange={this.handleLargerSelectionArea}>
              <Checkbox testID="Checkbox" id={this.checkboxId} label={checkboxAccessibilityLabel} labelHidden checked={selected} disabled={loading}/>
            </div>
          </div>
        </div>);
        }
        if (media || selectable) {
            ownedMarkup = (<div className={styles.Owned}>
          {handleMarkup}
          {mediaMarkup}
        </div>);
        }
        const className = classNames(styles.ResourceItem, newDesignLanguage && styles.newDesignLanguage, focused && styles.focused, selectable && styles.selectable, selected && styles.selected, selectMode && styles.selectMode, persistActions && styles.persistActions, focusedInner && styles.focusedInner);
        let actionsMarkup = null;
        let disclosureMarkup = null;
        if (shortcutActions && !loading) {
            if (persistActions) {
                actionsMarkup = (<div className={styles.Actions} onClick={stopPropagation}>
            <ButtonGroup>
              {buttonsFrom(shortcutActions, {
                    plain: true,
                })}
            </ButtonGroup>
          </div>);
                const disclosureAccessibilityLabel = name
                    ? i18n.translate('Polaris.ResourceList.Item.actionsDropdownLabel', {
                        accessibilityLabel: name,
                    })
                    : i18n.translate('Polaris.ResourceList.Item.actionsDropdown');
                disclosureMarkup = (<div className={styles.Disclosure} onClick={stopPropagation}>
            <Popover activator={<Button accessibilityLabel={disclosureAccessibilityLabel} onClick={this.handleActionsClick} plain icon={HorizontalDotsMinor}/>} onClose={this.handleCloseRequest} active={actionsMenuVisible}>
              <ActionList items={shortcutActions}/>
            </Popover>
          </div>);
            }
            else {
                actionsMarkup = (<div className={styles.Actions} onClick={stopPropagation}>
            <ButtonGroup segmented testID="ShortcutActions">
              {buttonsFrom(shortcutActions, {
                    size: 'slim',
                })}
            </ButtonGroup>
          </div>);
            }
        }
        const content = children ? (<div className={styles.Content}>{children}</div>) : null;
        const containerClassName = classNames(styles.Container, verticalAlignment &&
            styles[variationName('alignment', verticalAlignment)]);
        const containerMarkup = (<div testID="Item-Content" className={containerClassName} id={this.props.id}>
        {ownedMarkup}
        {content}
        {actionsMarkup}
        {disclosureMarkup}
      </div>);
        const tabIndex = loading ? -1 : 0;
        const ariaLabel = accessibilityLabel ||
            i18n.translate('Polaris.ResourceList.Item.viewItem', {
                itemName: name || (resourceName && resourceName.singular) || '',
            });
        const accessibleMarkup = url ? (<UnstyledLink aria-describedby={this.props.id} aria-label={ariaLabel} className={styles.Link} url={url} external={external} tabIndex={tabIndex} id={this.overlayId}/>) : (<button className={styles.Button} aria-label={ariaLabel} aria-controls={ariaControls} aria-expanded={ariaExpanded} onClick={this.handleClick} tabIndex={tabIndex} ref={this.buttonOverlay}/>);
        return (<div ref={this.setNode} className={className} onClick={this.handleClick} onFocus={this.handleFocus} onBlur={this.handleBlur} onKeyUp={this.handleKeyUp} onMouseOut={this.handleMouseOut} testID="Item-Wrapper" data-href={url}>
        {accessibleMarkup}
        {containerMarkup}
      </div>);
    }
}
function noop() { }
function stopPropagation(event) {
    event.stopPropagation();
}
function isSelected(id, selectedItems) {
    return Boolean(selectedItems &&
        ((Array.isArray(selectedItems) && selectedItems.includes(id)) ||
            selectedItems === SELECT_ALL_ITEMS));
}
export function ResourceItem(props) {
    return (<BaseResourceItem {...props} context={useContext(ResourceListContext)} features={useFeatures()} i18n={useI18n()}/>);
}
