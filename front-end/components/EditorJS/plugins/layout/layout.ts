import {
  API,
  BaseTool,
  BlockTool,
  ToolConfig,
  ToolSettings,
} from '@editorjs/editorjs';

type SimpleImageData = {
  imageURL?: string;
  textInput?: string;
  textAlign?: 'left' | 'center' | 'right';
  uploadedFile?: File;
};

type SimpleImageConstructorParams = {
  api: API;
  config?: ToolConfig;
  data?: SimpleImageData;
};

export default class Layout implements BlockTool {
  settings: { name: 'left' | 'right' | 'center'; icon: string }[] = [];
  data?: SimpleImageData = {};
  api: API;

  suffix: string;
  // { api: API; config?: any; }
  constructor({ api, config, data }: SimpleImageConstructorParams) {
    this.suffix = (Math.random() + 1).toString(36).substring(7);
    this.api = api;
    this.data = {
      imageURL:
        data?.imageURL ||
        'https://via.placeholder.com/250?text=Click to upload image',
      textAlign: data?.textAlign || 'left',
      textInput: data?.textInput || 'This is default text',
      uploadedFile: data?.uploadedFile || undefined,
    };
    this.settings = [
      {
        name: 'left',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" id="Layer" enable-background="new 0 0 64 64" height="20" viewBox="0 0 64 64" width="20"><path d="m54 8h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"></path><path d="m54 52h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"></path><path d="m10 23h28c1.104 0 2-.896 2-2s-.896-2-2-2h-28c-1.104 0-2 .896-2 2s.896 2 2 2z"></path><path d="m54 30h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"></path><path d="m10 45h28c1.104 0 2-.896 2-2s-.896-2-2-2h-28c-1.104 0-2 .896-2 2s.896 2 2 2z"></path></svg>',
      },
      {
        name: 'center',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" id="Layer" enable-background="new 0 0 64 64" height="20" viewBox="0 0 64 64" width="20"><path d="m54 8h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"></path><path d="m54 52h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"></path><path d="m46 23c1.104 0 2-.896 2-2s-.896-2-2-2h-28c-1.104 0-2 .896-2 2s.896 2 2 2z"></path><path d="m54 30h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"></path><path d="m46 45c1.104 0 2-.896 2-2s-.896-2-2-2h-28c-1.104 0-2 .896-2 2s.896 2 2 2z"></path></svg>',
      },
      {
        name: 'right',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" id="Layer" enable-background="new 0 0 64 64" height="20" viewBox="0 0 64 64" width="20"><path d="m54 8h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"></path><path d="m54 52h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"></path><path d="m54 19h-28c-1.104 0-2 .896-2 2s.896 2 2 2h28c1.104 0 2-.896 2-2s-.896-2-2-2z"></path><path d="m54 30h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"></path><path d="m54 41h-28c-1.104 0-2 .896-2 2s.896 2 2 2h28c1.104 0 2-.896 2-2s-.896-2-2-2z"></path></svg>',
      },
    ];
  }

  static get toolbox() {
    return {
      title: 'Layout',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 218.208 218.208" style="enable-background:new 0 0 218.208 218.208;" xml:space="preserve"> <g> <g> <g> <path d="M214.31,27.277H3.897C1.743,27.277,0,29.019,0,31.173v27.276v128.586c0,2.154,1.743,3.897,3.897,3.897h27.276h97.414 h27.276h58.448c2.154,0,3.897-1.743,3.897-3.897V58.449V31.173C218.207,29.019,216.464,27.277,214.31,27.277z M27.276,183.139 H7.793V62.345h19.483V183.139z M124.69,183.139H35.069V62.345h89.621V183.139z M151.966,183.139h-19.483V62.345h19.483V183.139z M210.414,183.139h-50.655V62.345h50.655V183.139z M210.414,54.553h-54.552h-27.276H31.172H7.793V35.069h202.621V54.553z"/> <path d="M46.759,116.897H113c2.154,0,3.897-1.743,3.897-3.897V74.035c0-2.153-1.743-3.896-3.897-3.896H46.759 c-2.154,0-3.897,1.743-3.897,3.897v38.965C42.862,115.154,44.605,116.897,46.759,116.897z M50.655,77.931h58.448v31.172H50.655 V77.931z"/> <path d="M46.759,179.243H113c2.154,0,3.897-1.743,3.897-3.897v-38.966c0-2.154-1.743-3.897-3.897-3.897H46.759 c-2.154,0-3.897,1.743-3.897,3.897v38.966C42.862,177.501,44.605,179.243,46.759,179.243z M50.655,140.277h58.448v31.172H50.655 V140.277z"/> <rect x="46.759" y="120.793" width="66.241" height="7.793"/> </g> </g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </svg>',
    };
  }

