parentDirPath=`dirname "$1"`
parentDirName=`basename "$parentDirPath"`
componentName=$parentDirName
componentTestUrl="http://localhost:6109/embeddedService/$componentName.cmp?aura.mode=JSTESTDEBUG"

echo "Now opening" $componentTestUrl
open -a "/Applications/Google Chrome.app" "$componentTestUrl"
