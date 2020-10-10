// eagerly import theme styles so as we can override them
import '@vaadin/vaadin-lumo-styles/all-imports';

const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `
<custom-style>
  <style>
    html {
    }
    .defect-reports {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
        grid-gap: var(--lumo-space-l);
        padding: var(--lumo-space-l);
        background-color: var(--lumo-contrast-10pct);
    }
    .defect-card {
        display: flex;
        flex-flow: column;
        justify-content: flex-end;
        padding: var(--lumo-space-m);
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.4);
        background-color: var(--lumo-base-color);
    }
    .defect-card, .defect-image, .defect-text {
        box-sizing: border-box;
    }
    .defect-image {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        min-height: 80px;
    }
    .defect-image img {
        width: auto;
        max-width: 100%;
        max-height: 100%;
    }
    .defect-text {
        padding-top: var(--lumo-space-m);
    }
  </style>
</custom-style>


<custom-style>
  <style>
    html {
      overflow:hidden;
    }
  </style>
</custom-style>

<dom-module id="app-layout" theme-for="vaadin-app-layout">
  <template>
    <style>
      :host(:not([dir='rtl']):not([overlay])) [part='drawer'] {
        border-right: none;
        box-shadow: var(--lumo-box-shadow-s);
        background-color: var(--lumo-base-color);
        z-index: 1;
      }
      :host([dir='rtl']:not([overlay])) [part='drawer'] {
        border-left: none;
        box-shadow: var(--lumo-box-shadow-s);
        background-color: var(--lumo-base-color);
        z-index: 1;
      }
      :host [part='drawer'] {
        width: 17em;
      }
      [part='navbar'] {
        box-shadow: var(--lumo-box-shadow-s);
      }
    </style>
  </template>
</dom-module>
<dom-module id="upload-file" theme-for="vaadin-upload-file">
    <template>
        <style>
            :host(.no-auto) [part="progress"], :host(.no-auto) [part="start-button"] {
                display: none;
            }
        </style>
    </template>
</dom-module>
`;

document.head.appendChild($_documentContainer.content);
