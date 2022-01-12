import React, { useEffect, useState, useCallback } from "react";

import Card from "../UI/Card";
import classes from "./AvailableMeals.module.css";
import MealItem from "./MealItem/MealItem";

const AvailableMeals = () => {
	const [meals, setMeals] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchMealsHandler = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await fetch(
				"https://react-http-d6d36-default-rtdb.firebaseio.com/meals.json",
			);
			if (!response.ok) {
				throw new Error("Something went wrong!");
			}
			const data = await response.json();

			const loadedMeals = [];

			for (const key in data) {
				loadedMeals.push({
					id: key,
					name: data[key].name,
					description: data[key].description,
					price: data[key].price,
				});
			}
			setMeals(loadedMeals);
		} catch (error) {
			setError(error.message);
		}
		setIsLoading(false);
	}, []);

	useEffect(() => {
		fetchMealsHandler();
	}, [fetchMealsHandler]);

	let content = <p>Found no meals.</p>;

	if (isLoading) {
		content = <p>Loading...</p>;
	}

	if (meals.length > 0) {
		content = meals.map((meal) => (
			<MealItem
				id={meal.id}
				key={meal.id}
				name={meal.name}
				description={meal.description}
				price={meal.price}
			>
				{meal.name}
			</MealItem>
		));
	}

	if (error) {
		content = <p>{error}</p>;
	}
	
	return (
		<section className={classes.meals}>
			<Card>
				<ul>{content}</ul>
			</Card>
		</section>
	);
};

export default AvailableMeals;
