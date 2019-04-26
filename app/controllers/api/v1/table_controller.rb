class Api::V1::TableController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create
    url = params['databaseUrl']

    PostgresMetadata.use_connection(url)

    render json: PostgresMetadata.tables.to_a
  end

  def pg_stats
    table, schema, url = params.permit(:table, :schema, :databaseUrl).values
    PostgresMetadata.use_connection(url)

    render json: PostgresMetadata.pg_stats(table: table, schema: schema).to_a
  end
end
