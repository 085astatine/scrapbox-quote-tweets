import path from 'path';
import webExt from 'web-ext';

const dirname = path.dirname(new URL(import.meta.url).pathname);
const browser = process.env.TARGET_BROWSER;
const sourceDir = path.join(dirname, 'build', browser);

const webExtTarget =
  browser == 'firefox'
    ? 'firefox-desktop'
    : browser === 'chrome'
    ? 'chromium'
    : undefined;

webExt.cmd
  .run(
    {
      target: webExtTarget,
      sourceDir,
    },
    {
      shouldExitProgram: false,
    }
  )
  .then((extensionRunner) => {
    console.log(extensionRunner);
  });
