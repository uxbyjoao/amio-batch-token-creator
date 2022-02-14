/**
 * Matches `@token[props]`
 * Group 1: Comma-separated props (i.e. "fill,type")
 */
const TOKEN_FORMAT = /@token\[([a-z,]*)]/g;

/**
 * Creates a list without any component instances and their children
 * @param node The component node to purge component instances and their children from
 * @return A NodeList without any component instances and their children
 */
function purgeInstancesFromComponent(
  component: ComponentNode
): Array<SceneNode> {
  // TODO: We can probably do this whole thing with the node's ID only
  // TODO: Try with a while loop instead
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
    if (index !== -1) purgedList.splice(index, 1);
  });
  return purgedList;
}

/**
 * Filters out nodes that don't have the token annotation
 * @param nodeList A list of nodes to filter
 * @param tokenFormat A RegEx for the token annotation's format
 * @return A list of only the nodes which contain token annotations
 */
function filterNonAnnotatedNodes(
  nodeList: SceneNode[],
  tokenFormat: RegExp
): SceneNode[] {
  return nodeList.filter((node) => tokenFormat.test(node.name));
}

/**
 * Main plugin function
 */
function main(): void {
  const selection = figma.currentPage.selection;
  // Plugin only runs if only a single component set is selected
  if (selection.length !== 1 || selection[0].type !== "COMPONENT_SET") {
    figma.closePlugin("Please select a single component set.");
  } else {
    const componentListNode = selection[0];
    const componentList = componentListNode.children;
    for (const component of componentList) {
      if (component.type === "COMPONENT") {
        // Purge component instances
        const purged = purgeInstancesFromComponent(component);
        // Get only nodes with token annotation
        const tokensOnly = filterNonAnnotatedNodes(purged, TOKEN_FORMAT);
      }
    }
  }
}

// Run the plugin
main();

// Make sure we close the plugin in case of any exception
figma.closePlugin("Closed with unhandled exception.");
