export function parseInteractionId(id: string) {
  const parts = id.split("/");
  const name = parts.shift();
  const args = parts.filter((p) => p.startsWith(":")).map((p) => p.slice(1));

  return { name, args };
}
