# NOTE: this may fail to open in the integrated terminal on Windows
# this is likely due to using a different shell like git bash
# it can be fixed by setting Yarn's shell like `yarn config set script-shell /bin/bash`
# @see https://stackoverflow.com/a/58188828

export ENV_MODE="local"

BOLD="$(tput bold)"
RESET="$(tput sgr0)"

printf "${BOLD}building library in watch mode (yarn dev)$RESET\n\n"

path=$(mktemp)

cd $1

# force rollup to output ansi codes even when piped
export FORCE_COLOR="1"
# start watcher and send output to stdout and temp file
(yarn watch 2>&1 | tee "$path") &

# continuously read temp file while program is running
tail -F "$path" | while read line; do
  res=$(printf "$line" | grep -E "created .* in .*")
  if [ -n "$res" ]; then
    printf "\n${BOLD}library watcher started successfully, launching gatsby$RESET\n\n"
    cd -
    yarn start
    exit
  fi
done
