import React, { useEffect } from 'react';
import EditorJS from '@editorjs/editorjs';
import { Box } from '@mui/system';
import TerracottaPlugin from './plugins/terracotta/terracotta';
// We are using require, since the packages does not include typescript definitions.
const Header = require('@editorjs/header');
const Quote = require('@editorjs/quote');
const Delimiter = require('@editorjs/delimiter');
const Paragraph = require('editorjs-paragraph-with-alignment');
const NestedList = require('@editorjs/nested-list');
const Table = require('@editorjs/table');
const SimpleImage = require('simple-image-editorjs');
import { FC, Dispatch, SetStateAction } from 'react';
import Layout from './plugins/layout/layout';

const EditorJSComp: FC<{
  editor: EditorJS | undefined;
  setEditor: Dispatch<SetStateAction<EditorJS | undefined>>;
  data: any;
}> = ({ editor, setEditor, data }) => {
  useEffect(() => {
    if (!editor) {
      const ed = new EditorJS({
        holder: 'editorjs',
        placeholder: 'Content of your post',
        tools: {
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
          },
          header: {
            class: Header,
            config: {
              placeholder: 'Enter a header',
              levels: [2, 3, 4],
              defaultLevel: 3,
            },
          },
          quote: {
            class: Quote,
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+O',
            config: {
              quotePlaceholder: 'Enter a quote',
              captionPlaceholder: "Quote's author",
            },
          },
          delimiter: Delimiter,
          list: {
            class: NestedList,
            inlineToolbar: true,
          },
          table: {
            class: Table,
            inlineToolbar: true,
            config: {
              rows: 2,
              cols: 3,
            },
          },
          image: SimpleImage,
          layout: {
            class: Layout,
            inlineToolbar: true,
          },
          terracotta: TerracottaPlugin,
        },
        data: JSON.parse(data),
      });
      setEditor(ed);
    }
  }, []);
  return (
    <Box
      marginTop={5}
      border={'1px solid black'}
      borderRadius={1}
      width="100%"
      id="editorjs"
    ></Box>
  );
};

export default EditorJSComp;
