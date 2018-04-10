import * as LANG from '../messages/index';
import { IntlAction } from '../actions/types';
import { LOCALE_SELECTED } from '../actions/intlActions';
import { IntlStore } from '../../store';

const initialState: IntlStore = {
  locale: LANG.EN.lang,
  messages: LANG.EN.messages
};
export const IntlReducer = (state = initialState, action: IntlAction) => {
  switch (action.type) {
    case LOCALE_SELECTED:
    switch (action.locale) {
      case 'cn':
        return { ...initialState, locale: LANG.CN.lang, messages: LANG.CN.messages };
      case 'en':
        return { ...initialState, locale: LANG.EN.lang, messages: LANG.EN.messages };
      case 'es':
        return { ...initialState, locale: LANG.ES.lang, messages: LANG.ES.messages };
      case 'fr':
        return { ...initialState, locale: LANG.FR.lang, messages: LANG.FR.messages };
      case 'ge':
        return { ...initialState, locale: LANG.GE.lang, messages: LANG.GE.messages };
      case 'in':
        return { ...initialState, locale: LANG.IN.lang, messages: LANG.IN.messages };
      case 'it':
        return { ...initialState, locale: LANG.IT.lang, messages: LANG.IT.messages };
      case 'jp':
        return { ...initialState, locale: LANG.JP.lang, messages: LANG.JP.messages };
      case 'kl':
        return { ...initialState, locale: LANG.KL.lang, messages: LANG.KL.messages };
      case 'kr':
        return { ...initialState, locale: LANG.KR.lang, messages: LANG.KR.messages };
      case 'pt':
        return { ...initialState, locale: LANG.PT.lang, messages: LANG.PT.messages };
      case 'ru':
        return { ...initialState, locale: LANG.RU.lang, messages: LANG.RU.messages };
      default:
        return { ...initialState, locale: LANG.EN.lang, messages: LANG.EN.messages };
    }
    default:
      return state;
  }
};
