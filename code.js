/**
 * Matches `@token[props]`
 * Group 1: Comma-separated props (i.e. "fill,type")
 */
const TOKEN_FORMAT = /@token\[([a-z,]*)]/g;
/**
 * Creates a list without any component instances
 * @param node The component to purge component instances from
 */
function purgeInstancesFromComponent(component) {
    // TODO: We can probably do this whole thing with the node's ID only
    // TODO: Convert everything to services
    const purgedList = component.findAll(() => true);
    const toFilter = [];
    purgedList.forEach((node) => {
        if (node.type === "INSTANCE") {
            toFilter.push(node);
            const children = node.findAll(() => true);
            children.forEach((node) => toFilter.push(node));
        }
    });
    // TODO: Test this with .filter() instead
    toFilter.forEach((nodeToErase) => {
        let index = purgedList.findIndex((node) => node === nodeToErase);
        if (index !== -1)
            purgedList.splice(index, 1);
    });
    console.log(" ");
    console.log("FINAL PURGED NODE LIST:");
    purgedList.forEach((node) => console.log(node.name));
    console.log(" ");
    return purgedList;
}
/**
 * Run only if a single component set is selected
 */
if (figma.currentPage.selection.length !== 1) {
    figma.closePlugin("Please select a single component set.");
}
else {
    for (const node of figma.currentPage.selection) {
        if (node.type !== "COMPONENT_SET") {
            figma.closePlugin("Please select a single component set.");
        }
        else {
            for (const component of node.children) {
                if (component.type === "COMPONENT") {
                    const childrenWithoutInstances = purgeInstancesFromComponent(component);
                }
            }
        }
    }
}
figma.closePlugin();
