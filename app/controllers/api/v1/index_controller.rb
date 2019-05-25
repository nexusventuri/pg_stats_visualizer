class Api::V1::IndexController < ApplicationController
  skip_before_action :verify_authenticity_token

  def all_index_stats
    url = params.permit(:databaseUrl).values
    stats = []
    PostgresMetadata.using_connection(url) do
      stats = PostgresMetadata.all_index_stats_by_range(0, 10)
    end

    render json: {index_stats_by_range: stats}
  end
end
