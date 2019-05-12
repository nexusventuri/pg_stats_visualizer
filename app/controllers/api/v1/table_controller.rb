class Api::V1::TableController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create
    url = params['databaseUrl']
    data = []
    PostgresMetadata.using_connection(url) do
      data = PostgresMetadata.tables.to_a
    end

    render json: data
  end

  def pg_stats
    table, schema, url = params.permit(:table, :schema, :databaseUrl).values
    data = {}
    PostgresMetadata.using_connection(url) do
      data = PostgresMetadata.pg_stats(table: table, schema: schema).to_a
    end

    render json: data
  end
end
