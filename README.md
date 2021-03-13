# simple jira creator


### Install
```
git clone https://github.com/lupu60/jira-issue-creator.git
cd jira-issue-creator && npm install
cp .env.example .env
// put the environment variable
npm run build && npm link
```

### Usage
```
jira-issue-creator -e // this will create an example file
jira-issue-creator -t ./new-issues.yaml // this will create all the issues present in the file
```