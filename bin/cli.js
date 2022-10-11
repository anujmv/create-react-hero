#!/usr/bin/env node

const { execSync } = require("child_process");

const runCommand = (command) => {
  try {
    execSync(`${command}`, { stdio: "inherit" });
  } catch (err) {
    console.error(`Failed to execute ${command}`, err);
    return false;
  }
  return true;
};

const repoName = process.argv[2];
const gitCheckoutCommand = `git clone https://github.com/anujmv/create-react-hero.git ${repoName}`;
const installDepsCommand = `cd ${repoName} && npm install`;
console.log(`Setting up create-react-hero in ${repoName}`);

const checkedOut = runCommand(gitCheckoutCommand);
if (!checkedOut) process.exit(-1);

console.log(`Installing dependencies for ${repoName}`);

const insalledDeps = runCommand(installDepsCommand);

if (!insalledDeps) process.exit(-1);

console.log(`Your app is ready. To start App`);
console.log(`cd ${repoName} && npm start`);
