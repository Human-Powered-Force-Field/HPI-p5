# HPI-p5

Installed Packages:

npm init (To create package.json which we already have, so shouldn't have to run again)

npm install --save firebase (maybe needed)

npm install -g browserify (Not doing any good atm)
npm install uniq (Not doing any good atm)

(Don't know if any of above are actually needed, browserify didn't seem to work and is probably not needed. The firebase install might be needed)

Set up localhost:
npm install -g http-server
run with:
http-server
or:
http-server -c-1

Or set up auto updating server:
npm install -g browser-sync
Run with:
browser-sync start --server -f -w
Available at:
http://localhost:3000
