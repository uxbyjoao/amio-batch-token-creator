/**
 * Matches `@token(Component/$token-name__token-color)`
 * Group 1: Component
 * Group 2: token-name
 * Group 3: token-color
 */
// const TOKEN_NAME_SIGNAURE_REGEXP: RegExp =
//   /@token\(([\w\s]*)\/\$([a-z\-]*)__(\w*\-\d*)\)/g;
/**
 * Matches `@token[props]`
 * Group 1: Comma-separated props (i.e. "fill,type")
 */
const TOKEN_FORMAT = /@token\[([a-z,]*)]/g;
// Run only if a single component set is selected
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
                    console.log("STARTING COMPONENT NODE TREE TRAVERSAL:", component.name);
                    // Get all subnodes, purge instances & their children
                    // TODO: We can probably do this whole thing with the node's ID only
                    // TODO: Convert everything to services
                    const childrenWithoutInstances = component.findAll(() => true);
                    let childrenToFilter = [];
                    childrenWithoutInstances.forEach((node) => {
                        if (node.type === "INSTANCE") {
                            // TODO: Remove this temporary array — here for debugging only
                            let selfWithChildren = [];
                            console.log("FOUND INSTANCE:", node.name);
                            // Pushes itself
                            selfWithChildren.push(node);
                            // Pushes children
                            const children = node.findAll(() => true);
                            children.forEach((node) => selfWithChildren.push(node));
                            console.log("ADDED TO FILTER ARRAY:");
                            selfWithChildren.forEach((node) => {
                                console.log(node.name);
                                childrenToFilter.push(node);
                            });
                        }
                    });
                    // TODO: Test this with .filter() instead
                    childrenToFilter.forEach((nodeToErase) => {
                        let index = childrenWithoutInstances.findIndex((node) => node === nodeToErase);
                        if (index !== -1)
                            childrenWithoutInstances.splice(index, 1);
                    });
                    console.log(" ");
                    console.log("FINAL PURGED NODE LIST:");
                    childrenWithoutInstances.forEach((node) => console.log(node.name));
                    console.log(" ");
                }
            }
        }
    }
}
figma.closePlugin();
