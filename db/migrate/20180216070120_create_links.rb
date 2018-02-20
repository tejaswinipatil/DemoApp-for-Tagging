class CreateLinks < ActiveRecord::Migration[5.1]
  def change
    create_table :links do |t|
      t.string :link_url
      t.string :subject

      t.timestamps
    end
  end
end
