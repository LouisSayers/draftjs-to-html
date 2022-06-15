/* @flow */

import { getBlockMarkup } from './block';
import { isList, getListMarkup } from './list';

/**
* The function will generate html markup for given draftjs editorContent.
*/
export default function draftToHtml(
  editorContent,
  hashtagConfig,
  directional,
  customEntityTransform,
) {
  const html = [];
  const cssClasses = new Set();
  const { blocks, entityMap } = (editorContent || {});

  if (!blocks || blocks.length === 0) {
    return { html: '', cssClasses: [] };
  }

  let listBlocks = [];

  for (let i = 0; i < blocks.length; i += 1) {
    const block = blocks[i];

    if (isList(block.type)) {
      listBlocks.push(block);
      continue; // eslint-disable-line no-continue
    }

    if (listBlocks.length > 0) {
      const { html: listHtml, classes } = getListMarkup(listBlocks, entityMap, hashtagConfig, directional, customEntityTransform); // eslint-disable-line max-len
      html.push(listHtml);
      classes.forEach((klass) => cssClasses.add(klass));
      listBlocks = [];
    }

    const { html: blockHtml, classes } = getBlockMarkup(
      block,
      entityMap,
      hashtagConfig,
      directional,
      customEntityTransform,
    );

    html.push(blockHtml);
    classes.forEach((klass) => cssClasses.add(klass));
  }

  if (listBlocks.length > 0) {
    const { html: listHtml, classes } = getListMarkup(listBlocks, entityMap, hashtagConfig, directional, customEntityTransform); // eslint-disable-line max-len
    html.push(listHtml);
    classes.forEach((klass) => cssClasses.add(klass));
  }

  return { html: html.join(''), cssClasses: [...cssClasses] };
}
