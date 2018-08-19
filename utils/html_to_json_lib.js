// #!/usr/bin/env node

const commandLineArgs = require('command-line-args')
const fs = require('nano-fs');
const path = require("path");
const puppeteer = require('puppeteer');

const PARAMS_DEFINITION = [
  { name: 'help', type: String },
  { name: 'html', type: String },
  { name: 'pretty', type: Boolean},
  { name: 'src', type: String },
];

const HELP_GUIDE = `
  usage:
    ./html_to_json.sh --html="<h1>hello</h1>" --pretty
    ./html_to_json.sh --src=path/to/html.js --pretty
`;

function convertToRaw(editorState) {
  draftjs.convertToRaw(editorState);
}

async function convertHTMLToJSON(html) {
  const jsPath = path.resolve(__dirname, './html_to_json_runtime_lib.js');
  const js = await fs.readFile(jsPath, 'utf8');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const docHandle = await page.evaluateHandle('document');
  const resultHandle = await page.evaluateHandle((html, js) => {
      const script = document.createElement('script');
      script.appendChild(document.createTextNode(js));
      document.body.appendChild(script);
      const {convertToRaw, convertFromHTML} = window.docsEditorRuntime;
      const editorState = convertFromHTML(html, null, document);
      const richTextBlob = convertToRaw(editorState.getCurrentContent());
      return richTextBlob;
    },
    html,
    js,
  );
  const jsonValue = await resultHandle.jsonValue();
  await resultHandle.dispose();
  await browser.close();
  return jsonValue;
}

async function main() {
  const {src, help, pretty, html} = commandLineArgs(PARAMS_DEFINITION);
  if (!(src || html) || help) {
    console.log(HELP_GUIDE);
    return;
  }
  // html_to_json.bundle.js
  if (!html) {
    html = await fs.readFile(src, 'utf8');
  }
  const json = await convertHTMLToJSON(html);
  console.log(JSON.stringify(json, null, pretty ? 2 : 0));
}

main();
