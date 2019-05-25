Rails.application.routes.draw do
  get 'pages/index'
  root 'pages#index'

  namespace :api do
    namespace :v1 do
      resources :table, only: [:create] do
        collection do
          post 'pg_stats', action: :pg_stats, controller: :table
        end
      end

      post 'all_index_stats', action: :all_index_stats, controller: :index
    end
  end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
