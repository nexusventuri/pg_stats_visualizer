class PostgresMetadata < ActiveRecord::Base
  def self.using_connection(url)
    @conn = PG::Connection.open(url)
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

    @conn.exec_params(query, [schema, table])
  end
end
