#!/usr/bin/env node

import chalk from "chalk";
import { execSync } from "child_process";
import fetch from "node-fetch";

const OPENAI_API_KEY =
  process.env.OPENAI_API_KEY ||
  "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";

async function main() {
  console.log(chalk.green("Welcome to AIReview!"));

  if (!OPENAI_API_KEY) {
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

  let prompt = `I want you to act like a code reviewer. I'll give you the output of the "git diff" command as an input, and your job is to review the code changes, spot any bad coding practices and make suggestions in case you have any. Return a complete sentence without repeating yourself: ${diff}`;

  console.log(chalk.gray("Generating your AI code review...\n"));
  const aiCodeReview = await generateCodeReview(prompt);

  console.log(chalk.bold("Code Review: ") + aiCodeReview);
  console.log("\n");
}

async function generateCodeReview(prompt) {
  const payload = {
    model: "text-davinci-003",
    prompt,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 1000,
    stream: false,
    n: 1,
  };
  const response = await fetch("https://api.openai.com/v1/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY ?? ""}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  const json = await response.json();
  if (json.error) {
    console.error("OpenAI Erorr: " + json.error.message);
    process.exit(0);
  }
  return json.choices[0]?.text;
}

await main();
