# TodoList

Interactive to-do list app using the principles of Atomic Design

To satisfy Atomic Design Principles I have split out code into 4 main sections: 
* Animations
* Models
* Services
* UI

All of these sections detail out portions of the app into digestible chunks. I could separate the to-do page into separate task components, but that felt like overkill for a simple application like this. I think the organization of this page comes from the simplicity and lack of extended architecture. By defining it into 4 main sections, it is easy to debug and easy for new devs to be onboarded to contribute!


This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.1.2.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
