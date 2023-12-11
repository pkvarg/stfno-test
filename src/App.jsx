import { useState, useEffect } from 'react';
import viteLogo from '/vite.svg';
import axios from 'axios';

function App() {
  const GITHUB_URL = import.meta.env.VITE_GITHUB_URL;
  const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

  const [userId, setUserId] = useState('pkvarg');

  const [repositories, setRepositories] = useState([]);
  const [visibleRepositories, setVisibleRepositories] = useState([]);
  const [loadedRepositories, setLoadedRepositories] = useState(10);

  const headers = {
    Accept: 'application/vnd.github.v3+json',
    Authorization: `token ${GITHUB_TOKEN}`,
  };

  useEffect(() => {
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
  }, []);

  const loadMoreRepositories = () => {
    const newLoadedRepositories = loadedRepositories + 10;
    setVisibleRepositories(repositories.slice(0, newLoadedRepositories));
    setLoadedRepositories(newLoadedRepositories);
  };

  // const getCommitMessages = async (repoName) => {
  //   const res = await axios.get(
  //     `https://api.github.com/repos/${userId}/${repoName}/commits`,
  //     {
  //       headers,
  //     },
  //   );
  //   if (res) {
  //     const commitMessages = res.data
  //       .slice(0, 3)
  //       .map((commit) => commit.commit.message);
  //     return commitMessages;
  //     console.log('msgs', commitMessages);
  //   }
  // };

  useEffect(() => {
    repositories.forEach((repo) => {
      fetch(`https://api.github.com/repos/${userId}/${repo.name}/commits`)
        .then((response) => response.json())
        .then((data) => {
          const commitMessages = data
            .slice(0, 3)
            .map((commit) => commit.commit.message);
          repo.commitMessages = commitMessages; // Store commit messages in the repository object
          setRepositories((prevRepos) => [...prevRepos]); // Update the repositories state to trigger a re-render
        })
        .catch((error) => {
          console.error(error);
        });
    });
  }, [repositories]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const headers = {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${GITHUB_TOKEN}`,
    };

    // const getCommits = async (repoName) => {
    //   const repoCommits = await axios.get(
    //     `https://api.github.com/repos/${userId}/${repoName}/commits`,

    //     {
    //       owner: `${userId}`,
    //       repo: `${repoName}`,
    //       headers: {
    //         'X-GitHub-Api-Version': '2022-11-28',
    //         Authorization: `token ${GITHUB_TOKEN}`,
    //       },
    //     },
    //   );
    //   return setCommits(repoCommits);
    // };
  };

  return (
    <div className="flex h-screen justify-center bg-[#00b92f] text-zinc-900">
      <div className="mx-16 mt-8 w-[100%] border-2 border-[#ffffff] bg-slate-50">
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
            onChange={(e) => setuserId(e.target.value)}
          />
          <button type="submit" className="bg-blue-500 p-2 text-[#ffffff]">
            Submit
          </button>
        </form>
        <div className="mt- mx-2 flex flex-row justify-center  gap-16 text-[#000000]">
          <div>
            <p className="font-bold">Repository</p>

            <ul>
              {visibleRepositories.map((repo) => (
                <li key={repo.id}>
                  {repo.name}
                  <ul className="ml-16">
                    {repo.commitMessages &&
                      repo.commitMessages.map((message, index) => (
                        <li key={index}>{message}</li>
                      ))}
                  </ul>
                </li>
              ))}
            </ul>
            {loadedRepositories < repositories.length && (
              <button onClick={loadMoreRepositories}>Load More</button>
            )}
          </div>
          <div>
            <p className="font-bold">Commits</p>
            {/* {commits !== undefined &&
              commits?.data?.map((commit) => (
                <div key={commit.sha}>
                  <p>{commit.commit.message}</p>
                </div>
              ))} */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
