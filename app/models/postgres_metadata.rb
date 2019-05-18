class PostgresMetadata < ActiveRecord::Base
  def self.using_connection(url)
    @conn = PG::Connection.open(url)
    @array_decoder = PG::TextDecoder::Array.new
    @conn.type_map_for_results = PG::BasicTypeMapForResults.new @conn
    yield
    @conn.close
  end

  def self.tables
    @conn.exec(<<-SQL
      SELECT table_schema, table_name
      FROM information_schema.tables
      WHERE table_schema NOT IN ('information_schema', 'pg_catalog') ORDER BY 1, 2 desc;
    SQL
    )
  end

  PG_STATS_ARRAY_FIELDS = %w{most_common_vals most_common_freq histogram_bounds most_common_elems}
  def self.pg_stats(table:, schema:)
    query = <<-SQL
    SELECT s.*, c.data_type
    FROM pg_stats s
      JOIN information_schema.columns c
        ON s.schemaname = c.table_schema
        AND s.tablename = c.table_name AND s.attname = c.column_name
    WHERE schemaname = $1 and tablename = $2
    SQL
    result = @conn.exec_params(query, [schema, table])

    result.map do |row|
      PG_STATS_ARRAY_FIELDS.each do |field_name|
        row[field_name] = @array_decoder.decode(row[field_name])
      end

      row
    end
  end

  def self.pg_stat_user_tables(table:, schema:)
    query = <<-SQL
    SELECT *
    FROM pg_stat_user_tables
    WHERE schemaname = $1 and relname = $2
    SQL

    @conn.exec_params(query, [schema, table])
  end

  def self.pg_statio_user_tables(table:, schema:)
    query = <<-SQL
    SELECT *
    FROM pg_statio_user_tables
    WHERE schemaname = $1 and relname = $2
    SQL

    @conn.exec_params(query, [schema, table])
  end

  def self.index_stats(table:, schema:)
    query = <<-SQL
    SELECT
        ixs.indexname,
        c.reltuples AS num_rows,
        pg_size_pretty(pg_relation_size(quote_ident(indexrelname)::text)) AS index_size,
        CASE WHEN indisunique THEN 'Y'
           ELSE 'N'
        END AS UNIQUE,
        idx_scan AS number_of_scans,
        idx_tup_read AS tuples_read,
        idx_tup_fetch AS tuples_fetched,
        CASE when indisvalid THEN 'Y'
           ELSE 'N'
        END as valid,
        indexdef
    FROM pg_tables t
    LEFT OUTER JOIN pg_class c ON t.tablename=c.relname
    LEFT OUTER JOIN
        ( SELECT c.relname AS ctablename, ipg.relname AS indexname, x.indnatts AS number_of_columns, idx_scan, idx_tup_read, indisvalid, idx_tup_fetch, indexrelname, indisunique
              FROM pg_index x
              JOIN pg_class c ON c.oid = x.indrelid
              JOIN pg_class ipg ON ipg.oid = x.indexrelid
              JOIN pg_stat_all_indexes psai ON x.indexrelid = psai.indexrelid AND psai.schemaname = 'public' )
        AS foo
        ON t.tablename = foo.ctablename
    LEFT OUTER JOIN pg_indexes ixs ON t.tablename = ixs.tablename AND foo.indexname = ixs.indexname
    WHERE t.schemaname= $1 and t.tablename = $2
    ORDER BY 1,2;
    SQL
    @conn.exec_params(query, [schema, table])
  end
end
