import * as Yup from 'yup';

import { validationTexts } from './validationTexts';

const STRING_REGEXP = /^\S*$|^([a-zA-Zа-яА-Я0-9\s,._!?;:"'`-]+)$/gm;
const STRING_MENU_REGEXP =
  /^([a-zA-Zа-яА-Я0-9,._!?;:"'`\S-]+)([a-zA-Zа-яА-Я0-9\s\S,._!?;:"'`-]+)$/gm;
const STRING_NOT_ONLY_WHITESPACE_REGEXP =
  /^([a-zA-Zа-яА-Я0-9,._!?;:"'`-]+)([a-zA-Zа-яА-Я0-9\s,._!?;:"'`-]+)$/gm;
export const STRING_PHONE_REGEXP = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/gm;
export const PHONE_LENGHT_REGEXP =
  /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/gm;
export const STRING_EMAIL_REGEXP = /^[a-zA-Z0-9_!#$%&’*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$/gm;
export const STRING_LINK_REGEXP =
  /^((\/)|((?:http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)))+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm;
export const CODE_REGEXP = /^\s*$|^[a-z0-9]+(?:-[a-z0-9]+)*$/gm;
const EXTENDED_CODE_REGEXP = /^([a-z0-9-//])*$/gm;
const EXCLUDE_SYMBOLS = /^([^\/]([a-z0-9-//])*[a-z0-9]{2})?$/gm;
export const POSITION_REGEXP = /^[1-3]{1}$/gm;
export const STRING_RELATIVE_OR_ABSOLUTE_LINK = /^(\/)|((?:http(s)?:\/\/))/gm;
export const URL_START_WITH_HTTP_REGEXP =
  /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
export const EXCLUDE_FIRST_SLASH_URL_REGEXP = /(^[a-z0-9]+([a-z0-9-//])*[a-z0-9]$)|(^$)/gm;

const VALIDATION_STRING = Yup.string()
  .matches(STRING_REGEXP, validationTexts.STRING)
  .matches(STRING_NOT_ONLY_WHITESPACE_REGEXP, validationTexts.STRING_NOT_ONLY_WHITESPACE_REGEXP)
  .min(3, validationTexts.MIN_LENGTH(3))
  .max(50, validationTexts.MAX_LENGTH(50));

const VALIDATION_MENU_STRING = Yup.string()
  .matches(STRING_MENU_REGEXP, validationTexts.STRING)
  .matches(STRING_MENU_REGEXP, validationTexts.STRING_NOT_ONLY_WHITESPACE_REGEXP)
  .min(3, validationTexts.MIN_LENGTH(3))
  .max(50, validationTexts.MAX_LENGTH(50));

const VALIDATION_CODE = Yup.string()
  .matches(CODE_REGEXP, validationTexts.CODE)
  .min(3, validationTexts.MIN_LENGTH(3))
  .max(50, validationTexts.MAX_LENGTH(50));

const VALIDATION_CODE_EDIT = Yup.string()
  .min(3, validationTexts.MIN_LENGTH(3))
  .max(50, validationTexts.MAX_LENGTH(50));

const VALIDATION_URL = Yup.string()
  .matches(EXCLUDE_SYMBOLS, validationTexts.NOT_SLASH_FIRST)
  .matches(EXTENDED_CODE_REGEXP, validationTexts.URL);

const VALIDATION_URL_WITH_HTTP = Yup.string().matches(
  URL_START_WITH_HTTP_REGEXP,
  validationTexts.URL_WITH_HTTP
);

const VALIDATION_URL_WITHOUT_FIRST_SLASH = Yup.string()
  .matches(EXCLUDE_FIRST_SLASH_URL_REGEXP, validationTexts.NOT_SLASH_FIRST)
  .matches(EXTENDED_CODE_REGEXP, validationTexts.URL);

const NON_EMPTY_STRING = Yup.string().min(1, validationTexts.REQUIRED);

export const VALIDATION_PHONE = Yup.string().matches(
  STRING_PHONE_REGEXP,
  validationTexts.ONLY_NUMBER
);

export const NEW_CONFIGURATION_FORM = Yup.object().shape({
  name: VALIDATION_STRING,
  code: VALIDATION_CODE,
});

export const EDIT_CONFIGURATION_FORM = Yup.object().shape({
  name: VALIDATION_STRING,
  code: VALIDATION_CODE_EDIT,
});

export const NEW_OPTION_CONFIGURATION_FORM = Yup.object().shape({
  name: VALIDATION_STRING,
  code: VALIDATION_CODE,
});

export const NEW_OPTION_MODEL_FORM = Yup.object().shape({
  name: VALIDATION_STRING,
  code: VALIDATION_CODE,
  url: VALIDATION_URL,
});

export const NEW_ITEM_MENU_FORM = Yup.object().shape({
  name: VALIDATION_MENU_STRING,
  url: VALIDATION_URL_WITHOUT_FIRST_SLASH,
});

export const ADD_FOLDER_FORM = Yup.object().shape({
  name: VALIDATION_STRING,
});

export const NEW_MENU_FORM = Yup.object().shape({
  name: VALIDATION_MENU_STRING,
  code: VALIDATION_CODE,
});

export const PHONE_NUMBER = Yup.object().shape({
  value: VALIDATION_PHONE,
});

export const REVIEW_FORM = Yup.object().shape({
  createdDate: NON_EMPTY_STRING,
  editingDate: NON_EMPTY_STRING,
  productId: NON_EMPTY_STRING,
  rating: Yup.number().min(1, validationTexts.REQUIRED),
  status: NON_EMPTY_STRING,
  inactivationReasonId: NON_EMPTY_STRING,
  userName: NON_EMPTY_STRING,
  response: Yup.string().test('response-test', (value, context) => {
    const {
      createError,
      parent: { responseDate },
    } = context;

    if (responseDate) {
      if (!value) {
        return createError({
          message: validationTexts.REQUIRED,
        });
      }
    }

    return true;
  }),
});

export const ADD_DOMAIN = Yup.object().shape({
  domain: VALIDATION_URL_WITH_HTTP,
});
