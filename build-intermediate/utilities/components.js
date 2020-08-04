import React from 'react';
// Wraps `element` in `Component`, if it is not already an instance of
// `Component`. If `props` is passed, those will be added as props on the
// wrapped component. If `element` is null, the component is not wrapped.
export function wrapWithComponent(element, Component, props) {
    if (element == null) {
        return null;
    }
    return isElementOfType(element, Component) ? (element) : (<Component {...props}>{element}</Component>);
}
// In development, we compare based on the name of the function because
// React Hot Loader proxies React components in order to make updates. In
// production we can simply compare the components for equality.
const isComponent = process.env.NODE_ENV === 'development'
    ? hotReloadComponentCheck
    : (AComponent, AnotherComponent) => AComponent === AnotherComponent;
// Checks whether `element` is a React element of type `Component` (or one of
// the passed components, if `Component` is an array of React components).
export function isElementOfType(element, Component) {
    if (element == null ||
        !React.isValidElement(element) ||
        typeof element.type === 'string') {
        return false;
    }
    const { type } = element;
    const Components = Array.isArray(Component) ? Component : [Component];
    return Components.some((AComponent) => typeof type !== 'string' && isComponent(AComponent, type));
}
// Returns all children that are valid elements as an array. Can optionally be
// filtered by passing `predicate`.
export function elementChildren(children, predicate = () => true) {
    return React.Children.toArray(children).filter((child) => React.isValidElement(child) && predicate(child));
}
export function ConditionalWrapper({ condition, wrapper, children, }) {
    return condition ? wrapper(children) : children;
}
export function ConditionalRender({ condition, children, }) {
    return condition ? children : null;
}
function hotReloadComponentCheck(AComponent, AnotherComponent) {
    const componentName = AComponent.name;
    const anotherComponentName = AnotherComponent.displayName;
    return (AComponent === AnotherComponent ||
        (Boolean(componentName) && componentName === anotherComponentName));
}
