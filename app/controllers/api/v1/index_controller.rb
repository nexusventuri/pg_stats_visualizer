class Api::V1::IndexController < ApplicationController
  skip_before_action :verify_authenticity_token

  def all_index_stats
    url = params.permit(:databaseUrl).values.first
    stats = []
    PostgresMetadata.using_connection(url) do
      stats = PostgresMetadata.all_index_stats
    end

    render json: {all_index_stats: stats}
  end
end
