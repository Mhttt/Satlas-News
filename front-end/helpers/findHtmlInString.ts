import { fullTagRegex, regex } from './fullTagRegex';
import React from 'react';
import { Typography } from '@mui/material';

const htmlStyles = {
  a: {
    textDecoration: 'underlined',
  },
  code: {
    color: '#b44437',
    background: 'rgba(250, 239, 240, 0.78)',
  },
} as { [key: string]: { [key: string]: string } };

const findHtmlInString = (
  currentString: string,
  wrapperType: string,
  key: string,
  level?: number
) => {
  let createdElements = [];
  let replacers = [];

  let m;
  //this one finds the html tag, and name
  while ((m = fullTagRegex.exec(currentString)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === fullTagRegex.lastIndex) {
      fullTagRegex.lastIndex++;
    }

    let currentTag = 'p';
    let innerHtml = '';

    let fullInfo = m[0]; // this is the everything including '<tag>...</tag>'
    replacers.push(fullInfo);

    if (m.groups !== undefined) {
      currentTag = m.groups.tag; //this is the name 'tag' from the regex group in fullTagRegex
      innerHtml = m.groups.innerHtml;
    }

    let t;
    let attributes = {} as any;

    //this finds all the attributes and values
    while ((t = regex.exec(fullInfo)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (t.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      if (t.groups !== undefined) {
        attributes[t.groups.attr] = t.groups.val;
      }
    }

    attributes.style = htmlStyles[currentTag];

    const element = React.createElement(currentTag, attributes, innerHtml);

    createdElements.push(element);
  }

  // This is all the data that is not in a html tag
  let newString = currentString;

  // Replace all the html tags with @@, just for something to split on later an
  for (let tag of replacers) {
    newString = newString.replace(tag, '@@');
  }

  // split the string to an array on the @@ to not get the html tags
  const splicedString =
    typeof newString === 'string' ? newString.split('@@') : '';

  //create an array with alternating simple text and created elements
  let elements = [];
  let stringData = 0; // this is to keep an index of the basic data
  let createdTag = 0; // this is to keep an index of the created tags
  for (let i = 0; i < splicedString.length + createdElements.length; i++) {
    if (i % 2 == 0) {
      elements.push(splicedString[stringData]);
      stringData++;
    } else {
      elements.push(createdElements[createdTag]);
      createdTag++;
    }
  }

  //create the wrapper attributes
  const wrapperAttributes = { key } as { [key: string]: any };

  const textType = level !== undefined ? 'h' + level : 'body1';
  wrapperAttributes.variant = textType;

  const wrapper = React.createElement(
    Typography,
    wrapperAttributes,
    ...elements
  );
  return wrapper;
};

export { findHtmlInString };
