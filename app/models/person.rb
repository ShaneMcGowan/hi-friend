class Person < ApplicationRecord
  # has_many :relationships, dependent: :destroy
  has_many :relationships, foreign_key: 'is_id', class_name: 'Relationship', dependent: :destroy # this is being retired

  belongs_to :mother, foreign_key: 'mother_id', class_name: 'Person', optional: true
  belongs_to :father, foreign_key: 'father_id', class_name: 'Person', optional: true
  # has_many :children, foreign_key: 'is_id', class_name: 'Relationship'

  validates :first_name, presence: true
  validates :last_name, presence: true, length: { maximum: 50 } # 50 is arbitrary
  # date_of_birth
  # date_of_death
  # maiden_name
  # gender
  # phone_number

  def full_name
    @full_name = first_name + ' ' + last_name

    if maiden_name.blank?
      @full_name
    else 
      @full_name + ' ' + '(formerly ' + first_name + ' ' + maiden_name + ')'
    end    
  end

  def children
    Person.where(mother_id: id).or(Person.where(father_id: id))
  end

  def siblings
    Person.where("mother_id = ? OR father_id = ?", self.mother_id, self.father_id).where.not(id: id)
  end

  def half_siblings
    maternal_half_siblings + paternal_half_siblings
  end

  def maternal_half_siblings
    Person.where("mother_id = ?", self.mother_id).where.not(father_id: father_id).where.not(id: id)
  end

  def paternal_half_siblings
    Person.where("father_id = ?", self.father_id).where.not(mother_id: mother_id).where.not(id: id)
  end
end
