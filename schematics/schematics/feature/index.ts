import {
    Rule, Tree, SchematicsException,
    apply, url, applyTemplates, move,
    chain, mergeWith
} from '@angular-devkit/schematics';

import { strings, normalize, experimental } from '@angular-devkit/core';

import { Schema as FeatureModuleSchema } from './schema';
import { addModuleImportToModule, isImported, getSourceFile } from 'schematics-utilities';

export function featureModule(options: FeatureModuleSchema): Rule {
    return (tree: Tree) => {
        const workspaceConfig = tree.read('/angular.json');
        if (!workspaceConfig) {
            throw new SchematicsException('Could not find Angular workspace configuration');
        }

        const workspaceContent = workspaceConfig.toString();
        const workspace: experimental.workspace.WorkspaceSchema = JSON.parse(workspaceContent);
        const project = workspace.projects[workspace.defaultProject as string];

        options.rootPath = `${project.sourceRoot}/app/features`;
        options.path = `${strings.dasherize(options.name)}`;

        const templateSource = apply(url('./files/feature'), [
            applyTemplates({
                classify: strings.classify,
                dasherize: strings.dasherize,
                name: options.name
            }),
            move(normalize(`${options.rootPath}/${options.path}` as string))
        ]);

        addFeatureModule(tree, options);

        return chain([
            mergeWith(templateSource),
        ]);
    };
}

function addFeatureModule(tree: Tree, options: FeatureModuleSchema) {
    const imported = isImported(getSourceFile(tree, `${options.rootPath}/features.module.ts`), `${strings.classify(options.name)}Module`, `./${options.path}/${strings.dasherize(options.name)}.module`);
    if (!imported) {
        addModuleImportToModule(tree, `${options.rootPath}/features.module.ts`, `${strings.classify(options.name)}Module`, `./${options.path}/${strings.dasherize(options.name)}.module`);
    }
}