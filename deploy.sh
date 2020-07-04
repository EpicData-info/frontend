#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd dist

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME
echo "epicdata.info" >> "CNAME"

git init
git add -A
git commit -m 'deploy'

git push -u -f https://github.com/EpicData-info/frontend master:gh-pages

cd -