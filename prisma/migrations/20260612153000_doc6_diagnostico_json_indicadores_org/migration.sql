-- Documento 6 - Acariquara: structured multi-select fields and organization details.

CREATE OR REPLACE FUNCTION temp_doc6_text_column_to_jsonb(p_table_name text, p_column_name text)
RETURNS void AS $$
DECLARE
  current_type text;
BEGIN
  SELECT c.data_type
    INTO current_type
    FROM information_schema.columns AS c
   WHERE c.table_schema = 'public'
     AND c.table_name = p_table_name
     AND c.column_name = p_column_name;

  IF current_type IS NULL THEN
    RAISE EXCEPTION 'Column %.% was not found', p_table_name, p_column_name;
  END IF;

  IF current_type = 'jsonb' THEN
    RETURN;
  END IF;

  IF current_type <> 'text' THEN
    RAISE EXCEPTION 'Column %.% has unsupported type %', p_table_name, p_column_name, current_type;
  END IF;

  EXECUTE format(
    'ALTER TABLE %I ALTER COLUMN %I TYPE JSONB USING (
      CASE
        WHEN %I IS NULL THEN NULL
        WHEN btrim(%I) = '''' THEN ''[]''::jsonb
        ELSE to_jsonb(ARRAY[%I])
      END
    )',
    p_table_name,
    p_column_name,
    p_column_name,
    p_column_name,
    p_column_name
  );
END;
$$ LANGUAGE plpgsql;

SELECT temp_doc6_text_column_to_jsonb('diagnosticos_ufpa', 'acoesPotenciaisProdutivo');
SELECT temp_doc6_text_column_to_jsonb('diagnosticos_ufpa', 'acoesPotenciaisSocial');
SELECT temp_doc6_text_column_to_jsonb('diagnosticos_ufpa', 'acoesPotenciaisAmbiental');
SELECT temp_doc6_text_column_to_jsonb('diagnosticos_ufpa', 'limitacoesProdutivo');
SELECT temp_doc6_text_column_to_jsonb('diagnosticos_ufpa', 'limitacoesSocial');
SELECT temp_doc6_text_column_to_jsonb('diagnosticos_ufpa', 'limitacoesAmbiental');

DROP FUNCTION temp_doc6_text_column_to_jsonb(text, text);

ALTER TABLE "indicadores_organizacoes_coletivas"
  ADD COLUMN IF NOT EXISTS "praticasAmbientaisQuais" TEXT,
  ADD COLUMN IF NOT EXISTS "identidadeComercialQuais" TEXT,
  ADD COLUMN IF NOT EXISTS "representacaoPoliticaQuais" TEXT,
  ADD COLUMN IF NOT EXISTS "politicasPublicasQuais" TEXT;
