class TreesController < ApplicationController

    def create
        tree = Tree.create(tree_type:params[:tree_type], user_id:params[:user_id])
        render json: tree
    end

    def update
        tree = Tree.find_by(id:params[:id])
        tree.water = params[:water]
        tree.save
        
        render json: tree
    end

    def destroy
        tree = Tree.find_by(id:params[:id])
        tree.delete
    end
  
end
