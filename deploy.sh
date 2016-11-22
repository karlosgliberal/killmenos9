grunt build
cp -rf dist/* ../killmenos9-prod
cd ../killmenos9-prod
git add .
git commit -am "deploy"
git push

