
CURRENT_DIR=$(cd $(dirname $0);pwd)

pushd $CURRENT_DIR > /dev/null

# Get UI version
UI_VERSION=$(node -p "require('./package.json').version")

zip_path="swagger-ui-${UI_VERSION}"
zip_file=${UI_VERSION}.zip

target_path=../springfox/springfox-swagger-ui/build/zip/

mkdir -p $zip_path

cp LICENSE $zip_path/
cp -r dist $zip_path/

zip -r $zip_file $zip_path

mkdir -p $target_path
mv $zip_file $target_path
rm -rf $zip_path

popd  > /dev/null
