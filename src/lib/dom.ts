// node
export const getNode = (xpath: string, parent?: Node): Node | null => {
  const result = document.evaluate(
    xpath,
    parent ?? document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  );
  return result.singleNodeValue;
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
  return node.nodeType === Node.ELEMENT_NODE;
};

export const getElement = (xpath: string, parent?: Node): Element | null => {
  const node = getNode(xpath, parent);
  if (node !== null && isElement(node)) {
    return node;
  }
  return null;
};

export interface MutationRecordInfo {
  type: string;
  addedNodes: string[];
  removedNodes: string[];
}

// mutation record
export const mutationRecordInfo = (
  record: MutationRecord
): MutationRecordInfo => {
  return {
    type: `${record.type}`,
    addedNodes: Array.from(record.addedNodes, (node) => showNode(node)),
    removedNodes: Array.from(record.removedNodes, (node) => showNode(node)),
  };
};
