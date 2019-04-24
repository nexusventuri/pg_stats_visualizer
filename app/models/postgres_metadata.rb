class PostgresMetadata < ActiveRecord::Base
  def self.use_connection(url)
    ActiveRecord::Base.establish_connection(url)
  end

  def self.tables
    self.connection.execute(<<-SQL
      SELECT table_schema, table_name
      FROM information_schema.tables
      WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
      ORDER BY 1, 2 desc;
    SQL
    )
  end

  def self.pg_stats(table:, schema:)
    query = <<-SQL
    SELECT *
    FROM pg_stats
    WHERE schemaname = ? and tablename = ?
    SQL

    self.connection.exec_query(sanitize_sql_for_conditions([query, table, schema]))
  end
end
