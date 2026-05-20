#!/bin/sh
# rm public
rm -r styles
rm -r components
rm -r pages
rm -r .env.local

# Define the paths to the 'pages' and 'public' folders For app
pages_path="sites/app/pages"
public_path="sites/app/public"
styles_path="sites/app/styles"
components_path="sites/app/components"
env_path="sites/env/uat/.env.local"

# Symlink 'pages' and 'public' folders to the root
ln -sfn "$pages_path" "pages"
# ln -sfn "$public_path" "public"
ln -sfn "$styles_path" "styles"
ln -sfn "$components_path" "components"
ln -sfn "$env_path" ".env.local"

echo "app CodeBase Connected."