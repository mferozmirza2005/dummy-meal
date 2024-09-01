import { Delete, Star } from "@mui/icons-material";
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [activePosition, setActivePosition] = useState("10");
  const [weekDisable, setWeekDisable] = useState(false);
  const [currentTab, setCurrentTab] = useState(null);
  const [scrolled, setScrolled] = useState(0);
  const [showWeek, setShowWeek] = useState(false);
  const [selectWeek, setSelectWeek] = useState();
  const [mealData, setMealData] = useState(null);
  const [tempMeals, setTempMeals] = useState([]);
  const [weeks, setWeeks] = useState({
    0: [],
    1: [],
    2: [],
    3: [],
  });

  useEffect(()=>{
    window.addEventListener("scroll", ()=>{
      setScrolled(window.scrollY);
    })
  }, [])

  useEffect(() => {
    if (mealData) return;
    axios.get("https://dummyjson.com/recipes").then(async (res) => {
      await setMealData(res.data);
    });
  }, [mealData]);

  const addMeal = (meal) => {
    setTempMeals((prevMeals) => {
      const isMealInArray = prevMeals.some(
        (tempMeal) => tempMeal.id === meal.id
      );
      if (isMealInArray) {
        return prevMeals;
      }
      return [...prevMeals, meal];
    });
  };

  const saveWeek = async () => {
    if (tempMeals.length <= 0) return;
    setWeeks((prevWeeks) => ({
      ...prevWeeks,
      [selectWeek]: [...prevWeeks[selectWeek], ...tempMeals],
    }));
    const tempMealIds = new Set(tempMeals.map((tempMeal) => tempMeal.id));
    const latestMeals = mealData.recipes.filter(
      (meal) => !tempMealIds.has(meal.id)
    );
    setMealData({ recipes: latestMeals });
    setTempMeals([]);
    setShowWeek(false);
  };

  const removeMeal = (mealId, week) => {
    const newWeekData = weeks[week].filter((meal) => meal.id !== mealId);
    const mealToAdd = weeks[week].find((meal) => meal.id === mealId);
    console.log(mealToAdd);

    setMealData((prevData) => ({
      recipes: mealToAdd 
        ? [...prevData.recipes, mealToAdd] 
        : prevData.recipes
    }));

    setWeeks((prevWeeks) => ({
      ...prevWeeks,
      [week]: newWeekData
    }));
  };

  return (
    <div className="relative bg-neutral-100">
      <header className="bg-[url(./pizza.jpg)] bg-cover bg-center w-full h-[40vh]">
        <div className="w-full h-full bg-white bg-opacity-70 flex flex-col justify-center items-center">
          <h1 className="text-[48px] font-bold py-5">Optimized Your Meal</h1>
          <p className="text-sm">
            Select the meal to add in week. You will be able to added, modify
            and change the meal week.
          </p>
        </div>
      </header>
      <section className="container mx-auto my-6">
        <h1 className="text-[28px] font-bold mb-4">Week Orders</h1>
        <div className={`flex justify-around items-center z-50 bg-white ${scrolled !== null && scrolled > 350 && "fixed top-0 left-0 right-0 py-5"}`}>
          <ul className="w-[55%] flex justify-evenly font-bold relative">
            <li
              onClick={() => {
                setActivePosition("10");
                setWeekDisable(false);
                setCurrentTab(null);
              }}
              className="cursor-pointer"
            >
              All Meals
            </li>
            <li
              onClick={() => {
                setActivePosition("28");
                setWeekDisable(true);
                setCurrentTab(0);
              }}
              className="cursor-pointer"
            >
              Week 1
            </li>
            <li
              onClick={() => {
                setActivePosition("45.5");
                setWeekDisable(true);
                setCurrentTab(1);
              }}
              className="cursor-pointer"
            >
              Week 2
            </li>
            <li
              onClick={() => {
                setActivePosition("63.5");
                setWeekDisable(true);
                setCurrentTab(2);
              }}
              className="cursor-pointer"
            >
              Week 3
            </li>
            <li
              onClick={() => {
                setActivePosition("81.3");
                setWeekDisable(true);
                setCurrentTab(3);
              }}
              className="cursor-pointer"
            >
              Week 4
            </li>
            <div
              style={{ left: `${activePosition}%` }}
              className={`absolute w-[10%] h-1.5 rounded-lg -bottom-3 bg-slate-800 transition-all duration-200`}
            ></div>
          </ul>
          <button
            className="bg-sky-900 disabled:bg-gray-500 text-white font-bold px-8 py-3 mx-4 rounded-md"
            disabled={weekDisable}
            onClick={() => setShowWeek(true)}
          >
            Add to Week
          </button>
        </div>
      </section>
      <section className="container mx-auto my-4">
        <div className="grid grid-cols-3">
          {currentTab === null &&
            mealData !== null &&
            mealData.recipes.map((meal) => (
              <div
                key={meal.id}
                onClick={() => addMeal(meal)}
                className={`relative bg-white m-5 rounded-lg border-2 ${
                  tempMeals.some((tempMeal) => tempMeal.id === meal.id)
                    ? "border-blue-900"
                    : "border-white"
                }`}
              >
                <span className="absolute bg-black text-white text-sm px-8 py-1.5 top-8 right-10 rounded-md">
                  {meal.mealType}
                </span>
                <img
                  src={meal.image}
                  alt=""
                  className="w-[85%] mx-auto my-6 h-auto rounded-lg"
                />
                <h3 className="mx-8 text-xl font-bold">{meal.name}</h3>
                <p className="mx-8 py-3 mb-10">
                  {meal.instructions.join(" ").trim()}
                </p>
                <div className="flex justify-between items-center text-sm mx-8 absolute bottom-4">
                  <span>
                    <b>Cuisine:</b> {meal.cuisine}
                  </span>
                  <span className="flex justify-between items-center">
                    <b>Rating:</b> {meal.rating}{" "}
                    <div className="flex space-x-0.5">
                      <Star className="w-6 h-6 text-sky-900" />
                      <Star className="w-6 h-6 text-sky-900" />
                      <Star className="w-6 h-6 text-sky-900" />
                      <Star className="w-6 h-6 text-sky-900" />
                    </div>
                  </span>
                </div>
              </div>
            ))}
          {currentTab === 0 &&
            weeks[0].map((meal) => (
              <div
                key={meal.id}
                onClick={() => addMeal(meal)}
                className={`relative bg-white m-5 rounded-lg border-2 ${
                  tempMeals.some((tempMeal) => tempMeal.id === meal.id)
                    ? "border-blue-900"
                    : "border-white"
                }`}
              >
                <span
                  className="absolute bg-red-400 cursor-pointer bg-opacity-50 text-red-600 text-sm p-1.5 top-8 left-10"
                  onClick={() => removeMeal(meal.id, 0)}
                >
                  <Delete />
                </span>
                <span className="absolute bg-black text-white text-sm px-8 py-1.5 top-8 right-10 rounded-md">
                  {meal.mealType}
                </span>
                <img
                  src={meal.image}
                  alt=""
                  className="w-[85%] mx-auto my-6 h-auto rounded-lg"
                />
                <h3 className="mx-8 text-xl font-bold">{meal.name}</h3>
                <p className="mx-8 py-3 mb-10">
                  {meal.instructions.join(" ").trim()}
                </p>
                <div className="flex justify-between items-center text-sm mx-8 absolute bottom-4">
                  <span>
                    <b>Cuisine:</b> {meal.cuisine}
                  </span>
                  <span className="flex justify-between items-center">
                    <b>Rating:</b> {meal.rating}{" "}
                    <div className="flex space-x-0.5">
                      <Star className="w-6 h-6 text-sky-900" />
                      <Star className="w-6 h-6 text-sky-900" />
                      <Star className="w-6 h-6 text-sky-900" />
                      <Star className="w-6 h-6 text-sky-900" />
                    </div>
                  </span>
                </div>
              </div>
            ))}
          {currentTab === 1 &&
            weeks[1].map((meal) => (
              <div
                key={meal.id}
                onClick={() => addMeal(meal)}
                className={`relative bg-white m-5 rounded-lg border-2 ${
                  tempMeals.some((tempMeal) => tempMeal.id === meal.id)
                    ? "border-blue-900"
                    : "border-white"
                }`}
              >
                <span
                  className="absolute bg-red-400 bg-opacity-50 text-red-600 text-sm p-1.5 top-8 left-10"
                  onClick={() => removeMeal(meal.id, 1)}
                >
                  <Delete />
                </span>
                <span className="absolute bg-black text-white text-sm px-8 py-1.5 top-8 right-10 rounded-md">
                  {meal.mealType}
                </span>
                <img
                  src={meal.image}
                  alt=""
                  className="w-[85%] mx-auto my-6 h-auto rounded-lg"
                />
                <h3 className="mx-8 text-xl font-bold">{meal.name}</h3>
                <p className="mx-8 py-3 mb-10">
                  {meal.instructions.join(" ").trim()}
                </p>
                <div className="flex justify-between items-center text-sm mx-8 absolute bottom-4">
                  <span>
                    <b>Cuisine:</b> {meal.cuisine}
                  </span>
                  <span className="flex justify-between items-center">
                    <b>Rating:</b> {meal.rating}{" "}
                    <div className="flex space-x-0.5">
                      <Star className="w-6 h-6 text-sky-900" />
                      <Star className="w-6 h-6 text-sky-900" />
                      <Star className="w-6 h-6 text-sky-900" />
                      <Star className="w-6 h-6 text-sky-900" />
                    </div>
                  </span>
                </div>
              </div>
            ))}
          {currentTab === 2 &&
            weeks[2].map((meal) => (
              <div
                key={meal.id}
                onClick={() => addMeal(meal)}
                className={`relative bg-white m-5 rounded-lg border-2 ${
                  tempMeals.some((tempMeal) => tempMeal.id === meal.id)
                    ? "border-blue-900"
                    : "border-white"
                }`}
              >
                <span
                  className="absolute bg-red-400 bg-opacity-50 text-red-600 text-sm p-1.5 top-8 left-10"
                  onClick={() => removeMeal(meal.id, 2)}
                >
                  <Delete />
                </span>
                <span className="absolute bg-black text-white text-sm px-8 py-1.5 top-8 right-10 rounded-md">
                  {meal.mealType}
                </span>
                <img
                  src={meal.image}
                  alt=""
                  className="w-[85%] mx-auto my-6 h-auto rounded-lg"
                />
                <h3 className="mx-8 text-xl font-bold">{meal.name}</h3>
                <p className="mx-8 py-3 mb-10">
                  {meal.instructions.join(" ").trim()}
                </p>
                <div className="flex justify-between items-center text-sm mx-8 absolute bottom-4">
                  <span>
                    <b>Cuisine:</b> {meal.cuisine}
                  </span>
                  <span className="flex justify-between items-center">
                    <b>Rating:</b> {meal.rating}{" "}
                    <div className="flex space-x-0.5">
                      <Star className="w-6 h-6 text-sky-900" />
                      <Star className="w-6 h-6 text-sky-900" />
                      <Star className="w-6 h-6 text-sky-900" />
                      <Star className="w-6 h-6 text-sky-900" />
                    </div>
                  </span>
                </div>
              </div>
            ))}
          {currentTab === 3 &&
            weeks[3].map((meal) => (
              <div
                key={meal.id}
                onClick={() => addMeal(meal)}
                className={`relative bg-white m-5 rounded-lg border-2 ${
                  tempMeals.some((tempMeal) => tempMeal.id === meal.id)
                    ? "border-blue-900"
                    : "border-white"
                }`}
              >
                <span
                  className="absolute bg-red-400 bg-opacity-50 text-red-600 text-sm p-1.5 top-8 left-10"
                  onClick={() => removeMeal(meal.id, 3)}
                >
                  <Delete />
                </span>
                <span className="absolute bg-black text-white text-sm px-8 py-1.5 top-8 right-10 rounded-md">
                  {meal.mealType}
                </span>
                <img
                  src={meal.image}
                  alt=""
                  className="w-[85%] mx-auto my-6 h-auto rounded-lg"
                />
                <h3 className="mx-8 text-xl font-bold">{meal.name}</h3>
                <p className="mx-8 py-3 mb-10">
                  {meal.instructions.join(" ").trim()}
                </p>
                <div className="flex justify-between items-center text-sm mx-8 absolute bottom-4">
                  <span>
                    <b>Cuisine:</b> {meal.cuisine}
                  </span>
                  <span className="flex justify-between items-center">
                    <b>Rating:</b> {meal.rating}{" "}
                    <div className="flex space-x-0.5">
                      <Star className="w-6 h-6 text-sky-900" />
                      <Star className="w-6 h-6 text-sky-900" />
                      <Star className="w-6 h-6 text-sky-900" />
                      <Star className="w-6 h-6 text-sky-900" />
                    </div>
                  </span>
                </div>
              </div>
            ))}
        </div>
      </section>
      {showWeek && (
        <div className="fixed top-0 right-0 bottom-0 left-0 bg-black bg-opacity-55 flex justify-center items-center">
          <div className="bg-white px-8 py-10 rounded-lg text-center">
            <h1 className="text-xl font-bold">Select Week</h1>
            <ul className="my-6 flex justify-between items-center">
              <li
                className={`mx-2 ${
                  selectWeek === 0
                    ? "bg-blue-900 text-white"
                    : "bg-gray-200 text-black"
                } px-3 py-1.5 text-bold rounded cursor-pointer`}
                onClick={() => setSelectWeek(0)}
              >
                Week 1
              </li>
              <li
                className={`mx-2 ${
                  selectWeek === 1
                    ? "bg-blue-900 text-white"
                    : "bg-gray-200 text-black"
                } px-3 py-1.5 text-bold rounded cursor-pointer`}
                onClick={() => setSelectWeek(1)}
              >
                Week 2
              </li>
              <li
                className={`mx-2 ${
                  selectWeek === 2
                    ? "bg-blue-900 text-white"
                    : "bg-gray-200 text-black"
                } px-3 py-1.5 text-bold rounded cursor-pointer`}
                onClick={() => setSelectWeek(2)}
              >
                Week 3
              </li>
              <li
                className={`mx-2 ${
                  selectWeek === 3
                    ? "bg-blue-900 text-white"
                    : "bg-gray-200 text-black"
                } px-3 py-1.5 text-bold rounded cursor-pointer`}
                onClick={() => setSelectWeek(3)}
              >
                Week 4
              </li>
            </ul>
            <button
              onClick={saveWeek}
              className="text-white text-sm font-bold bg-sky-900 rounded-md mt-4 px-8 py-1.5"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
