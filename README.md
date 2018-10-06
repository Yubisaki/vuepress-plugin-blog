# @yubisaki/vuepress-plugin-blog

## Install

```bash
npm i @yubisaki/vuepress-plugin-blog
```

## Usage

```js
module.exports = {
  plugins: ['@yubisaki/blog']
}
```

## Options

**pageEnhancers**

- Type: `Array`

- default: []

This option is the extend enhancers for [extendPageData](https://vuepress.vuejs.org/plugin/#extendpagedata)

**tagUrl**

- Type: `string`

- default: `/tag/`

This option is the path which page show the tags or the posts of a specific tag

**categoryUrl**

- Type: `string`

- default: `/category/`

This option is the path which page show the categories or the posts of a specific category

## example

```js
module.exports = {
  plugins: ['@yubisaki/blog', {
    pageEnhancers,
    tagUrl,
    categoryUrl
  }]
}
```

## What can you get?

**extendMarkdown**

- [markdown-it-task-list](https://github.com/revin/markdown-it-task-lists)

- [markdown-it-imsize](https://github.com/tatsy/markdown-it-imsize)

**Vue.computed.$tags/Vue.computed.$categories**

- `length`: The length of all the tags

- `map`: Object of tags

- `list`: Array of tags data
```js
[{ name, path, pages }]
```
  - `name`: The tag name, such as `React`, `Redux`
  - `path`: The path which page show the posts of a specific tag, for example `xxx.blog/tag/react` will show the posts(the pages field) which tag is `react`
  - `pages`: The posts which the tag field contains

**Vue.computed.$tag/Vue.computed.$category**

This value is a item of `Vue.computed.$tags.list` which the name field equals to `this.$route.meta.tagName`

## The Layout maybe your theme should support

- `Tags`: This layout is used to show the tags page, such as `xxx.blog/tag/`

- `Tag`: This layout is used to show the posts which tag equals to tag url, for example `xxx.blog/tag/react` will show the posts which tag is `react`

- `Categories`: As same as the Tags layout

- `Category`: As same as the Tag layout