import { findPageByKey } from '@app/util'
import tagMap from '@dynamic/tag'
import categoryMap from '@dynamic/category'

class MetaFactory {
  constructor (metaMap, pages) {
    this._metaMap = Object.assign({}, metaMap);
    Object.keys(this._metaMap).forEach(metaName => {
      const { pageKeys } = this._metaMap[metaName];
      this._metaMap[metaName].pages = pageKeys.map(key => findPageByKey(pages, key));
    })
  }

  get length () {
    return Object.keys(this._metaMap).length;
  }

  get map () {
    return this._metaMap;
  }

  get list () {
    return this.toArray();
  }

  toArray () {
    const tags = [];
    Object.keys(this._metaMap).forEach(name => {
      const { pages, path } = this._metaMap[name];
      tags.push({ pages, path, name })
    })
    return tags;
  }

  getItemByName (name) {
    return this._metaMap[name];
  }
}

export default ({ Vue }) => {
  Vue.mixin({
    computed: {
      $tags () {
        const { pages } = this.$site;
        const tags = new MetaFactory(tagMap, pages);
        return tags;
      },
      $categories () {
        const { pages } = this.$site;
        const categories = new MetaFactory(categoryMap, pages);
        return categories;
      },
      $tag () {
        const tagName = this.$route.meta.tagName;
        return this.$tags.getItemByName(tagName);
      },
      $category () {
        const categoryName = this.$route.meta.categoryName;
        return this.$categories[categoryName];
      }
    }
  })
}