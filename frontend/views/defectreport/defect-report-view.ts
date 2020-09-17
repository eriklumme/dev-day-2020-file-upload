import '@vaadin/vaadin-button';
import '@vaadin/vaadin-text-field/vaadin-text-area';
import '@vaadin/vaadin-upload';
import {css, customElement, html, LitElement, query} from 'lit-element';

import * as ReportDefectEndpoint from '../../generated/ReportDefectEndpoint';

@customElement('defect-report-view')
export class DefectReportView extends LitElement {

    @query('#description')
    descriptionField: any;

    @query('#upload')
    uploadField: any;

    uuid?: string;

    static get styles() {
        return css`
      :host {
        display: block;
        padding: 1em;
      }
      :host > * {
        box-sizing: border-box;
        width: 100%;
        max-width: 400px;
      }
      :host > :not(:last-child) {
        margin-bottom: var(--lumo-space-m);
      }
    `;
    }

    render() {
        return html`
            <vaadin-text-area label="Defect description" id="description"></vaadin-text-area>
            <vaadin-upload id="upload" capture="camera" accept="image/*" max-files="1" target="/file" no-auto></vaadin-upload>
            <vaadin-button theme="primary" @click="${this._reportDefect}">Report defect</vaadin-button>
    `;
    }

    protected firstUpdated() {
        this.uploadField.addEventListener('upload-request', (e: any) => {
            e.detail.formData.append('uuid', this.uuid);
        });
        this.uploadField.addEventListener('upload-response', (_: any) => {
            this.uuid = undefined;
        });
    }

    _reportDefect() {
        ReportDefectEndpoint.postDefect(this.descriptionField.value)
            .then(uuid => {
                this.uuid = uuid;
                this.uploadField.uploadFiles();
            })
            .catch(e => console.error("Error: " + e));
    }
}
