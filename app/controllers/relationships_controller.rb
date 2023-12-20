class RelationshipsController < ApplicationController
  def create
    @person = Person.find(params[:person_id])

    @relationship = Relationship.new(
      is: @person,
      of: nil, # TODO
      relationship_type: relationship_params[:relationship_type],
      notes: relationship_params[:notes],
    )

    @relationship.save
    redirect_to person_path(@person)
  end

  def destroy
    @person = Person.find(params[:person_id])
    @relationship = Relationship.find(params[:id])
    @relationship.destroy
    redirect_to person_path(@person)
  end

  private def relationship_params
    params.require(:relationship).permit(:relationship_type, :notes)
  end

end
