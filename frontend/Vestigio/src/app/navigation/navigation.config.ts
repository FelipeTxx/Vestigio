export interface NavigationItem {
  id: string;
  label: string;
  route: string;
  icon: string;
}

export interface NavigationSection {
  id: string;
  title: string;
  items: NavigationItem[];
  collapsible?: boolean;
}

// O gerador module:generate adiciona novos módulos dentro destes marcadores.
// Para mudar a categoria ou ordem, mova o item para uma seção abaixo.
export const GENERATED_MODULES: NavigationItem[] = [
  // <generated-modules>
  // </generated-modules>
];

export const NAVIGATION_SECTIONS: NavigationSection[] = [
  {
    id: 'workspace',
    title: 'Seu espaço',
    items: [
      { id: 'home', label: 'Visão geral', route: '/home', icon: 'home-outline' },
      { id: 'diario', label: 'Diário', route: '/diario', icon: 'book-outline' }
    ]
  },
  {
    id: 'modules',
    title: 'Novos módulos',
    items: GENERATED_MODULES
  }
];
