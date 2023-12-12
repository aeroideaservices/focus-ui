import notify from '@/utils/notify';

import {
  iconArrowLeftRightString,
  iconImage,
  iconPencil,
  iconPhotoDownString,
  iconRefresh,
  iconTrash,
} from '../../utils/icons';
import { make } from '../../utils/make';

import './index.css';

class ArticleWithImage {
  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @returns {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      title: 'ArticleWithImage',
      icon: iconPhotoDownString,
    };
  }

  constructor({ data, config, api }) {
    this.api = api;
    /**
     * Tool's initial config
     */
    this.config = {
      position: config.position || 'left',
      text: {
        placeholder:
          (config.text && config.text.placeholder) ||
          `Текст, не более ${(config.text && config.text.length) || 125} символов`,
        length: (config.text && config.text.length) || 125,
      },
      caption: {
        placeholder:
          (config.caption && config.caption.placeholder) ||
          `Подпись, не более ${(config.caption && config.caption.length) || 520} символов`,
        length: (config.caption && config.caption.length) || 520,
      },
      uploader: config.uploader || undefined,
    };

    this.nodes = {
      root: null,
      containerLeft: null,
      containerRight: null,
      textareaText: null,
      textareaCaption: null,
      imageHolder: null,
      imageHolderInput: null,
      image: null,
      preview: null,
      previewButtonEdit: null,
      previewButtonRemove: null,
      loader: null,
    };

    this.data = {
      text: data.text || '',
      caption: data.caption || '',
      position: data.position || this.config.position,
      file: data.file || undefined,
    };

    this.tunes = [
      {
        name: 'position',
        label: 'Switch Position',
        icon: iconArrowLeftRightString,
      },
    ];
  }

  /**
   * Renders Block content
   *
   * @public
   *
   * @returns {HTMLDivElement}
   */
  render() {
    this.makePlugin();
    this.setListeners();

    return this.nodes.root;
  }

  save(blockContent) {
    const textBlock = blockContent.querySelector(`.${this.CSS.text}`);
    const captionBlock = blockContent.querySelector(`.${this.CSS.caption}`);
    const text = textBlock.innerHTML;
    const caption = captionBlock.innerHTML;

    if (text.length > this.config.text.length) {
      textBlock.innerHTML = text.slice(0, this.config.text.length);
    } else {
      this.data.text = text;
    }

    if (caption.length > this.config.caption.length) {
      captionBlock.innerHTML = caption.slice(0, this.config.caption.length);
    } else {
      this.data.caption = caption;
    }

    return this.data;
  }

  setListeners() {
    this.setInputListener();
    this.setButtonEditListener();
    this.setButtonRemoveListener();
  }

  setInputListener() {
    this.api.listeners.on(
      this.nodes.imageHolderInput,
      'change',
      (ev) => this.inputFileHandler(ev, this.nodes.containerLeft),
      false
    );
  }

  setButtonEditListener() {
    this.api.listeners.on(
      this.nodes.previewButtonEdit,
      'click',
      () => this.buttonEditHandler(this.nodes.imageHolderInput),
      false
    );
  }

  setButtonRemoveListener() {
    this.api.listeners.on(
      this.nodes.previewButtonRemove,
      'click',
      () => this.buttonRemoveHandler(this.nodes.imageHolderInput),
      false
    );
  }

  buttonEditHandler(input) {
    if (input) input.click();
  }

  buttonRemoveHandler(input) {
    input.value = '';

    if (!/safari/i.test(navigator.userAgent)) {
      input.type = '';
      input.type = 'file';
    }

    this._visible(this.nodes.imageHolder);
    this.nodes.preview.remove();
    this.data.file = '';
  }

  inputFileHandler(ev, container) {
    const [file] = ev.currentTarget.files;

    this._hidden(this.nodes.imageHolder);
    this.nodes.preview.remove();
    container.appendChild(this.nodes.loader);

    if (file && this.config.uploader) {
      this.config
        .uploader(file)
        .then((res) => {
          this.data.file = res.file;

          this.nodes.image.src = URL.createObjectURL(file);

          this.nodes.loader.remove();
          this._visible(this.nodes.preview);
          container.appendChild(this.nodes.preview);
        })
        .catch((error) => {
          notify({ message: error.response.data.message, type: 'error' });
          this._visible(this.nodes.imageHolder);
          this.nodes.preview.remove();
          this.nodes.loader.remove();
        });
    } else {
      this.nodes.preview.remove();
      this.nodes.loader.remove();
      container.appendChild(this.nodes.preview);
    }
  }

  makeLoader() {
    const loader = make('div', this.CSS.loader);
    const loaderIcon = make('div');

    loaderIcon.appendChild(this.ICONS.refresh);
    loader.appendChild(loaderIcon);

    this.nodes.loader = loader;
  }

  makeImageHolder() {
    const imageHolder = make('label', [this.CSS.imageHolder, this.CSS.block], {
      for: 'image-file',
    });
    const imageHolderInput = make('input', this.CSS.imageHolderInput, {
      type: 'file',
      name: 'image-file',
      accept: 'image/png, image/jpeg, image/webp, image/gif, image/svg+xml',
      hidden: 'true',
    });
    const imageHolderIcon = make('div', this.CSS.imageHolderIcon);
    const imageHolderText = make('span', this.CSS.imageHolderText);

    imageHolderIcon.appendChild(this.ICONS.image);
    imageHolderText.textContent = 'Добавить файл';

    imageHolder.appendChild(imageHolderInput);
    imageHolder.appendChild(imageHolderIcon);
    imageHolder.appendChild(imageHolderText);

    if (this.data.file && this.data.file.url.length > 0) {
      this._hidden(imageHolder);
    }

    this.nodes.imageHolder = imageHolder;
    this.nodes.imageHolderInput = imageHolderInput;
  }

  makeImagePreview() {
    const preview = make('div', [this.CSS.preview, this.CSS.hidden]);
    const previewFooter = make('div', this.CSS.previewFooter);
    const buttonEdit = make('button', this.CSS.previewButton, { type: 'button' });
    const buttonRemove = make('button', this.CSS.previewButton, { type: 'button' });
    const previewImg = make('img', this.CSS.previewImg, {
      src: this.data.file && this.data.file.url ? this.data.file.url : undefined,
    });

    buttonEdit.appendChild(this.ICONS.pencil);
    buttonRemove.appendChild(this.ICONS.trash);
    previewFooter.appendChild(buttonEdit);
    previewFooter.appendChild(buttonRemove);

    preview.appendChild(previewImg);
    preview.appendChild(previewFooter);

    if (this.data.file && this.data.file.url.length > 0) {
      this._visible(preview);
    }

    this.nodes.previewButtonEdit = buttonEdit;
    this.nodes.previewButtonRemove = buttonRemove;
    this.nodes.image = previewImg;
    this.nodes.preview = preview;
  }

  makeTextareaText() {
    const textareaText = make('div', [this.CSS.text, this.CSS.textarea, this.CSS.block], {
      ...this.config.text,
      contentEditable: true,
      innerHTML: this.data.text ? this.data.text : '',
    });

    textareaText.dataset.placeholder = this.config.text.placeholder;

    this.nodes.textareaText = textareaText;
  }

  makeTextareaCaption() {
    const textareaCaption = make('div', [this.CSS.caption, this.CSS.textarea, this.CSS.block], {
      ...this.config.caption,
      contentEditable: true,
      innerHTML: this.data.caption ? this.data.caption : '',
    });

    textareaCaption.dataset.placeholder = this.config.caption.placeholder;

    this.nodes.textareaCaption = textareaCaption;
  }

  makeContainerLeft() {
    const containerLeft = make('div', this.CSS.container);

    containerLeft.appendChild(this.nodes.preview);
    containerLeft.appendChild(this.nodes.imageHolder);

    this.nodes.containerLeft = containerLeft;
  }

  makeContainerRight() {
    const containerRight = make('div', this.CSS.container);

    containerRight.appendChild(this.nodes.textareaText);
    containerRight.appendChild(this.nodes.textareaCaption);

    this.nodes.containerRight = containerRight;
  }

  makeRoot() {
    const rootClasses =
      this.data.position === 'left' ? [this.CSS.root, this.CSS.switched] : [this.CSS.root];
    const root = make('div', rootClasses);

    root.appendChild(this.nodes.containerLeft);
    root.appendChild(this.nodes.containerRight);

    this.nodes.root = root;
  }

  makePlugin() {
    this.makeLoader();
    this.makeTextareaText();
    this.makeTextareaCaption();
    this.makeImageHolder();
    this.makeImagePreview();

    this.makeContainerLeft();
    this.makeContainerRight();
    this.makeRoot();
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
  }

  /**
   * @returns {object} - Link Tool styles
   */
  get CSS() {
    return {
      /**
       * Tool's classes
       */
      root: 'awi',
      container: 'awi__container',
      block: 'awi__block',
      textarea: 'awi__textarea',
      imageHolder: 'awi__image-holder',
      imageHolderIcon: 'awi__image-holder__icon',
      imageHolderText: 'awi__image-holder__text',
      imageHolderInput: 'awi__image-holder__input',
      text: 'awi__text',
      caption: 'awi__caption',
      preview: 'awi__preview',
      previewFooter: 'awi__preview-fotter',
      previewButton: 'awi__preview-btn',
      previewImg: 'awi__preview-img',
      hidden: 'awi-hidden',
      switched: 'awi--switched',
      loader: 'awi__loader',
    };
  }

  /**
   * @returns {object} - Link Tool icons
   */
  get ICONS() {
    return {
      /**
       * Tool's icons
       */
      image: iconImage(),
      pencil: iconPencil(),
      trash: iconTrash(),
      refresh: iconRefresh(),
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

        if (!this.nodes.root.classList.contains(this.CSS.switched)) {
          this.data.position = 'right';
        } else {
          this.data.position = 'left';
        }
      }
    });
  }

  /**
   * Helper for hidden element
   *
   * @param {HTMLElement} node
   * @private
   */
  _hidden(node) {
    node.classList.add(this.CSS.hidden);
  }

  /**
   * Helper for visible element
   *
   * @param {HTMLElement} node
   * @private
   */
  _visible(node) {
    node.classList.remove(this.CSS.hidden);
  }
}

export default ArticleWithImage;
