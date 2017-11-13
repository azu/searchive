# searchive-app

[![App](https://media.giphy.com/media/3o6fIYo3aDtasisB2M/giphy.gif)](http://www.giphy.com/gifs/3o6fIYo3aDtasisB2M)

## Usage

1. Open "Index setting"
2. Put `/your/path/index/*.pdf`
    - Accept [glob](https://github.com/isaacs/node-glob "node-glob") pattern.
3. Save and Indexing
    - Wait until finished indexing
4. Search


## Development

```bash
# run application in development mode
yarn dev

# compile source code and create webpack output
yarn compile

# `yarn compile` & create build with electron-builder
yarn dist

# `yarn compile` & create unpacked build with electron-builder
yarn dist:dir
```

## Notes

> "predist": "rimraf node_modules && yarn install"

It aim to avoid to error "restify".
`learn` link as symlink, Instead of, `yarn install` install actual dependencies.

- [Symlinks in asarUnpack are not copied · Issue #1376 · electron-userland/electron-builder](https://github.com/electron-userland/electron-builder/issues/1376 "Symlinks in asarUnpack are not copied · Issue #1376 · electron-userland/electron-builder")
