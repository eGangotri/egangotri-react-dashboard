set timestamp=%DATE:/=-%_%TIME::=-%
set timestamp=%timestamp: =%
set arg1=%1
set arg1WithoutQuotes=%arg1:"='%
set commit_msg="Optimizations at %timestamp% %arg1WithoutQuotes%"
git status
git add src/*
git add *.json
git add pnpm-lock.yaml
git commit -m %commit_msg%
git push origin master
git status

