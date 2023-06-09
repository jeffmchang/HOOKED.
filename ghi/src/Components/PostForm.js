import Fishermanpostform from "./assets/test.png";
import { useState, useEffect } from "react";
import useToken from "@galvanize-inc/jwtdown-for-react";
import { useNavigate } from "react-router-dom";
import { LoggedNav } from "./NavLog/LoggedNav";

function PostForm() {
  const { token } = useToken();
  const [user_id, setUser] = useState("");
  const [locations, setLocations] = useState([]);
  const [location, setLocation] = useState("");
  const [fishes, setFishs] = useState([]);
  const [fish, setFish] = useState("");
  const [picture_url, setPhotoURL] = useState("");
  const [description, setDescription] = useState("");
  const [created_at, setCreatedAt] = useState(new Date().toISOString().split('T')[0]);

  const handleLocationChange = (event) => setLocation(event.target.value);
  const handleFishChange = (event) => setFish(event.target.value);
  const handleDescriptionChange = (event) => setDescription(event.target.value);
  const handlePhotoURLChange = (event) => setPhotoURL(event.target.value);
  const handleCreatedChange = (event) => setCreatedAt(event.target.value);
  const navigate = useNavigate();

  if (!token) {
    navigate("/login");
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {};
    data.user_id = user_id.id;
    data.location = location;
    data.fish = fish;
    data.picture_url = picture_url;
    data.description = description;
    data.created_at = created_at;

    const postFormURL = `${process.env.REACT_APP_USER_SERVICE_API_HOST}/api/posts`;
    const fetchConfig = {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(postFormURL, fetchConfig);
    if (response.ok) {
      navigate("/Forum");
    }
  };

  const fetchLocation = async () => {
    const url = `${process.env.REACT_APP_USER_SERVICE_API_HOST}/api/locations`;
    const response = await fetch(
      url,
      {
        credentials: "include"
      }
    );
    if (response.ok) {
      const data = await response.json();
      setLocations(data);
    }
  };

  const fetchFish = async () => {
    const url = `${process.env.REACT_APP_USER_SERVICE_API_HOST}/api/fish`;
    const response = await fetch(
      url,
      {
        credentials: "include"
      }
    );
    if (response.ok) {
      const data = await response.json();
      setFishs(data);
    }
  };

  const fetchUser = async () => {
    const url = `${process.env.REACT_APP_USER_SERVICE_API_HOST}/token`;
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      setUser(data.account);
    }
  };

  useEffect(() => {
    fetchLocation();
    fetchFish();
    fetchUser();
  }, [token]);
  return (
    <>
      <LoggedNav />
      <div
        className="bg-cover forum-container bg-no-repeat bg-fixed mt-[-80px] pt-[80px] md:pt-40 lg:pt-60 pb-20 md:pb-40 lg:pb-60 px-4 sm:px-8 lg:px-40 mx-auto my-auto"
        style={{
          backgroundImage: `url(${Fishermanpostform})`,
          backgroundAttachment: "fixed",
          backgroundSize: "65%",
          backgroundPosition: "center",
          backgroundColor: "gray",
        }}
      >
        <div className="bg-black bg-opacity-70 h-290 flex justify-center items-center p-10 mx-auto my-[-80px] pt-8 pb-4 mt-[-20px] mb-[-20px] max-w-screen-sm">
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-md lg:max-w-lg w-full mx-auto">
            <h1 className="text-center font-bold my-4 lg:text-3xl md:text-2xl sm:text-xl text-lg">
              Share Your Story,{" "}
              {user_id &&
                user_id.name.charAt(0).toUpperCase() + user_id.name.slice(1)}
            </h1>
            <form
              onSubmit={handleSubmit}
              id="new-post"
              className="mx-auto my-auto p-2"
            >
              <div className="my-4">
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="location"
                >
                  Location
                </label>
                <select
                  className="form-select file:shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  onChange={handleLocationChange}
                  id="location"
                  required
                  name="location"
                  value={location}
                >
                  <option value="">Select a location</option>
                  {locations &&
                    locations.map((location) => {
                      return (
                        <option key={location.id} value={location.name}>
                          {location.name}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div className="my-4">
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="email"
                >
                  Fish
                </label>
                <select
                  className="form-select file:shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  onChange={handleFishChange}
                  id="fish"
                  required
                  name="fish"
                  value={fish}
                >
                  <option value="">Select a fish</option>
                  {fishes &&
                    fishes.map((fish) => {
                      return (
                        <option key={fish.id} value={fish.name}>
                          {fish.name}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div className="my-6">
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="password"
                >
                  Picture
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  onChange={handlePhotoURLChange}
                  placeholder="Share a photo"
                  required
                  type="text"
                  name="picture_url"
                  value={picture_url}
                  id="picture_url"
                />
              </div>
              <div className="my-6">
                <label className="block text-gray-700 font-bold mb-2">
                  Description
                </label>
              </div>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={handleDescriptionChange}
                placeholder="Tell us about it"
                required
                type="text"
                name="description"
                value={description}
              />
              <div className="my-6">
                <label className="block text-gray-700 font-bold mb-2">
                  Caught on
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  onChange={handleCreatedChange}
                  placeholder="created_at"
                  required
                  type="date"
                  name="created_at"
                  value={created_at}
                />
              </div>
              <div>
                <div className="flex justify-center">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white my-3 font-bold py-2 px-5 rounded focus:outline-none focus:shadow-outline mx-auto"
                    type="submit"
                  >
                    Share
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default PostForm;
