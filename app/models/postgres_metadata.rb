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
    byebug
  end
end
