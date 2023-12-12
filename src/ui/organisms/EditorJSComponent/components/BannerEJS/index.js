import { nanoid } from 'nanoid';
import { debounce } from 'lodash';
import {
  iconPhoto,
  iconImage,
  iconRefresh,
  iconTrash,
  iconPencil,
  iconCross,
} from '../../utils/icons';
import { make } from '../../utils/make';

import './index.css';

class BannerEJS {
  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @returns {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      title: 'BannerEJS',
      icon: iconPhoto,
    };
  }

  constructor({ data, config, api }) {
    this.body = document.querySelector('body');
    this.api = api;

    /**
     * Tool's initial config
     */
    this.config = {
      uploader: config.uploader || undefined,
      request: config.request || undefined,
      multiple: config.multiple || false,
      multipleLimit: config.multipleLimit || 5,
    };

    this.counter = data.banners && data.banners.length > 0 ? data.banners.length : 1;

    this.nodes = {
      root: null,
      bannersContainer: null,
      bannerAddButton: null,
    };

    this.data = {
      multiple: data.multiple || config.multiple || false,
      banners: data.banners || [],
    };

    this.selector = {
      holderInput: `.${this.SELECTORS.holderInput}`,
      imageBlock: `.${this.SELECTORS.imageBlock}`,
      imageHolder: `.${this.SELECTORS.imageHolder}`,
      imagePreview: `.${this.SELECTORS.imagePreview}`,
      urlInput: `.${this.SELECTORS.urlInput}`,
      sortInput: `.${this.SELECTORS.sortInput}`,
      searchValue: `.${this.SELECTORS.searchValue}`,
      btnEdit: `.${this.SELECTORS.btnEdit}`,
      btnRemove: `.${this.SELECTORS.btnRemove}`,
      banner: `.${this.SELECTORS.banner}`,
    };
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
    this.makeRoot();
    this.setListeners();

    return this.nodes.root;
  }

  save() {
    const data = this._getBannersData();

    this.data.banners = data;

    return this.data;
  }

  /**
   * Plugin listeners
   */
  setListeners() {
    this.setBannerAddButtonListener();
  }

  setBannerListeners(banner) {
    this.setInputListener(banner);
    this.setBtnEditListener(banner);
    this.setBtnRemoveListener(banner);
  }

  setInputListener(banner) {
    const inputs = banner.querySelectorAll(this.selector.holderInput);

    inputs.forEach((input) => {
      this.api.listeners.on(input, 'change', (ev) => this.inputFileHandler(ev), false);
    });
  }

  setBtnEditListener(banner) {
    const buttons = banner.querySelectorAll(this.selector.btnEdit);

    buttons.forEach((button) => {
      this.api.listeners.on(button, 'click', () => this.btnEditHandler(button.dataset.id), false);
    });
  }

  setBtnRemoveListener(banner) {
    const buttons = banner.querySelectorAll(this.selector.btnRemove);

    buttons.forEach((button) => {
      this.api.listeners.on(button, 'click', () => this.btnRemoveHandler(button.dataset.id), false);
    });
  }

  setBannerAddButtonListener() {
    const button = this.nodes.bannerAddButton;

    if (button) this.api.listeners.on(button, 'click', () => this.bannerAddButtonHandler(), false);
  }

  setBannerDelButtonListener(bannerId, button) {
    if (button) {
      this.api.listeners.on(button, 'click', () => this.bannerDelButtonHandler(bannerId), false);
    }
  }

  setSearchInputListener(input, bannerId) {
    this.api.listeners.on(
      input,
      'input',
      debounce((ev) => this.searchInputHandler(ev, bannerId), 500),
      false
    );
  }

  setSearchValueClearListener(button, bannerId) {
    this.api.listeners.on(button, 'click', () => this.searchValueClearHandler(bannerId), false);
  }

  setDropdownElListener(dropdownEl, bannerId) {
    this.api.listeners.on(dropdownEl, 'click', (ev) => this.dropdownElHandler(ev, bannerId), false);
  }

  /**
   * Plugin handlers
   */
  inputFileHandler(ev) {
    const [file] = ev.currentTarget.files;
    const imageBlock = ev.currentTarget.closest(this.selector.imageBlock);
    const holder = imageBlock.querySelector(this.selector.imageHolder);
    const preview = imageBlock.querySelector(this.selector.imagePreview);
    const previewImage = preview.querySelector('img');

    imageBlock.classList.add(this.CSS.loading);

    if (file && this.config.uploader) {
      this.config
        .uploader(file)
        .then((res) => {
          imageBlock.dataset.file = res.file.url;

          previewImage.src = URL.createObjectURL(file);

          this._hidden(holder);
          this._visible(preview);

          imageBlock.classList.remove(this.CSS.loading);
        })
        .catch((error) => {
          notify({ message: error.response.data.message, type: 'error' });
          this._visible(holder);
          this._hidden(preview);
        });
    } else {
      imageBlock.classList.remove(this.CSS.loading);
    }
  }

  btnEditHandler(id) {
    const input = this.nodes.root.querySelector(`input[name="file-${id}"]`);

    if (input) input.click();
  }

  btnRemoveHandler(id) {
    const input = this.nodes.root.querySelector(`input[name="file-${id}"]`);
    const imageBlock = input.closest(this.selector.imageBlock);
    const holder = imageBlock.querySelector(this.selector.imageHolder);
    const preview = imageBlock.querySelector(this.selector.imagePreview);

    if (input) {
      input.value = '';

      if (!/safari/i.test(navigator.userAgent)) {
        input.type = '';
        input.type = 'file';
      }
    }

    this._hidden(preview);
    this._visible(holder);
    imageBlock.dataset.file = undefined;
  }

  bannerAddButtonHandler() {
    if (this.counter < this.config.multipleLimit) {
      const container = this.nodes.bannersContainer;
      const banner = this.makeBanner(null);

      this.counter = this.counter + 1;

      if (this.counter === this.config.multipleLimit) {
        this._hidden(this.nodes.bannerAddButton);
      }

      container.appendChild(banner);
    }

    this._saveHack();
  }

  bannerDelButtonHandler(bannerId) {
    const banner = document.getElementById(bannerId);

    this.counter = this.counter - 1;

    if (this.counter < this.config.multipleLimit) {
      this._visible(this.nodes.bannerAddButton);
    }

    if (banner) banner.remove();
  }

  searchInputHandler(ev, bannerId) {
    const input = ev.target;
    const banner = document.getElementById(bannerId);
    const dropdown = banner.querySelector(`.${this.CSS.dropdown}`);
    const dropdownContent = banner.querySelector(`.${this.CSS.dropdownContent}`);

    this.setDropdownOpen(dropdown, dropdownContent, true);

    if (input && input.value.length > 2 && this.config.request) {
      this.config
        .request(input.value)
        .then((res) => {
          const data = res.data.items;

          if (data.length > 0) {
            data.map((item) => {
              dropdownContent.appendChild(this.makeDropdownElement(bannerId, { ...item }));
            });
          } else {
            this.setDropdownClose(dropdown, dropdownContent, true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  searchValueClearHandler(bannerId) {
    const banner = document.getElementById(bannerId);
    const searchInput = banner.querySelector(`.${this.CSS.searchInput}`);
    const searchValue = banner.querySelector(`.${this.CSS.searchValue}`);

    searchInput.value = '';
    searchValue.remove();

    this._saveHack();
  }

  dropdownHandler(ev) {
    const dropdowns = document.querySelectorAll('.bejs__dropdown');
    let targetDropdown = null;

    dropdowns.forEach((el) => {
      if (!el.classList.contains('bejs--hidden')) {
        targetDropdown = el;
      }
    });

    if (targetDropdown && ev.target !== targetDropdown && ev.target.parentNode !== targetDropdown) {
      targetDropdown.classList.add('bejs--hidden');
    }
  }

  dropdownElHandler(ev, bannerId) {
    const button = ev.target;
    const banner = document.getElementById(bannerId);
    const id = button.id;
    const name = button.dataset.name;
    const path = button.dataset.path;
    const url = button.dataset.url;
    const search = banner.querySelector(`.${this.CSS.search}`);
    const dropdown = banner.querySelector(`.${this.CSS.dropdown}`);
    const dropdownContent = banner.querySelector(`.${this.CSS.dropdownContent}`);
    const searchValue = this.makeSarchValue(bannerId, { id, name, path, url });

    search.appendChild(searchValue);
    this.setDropdownClose(dropdown, dropdownContent);
  }

  /**
   * Plugin UI Core
   */
  makeRoot() {
    const root = make('div', this.CSS.root);
    const container = make('div', this.CSS.container);
    const bannerData = this.data.banners && this.data.banners ? this.data.banners : null;

    if (!this.config.multiple) {
      const banner = this.makeBanner(bannerData[0]);

      container.appendChild(banner);
      root.appendChild(container);
    } else {
      const title = make('div', this.CSS.title);
      const bannerAddButton = this.makeBannerAddButton();

      if (this.counter === this.config.multipleLimit) {
        this._hidden(bannerAddButton);
      }

      title.innerText = 'Баннеры с категориями';

      if (bannerData && bannerData.length > 0) {
        bannerData.map((data) => {
          const banner = this.makeBanner(data);

          container.appendChild(banner);
        });
      } else {
        const banner = this.makeBanner(null);

        container.appendChild(banner);
      }

      root.appendChild(title);
      root.appendChild(container);
      root.appendChild(bannerAddButton);

      this.nodes.bannerAddButton = bannerAddButton;
    }

    this.nodes.bannersContainer = container;
    this.nodes.root = root;
  }

  /**
   * Plugin UI Elements
   */

  makeBanner(data) {
    const bannerId = nanoid();
    const banner = make('div', [this.CSS.banner, this.SELECTORS.banner], { id: bannerId });
    const bannerLeftContainer = make('div', this.CSS.bannerLeftContainer);
    const bannerRightContainer = make('div', this.CSS.bannerRightContainer);
    const bannerDelButton = this.makeBannerDelButton(bannerId);
    const bannerHeader = this.makeBannerHeader(data);
    const bannerFooter = this.makeBannerFooter(data, bannerId);

    bannerLeftContainer.appendChild(bannerHeader);
    bannerLeftContainer.appendChild(bannerFooter);
    bannerRightContainer.appendChild(bannerDelButton);

    banner.appendChild(bannerLeftContainer);

    if (this.config.multiple) {
      banner.appendChild(bannerRightContainer);
    }

    this.setBannerListeners(banner);

    return banner;
  }

  makeBannerHeader(data) {
    const header = make('div', this.CSS.header);
    const desktopBlock = this.makeDeviceBlock('Desktop', 'desktop', data);
    const mobileBlock = this.makeDeviceBlock('Mobile', 'mobile', data);

    header.appendChild(desktopBlock);
    header.appendChild(mobileBlock);

    return header;
  }

  makeBannerFooter(data, bannerId) {
    const footer = make('div', this.CSS.footer);
    const link = this.makeLinkInput(data && data.url);
    const sort = this.makeSortInput(data && data.sort);
    const search = this.makeSearch(bannerId, data);

    if (this.config.multiple) {
      footer.appendChild(sort);
      footer.appendChild(search);
    }
    footer.appendChild(link);

    return footer;
  }

  makeDeviceBlock(name, device, data) {
    const block = make('div', this.CSS.block);
    const blockName = make('span', this.CSS.blockName);
    const blockContainer = make('div', this.CSS.blockContainer);
    const image1 = this.makeImageBlock('x1', device, 'x1', data);
    const image2 = this.makeImageBlock('x2', device, 'x2', data);

    blockName.innerText = name;
    blockContainer.appendChild(image1);
    blockContainer.appendChild(image2);

    block.appendChild(blockName);
    block.appendChild(blockContainer);

    return block;
  }

  makeImageBlock(name, device, size, data) {
    const id = nanoid();
    const imageBlock = make('div', [this.CSS.imageBlock, this.SELECTORS.imageBlock]);
    const imageHolder = this.makeImageHolder(name, id);
    const imagePreview = this.makeImagePreview(id, device, size, data);
    const loader = this.makeLoader();

    imageBlock.dataset.device = device;
    imageBlock.dataset.size = size;
    imageBlock.dataset.id = id;

    if (data && data[device] && data[device][size] && data[device][size] !== 'undefined') {
      this._hidden(imageHolder);
      this._visible(imagePreview);

      imageBlock.dataset.file = data[device][size];
    } else {
      this._hidden(imagePreview);
    }

    imageBlock.appendChild(imageHolder);
    imageBlock.appendChild(imagePreview);
    imageBlock.appendChild(loader);

    return imageBlock;
  }

  makeImageHolder(text, id) {
    const imageHolder = make('label', [this.CSS.imageHolder, this.SELECTORS.imageHolder], {
      for: `file-${id}`,
    });
    const imageHolderInput = make(
      'input',
      [this.CSS.imageHolderInput, this.SELECTORS.holderInput],
      {
        type: 'file',
        name: `file-${id}`,
        accept: 'image/png, image/jpeg, image/webp, image/gif, image/svg+xml',
        hidden: 'true',
      }
    );
    const imageHolderIcon = make('div', this.CSS.imageHolderIcon);
    const imageHolderText = make('span', this.CSS.imageHolderText);

    imageHolderIcon.appendChild(this.ICONS.image);
    imageHolderText.textContent = text;

    imageHolder.appendChild(imageHolderInput);
    imageHolder.appendChild(imageHolderIcon);
    imageHolder.appendChild(imageHolderText);

    return imageHolder;
  }

  makeImagePreview(id, device, size, data) {
    const preview = make('div', [this.CSS.preview, this.SELECTORS.imagePreview]);
    const previewFooter = make('div', this.CSS.previewFooter);
    const btnEdit = make('button', [this.CSS.previewButton, this.SELECTORS.btnEdit], {
      type: 'button',
      data: {
        id,
      },
    });
    const btnRemove = make('button', [this.CSS.previewButton, this.SELECTORS.btnRemove], {
      type: 'button',
      data: {
        id,
      },
    });

    const previewImage = make('div', this.CSS.previewImage);
    const image = make('img', this.CSS.previewImg, { src: data ? data[device][size] : '' });

    btnEdit.appendChild(this.ICONS.pencil);
    btnRemove.appendChild(this.ICONS.trash);
    previewImage.appendChild(image);
    previewFooter.appendChild(btnEdit);
    previewFooter.appendChild(btnRemove);

    preview.appendChild(previewImage);
    preview.appendChild(previewFooter);

    return preview;
  }

  makeLinkInput(url) {
    const input = make('input', [this.CSS.input, this.SELECTORS.urlInput], {
      type: 'text',
      placeholder: this.config.multiple
        ? 'Укажите относительную ссылку'
        : 'Укажите ссылку для баннера',
      name: 'url',
      value: url ? url : '',
    });

    return input;
  }

  makeSortInput(value) {
    const input = make('input', [this.CSS.input, this.SELECTORS.sortInput], {
      type: 'text',
      placeholder: 'Сортировка',
      value: value ? value : '',
    });

    input.addEventListener('input', (ev) => {
      const reg = /\D/;
      const el = ev.currentTarget;
      const value = el.value;

      input.value = value.replace(reg, '');
    });

    return input;
  }

  makeSearch(bannerId, data) {
    const search = make('div', this.CSS.search);
    const input = this.makeSearchInput(bannerId);
    const dropdown = this.makeDropdown();

    search.appendChild(input);
    search.appendChild(dropdown);

    if (data && data.categoryId && data.categoryName && data.categoryPath && data.categoryURL) {
      const { categoryId, categoryName, categoryPath, categoryURL } = data;

      search.appendChild(
        this.makeSarchValue(bannerId, {
          id: categoryId,
          name: categoryName,
          path: categoryPath,
          url: categoryURL,
        })
      );
    }

    return search;
  }

  makeSearchInput(bannerId) {
    const input = make('input', [this.CSS.input, this.CSS.searchInput], {
      type: 'text',
      placeholder: 'Введите название категории',
    });

    this.setSearchInputListener(input, bannerId);

    return input;
  }

  makeSarchValue(bannerId, { id, name, path, url }) {
    const searchValue = make('div', [this.CSS.searchValue, this.SELECTORS.searchValue]);
    const searchValueText = make('div', this.CSS.searchValueText);
    const searchValueName = make('span', this.CSS.searchValueName);
    const searchValueClear = make('button', this.CSS.searchValueClear, { type: 'button' });

    searchValueClear.appendChild(this.ICONS.cross);
    this.setSearchValueClearListener(searchValueClear, bannerId);

    searchValueName.innerText = `${path}/${name}`;

    searchValueText.appendChild(searchValueName);

    searchValue.dataset.id = id;
    searchValue.dataset.name = name;
    searchValue.dataset.path = path;
    searchValue.dataset.url = url;

    searchValue.appendChild(searchValueText);
    searchValue.appendChild(searchValueClear);

    return searchValue;
  }

  makeDropdown() {
    const dropdown = make('div', [this.CSS.dropdown, this.CSS.hidden]);
    const dropdownContent = make('div', this.CSS.dropdownContent);
    const dropdownEmpty = make('p', this.CSS.dropdownEmpty);

    dropdownEmpty.innerText = 'Пусто';

    dropdown.appendChild(dropdownEmpty);

    dropdown.appendChild(dropdownContent);

    return dropdown;
  }

  makeDropdownElement(bannerId, { id, name, path, url }) {
    const dropdownElName = make('span', this.CSS.dropdownElName);
    const dropdownElId = make('span', this.CSS.dropdownElId);
    const button = make('button', this.CSS.dropdownEl, {
      type: 'button',
      id,
      data: {
        name,
        path,
        url,
      },
    });

    const transformedName = this._transformName(bannerId, name);

    dropdownElId.innerText = `${path}/`;
    dropdownElName.innerHTML = transformedName;

    button.appendChild(dropdownElId);
    button.appendChild(dropdownElName);

    this.setDropdownElListener(button, bannerId);

    return button;
  }

  makeBannerAddButton() {
    const button = make('button', this.CSS.bannerAddButton, { type: 'button' });

    button.innerText = 'Добавить';

    return button;
  }

  makeBannerDelButton(bannerId) {
    const button = make('button', this.CSS.bannerDelButton, { type: 'button' });
    const icon = this.ICONS.trash;

    button.appendChild(icon);
    this.setBannerDelButtonListener(bannerId, button);

    return button;
  }

  makeLoader() {
    const loader = make('div', this.CSS.loader);
    const loaderIcon = make('div');

    loaderIcon.appendChild(this.ICONS.refresh);
    loader.appendChild(loaderIcon);

    return loader;
  }

  /**
   * Plugin UI Helpers
   */
  setDropdownOpen(dropdown, dropdownContent, clear) {
    this.api.listeners.on(this.body, 'click', this.dropdownHandler, true);

    if (clear) dropdownContent.innerHTML = '';
    this._visible(dropdown);
  }

  setDropdownClose(dropdown, dropdownContent, clear) {
    this.api.listeners.off(this.body, 'click', this.dropdownHandler, true);

    if (clear) dropdownContent.innerHTML = '';
    this._hidden(dropdown);
  }

  /**
   * @returns {object} - Link Tool styles
   */
  get CSS() {
    return {
      root: 'bejs',
      container: 'bejs__container',
      title: 'bejs__title',
      header: 'bejs__header',
      footer: 'bejs__footer',
      banner: 'bejs__banner',
      bannerLeftContainer: 'bejs__banner-left-container',
      bannerRightContainer: 'bejs__banner-right-container',
      bannerDelButton: 'bejs__banner-del-button',
      bannerAddButton: 'bejs__banner-add-button',
      block: 'bejs__block',
      blockName: 'bejs__block-name',
      blockContainer: 'bejs__block-container',
      imageHolder: 'bejs__image-holder',
      imageHolderInput: 'bejs__image-holder__input',
      imageHolderIcon: 'bejs__image-holder__icon',
      imageHolderText: 'bejs__image-holder__text',
      imageBlock: 'bejs__image-block',
      input: 'bejs__input',
      preview: 'bejs__preview',
      previewFooter: 'bejs__preview-footer',
      previewButton: 'bejs__preview-button',
      previewImage: 'bejs__preview-image',
      previewImg: 'bejs__preview-img',
      search: 'bejs__search',
      searchInput: 'bejs__search-input',
      searchValue: 'bejs__search-value',
      searchValueText: 'bejs__search-value-text',
      searchValueName: 'bejs__search-value-name',
      searchValueId: 'bejs__search-value-id',
      searchValueClear: 'bejs__search-value-clear',
      dropdown: 'bejs__dropdown',
      dropdownContent: 'bejs__dropdown-content',
      dropdownEmpty: 'bejs__empty',
      dropdownEl: 'bejs__dropdown-el',
      dropdownElName: 'bejs__dropdown-el-name',
      dropdownElId: 'bejs__dropdown-el-id',
      loader: 'bejs__loader',
      hidden: 'bejs--hidden',
      loading: 'bejs--loading',
    };
  }

  /**
   * @returns {object} - Link Tool styles
   */
  get SELECTORS() {
    return {
      banner: 'js-banner',
      holderInput: 'js-holder-input',
      imageBlock: 'js-image-block',
      imageHolder: 'js-image-holder',
      imagePreview: 'js-image-preview',
      btnEdit: 'js-button-edit',
      btnRemove: 'js-button-remove',
      urlInput: 'js-url-input',
      sortInput: 'js-sort-input',
      searchValue: 'js-search-value',
      dropdown: 'js-dropdown',
    };
  }

  /**
   * @returns {object} - Link Tool icons
   */
  get ICONS() {
    return {
      image: iconImage(),
      pencil: iconPencil(),
      trash: iconTrash(),
      refresh: iconRefresh(),
      cross: iconCross(),
    };
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

  _getBannersData() {
    const data = [];
    const banners = this.nodes.bannersContainer.querySelectorAll(this.selector.banner);

    if (banners) {
      banners.forEach((el) => {
        const urlInput = el.querySelector(this.selector.urlInput);
        const imageBlocks = el.querySelectorAll(this.selector.imageBlock);
        let sortInput = null;
        let searchValue = null;

        if (this.config.multiple) {
          sortInput = el.querySelector(this.selector.sortInput);
          searchValue = el.querySelector(this.selector.searchValue);
        }

        let banner = {
          url: urlInput.value,
          sort: sortInput ? sortInput.value : null,
          categoryId: searchValue ? searchValue.dataset.id : null,
          categoryName: searchValue ? searchValue.dataset.name : null,
          categoryPath: searchValue ? searchValue.dataset.path : null,
          categoryURL: searchValue ? searchValue.dataset.url : null,
          desktop: {
            x1: null,
            x2: null,
          },
          mobile: {
            x1: null,
            x2: null,
          },
        };

        imageBlocks.forEach((imageBlock) => {
          const device = imageBlock.dataset.device;
          const size = imageBlock.dataset.size;
          const file = imageBlock.dataset.file;

          banner[device][size] = file;
        });

        data.push(banner);
      });
    }

    return data;
  }

  _transformName(bannerId, name) {
    const banner = document.getElementById(bannerId);
    const searchInput = banner.querySelector(`.${this.CSS.searchInput}`);
    const value = searchInput.value;
    const firstIndex = name.toLowerCase().indexOf(value.toLowerCase());
    const lastIndex = firstIndex + value.length;
    const substr = name.substring(firstIndex, lastIndex);

    return name.replace(substr, `<b>${substr}</b>`);
  }

  _saveHack() {
    const hackDiv = make('div', [this.CSS.hidden]);

    if (this.nodes.root) {
      this.nodes.root.appendChild(hackDiv);

      hackDiv.remove();
    }
  }
}

export default BannerEJS;
