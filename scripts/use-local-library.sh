reregister() {
  cd $1
  yarn unlink
  yarn link
}

# link packages from component library
reregister "$1/node_modules/react" &
reregister "$1/node_modules/react-dom" &
reregister "$1/node_modules/styled-components" &
reregister "$1/node_modules/semantic-ui-css" &

# link local component library
reregister "$1" &

wait
printf "$(tput bold)\nAll library packages registered\n\n$(tput sgr0)"

# use local packages from component library
yarn link react &
yarn link react-dom &
yarn link styled-components &
yarn link semantic-ui-css &
yarn link semantic-styled-ui &

wait
printf "\n$(tput bold)All library packages linked$(tput sgr0)\n"
