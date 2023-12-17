class AddDateOfDeathToPerson < ActiveRecord::Migration[7.1]
  def change
    add_column :people, :date_of_death, :datetime
  end
end
