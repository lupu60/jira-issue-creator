#!/usr/bin/env node
import * as dotenv from "dotenv";
dotenv.config();

import program from "commander";
import { bulkCreateIssues, Issue } from "./jira-connector";
import YAML from "yaml";
import * as fs from "fs";

export const readFile = (path: string): Promise<string> =>
  new Promise((resolve, reject) =>
    fs.readFile(path, "utf8", (err: Error, res) =>
      err ? reject(err) : resolve(res)
    )
  );
interface Options {
  tasks: string;
  example: boolean;
}

async function createIssues({ path }) {
  const docs = YAML.parseAllDocuments(await readFile(path));
  const issues: Issue[] = docs.map((doc) => doc.toJSON() as Issue);
  try {
    await bulkCreateIssues({ list: issues });
  } catch (error) {
    console.error(error);
  }
}

program
  .version("0.0.1")
  .option("-t, --tasks [path]", "Tasks file [path]", "path")
  .option("-e, --example", "Print template file with examples")
  .parse(process.argv);

const options = program.opts() as Options;

if (options.tasks !== "path") {
  createIssues({ path: options.tasks });
}

if (options.example) {
  fs.writeFile(
    "./new-issues.yaml",
    `---
  summary: Hello from api
  description: |
    Description ndksandk

  ---
  summary: Hello from api
  description: |
    ### Heading

    * Bullet
    * Points
  `,
    function (err) {
      if (err) return console.log(err);
    }
  );
}
