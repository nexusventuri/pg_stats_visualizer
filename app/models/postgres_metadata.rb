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

  PG_STATS_ARRAY_FIELDS = %w{most_common_vals most_common_freq histogram_bounds most_common_elems most_common_elem_freq elem_count_histogram}
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
end
