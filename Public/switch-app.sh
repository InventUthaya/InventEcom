#!/bin/sh
# rm public
rm -r styles
rm -r components
rm -r pages

# Define the paths to the 'pages' and 'public' folders For APP
pages_path="sites/app/pages"
public_path="sites/app/public"
styles_path="sites/app/styles"
components_path="sites/app/components"


# Symlink 'pages' and 'public' folders to the root
ln -s "$pages_path" "pages"
# ln -sfn "$public_path" "public"
ln -s "$styles_path" "styles"
ln -s "$components_path" "components"

echo "APP CodeBase Connected."