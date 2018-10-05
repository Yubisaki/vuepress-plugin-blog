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

- default: /tag/

This option is the page path which will show tags or tag's posts

**categoryUrl**
- Type: `string`

- default: /category/

This option is the page path which will show categories or category's posts

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

**Vue.computed.$tags/Vue.computed.$categories**
- length: The length of all the tags

- map: Object of tags

- list: Array of tags data
```js
[{ name, path, pages }]
```
  - name: The tag name, such as `React`, `Redux`
  - path: The tag path which page show the tag's posts, such as `xxx.blog/tag/react` will show the posts(the pages field) which tag is `react`
  - pages: The posts which the tag contain

**Vue.computed.$tag/Vue.computed.$category**
This value is a item of `Vue.computed.$tags.list` which the name field equal to `this.$route.meta.tagName`

## The Layout maybe you should support

- Tags: This layout is used to show the tags page or tag's post, such as `xxx.blog/tag/`

- Tag: This layout is used to show the posts which tag equal to tag url, such as `xxx.bloh/tag/react` will show the post which tag is `react`

- Categories: As same as the Tags layout

- Category: As same as the Tag layout