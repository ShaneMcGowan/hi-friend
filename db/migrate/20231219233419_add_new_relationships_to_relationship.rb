class AddNewRelationshipsToRelationship < ActiveRecord::Migration[7.1]
  def change
    add_column :relationships, :is_id, :integer
    add_column :relationships, :of_id, :integer
    remove_column :relationships, :person_id
  end
end
