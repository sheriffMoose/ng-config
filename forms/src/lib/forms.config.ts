import { FormlyConfig, ConfigOption } from '@ngx-formly/core';
import { FieldErrorsExtension } from './extensions/field-errors';
import { FieldFormattersExtension } from './extensions/field-formatters';
import { FieldParsersExtension } from './extensions/field-parsers';

export function FormsConfig(formlyConfig: FormlyConfig): ConfigOption {
    return {
        extensions: [
            { name: 'field-errors', extension: new FieldErrorsExtension(formlyConfig) },
            { name: 'field-formatters', extension: new FieldFormattersExtension(formlyConfig) },
            { name: 'field-parsers', extension: new FieldParsersExtension(formlyConfig) },
        ],
    };
}
