class Person < ApplicationRecord
  # has_many :relationships, dependent: :destroy
  has_many :relationships, foreign_key: 'is_id', class_name: 'Relationship', dependent: :destroy

  
  validates :first_name, presence: true
  validates :last_name, presence: true, length: { maximum: 50 } # 50 is arbitrary
  # date_of_birth
  # date_of_death
  # maiden_name
  # gender
  # phone_number

  def full_name
    @full_name = first_name + ' ' + last_name

    if maiden_name
      @full_name + ' ' + '(formerly ' + first_name + ' ' + maiden_name + ')'
    else 
      @full_name
    end
    
  end
end
