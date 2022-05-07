import { createContext, useReducer } from "react";
import githubReducer from "./GithubReducer";

const GithubContext = createContext();

const GITHUB_URL = process.env.REACT_APP_GITHUB_URL;
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

export const GithubProvider = ({ children }) => {
  const initialState = {
    users: [],
    user: {},
    repos: [],
    loading: false,
  };

  const [state, dispatch] = useReducer(githubReducer, initialState);

  //! Search Users
  const searchUsers = async (text) => {
    setLoading();
    const params = new URLSearchParams({
      q: text,
    });

    const response = await fetch(
      `${GITHUB_URL}/search/users?${params}`
      // , {
      //   headers: {
      //     Authorization: `token ${GITHUB_TOKEN}`,
      //   },
      // }
    );

    //? since data have lots of thing and we need search results which inside items
    const { items } = await response.json();

    dispatch({
      type: "GET_USERS",
      payload: items,
    });
  };

  //! get single user
  const getUser = async (username) => {
    setLoading();
    const response = await fetch(`${GITHUB_URL}/users/${username}`);

    if (response.status === 404) {
      window.location = "/notfound";
    } else {
      const data = await response.json();
      // console.log(data);
      dispatch({
        type: "GET_USER",
        payload: data,
      });
    }
  };

  //! get  user repos
  const getUserRepos = async (username) => {
    setLoading();
    const params = new URLSearchParams({
      sort: "created",
      per_page: 10,
    });
    const response = await fetch(
      `${GITHUB_URL}/users/${username}/repos?${params}`
    );

    if (response.status === 404) {
      window.location = "/notfound";
    } else {
      const data = await response.json();
      // console.log(data);
      dispatch({
        type: "GET_REPOS",
        payload: data,
      });
    }
  };

  //* Clear Users
  function clearUsers() {
    dispatch({ type: "CLEAR_USERS" });
  }

  //* Loading = true
  function setLoading() {
    dispatch({ type: "SET_LOADING" });
  }

  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        loading: state.loading,
        user: state.user,
        repos: state.repos,
        searchUsers,
        clearUsers,
        getUser,
        getUserRepos,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export default GithubContext;
