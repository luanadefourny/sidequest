export default function (plop) {
  plop.setGenerator('component', {
    description: 'Generate a React component with CSS',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Component name:',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/components/{{pascalCase name}}/{{pascalCase name}}.jsx',
        templateFile: 'plop-templates/component.jsx.hbs',
      },
      {
        type: 'add',
        path: 'src/components/{{pascalCase name}}/{{pascalCase name}}.css',
        templateFile: 'plop-templates/component.css.hbs',
      },
    ],
  });

  plop.setGenerator('service', {
    description: 'Generate a service JS module',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Service name:',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/services/{{camelCase name}}.js',
        templateFile: 'plop-templates/service.js.hbs',
      },
    ],
  });
};