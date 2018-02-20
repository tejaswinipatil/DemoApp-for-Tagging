Rails.application.routes.draw do
  resources :links
  devise_for :users
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

	root 'links#index'

  get 'tags/:tag', to: 'links#index', as: :tag

end
