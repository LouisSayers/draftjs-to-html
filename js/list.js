import {
  getBlockTag,
  getBlockStyle,
  getBlockInnerMarkup,
} from './block';

/**
* Function to check if a block is of type list.
*/
export function isList(blockType) {
  return (
    blockType === 'unordered-list-item'
    || blockType === 'ordered-list-item'
  );
}

/**
* Function will return html markup for a list block.
*/
export function getListMarkup(
  listBlocks,
  entityMap,
  hashtagConfig,
  directional,
  customEntityTransform,
) {
  const listHtml = [];
  const cssClasses = new Set();
  let nestedListBlock = [];
  let previousBlock;
  listBlocks.forEach((block) => {
    let nestedBlock = false;
    if (!previousBlock) {
      listHtml.push(`<${getBlockTag(block.type)}>\n`);
    } else if (previousBlock.type !== block.type) {
      listHtml.push(`</${getBlockTag(previousBlock.type)}>\n`);
      listHtml.push(`<${getBlockTag(block.type)}>\n`);
    } else if (previousBlock.depth === block.depth) {
      if (nestedListBlock && nestedListBlock.length > 0) {
        const { html: nestedMarkup, classes } = getListMarkup(
          nestedListBlock,
          entityMap,
          hashtagConfig,
          directional,
          customEntityTransform,
        );
        classes.forEach((klass) => cssClasses.add(klass));
        listHtml.push(nestedMarkup);
        nestedListBlock = [];
      }
    } else {
      nestedBlock = true;
      nestedListBlock.push(block);
    }
    if (!nestedBlock) {
      listHtml.push('<li');
      const blockStyle = getBlockStyle(block.data);
      if (blockStyle) {
        listHtml.push(` style="${blockStyle}"`);
      }
      if (directional) {
        listHtml.push(' dir = "auto"');
      }
      listHtml.push('>');
      listHtml.push(getBlockInnerMarkup(
        block,
        entityMap,
        hashtagConfig,
        customEntityTransform,
      ));
      listHtml.push('</li>\n');
      previousBlock = block;
    }
  });
  if (nestedListBlock && nestedListBlock.length > 0) {
    const { html: listMarkup, classes } = getListMarkup(
      nestedListBlock,
      entityMap,
      hashtagConfig,
      directional,
      customEntityTransform,
    );
    classes.forEach((klass) => cssClasses.add(klass));
    listHtml.push(listMarkup);
  }
  listHtml.push(`</${getBlockTag(previousBlock.type)}>\n`);
  return { html: listHtml.join(''), classes: [...cssClasses] };
}
