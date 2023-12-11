import React, { useEffect, useState } from 'react';

const App = () => {
  const [repositories, setRepositories] = useState([]);
  const [visibleRepositories, setVisibleRepositories] = useState([]);
  const [loadedRepositories, setLoadedRepositories] = useState(10);

  useEffect(() => {
    fetch('https://api.github.com/users/{username}/repos')
      .then((response) => response.json())
      .then((data) => {
        setRepositories(data);
        setVisibleRepositories(data.slice(0, loadedRepositories));
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const loadMoreRepositories = () => {
    const newLoadedRepositories = loadedRepositories + 10;
    setVisibleRepositories(repositories.slice(0, newLoadedRepositories));
    setLoadedRepositories(newLoadedRepositories);
  };

  const getCommitMessages = (owner, repo) => {
    fetch(`https://api.github.com/repos/${owner}/${repo}/commits`)
      .then((response) => response.json())
      .then((data) => {
        const commitMessages = data
          .slice(0, 3)
          .map((commit) => commit.commit.message);
        console.log(commitMessages);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <h2>Repositories</h2>
      <ul>
        {visibleRepositories.map((repo) => (
          <li key={repo.id}>
            {repo.name}
            <button
              onClick={() => getCommitMessages(repo.owner.login, repo.name)}
            >
              Show Last 3 Commits
            </button>
          </li>
        ))}
      </ul>
      {loadedRepositories < repositories.length && (
        <button onClick={loadMoreRepositories}>Load More</button>
      )}
    </div>
  );
};

export default App;
