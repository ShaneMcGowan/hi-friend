class Person < ApplicationRecord
  has_many :relationships
  
  validates :first_name, presence: true
  validates :last_name, presence: true, length: { maximum: 50 } # 50 is arbitrary

  def full_name
    first_name + ' ' + last_name
  end
end
