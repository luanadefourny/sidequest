import type { NodePlopAPI } from 'plop';

export default function (plop: NodePlopAPI) {
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
        path: 'src/components/{{pascalCase name}}/{{pascalCase name}}.tsx',
        templateFile: 'plop-templates/component.tsx.hbs',
      },
      {
        type: 'add',
        path: 'src/components/{{pascalCase name}}/{{pascalCase name}}.css',
        templateFile: 'plop-templates/component.css.hbs',
      },
    ],
  });

  plop.setGenerator('service', {
    description: 'Generate a service TS module',
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
        path: 'src/services/{{camelCase name}}.ts',
        templateFile: 'plop-templates/service.ts.hbs',
      },
    ],
  });
}
