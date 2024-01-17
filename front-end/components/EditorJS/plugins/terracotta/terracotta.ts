import { API, ToolConfig } from '@editorjs/editorjs';

type terracottaData = {
  url: string;
};

type EditorJSParams = {
  api: API;
  config?: ToolConfig;
  data?: terracottaData;
};

export default class TerracottaPlugin {
  api: API;
  config: ToolConfig;
  data: terracottaData;

  constructor({ api, config, data }: EditorJSParams) {
    this.api = api;
    this.config = config;
    this.data = {
      url: data?.url ? data.url : '',
    };
  }
  static get toolbox() {
    return {
      title: 'Terracotta',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="524.7" height="454.6" viewBox="0 0 524.7 454.6"> <g id="logo-banner" transform="translate(-24 -24)"> <g id="g282" transform="translate(-291.1 -34.4)"> <g id="g90"> <path id="polygon26" d="M315.1,201.7V157.3l29.5-13.6v44.4Z" fill="#eeceb6"/> <path id="polygon28" d="M315.1,246.2V201.7l29.5-13.6v44.5Z" fill="#fdebd9"/> <path id="polygon30" d="M344.6,188.1V143.7l29.5-13.6v44.5Z" fill="#f5e4d6"/> <path id="polygon32" d="M344.6,232.6V188.1l29.5-13.5V219Z" fill="#fbdabb"/> <path id="polygon34" d="M374.1,174.6V130.1l29.4-13.6V161Z" fill="#eeceb6"/> <path id="polygon36" d="M374.1,219V174.6L403.5,161v44.4Z" fill="#fdebd9"/> <path id="polygon38" d="M403.5,161V116.5L433,102.9v44.5Z" fill="#f5e4d6"/> <path id="polygon40" d="M403.5,205.4V161L433,147.4v44.4Z" fill="#fbdabb"/> <path id="polygon42" d="M315.1,290.7V246.2l29.5-13.6v44.5Z" fill="#eeceb6"/> <path id="polygon44" d="M315.1,335.1V290.7l29.5-13.6v44.4Z" fill="#fdebd9"/> <path id="polygon46" d="M344.6,277.1V232.6L374.1,219v44.5Z" fill="#f5e4d6"/> <path id="polygon48" d="M344.6,321.5V277.1l29.5-13.6v44.4Z" fill="#fbdabb"/> <path id="polygon50" d="M374.1,263.5V219l29.4-13.6v44.5Z" fill="#eeceb6"/> <path id="polygon52" d="M374.1,307.9V263.5l29.4-13.6v44.4Z" fill="#fdebd9"/> <path id="polygon54" d="M403.5,249.9V205.4L433,191.8v44.5Z" fill="#63ccee"/> <path id="polygon56" d="M403.5,294.3V249.9L433,236.3v44.4Z" fill="#fbdabb"/> <path id="polygon58" d="M315.1,379.6V335.1l29.5-13.6V366Z" fill="#eeceb6"/> <path id="polygon60" d="M315.1,424V379.6L344.6,366v44.5Z" fill="#fdebd9"/> <path id="polygon62" d="M344.6,366V321.5l29.5-13.6v44.5Z" fill="#f5e4d6"/> <path id="polygon64" d="M344.6,410.5V366l29.5-13.6v44.5Z" fill="#fbdabb"/> <path id="polygon66" d="M374.1,352.4V307.9l29.4-13.6v44.5Z" fill="#eeceb6"/> <path id="polygon68" d="M374.1,396.9V352.4l29.4-13.6v44.5Z" fill="#fdebd9"/> <path id="polygon70" d="M403.5,338.8V294.3L433,280.7v44.5Z" fill="#f5e4d6"/> <path id="polygon72" d="M403.5,383.3V338.8L433,325.2v44.5Z" fill="#fbdabb"/> <path id="polygon74" d="M315.1,468.5V424l29.5-13.5v44.4Z" fill="#eeceb6"/> <path id="polygon76" d="M315.1,513V468.5l29.5-13.6v44.5Z" fill="#fdebd9"/> <path id="polygon78" d="M344.6,454.9V410.5l29.5-13.6v44.4Z" fill="#f5e4d6"/> <path id="polygon80" d="M344.6,499.4V454.9l29.5-13.6v44.5Z" fill="#fbdabb"/> <path id="polygon82" d="M374.1,441.3V396.9l29.4-13.6v44.4Z" fill="#eeceb6"/> <path id="polygon84" d="M374.1,485.8V441.3l29.4-13.6v44.5Z" fill="#fdebd9"/> <path id="polygon86" d="M403.5,427.7V383.3L433,369.7v44.4Z" fill="#f5e4d6"/> <path id="polygon88" d="M403.5,472.2V427.7L433,414.1v44.5Z" fill="#fbdabb"/> </g> <g id="g156"> <path id="polygon92" d="M433,147.4V102.9l29.5,13.6V161Z" fill="#e8ba98"/> <path id="polygon94" d="M433,191.8V147.4L462.5,161v44.4Z" fill="#f4aa69"/> <path id="polygon96" d="M462.5,161V116.5L492,130.1v44.5Z" fill="#db9364"/> <path id="polygon98" d="M462.5,205.4V161L492,174.6V219Z" fill="#f6b982"/> <path id="polygon100" d="M492,174.6V130.1l29.5,13.6v44.4Z" fill="#e8ba98"/> <path id="polygon102" d="M492,219V174.6l29.5,13.5v44.5Z" fill="#f4aa69"/> <path id="polygon104" d="M521.5,188.1V143.7L551,157.3v44.4Z" fill="#db9364"/> <path id="polygon106" d="M521.5,232.6V188.1L551,201.7v44.5Z" fill="#f6b982"/> <path id="polygon108" d="M433,236.3V191.8l29.5,13.6v44.5Z" fill="#00a4da"/> <path id="polygon110" d="M433,280.7V236.3l29.5,13.6v44.4Z" fill="#f4aa69"/> <path id="polygon112" d="M462.5,249.9V205.4L492,219v44.5Z" fill="#008ed0"/> <path id="polygon114" d="M462.5,294.3V249.9L492,263.5v44.4Z" fill="#00b1bb"/> <path id="polygon116" d="M492,263.5V219l29.5,13.6v44.5Z" fill="#00a4da"/> <path id="polygon118" d="M492,307.9V263.5l29.5,13.6v44.4Z" fill="#f4aa69"/> <path id="polygon120" d="M521.5,277.1V232.6L551,246.2v44.5Z" fill="#008ed0"/> <path id="polygon122" d="M521.5,321.5V277.1L551,290.7v44.4Z" fill="#f6b982"/> <path id="polygon124" d="M433,325.2V280.7l29.5,13.6v44.5Z" fill="#e8ba98"/> <path id="polygon126" d="M433,369.7V325.2l29.5,13.6v44.5Z" fill="#f4aa69"/> <path id="polygon128" d="M462.5,338.8V294.3L492,307.9v44.5Z" fill="#008ed0"/> <path id="polygon130" d="M462.5,383.3V338.8L492,352.4v44.5Z" fill="#00b1bb"/> <path id="polygon132" d="M492,352.4V307.9l29.5,13.6V366Z" fill="#e8ba98"/> <path id="polygon134" d="M492,396.9V352.4L521.5,366v44.5Z" fill="#f4aa69"/> <path id="polygon136" d="M521.5,366V321.5L551,335.1v44.5Z" fill="#db9364"/> <path id="polygon138" d="M521.5,410.5V366L551,379.6V424Z" fill="#f6b982"/> <path id="polygon140" d="M433,414.1V369.7l29.5,13.6v44.4Z" fill="#e8ba98"/> <path id="polygon142" d="M433,458.6V414.1l29.5,13.6v44.5Z" fill="#f4aa69"/> <path id="polygon144" d="M462.5,427.7V383.3L492,396.9v44.4Z" fill="#db9364"/> <path id="polygon146" d="M462.5,472.2V427.7L492,441.3v44.5Z" fill="#f6b982"/> <path id="polygon148" d="M492,441.3V396.9l29.5,13.6v44.4Z" fill="#e8ba98"/> <path id="polygon150" d="M492,485.8V441.3l29.5,13.6v44.5Z" fill="#f4aa69"/> <path id="polygon152" d="M521.5,454.9V410.5L551,424v44.5Z" fill="#db9364"/> <path id="polygon154" d="M521.5,499.4V454.9L551,468.5V513Z" fill="#f6b982"/> </g> <g id="g222"> <path id="polygon158" d="M551,201.7V157.3l29.4-13.6v44.4Z" fill="#eeceb6"/> <path id="polygon160" d="M551,246.2V201.7l29.4-13.6v44.5Z" fill="#fdebd9"/> <path id="polygon162" d="M580.4,188.1V143.7l29.5-13.6v44.5Z" fill="#f5e4d6"/> <path id="polygon164" d="M580.4,232.6V188.1l29.5-13.5V219Z" fill="#fbdabb"/> <path id="polygon166" d="M609.9,174.6V130.1l29.5-13.6V161Z" fill="#eeceb6"/> <path id="polygon168" d="M609.9,219V174.6L639.4,161v44.4Z" fill="#fdebd9"/> <path id="polygon170" d="M639.4,161V116.5l29.5-13.6v44.5Z" fill="#f5e4d6"/> <path id="polygon172" d="M639.4,205.4V161l29.5-13.6v44.4Z" fill="#fbdabb"/> <path id="polygon174" d="M551,290.7V246.2l29.4-13.6v44.5Z" fill="#eeceb6"/> <path id="polygon176" d="M551,335.1V290.7l29.4-13.6v44.4Z" fill="#fdebd9"/> <path id="polygon178" d="M580.4,277.1V232.6L609.9,219v44.5Z" fill="#63ccee"/> <path id="polygon180" d="M580.4,321.5V277.1l29.5-13.6v44.4Z" fill="#4fc4ca"/> <path id="polygon182" d="M609.9,263.5V219l29.5-13.6v44.5Z" fill="#2ab8ea"/> <path id="polygon184" d="M609.9,307.9V263.5l29.5-13.6v44.4Z" fill="#fdebd9"/> <path id="polygon186" d="M639.4,249.9V205.4l29.5-13.6v44.5Z" fill="#63ccee"/> <path id="polygon188" d="M639.4,294.3V249.9l29.5-13.6v44.4Z" fill="#fbdabb"/> <path id="polygon190" d="M551,379.6V335.1l29.4-13.6V366Z" fill="#eeceb6"/> <path id="polygon192" d="M551,424V379.6L580.4,366v44.5Z" fill="#fdebd9"/> <path id="polygon194" d="M580.4,366V321.5l29.5-13.6v44.5Z" fill="#2ab8ea"/> <path id="polygon196" d="M580.4,410.5V366l29.5-13.6v44.5Z" fill="#4fc4ca"/> <path id="polygon198" d="M609.9,352.4V307.9l29.5-13.6v44.5Z" fill="#eeceb6"/> <path id="polygon200" d="M609.9,396.9V352.4l29.5-13.6v44.5Z" fill="#47b7b6"/> <path id="polygon202" d="M639.4,338.8V294.3l29.5-13.6v44.5Z" fill="#f5e4d6"/> <path id="polygon204" d="M639.4,383.3V338.8l29.5-13.6v44.5Z" fill="#4fc4ca"/> <path id="polygon206" d="M551,468.5V424l29.4-13.5v44.4Z" fill="#eeceb6"/> <path id="polygon208" d="M551,513V468.5l29.4-13.6v44.5Z" fill="#fdebd9"/> <path id="polygon210" d="M580.4,454.9V410.5l29.5-13.6v44.4Z" fill="#f5e4d6"/> <path id="polygon212" d="M580.4,499.4V454.9l29.5-13.6v44.5Z" fill="#fbdabb"/> <path id="polygon214" d="M609.9,441.3V396.9l29.5-13.6v44.4Z" fill="#eeceb6"/> <path id="polygon216" d="M609.9,485.8V441.3l29.5-13.6v44.5Z" fill="#fdebd9"/> <path id="polygon218" d="M639.4,427.7V383.3l29.5-13.6v44.4Z" fill="#f5e4d6"/> <path id="polygon220" d="M639.4,472.2V427.7l29.5-13.6v44.5Z" fill="#fbdabb"/> </g> <g id="g280"> <path id="polygon224" d="M679.3,118.3V73.9l29.5,13.6v44.4Z" fill="#e8ba98"/> <path id="polygon226" d="M668.9,191.8V147.4L698.4,161v44.4Z" fill="#f4aa69"/> <path id="polygon228" d="M713.1,188.1V143.7l29.5,13.6v44.4Z" fill="#00b1bb"/> <path id="polygon230" d="M746.4,102.9V58.4L775.9,72v44.5Z" fill="#e8ba98"/> <path id="polygon232" d="M767.9,248V203.6l29.5,13.6v44.4Z" fill="#f4aa69"/> <path id="polygon234" d="M805.5,147.4V102.9L835,116.5V161Z" fill="#db9364"/> <path id="polygon236" d="M668.9,236.3V191.8l29.5,13.6v44.5Z" fill="#008ed0"/> <path id="polygon238" d="M668.9,280.7V236.3l29.5,13.6v44.4Z" fill="#f4aa69"/> <path id="polygon240" d="M698.4,249.9V205.4L727.9,219v44.5Z" fill="#db9364"/> <path id="polygon242" d="M698.4,294.3V249.9l29.5,13.6v44.4Z" fill="#f6b982"/> <path id="polygon244" d="M727.9,307.9V263.5l29.5,13.6v44.4Z" fill="#f4aa69"/> <path id="polygon246" d="M810.3,316.2V271.7l29.5,13.6v44.5Z" fill="#db9364"/> <path id="polygon248" d="M668.9,325.2V280.7l29.5,13.6v44.5Z" fill="#e8ba98"/> <path id="polygon250" d="M668.9,369.7V325.2l29.5,13.6v44.5Z" fill="#00b1bb"/> <path id="polygon252" d="M698.4,338.8V294.3l29.5,13.6v44.5Z" fill="#db9364"/> <path id="polygon254" d="M698.4,383.3V338.8l29.5,13.6v44.5Z" fill="#f6b982"/> <path id="polygon256" d="M727.9,352.4V307.9l29.5,13.6V366Z" fill="#e8ba98"/> <path id="polygon258" d="M727.9,396.9V352.4L757.4,366v44.5Z" fill="#f4aa69"/> <path id="polygon260" d="M757.4,366V321.5l29.4,13.6v44.5Z" fill="#db9364"/> <path id="polygon262" d="M757.4,410.5V366l29.4,13.6V424Z" fill="#f6b982"/> <path id="polygon264" d="M668.9,414.1V369.7l29.5,13.6v44.4Z" fill="#e8ba98"/> <path id="polygon266" d="M668.9,458.6V414.1l29.5,13.6v44.5Z" fill="#f4aa69"/> <path id="polygon268" d="M698.4,427.7V383.3l29.5,13.6v44.4Z" fill="#db9364"/> <path id="polygon270" d="M698.4,472.2V427.7l29.5,13.6v44.5Z" fill="#f6b982"/> <path id="polygon272" d="M727.9,441.3V396.9l29.5,13.6v44.4Z" fill="#e8ba98"/> <path id="polygon274" d="M727.9,485.8V441.3l29.5,13.6v44.5Z" fill="#f4aa69"/> <path id="polygon276" d="M757.4,454.9V410.5L786.8,424v44.5Z" fill="#db9364"/> <path id="polygon278" d="M757.4,499.4V454.9l29.4,13.6V513Z" fill="#f6b982"/> </g> </g> </g> </svg> ',
    };
  }

