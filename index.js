const path = require('path')
const { isString } = require('@yubisaki/plugin-utils')

module.exports = (options, ctx) => {
  const { layoutComponentMap } = ctx;

  const {
    pageEnhancers = [],
    tagUrl = '/tag/',
    categoryUrl = '/category/'
  } = options;

  const isLayoutExists = name => layoutComponentMap[name] !== undefined;
  const getLayout = (name, fallback) => isLayoutExists(name) ? name : fallback;
  const isDirectChild = regularPath => path.parse(regularPath).dir === '/';

  const enhancers = [
    {
      when: ({ regularPath }) => isDirectChild(regularPath),
      frontmatter: { layout: getLayout('Page', 'Layout') },
      data: { type: 'page' }
    },
    {
      when: ({ regularPath}) => regularPath.startsWith(categoryUrl),
      frontmatter: { layout: getLayout('Category', 'Page') }
    },
    {
      when: ({ regularPath}) => regularPath === categoryUrl,
      frontmatter: { layout: getLayout('Categories', 'Page') }
    },
    {
      when: ({ regularPath }) => regularPath.startsWith(tagUrl),
      frontmatter: { layout: getLayout('Tag', 'Page') }
    },
    {
      when: ({ regularPath }) => regularPath === tagUrl,
      frontmatter: { layout: getLayout('Tags', 'Page') }
    },
    {
      when: ({ regularPath }) => regularPath === '/',
      frontmatter: { layout: getLayout('Layout') }
    },
    {
      when: ({ frontmatter }) => frontmatter && frontmatter.type === 'post',
      frontmatter: { layout: getLayout('Post', 'Page') },
      data: { type: 'post' }
    },
    ...pageEnhancers
  ]

  return {
    extendMarkdown: md => {
      md.use(require('markdown-it-task-lists'))
      md.use(require('markdown-it-imsize'), { autofill: true })
    },

    extendPageData (pageCtx) {
      const { frontmatter: rawFrontmatter } = pageCtx;

      enhancers.forEach(({
        when,
        frontmatter = {},
        data = {}
      }) => {
        if (when(pageCtx)) {
          Object.assign(rawFrontmatter, frontmatter);
          Object.assign(pageCtx, data);
        }
      })
    },

    ready () {
      const { pages } = ctx;
      const tagMap = {};
      const categoryMap = {};

      const handlersMap = (scope, map) => (key, pageKey) => {
        if (key) {
          if (!map[key]) {
            map[key] = {};
            map[key].path = `/${scope}/${key}.html`;
            map[key].pageKeys = [];
          }
          map[key].pageKeys.push(pageKey);
        }
      }

      const handleTag = handlersMap('tag', tagMap);
      const handleCategory = handlersMap('category', categoryMap);

      pages.forEach((page) => {
        let { key, frontmatter: { tag, category } } = page;
        if (tag) {
          isString(tag) && (tag = [tag]);
          Object.assign(page, { tags: tag });
          tag.forEach(t => handleTag(t, key));
        }
        if (category) {
          isString(category) && (category = [category]);
          Object.assign(page, { categories: category });
          category.forEach(c => handleCategory(c, key));
        }
      })

      ctx.tagMap = tagMap;
      ctx.categoryMap = categoryMap;

      const extraPages = [
        {
          permalink: tagUrl,
          frontmatter: { title: 'Tags' }
        },
        {
          permalink: categoryUrl,
          frontmatter: { title: 'Categories' }
        },
        ...Object.keys(tagMap).map(tagName => ({
          permalink: tagMap[tagName].path,
          meta: { tagName },
          frontmatter: { title: `${tagName} | Tags` }
        })),
        ...Object.keys(categoryMap).map(categoryName => ({
          permalink: categoryMap[categoryName].path,
          meta: { categoryName },
          frontmatter: { title: `${categoryName} | Categories` }
        }))
      ]

      extraPages.forEach(page => ctx.addPage(page));
    },

    async clientDynamicModules () {
      return [
        {
          name: 'tag.js',
          content: `export default ${JSON.stringify(ctx.tagMap, null, 2)}`
        },
        {
          name: 'category.js',
          content: `export default ${JSON.stringify(ctx.categoryMap, null, 2)}`
        }
      ]
    },

    enhanceAppFiles: [
      path.resolve(__dirname, 'clientPlugin.js')
    ]
  }
}