// eagerly import theme styles so as we can override them
import '@vaadin/vaadin-lumo-styles/all-imports';

const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `
<custom-style>
  <style>
    html {
    }
    .defect-reports {
        padding: var(--lumo-space-l) 0;
        display: flex;
        justify-content: space-evenly;
        flex-wrap: wrap;
    }
    .defect-card {
        margin: 0;
        flex-basis: 31%;
        overflow: hidden;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.4);
    }
    .defect-card .defect-image {
        width: 100%;
        overflow: hidden;
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
`;

document.head.appendChild($_documentContainer.content);
