class Link < ApplicationRecord
	acts_as_taggable


def self.search(search)
  if search
    where('link_url LIKE ?', "%#{search}%")
  else
  	Link.all
  end
end


end
