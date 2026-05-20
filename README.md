## Multi-tenant Next.js

This example project lets you have multiple discrete Next.js sites while sharing modules, components and NPM dependencies. 

Directory structure:

```bash
├── shared  # Shared across all sites
│   ├── utils # Utilities and modules
│   ├── components # React components
    ...
├── sites   # Site folder
│   ├── site-1  # Discrete site
│   │   ├── components  # Site-specific components
│   │   ├── pages       # Site-specific pages
│   │   ├── public      # Site-specific public folder
│   │   └── styles      # Site-specific files
│   └── site-2
│       ├── components
│       ├── pages
│       ├── public
│       └── styles
        ...
```

This repo uses a very simple symbolic links approach. By using a bash script we symlink `pages` and `public` folder (and a couple more for convenience) to the root location where Next.js expects to find them. 