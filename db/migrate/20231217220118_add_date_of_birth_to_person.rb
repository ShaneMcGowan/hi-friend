class AddDateOfBirthToPerson < ActiveRecord::Migration[7.1]
  def change
    add_column :people, :date_of_birth, :datetime
  end
end
