sh scripts/use-local-library.sh $1

printf "$(tput bold)building library in watch mode (yarn dev)$(tput sgr0)\n\n"

path=$(mktemp)

cd $1

# start watcher and send output to stdout and temp file
(yarn watch 2>&1 | tee $path) &
# WATCHER=$!

# continuously read temp file while program is running
tail -F $path | while read line; do
  res=$(printf "$line" | grep -E "created .* in .*")
  if [ -n "$res" ]; then
    printf "\n$(tput bold)library watcher started successfully, launching gatsby$(tput sgr0)\n\n"
    cd -
    gatsby develop
    exit
  fi
done
