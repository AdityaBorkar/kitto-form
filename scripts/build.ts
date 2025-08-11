import { rm } from "node:fs/promises";
import { join } from "node:path";
import { build } from "bun";

await rm(join(process.cwd(), "./dist"), { force: true, recursive: true });

await build({
	entrypoints: ["src/index.ts"],
	format: "esm",
	minify: false,
	outdir: "dist",
	sourcemap: false,
	splitting: false,
	tsconfig: "tsconfig.json",
});
