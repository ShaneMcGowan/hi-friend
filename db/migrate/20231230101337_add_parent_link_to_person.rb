class AddParentLinkToPerson < ActiveRecord::Migration[7.1]
  def change
    # reference to the same table (people) for the mother column
    add_column :people, :mother_id, :integer, null: true
    add_foreign_key :people, :people, column: :mother_id
    # same again for father
    add_column :people, :father_id, :integer, null: true
    add_foreign_key :people, :people, column: :father_id
  end
end
