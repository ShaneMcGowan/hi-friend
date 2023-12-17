class AddPhoneNumberToPerson < ActiveRecord::Migration[7.1]
  def change
    add_column :people, :phone_number, :string
  end
end
