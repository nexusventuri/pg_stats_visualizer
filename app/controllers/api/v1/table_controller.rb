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
    pg_stats = []
    pg_stat_user_tables = {}
    pg_statio_user_tables = {}
    index_stats = []
    PostgresMetadata.using_connection(url) do
      pg_stats = PostgresMetadata.pg_stats(table: table, schema: schema).to_a
      pg_stat_user_tables = PostgresMetadata.pg_stat_user_tables(table: table, schema: schema).first
      pg_statio_user_tables = PostgresMetadata.pg_statio_user_tables(table: table, schema: schema).first
      index_stats = PostgresMetadata.index_stats(table: table, schema: schema)
    end

    render json: {pg_stats: pg_stats, pg_stat_user_tables: pg_stat_user_tables, pg_statio_user_tables: pg_statio_user_tables, index_stats: index_stats}
  end
end
