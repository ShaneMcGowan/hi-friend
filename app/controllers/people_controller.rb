class PeopleController < ApplicationController
  def index
    @people = Person.all
  end

  def show 
    @person = Person.find(params[:id])
  end

  def new 
    @person = Person.new
  end

  def create
    @person = Person.new(person_params)

    if @person.save
      redirect_to @person
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
    @person = Person.find(params[:id])
  end

  def update
    @person = Person.find(params[:id])

    if @person.update(person_params)
      redirect_to @person
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @person = Person.find(params[:id])
    @person.destroy

    redirect_to root_path, status: :see_other
  end

  private 
  def person_params
    params.require(:person).permit(:first_name, :last_name, :maiden_name, :gender, :date_of_birth, :date_of_death, :phone_number)
  end
end
