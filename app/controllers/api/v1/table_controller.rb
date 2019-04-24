class Api::V1::TableController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create
    url = params['databaseUrl']

    PostgresMetadata.use_connection(url)

    render json: PostgresMetadata.tables.to_a
  end

  def find_metadata
    table_and_schema_params = params.permit(:table, :schema)

    PostgresMetadata.pg_stats(table_and_schema_params)
  end
end
