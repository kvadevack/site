#!/bin/bash

set -euo pipefail

declare -A excludes
while getopts ":x:" opt; do
	case $opt in
	x) excludes[${OPTARG:-}]=x;;
	\?) echo "invalid option: -${OPTARG:-}" >&2; exit 1;;
	:) echo "option -${OPTARG:-} requires an argument" >&2; exit 1;;
	esac
done

shift "$((OPTIND-1))"

while IFS=: read -u 3 -r _ _ current latest type _; do
	package=${current%@*}
	if [[ -v excludes[$package] ]] || ! npx semver -r "<${latest##*@}" ${current##*@} >/dev/null; then
		continue
	fi

	case $type in
	devDependencies) commitType=chore; saveFlag=--save-dev;;
	dependencies) commitType=fix; saveFlag=--save;;
	*) continue;;
	esac

	npm install $saveFlag "$latest"
	npm test
	git add package{,-lock}.json
	git commit -m "$commitType(package): update $package from ${current##*@} to ${latest##*@}"
done 3< <(npm outdated --long --parseable)
