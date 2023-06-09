import FishPicture from "./assets/fish-background.jpg";
import useToken from "@galvanize-inc/jwtdown-for-react";
import { useState, useEffect } from "react";
import Typed from "react-typed";
import { LoggedNav } from "./NavLog/LoggedNav";
import { Link, useNavigate } from "react-router-dom";

export default function PostList() {
  const { token } = useToken();
  const [user, setUser] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  async function isImageURL(url) {
    const urlRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/gi;
    return urlRegex.test(url);
  }

  if (!token) {
    navigate("/login");
  }

  useEffect(() => {
    async function fetchPosts() {
      const response = await fetch(
        `${process.env.REACT_APP_USER_SERVICE_API_HOST}/api/posts`,
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    }
    fetchPosts();
  }, []);

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
    fetchUser();
  }, [token]);

  const fetchAllUsers = async () => {
    const url = `${process.env.REACT_APP_USER_SERVICE_API_HOST}/api/users`;
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      setUsers(data);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <>
      <LoggedNav />
      <div
        className="bg-center bg-cover bg-no-repeat w-full mt-[-80px] pt-[80px]"
        style={{
          backgroundImage: `url(${FishPicture})`,
          backgroundAttachment: "fixed",
        }}
      >
        <div className="bg-black bg-opacity-40 forum-item justify-center items-center">
          <h1 className="bg-black bg-opacity-40 text-center flex justify-center text-white p-60 lg:text-6xl md:text-6xl sm:text-5xl text-4xl font-bold mx-auto">
            COMMUNITY FORUM
          </h1>
        </div>
        <div className="bg-white p-4 md:p-14 mx-auto justify-center items-center">
          <h2 className="pt-2 text-2xl md:text-3xl lg:text-4xl font-bold text-center">
            EXPLORE THE LATEST POSTS CONTRIBUTED BY THE COMMUNITY
          </h2>
          <div className="p-6 md:p-10 mx-auto justify-center items-center flex flex-col sm:flex-row md:flex-row">
            <p className="text-lg md:text-2xl text-hooked font-bold py-2 xl:ml-40 lg:ml-15 md:ml-5 sm:ml-5 md:py-4 md:mr-5 flex sm:flex-row md:flex-row">
              Join our community today and share your latest fishing adventure
              with other enthusiasts! Not only can you inspire others to explore
              new fishing spots, but you can also gain inspiration from other
              members and enhance your own fishing experience
            </p>
            <img
              src="https://st2.depositphotos.com/3903847/5566/v/600/depositphotos_55666937-stock-illustration-fisherman-catching-the-big-one.jpg"
              className="lg:h-70 md:h-60 h-48 lg:w-110 md:w-80 sm:w-60 xs:w-50 px-4 md:px-0 mr-10"
              alt=""
            />
          </div>
        </div>
        {posts.length === 0 ? (
          <>
            <div className="bg-[#5584AC] bg-opacity-80 font-bold text-white p-8 sm:p-10 md:p-14 lg:p-16 text-lg md:text-2xl text-center">
              <h2> BE THE FIRST TO SHARE YOUR FISHING ADVENTURE!</h2>
            </div>
            <div className="justify-center p-20 bg-black bg-opacity-80 text-xl text-white font-semibold text-center">
              <i>
                No posts available.
                <br />
                Be the first to contribute!
              </i>
            </div>
          </>
        ) : (
          <>
            <div className="bg-[#5584AC] bg-opacity-80 font-bold text-white p-8 sm:p-10 md:p-14 lg:p-16 text-lg md:text-2xl text-center">
              <h2> EXPLORE THE NEWEST ADVENTURES FROM THE HOOKED COMMUNITY</h2>
            </div>
            <div className="flex flex-wrap justify-center lg:p-20 md:p-10 sm:p-5 p-5 items-center gap-5 bg-black bg-opacity-80">
              {posts.map((post) => {
                return (
                  <div
                    className="bg-white rounded-xl shadow-lg m-5 p-5 w-96"
                    key={post.id}
                  >
                    <div className="text-center font-bold px-2 py-2 bg-[#22577E] bg-opacity-80 text-white text-xl">
                      {post.fish}
                    </div>
                    <div className="relative h-64 bg-[#C4DDFF] text-center font-bold items-center mx-auto my-auto">
                      {!post.picture_url ||
                      (!post.picture_url.match(/\.(jpeg|jpg|gif|png)$/) &&
                        !isImageURL(post.picture_url)) ? (
                        <div className="flex justify-center items-center h-full">
                          <span className="text-3xl p-2 font-bold text-gray-500">
                            No picture available
                          </span>
                        </div>
                      ) : (
                        <img
                          src={post.picture_url}
                          alt=""
                          className="w-full h-full object-cover p-5"
                        />
                      )}
                    </div>
                    <div className="font-bold mt-2">
                      Location: {post.location}
                    </div>
                    <div className="font-bold mt-2">Fish: {post.fish}</div>
                    <div className="font-bold mt-2 overflow-wrap">
                      Description: {post.description}
                    </div>
                    <p className="font-bold mt-2" key={user}>
                      Posted by:{" "}
                      {users.find((user) => user.id === post.user_id)?.name}
                    </p>
                    <div className="font-bold mt-2">
                      Posted on: {post.created_at}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
        <div className="bg-[#5584AC] bg-opacity-80 flex flex-col justify-center items-center p-20 text-gray-100 mx-auto">
          <h2 className="text-4xl font-bold mb-6 text-white text-center">
            CONTRIBUTE TO THE FORUM
          </h2>
          <p className="font-semibold text-2xl animate-typewriter">
            Share your personal&nbsp;
            <Typed
              className="text-2xl font-semi text-[#00df9a]"
              strings={["story", "adventure", "catch"]}
              typeSpeed={60}
              backSpeed={80}
              loop
            />
          </p>
          <Link
            to="/forum/new"
            className="bg-yellow-400 text-gray-800 font-bold py-4 px-4 my-4 rounded-full hover:bg-yellow-500 transition duration-300 ease-in-out"
          >
            NEW +
          </Link>
        </div>
      </div>
    </>
  );
}
