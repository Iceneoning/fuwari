/* This is a script to create a new post markdown file with front-matter */

import fs from "node:fs";
import path from "node:path";

function getDate() {
	const today = new Date();
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, "0");
	const day = String(today.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
}

const args = process.argv.slice(2);

if (args.length === 0) {
	console.error(`Error: No filename argument provided
Usage: npm run new-post -- <filename>`);
	process.exit(1);
}

const requestedName = args[0].trim();
if (!requestedName) {
	console.error("Error: Filename cannot be empty");
	process.exit(1);
}

let fileName = requestedName;

// Add .md extension if not present
const fileExtensionRegex = /\.(md|mdx)$/i;
if (!fileExtensionRegex.test(fileName)) {
	fileName += ".md";
}

const targetDir = path.resolve("./src/content/posts/");
const fullPath = path.resolve(targetDir, fileName);
const isInsideTarget =
	fullPath.startsWith(`${targetDir}${path.sep}`) && fullPath !== targetDir;

if (!isInsideTarget || path.isAbsolute(fileName)) {
	console.error("Error: Filename must stay inside src/content/posts");
	process.exit(1);
}

if (fs.existsSync(fullPath)) {
	console.error(`Error: File ${fullPath} already exists`);
	process.exit(1);
}

// recursive mode creates multi-level directories
const dirPath = path.dirname(fullPath);
if (!fs.existsSync(dirPath)) {
	fs.mkdirSync(dirPath, { recursive: true });
}

const postTitle = path.basename(fileName, path.extname(fileName));
const content = `---
title: ${JSON.stringify(postTitle)}
published: ${getDate()}
description: ""
image: ""
tags: []
category: "代码"
draft: false
lang: ""
---
`;

fs.writeFileSync(fullPath, content, "utf8");

console.log(`Post ${fullPath} created`);
