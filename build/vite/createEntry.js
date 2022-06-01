import fs from 'fs';
import { resolve, dirname } from 'path';
import { normalizePath, send } from 'vite';
import { render } from 'ejs';
import { sync } from 'glob';

const cwd = process.cwd();

export function createEntry(config) {
  const input = {};
  const virtualEntrys = {};
  const entryHTML = fs.readFileSync(resolve(cwd, config.templatePath), {
    encoding: 'utf-8',
  });
  const pages = sync(`${config.pagePath}/**/app.ts`);
  pages.forEach((e) => {
    const chunk = (`${dirname(e)}/`).substr(config.pagePath.length + 1);
    input[`${chunk}index`] = normalizePath(resolve(cwd, `${chunk}index.html`));
    const html = render(entryHTML, {
      title: 'pages',
      injectScript: `<script type="module" src="/${e}"></script>`,
    });
    virtualEntrys[input[`${chunk}index`]] = html;
  });
  return {
    input,
    virtualEntrys,
  };
}

export function hqPack(config = {}) {
  const map = new Map();

  Object.keys(config.virtualEntrys).forEach((name) => {
    map.set(name, config.virtualEntrys[name]);
  });
  return {
    name: 'vite-plugin-vue-hqPack',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url) {
          let html;
          if (req.url.endsWith('.html')) {
            html = config.virtualEntrys[normalizePath(resolve(cwd, req.url.replace(new RegExp(`^${config.base}`), '').replace(/^\//, '')))];
          }
          if (req.url.endsWith('/')) {
            html = config.virtualEntrys[normalizePath(resolve(cwd, 'index.html'))];
          }
          if (html) {
            send(req, res, html, 'html', {});
          } else {
            next();
          }
        } else {
          next();
        }
      });
    },
    resolveId(id) {
      const value = map.get(id);
      if (value) {
        return id;
      }
    },
    load(id) {
      const value = map.get(id);
      if (value) {
        return value;
      }
    },
  };
}
