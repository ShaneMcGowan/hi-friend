class Relationship < ApplicationRecord
  belongs_to :person

  validates :relationship_type, presence: true
  validates :notes, presence: true

  # this should be 
  # X is Y of Z
  # e.g. Person is Father of Person

  # def description
  # relationship.is relationship.relationship_type relationship.of
  # end
end