  render() {
    const entirePage = document.createElement('div');
    entirePage.className = 'terracottaPlugin';
    const styles = document.createElement('style');
    styles.innerHTML = `
    .terracottaPlugin {
      padding: 10px;
      box-sizing: border-box;
      border: 1px solid black;
      border-radius: 5px;
      margin-top: 10px;
    }

    .terracottaInput {
      padding: 10px;
      box-sizing: border-box;
      width: 100%;
    }

    .terracottaTitle {
      margin: 0px;
      margin-bottom: 10px;
      padding: 0px;
    }
    `;

    const textInput = document.createElement('input');
    textInput.className = 'terracottaInput';
    textInput.placeholder = 'Your terracotta url';
    textInput.id = 'terracottaInput';
    textInput.value = this.data.url;

    const title = document.createElement('p');
    title.className = 'terracottaTitle';
    title.innerText = 'Terracotta URL';

    entirePage.append(title);
    entirePage.appendChild(textInput);
    entirePage.appendChild(styles);
    return entirePage;
  }

  save(blockContent: any) {
    const terracottaURL = blockContent.querySelector('#terracottaInput').value;
    this.data.url = terracottaURL;
    return this.data;
  }

  validate(savedData: any) {
    if (!savedData.url.trim()) {
      return false;
    }
    return true;
  }
}
