import * as stringsJson from './es.json';

import Title from 'xml-loader!resources/fonts/Title.fnt';
import TitleStroke from 'xml-loader!resources/fonts/TitleStroke.fnt';
import Body from 'xml-loader!resources/fonts/Body.fnt';

export const strings = stringsJson;

export const fontInfo = {
  Title: {
    physicalName: 'Title',
    imagePath: 'resources/fonts/Title.png',
    fnt: Title,
  },
  TitleStroke: {
    physicalName: 'TitleStroke',
    imagePath: 'resources/fonts/TitleStroke.png',
    fnt: TitleStroke,
  },
  Body: {
    physicalName: 'Body',
    imagePath: 'resources/fonts/Body.png',
    fnt: Body,
  },
};
