class Api::V1::TableController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create
    sleep 5;
  end
end
