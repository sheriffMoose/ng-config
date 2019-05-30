import {
    Rule, Tree, SchematicsException,
    apply, url, applyTemplates, move,
    chain, mergeWith
} from '@angular-devkit/schematics';

import { strings, normalize, experimental } from '@angular-devkit/core';

import { Schema as FeatureModuleSchema } from './schema';

export function featureModule(options: FeatureModuleSchema): Rule {
    return (tree: Tree) => {
        const workspaceConfig = tree.read('/angular.json');
        if (!workspaceConfig) {
            throw new SchematicsException('Could not find Angular workspace configuration');
        }

        const workspaceContent = workspaceConfig.toString();
        const workspace: experimental.workspace.WorkspaceSchema = JSON.parse(workspaceContent);
        const project = workspace.projects[workspace.defaultProject as string];
        options.path = `${project.sourceRoot}/app/features/${options.name}`;

        const templateSource = apply(url('./files'), [
            applyTemplates({
                classify: strings.classify,
                dasherize: strings.dasherize,
                name: options.name
            }),
            move(normalize(options.path as string))
        ]);

        return chain([
            mergeWith(templateSource)
        ]);
    };
}