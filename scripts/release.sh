#!/usr/bin/env bash

set -e

prog=$0

show_usage() {
    echo "Usage: ${prog} branch|patch|minor|major"
    exit 1
}


main() {
    BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD | sed -e "s/[^A-Za-z0-9]/-/g")
    case $1 in
        branch)
            npm version $(pnpm dlx semver $(node -p "require('./package.json').version") -i prerelease --preid $BRANCH_NAME)
            ;;
        patch|minor|major)
            if ! [[ $BRANCH_NAME == "master" || $BRANCH_NAME == "main" ]]; then
              echo "Patch/minor/major can only be used on master or main. Please use branch release instead."
              exit 1;
            fi
            npm version $1
            ;;
        *)
            show_usage
            ;;
    esac

    git push -u origin $(git rev-parse --abbrev-ref HEAD)
    git push --tags
}

main $@
