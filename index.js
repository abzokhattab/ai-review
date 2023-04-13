#!/usr/bin/env node

import chalk from "chalk";
import { execSync } from "child_process";
import { generateCodeReview } from "./generateReview.js";

const apiKey = process.env.OPENAI_API_KEY;

async function main() {
  console.log(chalk.green("Welcome to AIReview!"));

  if (!apiKey) {
    console.error(
      "Please specify an OpenAI key using export OPENAI_API_KEY='YOUR_API_KEY'"
    );
    process.exit(1);
  }
  try {
    execSync("git rev-parse --is-inside-work-tree", {
      encoding: "utf8",
      stdio: "ignore",
    });
  } catch (e) {
    console.error("This is not a git repository");
    process.exit(1);
  }
  // git add all to cover untracked files
  execSync("git add -A  ", { encoding: "utf8" });
  const diff = execSync("git diff HEAD", { encoding: "utf8" });
  execSync("git reset HEAD", { encoding: "utf8" });

  if (!diff) {
    console.log("No changes found");
    process.exit(1);
  }

  // Accounting for GPT-3's input req of 4k tokens (approx 8k chars)
  if (diff.length > 8000) {
    console.log("The diff is too large to write a code review.");
    process.exit(1);
  }

  let prompt = `I want you to act like a code reviewer. I'll give you the output of the "git diff" command as an input, and your job is to review the code changes, spot any bad coding practices and make suggestions in case you have any: ${diff}`;

  console.log(chalk.gray("Generating your AI code review...\n"));
  const aiCodeReview = await generateCodeReview(prompt, apiKey);

  console.log(chalk.bold("Code Review: ") + aiCodeReview);
  console.log("\n");
}

await main();
