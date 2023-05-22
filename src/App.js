import './App.css';
import React, { useState, useEffect } from "react";

function App() {
  // Meals är en array som kommer att användas för att spara 7 måltider som hämtas från Meal DBs API
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    async function fetchData() {
      // Ta kopia på state. Vi kommer att uppdatera kopian först och sedan kopiera kopian till riktigt state
      // React rekommenderar att man gör så i deras tutorial
      var updatedMeals = meals.slice();

      // Hämta 7 slumpmässiga recept. 
      // Desserter och side orders kommer att filteras bort eftersom vi skall visa middagsrätter
      var foundRecepies = 0;
      while(foundRecepies < 7) {
        const response = await fetch(
          "https://www.themealdb.com/api/json/v1/1/random.php"
        );
        const data = await response.json();
        console.log(data.meals[0].strCategory);
        if(data.meals[0].strCategory == 'Dessert' || data.meals[0].strCategory == 'Side') {
          // Vi skippar denna och hämtar en ny.
          continue;
        } 

        // Lägg namnet på veckodagen som receptet gäller för. 
        // Vi använder arrayindex (foundRecepies) för identifier dag
        switch (foundRecepies) {
          case 0:
            data.meals[0].weekDay = "Monday";
            break;
          case 1:
            data.meals[0].weekDay = "Tuesday";
            break;
          case 2:
            data.meals[0].weekDay = "Wednesday";
            break;
          case 3:
            data.meals[0].weekDay = "Thursday";
            break;
          case 4:
            data.meals[0].weekDay = "Friday";
            break;
          case 5:
            data.meals[0].weekDay = "Saturday";
            break;
          case 6:
            data.meals[0].weekDay = "Sunday";
            break;
          default:
            break;
        }
        // Lägg in måtiden i vår state kopia på rätt plats i arrayen
        updatedMeals[foundRecepies] = data.meals[0];
        foundRecepies++; //Stega fram en dag
      }

      // uppdatera state med vår kopia
      setMeals(updatedMeals);
    }

    fetchData();
  }, []);

  return (
    <div class="dinnerMenu">

      <h1>Your dinner meals this week</h1>
       {/* Loopa över varje måltid i meals state array */}
      {meals.map((meal, index) => (
        <div class="dinnerMeal">
          <h2>{meal.weekDay}</h2>
          <h3>{meal.strMeal}.</h3> {/* Namn på recept */}
          <p> Category {meal.strCategory}</p>
          <img
            src={meal.strMealThumb}
            alt={meal.weekDay}
            width="400"
            height="400"
          />
          <p>
            Full recipie :{" "}
            <a href={meal.strSource} target="_blank">
              {meal.strMeal}
            </a>
          </p>
          {/* if sats som kollar oom det finns en youtube video. Skippa Youtube sektionen helt om video saknas */}
          {meal.strYoutube &&
          <p> 
            Youtube Video:{" "}
          <a href={meal.strYoutube} target="_blank">
            Video Link
          </a>
          </p>
          }
        </div>
      ))}
    </div>
  );
}

export default App;