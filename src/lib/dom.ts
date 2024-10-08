// node
export const getNode = (xpath: string, parent?: Node): Node | null => {
  const result = document.evaluate(
    xpath,
    parent ?? document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null,
  );
  return result.singleNodeValue;
};

export const getNodeSnapshot = (xpath: string, parent?: Node): Node | null => {
  const result = document.evaluate(
    xpath,
    parent ?? document,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null,
  );
  return result.snapshotItem(0);
};

export const getNodes = (xpath: string, parent?: Node): Node[] => {
  const result = document.evaluate(
    xpath,
    parent ?? document,
    null,
    XPathResult.ORDERED_NODE_ITERATOR_TYPE,
    null,
  );
  const nodes: Node[] = [];
  let node: Node | null;
  while ((node = result.iterateNext())) {
    nodes.push(node);
  }
  return nodes;
};

export const getNodeSnapshots = (xpath: string, parent?: Node): Node[] => {
  const result = document.evaluate(
    xpath,
    parent ?? document,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null,
  );
  const nodes: Node[] = [];
  for (let i = 0; i < result.snapshotLength; ++i) {
    const node = result.snapshotItem(i);
    if (node !== null) {
      nodes.push(node);
    }
  }
  return nodes;
};

export const nodeTypeToString = (nodeType: number): string => {
  switch (nodeType) {
    case Node.ELEMENT_NODE: // 1
      return 'Element';
    case Node.ATTRIBUTE_NODE: // 2
      return 'Attribute';
    case Node.TEXT_NODE: // 3
      return 'Text';
    case Node.CDATA_SECTION_NODE: // 4
      return 'CDataSection';
    case Node.PROCESSING_INSTRUCTION_NODE: // 7
      return 'ProcessingInstruction';
    case Node.COMMENT_NODE: // 8
      return 'Comment';
    case Node.DOCUMENT_NODE: // 9
      return 'Document';
    case Node.DOCUMENT_TYPE_NODE: // 10
      return 'DocumentType';
    case Node.DOCUMENT_FRAGMENT_NODE: // 11
      return 'DocumentFragment';
    // deprecated
    case Node.ENTITY_REFERENCE_NODE: // 5
    case Node.ENTITY_NODE: // 6
    case Node.NOTATION_NODE: // 12
      return 'deprecated';
    default:
      return 'undefined';
  }
};

export const showNodeType = (nodeType: number): string => {
  return `${nodeType}(${nodeTypeToString(nodeType)})`;
};

export const showNode = (node: Node): string => {
  return `${node.nodeName} type=${showNodeType(node.nodeType)}`;
};

// element
export const isElement = (node: Node): node is Element => {
  return node instanceof Element;
};

export const isHTMLElement = (node: Node): node is HTMLElement => {
  return node instanceof HTMLElement;
};

export const getElement = (xpath: string, parent?: Node): Element | null => {
  const node = getNode(xpath, parent);
  if (node !== null && isElement(node)) {
    return node;
  }
  return null;
};

export const getElementSnapshot = (
  xpath: string,
  parent?: Node,
): Element | null => {
  const node = getNodeSnapshot(xpath, parent);
  if (node !== null && isElement(node)) {
    return node;
  }
  return null;
};

export const getElements = (xpath: string, parent?: Node): Element[] => {
  return getNodes(xpath, parent).filter(isElement);
};

export const getElementSnapshots = (
  xpath: string,
  parent?: Node,
): Element[] => {
  return getNodeSnapshots(xpath, parent).filter(isElement);
};

export type MutationRecordInfo = {
  type: string;
  addedNodes: string[];
  removedNodes: string[];
};

// mutation record
export const mutationRecordInfo = (
  record: MutationRecord,
): MutationRecordInfo => {
  return {
    type: `${record.type}`,
    addedNodes: Array.from(record.addedNodes, (node) => showNode(node)),
    removedNodes: Array.from(record.removedNodes, (node) => showNode(node)),
  };
};
