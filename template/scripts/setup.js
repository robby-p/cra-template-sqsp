const DIR = process.argv[2];
const pkgPath = require("path").resolve(DIR, "package.json");
const readline = require("readline");
const { execSync } = require("child_process");
const { writeFileSync } = require("fs");

const newPkgJson = JSON.stringify({
  homepage: "/assets",
  ...require(pkgPath)
},null,4);


(async function() {
  console.log('Writing homepage: "/assets" to package.json ...')
  writeFileSync(pkgPath,newPkgJson);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  try {
    const cmd = `git add ${pkgPath} && git commit --allow-empty -m "update package.json"`;
    console.log(`$> ${cmd}`);
    execSync(cmd);
  } catch(e){
    console.error(`Error updating package.json`);
    console.error(">>>", e.stdout.toString() + "\n" + e.stderr.toString());
    process.exit(1);
  }
  const repo = await new Promise(rs =>
    rl.question("<> Enter remote Squarespace template git repo: \n", repo => {
      rl.close();
      rs(repo.trim());
    })
  );
  if (!/template.git$/.test(repo))
    console.error(
      repo,
      "does not look like a template repo, `git add remote template <uri>` yourself \n\n"
    );
  const cmd = `git remote add template ${repo}`;
  console.log(`$> ${cmd}`);
  try {
    execSync(cmd);
  } catch (e) {
    console.error(`Error setting git repo to template remote repo`);
    console.error(">>>", e.stdout.toString() + "\n" + e.stderr.toString());
    process.exit(1);
  }
})();

