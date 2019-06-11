-angular.json

"scripts": [
    "node_modules/systemjs/dist/system.js"
]

-package.json

"dependencies": {
"systemjs": "^0.21.5",
}


-app.component.ts

navigate() {
    const mod = {
      name: 'moduleName',
      path: 'modulePath',
      url: 'http://path/to/bundle.umd.js'
    };

    this.loaderService.loadModule(mod).then((exports) => {
      this.loaderService.createRoute(mod, exports);
      this.router.navigate([mod.path]);
    });

}