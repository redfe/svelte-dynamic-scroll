[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/redfe/svelte-dynamic-scroll/actions/workflows/ci.yml/badge.svg)](https://github.com/redfe/svelte-dynamic-scroll/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/svelte-dynamic-scroll.svg)](https://badge.fury.io/js/svelte-dynamic-scroll)

# Svelte Dynamic Scroll

Dynamic Scroll Component for Svelte.

## Installation

```
$ npm i svelte-dynamic-scroll

or

$ yarn add svelte-dynamic-scroll
```

## Usage

```svelte
<script>
	import DynamicScroll from 'svelte-dynamic-scroll';

	/**
	 * @param {number} lastValue
	 */
	function nextChunk(lastValue) {
		const _last = lastValue ?? -1;
		let array = [];
		for (let i = 0; i < 10; i++) {
			array.push(_last + (i + 1));
		}
		return array;
	}
</script>

<div class="app">
	<h2>Infinite Scroll</h2>
	<div class="container">
		<DynamicScroll {nextChunk} let:prop={{ value }}>
			<div class="row">{value}</div>
		</DynamicScroll>
	</div>
</div>

<style>
	   ...
	.container {
	       ...
		height: 80vh;
	       ...
	}
</style>
```

## Demo

https://redfe.github.io/svelte-dynamic-scroll

## Properties

| Property               | Type     | Default   | Description                                                                          |
| ---------------------- | -------- | --------- | ------------------------------------------------------------------------------------ |
| previousChunk          | function | undefined | Function to be called when the scroll reaches the top of the container.              |
| nextChunk              | function | undefined | Function to be called when the scroll reaches the bottom of the container.           |
| bufferSize             | number   | -1        | Number of elements to be rendered before and after the visible area.                 |
| triggerRangeRatio      | number   | 0.1       | The ratio of the visible area to trigger the previousChunk or nextChunk function.    |
| maxRetryCountOnPreLoad | number   | 20        | Maximum number of retries when the previousChunk or nextChunk function returns null. |
| onScrollCallback       | function | undefined | Callback function to be invoked when the scroll event occurs.                        |

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

Everything inside `src/lib` is part of your library, everything inside `src/routes` can be used as a showcase or preview app.

## Building

To build your library:

```bash
npm run package
```

To create a production version of your showcase app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## Publishing

Go into the `package.json` and give your package the desired name through the `"name"` option. Also consider adding a `"license"` field and point it to a `LICENSE` file which you can create from a template (one popular option is the [MIT license](https://opensource.org/license/mit/)).

To publish your library to [npm](https://www.npmjs.com):

```bash
npm publish
```
