import { PrismaClient, Role } from "@prisma/client";

import { hashPassword } from "../../lib/auth/password";

const prisma = new PrismaClient();

function readArg(name: string) {
  const prefix = `--${name}=`;
  const found = process.argv.find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length).trim() : "";
}

function getValue(argName: string, envName: string) {
  return readArg(argName) || process.env[envName] || "";
}

function isRole(value: string): value is Role {
  return Object.values(Role).includes(value as Role);
}

async function main() {
  const name = getValue("name", "SIGGATER_USER_NAME").trim();
  const email = getValue("email", "SIGGATER_USER_EMAIL").trim().toLowerCase();
  const password = process.env.SIGGATER_USER_PASSWORD || "";
  const role = getValue("role", "SIGGATER_USER_ROLE").trim() || "OPERADOR";

  if (!email || !password || !isRole(role)) {
    console.error("Uso:");
    console.error("  $env:SIGGATER_USER_PASSWORD='senha-provisoria-forte'");
    console.error("  npm.cmd run siggater:user -- --email=usuario@exemplo.com --role=OPERADOR --name=\"Nome\"");
    console.error("");
    console.error("Ou por variaveis de ambiente:");
    console.error("  SIGGATER_USER_EMAIL, SIGGATER_USER_PASSWORD, SIGGATER_USER_ROLE, SIGGATER_USER_NAME");
    console.error("");
    console.error("Roles validas:");
    console.error(`  ${Object.values(Role).join(", ")}`);
    process.exit(1);
  }

  if (password.length < 12) {
    console.error("A senha provisoria deve ter pelo menos 12 caracteres.");
    process.exit(1);
  }

  const user = await prisma.user.upsert({
    where: { email },
    create: {
      email,
      name: name || email,
      passwordHash: hashPassword(password),
      role,
      status: "ATIVO",
    },
    update: {
      ...(name ? { name } : {}),
      passwordHash: hashPassword(password),
      role,
      status: "ATIVO",
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
    },
  });

  console.log("Usuario SIGGATER pronto:");
  console.log(JSON.stringify(user, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
