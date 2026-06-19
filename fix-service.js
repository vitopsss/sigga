const fs = require('fs');

let code = fs.readFileSync('lib/services/ater-sociobio.service.ts', 'utf8');

// remove diagnostico: true
code = code.replace(/diagnostico:\s*true,?\r?\n/g, '');
code = code.replace(/diagnostico:\s*true;\r?\n/g, '');

// replace familia.diagnostico?.prop -> familia.prop
code = code.replace(/familia\.diagnostico\?\./g, 'familia.');
code = code.replace(/familia\.diagnostico/g, 'familia');

// Where conditions (boolean matches)
code = code.replace(/diagnostico:\s*\{\s*is:\s*\{\s*possuiInternet:\s*false\s*\}\s*\}/g, 'possuiInternet: false');
code = code.replace(/diagnostico:\s*\{\s*is:\s*\{\s*aguaConsumoTratada:\s*false\s*\}\s*\}/g, 'aguaConsumoTratada: false');
code = code.replace(/diagnostico:\s*\{\s*is:\s*\{\s*esgotoTratado:\s*false\s*\}\s*\}/g, 'esgotoTratado: false');

code = code.replace(/diagnostico:\s*\{\s*is:\s*\{\s*possuiInternet:\s*true\s*\}\s*\}/g, 'possuiInternet: true');
code = code.replace(/diagnostico:\s*\{\s*is:\s*\{\s*aguaConsumoTratada:\s*true\s*\}\s*\}/g, 'aguaConsumoTratada: true');
code = code.replace(/diagnostico:\s*\{\s*is:\s*\{\s*esgotoTratado:\s*true\s*\}\s*\}/g, 'esgotoTratado: true');

// Null checks
code = code.replace(/diagnostico:\s*\{\s*is:\s*null\s*\}/g, 'dataCadastro: null');
code = code.replace(/diagnostico:\s*\{\s*isNot:\s*null\s*\}/g, 'dataCadastro: { not: null }');
code = code.replace(/diagnostico:\s*\{\s*is:\s*\{\s*aguaConsumoTratada:\s*null\s*\}\s*\}/g, 'aguaConsumoTratada: null');

// fix upsertDiagnosticoUfpa
code = code.replace(/diagnostico:\s*Omit<Prisma\.DiagnosticoUfpaUncheckedCreateInput.*?>;/, 'diagnostico: Prisma.FamiliaAterUncheckedUpdateInput;');
code = code.replace(/const savedDiagnostico = await tx\.diagnosticoUfpa\.upsert\(\{[\s\S]*?update:\s*diagnostico,[\s\S]*?\}\);/, 'const savedDiagnostico = await tx.familiaAter.update({ where: { id: familiaId }, data: diagnostico });');

fs.writeFileSync('lib/services/ater-sociobio.service.ts', code);
