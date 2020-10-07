import '@vaadin/vaadin-button';
import '@vaadin/vaadin-text-field/vaadin-text-area';
import '@vaadin/vaadin-upload';
import '@vaadin/vaadin-upload/src/vaadin-upload-file';
import {css, customElement, html, LitElement, query} from 'lit-element';
import { CSSModule } from '@vaadin/flow-frontend/css-utils';

import '../../../src/main/resources/META-INF/resources/db';

import * as ReportDefectEndpoint from '../../generated/ReportDefectEndpoint';

@customElement('defect-report-view')
export class DefectReportView extends LitElement {

    @query('#description')
    descriptionField: any;

    @query('#upload')
    uploadField: any;

    defectId?: number;

    static get styles() {
        return [
            CSSModule('upload-file'),
            css`
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
              div .file {
                padding: var(--lumo-space-s) var(--lumo-space-xs) 0;
              }
              vaadin-upload-file [part="status"] {
                display: none;
              }
            `];
    }

    render() {
        return html`
            <vaadin-text-area id="description" label="Defect description" required></vaadin-text-area>
            <vaadin-upload theme="no-auto" id="upload" capture="camera" accept="image/*" max-files="1" target="/file" no-auto>
                <div slot="file-list">
                    ${this.uploadField?.files.map((file: any) => html`
                        <vaadin-upload-file class="no-auto" .file=${file}></vaadin-upload-file>
                    `)}
                </div>
            </vaadin-upload>
            <vaadin-button theme="primary" @click="${this._reportDefect}">Report defect</vaadin-button>
    `;
    }

    _reportDefect() {
        if (this.descriptionField.validate()) {
            this._storeFile().then(fileId => {
                ReportDefectEndpoint.postDefect(this.descriptionField.value, fileId)
                    .then(_ => {
                        this.defectId = undefined;
                        this.uploadField.files = [];
                        this.descriptionField.value = '';
                        window.showNotification('Defect has been posted', 'success');
                    })
                    .catch(e => {
                        window.showNotification('You will be notified when your defect has been posted');
                        console.warn(e);
                    });
            });
        }
    }

    _storeFile(): Promise<any> {
        if (this.uploadField.files.length == 0) {
            return Promise.resolve(null);
        }
        const file = this.uploadField.files[0];
        return window.FileActions().add({file});
    }

    protected firstUpdated() {
        this.uploadField.addEventListener('upload-progress', this._updateFiles.bind(this));
        this.uploadField.addEventListener('upload-success', this._updateFiles.bind(this));
        this.uploadField.addEventListener('files-changed', (_: any) => this.requestUpdate());
    }

    _updateFiles() {
        this.shadowRoot?.querySelectorAll('vaadin-upload-file').forEach((el: any) => {
            for(let p in el.file) {
                if (el.file.hasOwnProperty(p)) {
                    el.notifyPath(`file.${p}`);
                }
            }
        });
    }
}
