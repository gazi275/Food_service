import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  RestaurantFormSchema,
  restaurantFromSchema,
} from "@/schema/restaurantSchema";
import { useRestaurantStore } from "@/store/useRestaurantStore";

import { FormEvent, useEffect, useState } from "react";

const Restaurant = () => {
  const [input, setInput] = useState<RestaurantFormSchema>({
    restaurantName: "",
    city: "",
    country: "",
    deliveryTime: 0,
    cuisines: [],
    imageFile: undefined,
  });
  const [errors, setErrors] = useState<Partial<RestaurantFormSchema>>({});

  const {
    
    restaurant,
    updateRestaurant,
    createRestaurant,
    getRestaurant,
  } = useRestaurantStore();

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setInput({ ...input, [name]: type === "number" ? Number(value) : value });
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = restaurantFromSchema.safeParse(input);
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setErrors(fieldErrors as Partial<RestaurantFormSchema>);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("restaurantName", input.restaurantName);
      formData.append("city", input.city);
      formData.append("country", input.country);
      formData.append("deliveryTime", input.deliveryTime.toString());
      formData.append("cuisines", JSON.stringify(input.cuisines));

      if (input.imageFile) {
        formData.append("imageFile", input.imageFile);
      }

      if (restaurant) {
        // Update existing restaurant
        await updateRestaurant(formData);
      } else {
        // Create new restaurant
        await createRestaurant(formData);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  useEffect(() => {
    const fetchRestaurant = async () => {
      await getRestaurant();
      if (restaurant) {
        setInput({
          restaurantName: restaurant.restaurantName || "",
          city: restaurant.city || "",
          country: restaurant.country || "",
          deliveryTime: restaurant.deliveryTime || 0,
          cuisines: restaurant.cuisines || [],
          imageFile: undefined,
        });
      }
    };

    fetchRestaurant();
  }, [getRestaurant, restaurant]);

  return (
    <div className="max-w-6xl mx-auto my-10">
      <h1 className="font-extrabold text-2xl mb-5">Add Restaurants</h1>
      <form onSubmit={submitHandler}>
        <div className="md:grid grid-cols-2 gap-6 space-y-2 md:space-y-0">
          {/* Restaurant Name */}
          <div>
            <Label>Restaurant Name</Label>
            <Input
              type="text"
              name="restaurantName"
              value={input.restaurantName}
              onChange={changeEventHandler}
              placeholder="Enter your restaurant name"
            />
            {errors.restaurantName && (
              <span className="text-xs text-red-600 font-medium">
                {errors.restaurantName}
              </span>
            )}
          </div>
          <div>
            <Label>City</Label>
            <Input
              type="text"
              name="city"
              value={input.city}
              onChange={changeEventHandler}
              placeholder="Enter your city name"
            />
            {errors.city && (
              <span className="text-xs text-red-600 font-medium">
                {errors.city}
              </span>
            )}
          </div>
          <div>
            <Label>Country</Label>
            <Input
              type="text"
              name="country"
              value={input.country}
              onChange={changeEventHandler}
              placeholder="Enter your country name"
            />
            {errors.country && (
              <span className="text-xs text-red-600 font-medium">
                {errors.country}
              </span>
            )}
          </div>
          <div>
            <Label>Delivery Time</Label>
            <Input
              type="number"
              name="deliveryTime"
              value={input.deliveryTime}
              onChange={changeEventHandler}
              placeholder="Enter your delivery time"
            />
            {errors.deliveryTime && (
              <span className="text-xs text-red-600 font-medium">
                {errors.deliveryTime}
              </span>
            )}
          </div>
          <div>
            <Label>Cuisines</Label>
            <Input
              type="text"
              name="cuisines"
              value={input.cuisines.join(",")}
              onChange={(e) =>
                setInput({ ...input, cuisines: e.target.value.split(",") })
              }
              placeholder="e.g. Momos, Biryani"
            />
            {errors.cuisines && (
              <span className="text-xs text-red-600 font-medium">
                {errors.cuisines}
              </span>
            )}
          </div>
          <div>
            <Label>Upload Restaurant Banner</Label>
            <Input
              type="file"
              accept="image/*"
              name="imageFile"
              onChange={(e) =>
                setInput({
                  ...input,
                  imageFile: e.target.files?.[0] || undefined,
                })
              }
            />
            {errors.imageFile && (
              <span className="text-xs text-red-600 font-medium">
               Image needed
              </span>
            )}
          </div>
        </div>
        <div className="my-5 w-fit">
        <Button
    type="submit"
    className="bg-orange hover:bg-hoverOrange"
    
>
    { restaurant ? (
        "Update Your Restaurant"
    ) : (
        "Add Your Restaurant"
    )}
</Button>

        </div>
      </form>
    </div>
  );
};

export default Restaurant;