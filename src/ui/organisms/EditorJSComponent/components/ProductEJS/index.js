import { debounce } from 'lodash';
import {
  iconCross,
  iconIdString,
  iconRefresh,
  iconTrash,
  iconArrowLeftRightString,
  iconLetterR,
  iconLetterL,
  iconChecked,
} from '../../utils/icons';
import { make } from '../../utils/make';

import './index.css';
import { nanoid } from 'nanoid';

class ProductEJS {
  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @returns {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      title: 'ProductEJS',
      icon: iconIdString,
    };
  }

  constructor({ data, config, api }) {
    this.body = document.querySelector('body');
    this.api = api;

    /**
     * Tool's initial config
     */

    this.config = {
      withSwitcher: config.withSwitcher || false,
      position: config.position || 'right',
      multiple: config.multiple || false,
      request: config.request || undefined,
      multipleLimit: config.multipleLimit || 20,
      automatic: config.automatic || false,
    };

    this.counter = data.products && data.products.length > 0 ? data.products.length : 1;

    this.nodes = {
      root: null,
      value: null,
      header: null,
      body: null,
      footer: null,
      title: null,
      buttonAdd: null,
      loader: null,
      dropdown: null,
      switcherL: null,
      switcherR: null,
    };

    this.data = {
      multiple: data.multiple || config.multiple || false,
      position: data.position || this.config.position,
      automatic: data.automatic || false,
      title: data.title || '',
      products: data.products || [],
    };

    this.tunes = this.config.withSwitcher
      ? [
          {
            name: 'position',
            label: 'Switch Position',
            icon: iconArrowLeftRightString,
          },
        ]
      : [];
  }

  /**
   * Editor JS Core methods
   */

  /**
   * Renders Block content
   * @public
   * @returns {HTMLDivElement}
   */
  render() {
    this.makePlugin();

    return this.nodes.root;
  }

  save(blockContent) {
    const products = blockContent.querySelectorAll(`.${this.CSS.product}`);
    const data = this._getProductData(products);

    this.data.products = data;

    if (this.config.multiple) {
      const title = blockContent.querySelector(`.${this.CSS.title}`).value;

      if (this.config.automatic) {
        const checkbox = blockContent.querySelector(`.${this.CSS.checkboxInput}`).checked;

        this.data.automatic = checkbox;
      }

      this.data.title = title;
    }

    return this.data;
  }

  /**
   * Plugin listeners
   */
  setInputSearchListener(input, productId) {
    this.api.listeners.on(
      input,
      'input',
      debounce((ev) => this.inputSearchHandler(ev, productId), 500),
      false
    );
  }

  setDropdownElListener(dropdownEl, productId) {
    this.api.listeners.on(
      dropdownEl,
      'click',
      (ev) => this.dropdownElHandler(ev, productId),
      false
    );
  }

  setSearchValueClearListener(button, productId) {
    this.api.listeners.on(button, 'click', () => this.searchValueClearHandler(productId), false);
  }

  setButtonAddListener(button) {
    this.api.listeners.on(button, 'click', () => this.buttonAddHandler(), false);
  }

  setButtonRemoveListener(button, productId) {
    this.api.listeners.on(button, 'click', () => this.buttonRemoveHandler(productId), false);
  }

  setSwitcherListener(button) {
    this.api.listeners.on(button, 'click', () => this._toggleTune(), false);
  }

  setCheckboxListener(checkbox) {
    this.api.listeners.on(checkbox, 'click', (ev) => this.checkboxHandler(ev), false);
  }

  /**
   * Plugin handlers
   */
  inputSearchHandler(ev, productId) {
    const input = ev.target;
    const product = document.getElementById(productId);
    const dropdown = product.querySelector(`.${this.CSS.dropdown}`);
    const dropdownContent = product.querySelector(`.${this.CSS.dropdownContent}`);

    this.setDropdownOpen(dropdown);
    this._visible(this.nodes.loader);

    if (input && input.value.length > 3 && this.config.request) {
      this.config
        .request(input.value)
        .then((res) => {
          let data = null;

          if (res.data.items) {
            data = res.data.items;
          } else {
            data = this._getSearchData(res.data);
          }

          if (data.length > 0) {
            data.map((item) => {
              dropdownContent.appendChild(this.makeDropdownElement(productId, { ...item }));
            });
          } else {
            this.setDropdownClose(dropdown, dropdownContent, true);
          }

          this._hidden(this.nodes.loader);
        })
        .catch((err) => {
          console.log(err);
          this._hidden(this.nodes.loader);
          this._visible(dropdown);
        });
    } else {
      this.setDropdownClose(dropdown, dropdownContent, true);
      this._hidden(this.nodes.loader);
    }
  }

  searchValueClearHandler(productId) {
    const product = document.getElementById(productId);
    const searchInput = product.querySelector(`.${this.CSS.searchInput}`);
    const searchValue = product.querySelector(`.${this.CSS.searchValue}`);

    searchInput.value = '';
    searchValue.remove();
  }

  dropdownHandler(ev) {
    const dropdowns = document.querySelectorAll('.pejs__dropdown');
    let targetDropdown = null;

    dropdowns.forEach((el) => {
      if (!el.classList.contains('pejs--hidden')) {
        targetDropdown = el;
      }
    });

    if (targetDropdown && ev.target !== targetDropdown && ev.target.parentNode !== targetDropdown) {
      targetDropdown.classList.add('pejs--hidden');
    }
  }

  dropdownElHandler(ev, productId) {
    const button = ev.target;
    const id = button.id;
    const name = button.dataset.name;
    const code = button.dataset.code;
    const externalId = button.dataset.externalId;

    const product = document.getElementById(productId);
    const search = product.querySelector(`.${this.CSS.search}`);
    const dropdown = product.querySelector(`.${this.CSS.dropdown}`);
    const dropdownContent = product.querySelector(`.${this.CSS.dropdownContent}`);
    const searchValue = this.makeSarchValue(productId, { id, name, code, externalId });

    search.appendChild(searchValue);

    this.setDropdownClose(dropdown, dropdownContent);
  }

  buttonAddHandler() {
    if (this.counter < this.config.multipleLimit) {
      const productId = `pejs-product-${nanoid()}`;
      const product = this.makeProduct(productId);

      this.counter = this.counter + 1;

      if (this.counter === this.config.multipleLimit) {
        this._hidden(this.nodes.buttonAdd);
      }

      this.nodes.body.appendChild(product);
    }
  }

  buttonRemoveHandler(productId) {
    const product = document.getElementById(productId);

    this.counter = this.counter - 1;

    if (this.counter < this.config.multipleLimit) {
      this._visible(this.nodes.buttonAdd);
    }

    product.remove();
  }

  checkboxHandler(ev) {
    const value = ev.currentTarget;

    this.data.automatic = value.checked;

    this._saveHack();
  }

  /**
   * Plugin UI Core
   */
  makePlugin() {
    this.makeRoot();
  }

  makeRoot() {
    const rootClasses =
      this.data.position === 'right' ? [this.CSS.root, this.CSS.switched] : [this.CSS.root];
    const root = make('div', rootClasses);

    if (this.config.multiple) {
      root.classList.add(this.CSS.multiple);
    }

    this.makeLoader();

    this.makeValue();
    this.makeHeader();
    this.makeBody();
    this.makeFooter();

    root.appendChild(this.nodes.value);
    root.appendChild(this.nodes.header);
    root.appendChild(this.nodes.body);
    root.appendChild(this.nodes.footer);

    this.nodes.root = root;
  }

  makeHeader() {
    const header = make('div', this.CSS.header);
    const checkbox = this.makeAutomaticCheckbox(
      'Автоматическая рек. полка - товары с шильдиком “Хит“'
    );

    if (!this.config.multiple) {
      this._hidden(header);
    }

    this.makeTitle();

    header.appendChild(this.nodes.title);

    if (this.config.multiple && this.config.automatic) header.appendChild(checkbox);

    this.nodes.header = header;
  }

  makeBody() {
    const body = make('div', this.CSS.body);

    if (this.data.products.length > 0) {
      this.data.products.forEach((el) => {
        const productId = `pejs-product-${nanoid()}`;
        const product = this.makeProduct(productId, el);

        body.appendChild(product);
      });
    } else {
      const productId = `pejs-product-${nanoid()}`;
      const product = this.makeProduct(productId);

      body.appendChild(product);
    }

    if (!this.config.multiple) {
      const switcher = this.makeSwitcher();
      body.appendChild(switcher);
    }

    this.nodes.body = body;
  }

  makeFooter() {
    const footer = make('div', this.CSS.footer);

    if (!this.config.multiple) {
      this._hidden(footer);
    }

    this.makeButtonAdd();

    if (this.counter === this.config.multipleLimit) {
      this._hidden(this.nodes.buttonAdd);
    }

    footer.appendChild(this.nodes.buttonAdd);

    this.nodes.footer = footer;
  }

  makeProduct(productId, data) {
    const product = make('div', this.CSS.product, { id: productId });
    const container = make('div', this.CSS.productContainer);
    const search = this.makeSearch(productId);
    const remove = this.makeButtonRemove(productId);
    const dropdown = this.makeDropdown();

    if (this.config.multiple || this.data.multiple) {
      this._visible(remove);
    }

    if (data) {
      const searchValue = this.makeSarchValue(productId, { ...data });

      search.appendChild(searchValue);
    }

    container.appendChild(search);
    container.appendChild(dropdown);

    product.appendChild(container);
    product.appendChild(remove);

    return product;
  }

  makeSearch(productId) {
    const search = make('div', this.CSS.search);
    const searchInput = this.makeInputSearch(productId);

    search.appendChild(searchInput);

    return search;
  }

  makeDropdown() {
    const dropdown = make('div', [this.CSS.dropdown, this.CSS.hidden]);
    const dropdownContent = make('div', this.CSS.dropdownContent);
    const dropdownEmpty = make('p', this.CSS.dropdownEmpty);

    dropdownEmpty.innerText = 'Пусто';

    dropdown.appendChild(dropdownEmpty);

    dropdown.appendChild(this.nodes.loader);
    dropdown.appendChild(dropdownContent);

    return dropdown;
  }

  /**
   * Plugin UI Elements
   */
  makeValue() {
    const value = make('input', this.CSS.value, { type: 'text', hidden: true });

    this.nodes.value = value;
  }

  makeTitle() {
    const title = make('input', this.CSS.title, {
      type: 'text',
      placeholder: 'Укажите название рекомендательной полки, не более 70 символов',
      maxLength: '70',
      value: this.data.title || '',
    });

    this.nodes.title = title;
  }

  makeButtonAdd() {
    const buttonAdd = make('button', this.CSS.buttonAdd, { type: 'button' });

    buttonAdd.innerText = 'Добавить';

    this.setButtonAddListener(buttonAdd);
    this.nodes.buttonAdd = buttonAdd;
  }

  makeButtonRemove(productId) {
    const buttonRemove = make('button', this.CSS.buttonRemove, { type: 'button' });
    const icon = this.ICONS.trash;

    buttonRemove.appendChild(icon);
    this.setButtonRemoveListener(buttonRemove, productId);

    return buttonRemove;
  }

  makeInputSearch(productId) {
    const search = make('input', this.CSS.searchInput, {
      type: 'text',
      placeholder: 'Введите название товара или идентификатор',
    });

    this.setInputSearchListener(search, productId);

    return search;
  }

  makeDropdownElement(productId, { id, name, code, externalId }) {
    const dropdownElName = make('span', this.CSS.dropdownElName);
    const dropdownElId = make('span', this.CSS.dropdownElId);
    const button = make('button', this.CSS.dropdownEl, {
      type: 'button',
      id,
      data: {
        name,
        code,
        externalId: externalId,
      },
    });

    dropdownElName.innerText = name;
    dropdownElId.innerText = `ID ${externalId}`;

    button.appendChild(dropdownElName);
    button.appendChild(dropdownElId);

    this.setDropdownElListener(button, productId);

    return button;
  }

  makeSarchValue(productId, { id, name, code, externalId }) {
    const searchValue = make('div', this.CSS.searchValue);
    const searchValueText = make('div', this.CSS.searchValueText);
    const searchValueName = make('span', this.CSS.searchValueName);
    const searchValueId = make('span', this.CSS.searchValueId);
    const searchValueClear = make('button', this.CSS.searchValueClear, { type: 'button' });

    searchValueClear.appendChild(this.ICONS.cross);
    this.setSearchValueClearListener(searchValueClear, productId);

    searchValueName.innerText = name;
    searchValueId.innerText = `ID ${externalId}`;

    searchValueText.appendChild(searchValueName);
    searchValueText.appendChild(searchValueId);

    searchValue.dataset.id = id;
    searchValue.dataset.code = code;
    searchValue.appendChild(searchValueText);
    searchValue.appendChild(searchValueClear);

    return searchValue;
  }

  makeSwitcherBtn(icon, title) {
    const button = make('button', this.CSS.switcherBtn, { type: 'button', title });

    button.appendChild(icon);

    return button;
  }

  makeSwitcher() {
    const switcher = make('div', this.CSS.switcher);
    const buttonL = this.makeSwitcherBtn(this.ICONS.letterL, 'Изображение слева');
    const buttonR = this.makeSwitcherBtn(this.ICONS.letterR, 'Изображение справа');

    if (this.config.position === 'left' || this.data.position === 'left') {
      buttonL.classList.add(this.CSS.switcherBtnActive);
    } else {
      buttonR.classList.add(this.CSS.switcherBtnActive);
    }

    this.setSwitcherListener(buttonL);
    this.setSwitcherListener(buttonR);

    switcher.appendChild(buttonL);
    switcher.appendChild(buttonR);

    this.nodes.switcherL = buttonL;
    this.nodes.switcherR = buttonR;

    return switcher;
  }

  makeAutomaticCheckbox(labelText) {
    const label = make('label', this.CSS.checkboxLabel, {
      for: 'automatic',
    });
    const input = make('input', this.CSS.checkboxInput, {
      type: 'checkbox',
      name: 'automatic',
      checked: this.data.automatic || false,
    });
    const inner = make('div', this.CSS.checkboxInner);
    const text = make('div', this.CSS.checkboxText);
    const icon = this.ICONS.checked;

    icon.classList.add(this.CSS.checkboxIcon);

    text.innerText = labelText;

    inner.appendChild(input);
    inner.appendChild(icon);

    label.appendChild(inner);
    label.appendChild(text);

    this.setCheckboxListener(input);

    return label;
  }

  makeLoader() {
    const loader = make('div', [this.CSS.loader, this.CSS.hidden]);
    const loaderIcon = make('div');

    loaderIcon.appendChild(this.ICONS.refresh);
    loader.appendChild(loaderIcon);

    this.nodes.loader = loader;
  }

  /**
   * Plugin UI Helpers
   */
  setDropdownOpen(dropdown) {
    this.api.listeners.on(this.body, 'click', this.dropdownHandler, true);

    this._visible(dropdown);
  }

  setDropdownClose(dropdown, dropdownContent, clear) {
    this.api.listeners.off(this.body, 'click', this.dropdownHandler, true);

    if (clear) dropdownContent.innerHTML = '';
    this._hidden(dropdown);
  }

  setMultiple() {
    this.nodes.root.classList.toggle(this.CSS.multiple);
    this.nodes.header.classList.toggle(this.CSS.hidden);
    this.nodes.footer.classList.toggle(this.CSS.hidden);

    const products = this.nodes.body.querySelectorAll(`.${this.CSS.product}`);

    if (this.nodes.root.classList.contains(this.CSS.multiple)) {
      this.data.multiple = true;
      this.config.multiple = true;
    } else {
      this.data.multiple = false;
      this.config.multiple = false;

      products.forEach((product, i) => {
        if (i !== 0) product.remove();
      });
    }
  }

  /**
   * Returns image tunes config
   *
   * @returns {Array}
   */
  renderSettings() {
    return this.tunes.map((tune) => ({
      ...tune,
      label: this.api.i18n.t(tune.label),
      onActivate: () => this._toggleTune(),
    }));
    if (this.config.withSwitcher) {
    }
  }

  /**
   * @returns {object} - Link Tool styles
   */
  get CSS() {
    return {
      root: 'pejs',
      value: 'pejs__value',
      header: 'pejs__header',
      body: 'pejs__body',
      footer: 'pejs__footer',
      title: 'pejs__title',
      buttonAdd: 'pejs__add',
      buttonRemove: 'pejs__remove',
      product: 'pejs__product',
      productContainer: 'pejs__product-container',
      search: 'pejs__search',
      searchInput: 'pejs__search-input',
      searchValue: 'pejs__search-value',
      searchValueText: 'pejs__search-value-text',
      searchValueName: 'pejs__search-value-name',
      searchValueId: 'pejs__search-value-id',
      searchValueClear: 'pejs__search-value-clear',
      dropdown: 'pejs__dropdown',
      dropdownContent: 'pejs__dropdown-content',
      dropdownEmpty: 'pejs__empty',
      dropdownEl: 'pejs__dropdown-el',
      dropdownElName: 'pejs__dropdown-el-name',
      dropdownElId: 'pejs__dropdown-el-id',
      loader: 'pejs__loader',
      switcher: 'pejs__switcher',
      switcherBtn: 'pejs__switcher-btn',
      switcherBtnActive: 'pejs__switcher-btn--active',
      checkboxLabel: 'pejs__checkbox-label',
      checkboxInput: 'pejs__checkbox-input',
      checkboxIcon: 'pejs__checkbox-icon',
      checkboxInner: 'pejs__checkbox-inner',
      checkboxText: 'pejs__checkbox-text',
      hidden: 'pejs--hidden',
      switched: 'pejs--switched',
      multiple: 'pejs--multiple',
    };
  }

  /**
   * @returns {object} - Link Tool icons
   */
  get ICONS() {
    return {
      refresh: iconRefresh(),
      cross: iconCross(),
      trash: iconTrash(),
      letterR: iconLetterR(),
      letterL: iconLetterL(),
      checked: iconChecked(),
    };
  }

  /**
   * Click on the Settings Button
   *
   * @private
   */
  _toggleTune() {
    this._acceptTuneView();
  }

  /**
   * Add specified class corresponds with activated tunes
   *
   * @private
   */
  _acceptTuneView() {
    this.tunes.forEach((tune) => {
      if (tune.name === 'position') {
        this.nodes.root.classList.toggle(this.CSS.switched);

        if (this.nodes.root.classList.contains(this.CSS.switched)) {
          this.data.position = 'right';
          this.nodes.switcherL.classList.remove(this.CSS.switcherBtnActive);
          this.nodes.switcherR.classList.add(this.CSS.switcherBtnActive);
        } else {
          this.data.position = 'left';
          this.nodes.switcherL.classList.add(this.CSS.switcherBtnActive);
          this.nodes.switcherR.classList.remove(this.CSS.switcherBtnActive);
        }
      }
    });
  }

  /**
   * Transformer for Search data
   * @param {object} data
   */
  _getSearchData(data) {
    const { items } = data;
    const exportData = [];

    items.map((item) => {
      const newItem = {};

      fieldValues.map((fieldValue) => {
        if (fieldValue.code === 'id') {
          newItem.id = fieldValue.value;
        }
        if (fieldValue.code === 'name') {
          newItem.name = fieldValue.value;
        }
        if (fieldValue.code === 'code') {
          newItem.code = fieldValue.value;
        }
        if (fieldValue.code === 'external_id') {
          newItem.externalId = fieldValue.value;
        }
      });

      exportData.push(newItem);
    });

    return exportData;
  }

  _getProductData(products) {
    const data = [];

    products.forEach((product) => {
      const productData = {};
      const searchValue = product.querySelector(`.${this.CSS.searchValue}`);
      const searchValueName = product.querySelector(`.${this.CSS.searchValueName}`);
      const searchValueId = product.querySelector(`.${this.CSS.searchValueId}`);

      if (searchValue) {
        productData.id = searchValue.dataset.id;
        productData.code = searchValue.dataset.code;
      }

      if (searchValueName) {
        productData.name = searchValueName.innerText;
      }

      if (searchValueId) {
        productData.externalId = searchValueId.innerText.split(' ')[1];
      }

      if (productData.id && productData.name && productData.code && productData.externalId) {
        data.push(productData);
      }
    });

    return data;
  }

  /**
   * Helper for hidden element
   * @param {HTMLElement} node
   * @private
   */
  _hidden(node) {
    node.classList.add(this.CSS.hidden);
  }

  /**
   * Helper for visible element
   * @param {HTMLElement} node
   * @private
   */
  _visible(node) {
    node.classList.remove(this.CSS.hidden);
  }

  _saveHack() {
    const hackDiv = make('div', [this.CSS.hidden]);

    if (this.nodes.root) {
      this.nodes.root.appendChild(hackDiv);

      hackDiv.remove();
    }
  }
}

export default ProductEJS;
