import { Injectable, Compiler } from '@angular/core';
import { Router, Route } from '@angular/router';


import * as AngularCore from '@angular/core';
import * as AngularCommon from '@angular/common';
import * as AngularRouter from '@angular/router';
import * as BrowserAnimations from '@angular/platform-browser/animations';

declare var SystemJS: any;

@Injectable()
export class LoaderService {

    constructor(private router: Router, private compiler: Compiler) {
    }

    createRoute(mod, exports: any) {
        const route: Route = {
            path: mod.path,
            loadChildren: () => exports[`${mod.name}`]
        };

        if (this.router.config.filter(r => r.path === route.path).length > 0) {
            return;
        }
        this.router.config.push(route);
        this.router.resetConfig(this.router.config);
    }

    loadModule(mod): Promise<any> {
        SystemJS.set('@angular/core', SystemJS.newModule(AngularCore));
        SystemJS.set('@angular/common', SystemJS.newModule(AngularCommon));
        SystemJS.set('@angular/router', SystemJS.newModule(AngularRouter));
        SystemJS.set('@angular/platform-browser/animations', SystemJS.newModule(BrowserAnimations));

        return SystemJS.import(`${mod.url}`).then((mod_) => {
            return this.compiler.compileModuleAndAllComponentsAsync(mod_[`${mod.name}`]).then(compiled => {
                return mod_;
            });
        });
    }
}