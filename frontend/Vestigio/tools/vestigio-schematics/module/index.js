const { externalSchematic, chain, SchematicsException } = require('@angular-devkit/schematics');
const { basename } = require('node:path');
const { dasherize } = require('@angular-devkit/core').strings;

function workspaceSourceRoot(tree, projectName) {
  const configPath = 'angular.json';
  if (!tree.exists(configPath)) {
    throw new SchematicsException('Não encontrei o angular.json do projeto.');
  }

  const config = JSON.parse(tree.read(configPath).toString('utf8'));
  const project = config.projects[projectName || Object.keys(config.projects)[0]];
  if (!project) {
    throw new SchematicsException(`Projeto Angular "${projectName}" não encontrado.`);
  }

  return project.sourceRoot || 'src';
}

function registerModule(name, route, sourceRoot) {
  return tree => {
    const navigationFile = `${sourceRoot}/app/navigation/navigation.config.ts`;
    const routingFile = `${sourceRoot}/app/app-routing.module.ts`;
    if (!tree.exists(navigationFile) || !tree.exists(routingFile)) {
      throw new SchematicsException('Não encontrei a configuração do menu ou das rotas do app.');
    }

    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
    const navMarker = '  // </generated-modules>';
    let navigation = tree.read(navigationFile).toString('utf8');
    if (!navigation.includes(navMarker)) {
      throw new SchematicsException('Marcador generated-modules ausente em navigation.config.ts.');
    }

    if (!navigation.includes(`id: '${id}'`)) {
      const label = basename(name)
        .replace(/[-_]+/g, ' ')
        .replace(/\b\w/g, letter => letter.toUpperCase())
        .replace(/'/g, "\\'");
      const item = `  { id: '${id}', label: '${label}', route: '/${route}', icon: 'cube-outline' },\n`;
      navigation = navigation.replace(navMarker, `${item}${navMarker}`);
      tree.overwrite(navigationFile, navigation);
    }

    let routing = tree.read(routingFile).toString('utf8');
    const routePattern = new RegExp(`(path:\\s*['"]${route}['"],)`);
    if (!routePattern.test(routing)) {
      throw new SchematicsException('Não consegui localizar a rota lazy criada pelo Angular.');
    }

    routing = routing.replace(routePattern, '$1 canActivate: [AuthGuard],');
    if (!routing.includes('import { AuthGuard }')) {
      routing = routing.replace(
        /import .*?;\r?\n/,
        match => `${match}import { AuthGuard } from './guards/auth.guard';\n`
      );
    }
    tree.overwrite(routingFile, routing);
    return tree;
  };
}

function moduleSchematic(options) {
  return (tree, context) => {
    const sourceRoot = workspaceSourceRoot(tree, options.project);
    const name = options.name.replace(/^\/+|\/+$/g, '');
    const route = dasherize(basename(name));
    const routingModule = 'app-routing.module.ts';

    const rules = chain([
      externalSchematic('@schematics/angular', 'module', {
        ...options,
        name,
        routing: false,
        route,
        module: routingModule
      }),
      registerModule(name, route, sourceRoot)
    ]);

    return rules(tree, context);
  };
}

module.exports = { module: moduleSchematic };
