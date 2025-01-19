class Section {
  constructor({ items, renderer, containerSelector }) {
    this._items = items;
    this._renderer = renderer;
    this._container = document.querySelector(containerSelector);
  }

  // Renders all items in the list using the renderer function
  renderItems() {
    this._items.forEach((item) => {
      this._renderer(item);
    });
  }

  // Adds a new item to the list and renders it
  addItem(element) {
    this._container.append(element); // Append the new item to the container
  }
}

export default Section;
