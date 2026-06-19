const fs = require('fs');

function fixFile(file) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/familia\.diagnostico\?\./g, 'familia.');
  code = code.replace(/familia\.diagnostico\./g, 'familia.');
  // only replace standalone familia.diagnostico ? when it evaluates existence. 
  // Let's be careful and use simple regex:
  code = code.replace(/!f\.diagnostico/g, '!f.dataCadastro');
  code = code.replace(/f\.diagnostico\?/g, 'f.');
  code = code.replace(/f\.diagnostico/g, 'f');
  
  fs.writeFileSync(file, code);
}

fixFile('app/(sigga)/ater-sociobio/familias/[id]/page.tsx');
fixFile('app/(sigga)/ater-sociobio/organizacoes/[id]/page.tsx');
fixFile('components/ater/diagnostico-report-pdf.tsx');
