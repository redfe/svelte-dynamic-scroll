# Svelte Dynamic Scroll

Dynamic Scroll Component to Svelte.

## Installation

```
npm i svelte-dynamic-scroll
#or
$ yarn add svelte-dynamic-scroll
```

## Usage

```html
<script>
	import { DynamicScroll } from 'dynamic-scroll-svelte';

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
	<DynamicScroll {nextChunk} let:prop="{value}">
		<div class="row">{value}</div>
	</DynamicScroll>
</div>

<style>
	.app {
		height: 80vh;
		width: 80%;
		max-width: 300px;
		min-width: 100px;
		overflow-y: hidden;
		border: solid 1px;
		box-sizing: border-box;
		border-radius: 10px;
	}
	.row {
		border: none;
		border-top: 1px solid rgba(0, 0, 0, 0.1);
		height: 40px;
		width: 100%;
		padding: 10px;
		box-sizing: border-box;
		text-align: center;
	}
	.end {
		width: 100%;
		text-align: center;
		background-color: rgba(0, 0, 0, 0.1);
	}
</style>
```

## Demo

TODO

# create-svelte

Everything you need to build a Svelte library, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

Read more about creating a library [in the docs](https://kit.svelte.dev/docs/packaging).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

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
