class Relationship < ApplicationRecord
  
  # relationship.is relationship.relationship_type relationship.of
  # e.g. Person is Parent of Person
  belongs_to :is, class_name: 'Person' # this is the subject of the relationship
  belongs_to :of, class_name: 'Person' # this is the object of the relationship

  validates :relationship_type, presence: true
  validates :notes, presence: true
end
