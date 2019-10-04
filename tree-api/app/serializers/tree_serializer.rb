class TreeSerializer < ActiveModel::Serializer
  attributes :id, :tree_type, :user_id, :water
end
