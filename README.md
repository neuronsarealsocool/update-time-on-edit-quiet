# Update time on edit — Quiet

An MIT-licensed fork of [beaussan/update-time-on-edit-obsidian](https://github.com/beaussan/update-time-on-edit-obsidian), based on upstream 2.4.0, with a separate plugin ID.

Keeps `updated` and `created` properties in sync, with the upstream date formats, ignored folders, update interval and bulk-update commands.

While enabled, hides only Obsidian's English notice:

> "filename.md" has been modified externally, merging changes automatically.

The notice is filtered before painting in the main window and popout windows, including notices whose text is filled later. Other notices, including save failures, malformed YAML and sync errors, remain visible. Automatic merging itself continues normally. Hiding a notice does not resolve the underlying conflicting writes. The filter is removed when the plugin is disabled. A future change to Obsidian's notice text or markup may require a fork update.

## Install with BRAT

Add `neuronsarealsocool/update-time-on-edit-quiet` in BRAT. Disable the original **Update time on edit**, including its entry in Lazy Plugins, to avoid duplicate writers. Enable **Update time on edit — Quiet**.

To migrate settings, close or disable both plugins and copy the original plugin's `data.json` into `.obsidian/plugins/update-time-on-edit-quiet/`. This file contains personal vault paths and must not be committed or shared.

For manual installation, download `main.js`, `manifest.json` and `styles.css` from the release into `.obsidian/plugins/update-time-on-edit-quiet/`.

## Development

```sh
npm ci --ignore-scripts
npm test
npm run build
```

Built files are in `dist/`. Release assets include the three plugin files and an AI-ready archive containing source, tests, build configuration and compiled files. It excludes personal runtime settings, dependencies and Git metadata.

Original implementation: Nicolas Beaussart / @beaussan. Quiet fork: neuronsarealsocool. See [LICENSE](LICENSE).
