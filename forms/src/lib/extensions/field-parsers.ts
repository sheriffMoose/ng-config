import { FormlyExtension, FormlyConfig } from '@ngx-formly/core';
import { FormlyFieldConfigCache } from '@ngx-formly/core/lib/components/formly.field.config';

export class FieldParsersExtension implements FormlyExtension {

    constructor(private formlyConfig: FormlyConfig) { }

    prePopulate(field: FormlyFieldConfigCache) {
    }

    onPopulate(field: FormlyFieldConfigCache) {
    }

    postPopulate(field: FormlyFieldConfigCache) {
    }
}
