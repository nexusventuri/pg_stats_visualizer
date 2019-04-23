class Api::V1::TableController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create
    url = params['databaseUrl']

    ActiveRecord::Base.establish_connection(url)

    conn = ActiveRecord::Base.connection

    result = conn.execute(<<-SQL
      SELECT table_schema, table_name
      FROM information_schema.tables
      WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
      ORDER BY 1, 2 desc;
    SQL
    )

    render json: result.to_a
  end
end