  renderSettings() {
    const wrapper = document.createElement('div');

    this.settings.forEach((tune) => {
      let button = document.createElement('div');

      button.classList.add('cdx-settings-button');
      button.innerHTML = tune.icon;

      button.addEventListener('click', () => {
        this._alignText(tune.name);
      });
      wrapper.appendChild(button);
    });

    return wrapper;
  }

  render() {
    const entirePage = document.createElement('div');
    entirePage.className = 'layoutPlugin';
    const styles = document.createElement('style');
    styles.innerHTML = `
    .layoutPlugin {
      width: 100%;
      display: flex;
      justify-content: space-between;
      gap: 10px;
      box-sizing: border-box;
      align-items: center;
      margin-top: 10px;
    }

    .align-left {
      text-align: left !important;
    }

    .align-right {
      text-align: right !important;
    }

    .align-center {
      text-align: center !important;
    }

    .layoutText {
      width: 50%;
      margin: 0px;
      padding: 0px;
      box-sizing: border-box;
      border: none;
      background-color: transparent;
      line-height: 1.6em;
      color: #0B4566;
      font-size: 1rem;
      font-family: "Roboto","Helvetica","Arial",sans-serif;
      letter-spacing: 0.00938em;
      height: 100%
    }

    .imageContainer {
      width: 50%;
      height: 100%;
      margin: 0px;
      padding: 0px;
      box-sizing: border-box;
      cursor:pointer;
    }

    .actualImage {
      width: 100%;
      height: 100%;
      margin:0px;
      padding: 0px;
      box-sizing: border-box;
      object-fit: cover;
      cursor:pointer;
    }


    `;

    const textInput = document.createElement('div');
    textInput.className = 'layoutText';
    textInput.innerHTML = this.data?.textInput!;
    textInput.contentEditable = 'true';
    textInput.id = `layoutTextarea-${this.suffix}`;
    textInput.setAttribute('style', `text-align: ${this.data?.textAlign!}`);
    textInput.addEventListener('paste', (e) => {
      e.preventDefault();
      const text = e.clipboardData?.getData('text/plain');

      if (text) {
        this.insertTextAtCaret(text);
      }
    });

    const imageContainer = document.createElement('div');
    imageContainer.className = 'imageContainer';
    imageContainer.id = `imageContainer-${this.suffix}`;

    const imageLabel = document.createElement('label');
    imageLabel.htmlFor = `fileInput-${this.suffix}`;
    imageLabel.className = 'imageLabel';

    const actualImage = document.createElement('img');
    actualImage.className = 'actualImage';
    actualImage.id = `actualImage-${this.suffix}`;
    actualImage.src = this.data?.imageURL!;

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.id = `fileInput-${this.suffix}`;
    fileInput.hidden = true;
    fileInput.addEventListener('change', (e) => {
      if (fileInput && actualImage) {
        const img: any = document.getElementById(`actualImage-${this.suffix}`);
        const files = fileInput.files;
        if (img && files && files.length > 0 && files[0]) {
          this.data!.uploadedFile = files[0];
          img.src = URL.createObjectURL(files[0]);
        }
      }
    });

    imageLabel.appendChild(actualImage);
    imageContainer.appendChild(fileInput);
    imageContainer.appendChild(imageLabel);

    entirePage.append(textInput);
    entirePage.append(imageContainer);
    entirePage.appendChild(styles);
    return entirePage;
  }

  save(blockContent: any) {
    const textArea = blockContent.querySelector(
      `#layoutTextarea-${this.suffix}`
    );
    let defaultText = this.data?.textInput;
    if (textArea) {
      defaultText = textArea.innerHTML;
    }
    return { ...this.data, textInput: defaultText };
  }

  _alignText(alignment: 'left' | 'right' | 'center') {
    this.data!.textAlign = alignment;

    document
      .getElementById(`layoutTextarea-${this.suffix}`)
      ?.classList.remove('align-left', 'align-center', 'align-right'); // Reset
    document
      .getElementById(`layoutTextarea-${this.suffix}`)
      ?.classList.toggle(`align-${alignment}`);
  }

  insertTextAtCaret(text: string) {
    var sel, range;
    if (window.getSelection) {
      sel = window.getSelection();

      if (sel) {
        if (sel.getRangeAt && sel.rangeCount) {
          range = sel.getRangeAt(0);
          range.deleteContents();
          range.insertNode(document.createTextNode(text));
        }
      }
    }
  }
}
