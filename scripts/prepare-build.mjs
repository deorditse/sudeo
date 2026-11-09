import { readdir, rm } from "node:fs/promises";
import path from "node:path";

const output = path.resolve("docs");

try {
    const entries = await readdir(output, { withFileTypes: true });
    await Promise.all(entries
        .filter((entry) => entry.name !== "adr")
        .map((entry) => rm(path.join(output, entry.name), { recursive: true, force: true })));
} catch (error) {
    if (error?.code !== "ENOENT") throw error;
}

await rm(path.resolve(".ssr"), { recursive: true, force: true });
console.log("Prepared docs/ while preserving docs/adr source decisions.");
