/**
 * Tool for challenges where Wes uses console.log and console.table. Used to render to page instead.
 */
class HtmlBuilder {
  constructor() {
    this.html = [];
  }

  appendHtml(htmlString) {
    this.html.push(htmlString);
  }

  appendElement(tagName, value, attributes) {
    const adjustedAttributes = attributes ? ' ' + attributes : '';
    this.appendHtml(`<${tagName}${adjustedAttributes}>${value}</${tagName}>`);
  }

  appendPageHeader(text) {
    this.appendElement('h1', text);
  }

  appendSectionHeader(text) {
    this.appendElement('h2', text);
  }

  appendParagraph(text, attributes) {
    this.appendElement('p', text, attributes);
  }

  getPropertyNamesForArray(items) {
    if (items && items.length) {
      const item = items[0];
      if (typeof item === 'object') {
        return Object.getOwnPropertyNames(item);
      }
    }

    return [];
  }

  appendTable(caption, items, displayCount = true) {
    this.appendHtml('<table>');

    const itemCount = items ? items.length : 0;
    const itemCountString = displayCount ? `  (count: ${itemCount})` : '';
    this.appendElement('caption', `${caption}${itemCountString}`);

    const propertyNames = this.getPropertyNamesForArray(items);
    const isObjectArray = propertyNames.length > 0;
    this.appendHtml('<thead><tr>');
    propertyNames.forEach(name => this.appendElement('th', name));
    this.appendHtml('</tr></thead>');

    this.appendHtml('<tbody>');
    items.forEach(item => {
      this.appendHtml('<tr>');
      if (isObjectArray) {
        propertyNames.forEach(name => this.appendElement('td', item[name]));
      } else {
        this.appendElement('td', item);
      }
      this.appendHtml('</tr>');
    });
    this.appendHtml('</tbody>');

    this.appendHtml('</table>');
  }

  appendObjectHtml(caption, obj) {
    const json = JSON.stringify(obj, null, 2);

    html.appendHtml('<div>');
    html.appendHtml(`<span style="font-weight: bold">${caption}:</span>`);
    html.appendHtml(`<pre style="margin: 0">${json}</pre>`);
    html.appendHtml('</div>');
  }

  render(selector) {
    const elem = document.querySelector(selector);
    elem.innerHTML = this.html.join('');
  }
}
