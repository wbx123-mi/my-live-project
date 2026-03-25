// src/utils/hljs.ts
import hljs from 'highlight.js/lib/core';

// 重点：在 TS 中，这种引入方式可能需要你配置 tsconfig 或直接引入
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import css from 'highlight.js/lib/languages/css';
import xml from 'highlight.js/lib/languages/xml';
import json from 'highlight.js/lib/languages/json';
import markdown from 'highlight.js/lib/languages/markdown';

// 注册语言
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('css', css);
hljs.registerLanguage('html', xml); // html 其实就是 xml
hljs.registerLanguage('json', json);
hljs.registerLanguage('markdown', markdown);

// 导出配置好的 hljs
export default hljs;
