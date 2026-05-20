#!/bin/sh
# rm public
rm -r styles
rm -r components
rm -r pages
rm -r .env.local

# Define the paths to the 'pages' and 'public' folders For Web
pages_path="sites/web/pages"
public_path="sites/web/public"
styles_path="sites/web/styles"
components_path="sites/web/components"
env_path="sites/env/prod/.env.local"

# Symlink 'pages' and 'public' folders to the root
ln -sfn "$pages_path" "pages"
# ln -sfn "$public_path" "public"
ln -sfn "$styles_path" "styles"
ln -sfn "$components_path" "components"
ln -sfn "$env_path" ".env.local"

echo "Web CodeBase Connected."