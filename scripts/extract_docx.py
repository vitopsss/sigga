import zipfile
import xml.etree.ElementTree as ET

z = zipfile.ZipFile('docs/acariquara/fontes-oficiais/siggater-base/POTENCIALIDADES.docx')
xml_content = z.read('word/document.xml')
tree = ET.fromstring(xml_content)
ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}

for tbl in tree.findall('.//w:tbl', ns):
    print("--- TABLE ---")
    for row in tbl.findall('.//w:tr', ns):
        cells = []
        for cell in row.findall('.//w:tc', ns):
            text = ''.join(node.text for node in cell.findall('.//w:t', ns) if node.text)
            cells.append(text.strip())
        print(" | ".join(cells))
