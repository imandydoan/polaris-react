import React, { useState, useEffect, useCallback } from 'react';
import { useUniqueId } from '../../../../utilities/unique-id';
import { useToggle } from '../../../../utilities/use-toggle';
import { OptionList } from '../../../OptionList';
import { ActionList } from '../../../ActionList';
import { Popover } from '../../../Popover';
import { Key } from '../../../../types';
import { KeypressListener } from '../../../KeypressListener';
import { EventListener } from '../../../EventListener';
import { ComboBoxContext } from './context';
import styles from './ComboBox.scss';
export function ComboBox({ id: idProp, options, selected, textField, preferredPosition, listTitle, allowMultiple, actionsBefore, actionsAfter, contentBefore, contentAfter, emptyState, onSelect, onEndReached, }) {
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [selectedOptions, setSelectedOptions] = useState(selected);
    const [navigableOptions, setNavigableOptions] = useState([]);
    const { value: popoverActive, setTrue: forcePopoverActiveTrue, setFalse: forcePopoverActiveFalse, } = useToggle(false);
    const id = useUniqueId('ComboBox', idProp);
    const getActionsWithIds = useCallback((actions, before) => {
        if (before) {
            return navigableOptions.slice(0, actions.length);
        }
        return navigableOptions.slice(-actions.length);
    }, [navigableOptions]);
    const visuallyUpdateSelectedOption = useCallback((newOption, oldOption) => {
        if (oldOption) {
            oldOption.active = false;
        }
        if (newOption) {
            newOption.active = true;
        }
    }, []);
    const resetVisuallySelectedOptions = useCallback(() => {
        setSelectedIndex(-1);
        navigableOptions.forEach((option) => {
            option.active = false;
        });
    }, [navigableOptions]);
    const selectOptionAtIndex = useCallback((newOptionIndex) => {
        if (navigableOptions.length === 0) {
            return;
        }
        const oldSelectedOption = navigableOptions[selectedIndex];
        const newSelectedOption = navigableOptions[newOptionIndex];
        visuallyUpdateSelectedOption(newSelectedOption, oldSelectedOption);
        setSelectedIndex(newOptionIndex);
    }, [navigableOptions, selectedIndex, visuallyUpdateSelectedOption]);
    const selectNextOption = useCallback(() => {
        if (navigableOptions.length === 0) {
            return;
        }
        let newIndex = selectedIndex;
        if (selectedIndex + 1 >= navigableOptions.length) {
            newIndex = 0;
        }
        else {
            newIndex++;
        }
        selectOptionAtIndex(newIndex);
    }, [navigableOptions, selectOptionAtIndex, selectedIndex]);
    const selectPreviousOption = useCallback(() => {
        if (navigableOptions.length === 0) {
            return;
        }
        let newIndex = selectedIndex;
        if (selectedIndex <= 0) {
            newIndex = navigableOptions.length - 1;
        }
        else {
            newIndex--;
        }
        selectOptionAtIndex(newIndex);
    }, [navigableOptions, selectOptionAtIndex, selectedIndex]);
    const selectOptions = useCallback((selected) => {
        selected && onSelect(selected);
        if (!allowMultiple) {
            resetVisuallySelectedOptions();
            forcePopoverActiveFalse();
        }
    }, [
        allowMultiple,
        forcePopoverActiveFalse,
        onSelect,
        resetVisuallySelectedOptions,
    ]);
    const handleSelection = useCallback((newSelected) => {
        let newlySelectedOptions = selected;
        if (selected.includes(newSelected)) {
            newlySelectedOptions.splice(newlySelectedOptions.indexOf(newSelected), 1);
        }
        else if (allowMultiple) {
            newlySelectedOptions.push(newSelected);
        }
        else {
            newlySelectedOptions = [newSelected];
        }
        selectOptions(newlySelectedOptions);
    }, [allowMultiple, selectOptions, selected]);
    const handleEnter = useCallback((event) => {
        if (event.keyCode !== Key.Enter) {
            return;
        }
        if (popoverActive && selectedIndex > -1) {
            const selectedOption = navigableOptions[selectedIndex];
            if (isOption(selectedOption)) {
                event.preventDefault();
                handleSelection(selectedOption.value);
            }
            else {
                selectedOption.onAction && selectedOption.onAction();
            }
        }
    }, [handleSelection, navigableOptions, popoverActive, selectedIndex]);
    const handleBlur = useCallback(() => {
        forcePopoverActiveFalse();
        resetVisuallySelectedOptions();
    }, [forcePopoverActiveFalse, resetVisuallySelectedOptions]);
    const activatePopover = useCallback(() => {
        !popoverActive && forcePopoverActiveTrue();
    }, [forcePopoverActiveTrue, popoverActive]);
    const updateIndexOfSelectedOption = useCallback((newOptions) => {
        const selectedOption = navigableOptions[selectedIndex];
        if (selectedOption && newOptions.includes(selectedOption)) {
            selectOptionAtIndex(newOptions.indexOf(selectedOption));
        }
        else if (selectedIndex > newOptions.length - 1) {
            resetVisuallySelectedOptions();
        }
        else {
            selectOptionAtIndex(selectedIndex);
        }
    }, [
        navigableOptions,
        resetVisuallySelectedOptions,
        selectOptionAtIndex,
        selectedIndex,
    ]);
    useEffect(() => {
        if (selectedOptions !== selected) {
            setSelectedOptions(selected);
        }
    }, [selected, selectedOptions]);
    useEffect(() => {
        let newNavigableOptions = [];
        if (actionsBefore) {
            newNavigableOptions = newNavigableOptions.concat(actionsBefore);
        }
        if (options) {
            newNavigableOptions = newNavigableOptions.concat(options);
        }
        if (actionsAfter) {
            newNavigableOptions = newNavigableOptions.concat(actionsAfter);
        }
        newNavigableOptions = assignOptionIds(newNavigableOptions, id);
        setNavigableOptions(newNavigableOptions);
    }, [actionsAfter, actionsBefore, id, options]);
    useEffect(() => {
        updateIndexOfSelectedOption(navigableOptions);
    }, [navigableOptions, updateIndexOfSelectedOption]);
    let actionsBeforeMarkup;
    if (actionsBefore && actionsBefore.length > 0) {
        actionsBeforeMarkup = (<ActionList actionRole="option" items={getActionsWithIds(actionsBefore, true)}/>);
    }
    let actionsAfterMarkup;
    if (actionsAfter && actionsAfter.length > 0) {
        actionsAfterMarkup = (<ActionList actionRole="option" items={getActionsWithIds(actionsAfter)}/>);
    }
    const optionsMarkup = options.length > 0 && (<OptionList role="presentation" optionRole="option" options={filterForOptions(navigableOptions)} onChange={selectOptions} selected={selectedOptions} title={listTitle} allowMultiple={allowMultiple}/>);
    const emptyStateMarkup = !actionsAfter &&
        !actionsBefore &&
        !contentAfter &&
        !contentBefore &&
        options.length === 0 &&
        emptyState && <div className={styles.EmptyState}>{emptyState}</div>;
    const selectedOptionId = selectedIndex > -1 ? `${id}-${selectedIndex}` : undefined;
    const context = {
        id,
        selectedOptionId,
    };
    return (<ComboBoxContext.Provider value={context}>
      <div onClick={activatePopover} onKeyDown={activatePopover} role="combobox" aria-expanded={popoverActive} aria-owns={id} aria-controls={id} aria-haspopup onFocus={forcePopoverActiveTrue} onBlur={handleBlur} tabIndex={options.length === 0 ? -1 : 0}>
        <KeypressListener keyCode={Key.DownArrow} handler={selectNextOption}/>
        <KeypressListener keyCode={Key.UpArrow} handler={selectPreviousOption}/>
        <EventListener event="keydown" handler={handleEnter}/>
        <KeypressListener keyCode={Key.Escape} handler={forcePopoverActiveFalse}/>
        <Popover activator={textField} active={popoverActive} onClose={forcePopoverActiveFalse} preferredPosition={preferredPosition} fullWidth preventAutofocus>
          <Popover.Pane onScrolledToBottom={onEndReached}>
            <div id={id} role="listbox" aria-multiselectable={allowMultiple}>
              {contentBefore}
              {actionsBeforeMarkup}
              {optionsMarkup}
              {actionsAfterMarkup}
              {contentAfter}
              {emptyStateMarkup}
            </div>
          </Popover.Pane>
        </Popover>
      </div>
    </ComboBoxContext.Provider>);
}
function assignOptionIds(options, id) {
    return options.map((option, optionIndex) => (Object.assign(Object.assign({}, option), { id: `${id}-${optionIndex}` })));
}
function isOption(navigableOption) {
    return 'value' in navigableOption && navigableOption.value !== undefined;
}
function filterForOptions(mixedArray) {
    return mixedArray.filter(isOption);
}
