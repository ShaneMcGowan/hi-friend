# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2023_12_30_101337) do
  create_table "people", force: :cascade do |t|
    t.string "first_name"
    t.string "last_name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "phone_number"
    t.datetime "date_of_birth"
    t.datetime "date_of_death"
    t.string "maiden_name"
    t.string "gender"
    t.integer "mother_id"
    t.integer "father_id"
  end

  create_table "relationships", force: :cascade do |t|
    t.string "relationship_type"
    t.string "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "is_id"
    t.integer "of_id"
  end

  add_foreign_key "people", "people", column: "father_id"
  add_foreign_key "people", "people", column: "mother_id"
end
