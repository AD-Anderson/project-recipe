import React, {useState, useEffect} from "react";
import Header from "./components/Header";
import RecipeExcerpt from "./components/RecipeExcerpt";
import RecipeFull from "./components/RecipeFull";
import NewRecipeForm from "./components/NewRecipeForm";
import "./App.css";

function App() {
  const [recipes, setRecipes] = useState ([])
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [newRecipe, setNewRecipe] = useState({
      title: "",
      ingredients: "",
      instructions: "",
      servings: 1, // conservative default
      description: "",
      image_url: "https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" //default
  });

  const [showNewRecipeForm, setShowNewRecipeForm] = useState(false)

  

  useEffect(() => {
    const fetchAllRecipes = async () => {
      try {
        const response = await fetch("/api/recipes")
        if (response.ok){
          const data = await response.json()
          setRecipes(data)
        } else {
          console.log("Opps - could not fetch recipes!");
        }
      } catch(e) {
        console.error("An error occured during the request" , e)

      }
    };
    fetchAllRecipes()
  }, []);

  const handleNewRecipe = async (e, newRecipe) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/recipes" , {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newRecipe)

      })

      if (response.ok){
        const data = await response.json()

        setRecipes([...recipes, data.recipe])

        console.log("Recipe added successfully!")

        setShowNewRecipeForm(false)
        setNewRecipe({
        title: "",
        ingredients: "",
        instructions: "",
        servings: 1, // conservative default
        description: "",
        image_url: "https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" //default

        })
      }else {
        console.error("Opps- could not add recipe!")
      }

    } catch(e) {
      console.error("An error occurred during the request", e)
    }
  }

  const onUpdateForm = (e) => {
    const {name, value} = e.target
    setNewRecipe({...newRecipe, [name] : value})
  }

  const handleSelectRecipe = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleUnselectRecipe = () => {
    setSelectedRecipe(null);
  };

  const hideRecipeForm = () => {
    setShowNewRecipeForm(false)
  }

  const showRecipeForm = () => {
    setShowNewRecipeForm(true)
    setSelectedRecipe(null)
  }

  return (
    <div className='recipe-app'>
      <Header showRecipeForm={showRecipeForm}/>
      {showNewRecipeForm && ( <NewRecipeForm newRecipe={newRecipe} hideRecipeForm={hideRecipeForm} onUpdateForm={onUpdateForm} handleNewRecipe={handleNewRecipe}/>)}
      {selectedRecipe && <RecipeFull selectedRecipe={selectedRecipe} handleUnselectRecipe={handleUnselectRecipe} />}
      {!selectedRecipe && (
        <div className='recipe-list'>
          {recipes.map((recipe) => (
            <RecipeExcerpt key={recipe.id} recipe={recipe} handleSelectRecipe={handleSelectRecipe} />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
