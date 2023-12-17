class CreateRelationships < ActiveRecord::Migration[7.1]
  def change
    create_table :relationships do |t|
      t.string :relationship_type
      t.string :notes
      t.references :person, null: false, foreign_key: true

      t.timestamps
    end
  end
end
