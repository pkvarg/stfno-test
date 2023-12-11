import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

  const [userId, setUserId] = useState('');

  const [repositories, setRepositories] = useState([]);
  const [visibleRepositories, setVisibleRepositories] = useState([]);
  const [loadedRepositories, setLoadedRepositories] = useState(10);

  const loadMoreRepositories = () => {
    const newLoadedRepositories = loadedRepositories + 10;
    setVisibleRepositories(repositories.slice(0, newLoadedRepositories));
    setLoadedRepositories(newLoadedRepositories);
  };

  const headers = {
    Accept: 'application/vnd.github.v3+json',
    Authorization: `token ${GITHUB_TOKEN}`,
  };

  useEffect(() => {
    repositories.forEach((repo) => {
      fetch(`https://api.github.com/repos/${userId}/${repo.name}/commits`, {
        headers,
      })
        .then((response) => response.json())
        .then((data) => {
          const commitMessages = data
            .slice(0, 3)
            .map((commit) => commit.commit.message);
          repo.commitMessages = commitMessages; // Store commit messages in the repository object
          setRepositories((prevRepos) => [...prevRepos]);
        })
        .catch((error) => {
          console.error(error);
        });
    });
  }, [repositories]);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const getRepos = async () => {
        const res = await axios.get(
          `https://api.github.com/users/${userId}/repos`,
          {
            headers,
          },
        );
        setRepositories(res.data);
        setVisibleRepositories(res.data.slice(0, loadedRepositories));
      };
      getRepos();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center border-[25px] border-[#00b92f] text-zinc-900">
      <div className="w-[100%] border-2 border-[#ffffff]  bg-slate-50 px-16 py-8">
        <form
          onSubmit={handleSubmit}
          className="flex flex-row justify-center gap-4 border-2 py-4"
        >
          <input
            type="text"
            placeholder="Enter GitHub User"
            className="pl-2"
            value={userId}
            required
            onChange={(e) => setUserId(e.target.value)}
          />
          <button type="submit" className="bg-blue-500 p-2 text-[#ffffff]">
            Submit
          </button>
        </form>
        <div className="mx-2 mt-2 flex flex-row justify-center text-[#000000]">
          <div>
            <div className="flex flex-row justify-between gap-24 border-b-2 border-[#000000]">
              <p className="font-bold">Repository</p>
              <p className="font-bold">Commits</p>
            </div>

            <ul>
              {visibleRepositories.map((repo) => (
                <li
                  key={repo.id}
                  className="flex justify-between border-b-2 border-[#000000]"
                >
                  {repo.name}
                  <ul className="text-right">
                    {repo.commitMessages &&
                      repo.commitMessages.map((message, index) => (
                        <li className="ml-24" key={index}>
                          {message}
                        </li>
                      ))}
                  </ul>
                </li>
              ))}
            </ul>
            {loadedRepositories < repositories.length && (
              <button
                className="my-3 cursor-pointer bg-blue-500 p-1 text-white"
                onClick={loadMoreRepositories}
              >
                Show More
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
