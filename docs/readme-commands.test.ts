import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const README_PATH = new URL("../README.md", import.meta.url);

function readReadme(): string {
  return readFileSync(README_PATH, "utf8");
}

function extractSection(readme: string, heading: string): string {
  const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const sectionPattern = new RegExp(`## ${escapedHeading}\\n\\n([\\s\\S]*?)(?:\\n## |$)`);
  const match = readme.match(sectionPattern);

  if (!match) {
    throw new Error(`Could not find section: ${heading}`);
  }

  return match[1];
}

describe("README command reference contract", () => {
  it("documents all maintainer-facing bot commands", () => {
    const commands = extractSection(readReadme(), "Operator Commands");

    expect(commands).toContain("Repository maintainers");
    expect(commands).toContain("@hivemoot /vote");
    expect(commands).toContain("@hivemoot /implement");
    expect(commands).toContain("@hivemoot /gather");
    expect(commands).toContain("@hivemoot /doctor");
    expect(commands).toContain("@hivemoot /preflight");
    expect(commands).toContain("@hivemoot /squash");
  });

  it("keeps local development checks aligned with the contribution quality bar", () => {
    const readme = readReadme();

    expect(readme).toContain("npm test");
    expect(readme).toContain("npm run typecheck");
    expect(readme).toContain("npm run lint");
    expect(readme).toContain("npm run build");
  });
});
