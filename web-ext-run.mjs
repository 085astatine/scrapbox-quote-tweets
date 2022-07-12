import childProcess from 'child_process';
import path from 'path';
import util from 'util';
import webExt from 'web-ext';

const chromePaths = async () => {
  const commandNames = ['google-chrome-stable', 'chromium'];
  const paths = [];
  const whichResults = commandNames.map((name) => execWhich(name));
  for await (const result of whichResults) {
    if (result) {
      paths.push(result);
    }
  }
  return paths;
};

const execWhich = (command) => {
  const exec = util.promisify(childProcess.exec);
  return exec(`which ${command}`)
    .then(({ stdout, stderr }) => {
      return stdout.trim();
    })
    .catch((error) => {
      console.log(`"${command}" is not found`);
      return null;
    });
};

const main = async () => {
  const dirname = path.dirname(new URL(import.meta.url).pathname);
  const browser = process.env.TARGET_BROWSER;
  const sourceDir = path.join(dirname, 'build', browser);

  const webExtTarget =
    browser == 'firefox'
      ? 'firefox-desktop'
      : browser === 'chrome'
      ? 'chromium'
      : undefined;

  const webExtOptions = {
    target: webExtTarget,
    sourceDir,
  };

  if (browser === 'firefox') {
    webExtOptions.startUrl = 'about:debugging#/runtime/this-firefox';
  }
  if (browser === 'chrome') {
    webExtOptions.chromiumBinary = (await chromePaths())[0];
    webExtOptions.startUrl = 'chrome://extensions';
  }

  console.log(webExtOptions);
  webExt.cmd
    .run(webExtOptions, {
      shouldExitProgram: false,
    })
    .then((extensionRunner) => {
      console.log(extensionRunner);
    });
};

main();
