import AdminJS from 'adminjs';
import { Database, Resource } from '@adminjs/prisma';
import { prisma } from '../lib/prisma'; // Assuming your prisma instance is here
import Dashboard from './dashboard';

// Register the Prisma adapter for AdminJS
AdminJS.registerAdapter({ Database, Resource });

// Define Navigation Groups
const catalogGroup = {
  name: 'Catalog',
  icon: 'Box',
};

const ordersGroup = {
  name: 'Orders',
  icon: 'ShoppingCart',
};

const customersGroup = {
  name: 'Customers',
  icon: 'Users',
};

const contentGroup = {
  name: 'Content',
  icon: 'Image',
};

export const adminOptions = {
  resources: [
    // -------------------------
    // CATALOG GROUP
    // -------------------------
    {
      resource: { model: prisma.product, client: prisma },
      options: {
        navigation: catalogGroup,
        properties: {
          images: { type: 'mixed', isArray: true }, // Customize as needed
          categoryId: {
            reference: 'Category',
          },
          volumeId: {
            reference: 'Volume',
          },
        },
        actions: {
          new: {
            // In a fully customized AdminJS setup, you would create a custom component 
            // for the form to handle the dynamic Volume filtering based on Category.
            // Since this is standard options, we set up references so the dropdowns appear.
          },
          edit: {
            // Same as above
          }
        }
      },
    },
    {
      resource: { model: prisma.category, client: prisma },
      options: {
        navigation: catalogGroup,
      },
    },
    {
      resource: { model: prisma.volume, client: prisma },
      options: {
        navigation: catalogGroup,
        properties: {
          slug: {
            // Usually we'd want this auto-generated on backend using a hook 
            // before('new') and before('edit')
          }
        }
      },
      // Automatically generate slug from name
      features: [
        (options) => ({
          ...options,
          actions: {
            ...options.actions,
            new: {
              ...options.actions?.new,
              before: async (request) => {
                if (request.payload?.name && !request.payload?.slug) {
                  request.payload.slug = request.payload.name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)+/g, '');
                }
                return request;
              },
            },
            edit: {
              ...options.actions?.edit,
              before: async (request) => {
                if (request.payload?.name && !request.payload?.slug) {
                  request.payload.slug = request.payload.name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)+/g, '');
                }
                return request;
              },
            },
          },
        }),
      ],
    },
    {
      resource: { model: prisma.productSize, client: prisma },
      options: {
        navigation: catalogGroup,
      },
    },

    // -------------------------
    // ORDERS GROUP
    // -------------------------
    {
      resource: { model: prisma.order, client: prisma },
      options: {
        navigation: ordersGroup,
      },
    },
    {
      resource: { model: prisma.orderItem, client: prisma },
      options: {
        navigation: ordersGroup,
      },
    },
    {
      resource: { model: prisma.customizedOrder, client: prisma },
      options: {
        navigation: ordersGroup,
      },
    },

    // -------------------------
    // CUSTOMERS GROUP
    // -------------------------
    {
      resource: { model: prisma.user, client: prisma },
      options: {
        navigation: customersGroup,
      },
    },

    // -------------------------
    // CONTENT GROUP
    // -------------------------
    {
      resource: { model: prisma.heroBanner, client: prisma },
      options: {
        navigation: contentGroup,
      },
    },
  ],
  dashboard: {
    component: AdminJS.bundle('./dashboard'),
  },
  branding: {
    companyName: 'Khizar Fabric Store Admin',
    logo: '/images/logo.jpg',
    softwareBrothers: false, // Hide "Powered by AdminJS" link
    theme: {
      colors: {
        primary100: '#B8962E', // Our Gold accent
        primary80: '#D4AF5A',
        primary60: '#e5c983',
        primary40: '#f2e5c1',
        primary20: '#fbf7ed',
        accent: '#1A1A1A',
        success: '#2e7d32',
        info: '#0288d1',
        warning: '#ed6c02',
        error: '#d32f2f',
      },
    },
  },
  rootPath: '/admin',
};

// Next.js setup varies depending on App Router vs Pages Router, 
// but this adminOptions object is what you pass to `AdminJS(...)`
