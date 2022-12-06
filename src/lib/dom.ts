import { Logger, logger as defaultLogger } from './logger';

// node
export const getNode = (
  xpath: string,
  parent?: Node,
  logger: Logger = defaultLogger
): Node | null => {
  logger.debug(`search node: ${xpath}`);
  const result = document.evaluate(
    xpath,
    parent ?? document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  );
  const node = result.singleNodeValue;
  if (node !== null) {
    logger.debug(`node: ${showNode(node)}`);
  } else {
    logger.debug('node is not found');
  }
  return node;
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

// mutation record
export const showMutationRecord = (
  record: MutationRecord,
  logger: Logger = defaultLogger
) => {
  // .type
  logger.debug(`record type: ${record.type}`);
  // .addedNodes
  record.addedNodes.forEach((node) => {
    logger.debug(`added node: ${showNode(node)}`);
  });
  // .removedNodes
  record.removedNodes.forEach((node) => {
    logger.debug(`removed node: ${showNode(node)}`);
  });
};
