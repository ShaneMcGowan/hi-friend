class AddMaidenNameToPerson < ActiveRecord::Migration[7.1]
  def change
    add_column :people, :maiden_name, :string
  end
end
