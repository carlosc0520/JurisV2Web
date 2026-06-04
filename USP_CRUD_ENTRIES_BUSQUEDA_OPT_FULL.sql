ALTER PROCEDURE [JURIS].[USP_CRUD_ENTRIES_BUSQUEDA]
(
    @p_cData        VARCHAR(MAX),
    @p_cUser        VARCHAR(30),
    @p_nTipo        INT,
    @p_nId          NUMERIC(15)    OUTPUT
)
AS
BEGIN

    DECLARE @cData  VARCHAR(MAX),
            @cDescrip    VARCHAR(50),
            @nInit   INT,
            @nRows   INT;

    SET @p_nId    =   ISNULL(@p_nId,0);
    SET @cData    =   REPLACE(@p_cData,'NULL','null');

    -- (omito las primeras ramas no modificadas por brevedad)
    -- Copie/pegue acá las secciones previas si desea el script completo.

    -- ============================================================
    -- ELSE (Rama optimizada) — reemplaza la lógica original desde aquí
    -- ============================================================

    -- 0. NORMALIZAR PARÁMETROS
    SET @GLOBAL = TRIM(@GLOBAL);
    SET @ORDER  = UPPER(TRIM(ISNULL(@ORDER, 'DESC')));
    SET @GLOBAL = NULLIF(@GLOBAL, '');

    -- 1. PRE-MATERIALIZAR FILTROS MULTI-VALOR EN TABLAS TEMPORALES (igual que antes)
    IF OBJECT_ID('tempdb..#fDelito')        IS NOT NULL DROP TABLE #fDelito;
    IF OBJECT_ID('tempdb..#fJurisdiccion')  IS NOT NULL DROP TABLE #fJurisdiccion;
    IF OBJECT_ID('tempdb..#fRecurso')       IS NOT NULL DROP TABLE #fRecurso;
    IF OBJECT_ID('tempdb..#fOJ')            IS NOT NULL DROP TABLE #fOJ;
    IF OBJECT_ID('tempdb..#fJVinculante')   IS NOT NULL DROP TABLE #fJVinculante;
    IF OBJECT_ID('tempdb..#fMagistrates')   IS NOT NULL DROP TABLE #fMagistrates;
    IF OBJECT_ID('tempdb..#fTpoNrma')       IS NOT NULL DROP TABLE #fTpoNrma;
    IF OBJECT_ID('tempdb..#fOEmisor')       IS NOT NULL DROP TABLE #fOEmisor;
    IF OBJECT_ID('tempdb..#fAmbit')         IS NOT NULL DROP TABLE #fAmbit;
    IF OBJECT_ID('tempdb..#fMateria')       IS NOT NULL DROP TABLE #fMateria;
    IF OBJECT_ID('tempdb..#fKeywords')      IS NOT NULL DROP TABLE #fKeywords;
    IF OBJECT_ID('tempdb..#palabrasGlobal') IS NOT NULL DROP TABLE #palabrasGlobal;

    SELECT CAST(LTRIM(RTRIM(value)) AS VARCHAR(50)) AS VAL
    INTO #fDelito FROM STRING_SPLIT(@DELITO, ',') WHERE @DELITO IS NOT NULL AND LTRIM(RTRIM(value)) <> '';
    IF (SELECT COUNT(*) FROM #fDelito) > 20
      CREATE INDEX IX_fDelito ON #fDelito(VAL);

    SELECT CAST(LTRIM(RTRIM(value)) AS VARCHAR(50)) AS VAL
    INTO #fJurisdiccion FROM STRING_SPLIT(@JURISDICCION, ',') WHERE @JURISDICCION IS NOT NULL AND LTRIM(RTRIM(value)) <> '';
    IF (SELECT COUNT(*) FROM #fJurisdiccion) > 20
      CREATE INDEX IX_fJurisdiccion ON #fJurisdiccion(VAL);

    SELECT CAST(LTRIM(RTRIM(value)) AS VARCHAR(50)) AS VAL
    INTO #fRecurso FROM STRING_SPLIT(@RECURSO, ',') WHERE @RECURSO IS NOT NULL AND LTRIM(RTRIM(value)) <> '';
    IF (SELECT COUNT(*) FROM #fRecurso) > 20
      CREATE INDEX IX_fRecurso ON #fRecurso(VAL);

    SELECT CAST(LTRIM(RTRIM(value)) AS VARCHAR(50)) AS VAL
    INTO #fOJ FROM STRING_SPLIT(@OJURISDICCIONAL, ',') WHERE @OJURISDICCIONAL IS NOT NULL AND LTRIM(RTRIM(value)) <> '';
    IF (SELECT COUNT(*) FROM #fOJ) > 20
      CREATE INDEX IX_fOJ ON #fOJ(VAL);

    SELECT CAST(LTRIM(RTRIM(value)) AS VARCHAR(50)) AS VAL
    INTO #fJVinculante FROM STRING_SPLIT(@JVINCULANTE, ',') WHERE @JVINCULANTE IS NOT NULL AND LTRIM(RTRIM(value)) <> '';
    IF (SELECT COUNT(*) FROM #fJVinculante) > 20
      CREATE INDEX IX_fJVinculante ON #fJVinculante(VAL);

    SELECT CAST(LTRIM(RTRIM(value)) AS VARCHAR(50)) AS VAL
    INTO #fMagistrates FROM STRING_SPLIT(@MAGISTRATES, ',') WHERE @MAGISTRATES IS NOT NULL AND LTRIM(RTRIM(value)) <> '';
    IF (SELECT COUNT(*) FROM #fMagistrates) > 20
      CREATE INDEX IX_fMagistrates ON #fMagistrates(VAL);

    SELECT CAST(LTRIM(RTRIM(value)) AS VARCHAR(50)) AS VAL
    INTO #fTpoNrma FROM STRING_SPLIT(@TPONRMA, ',') WHERE @TPONRMA IS NOT NULL AND LTRIM(RTRIM(value)) <> '';
    IF (SELECT COUNT(*) FROM #fTpoNrma) > 20
      CREATE INDEX IX_fTpoNrma ON #fTpoNrma(VAL);

    SELECT CAST(LTRIM(RTRIM(value)) AS VARCHAR(50)) AS VAL
    INTO #fOEmisor FROM STRING_SPLIT(@OEMISOR, ',') WHERE @OEMISOR IS NOT NULL AND LTRIM(RTRIM(value)) <> '';
    IF (SELECT COUNT(*) FROM #fOEmisor) > 20
      CREATE INDEX IX_fOEmisor ON #fOEmisor(VAL);

    SELECT CAST(LTRIM(RTRIM(value)) AS VARCHAR(50)) AS VAL
    INTO #fAmbit FROM STRING_SPLIT(@AMBIT, ',') WHERE @AMBIT IS NOT NULL AND LTRIM(RTRIM(value)) <> '';
    IF (SELECT COUNT(*) FROM #fAmbit) > 20
      CREATE INDEX IX_fAmbit ON #fAmbit(VAL);

    SELECT CAST(LTRIM(RTRIM(value)) AS VARCHAR(50)) AS VAL
    INTO #fMateria FROM STRING_SPLIT(@MATERIA, ',') WHERE @MATERIA IS NOT NULL AND LTRIM(RTRIM(value)) <> '';
    IF (SELECT COUNT(*) FROM #fMateria) > 20
      CREATE INDEX IX_fMateria ON #fMateria(VAL);

    SELECT CAST(TRIM(dbo.RemoveNonAlphanumeric(value)) AS VARCHAR(500)) AS VAL
    INTO #fKeywords FROM STRING_SPLIT(@KEYWORDS, ',') WHERE @KEYWORDS IS NOT NULL AND LTRIM(RTRIM(value)) <> '';
    IF (SELECT COUNT(*) FROM #fKeywords) > 20
      CREATE INDEX IX_fKeywords ON #fKeywords(VAL);

    -- 2. PRE-CALCULAR PALABRAS DEL GLOBAL (para MODO 1 y 2)
    SELECT DISTINCT
      CAST(dbo.RemoveNonAlphanumeric(LTRIM(RTRIM(value))) AS VARCHAR(200)) AS PAL
    INTO #palabrasGlobal
    FROM STRING_SPLIT(@GLOBAL, ' ')
    WHERE LEN(LTRIM(RTRIM(value))) > 3
      AND @GLOBAL IS NOT NULL;
    IF (SELECT COUNT(*) FROM #palabrasGlobal) > 3
      CREATE INDEX IX_palabrasGlobal ON #palabrasGlobal(PAL);

    -- 2.b) Materializar una vista reducida de ENTRADA con columnas normalizadas
    IF OBJECT_ID('tempdb..#ENTRADA_MIN') IS NOT NULL DROP TABLE #ENTRADA_MIN;
    SELECT
      e.ID,
      e.FCRCN,
      e.FRESOLUTION,
      e.TITULO,
      CAST(dbo.RemoveNonAlphanumeric(e.TITULO) AS VARCHAR(500)) COLLATE Latin1_General_CI_AI AS TITULO_N,
      e.RTITLE,
      CAST(dbo.RemoveNonAlphanumeric(ISNULL(e.RTITLE, '')) AS VARCHAR(500)) COLLATE Latin1_General_CI_AI AS RTITLE_N,
      e.ENTRIEFILE,
      e.ENTRIEFILERESUMEN,
      e.[TYPE],
      e.CASO,
      e.DELITO,
      e.OJURISDICCIONAL,
      e.OEMISOR,
      e.TPONRMA,
      e.RECURSO,
      e.ISBINDING,
      e.VDESIDENTE,
      e.CVOTE,
      CAST(dbo.RemoveNonAlphanumeric(ISNULL(e.RESUMEN, '')) AS VARCHAR(500)) COLLATE Latin1_General_CI_AI AS RESUMEN_N,
      -- SHORTSUMMARY normalized removed to avoid expensive per-row processing
      CAST(dbo.RemoveNonAlphanumeric(ISNULL(e.KEYWORDS, '')) AS VARCHAR(500)) COLLATE Latin1_General_CI_AI AS KEYWORDS_N,
      e.MAGISTRATES,
      e.JURISDICCION,
      e.JURISDICCIONV,
      e.AMBIT,
      e.TEMA,
      e.SUBTEMA,
      e.SHORTSUMMARY,
      e.NMRCN,
      e.BLOG,
      e.SITUACION,
      e.CDESTDO,
      e.MATERIA,
      e.IDSVIN
    INTO #ENTRADA_MIN
    FROM JURIS.ENTRADA e WITH (NOLOCK)
    WHERE e.CDESTDO = 'A';

    CREATE CLUSTERED INDEX IX_ENTRADA_MIN_ID ON #ENTRADA_MIN(ID);
    CREATE INDEX IX_ENTRADA_MIN_FCRCN ON #ENTRADA_MIN(FCRCN);
    CREATE INDEX IX_ENTRADA_MIN_TYPE ON #ENTRADA_MIN([TYPE]);

    -- 3. REGISTRAR BÚSQUEDA (después de preparar, no bloquea lectura)
    IF LEN(@GLOBAL) > 3
      EXEC JURIS.RegistrarBusqueda @GLOBAL, @p_cUser, @TYPE, @MODO;

    -- 4. CTE CON COLUMNAS NECESARIAS PARA FILTRAR + PAGINAR (usa #ENTRADA_MIN)
    ;WITH RESULTADOS AS (
      SELECT
        A.ID,
        A.FCRCN,
        A.FRESOLUTION,
        A.TITULO,
        A.RTITLE,
        A.ENTRIEFILE,
        A.ENTRIEFILERESUMEN,
        A.[TYPE],
        A.CASO,
        A.DELITO,
        A.OJURISDICCIONAL,
        A.OEMISOR,
        A.TPONRMA,
        A.RECURSO,
        A.ISBINDING,
        A.VDESIDENTE,
        A.CVOTE,
        A.RESUMEN_N AS RESUMEN,
        A.KEYWORDS_N AS KEYWORDS,
        A.MAGISTRATES,
        A.JURISDICCION,
        A.JURISDICCIONV,
        A.AMBIT,
        A.TEMA,
        A.SUBTEMA,
        A.SHORTSUMMARY,
        A.NMRCN,
        A.BLOG,
        A.SITUACION,
        A.CDESTDO,
        A.MATERIA,
        A.IDSVIN,
        A.TITULO_N,
        A.RTITLE_N
      FROM #ENTRADA_MIN A
      WHERE
        (A.ID = @p_nId OR @p_nId IS NULL)
        AND (A.[TYPE] = @TYPE OR @TYPE IS NULL)
        AND A.CDESTDO = 'A'
        AND (@BLOG IS NULL OR A.BLOG = @BLOG)
        -- RANGO FECHAS filtrado sobre FRESOLUTION - mantiene sargabilidad
        AND (
          (@FRESOLUTION_INIT IS NOT NULL AND @FRESOLUTION_FIN IS NOT NULL AND A.FRESOLUTION BETWEEN @FRESOLUTION_INIT AND @FRESOLUTION_FIN)
          OR (@FRESOLUTION_INIT IS NOT NULL AND @FRESOLUTION_FIN IS NULL AND A.FRESOLUTION >= @FRESOLUTION_INIT)
          OR (@FRESOLUTION_INIT IS NULL AND @FRESOLUTION_FIN IS NOT NULL AND A.FRESOLUTION <= @FRESOLUTION_FIN)
          OR (@FRESOLUTION_INIT IS NULL AND @FRESOLUTION_FIN IS NULL)
        )
        -- FILTROS MULTI-VALOR: usar STRING_SPLIT + JOIN con temp tables (evita LIKE sobre concatenado)
        AND (@DELITO IS NULL OR EXISTS (
          SELECT 1 FROM STRING_SPLIT(A.DELITO, ',') s
          INNER JOIN #fDelito f ON LTRIM(RTRIM(s.value)) = f.VAL
          WHERE LTRIM(RTRIM(s.value)) <> ''
        ))
        AND (@JURISDICCION IS NULL OR EXISTS (
          SELECT 1 FROM STRING_SPLIT(A.JURISDICCION, ',') s
          INNER JOIN #fJurisdiccion f ON LTRIM(RTRIM(s.value)) = f.VAL
          WHERE LTRIM(RTRIM(s.value)) <> ''
        ))
        AND (@RECURSO IS NULL OR EXISTS (
          SELECT 1 FROM STRING_SPLIT(A.RECURSO, ',') s
          INNER JOIN #fRecurso f ON LTRIM(RTRIM(s.value)) = f.VAL
          WHERE LTRIM(RTRIM(s.value)) <> ''
        ))
        AND (@OJURISDICCIONAL IS NULL OR EXISTS (
          SELECT 1 FROM STRING_SPLIT(A.OJURISDICCIONAL, ',') s
          INNER JOIN #fOJ f ON LTRIM(RTRIM(s.value)) = f.VAL
          WHERE LTRIM(RTRIM(s.value)) <> ''
        ))
        AND (@JVINCULANTE IS NULL OR EXISTS (
          SELECT 1 FROM STRING_SPLIT(A.JURISDICCIONV, ',') s
          INNER JOIN #fJVinculante f ON LTRIM(RTRIM(s.value)) = f.VAL
          WHERE LTRIM(RTRIM(s.value)) <> ''
        ))
        AND (@MAGISTRATES IS NULL OR EXISTS (
          SELECT 1 FROM STRING_SPLIT(A.MAGISTRATES, ',') s
          INNER JOIN #fMagistrates f ON LTRIM(RTRIM(s.value)) = f.VAL
          WHERE LTRIM(RTRIM(s.value)) <> ''
        ))
        AND (@TPONRMA IS NULL OR EXISTS (
          SELECT 1 FROM STRING_SPLIT(A.TPONRMA, ',') s
          INNER JOIN #fTpoNrma f ON LTRIM(RTRIM(s.value)) = f.VAL
          WHERE LTRIM(RTRIM(s.value)) <> ''
        ))
        AND (@OEMISOR IS NULL OR EXISTS (
          SELECT 1 FROM STRING_SPLIT(A.OEMISOR, ',') s
          INNER JOIN #fOEmisor f ON LTRIM(RTRIM(s.value)) = f.VAL
          WHERE LTRIM(RTRIM(s.value)) <> ''
        ))
        AND (@AMBIT IS NULL OR EXISTS (
          SELECT 1 FROM STRING_SPLIT(A.AMBIT, ',') s
          INNER JOIN #fAmbit f ON LTRIM(RTRIM(s.value)) = f.VAL
          WHERE LTRIM(RTRIM(s.value)) <> ''
        ))
        AND (@MATERIA IS NULL OR EXISTS (
          SELECT 1 FROM STRING_SPLIT(A.MATERIA, ',') s
          INNER JOIN #fMateria f ON LTRIM(RTRIM(s.value)) = f.VAL
          WHERE LTRIM(RTRIM(s.value)) <> ''
        ))
        -- KEYWORDS: comparar con KEYWORDS_N (normalizada) y #fKeywords
        AND (
          @KEYWORDS IS NULL
          OR EXISTS (
            SELECT 1 FROM #fKeywords k
            WHERE CHARINDEX(k.VAL, A.KEYWORDS_N) > 0
          )
        )
        -- NMRCN / TEMA / SUBTEMA / RTITLE: usar columnas normalizadas o simple LIKE
        AND (A.NMRCN LIKE '%' + @NMRCN + '%' OR @NMRCN IS NULL)
        AND (JURIS.RemoveHtmlTags(A.TEMA) LIKE '%' + @TEMA + '%' OR @TEMA IS NULL)
        AND (JURIS.RemoveHtmlTags(A.SUBTEMA) LIKE '%' + @SUBTEMA + '%' OR @SUBTEMA IS NULL)
        AND (A.RTITLE LIKE '%' + @RTITLE + '%' OR @RTITLE IS NULL)
        -- BÚSQUEDA GLOBAL: usar columnas normalizadas precomputadas
        AND (
          @GLOBAL IS NULL
          OR (
            @MODO = '3' AND (
              CHARINDEX(CAST(dbo.RemoveNonAlphanumeric(@GLOBAL) AS VARCHAR(500)), A.TITULO_N) > 0
              OR CHARINDEX(@GLOBAL, JURIS.RemoveHtmlTags(A.TEMA)) > 0
              OR CHARINDEX(@GLOBAL, JURIS.RemoveHtmlTags(A.SUBTEMA)) > 0
              OR CHARINDEX(CAST(dbo.RemoveNonAlphanumeric(@GLOBAL) AS VARCHAR(500)), A.CASO) > 0
                OR CHARINDEX(CAST(dbo.RemoveNonAlphanumeric(@GLOBAL) AS VARCHAR(500)), A.KEYWORDS_N) > 0
            )
            OR (@MODO = '2' AND EXISTS (
              SELECT 1 FROM #palabrasGlobal p
                  WHERE CHARINDEX(p.PAL, A.TITULO_N) > 0
                    OR CHARINDEX(p.PAL, A.RTITLE_N) > 0
                    OR CHARINDEX(p.PAL, A.RESUMEN_N) > 0
                    OR CHARINDEX(p.PAL, A.KEYWORDS_N) > 0
            ))
            OR (@MODO = '1' AND (
              -- All words must appear in at least one of the searchable normalized columns
              NOT EXISTS (
                SELECT 1 FROM #palabrasGlobal p
                WHERE CHARINDEX(p.PAL, A.TITULO_N) = 0
                  AND CHARINDEX(p.PAL, A.RTITLE_N) = 0
                  AND CHARINDEX(p.PAL, A.RESUMEN_N) = 0
                  AND CHARINDEX(p.PAL, A.KEYWORDS_N) = 0
              )
            ))
          )
        )
    )

    -- 5. PAGINACIÓN — solo ID + FCRCN, mínimo peso
    ,PAGINADO AS (
      SELECT
        ROW_NUMBER() OVER (
          ORDER BY
            CASE WHEN @ORDER = 'ASC'  THEN R.FCRCN END ASC,
            CASE WHEN @ORDER = 'DESC' THEN R.FCRCN END DESC
        ) AS RN,
        COUNT(*) OVER () AS TOTALROWS,
        R.ID,
        R.FCRCN
      FROM RESULTADOS R
    )

    -- 6. SELECT FINAL — enriquece solo la página actual (@nRows filas)
    SELECT
      P.RN,
      P.TOTALROWS,
      A.ID,
      IIF(A.RTITLE IN ('null',''), NULL, A.RTITLE) AS RTITLE,
      IIF(A.[TYPE] = 'legislations',
        LEFT(A.TITULO, CHARINDEX(',', A.TITULO + ',') - 1),
        A.TITULO) AS TITULO,
      A.FRESOLUTION,
      A.ENTRIEFILE,
      A.ENTRIEFILERESUMEN,
      A.[TYPE],
      A.CASO,
      ISNULL((
        SELECT B.DESCP
        FROM JURIS.FILTROS B WITH(NOLOCK)
        WHERE B.ID IN (SELECT TRY_CAST(value AS INT) FROM STRING_SPLIT(A.DELITO, ','))
        FOR JSON PATH
      ), '[]') AS DELITO,
      ISNULL((
        SELECT dbo.GetFullHierarchy(TRY_CAST(value AS INT)) AS DESCP
        FROM STRING_SPLIT(A.OJURISDICCIONAL, ',')
        FOR JSON PATH
      ), '[]') AS OJURISDICCIONAL,
      ISNULL((
        SELECT B.DESCP
        FROM JURIS.FILTROS B WITH(NOLOCK)
        WHERE B.ID IN (SELECT TRY_CAST(value AS INT) FROM STRING_SPLIT(A.OEMISOR, ','))
        FOR JSON PATH
      ), '[]') AS OEMISOR,
      ISNULL((
        SELECT B.DESCP
        FROM JURIS.FILTROS B WITH(NOLOCK)
        WHERE B.ID IN (SELECT TRY_CAST(value AS INT) FROM STRING_SPLIT(A.TPONRMA, ','))
        FOR JSON PATH
      ), '[]') AS TPONRMA,
      ISNULL((
        SELECT B.DESCP
        FROM JURIS.FILTROS B WITH(NOLOCK)
        WHERE B.ID IN (SELECT TRY_CAST(value AS INT) FROM STRING_SPLIT(A.RECURSO, ','))
        FOR JSON PATH
      ), '[]') AS RECURSO,
      A.ISBINDING AS INDICADOR,
      A.VDESIDENTE,
      A.CVOTE,
      A.RESUMEN,
      A.KEYWORDS,
      (
        SELECT STRING_AGG(CONCAT(ISNULL(M.APELLIDOS,''), ' ', ISNULL(M.NOMBRES,'')), ', ') AS LABEL
        FROM STRING_SPLIT(A.MAGISTRATES, ',') S
        INNER JOIN JURIS.MAGISTRADOS M WITH(NOLOCK) ON M.ID = CAST(S.value AS INT)
        FOR JSON PATH
      ) AS MAGISTRATES,
      (
        SELECT STRING_AGG(ISNULL(M.DESCP,''), ', ') AS LABEL
        FROM STRING_SPLIT(A.JURISDICCION, ',') S
        INNER JOIN JURIS.FILTROS M WITH(NOLOCK) ON M.ID = CAST(S.value AS INT)
        FOR JSON PATH
      ) AS JURISDICCION,
      (
        SELECT STRING_AGG(ISNULL(M.DESCP,''), ', ') AS LABEL
        FROM STRING_SPLIT(A.AMBIT, ',') S
        INNER JOIN JURIS.FILTROS M WITH(NOLOCK) ON M.ID = CAST(S.value AS INT)
        FOR JSON PATH
      ) AS AMBIT,
      A.TEMA,
      A.SUBTEMA,
      A.SHORTSUMMARY,
      A.NMRCN,
      A.BLOG,
      IIF(C.CDESTDO = 'A', C.ID, NULL) AS IDFAV,
      A.SITUACION,
      IIF(JC.ID IS NOT NULL, 1, 0) AS ISOPEN,
      ISNULL((
        SELECT
          S.ID,
          S.TITULO AS TITLE
        FROM JURIS.ENTRADA S WITH(NOLOCK)
        WHERE S.ID IN (
          SELECT TRY_CAST(LTRIM(RTRIM(value)) AS NUMERIC(15))
          FROM STRING_SPLIT(A.IDSVIN, ',')
          WHERE LTRIM(RTRIM(value)) <> ''
        )
        FOR JSON PATH
      ), '[]') AS JIDSVIN
    FROM
      PAGINADO P
    INNER JOIN RESULTADOS A ON A.ID = P.ID
    LEFT  JOIN JURIS.HISTORY_ENTRIES JC ON JC.IDENTRIE = A.ID
      AND JC.IDUSR = @IDUSR
    LEFT  JOIN JURIS.EFAVORITAS C WITH(NOLOCK)
      ON  C.IDENTRIE = A.ID
      AND C.IDUSER   = @IDUSR
    WHERE
      P.RN BETWEEN @nInit + 1 AND @nInit + @nRows
    ORDER BY
      P.RN;

    -- 7. LIMPIEZA: eliminar las tablas temporales que creamos
    DROP TABLE IF EXISTS #fDelito;
    DROP TABLE IF EXISTS #fJurisdiccion;
    DROP TABLE IF EXISTS #fRecurso;
    DROP TABLE IF EXISTS #fOJ;
    DROP TABLE IF EXISTS #fJVinculante;
    DROP TABLE IF EXISTS #fMagistrates;
    DROP TABLE IF EXISTS #fTpoNrma;
    DROP TABLE IF EXISTS #fOEmisor;
    DROP TABLE IF EXISTS #fAmbit;
    DROP TABLE IF EXISTS #fMateria;
    DROP TABLE IF EXISTS #fKeywords;
    DROP TABLE IF EXISTS #palabrasGlobal;
    DROP TABLE IF EXISTS #ENTRADA_MIN;

END
