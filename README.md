<div align="center">
<img src="./htdocs/luci-static/fluent/img/fluent.svg" alt="luci-theme-fluent" width="96" />

# luci-theme-fluent

A FluentUI-inspired OpenWrt LuCI theme with SCSS, CSS custom properties, and ucode templates.

[![license](https://img.shields.io/badge/license-Apache_2.0-blue.svg?style=flat-square)](./LICENSE)
[![node](https://img.shields.io/badge/node-%3E%3D18-339933.svg?style=flat-square)](./package.json)
[![pnpm](https://img.shields.io/badge/pnpm-10.12.4-f69220.svg?style=flat-square)](./package.json)

**English** | [简体中文](#简体中文导航)

[特性](#key-features) • [安装](#getting-started) • [配置](#configuration) • [构建](#build) • [目录](#project-structure) • [开发](#development) • [参考](#credits)
</div>

## Key Features

- FluentUI-inspired visual style for LuCI.
- SCSS-based architecture with reusable partials.
- Theme tokens driven by CSS custom properties.
- ucode templates for LuCI header, footer, and login pages.
- Theme settings UI for colors, animation, and login appearance.
- Structured overrides for plugin-specific OpenWrt pages.
- OpenWrt packaging ready through the included `Makefile`.

## Getting Started

### Install from an OpenWrt source tree

Clone this package into your OpenWrt package feed or package directory, then select it in `menuconfig`:

```bash
make menuconfig
```

Choose `LuCI -> Themes -> luci-theme-fluent`, then build your firmware or package as usual.

### Install on a running device

Build and install the generated package with your usual OpenWrt workflow, then apply the theme from the LuCI appearance settings.

## Configuration

The theme exposes a LuCI settings page for:

- color mode
- primary colors
- animation behavior
- login page appearance

The settings view is implemented in `src/web/resources/view/fluent-config.tsx`.

## Build

### Root scripts

```bash
pnpm install
pnpm run build
pnpm run lint
pnpm run i18n:extract
pnpm run i18n:export
```

### Source scripts

```bash
cd src
pnpm install
pnpm run build
pnpm run watch
pnpm run typecheck
```

### Output paths

- CSS: `htdocs/luci-static/fluent/css/fluent.css`
- JS: `htdocs/luci-static/resources/`

## Project Structure

```text
luci-theme-fluent/
├── htdocs/luci-static/fluent/
├── src/scss/
├── src/web/resources/
├── ucode/template/themes/fluent/
├── root/etc/uci-defaults/
├── Makefile
└── package.json
```

## Development

- `src/scss/fluent.scss` is the main Sass entry point.
- `src/scss/components/` contains reusable component styles.
- `src/scss/layouts/` contains page-level layout styles.
- `src/scss/overrides/` contains plugin-specific overrides.
- `src/web/resources/` contains the LuCI-side TypeScript/TSX code.

## Credits

- [Microsoft Fluent Design](https://developer.microsoft.com/en-us/fluentui)
- [LuCI documentation](https://openwrt.org/docs/techref/luci)
- [ucode template language](https://openwrt.org/docs/techref/utpl)
- [Apache License 2.0](./LICENSE)
