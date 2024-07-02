from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///recipes.db'
db = SQLAlchemy(app)


class Recipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    ingredients = db.Column(db.String(500), nullable=False)
    instructions = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text, nullable=True,
                            default='Delicious. You need to try it!')
    image_url = db.Column(db.String(500), nullable=True,
                          default="https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")
    servings = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f"Recipe(id={self.id}, title='{self.title}', description='{self.description}', servings={self.servings})"

# Uncomment this block to create the database and tables initially
# with app.app_context():
#     db.create_all()
#     db.session.commit()


@app.route('/api/recipes', methods=['GET'])
def get_all_recipes():
    recipes = Recipe.query.all()
    recipe_list = []
    for recipe in recipes:
        recipe_list.append({
            'id': recipe.id,
            'title': recipe.title,
            'ingredients': recipe.ingredients,
            'instructions': recipe.instructions,
            'description': recipe.description,
            'image_url': recipe.image_url,
            'servings': recipe.servings
        })
    return jsonify(recipe_list)


@app.route('/api/recipes', methods=['POST'])
def add_recipe():
    data = request.get_json()
    required_fields = ['title', 'ingredients', 'instructions', 'servings']

    missing_field_response = check_required_fields(data, required_fields)
    if missing_field_response:
        return missing_field_response

    new_recipe = Recipe(
        title=data['title'],
        ingredients=data['ingredients'],
        instructions=data['instructions'],
        servings=data['servings'],
        description=data.get('description', 'Delicious. You need to try it!'),
        image_url=data.get(
            'image_url', "https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")
    )

    db.session.add(new_recipe)
    db.session.commit()

    new_recipe_data = {
        'id': new_recipe.id,
        'title': new_recipe.title,
        'ingredients': new_recipe.ingredients,
        'instructions': new_recipe.instructions,
        'servings': new_recipe.servings,
        'description': new_recipe.description,
        'image_url': new_recipe.image_url
    }

    return jsonify({'message': 'Recipe added successfully', 'recipe': new_recipe_data})


def check_required_fields(data, required_fields):
    for field in required_fields:
        if field not in data or data[field] == "":
            return jsonify({'error': f"Missing required field: '{field}'"}), 400


if __name__ == '__main__':
    app.run(debug=True)
