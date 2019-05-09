class PostgresMetadata < ActiveRecord::Base
  def self.using_connection(url)
    @conn = PG::Connection.open(url)
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

  def self.pg_stats(table:, schema:)
    query = <<-SQL
    SELECT *
    FROM pg_stats
    WHERE schemaname = $1 and tablename = $2
    SQL

    result = @conn.exec_params(query, [schema, table])
    decoder = PG::TextDecoder::Array.new

    result.map do |row|
      row['most_common_vals'] = decoder.decode(row['most_common_vals'])
      row['most_common_freq'] = decoder.decode(row['most_common_freq'])
      row['histogram_bounds'] = decoder.decode(row['histogram_bounds'])
      row['most_common_elems'] = decoder.decode(row['most_common_elems'])
      row['most_common_elem_freq'] = decoder.decode(row['most_common_elem_freq'])
      row['elem_count_histogram'] = decoder.decode(row['elem_count_histogram'])
      row
    end
  end
end
