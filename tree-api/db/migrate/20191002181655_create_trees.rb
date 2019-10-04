class CreateTrees < ActiveRecord::Migration[6.0]
  def change
    create_table :trees do |t|
      t.string :tree_type
      t.references :user
      t.integer :water, default: 0

      t.timestamps
    end
  end
end
