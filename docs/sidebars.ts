import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'intro',
        'installation',
        'configuration',
      ],
    },
    {
      type: 'category',
      label: 'User Guide',
      items: [
        'guide/dashboard',
        'guide/customers',
        'guide/products',
        'guide/quotes',
        'guide/invoices',
        'guide/prescriptions',
        'guide/reports',
      ],
    },
    {
      type: 'category',
      label: 'Development',
      items: [
        'dev/architecture',
        'dev/api-reference',
        'dev/database-schema',
        'dev/authentication',
        'dev/internationalization',
        'dev/testing',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'api/authentication',
        'api/customers',
        'api/products',
        'api/quotes',
        'api/invoices',
        'api/prescriptions',
        'api/reports',
      ],
    },
    {
      type: 'category',
      label: 'Deployment',
      items: [
        'deploy/overview',
        'deploy/backend',
        'deploy/frontend',
        'deploy/database',
        'deploy/email',
      ],
    },
  ],
};

export default sidebars;
